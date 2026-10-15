import { useEffect, useState, useRef } from 'react'
import HeroDashboard, { HeroOps, HeroDesk } from '../scene/HeroDashboard.jsx'
import { DIVISIONS, BY_KEY } from './divisions.jsx'
import { ABOUT, CAREERS, AICONTENT } from '../seo.js'

const FORM = 'https://formspree.io/f/xjglrypl'
const BASE = import.meta.env.BASE_URL

/* Which division this URL is. null on the home page, which shows all three
   and rotates; /web, /bpo and /virtual-assistants are locked to one so the
   page always matches the <title> a crawler indexed and the ad that sent
   the visitor. */
function routeKey() {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path.endsWith('/about')) return 'about'
  if (path.endsWith('/careers')) return 'careers'
  if (path.endsWith('/ai-content')) return 'aicontent'
  for (const d of DIVISIONS) if (path.endsWith('/' + d.slug)) return d.key
  return null
}
const divHref = (d) => BASE + d.slug + '/'

/* Vite rewrites asset URLs in index.html but NOT string literals in JS, so any
   /images/... path has to be joined to the deploy base by hand or it 404s
   wherever the site is not served from the domain root. */
const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\//, '')

/* Hero headline — one line per division. The active division's line lights up
   in that division's accent; the other two drop back. */
const HERO_LINES = ['WE BUILD IT.', 'WE RUN IT.', 'we staff it.']
const ABOUT_LINES = ['STARTED ALONE.', 'BUILT A TEAM.', 'now a company.']
const ABOUT_SUB = 'Founded by Jawad Ahmad in 2025 in Peshawar — now two offices, in Peshawar and Islamabad, and a team of 11 to 20 across web development, BPO and virtual assistants.'
const ABOUT_STATS = [{ v: '2025', l: 'Founded' }, { v: '11–20', l: 'Team Today' }, { v: '3', l: 'Divisions' }]
const CAREERS_LINES = ['BUILD IT.', 'RUN IT.', 'with us.']
const AI_LINES = ['WE DRAFT IT.', 'WE EDIT IT.', 'you publish it.']
const AI_SUB = 'AI-drafted, human-edited content at volume — product descriptions, blogs, landing pages, social and email. For any business that needs good content faster than it can write it.'
const AI_STATS = [{ v: '100s', l: 'Pieces Per Batch' }, { v: '100%', l: 'Human Edited' }, { v: '5', l: 'Free To Start' }]
const CAREERS_SUB = 'We went from one freelancer in 2025 to a team of 11 to 20 in a year. Offices in Peshawar and Islamabad, clients worldwide, and applications read across all three divisions.'
const CAREERS_STATS = [{ v: '11–20', l: 'Team Today' }, { v: '3', l: 'Divisions' }, { v: '2', l: 'Offices' }]

/* ---------------------------------------------------------------------
   Shared work + reviews.
   NOTE: every item below is from the web division. BPO and VA case
   studies / testimonials go here once there are real ones to show —
   do not invent them, the section header already says which division
   the work belongs to.
   --------------------------------------------------------------------- */
const WORKS = [
  { t: 'Surkhab Store', tag: 'E-Commerce · Shopify', d: 'A clean, conversion-focused Shopify storefront built for fast browsing and seamless checkout.', href: 'https://surkhab.store', label: 'surkhab.store', img: asset('images/thumb-surkhab.png'), alt: 'Surkhab Store Shopify storefront built by SphereCode' },
  { t: 'FAHHM Engineering', tag: 'Web Design · Construction', d: 'An architecture & construction consultancy — a bold corporate site turning blueprints into an enduring brand presence.', href: 'https://fahhm.co', label: 'fahhm.co', img: asset('images/thumb-fahhm.png'), alt: 'FAHHM Engineering construction consultancy website built by SphereCode' },
  { t: 'Lumière Studio', tag: 'Web Design · Clinic', d: "Marylebone's premier aesthetics clinic — a refined, trust-first site designed to convert consultations into clients.", href: 'https://lumierestudio13.netlify.app', label: 'lumierestudio13.netlify.app', img: asset('images/thumb-lumiere.png'), alt: 'Lumière Studio aesthetics clinic website built by SphereCode' },
  { t: 'Clinic Management System', tag: 'Web App · Healthcare', d: 'A full practice-management system for a private clinic — patient queue, records, recalls, operations, inventory, expenses and revenue reporting, with automatic hourly backups.', private: true, label: 'Private · Internal system', img: asset('images/thumb-clinic.png'), alt: 'Clinic management system dashboard built by SphereCode' },
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

/* Honeypot. A field no human sees or tabs into, that automated submitters
   fill in anyway. Bots eat the Formspree quota and land in the inbox looking
   like leads, which matters more once paid traffic is running. We drop them
   here rather than relying on the endpoint, so a bot never costs a
   submission against the monthly allowance. */
function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label htmlFor="_gotcha">Leave this field empty</label>
      <input id="_gotcha" type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
    </div>
  )
}
const isBot = (form) => Boolean(new FormData(form).get('_gotcha'))

