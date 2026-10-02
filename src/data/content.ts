// All page copy lives here so sections stay presentational.
// Bracketed values like [YOUR PRICE] are intentional placeholders from the
// design reference — replace them with real details before launch.

export const site = {
  name: 'BarkBytes',
  legalName: 'BarkBytes IT Solutions Inc.',
  location: 'Manila, Philippines',
  email: '[YOUR EMAIL]',
  /** Set to the Facebook page's m.me link once available. */
  messengerUrl: null as string | null,
  year: 2026,
};

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Our work' },
  { id: 'how', label: 'How we work' },
  { id: 'team', label: 'Team' },
];

export const heroPoints = ['Fixed prices, no hourly surprises', 'Try a live demo first', 'Data Privacy Act–ready'];

export const integrations = ['Messenger', 'GCash', 'Maya', 'Google Sheets', 'Gmail', 'Telegram', 'Supabase'];

export type Service = {
  id: string;
  number: string;
  badge: string;
  title: string;
  description: string;
  goodFor: string;
  price: string;
};

export const services: Service[] = [
  {
    id: 'messenger-bot',
    number: '01',
    badge: 'Live in days',
    title: 'Messenger order and inquiry bot',
    description: "Answers FAQs, takes orders, and alerts you on Telegram, right inside your Facebook page's Messenger.",
    goodFor: 'refilling stations, food sellers, salons, resellers',
    price: 'From [YOUR PRICE]',
  },
  {
    id: 'booking',
    number: '02',
    badge: 'Proven at live events',
    title: 'Booking, ticketing, and payments',
    description:
      'Booking pages, GCash and Maya payments, QR e-tickets sent by email, and a door-scanning dashboard for check-in.',
    goodFor: 'events, resorts, studios, clinics, tutoring centers',
    price: 'From [YOUR PRICE]',
  },
  {
    id: 'reports',
    number: '03',
    badge: 'Great add-on',
    title: 'Reports and receipt automation',
    description:
      'Daily or weekly sales summaries to Telegram or email, receipts and invoices captured into spreadsheets, and simple dashboards.',
    goodFor: 'owners who still total sales by hand',
    price: 'From [YOUR PRICE]',
  },
  {
    id: 'landing-page',
    number: '04',
    badge: 'Fastest start',
    title: 'Landing page',
    description:
      'A fast, mobile-first page with an inquiry form that sends leads to Telegram, email, or Sheets, plus a Messenger button, share previews, and domain setup.',
    goodFor: 'new businesses, events, promos',
    price: 'From [YOUR PRICE]',
  },
  {
    id: 'custom-apps',
    number: '05',
    badge: 'Fixed milestones',
    title: 'Custom apps and web systems',
    description:
      'Android and iOS apps from one codebase, and custom web apps with dashboards, logins, user roles, and payments.',
    goodFor: 'ordering apps, booking platforms, portals, internal tools',
    price: 'Quoted after a scoping session',
  },
  {
    id: 'workspace',
    number: '06',
    badge: '2–5 day sprints',
    title: 'Google Workspace automation',
    description:
      'Automations inside the Sheets, Forms, Gmail, and Drive you already use: auto invoices, quotations, certificates, trackers, approvals, and scheduled reports.',
    goodFor: 'teams that already run on spreadsheets',
    price: 'From [YOUR PRICE] per workflow',
  },
];

export const bundle = {
  id: 'bundle',
  eyebrow: 'Popular bundle',
  title: 'Landing page + Messenger bot.',
  description: 'The page brings customers in, and the bot answers them, even after hours.',
  cta: 'Ask about the bundle',
  interestLabel: 'Landing page + Messenger bot bundle',
};

export type Project = {
  id: 'booking' | 'bot';
  client: string;
  title: string;
  description: string;
  tags: string[];
  result: string;
  visualLabel: string;
};

export const projects: Project[] = [
  {
    id: 'booking',
    client: 'Exclusives PH · Events',
    title: 'Event booking with GCash payments and QR tickets',
    description:
      'Guests book online, pay with GCash or Maya, and get a QR e-ticket by email. Staff scan tickets at the door from a live dashboard. Built to handle real event-night traffic.',
    tags: ['Booking', 'PayMongo', 'QR e-tickets', 'Door scanning'],
    result: '[e.g., tickets sold, check-in time]',
    visualLabel:
      'Illustration of an event booking page with GCash and Maya payment options, next to a door-scanning dashboard checking in a QR e-ticket.',
  },
  {
    id: 'bot',
    client: 'Water refilling station · Retail',
    title: 'A Messenger bot that takes orders around the clock',
    description:
      'Customers message the page to ask questions or order. The bot answers FAQs, logs every order to Google Sheets, and pings the owner on Telegram.',
    tags: ['Messenger', 'AI FAQ replies', 'Google Sheets', 'Telegram alerts'],
    result: '[e.g., orders handled per week, hours saved]',
    visualLabel:
      'Illustration of a Messenger order conversation beside a Google Sheets order log and a Telegram alert to the owner.',
  },
];

export const steps = [
  {
    title: 'Tell us your routine',
    body: "Share what you do by hand every day. We'll suggest the smallest fix that saves the most time.",
  },
  {
    title: 'Try a live demo',
    body: 'Click through a working version with sample data before you commit. A demo, not just a pitch.',
  },
  {
    title: 'We build at a fixed price',
    body: 'Clear scope, set milestones, and a deposit up front. No open-ended hourly billing.',
  },
  {
    title: 'Launch, then we look after it',
    body: 'A one-time setup fee, then an optional monthly plan for fixes, updates, and small changes.',
  },
];

export const trustPoints = [
  {
    icon: 'shield' as const,
    title: "Your customers' data, handled properly",
    body: 'We follow Data Privacy Act basics on every build: consent, secure storage, and a clear privacy notice.',
  },
  {
    icon: 'key' as const,
    title: 'You own what we build',
    body: 'Accounts, code, and scripts stay in your name, with a documented handover of what each part does.',
  },
];

export const team = [
  { initials: 'CJ', name: 'CJ', role: 'Automation, backend, and APIs' },
  { initials: 'R', name: 'Rodney', role: 'Reports, dashboards, and Google Workspace automation' },
  { initials: 'J', name: 'Jhon', role: 'Brand, UI/UX, and mobile apps' },
  { initials: 'K', name: 'Kit', role: 'Quality assurance, testing, and mobile apps' },
  { initials: 'JP', name: 'John Phillip', role: 'Websites and frontend development' },
];

export const interestOptions = ['Not sure yet', ...services.map((s) => s.title), bundle.interestLabel];

export type ChatMessage = { from: 'customer' | 'bot'; text: string };

export const demoConversation: ChatMessage[] = [
  { from: 'customer', text: 'Hi! Pa-order po 3 slim gallons, deliver sa 14 Rizal St.' },
  { from: 'bot', text: 'Got it! 3 slim gallons to 14 Rizal St. Total: [PRICE]. Reply YES to confirm.' },
  { from: 'customer', text: 'YES po' },
  { from: 'bot', text: "Order confirmed. Salamat po! We'll message you when the rider leaves." },
];
