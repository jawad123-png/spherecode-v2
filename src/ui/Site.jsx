import { useEffect, useState, useRef } from 'react'
import HeroDashboard, { HeroOps, HeroDesk } from '../scene/HeroDashboard.jsx'
import { DIVISIONS, BY_KEY } from './divisions.jsx'

const FORM = 'https://formspree.io/f/xjglrypl'

/* Vite rewrites asset URLs in index.html but NOT string literals in JS, so any
   /images/... path has to be joined to the deploy base by hand or it 404s
   wherever the site is not served from the domain root. */
const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\//, '')

/* Hero headline — one line per division. The active division's line lights up
   in that division's accent; the other two drop back. */
const HERO_LINES = ['WE BUILD IT.', 'WE RUN IT.', 'we staff it.']

/* ---------------------------------------------------------------------
   Shared work + reviews.
   NOTE: every item below is from the web division. BPO and VA case
   studies / testimonials go here once there are real ones to show —
   do not invent them, the section header already says which division
   the work belongs to.
   --------------------------------------------------------------------- */
const WORKS = [
  { t: 'Surkhab Store', tag: 'E-Commerce · Shopify', d: 'A clean, conversion-focused Shopify storefront built for fast browsing and seamless checkout.', href: 'https://surkhab.store', label: 'surkhab.store', img: asset('images/thumb-surkhab.png') },
  { t: 'FAHHM Engineering', tag: 'Web Design · Construction', d: 'An architecture & construction consultancy — a bold corporate site turning blueprints into an enduring brand presence.', href: 'https://fahhm.co', label: 'fahhm.co', img: asset('images/thumb-fahhm.png') },
  { t: 'Lumière Studio', tag: 'Web Design · Clinic', d: "Marylebone's premier aesthetics clinic — a refined, trust-first site designed to convert consultations into clients.", href: 'https://lumierestudio13.netlify.app', label: 'lumierestudio13.netlify.app', img: asset('images/thumb-lumiere.png') },
  { t: 'Clinic Management System', tag: 'Web App · Healthcare', d: 'A full practice-management system for a private clinic — patient queue, records, recalls, operations, inventory, expenses and revenue reporting, with automatic hourly backups.', private: true, label: 'Private · Internal system', img: asset('images/thumb-clinic.png') },
]

const TESTIMONIALS = [
  { q: 'Our online bookings doubled within the first month of the new site going live. The design is stunning and the team was a pleasure to work with.', n: 'Mia Thompson', r: 'Owner, Velvet Hair Studio' },
  { q: 'They migrated our entire WooCommerce store to Shopify in under a week with zero data loss. Revenue went up 30% in the first quarter.', n: 'James Okafor', r: 'Founder, Brew & Grind Coffee' },
  { q: 'Professional, fast, and actually understood what a medical practice needs. Our patient inquiry forms and booking system work flawlessly.', n: 'Dr. Sarah Chen', r: 'Director, ClearSkin Dermatology' },
]

/* contact-form "what do you need" options, per division */
const ENQUIRY = {
  web: ['E-Commerce Store', 'Shopify Store / Migration', 'Landing Page', 'Web App / Custom System', 'Brand & Design', 'SEO & Growth', 'Other'],
  bpo: ['Customer Support', 'Inbound / Outbound Sales', 'Back-Office & Data', 'Technical Helpdesk', 'Finance & Admin', 'QA & Reporting', 'Not sure yet'],
  va: ['Executive Assistant', 'Inbox & Calendar', 'Customer Service VA', 'Social Media & Content', 'Bookkeeping & Admin', 'Research & Lead Gen', 'Not sure yet'],
}

/* ===================== small helpers ===================== */

function rowGlow(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', e.clientX - r.left + 'px')
  e.currentTarget.style.setProperty('--my', e.clientY - r.top + 'px')
}

function useCountUp(target, run, dur = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf, start
    const step = (ts) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / dur)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, target, dur])
  return v
}

function HeroStat({ s, run }) {
  const n = useCountUp(s.n || 0, run && s.n != null)
  return (
    <div className="hstat">
      <span className="hstat-n">{s.n != null ? n + (s.suffix || '') : s.v}</span>
      <span className="hstat-l mono">{s.l}</span>
    </div>
  )
}