async function post(data) {
  const fd = new FormData()
  Object.entries(data).forEach(([k, v]) => fd.append(k, v))
  const res = await fetch(FORM, { method: 'POST', body: fd, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error('send failed')
}

/* ---- social ---- inline SVG, line-art to match the division glyphs rather
   than dropping brand-coloured logos into a monochrome footer ---- */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="1.15" className="solid" />
    </svg>
  )
}
function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4" />
      <path d="M7.4 10.9V17" />
      <circle cx="7.4" cy="7.5" r="1.05" className="solid" />
      <path d="M11.5 17v-6.1" />
      <path d="M11.5 13.7a2.55 2.55 0 0 1 5.1 0V17" />
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4" />
      <path d="M15 7.8h-1.4a2.1 2.1 0 0 0-2.1 2.1V17.4" />
      <path d="M9.4 12.2h4.9" />
    </svg>
  )
}

const SOCIAL = [
  { n: 'Instagram', href: 'https://www.instagram.com/spherecode_/', I: IconInstagram },
  { n: 'LinkedIn', href: 'https://www.linkedin.com/company/spherecode-solutions/', I: IconLinkedIn },
  { n: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594862801595', I: IconFacebook },
]

/* ===================== division switcher ===================== */

function DivisionCard({ d, on, onPick }) {
  return (
    <a
      href={divHref(d)}
      className={'divc reveal' + (on ? ' on' : '')}
      style={{ '--dc': d.accRgb }}
      aria-current={on ? 'page' : undefined}
      onClick={(e) => onPick(e, d.key)}
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
    </a>
  )
}

/* ---- hero division tabs ----
   The switcher now lives in the hero so the page morphs where the visitor is
   actually looking, and all three divisions are advertised before any scroll. */
function DivTabs({ active, cycling, onPick, isHome }) {
  return (
    <div className="dtabs" role="tablist" aria-label="Choose a division">
      {DIVISIONS.map((x) => {
        const on = x.key === active
        return (
          <a
            key={x.key} href={divHref(x)} aria-current={on ? 'page' : undefined}
            className={'dtab' + (on ? ' on' : '')}
            style={{ '--dt': x.accRgb, '--dc': x.accRgb }}
            onClick={(e) => onPick(e, x.key)}
          >
            <span className="glyphbox dt-glyph">{x.glyph}</span>
            <span className="dt-full">{x.name}</span>
            <span className="dt-short">{x.short}</span>
            <span className="dt-state">{on ? 'Selected' : 'Select'}</span>
            {on && cycling && <span className="dt-prog" key={active} />}
          </a>
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
  const [st, setSt] = useState('idle')   // idle | scan | sent
  const [step, setStep] = useState(0)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (st !== 'scan') return
    let i = 0
    const id = setInterval(() => {
      i++
      setStep(i)
      if (i >= CHECKS.length) { clearInterval(id); setSt('sent') }
    }, 460)
    return () => clearInterval(id)
  }, [st])

  const run = async (e) => {
    e.preventDefault()
    if (isBot(e.currentTarget)) { setSt('sent'); return }
    if (!url.trim()) { setErr('Enter your website address first.'); return }
    if (!email.trim()) { setErr('We need an email to send the report to.'); return }
    setErr(''); setStep(0); setSt('scan')
    // send immediately rather than after the animation, so a visitor who taps
    // away mid-scan is still a captured lead
    try {
      await post({
        _subject: 'SITE AUDIT request — ' + url,
        division: d.name, lead_magnet: 'Free Site Audit', website: url, email, _gotcha: '',
      })
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
          <form onSubmit={run}>
            <Honeypot />
            <div className="fg"><label htmlFor="au-url">Your website *</label>
              <input id="au-url" placeholder="yourbusiness.com" value={url}
                onChange={(e) => setUrl(e.target.value)} disabled={st !== 'idle'} autoComplete="url" />
            </div>
            <div className="fg" style={{ marginTop: 14 }}><label htmlFor="au-email">Where do we send it? *</label>
              <input id="au-email" type="email" placeholder="you@yourbusiness.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={st !== 'idle'} autoComplete="email" />
            </div>
            <button type="submit" className="btn btn--primary btn--full" style={{ marginTop: 18 }} disabled={st !== 'idle'}>
              {st === 'idle' ? 'Run My Audit →' : 'Running…'}
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
    if (isBot(e.currentTarget)) { setSt('sent'); return }
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
        <Honeypot />
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


/* ===================== about ===================== */

const STORY = [
  { n: 'Freelancing', d: 'Jawad Ahmad takes on client work alone — websites and systems, one project at a time.', s: 'BEFORE 2025' },
  { n: 'The company', d: 'The freelance work becomes SphereCode Solutions, registered and operating out of Peshawar.', s: '2025' },
  { n: 'A full team', d: 'The first employees join. One person doing everything becomes a team with defined roles.', s: 'EARLY 2026' },
  { n: 'Three divisions', d: '11 to 20 people across web development, BPO services and virtual assistants.', s: 'TODAY' },
]

const WHY = [
  { t: 'Customer support worth having', d: 'Most outsourced support is a cost centre that treats customers like tickets. We started because it can be the opposite — the part of a business people actually remember.' },
  { t: 'Sales that actually move', d: 'Qualified leads, followed up properly, by people who know the product. Not a script read at volume.' },
  { t: 'Technology that fits the business', d: 'Not a template with your logo dropped on it. Systems built around how a business already works.' },
]

function AboutSections({ sec }) {
  return (
    <>
      <section className="section" id="story">
        <div className="sec-head mono"><span>{sec()}</span><span>Our Story</span></div>
        <div className="mani-grid">
          <p className="mani-note mono reveal">Founded in 2025 by Jawad Ahmad, in Peshawar, Pakistan. It started as one person freelancing, not as a plan for a company.</p>
          <h2 className="mani-big reveal">One freelancer. <span className="stroke">Then a team.</span> Now three divisions.</h2>
          <p className="mani-note r mono reveal">We have run with a full team since early 2026 — currently 11 to 20 people — and have grown every quarter since.</p>
        </div>
      </section>

      <section className="section" id="timeline">
        <div className="sec-head mono"><span>{sec()}</span><span>How We Got Here</span></div>
        <div className="forms-table">
          {STORY.map((f, i) => (
            <div className="frow" key={f.n}>
              <span className="fr-i mono">0{i + 1}</span>
              <span className="fr-name">{f.n}</span>
              <span className="fr-d">{f.d}</span>
              <span className="fr-stat mono">{f.s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="founder">
        <div className="sec-head mono"><span>{sec()}</span><span>Meet the Founder</span></div>
        <div className="split">
          <div className="reveal">
            <h2 className="split-big">Jawad <span className="ok">Ahmad</span></h2>
            <p className="split-lede">Founder, SphereCode Solutions.</p>
            <p className="about-bio">
              Started out freelancing — building websites and systems for clients on his own. The work grew past what
              one person could carry, so in 2025 it became a company. Since then the brief has widened from building
              software to running the operations and staffing the admin behind it, which is how three divisions ended
              up under one roof rather than one.
            </p>
            <p className="about-bio">
              The company still works the way the freelancing did: a named person accountable for your account, and
              reporting you can check rather than take on trust.
            </p>
            <div style={{ marginTop: 30 }}><a href="#contact" className="btn btn--primary">Talk to us</a></div>
          </div>
          <figure className="about-figure reveal">
            <img
              className="about-photo" src={asset('images/founder.png')} width="800" height="800" loading="lazy"
              alt="Jawad Ahmad, founder of SphereCode Solutions, Peshawar"
            />
            <figcaption className="mono">Jawad Ahmad · Founder</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" id="mission">
        <div className="sec-head mono"><span>{sec()}</span><span>The Dream &amp; The Mission</span></div>
        <div className="reveal">
          <h2 className="mani-big" style={{ maxWidth: '20ch', marginBottom: 30 }}>
            I always wanted to build <span className="stroke">my own company.</span>
          </h2>
        </div>
        <div className="mission-grid">
          <p className="about-bio reveal">
            Not an agency that does one thing and refers you elsewhere for the rest. Freelancing taught me that a
            business rarely has just a website problem — it has a website problem, and a support problem, and far
            too much admin. Those usually get bought from three different places, and nobody ends up accountable
            for the whole thing.
          </p>
          <p className="about-bio reveal">
            So SphereCode Solutions was built the other way round: three divisions under one roof, one team you can
            hold responsible. That is the company I wanted to work with when I was doing it alone, and it is the
            one we are still building.
          </p>
          <blockquote className="mission reveal">
            <span className="mission-label mono">Our mission</span>
            <p>
              To give growing businesses the three things they actually need — technology that fits how they work,
              customer relationships worth having, and the everyday weight taken off their hands — delivered by one
              accountable team instead of three disconnected suppliers.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="section" id="why-we-started">
        <div className="sec-head mono"><span>{sec()}</span><span>Why We Started</span></div>
        <div className="feat-list">
          {WHY.map((f) => (
            <div className="feat reveal" key={f.t}><i>✦</i><div><strong>{f.t}</strong><p>{f.d}</p></div></div>
          ))}
        </div>
      </section>

      <section className="section" id="divisions">
        <div className="sec-head mono"><span>{sec()}</span><span>What We Do</span></div>
        <div className="div-grid">
          {DIVISIONS.map((x) => (
            <a className="divc reveal" key={x.key} href={divHref(x)} style={{ '--dc': x.accRgb }}>
              <span className="divc-top"><span className="divc-code">{x.code}</span><span className="divc-state">Visit</span></span>
              <span className="glyphbox divc-glyph">{x.glyph}</span>
              <span className="divc-verb">{x.verb}</span>
              <span className="divc-name">{x.name}</span>
              <span className="divc-blurb">{x.blurb}</span>
              <span className="divc-foot">See this division <i>→</i></span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}


/* ===================== careers ===================== */

/* ---- OPEN ROLES ----
   Add real vacancies here and they render as a list; leave it empty and the
   page shows a rolling-application message instead. Nothing is invented:
   only put roles here that are genuinely open.
     { t: 'Outbound Sales Representative', d: 'US market, night shift.', tag: 'BPO · Full-time' } */
const ROLES = []

const WHY_JOIN = [
  { t: 'Small enough that your work shows', d: 'Eleven to twenty people, not eleven hundred. What you build or fix is visible to the person who runs the company, not buried three layers down.' },
  { t: 'Three divisions, not one lane', d: 'Web development, BPO and virtual assistants sit under one roof. People who want to move between disciplines can, rather than having to change employer to change work.' },
  { t: 'A company still being built', d: 'We went from one freelancer in 2025 to a full team within a year. Early enough that how things are done is still up for discussion, and you get a say in it.' },
  { t: 'Two offices, international clients', d: 'Saddar in Peshawar and F-11 Markaz in Islamabad. The clients are international, so the work is exposure to how businesses operate in other markets.' },
]

function CareersSections({ sec }) {
  const [st, setSt] = useState('idle')
  const [err, setErr] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if (isBot(e.currentTarget)) { setSt('sent'); return }
    const f = new FormData(e.currentTarget)
    setSt('busy'); setErr('')
    try {
      await post({
        _subject: 'JOB APPLICATION — ' + (f.get('role') || 'General'),
        lead_magnet: 'Careers application',
        ...Object.fromEntries(f.entries()),
      })
      setSt('sent')
    } catch { setSt('idle'); setErr('Could not send — please email contact@spherecode.dev instead.') }
  }

  return (
    <>
      <section className="section" id="why-join">
        <div className="sec-head mono"><span>{sec()}</span><span>Why Join Us</span></div>
        <div className="feat-list">
          {WHY_JOIN.map((f) => (
            <div className="feat reveal" key={f.t}><i>✦</i><div><strong>{f.t}</strong><p>{f.d}</p></div></div>
          ))}
        </div>
      </section>

      <section className="section" id="roles">
        <div className="sec-head mono"><span>{sec()}</span><span>Open Roles</span></div>
        {ROLES.length === 0 ? (
          <div className="reveal">
            <h2 className="forms-title">WE HIRE AS<br /><span className="stroke">WE GROW</span></h2>
            <p className="forms-sub mono">
              Nothing specific is listed right now, but we take people on across all three divisions as the
              company grows, and we read every application that comes in. Send your details below and we will
              come back to you when something fits.
            </p>
          </div>
        ) : (
          <div className="forms-table">
            {ROLES.map((r, i) => (
              <div className="frow" key={r.t}>
                <span className="fr-i mono">R-0{i + 1}</span>
                <span className="fr-name">{r.t}</span>
                <span className="fr-d">{r.d}</span>
                <span className="fr-stat mono">{r.tag}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section" id="apply">
        <div className="sec-head mono"><span>{sec()}</span><span>Apply</span></div>
        <div className="lm">
          <div className="lm-grid">
            <div className="reveal">
              <div className="lm-kicker mono"><span className="d" />Rolling Applications</div>
              <h2 className="lm-h">SEND US YOUR <em>CV</em></h2>
              <p className="lm-sub">
                Tell us which division interests you and link your CV or portfolio. If there is nothing open that
                fits, we keep applications on file rather than deleting them.
              </p>
              <ul className="lm-list">
                <li>Every application gets a reply</li>
                <li>Offices in Peshawar (Saddar) and Islamabad (F-11 Markaz)</li>
                <li>Shift patterns stated up front where they apply</li>
              </ul>
            </div>
            <div className="reveal">
              <div className="lm-box">
                <div className="lm-box-h mono">Application</div>
                {st === 'sent' ? (
                  <div className="lm-ok"><i>✓</i><p><b>Application received.</b><br />We read every one and will come back to you.</p></div>
                ) : (
                  <form className="cform" style={{ border: 0, background: 'none', padding: 0 }} onSubmit={send}>
                    <Honeypot />
                    <div className="frow2">
                      <div className="fg"><label htmlFor="cv-name">Name *</label><input id="cv-name" name="name" placeholder="Your name" required /></div>
                      <div className="fg"><label htmlFor="cv-email">Email *</label><input id="cv-email" name="email" type="email" placeholder="you@email.com" required /></div>
                    </div>
                    <div className="fg">
                      <label htmlFor="cv-role">Which division? *</label>
                      <select id="cv-role" name="role" required defaultValue="">
                        <option value="" disabled>Select a division</option>
                        <option>Web Development</option><option>BPO Services</option>
                        <option>Virtual Assistants</option><option>Open to anything</option>
                      </select>
                    </div>
                    <div className="fg"><label htmlFor="cv-link">Link to CV or portfolio *</label><input id="cv-link" name="cv" placeholder="Google Drive, LinkedIn or portfolio URL" required /></div>
                    <div className="fg"><label htmlFor="cv-note">Anything else</label><textarea id="cv-note" name="note" rows="3" placeholder="Experience, availability, notice period" /></div>
                    <button type="submit" className="btn btn--primary btn--full" disabled={st === 'busy'}>
                      {st === 'busy' ? 'Sending…' : 'Send Application →'}
                    </button>
                    {err && <div className="lm-err">{err}</div>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


/* ===================== ai content ===================== */

const AI_WORK = [
  { t: 'Product & Category Copy', d: 'Descriptions, category pages and specification tables at volume — hundreds of SKUs in days rather than weeks, in one consistent voice.' },
  { t: 'Blog & Article Content', d: 'Long-form pieces researched around the questions your customers actually search, structured so they are useful rather than padded.' },
  { t: 'Landing Page Copy', d: 'Headlines, benefit sections and calls to action written for one offer and one audience, with variants to test against each other.' },
  { t: 'Social & Ad Creative', d: 'Captions, hooks and ad variations in bulk, so campaigns have enough to test with instead of one tired version.' },
  { t: 'Email & Newsletters', d: 'Sequences, campaign sends and lifecycle emails drafted to a brief and edited before they reach your list.' },
  { t: 'Rewrites & Clean-Up', d: 'Existing content brought up to standard — thin pages expanded, duplicate copy differentiated, inconsistent voice fixed.' },
]

const AI_HOW = [
  { n: 'Brief & Voice', d: 'We take samples of how you already write, agree the tone, and build the prompt and style guide your content will be produced against.', s: 'DAY 0–2' },
  { n: 'Sample Batch', d: 'A small batch first, so you can judge the real thing and correct the direction before volume work starts.', s: 'DAY 2–4' },
  { n: 'Production', d: 'AI drafts at volume against the agreed brief. Every piece is read and edited by a person before it reaches you.', s: 'ONGOING' },
  { n: 'Delivery & Revision', d: 'Delivered in whatever format you work in — CSV, CMS, Shopify import. Revisions included within the agreed scope.', s: 'ONGOING' },
]

function AiContentSections({ sec }) {
  const [st, setSt] = useState('idle')
  const [err, setErr] = useState('')

  const send = async (e) => {
    e.preventDefault()
    if (isBot(e.currentTarget)) { setSt('sent'); return }
    const f = new FormData(e.currentTarget)
    setSt('busy'); setErr('')
    try {
      await post({
        _subject: 'AI CONTENT sample request — ' + (f.get('company') || ''),
        division: 'AI Content', lead_magnet: 'Free content sample',
        ...Object.fromEntries(f.entries()),
      })
      setSt('sent')
    } catch { setSt('idle'); setErr('Could not send — please email contact@spherecode.dev instead.') }
  }

  return (
    <>
      <section className="section" id="services">
        <div className="sec-head mono"><span>{sec()}</span><span>What We Write</span></div>
        <div className="cap-list">
          {AI_WORK.map((c, i) => (
            <a href="#offer" className="cap-row reveal" key={c.t} onMouseMove={rowGlow}>
              <span className="cap-i mono">0{i + 1}</span>
              <span className="cap-name">{c.t}</span>
              <span className="cap-d">{c.d}</span>
              <span className="cap-arrow">↗</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="how">
        <div className="sec-head mono"><span>{sec()}</span><span>How It Works</span></div>
        <h2 className="forms-title reveal">DRAFTED BY AI.<br /><span className="stroke">EDITED BY PEOPLE.</span></h2>
        <p className="forms-sub mono reveal">
          The AI is what makes the volume and the speed possible. <b>The editing is what makes it publishable.</b> We
          do not hand over raw model output.
        </p>
        <div className="forms-table">
          {AI_HOW.map((f, i) => (
            <div className="frow" key={f.n}>
              <span className="fr-i mono">P-0{i + 1}</span>
              <span className="fr-name">{f.n}</span>
              <span className="fr-d">{f.d}</span>
              <span className="fr-stat mono">{f.s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="offer">
        <div className="sec-head mono"><span>{sec()}</span><span>Free Sample</span></div>
        <div className="lm">
          <div className="lm-grid">
            <div className="reveal">
              <div className="lm-kicker mono"><span className="d" />No Cost, No Commitment</div>
              <h2 className="lm-h">FIVE PIECES, <em>WRITTEN FREE</em></h2>
              <p className="lm-sub">
                Send us five products, five article titles, or a page you want rewritten. We produce them to your
                brief — drafted and then edited — and you judge the actual output rather than a promise about it.
              </p>
              <ul className="lm-list">
                <li>Five pieces of real content, not a template</li>
                <li>Written in your voice from samples you provide</li>
                <li>Edited by a person, same as paid work</li>
                <li>Yours to use whether you continue or not</li>
              </ul>
              <p className="lm-fine mono">
                One sample set per business. If AI-assisted content is the wrong fit for what you need — technical,
                legal or anything requiring genuine first-hand expertise — we will say so rather than sell it.
              </p>
            </div>
            <div className="reveal">
              <div className="lm-box">
                <div className="lm-box-h mono">Request your sample</div>
                {st === 'sent' ? (
                  <div className="lm-ok"><i>✓</i><p><b>Sample request received.</b><br />We will come back within one working day to agree the brief, then send the five pieces.</p></div>
                ) : (
                  <form className="cform" style={{ border: 0, background: 'none', padding: 0 }} onSubmit={send}>
                    <Honeypot />
                    <div className="frow2">
                      <div className="fg"><label htmlFor="ai-name">Name *</label><input id="ai-name" name="name" placeholder="Jane Smith" required /></div>
                      <div className="fg"><label htmlFor="ai-email">Email *</label><input id="ai-email" name="email" type="email" placeholder="jane@company.com" required /></div>
                    </div>
                    <div className="fg"><label htmlFor="ai-company">Company / website</label><input id="ai-company" name="company" placeholder="company.com" /></div>
                    <div className="fg">
                      <label htmlFor="ai-type">What should we write? *</label>
                      <select id="ai-type" name="content_type" required defaultValue="">
                        <option value="" disabled>Select content type</option>
                        <option>Product descriptions</option><option>Blog or articles</option>
                        <option>Landing page copy</option><option>Social or ad creative</option>
                        <option>Email or newsletters</option><option>Rewrite existing content</option>
                      </select>
                    </div>
                    <div className="fg"><label htmlFor="ai-brief">Brief *</label><textarea id="ai-brief" name="brief" rows="3" placeholder="Five products, five titles, or a link to the page you want rewritten" required /></div>
                    <button type="submit" className="btn btn--primary btn--full" disabled={st === 'busy'}>
                      {st === 'busy' ? 'Sending…' : 'Get 5 Pieces Free →'}
                    </button>
                    {err && <div className="lm-err">{err}</div>}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ===================== the page ===================== */

export default function Site() {
  const [routed] = useState(() => routeKey())  // null on the home page
  const isAbout = routed === 'about'
  const isCareers = routed === 'careers'
  const isAi = routed === 'aicontent'
  const isPage = ['about', 'careers', 'aicontent'].includes(routed)
  const isHome = routed === null
  // 'about' is a page, not a division, so keep a real division active for the
  // accent palette and the shared nav/footer markup
  const [active, setActive] = useState(routed && !['about', 'careers', 'aicontent'].includes(routed) ? routed : 'web')
  const [typed, setTyped] = useState('')
  const [full, setFull] = useState('')
  const [live, setLive] = useState(false)
  const [menu, setMenu] = useState(false)
  const [formDiv, setFormDiv] = useState(routed && !['about', 'careers', 'aicontent'].includes(routed) ? routed : 'web')
  const [rail, setRail] = useState(false)
  const [faqOpen, setFaqOpen] = useState(-1)
  const [picked, setPicked] = useState(false)   // visitor chose a division themselves
  const [heroIn, setHeroIn] = useState(true)    // hero still on screen
  const heroRef = useRef(null)

  /* The hero cycles through the three divisions on its own so a visitor who
     never touches anything still sees all three. It stops for good the moment
     they pick one, and pauses once they have scrolled past the hero so nothing
     swaps underneath them while they are reading. */
  const cycling = isHome && !picked && heroIn

  const d = BY_KEY[active]
  const NAV = isAi
    ? [['What We Write', '#services'], ['How It Works', '#how'], ['Free Sample', '#offer'], ['Divisions', BASE]]
    : isCareers
    ? [['Why Join', '#why-join'], ['Open Roles', '#roles'], ['Apply', '#apply'], ['About', BASE + 'about/']]
    : isAbout
    ? [['Our Story', '#story'], ['Founder', '#founder'], ['Mission', '#mission'], ['Divisions', '#divisions']]
    : [['Divisions', '#divisions'], ['Services', '#services'], ['Process', '#process'], ['Pricing', '#pricing'], [d.lead.nav, '#offer']]

  /* paint the active division's accent onto the whole document */
  useEffect(() => {
    const s = document.documentElement.style
    s.setProperty('--acc-rgb', d.accRgb)
    s.setProperty('--acc2-rgb', d.acc2Rgb)
  }, [d])

  /* switching division: scroll to the top of the swapped content and retype */
  /* Home switches in place (the morph). A division page is a real page, so
     picking a different division navigates there — the URL, <title> and
     content stay in agreement. Re-picking the current one just scrolls. */
  const pick = (e, key) => {
    if (!isHome && key !== active) return   // let the browser follow the link
    e?.preventDefault?.()
    setPicked(true)
    if (key === active) {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setActive(key)
    setFormDiv(key)
  }

  /* auto-cycle */
  useEffect(() => {
    if (!cycling) return
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const id = setTimeout(() => {
      const i = DIVISIONS.findIndex((x) => x.key === active)
      setActive(DIVISIONS[(i + 1) % DIVISIONS.length].key)
    }, 4200)
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
      // the moment the hero (which holds the other picker) scrolls away.
      // heroIn comes from the same measurement: an IntersectionObserver ratio
      // threshold is unreliable here, because a hero taller than the viewport
      // can never reach it and the auto-cycle would quietly never start.
      const hero = document.getElementById('top')
      if (hero) {
        const hr = hero.getBoundingClientRect()
        setRail(hr.bottom < 80)
        setHeroIn(hr.bottom > 120)
      } else { setRail(false) }
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
      const vc = window.innerHeight / 2
      const on = isMobile()
      const reach = window.innerHeight * 0.4
      // one winner per list, not a band — a band lit three rows at once, which
      // read as a gradient rather than "this row is the one you're on"
      for (const sel of ['.cap-row', '.frow', '.folio']) {
        const items = [...document.querySelectorAll(sel)]
        let best = null, bestD = Infinity
        for (const el of items) {
          const r = el.getBoundingClientRect()
          const dist = Math.abs(r.top + r.height / 2 - vc)
          if (dist < bestD) { bestD = dist; best = el }
        }
        for (const el of items) el.classList.toggle('active', on && el === best && bestD < reach)
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
    const text = isAi ? AI_SUB : isCareers ? CAREERS_SUB : isAbout ? ABOUT_SUB : ((narrow && d.typedShort) || d.typed)
    let i = 0, to
    setTyped(''); setFull(text)
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) { setTyped(text); return }
    const tick = () => { i++; setTyped(text.slice(0, i)); if (i < text.length) to = setTimeout(tick, 7) }
    const start = setTimeout(tick, 220)
    return () => { clearTimeout(start); clearTimeout(to) }
  }, [d, active, isAbout, isCareers, isAi])

  useEffect(() => {
    // threshold 0, not a ratio: the ratio is a fraction of the HERO, so any
    // viewport shorter than ~2.5x the hero can never reach 0.4 and the stats
    // would sit at 0 forever (a phone in landscape did exactly that)
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setLive(true); io.disconnect() } }, { threshold: 0 })
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
      <section className={'hero' + (isPage ? ' hero--about' : '')} id="top" ref={heroRef}>
        <div className="hero-inner">
          <div className="hero-left">
            <DivTabs active={active} cycling={cycling} onPick={pick} isHome={isHome} />
            <h1 className="hero-h">
              {/* The visible H1 is a slogan with no keywords in it. This gives
                  the heading a plain description of the page for crawlers and
                  screen readers — same text for both, nothing hidden from one
                  and shown to the other. */}
              <span className="sr-only">{isPage ? (isAi ? AICONTENT : isCareers ? CAREERS : isAbout ? ABOUT : d).h1 : d.h1}</span>
              {isPage ? (isAi ? AI_LINES : isCareers ? CAREERS_LINES : ABOUT_LINES).map((l, i) => (
                <span key={l} className={(i === 2 ? 'ital ' : '') + (i === 0 ? 'lit' : '')}>{l}</span>
              )) : HERO_LINES.map((l, i) => (
                <button
                  key={l} type="button" aria-label={'Show ' + DIVISIONS[i].name}
                  className={(i === 2 ? 'ital ' : '') + (i === d.line ? 'lit' : '')}
                  onClick={(e) => { if (isHome || DIVISIONS[i].key === active) pick(e, DIVISIONS[i].key); else window.location.href = divHref(DIVISIONS[i]) }}
                >{l}</button>
              ))}
            </h1>
            <p className="hero-sub mono">
              {(() => {
                // the clause before the em-dash is the claim; accent it as it types
                const cut = full.indexOf('—')
                const hi = cut < 0 ? 0 : cut
                return <><b className="hs-hi">{typed.slice(0, Math.min(typed.length, hi))}</b>{typed.slice(Math.min(typed.length, hi))}</>
              })()}
              <span className="care">▍</span>
            </p>
            <div className="hero-ctas">
              <a href={isCareers ? '#apply' : isAbout ? '#contact' : '#offer'} className="btn btn--primary">{isAi ? 'Get 5 free' : isCareers ? 'Apply now' : isAbout ? 'Talk to us' : d.lead.nav} →</a>
              <a href="#divisions" className="btn">Explore Divisions</a>
            </div>
          </div>
          {!isPage && <div className="hero-right"><Panel key={active} /></div>}
          {/* own grid cell so the panel can sit above it on a phone — the panel
              is the thing worth seeing and it was landing dead last */}
          <div className="hero-stats">
            {(isAi ? AI_STATS : isCareers ? CAREERS_STATS : isAbout ? ABOUT_STATS : d.stats).map((s) => <HeroStat key={s.l} s={s} run={live} />)}
          </div>
        </div>
        <a href="#divisions" className="scroll-cue mono">↓ &nbsp;SCROLL</a>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-in" key={active}>
          {mq.map((m, i) => <span key={i} className="mq">{m}<i>✦</i></span>)}
        </div>
      </div>

      {isAi ? <AiContentSections sec={sec} /> : isCareers ? <CareersSections sec={sec} /> : isAbout ? <AboutSections sec={sec} /> : (<>
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
                    : <div className="folio-shot"><img src={w.img} alt={w.alt} loading="lazy" /></div>}
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

      </>)}

      {/* FAQ — real questions people search for, and the answers stay in the
          DOM when collapsed so crawlers read them either way. */}
      <section className="section" id="faq">
        <div className="sec-head mono"><span>{sec()}</span><span>Common Questions · {isAi ? 'AI Content' : isCareers ? 'Careers' : isAbout ? 'About Us' : d.short}</span></div>
        <div className="faq swap" key={active + '-faq'}>
          {(isAi ? AICONTENT : isCareers ? CAREERS : isAbout ? ABOUT : d).faq.map(([q, a], i) => (
            <div className={'faq-item' + (faqOpen === i ? ' on' : '')} key={q}>
              <button
                type="button" className="faq-q" aria-expanded={faqOpen === i}
                onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}
              >
                <span>{q}</span><i aria-hidden="true">+</i>
              </button>
              <div className="faq-a"><p>{a}</p></div>
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
            <div className="contact-detail mono reveal"><span className="ok">☎</span> <a href="tel:+923250827062">0325 0827062</a></div>
            <div className="contact-detail mono reveal"><span className="ok">◎</span> Two offices in Pakistan · Serving clients worldwide</div>
            <div className="offices reveal">
              <div className="office">
                <h5 className="mono">Peshawar</h5>
                <p>Cantonment Executive Office, Shopping Plaza,<br />A-Road Arbab Rd, Saddar, Peshawar 25000</p>
              </div>
              <div className="office">
                <h5 className="mono">Islamabad</h5>
                <p>Office No. 17, Crown Plaza,<br />F-11 Markaz, Islamabad</p>
              </div>
            </div>
          </div>
          <form
            className="cform reveal" action={FORM} method="POST" noValidate
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              if (isBot(form)) { form.reset(); form.querySelector('.form-ok').classList.add('show'); return }
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
            <Honeypot />
            <div className="frow2">
              <div className="fg"><label htmlFor="fname">First Name *</label><input id="fname" name="fname" placeholder="Jane" required /></div>
              <div className="fg"><label htmlFor="lname">Last Name *</label><input id="lname" name="lname" placeholder="Smith" required /></div>
            </div>
            <div className="fg"><label htmlFor="email">Email *</label><input type="email" id="email" name="email" placeholder="jane@yourbusiness.com" required /></div>
            <div className="fg">
              <label htmlFor="division">Which division? *</label>
              <select id="division" name="division" required value={formDiv} onChange={(e) => { setFormDiv(e.target.value); if (isHome) { setPicked(true); setActive(e.target.value) } }}>
                {DIVISIONS.map((x) => <option key={x.key} value={x.key}>{x.name}</option>)}
              </select>
            </div>
            <div className="fg">
              <label htmlFor="need">What do you need? *</label>
              <select id="need" name="need" required defaultValue="" key={formDiv}>
                <option value="" disabled>Select a service</option>
                {ENQUIRY[formDiv].map((o) => <option key={o}>{o}</option>)}
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
            <p><strong>SphereCode Solutions</strong> — three divisions, one team. We build your website, run your operations, and staff your admin.</p>
            <div className="foot-social">
              {SOCIAL.map(({ n, href, I }) => (
                <a key={n} href={href} target="_blank" rel="noopener noreferrer" aria-label={'SphereCode on ' + n} title={n}>
                  <I />
                </a>
              ))}
            </div>
          </div>
          <div className="foot-cols mono">
            <div className="fcol">
              <h5>Divisions</h5>
              {DIVISIONS.map((x) => (
                <a key={x.key} href={divHref(x)} onClick={(e) => pick(e, x.key)}>{x.name}</a>
              ))}
            </div>
            <div className="fcol"><h5>Offers</h5>
              {DIVISIONS.map((x) => (
                <a key={x.key} href={divHref(x) + '#offer'} onClick={(e) => pick(e, x.key)}>{x.lead.label}</a>
              ))}
            </div>
            <div className="fcol"><h5>Company</h5><a href={BASE + 'about/'}>About Us</a><a href={BASE + 'careers/'}>Careers</a><a href={BASE + 'ai-content/'}>AI Content</a><a href={BASE + '#work'}>Portfolio</a><a href="#contact">Contact</a><a href="#top">Top ↑</a></div>
          </div>
        </div>
        <div className="foot-mark">SPHERECODE</div>
        <div className="foot-bottom mono">
          <span>© 2026 SphereCode Solutions · Peshawar &amp; Islamabad, Pakistan. All rights reserved.</span>
          <span><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></span>
        </div>
      </footer>

      {/* STICKY DIVISION RAIL */}
      <div className={'rail' + (rail && !menu ? ' show' : '')}>
        {DIVISIONS.map((x) => (
          <a
            key={x.key} href={divHref(x)} style={{ '--dc': x.accRgb }}
            aria-current={x.key === active ? 'page' : undefined}
            className={x.key === active ? 'on' : ''} onClick={(e) => pick(e, x.key)}
          >{x.short}</a>
        ))}
      </div>
    </div>
  )
}
