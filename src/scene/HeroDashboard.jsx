import { useEffect, useRef, useState } from 'react'

export function useInView(ref) {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver((es) => { if (es[0].isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.25 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [ref])
  return seen
}

export function useCount(target, run, dur = 1600, dec = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf, st
    const step = (t) => {
      if (!st) st = t
      const p = Math.min(1, (t - st) / dur)
      setV((1 - Math.pow(1 - p, 3)) * target)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [run, target, dur])
  return dec ? v.toFixed(dec) : Math.round(v)
}

export default function HeroDashboard() {
  const ref = useRef(null)
  const run = useInView(ref)
  const rev = useCount(84240, run)
  const conv = useCount(4.8, run, 1600, 1)
  const orders = useCount(1243, run)

  return (
    <div className="dash-wrap" ref={ref}>
      <div className="dash">
        <div className="dash-chrome">
          <span className="dc-dots"><i /><i /><i /></span>
          <span className="dc-url mono">🔒 surkhab.store/admin/analytics</span>
        </div>
        <div className="dash-body">
          <div className="dash-head">
            <span className="dash-title mono">◈ Store Analytics</span>
            <span className="dash-live mono"><i />LIVE</span>
          </div>

          <div className="dash-metrics">
            <div className="dm"><span className="dm-l mono">Revenue</span><span className="dm-v">${Number(rev).toLocaleString()}</span><span className="dm-d up">↑ 143%</span></div>
            <div className="dm"><span className="dm-l mono">Conv. Rate</span><span className="dm-v">{conv}%</span><span className="dm-d up">↑ 0.8pp</span></div>
            <div className="dm"><span className="dm-l mono">Orders</span><span className="dm-v">{Number(orders).toLocaleString()}</span><span className="dm-d up">↑ 67%</span></div>
          </div>

          <div className="dash-chart">
            <div className="dc-title mono">Revenue — last 4 weeks</div>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" className={'dc-svg' + (run ? ' go' : '')}>
              <defs>
                <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="var(--cyan)" stopOpacity="0.38" />
                  <stop offset="1" stopColor="var(--cyan)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="300" y2="20" /><line x1="0" y1="40" x2="300" y2="40" /><line x1="0" y1="60" x2="300" y2="60" />
              <path className="dc-area" d="M0,72 C40,64 70,58 100,46 C130,34 150,52 180,30 C210,10 240,24 270,10 L300,6 L300,80 L0,80 Z" />
              <path className="dc-line" d="M0,72 C40,64 70,58 100,46 C130,34 150,52 180,30 C210,10 240,24 270,10 L300,6" />
              <circle className="dc-dot" cx="300" cy="6" r="3.4" />
            </svg>
            <div className="dc-labels mono"><span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span></div>
          </div>

          <div className="dash-prod">
            <div className="dp"><span className="dp-sw" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--pink))' }} /><span className="dp-info"><b>Summer Jacket</b><em className="mono">142 orders</em></span><span className="dp-rev">$8,530</span></div>
            <div className="dp"><span className="dp-sw" style={{ background: 'linear-gradient(135deg,var(--pink),var(--cyan))' }} /><span className="dp-info"><b>Graphic Tee</b><em className="mono">98 orders</em></span><span className="dp-rev">$3,920</span></div>
          </div>
        </div>
      </div>

      <div className="badge b1"><span className="bi">⚡</span><span className="bt"><b>99</b><em className="mono">Perf Score</em></span></div>
      <div className="badge b2"><span className="bi">🚀</span><span className="bt"><b>7 Days</b><em className="mono">To Launch</em></span></div>
      <div className="badge b3"><span className="bi">📈</span><span className="bt"><b>+143%</b><em className="mono">Conversion</em></span></div>
    </div>
  )
}

/* ============================================================
   BPO DIVISION — live operations panel
   Same .dash shell as the web dashboard, different readout.
   Swap for a real screenshot later: replace <HeroOps/> in Site.jsx
   with <img src="/images/hero-ops.png" alt="…" />
   ============================================================ */
const QUEUE = [
  { t: 'Billing dispute · #4821', a: 'Agent 04', s: 'Resolved', c: 'ok' },
  { t: 'Order tracking · #4822', a: 'Agent 11', s: 'In chat', c: 'now' },
  { t: 'Refund request · #4823', a: 'Agent 07', s: 'In chat', c: 'now' },
  { t: 'Tech escalation · #4824', a: 'Queued', s: '0:08', c: 'wait' },
]