async function post(data) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.append(k, v))
  const res = await fetch(FORM, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('send failed')
}

/* ===================== division switcher ===================== */

function DivisionCard({ d, on, onPick }) {
  return (
    <button
      type="button"
      className={'divc reveal' + (on ? ' on' : '')}
      style={{ '--dc': d.accRgb }}
      aria-pressed={on}
      onClick={() => onPick(d.key)}
    >
      <span className="divc-top">
        <span className="divc-code">{d.code}</span>
        <span className="divc-state">{on ? 'Selected' : 'Select'}</span>
      </span>
      <span className="glyphbox divc-glyph">{d.glyph}</span>
      <span className="divc-verb">{d.verb}</span>
      <span className="divc-name">{d.name}</span>
      <span className="divc-blurb">{d.blurb}</span>
      <span className="divc-foot">{on ? 'Shown below' : 'See this division'} <i>→</i></span>
    </button>
  )
}

/* ---- hero division tabs ----
   The switcher now lives in the hero so the page morphs where the visitor is
   actually looking, and all three divisions are advertised before any scroll. */
function DivTabs({ active, cycling, onPick }) {
  return (
    <div className="dtabs" role="tablist" aria-label="Choose a division">
      {DIVISIONS.map((x) => {
        const on = x.key === active
        return (
          <button
            key={x.key} type="button" role="tab" aria-selected={on}
            className={'dtab' + (on ? ' on' : '')}
            style={{ '--dt': x.accRgb, '--dc': x.accRgb }}
            onClick={() => onPick(x.key)}
          >
            <span className="glyphbox dt-glyph">{x.glyph}</span>
            <span className="dt-full">{x.name}</span>
            <span className="dt-short">{x.short}</span>
            <span className="dt-state">{on ? 'Selected' : 'Select'}</span>
            {on && cycling && <span className="dt-prog" key={active} />}
          </button>
        )
      })}
    </div>
  )
}

/* ===================== deep-dive visuals ===================== */

function StoreVisual() {
  return (
    <div className="split-visual reveal" aria-hidden="true">
      <div className="sv-bar"><span /><span /><span /></div>
      <div className="sv-nav" /><div className="sv-hero" />
      <div className="sv-grid"><div /><div /><div /></div>
      <div className="sv-badge">Shopify</div>
    </div>
  )
}

/* BPO — a pod of seats with live meters. VA — a matching shortlist. */
function PodVisual({ kind }) {
  const bpo = kind === 'pod'
  const seats = bpo ? 12 : 6
  const lit = bpo ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2]
  return (
    <div className="pod reveal" aria-hidden="true">
      <div className="pod-bar">
        <span className="pd" />
        <em>{bpo ? 'Pod 04 · live floor' : 'Shortlist · matched to you'}</em>
      </div>
      <div className="pod-seats">
        {Array.from({ length: seats }).map((_, i) => (
          <span className={'seat' + (lit.includes(i) ? ' on' : '')} key={i} />
        ))}
      </div>
      <div className="pod-rows">
        {(bpo
          ? [['Agents on shift', '10 / 12', 83], ['SLA met today', '99.2%', 99], ['Avg response', '41s', 72]]
          : [['Tools matched', '6 / 6', 100], ['Time-zone overlap', '5 hrs', 83], ['Candidates ready', '3', 100]]
        ).map(([l, v, w]) => (
          <div key={l}>
            <div className="pod-row"><span>{l}</span><b>{v}</b></div>
            <div className="pod-meter"><i style={{ '--w': w + '%' }} /></div>
          </div>
        ))}
      </div>
      <div className="pod-badge">{bpo ? 'Dedicated' : '72h match'}</div>
    </div>
  )
}

/* ===================== lead magnets ===================== */

/* ---- Web: site audit ----
   The checks are *queued*, not scored in the browser: a real Lighthouse /
   PageSpeed score cannot be measured cross-origin from a static page, and
   showing an invented number to a prospect would be dishonest.
   TO MAKE IT A LIVE SCORE: add a PageSpeed Insights API key and call
   https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=…&key=…
   from a tiny serverless function, then render the real numbers here. */
