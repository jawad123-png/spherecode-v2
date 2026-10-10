import { PAGES } from '../seo.js'

/* =====================================================================
   SphereCode — the three divisions.
   All per-division content lives here so copy edits never touch layout.
   To reskin a division you only need: accRgb / acc2Rgb + the text below.
   ===================================================================== */

/* ---- procedural line-art glyphs (they draw themselves on in) ----
   Every stroked element carries data-draw and pathLength="1". pathLength makes
   the browser treat the shape as exactly 1 unit long whatever its real geometry,
   so the CSS can dash it with 1/1 and never come out broken into segments. */

function GlyphWeb() {
  return (
    <svg viewBox="0 0 104 84" role="img" aria-label="Web development">
      <rect data-draw pathLength="1" x="6" y="10" width="92" height="64" rx="5" />
      <path data-draw pathLength="1" d="M6 26 H98" />
      <circle data-fill cx="16" cy="18" r="2.4" />
      <circle data-fill cx="24" cy="18" r="2.4" />
      <circle data-fill cx="32" cy="18" r="2.4" />
      <path data-draw pathLength="1" d="M42 40 L32 52 L42 64" />
      <path data-draw pathLength="1" d="M62 40 L72 52 L62 64" />
      <path data-draw pathLength="1" d="M55 38 L49 66" />
    </svg>
  )
}

function GlyphBpo() {
  /* a pod: one team lead at the centre, agents on the ring */
  const seats = [0, 60, 120, 180, 240, 300]
  return (
    <svg viewBox="0 0 104 84" role="img" aria-label="BPO services">
      <circle data-draw pathLength="1" cx="52" cy="42" r="23" />
      <circle data-fill cx="52" cy="42" r="7" />
      {seats.map((deg, i) => {
        const r = (deg * Math.PI) / 180
        const x = 52 + Math.cos(r) * 35
        const y = 42 + Math.sin(r) * 29
        return (
          <g key={deg}>
            <path data-draw pathLength="1"
              d={`M${52 + Math.cos(r) * 23} ${42 + Math.sin(r) * 23} L${x} ${y}`} />
            <circle data-pulse cx={x} cy={y} r="4.6" fill="rgb(var(--dc))" />
          </g>
        )
      })}
    </svg>
  )
}

function GlyphVa() {
  /* a cleared checklist + the clock it gives you back */
  return (
    <svg viewBox="0 0 104 84" role="img" aria-label="Virtual assistants">
      <rect data-draw pathLength="1" x="10" y="8" width="56" height="68" rx="5" />
      <path data-draw pathLength="1" d="M28 8 h20" />
      {[26, 40, 54].map((y, i) => (
        <g key={y}>
          <path data-draw pathLength="1" d={`M20 ${y} l4 4 l7 -8`} />
          <path data-draw pathLength="1" d={`M37 ${y + 1} H56`} />
        </g>
      ))}
      <circle data-draw pathLength="1" cx="80" cy="56" r="17" />
      <path data-draw pathLength="1" d="M80 46 V56 L88 60" />
      <circle data-fill cx="80" cy="56" r="2" />
    </svg>
  )
}

/* ===================================================================== */

