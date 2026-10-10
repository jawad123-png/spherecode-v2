/* =====================================================================
   Page-level SEO copy — ONE source of truth.

   Read at runtime by src/ui/divisions.jsx (so the FAQ and H1 rendered on
   a page come from here) and at build time by scripts/gen-pages.mjs (so
   the <title>, description, canonical, Open Graph and FAQPage structured
   data in each generated HTML file come from here too). Editing a line
   here updates the page and its <head> together.

   Keep titles ~60 characters and descriptions ~155, or Google truncates.
   ===================================================================== */

export const SITE = 'https://spherecode.dev'
export const BRAND = 'SphereCode Solutions'

export const HOME = {
  slug: '',
  title: 'SphereCode \u2014 Web Development, BPO & Virtual Assistants',
  desc: 'Websites and custom systems, dedicated offshore support teams, and vetted virtual assistants \u2014 three divisions, one team. Free audit, pilot or trial.',
  h1: 'Web development, BPO services and virtual assistants',
}

export const PAGES = [
  {
    key: 'web',
    slug: 'web',
    title: 'Web Development & Shopify Agency | SphereCode',
    desc: 'Custom websites, Shopify stores, landing pages and web apps built to convert. Most projects live in 7-14 days. Free 60-second site audit.',
    h1: 'Web development, Shopify stores and custom web apps',
    faq: [
      ['How much does a website cost?',
       'Most clients invest between $1,000 and $3,000. Launch starts at $1,000 for up to 3 pages, Growth at $2,000 for e-commerce or booking systems, and Scale+ at $4,000 for advanced custom builds.'],
      ['How long does it take to build a website?',
       'Most projects go live in 7 to 14 days. You see a working design in Figma and approve every page before a single line of code is written.'],
      ['Do you build Shopify stores and handle migrations?',
       'Yes. We build custom Shopify themes and migrate from WooCommerce, Wix or Squarespace with zero downtime and every SEO ranking preserved.'],
      ['Can you build custom web apps, not just websites?',
       'Yes. We build full systems — client portals, dashboards, booking and internal tools with auth, roles, reporting and backups, including clinic and practice management platforms.'],
    ],
  },
  {
    key: 'bpo',
    slug: 'bpo',
    title: 'BPO Services & Dedicated Offshore Teams | SphereCode',
    desc: 'Dedicated offshore teams running your customer support, sales and back-office. Your tools, your SLAs, a named team lead. Most pods live in 14 days.',
    h1: 'BPO services and dedicated offshore support teams',
    faq: [
      ['What is BPO and what can you take over?',
       'Business process outsourcing means we run a process for you with our own staff. We cover customer support, inbound and outbound sales, back-office and data work, technical helpdesk, finance admin, and QA and reporting.'],
      ['How is a pod priced?',
       'Per seat, per month, scoped to your volumes, hours, language and skill level. Because those vary so widely we quote against your actual requirements rather than publishing a rate.'],
      ['Can we try it before committing to headcount?',
       'Yes. We run a one-week pilot at a reduced rate on one real process, with daily reporting and a results review on day five. It is a paid pilot, not a free trial.'],
      ['How quickly can a team be live?',
       'Most pods are live in 14 days: scope and SLAs in days 0 to 3, recruiting and training days 3 to 12, then the pilot week.'],
      ['Is the team dedicated to us or shared?',
       'Dedicated. Your agents work only on your account, inside your CRM and helpdesk, to your scripts. Every pod of five or more comes with a named team lead.'],
    ],
  },
  {
    key: 'va',
    slug: 'virtual-assistants',
    title: 'Hire a Vetted Virtual Assistant | SphereCode',
    desc: 'Vetted virtual assistants for admin, inbox, calendar, bookkeeping and research. Shortlisted in 72 hours, 20 free trial hours, managed by us throughout.',
    h1: 'Virtual assistant services for admin, inbox and calendar',
    faq: [
      ['How much does a virtual assistant cost?',
       'Priced monthly on hours and skill level, from part-time at 20 hours a week through full-time at 40 hours to a small team of specialised assistants. We quote against your actual task list, with no recruitment fee and no lock-in.'],
      ['How long does it take to get matched?',
       'We shortlist candidates within 72 hours of your task-audit call. You interview two or three matched assistants and you choose.'],
      ['Is there a free trial?',
       'Yes. 20 free hours across five working days on real work. No card required, and everything your assistant produces is yours to keep either way.'],
      ['What can a virtual assistant actually do?',
       'Inbox and calendar management, customer service, social media and content scheduling, bookkeeping and invoice chasing, research and lead generation, plus general executive assistant work.'],
      ['What happens if the assistant is not a good fit?',
       'We replace them at no cost. We handle training, quality checks and cover, and a backup assistant is trained on your account so holidays and sick days do not land back on you.'],
    ],
  },
]