const CHECKS = ['Resolving host', 'Load speed · mobile + desktop', 'Mobile layout & tap targets', 'On-page SEO & metadata', 'Conversion blockers']

function AuditMagnet({ d }) {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [st, setSt] = useState('idle')   // idle | scan | email | sent
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (st !== 'scan') return
    let i = 0
    const id = setInterval(() => {
      i++
      setStep(i)
      if (i >= CHECKS.length) { clearInterval(id); setSt('email') }
    }, 520)
    return () => clearInterval(id)
  }, [st])

  const run = (e) => {
    e.preventDefault()
    if (!url.trim()) { setErr('Enter your website address first.'); return }
    setErr(''); setStep(0); setSt('scan')
  }

  const send = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setErr('We need an email to send the report to.'); return }
    setErr('')
    try {
      await post({
        _subject: 'SITE AUDIT request — ' + url,
        division: d.name, lead_magnet: 'Free Site Audit', website: url, email,
      })
      setSt('sent')
    } catch { setErr('Could not send — please email contact@spherecode.dev instead.') }
  }

  return (
    <div className="lm-box">
      <div className="lm-box-h mono">{d.lead.boxH}</div>

      {st === 'sent' ? (
        <div className="lm-ok">
          <i>✓</i>
          <p><b>Audit queued for {url}.</b><br />Your report lands at {email} within 24 hours — written by a person, not a generated score.</p>
        </div>
      ) : (
        <>
          <form className="lm-row" onSubmit={run}>
            <input
              aria-label="Your website address" placeholder="yourbusiness.com" value={url}
              onChange={(e) => setUrl(e.target.value)} disabled={st !== 'idle'} autoComplete="url"
            />
            <button type="submit" className="btn btn--primary" disabled={st !== 'idle'}>
              {st === 'idle' ? 'Run Audit →' : 'Running…'}
            </button>
          </form>

          {st !== 'idle' && (
            <div className="scan">
              {CHECKS.map((c, i) => (
                <div className={'scan-line' + (i < step + 1 ? ' in' : '') + (i < step ? ' done' : '')} key={c}>
                  <span className="sl-i mono">{i < step ? '✓' : <span className="spin" />}</span>
                  <span>{c}</span>
                  <span className="sl-s">{i < step ? 'Queued' : 'Checking'}</span>
                </div>
              ))}
            </div>
          )}

          {st === 'email' && (
            <form className="lm-row" style={{ marginTop: 18 }} onSubmit={send}>
              <input
                type="email" aria-label="Your email" placeholder="you@yourbusiness.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email" required
              />
              <button type="submit" className="btn btn--primary">Get Report →</button>
            </form>
          )}

          {err && <div className="lm-err">{err}</div>}
        </>
      )}
    </div>
  )
}

/* ---- BPO / VA: short application form ---- */
function ApplyMagnet({ d }) {
  const [st, setSt] = useState('idle')
  const [err, setErr] = useState('')

  const send = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setSt('busy'); setErr('')
    try {
      await post({
        _subject: d.lead.label.toUpperCase() + ' request — ' + (f.get('company') || ''),
        division: d.name, lead_magnet: d.lead.label,
        ...Object.fromEntries(f.entries()),
      })
      setSt('sent')
    } catch { setSt('idle'); setErr('Could not send — please email contact@spherecode.dev instead.') }
  }

  if (st === 'sent') {
    return (
      <div className="lm-box">
        <div className="lm-box-h mono">{d.lead.boxH}</div>
        <div className="lm-ok"><i>✓</i><p><b>{d.lead.okTitle}</b><br />{d.lead.okBody}</p></div>
      </div>
    )
  }

  return (
    <div className="lm-box">
      <div className="lm-box-h mono">{d.lead.boxH}</div>
      <form className="cform" style={{ border: 0, background: 'none', padding: 0 }} onSubmit={send}>
        <div className="frow2">
          <div className="fg"><label htmlFor="lm-name">Name *</label><input id="lm-name" name="name" placeholder="Jane Smith" required /></div>
          <div className="fg"><label htmlFor="lm-email">Email *</label><input id="lm-email" name="email" type="email" placeholder="jane@company.com" required /></div>
        </div>
        {d.lead.fields.map((f) => (
          <div className="fg" key={f.k}>
            <label htmlFor={'lm-' + f.k}>{f.l}{f.req ? ' *' : ''}</label>
            {f.area
              ? <textarea id={'lm-' + f.k} name={f.k} rows="3" placeholder={f.ph} required={f.req} />
              : <input id={'lm-' + f.k} name={f.k} placeholder={f.ph} required={f.req} />}
          </div>
        ))}
        <button type="submit" className="btn btn--primary btn--full" disabled={st === 'busy'}>
          {st === 'busy' ? 'Sending…' : d.lead.btn}
        </button>
        {err && <div className="lm-err">{err}</div>}
      </form>
    </div>
  )
}