const BASE = [
  /* ------------------------------------------------------------------ */
  {
    key: 'web',
    code: 'D-01',
    short: 'Web',
    name: 'Web Development',
    verb: 'We build it.',
    line: 0,                        // which hero headline line lights up
    accRgb: '55,224,255',           // cyan
    acc2Rgb: '143,123,255',         // violet
    glyph: <GlyphWeb />,
    navMid: 'WEB · APPS · SYSTEMS',
    blurb: 'Websites, online stores and custom systems — designed to convert, built fast, and yours to own.',
    panel: 'web',
    typedShort: 'Websites, Shopify stores and custom systems — built fast, built to convert.',
    typed: 'We design high-converting websites and build custom systems — Shopify stores, web apps and clinic management platforms — fast, modern, and built to drive real results.',
    stats: [{ n: 100, suffix: '+', l: 'Sites Delivered' }, { n: 98, suffix: '%', l: 'Satisfaction' }, { n: 7, l: 'Days Avg. Launch' }],
    marquee: ['Custom Websites', 'E-Commerce', 'Shopify', 'Web Apps', 'Custom Systems', 'Clinic Software', 'SEO', 'Branding'],

    maniNote: 'Most websites look good. Ours are built to generate leads, bookings and revenue from day one — no page builders, no stock templates.',
    maniBig: <>Your website should <span className="stroke">make you money</span> — not just look good.</>,
    maniNoteR: "And it's not just websites — we build full systems too: web apps, dashboards and internal tools like clinic management platforms. Custom-designed, built to convert, and yours to own.",

    servicesLabel: 'What We Build',
    services: [
      { t: 'E-Commerce Websites', badge: 'Most Popular', d: 'Custom online stores with seamless checkout, inventory management and mobile-first design — built to convert browsers into buyers.' },
      { t: 'Landing Pages', d: 'High-converting single-page sites for launches, campaigns and lead generation — CRO-optimised, A/B ready, live in days.' },
      { t: 'Web Apps & Systems', d: 'Full custom systems — clinic & practice management, client portals, dashboards, booking and internal tools with auth, roles, reporting and backups, built to spec.' },
      { t: 'Brand & Design', d: 'Logo design, brand identity and visual systems so your whole online presence looks cohesive and professional.' },
      { t: 'SEO & Growth', d: 'On-page SEO, local search optimisation and speed tuning so your site ranks and loads fast on every device.' },
      { t: 'Maintenance & Support', d: 'Managed hosting, monthly backups, security monitoring and content updates — so your site stays fast, safe and current.' },
    ],

    deep: {
      label: 'Shopify Partner Agency',
      big: <>Shopify &amp; <span className="ok">E-Commerce</span> Specialists</>,
      lede: "Whether you're launching a brand-new store or migrating from WooCommerce, Wix or Squarespace — our Shopify team handles it all.",
      feats: [
        { t: 'Custom Theme Design', d: 'A store that looks like your brand — not like every other Shopify site on the internet.' },
        { t: 'Optimised App Stack', d: 'The right tools for reviews, loyalty and upsells — set up and ready to drive more revenue.' },
        { t: 'Platform Migrations', d: 'Move from WooCommerce, Wix or Squarespace with zero downtime and every SEO ranking preserved.' },
        { t: 'Shopify Plus', d: 'Launch or scale your store without technical headaches — we handle everything end to end.' },
      ],
      cta: 'Talk to a Shopify Expert',
      visual: 'store',
    },

    processLabel: 'How It Works',
    processTitle: <>FROM IDEA TO<br /><span className="stroke">LIVE SITE</span></>,
    processSub: <>Most projects go live in <b>7–14 days.</b> You&rsquo;ll see a working design before a single line of code is written.</>,
    process: [
      { n: 'Discovery Call', d: 'We learn about your business, goals and audience. You get a clear proposal with timeline and cost.', s: 'DAY 0' },
      { n: 'Design', d: 'We design your site in Figma. You review and approve every page before a single line of code is written.', s: 'DAY 1–4' },
      { n: 'Build & Test', d: 'We build on staging, test across all devices, and run performance & accessibility checks.', s: 'DAY 4–10' },
      { n: 'Launch', d: 'Your site goes live. We handle domain, SSL, redirects and submit to Google Search Console.', s: 'DAY 7–14' },
    ],

    pricing: {
      mode: 'price',
      anchor: <>Most clients invest between <b>$1,000 – $3,000</b> depending on their needs.</>,
      note: 'No long-term contracts. One-time project pricing. Every package includes mobile-optimised design & SEO setup.',
      tiers: [
        { n: 'Launch', d: 'Get online fast — clean, professional and ready to take enquiries.', from: '$1,000', feat: ['Up to 3 pages', 'Mobile-optimised design', 'Contact / booking form', 'Basic SEO setup', 'Fast delivery (7–10 days)', '14 days support'], cta: 'Get Started' },
        { n: 'Growth', d: 'Designed to increase leads, bookings or sales from day one.', from: '$2,000', feat: ['Up to 12 pages', 'E-commerce or booking system', 'Custom design (no templates)', 'CMS / blog', 'Conversion-focused structure', 'Speed optimisation', '30 days support'], cta: 'Get Started', primary: true, badge: 'Most Popular' },
        { n: 'Scale+', d: 'Advanced builds for brands ready to dominate their market.', from: '$4,000', feat: ['Unlimited pages', 'Advanced e-commerce / custom builds', 'Payment, CRM & API integrations', 'Performance optimisation', 'CRO (conversion rate optimisation)', 'Priority delivery', '60–90 days support'], cta: "Let's Talk" },
      ],
    },

    lead: {
      type: 'audit',
      nav: 'Free Audit',
      label: 'Free Site Audit',
      kicker: 'Free · No Strings',
      h: <>FREE 60-SECOND <em>SITE AUDIT</em></>,
      sub: 'Already have a website? Tell us the address and we will put it through the same checks we run before every rebuild — speed, mobile layout, SEO basics and conversion blockers.',
      list: ['Load speed on mobile and desktop', 'Mobile layout and tap-target problems', 'On-page SEO and metadata gaps', 'The 3 changes we would make first'],
      fine: 'No call required. One email, no sequence. If your site is already in good shape we will tell you that too.',
      boxH: 'Run the audit',
    },
  },

  /* ------------------------------------------------------------------ */
  {
    key: 'bpo',
    code: 'D-02',
    short: 'BPO',
    name: 'BPO Services',
    verb: 'We run it.',
    line: 1,
    accRgb: '255,168,61',           // amber
    acc2Rgb: '255,107,107',         // coral
    glyph: <GlyphBpo />,
    navMid: 'SUPPORT · SALES · BACK-OFFICE',
    blurb: 'Dedicated offshore teams running your support, sales and back-office — your SLAs, your scripts, our people.',
    panel: 'ops',
    typedShort: 'Dedicated offshore teams running your support, sales and back-office, 24/7.',
    typed: 'We build and manage dedicated offshore teams that run your support, sales and back-office operations around the clock — trained on your tools, measured against your SLAs, reported on every week.',
    stats: [{ v: '24/7', l: 'Floor Coverage' }, { n: 6, l: 'Languages' }, { n: 14, l: 'Days To Go Live' }],
    marquee: ['Customer Support', 'Live Chat', 'Inbound Sales', 'Lead Qualification', 'Back-Office', 'Data Processing', 'Helpdesk', 'QA'],

    maniNote: 'Hiring in-house for support means job ads, training, payroll, cover for sick days and a floor to sit them on. We hand you the finished team instead.',
    maniBig: <>Stop staffing a support desk. <span className="stroke">Start owning the outcome.</span></>,
    maniNoteR: 'Every pod is dedicated to you — not shared across five clients. Your scripts, your CRM, your brand voice, a named team lead, and weekly numbers you can hold us to.',

    servicesLabel: 'What We Run',
    services: [
      { t: 'Customer Support', badge: 'Most Popular', d: 'Phone, email, live chat and social — handled in your brand voice by trained agents, covered around the clock.' },
      { t: 'Inbound & Outbound Sales', d: 'Lead qualification, appointment setting and closing teams working inside your CRM, to your scripts and targets.' },
      { t: 'Back-Office & Data', d: 'Order processing, data entry, claims handling, moderation and document workflows with QA checks built into every batch.' },
      { t: 'Technical Helpdesk', d: 'Tier 1 and Tier 2 support for software and hardware products, with escalation paths and response times you define.' },
      { t: 'Finance & Admin', d: 'Invoicing, reconciliation, collections, payroll admin and recurring reporting handled by a dedicated pod.' },
      { t: 'QA & Reporting', d: 'Call scoring, CSAT tracking and weekly performance reporting, so you always know exactly what the team is doing.' },
    ],

    deep: {
      label: 'Inside a Pod',
      big: <>A <span className="ok">Dedicated Pod</span>, Not A Shared Queue</>,
      lede: 'Your agents work only on your account. They learn your product, your tone and your edge cases — and they stay with you, so the knowledge compounds instead of resetting every month.',
      feats: [
        { t: 'Dedicated, Not Shared', d: 'Your agents are assigned to you alone. No queue-hopping between five other brands mid-shift.' },
        { t: 'Your Tools, Your Scripts', d: 'We work inside your CRM, helpdesk and knowledge base. Nothing to migrate, nothing new for your team to learn.' },
        { t: 'Team Lead Included', d: 'Every pod of five or more comes with a named team lead who handles scheduling, QA and your weekly report.' },
        { t: 'Cover Built In', d: 'Holidays, sickness and peak-season spikes are our problem to solve, not a gap in your coverage.' },
      ],
      cta: 'Scope a Pod',
      visual: 'pod',
    },

    processLabel: 'How We Onboard',
    processTitle: <>FROM SCOPE TO<br /><span className="stroke">LIVE FLOOR</span></>,
    processSub: <>Most pods are live in <b>14 days.</b> You see real numbers from a paid pilot week before you commit to headcount.</>,
    process: [
      { n: 'Scope & SLA', d: 'We map the process, agree volumes, SLAs and reporting, and write the playbook your team will work from.', s: 'DAY 0–3' },
      { n: 'Recruit & Train', d: 'We hire to your profile, train on your tools and systems, and certify every agent before they touch live work.', s: 'DAY 3–12' },
      { n: 'Pilot Week', d: 'A small team runs live work at a reduced pilot rate, with daily reporting — so you judge on results, not promises.', s: 'WEEK 3' },
      { n: 'Scale & Manage', d: 'The pod grows to agreed headcount with a named team lead, QA scoring and weekly performance reviews.', s: 'ONGOING' },
    ],

    pricing: {
      mode: 'quote',
      anchor: <>Priced per seat, per month — scoped to <b>your volumes, hours and SLAs.</b></>,
      note: 'No per-ticket surprises and no long lock-ins. Pricing depends on headcount, shift pattern, language and skill level — so we quote it properly rather than guess.',
      tiers: [
        { n: 'Starter Pod', d: 'One process, a small team, proof before you scale.', scope: 'Team size', size: '2 – 5', unit: 'agents · one shift', feat: ['One process, fully documented', 'Business-hours coverage', 'Shared team lead', 'Weekly performance report', 'Month-to-month'], cta: 'Request a Quote' },
        { n: 'Dedicated Team', d: 'A full pod on your account, with its own lead and QA.', scope: 'Team size', size: '6 – 20', unit: 'agents · multi-shift', feat: ['Multiple processes', 'Extended or 24/7 coverage', 'Named team lead included', 'QA scoring + CSAT tracking', 'Custom SLAs', 'Holiday & sickness cover'], cta: 'Request a Quote', primary: true, badge: 'Most Popular' },
        { n: 'Enterprise Floor', d: 'Multi-team operations with management layer and reporting stack.', scope: 'Team size', size: '20+', unit: 'agents · 24/7', feat: ['Multi-team, multi-process', 'Operations manager assigned', 'Custom reporting dashboards', 'Security & compliance review', 'Business continuity plan', 'Quarterly business reviews'], cta: "Let's Talk" },
      ],
    },

    lead: {
      type: 'apply',
      nav: 'Pilot Week',
      label: 'Pilot Week Offer',
      kicker: 'Low-Risk Pilot',
      h: <>ONE-WEEK <em>PILOT</em> AT A REDUCED RATE</>,
      sub: 'Do not take our word for it — buy one week. We staff a small team on one of your real processes at a reduced pilot rate, report daily, and hand you the numbers at the end. Walk away or scale up.',
      list: ['One real process, fully scoped before we start', 'A small dedicated team, trained on your tools', 'Daily reporting — volumes, response times, quality', 'Results review on day 5, with honest recommendations', 'No notice period and no obligation to continue'],
      fine: 'Reduced pilot rate quoted up front against your volumes. If the pilot does not hit the targets we agreed, you do not continue — and we will tell you if we think outsourcing is the wrong answer for your process.',
      boxH: 'Apply for a pilot week',
      fields: [
        { k: 'company', l: 'Company', ph: 'Your company name', req: true },
        { k: 'process', l: 'What should we pilot?', ph: 'e.g. live chat support, order processing, outbound calls', req: true, area: true },
      ],
      btn: 'Apply for Pilot →',
      okTitle: 'Pilot request received.',
      okBody: 'We will come back within one working day with a scoped pilot plan and the reduced rate for your volumes.',
    },
  },

  /* ------------------------------------------------------------------ */
  {
    key: 'va',
    code: 'D-03',
    short: 'VA',
    name: 'Virtual Assistants',
    verb: 'We staff it.',
    line: 2,
    accRgb: '52,230,170',           // mint
    acc2Rgb: '55,224,255',          // cyan
    glyph: <GlyphVa />,
    navMid: 'ADMIN · INBOX · OPERATIONS',
    blurb: 'Vetted assistants who take the admin, inbox and calendar off your plate — matched to you in 72 hours.',
    panel: 'desk',
    typedShort: 'A vetted assistant takes your admin, inbox and calendar — matched in 72 hours.',
    typed: 'We match you with a vetted virtual assistant who takes the admin, inbox, calendar and follow-ups off your plate — shortlisted in 72 hours, trialled free for a week, managed by us from there.',
    stats: [{ v: '72h', l: 'To Shortlist' }, { v: '20h', l: 'Free Trial' }, { n: 100, suffix: '%', l: 'Vetted & Trained' }],
    marquee: ['Executive Assistants', 'Inbox Zero', 'Calendar', 'Customer Service', 'Social Media', 'Bookkeeping', 'Research', 'Lead Gen'],

    maniNote: 'You did not start a business to spend your week on inbox triage, calendar tetris and chasing invoices. Those hours are the cheapest ones to buy back.',
    maniBig: <>The admin is not the work. <span className="stroke">Give it away.</span></>,
    maniNoteR: 'We shortlist, you interview, you choose. Then we keep managing them — training, cover, quality and replacement — so you get an assistant, not a hiring project.',

    servicesLabel: 'What They Take Over',
    services: [
      { t: 'Executive Assistant', badge: 'Most Popular', d: 'Calendar, inbox, travel, follow-ups and prep — handled by one dedicated assistant who learns how you work.' },
      { t: 'Inbox & Calendar', d: 'Zero-inbox discipline, scheduling across time zones, and your day’s priorities on your desk before you start it.' },
      { t: 'Customer Service VA', d: 'Replies to your customers, handles orders and returns, and keeps reviews, DMs and enquiries answered the same day.' },
      { t: 'Social Media & Content', d: 'Scheduling, captions, light design, community replies and a monthly content calendar you approve in one sitting.' },
      { t: 'Bookkeeping & Admin', d: 'Receipts, expense logs, invoice chasing and tidy books in Xero or QuickBooks — reconciled every single week.' },
      { t: 'Research & Lead Gen', d: 'Prospect lists, data enrichment, competitor research and outreach sequences built to your ideal-client profile.' },
    ],

    deep: {
      label: 'How Matching Works',
      big: <>You <span className="ok">Choose</span> Them. We Keep Managing Them.</>,
      lede: 'Most agencies assign you whoever is free. We shortlist against your tools, your time zone and your industry, let you interview, and stay responsible for quality after you say yes.',
      feats: [
        { t: 'Shortlisted, Not Assigned', d: 'You interview two or three matched candidates and pick the one you actually want to work with.' },
        { t: 'Overlap With Your Hours', d: 'Matched to your time zone so there are real overlapping hours — not a handover note at midnight.' },
        { t: 'Backup Assistant Included', d: 'A trained second assistant knows your account, so holidays and sick days do not land back on you.' },
        { t: 'Managed, Not Just Placed', d: 'We handle training, quality checks and replacement. If it is not working, we fix it — at no cost to you.' },
      ],
      cta: 'Get Matched',
      visual: 'match',
    },

    processLabel: 'How It Works',
    processTitle: <>FROM OVERLOADED TO<br /><span className="stroke">HANDED OVER</span></>,
    processSub: <>Shortlist in <b>72 hours</b>, free trial week after that. You keep everything your assistant produces either way.</>,
    process: [
      { n: 'Task Audit', d: 'A 30-minute call to list everything on your plate. We mark what an assistant can take over in week one.', s: 'DAY 0' },
      { n: 'Matched', d: 'We shortlist assistants against your tools, time zone and industry. You interview them, and you pick.', s: 'WITHIN 72H' },
      { n: 'Free Trial Week', d: '20 hours free on real work. No card, no contract — and you keep everything produced either way.', s: 'WEEK 1' },
      { n: 'Onboard & Scale', d: 'Agreed hours, a shared task board, weekly check-ins, and a backup assistant trained on your account.', s: 'ONGOING' },
    ],

    pricing: {
      mode: 'quote',
      anchor: <>Priced per month on <b>hours and skill level</b> — part-time through to a small team.</>,
      note: 'No recruitment fee and no lock-in. What you pay depends on hours, time zone overlap and how specialised the work is — so we quote against your actual task list.',
      tiers: [
        { n: 'Part-Time', d: 'Enough to clear the admin and get your evenings back.', scope: 'Commitment', size: '20 hrs', unit: 'per week · one assistant', feat: ['One dedicated assistant', 'Inbox, calendar and admin', 'Shared task board', 'Weekly check-in', 'Month-to-month'], cta: 'Request a Quote' },
        { n: 'Full-Time', d: 'A real right hand, inside your business every working day.', scope: 'Commitment', size: '40 hrs', unit: 'per week · one assistant', feat: ['One dedicated full-time assistant', 'Time-zone overlap with you', 'Backup assistant trained', 'SOPs written as they go', 'Monthly performance review', 'Free replacement if needed'], cta: 'Request a Quote', primary: true, badge: 'Most Popular' },
        { n: 'VA Team', d: 'Several assistants across admin, support and marketing.', scope: 'Commitment', size: '2+', unit: 'assistants · managed', feat: ['Multiple specialised assistants', 'Account manager assigned', 'Documented SOP library', 'Consolidated reporting', 'Priority replacement', 'Scale hours up or down monthly'], cta: "Let's Talk" },
      ],
    },

    lead: {
      type: 'apply',
      nav: 'Free Trial',
      label: 'Free Trial Hours',
      kicker: 'No Card Required',
      h: <>20 FREE <em>VA HOURS</em></>,
      sub: 'Send us your task list and we will put a matched assistant on it for 20 hours, free. Real work, real output, no card and no contract — and whatever they produce is yours to keep.',
      list: ['Matched to your tools, industry and time zone', 'A real assistant on real work, not a demo', '20 hours across five working days', 'Everything produced is yours to keep', 'No card required and nothing to cancel'],
      fine: 'One free trial per business. If the match is not right we will swap the assistant once during the trial at no cost. If a VA is not the answer for your task list, we will say so.',
      boxH: 'Claim your 20 hours',
      fields: [
        { k: 'company', l: 'Company / role', ph: 'e.g. founder, 6-person agency', req: true },
        { k: 'tasks', l: 'What would you hand over first?', ph: 'e.g. inbox triage, scheduling, invoice chasing, DMs', req: true, area: true },
      ],
      btn: 'Claim 20 Hours →',
      okTitle: 'Trial request received.',
      okBody: 'We will send two or three matched assistants for you to meet within 72 hours, then start the 20 free hours whenever you are ready.',
    },
  },
]

/* Each division is merged with its page-level SEO record (slug, title,
   description, H1 and FAQ) from src/seo.js, which the build-time page
   generator reads too — so the <head> of /bpo and the FAQ rendered on it
   can never drift apart. */
const SEO = Object.fromEntries(PAGES.map((p) => [p.key, p]))
export const DIVISIONS = BASE.map((d) => ({ ...d, ...SEO[d.key] }))
export const BY_KEY = Object.fromEntries(DIVISIONS.map((d) => [d.key, d]))