export function HeroOps() {
  const ref = useRef(null)
  const run = useInView(ref)
  const solved = useCount(1480, run)
  const resp = useCount(41, run)
  const csat = useCount(4.9, run, 1600, 1)

  return (
    <div className="dash-wrap" ref={ref}>
      <div className="dash">
        <div className="dash-chrome">
          <span className="dc-dots"><i /><i /><i /></span>
          <span className="dc-url mono">🔒 ops.spherecode.dev/live-floor</span>
        </div>
        <div className="dash-body">
          <div className="dash-head">
            <span className="dash-title mono">◈ Live Floor · Support</span>
            <span className="dash-live mono"><i />32 AGENTS ON</span>
          </div>

          <div className="dash-metrics">
            <div className="dm"><span className="dm-l mono">Resolved today</span><span className="dm-v">{Number(solved).toLocaleString()}</span><span className="dm-d up">↑ 18%</span></div>
            <div className="dm"><span className="dm-l mono">Avg response</span><span className="dm-v">{resp}s</span><span className="dm-d up">↓ 62%</span></div>
            <div className="dm"><span className="dm-l mono">CSAT</span><span className="dm-v">{csat}/5</span><span className="dm-d up">↑ 0.6</span></div>
          </div>

          <div className="dash-chart">
            <div className="dc-title mono">Coverage — 24 hours, no gaps</div>
            <div className={'cov' + (run ? ' go' : '')}>
              {[62, 48, 40, 44, 58, 76, 92, 100, 96, 88, 80, 66].map((h, i) => (
                <i key={i} style={{ '--h': h + '%', animationDelay: 0.3 + i * 0.055 + 's' }} />
              ))}
            </div>
            <div className="dc-labels mono"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span></div>
          </div>

          <div className="qlist">
            {QUEUE.map((q) => (
              <div className="qrow" key={q.t}>
                <span className="qr-t">{q.t}</span>
                <span className="qr-a mono">{q.a}</span>
                <span className={'qr-s mono ' + q.c}>{q.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="badge b1"><span className="bi">🛡</span><span className="bt"><b>99.2%</b><em className="mono">SLA Met</em></span></div>
      <div className="badge b2"><span className="bi">🕑</span><span className="bt"><b>24/7</b><em className="mono">Coverage</em></span></div>
      <div className="badge b3"><span className="bi">🌐</span><span className="bt"><b>6</b><em className="mono">Languages</em></span></div>
    </div>
  )
}

/* ============================================================
   VA DIVISION — assistant desk panel
   Tasks tick themselves off one by one once in view.
   ============================================================ */
const TASKS = [
  'Clear inbox → 0 unread',
  'Reschedule Thursday calls',
  'Chase 3 unpaid invoices',
  'Draft weekly client report',
  'Book travel · Dubai trip',
]

export function HeroDesk() {
  const ref = useRef(null)
  const run = useInView(ref)
  const hours = useCount(27, run)
  const done = useCount(142, run)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!run) return
    let i = 0
    const id = setInterval(() => {
      i++
      setTick(i)
      if (i >= TASKS.length) clearInterval(id)
    }, 520)
    return () => clearInterval(id)
  }, [run])

  return (
    <div className="dash-wrap" ref={ref}>
      <div className="dash">
        <div className="dash-chrome">
          <span className="dc-dots"><i /><i /><i /></span>
          <span className="dc-url mono">🔒 desk.spherecode.dev/my-assistant</span>
        </div>
        <div className="dash-body">
          <div className="dash-head">
            <span className="dash-title mono">◈ Monday · Your Assistant</span>
            <span className="dash-live mono"><i />ONLINE</span>
          </div>

          <div className="dash-metrics">
            <div className="dm"><span className="dm-l mono">Hours saved</span><span className="dm-v">{hours}h</span><span className="dm-d up">this week</span></div>
            <div className="dm"><span className="dm-l mono">Tasks cleared</span><span className="dm-v">{done}</span><span className="dm-d up">↑ 31%</span></div>
            <div className="dm"><span className="dm-l mono">Inbox</span><span className="dm-v">0</span><span className="dm-d up">zero</span></div>
          </div>

          <div className="dash-chart">
            <div className="dc-title mono">Today&rsquo;s handover — {Math.min(tick, TASKS.length)}/{TASKS.length} done</div>
            <div className="tasks">
              {TASKS.map((t, i) => (
                <div className={'task' + (i < tick ? ' done' : '')} key={t}>
                  <span className="tk-box"><svg viewBox="0 0 12 12"><path d="M2.4 6.3 L4.7 8.6 L9.6 3.4" /></svg></span>
                  <span className="tk-t">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-prod">
            <div className="dp">
              <span className="dp-sw" style={{ background: 'linear-gradient(135deg,var(--cyan),var(--pink))' }} />
              <span className="dp-info"><b>Your assistant</b><em className="mono">Matched in 72h · full-time</em></span>
              <span className="dp-rev mono">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <div className="badge b1"><span className="bi">⏱</span><span className="bt"><b>27h</b><em className="mono">Saved / Week</em></span></div>
      <div className="badge b2"><span className="bi">🤝</span><span className="bt"><b>72h</b><em className="mono">To Match</em></span></div>
      <div className="badge b3"><span className="bi">🎁</span><span className="bt"><b>20h</b><em className="mono">Free Trial</em></span></div>
    </div>
  )
}