/* ===================== clinic mockup (portfolio card) ===================== */

function ClinicMock() {
  return (
    <div className="clinic" aria-hidden="true">
      <aside className="cl-side">
        <div className="cl-logo">✚ Gynae<b>Care</b></div>
        <nav className="cl-nav"><span className="on">Dashboard</span><span>Appointments</span><span>Patients</span><span>Billing</span><span>Reports</span></nav>
      </aside>
      <div className="cl-main">
        <div className="cl-top"><span className="cl-h">Today · Overview</span><span className="cl-date">Mon · 14 Jul</span></div>
        <div className="cl-stats">
          <div className="cl-stat"><b>18</b><em>Appointments</em></div>
          <div className="cl-stat"><b>7</b><em>New patients</em></div>
          <div className="cl-stat"><b>3</b><em>Pending</em></div>
        </div>
        <div className="cl-appts">
          <div className="cl-row cl-head"><span>Time</span><span>Patient</span><span>Type</span><span>Status</span></div>
          <div className="cl-row"><span>09:00</span><span>Patient A</span><span>Consult</span><span className="ok">Done</span></div>
          <div className="cl-row"><span>10:30</span><span>Patient B</span><span>Ultrasound</span><span className="now">In room</span></div>
          <div className="cl-row"><span>11:15</span><span>Patient C</span><span>Follow-up</span><span className="wait">Waiting</span></div>
          <div className="cl-row"><span>12:00</span><span>Patient D</span><span>ANC visit</span><span className="wait">Waiting</span></div>
        </div>
      </div>
    </div>
  )
}

/* ===================== the page ===================== */

export default function Site() {
  const [active, setActive] = useState('web')
  const [typed, setTyped] = useState('')
  const [live, setLive] = useState(false)
  const [menu, setMenu] = useState(false)
  const [rail, setRail] = useState(false)
  const [picked, setPicked] = useState(false)   // visitor chose a division themselves
  const [heroIn, setHeroIn] = useState(true)    // hero still on screen
  const heroRef = useRef(null)

  /* The hero cycles through the three divisions on its own so a visitor who
     never touches anything still sees all three. It stops for good the moment
     they pick one, and pauses once they have scrolled past the hero so nothing
     swaps underneath them while they are reading. */
  const cycling = !picked && heroIn

  const d = BY_KEY[active]
  const NAV = [['Divisions', '#divisions'], ['Services', '#services'], ['Process', '#process'], ['Pricing', '#pricing'], [d.lead.nav, '#offer']]

  /* paint the active division's accent onto the whole document */
  useEffect(() => {
    const s = document.documentElement.style
    s.setProperty('--acc-rgb', d.accRgb)
    s.setProperty('--acc2-rgb', d.acc2Rgb)
  }, [d])

  /* switching division: scroll to the top of the swapped content and retype */
  const pick = (key) => {
    setPicked(true)
    if (key === active) {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setActive(key)
  }

  /* auto-cycle */
  useEffect(() => {
    if (!cycling) return
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const id = setTimeout(() => {
      const i = DIVISIONS.findIndex((x) => x.key === active)
      setActive(DIVISIONS[(i + 1) % DIVISIONS.length].key)
    }, 7000)
    return () => clearTimeout(id)
  }, [cycling, active])

  /* scroll reveals — re-queried after a division swap brings in new nodes */
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.14 },
    )
    const t = setTimeout(() => document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el)), 60)
    return () => { clearTimeout(t); io.disconnect() }
  }, [active])

  /* scroll-driven glow-up, progress bar, and the sticky division rail */
  useEffect(() => {
    let raf = 0
    const paint = () => {
      raf = 0
      const secs = document.querySelectorAll('.section, .cta-band')
      const vc = window.innerHeight / 2
      const reach = window.innerHeight * 0.72
      for (const s of secs) {
        const r = s.getBoundingClientRect()
        const g = Math.max(0, 1 - Math.abs(r.top + r.height / 2 - vc) / reach)
        s.style.setProperty('--glow', (g * g).toFixed(3))
      }
      const max = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--scrollp', max > 0 ? (window.scrollY / max).toFixed(4) : '0')

      // the division picker should follow you for the whole page, so it appears
      // the moment the hero (which holds the other picker) scrolls away
      const hero = document.getElementById('top')
      setRail(hero ? hero.getBoundingClientRect().bottom < 80 : false)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [active])

  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [menu])

  /* mobile/touch: light up whatever row is centred in the viewport */
  useEffect(() => {
    let raf = 0
    const isMobile = () => window.matchMedia('(max-width:760px)').matches || window.matchMedia('(hover:none)').matches
    const paint = () => {
      raf = 0
      const items = document.querySelectorAll('.cap-row, .frow, .folio')
      const vc = window.innerHeight / 2
      const band = window.innerHeight * 0.16
      const on = isMobile()
      for (const el of items) {
        const r = el.getBoundingClientRect()
        el.classList.toggle('active', on && Math.abs(r.top + r.height / 2 - vc) < band)
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [active])

  /* hero sub-line types itself out — and retypes on every division switch.
     Narrow screens get the short version so the hero stays one screen tall. */
  useEffect(() => {
    const narrow = window.matchMedia('(max-width:760px)').matches
    const text = (narrow && d.typedShort) || d.typed
    let i = 0, to
    setTyped('')
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { setTyped(text); return }
    const tick = () => { i++; setTyped(text.slice(0, i)); if (i < text.length) to = setTimeout(tick, 9) }
    const start = setTimeout(tick, 220)
    return () => { clearTimeout(start); clearTimeout(to) }
  }, [d, active])

  useEffect(() => {
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setLive(true); io.disconnect() } }, { threshold: 0.4 })
    if (heroRef.current) io.observe(heroRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((es) => setHeroIn(es[0].isIntersecting), { threshold: 0.35 })
    if (heroRef.current) io.observe(heroRef.current)
    return () => io.disconnect()
  }, [])

  /* section numbers stay sequential even though the deep-dive differs per division */
  let sn = 0
  const sec = () => '(' + String(++sn).padStart(2, '0') + ')'

  const Panel = d.panel === 'web' ? HeroDashboard : d.panel === 'ops' ? HeroOps : HeroDesk
  const mq = [...d.marquee, ...d.marquee]

  return (
    <div className="site" data-div={active}>
      <div className="progress" />
      <div className="frame"><i className="c tl" /><i className="c tr" /><i className="c bl" /><i className="c br" /></div>

      {/* NAV */}
      <header className="nav">
        <a href="#top" className="logo" onClick={() => setMenu(false)}>Sphere<span>Code</span><sup>®</sup></a>
        <div className="nav-mid mono">WEB&nbsp;·&nbsp;BPO&nbsp;·&nbsp;<b>VIRTUAL ASSISTANTS</b></div>
        <nav className="links mono">
          {NAV.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
          <a href="#contact" className="cta-link">Book a Free Call →</a>
        </nav>
        <button className={'burger' + (menu ? ' x' : '')} onClick={() => setMenu((m) => !m)} aria-label="Menu"><span /><span /><span /></button>
      </header>

      {/* MOBILE MENU */}
      <div className={'menu' + (menu ? ' open' : '')}>
        <div className="menu-inner">
          <nav className="menu-links">
            {NAV.map(([t, h], i) => (
              <a key={h} href={h} style={{ transitionDelay: (menu ? 0.08 + i * 0.05 : 0) + 's' }} onClick={() => setMenu(false)}>{t}</a>
            ))}
          </nav>
          <a href="#contact" className="btn btn--primary btn--full" onClick={() => setMenu(false)}>Book a Free Call →</a>
          <div className="menu-foot mono">contact@spherecode.dev · Remote-first · Worldwide</div>
        </div>
      </div>

      {/* HERO */}
      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-left">
            <DivTabs active={active} cycling={cycling} onPick={pick} />
            <h1 className="hero-h">
              {HERO_LINES.map((l, i) => (
                <button
                  key={l} type="button" aria-label={'Show ' + DIVISIONS[i].name}
                  className={(i === 2 ? 'ital ' : '') + (i === d.line ? 'lit' : '')}
                  onClick={() => pick(DIVISIONS[i].key)}
                >{l}</button>
              ))}
            </h1>
            <p className="hero-sub mono">{typed}<span className="care">▍</span></p>
            <div className="hero-ctas">
              <a href="#offer" className="btn btn--primary">{d.lead.nav} →</a>
              <a href="#divisions" className="btn">Explore Divisions</a>
            </div>
            <div className="hero-stats">
              {d.stats.map((s) => <HeroStat key={s.l} s={s} run={live} />)}
            </div>
          </div>
          <div className="hero-right"><Panel key={active} /></div>
        </div>
        <a href="#divisions" className="scroll-cue mono">↓ &nbsp;SCROLL</a>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-in" key={active}>
          {mq.map((m, i) => <span key={i} className="mq">{m}<i>✦</i></span>)}
        </div>
      </div>

      {/* DIVISIONS — the switcher */}
      <section className="section" id="divisions">
        <div className="sec-head mono"><span>{sec()}</span><span>Three Divisions, One Team</span></div>
        <div className="div-grid">
          {DIVISIONS.map((x) => <DivisionCard key={x.key} d={x} on={x.key === active} onPick={pick} />)}
        </div>
        <p className="price-note mono reveal" style={{ marginTop: 26, marginBottom: 0 }}>
          Switch division here or from the hero — every section below follows it.
        </p>
      </section>

      {/* WHY */}
      <section className="section" id="why">
        <div className="sec-head mono"><span>{sec()}</span><span>Why SphereCode · {d.short}</span></div>
        <div className="mani-grid swap" key={active + '-mani'}>
          <p className="mani-note mono reveal">{d.maniNote}</p>
          <h2 className="mani-big reveal">{d.maniBig}</h2>
          <p className="mani-note r mono reveal">{d.maniNoteR}</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="sec-head mono"><span>{sec()}</span><span>{d.servicesLabel}</span></div>
        <div className="cap-list swap" key={active + '-svc'}>
          {d.services.map((c, i) => (
            <a href="#contact" className="cap-row reveal" key={c.t} onMouseMove={rowGlow}>
              <span className="cap-i mono">0{i + 1}</span>
              <span className="cap-name">{c.t}{c.badge && <span className="badge">{c.badge}</span>}</span>
              <span className="cap-d">{c.d}</span>
              <span className="cap-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      {/* DEEP DIVE — Shopify / inside a pod / how matching works */}
      <section className="section" id="deep">
        <div className="sec-head mono"><span>{sec()}</span><span>{d.deep.label}</span></div>
        <div className="split swap" key={active + '-deep'}>
          <div className="reveal">
            <h2 className="split-big">{d.deep.big}</h2>
            <p className="split-lede">{d.deep.lede}</p>
            <div className="feat-list">
              {d.deep.feats.map((f) => (
                <div className="feat" key={f.t}><i>✦</i><div><strong>{f.t}</strong><p>{f.d}</p></div></div>
              ))}
            </div>
            <div style={{ marginTop: 30 }}><a href="#contact" className="btn btn--primary">{d.deep.cta}</a></div>
          </div>
          {d.deep.visual === 'store' ? <StoreVisual /> : <PodVisual kind={d.deep.visual} />}
        </div>
      </section>

      {/* PROCESS */}
      <section className="section" id="process">
        <div className="sec-head mono"><span>{sec()}</span><span>{d.processLabel}</span></div>
        <div className="swap" key={active + '-proc'}>
          <h2 className="forms-title reveal">{d.processTitle}</h2>
          <p className="forms-sub mono reveal">{d.processSub}</p>
          <div className="forms-table">
            {d.process.map((f, i) => (
              <div className="frow" key={f.n}>
                <span className="fr-i mono">P-0{i + 1}</span>
                <span className="fr-name">{f.n}</span>
                <span className="fr-d">{f.d}</span>
                <span className="fr-stat mono">{f.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="sec-head mono"><span>{sec()}</span><span>{d.pricing.mode === 'price' ? 'Transparent Pricing' : 'Scoped To You'}</span></div>
        <div className="swap" key={active + '-price'}>
          <p className="price-anchor reveal">{d.pricing.anchor}</p>
          <p className="price-note mono reveal">{d.pricing.note}</p>
          <div className="price-grid">
            {d.pricing.tiers.map((p) => (
              <div className={'pcard reveal' + (p.primary ? ' pcard--feat' : '') + (d.pricing.mode === 'quote' ? ' qcard' : '')} key={p.n}>
                {p.badge && <div className="pcard__badge">{p.badge}</div>}
                <h3>{p.n}</h3>
                <p className="pcard__desc">{p.d}</p>
                <div className="pcard__price">
                  {d.pricing.mode === 'price' ? (
                    <><span className="pcard__from">from</span><span className="pcard__amt">{p.from}</span></>
                  ) : (
                    <><span className="qcard-scope mono">{p.scope}</span><span className="qcard-size">{p.size}</span><span className="qcard-unit">{p.unit}</span></>
                  )}
                </div>
                <ul>{p.feat.map((f) => <li key={f}>{f}</li>)}</ul>
                <a href="#contact" className={'btn' + (p.primary ? ' btn--primary' : '')}>{p.cta}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEAD MAGNET */}
      <section className="section" id="offer">
        <div className="sec-head mono"><span>{sec()}</span><span>{d.lead.label}</span></div>
        <div className="lm swap" key={active + '-lm'}>
          <div className="lm-grid">
            <div className="reveal">
              <div className="lm-kicker mono"><span className="d" />{d.lead.kicker}</div>
              <h2 className="lm-h">{d.lead.h}</h2>
              <p className="lm-sub">{d.lead.sub}</p>
              <ul className="lm-list">{d.lead.list.map((l) => <li key={l}>{l}</li>)}</ul>
              <p className="lm-fine mono">{d.lead.fine}</p>
            </div>
            <div className="reveal">
              {d.lead.type === 'audit' ? <AuditMagnet d={d} /> : <ApplyMagnet d={d} />}
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="section" id="work">
        <div className="sec-head mono"><span>{sec()}</span><span>Selected Work · Web Division</span></div>
        {active !== 'web' && (
          <p className="price-note mono reveal">
            Work shown is from the web division. {d.short} case studies are shared on request — ask on your {d.lead.nav.toLowerCase()} call.
          </p>
        )}
        <div className="folio-grid">
          {WORKS.map((w) => {
            const inner = (
              <>
                <div className="folio-frame">
                  <div className="folio-bar"><span /><span /><span /><em className="mono">{w.label}</em></div>
                  {w.private && w.t.startsWith('Clinic')
                    ? <div className="folio-shot folio-shot--mock"><ClinicMock /></div>
                    : <div className="folio-shot" style={{ backgroundImage: `url(${w.img})` }} />}
                </div>
                <div className="folio-info">
                  <span className="folio-tag mono">{w.tag}</span>
                  <h4>{w.t}</h4>
                  <p>{w.d}</p>
                  <span className="folio-visit mono">{w.href ? 'Visit site ↗' : 'Private build — case study'}</span>
                </div>
              </>
            )
            return w.href
              ? <a className="folio reveal" key={w.t} href={w.href} target="_blank" rel="noopener">{inner}</a>
              : <div className="folio folio--private reveal" key={w.t}>{inner}</div>
          })}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="sec-head mono"><span>{sec()}</span><span>Client Reviews</span></div>
        <div className="tst-grid">
          {TESTIMONIALS.map((t) => (
            <div className="tst reveal" key={t.n}>
              <div className="tst-stars">★★★★★</div>
              <p>“{t.q}”</p>
              <div className="tst-author">
                <div className="tst-av" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--pink))' }} />
                <div><strong>{t.n}</strong><span>{t.r}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <h2 className="reveal">Ready to build<br />something great?</h2>
        <p className="reveal">Book a free 30-minute strategy call — web, BPO or virtual assistants. No pressure, no sales pitch, just honest advice on what your business actually needs.</p>
        <a href="#contact" className="btn btn--primary reveal">Book a Free Call →</a>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="sec-head mono"><span>{sec()}</span><span>Contact Us</span></div>
        <div className="contact-grid">
          <div>
            <h2 className="contact-h reveal">LET'S TALK<br />ABOUT YOUR<br /><span className="ital">project.</span></h2>
            <p className="contact-lede reveal">Fill in the form and we'll get back to you within 24 hours with next steps.</p>
            <div className="contact-detail mono reveal"><span className="ok">✉</span> contact@spherecode.dev</div>
            <div className="contact-detail mono reveal"><span className="ok">◎</span> Remote-first · Available worldwide</div>
          </div>
          <form
            className="cform reveal" action={FORM} method="POST" noValidate
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              const btn = form.querySelector('button[type=submit]')
              const ok = form.querySelector('.form-ok')
              btn.textContent = 'Sending…'
              try {
                const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
                if (res.ok) { form.reset(); ok.classList.add('show'); btn.textContent = 'Send Message →' }
                else btn.textContent = 'Something went wrong — try again'
              } catch { btn.textContent = 'Something went wrong — try again' }
            }}
          >
            <div className="frow2">
              <div className="fg"><label htmlFor="fname">First Name *</label><input id="fname" name="fname" placeholder="Jane" required /></div>
              <div className="fg"><label htmlFor="lname">Last Name *</label><input id="lname" name="lname" placeholder="Smith" required /></div>
            </div>
            <div className="fg"><label htmlFor="email">Email *</label><input type="email" id="email" name="email" placeholder="jane@yourbusiness.com" required /></div>
            <div className="fg">
              <label htmlFor="division">Which division? *</label>
              <select id="division" name="division" required value={active} onChange={(e) => pick(e.target.value)}>
                {DIVISIONS.map((x) => <option key={x.key} value={x.key}>{x.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label htmlFor="need">What do you need? *</label>
              <select id="need" name="need" required defaultValue="" key={active}>
                <option value="" disabled>Select a service</option>
                {ENQUIRY[active].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="fg"><label htmlFor="message">Tell us about it *</label><textarea id="message" name="message" rows="4" placeholder="What do you need, what have you tried, and when do you want to start?" required /></div>
            <button type="submit" className="btn btn--primary btn--full">Send Message →</button>
            <div className="form-ok mono">✓ Message sent! We'll get back to you within 24 hours.</div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="foot">
        <div className="foot-top">
          <div className="foot-brand">
            <img src={asset('images/spherecode-logo-nobg.png')} alt="SphereCode" />
            <p>Three divisions, one team — we build your website, run your operations, and staff your admin.</p>
          </div>
          <div className="foot-cols mono">
            <div className="fcol">
              <h5>Divisions</h5>
              {DIVISIONS.map((x) => (
                <a key={x.key} href="#services" onClick={() => pick(x.key)}>{x.name}</a>
              ))}
            </div>
            <div className="fcol"><h5>Free Offers</h5>
              {DIVISIONS.map((x) => (
                <a key={x.key} href="#offer" onClick={() => pick(x.key)}>{x.lead.label}</a>
              ))}
            </div>
            <div className="fcol"><h5>Company</h5><a href="#work">Portfolio</a><a href="#pricing">Pricing</a><a href="#contact">Contact</a><a href="#top">Top ↑</a></div>
          </div>
        </div>
        <div className="foot-mark">SPHERECODE</div>
        <div className="foot-bottom mono">
          <span>© 2026 SphereCode. All rights reserved.</span>
          <span><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></span>
        </div>
      </footer>

      {/* STICKY DIVISION RAIL */}
      <div className={'rail' + (rail && !menu ? ' show' : '')}>
        {DIVISIONS.map((x) => (
          <button
            key={x.key} type="button" style={{ '--dc': x.accRgb }}
            className={x.key === active ? 'on' : ''} onClick={() => pick(x.key)}
          >{x.short}</button>
        ))}
      </div>
    </div>
  )
}
