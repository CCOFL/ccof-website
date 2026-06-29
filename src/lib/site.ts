/**
 * Single source of truth for site content & config.
 * All organizational copy is preserved verbatim from the brief (§1).
 */

export const ORG = {
  name: "The Children's Collective of Florida",
  legalName: "The Children's Collective of Florida, Inc.",
  abbr: "CCOF",
  tagline: "Powered by Community. Supporting Kids.",
  domain: "childrenscollectivefl.org",
  url: "https://childrenscollectivefl.org",
  email: "info@childrenscollectivefl.org",
  ein: "42-2020310",
  flReg: "CH83131",
  flDoc: "N26000005374",
  location: "Treasure Coast, FL",
  flagshipProgram: "Collective Kids Closet",
  // Location + timing are not yet finalized: Martin County (not pinned to a
  // city), late 2026 (may shift with the donation pipeline). Keep copy soft.
  flagshipLaunch: "late 2026",
  flagshipCity: "Martin County",
} as const;

export const NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Collective Kids Closet", href: "/collective-kids-closet" },
  { label: "Partner With Us", href: "/partner" },
  { label: "Contact", href: "/contact" },
];

/** The single primary action sitewide (brief priority #5). */
export const PRIMARY_CTA = { label: "Donate", href: "/donate" } as const;

/**
 * Founder's Promise — short version, for the Home pull-quote where space is
 * tight (per CCOF_Founders_Promise_and_Where_It_Goes, June 2026).
 */
export const FOUNDER_QUOTE = {
  text: "Every item we place in a family's hands is inspected, cleaned, and chosen as if for my own children. The proceeds from our work are reinvested in our community — supporting kids in foster care, crisis, and mentoring. And we'll show you exactly where it goes.",
  name: "Stephanie Haskins",
  title: "Founder & President",
} as const;

/** Meet Our Founder — paste-ready bio + the primary (full) Founder's Promise. */
export const FOUNDER = {
  name: "Stephanie Haskins",
  title: "Founder & President",
  intro:
    "Founded by Stephanie Haskins, The Children's Collective of Florida was born from faith, motherhood, and a belief that everyday generosity can create lasting opportunities for children.",
  bio: [
    "Stephanie Haskins is the Founder and President of The Children's Collective of Florida, a nonprofit created to connect community generosity with practical support for children and families in need.",
    "Guided by her faith and a heart for children, Stephanie has spent years supporting organizations focused on foster care, family support, youth development, and community outreach. After becoming a mother to her daughter, Summer, she became even more aware of how quickly children outgrow clothing, toys, and essentials — and how many families could benefit from those same resources.",
    "That realization inspired the creation of The Children's Collective of Florida and its first program, The Collective Kids Closet. Stephanie's vision is to create a clear, trusted place where families can donate gently used children's items, shop affordable quality goods, and support programs serving children throughout Florida.",
  ],
  promisePrimary:
    "I started The Children's Collective of Florida as a mother, not an institution — so let me make you a promise you can hold me to. Every item that reaches a Treasure Coast family will be inspected, cleaned, and chosen the way I'd choose it for my own children — never disposable surplus. The proceeds from The Collective Kids Closet are reinvested in our community — supporting local programs that serve children in foster care, crisis, and mentoring. And we will show you where it goes. We're starting small, on purpose, because trust is built one honored donation and one well-served family at a time.",
} as const;

/**
 * Official extended mission statement (finalized June 2026, marked "use the
 * extended version for the website"). Source: CCOF_Extended_Mission_Statement.
 */
export const MISSION =
  "The Children's Collective of Florida supports children and families across Florida through donated goods, affordable community resale programs, and partnerships. We turn everyday generosity into real resources — clothing, essentials, and dignity — for children in foster care, kinship homes, and families navigating crisis. Powered by community, we meet families at their moment of greatest need and reinvest the proceeds of our work into the programs and services that support them.";

/** Concise lead drawn from the mission, for the hero where space is tight. */
export const MISSION_LEAD =
  "We turn everyday community generosity into real resources — clothing, essentials, and dignity — for Florida children in foster care, kinship homes, and families navigating crisis.";

/** Three Pillars + the in-development fourth (brief §1). */
export const PILLARS: {
  number: string;
  title: string;
  body: string;
  status?: "live" | "development";
}[] = [
  {
    number: "01",
    title: "Trusted Giving",
    body: "Donate goods & funds through a transparent local channel — every item inspected, cleaned, and accounted for.",
  },
  {
    number: "02",
    title: "Affordable Access",
    body: "Collective Kids Closet resells quality kids' goods affordably, open to all — dignity-first, never a handout line.",
  },
  {
    number: "03",
    title: "Partner Programs",
    body: "Proceeds fund local 501(c)(3) programs serving children in foster care, kinship homes, and crisis.",
  },
  {
    number: "04",
    title: "Volunteer Service",
    body: "A structured way to give time alongside goods and funds.",
    status: "development",
  },
];

/** Giving-flywheel steps (brief §5). */
export const FLYWHEEL: { step: string; title: string; body: string }[] = [
  {
    step: "You give",
    title: "You give",
    body: "Donate quality kids' goods or funds through a transparent local channel.",
  },
  {
    step: "We steward",
    title: "We steward",
    body: "Every item is inspected, cleaned, and resold affordably through Collective Kids Closet.",
  },
  {
    step: "Programs get funded",
    title: "Programs get funded",
    body: "Proceeds become grants to local programs serving kids in foster care, kinship homes, and crisis.",
  },
];

/** Impact data with sources (brief §1). Numbers drive the count-up animation. */
export const IMPACT_STATS: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: 1319, label: "child-maltreatment reports in Martin County last year" },
  { value: 3000, prefix: "~", label: "local children living in poverty" },
  {
    value: 6,
    suffix: " in 10",
    label:
      "removed children placed with relatives — kinship caregivers, the least-funded in the system",
  },
  { value: 115, label: "children served in foster care" },
];

export const IMPACT_SOURCES =
  "Sources: U.S. Census; AFCARS/NCANDS FFY2022; FL Dept. of Health CHARTS; CCKids 2024 Annual Report.";

/**
 * "Why This Matters Here" — local-need framing for the About page (paste-ready
 * from CCOF_AboutPage_PasteKit, June 2026). Forward-looking / scaling lines are
 * intentionally omitted: the "What's Next" plan is undetermined.
 */
export const WHY_THIS_MATTERS = {
  intro:
    "Martin County is home to roughly 26,000 children — and to The Children's Collective of Florida. Our county's prosperity hides real need: about 1 in 9 local children lives in poverty, and behind every foster-care removal or kinship placement is a household scrambling for basics and a local program working to support them.",
  dataIntro: "In a single year, our county sees:",
  data: [
    { figure: "1,319", label: "child-maltreatment reports" },
    { figure: "115", label: "children served in foster care" },
    {
      figure: "~6 in 10",
      label:
        "removed children placed with relatives — kinship caregivers, the least-funded caregivers in the system",
    },
    {
      figure: "15%",
      label: "of children in care placed in group homes — nearly double the state rate",
    },
  ],
  closing:
    "No single organization can meet all of this alone. CCOF strengthens the local network already doing the work — through our flagship program, the Collective Kids Closet, coming to Martin County in late 2026.",
} as const;

/** Board of directors (brief §1). */
export const BOARD: { name: string; role: string }[] = [
  { name: "Stephanie Haskins", role: "Founder & President" },
  { name: "Amy Mendez", role: "Vice President" },
  { name: "Ashley Gregory", role: "Treasurer" },
  { name: "Isabel Rodas Torres", role: "Secretary" },
  { name: "Tracie Mallett", role: "Director at Large" },
];

/** "What we collect" marquee chips (brief §6). */
export const COLLECT_CHIPS = [
  "Strollers",
  "Cribs & bassinets",
  "Car seats (in-date)",
  "Kids' clothing",
  "Shoes",
  "Books",
  "Toys & games",
  "Diapers & wipes",
  "Highchairs",
  "Baby carriers",
  "School supplies",
  "Coats & outerwear",
];

/** Donation presets with outcome framing (brief priority #2). */
export const DONATION_PRESETS: { amount: number; outcome: string }[] = [
  { amount: 25, outcome: "a stocked welcome bag for a child entering care" },
  { amount: 50, outcome: "a week of school supplies" },
  { amount: 100, outcome: "a season of clothing for a growing kid" },
];

/**
 * Required Florida Division of Consumer Services disclosure (brief §1).
 * Must appear wherever donations are solicited.
 */
export const FL_DISCLOSURE =
  "A COPY OF THE OFFICIAL REGISTRATION AND FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION OF CONSUMER SERVICES BY CALLING TOLL-FREE WITHIN THE STATE (1-800-435-7352) OR AT www.FDACS.gov. REGISTRATION DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION BY THE STATE. FLORIDA REGISTRATION #CH83131.";

export const TAX_NOTE =
  "The Children's Collective of Florida, Inc. is a 501(c)(3) public charity (EIN 42-2020310). Donations are tax-deductible to the fullest extent allowed under IRC §170. IRS determination letter dated May 12, 2026 (effective April 13, 2026).";

/**
 * "Where It Goes" — our transparency commitment. Paste-ready public copy from
 * CCOF_Founders_Promise_and_Where_It_Goes (June 2026); the doc recommends it as
 * its own page linked from the Donate button.
 */
export const WHERE_IT_GOES = {
  intro:
    "We're a new organization, and we believe trust is earned, not assumed. Until we have years of numbers to show you, here is what we promise — and what we will report the moment we open.",
  pledges: [
    {
      title: "Every donation is honored.",
      body: "Items are inspected, cleaned, and chosen with care — quality goods for the next family, never disposable surplus. We treat every donation as something a neighbor entrusted to us.",
    },
    {
      title: "Local dollars stay local.",
      body: "What The Collective Kids Closet earns is reinvested right here on the Treasure Coast — supporting children in foster care, crisis, and mentoring, and the families working to meet their children's essential needs.",
    },
    {
      title: "We'll show you where it goes.",
      body: "Starting with our very first season, we will publish a simple, public account of what we collected, what we provided, and where proceeds went. No fine print.",
    },
  ],
  reportTitle: "What we'll report, starting with our first season",
  reportItems: [
    "Items collected and stewarded for Treasure Coast families.",
    "Families served through affordable resale and direct support.",
    "Local partners supported and the dollars directed to children in foster care, crisis, and mentoring.",
    "Volunteer hours contributed by our community.",
    "Financial transparency: our IRS Form 990 and Florida charitable registration are available to anyone who asks.",
  ],
  closing:
    "These aren't aspirations we hope to grow into — they're commitments you can hold us to, and the scorecard we'll report against.",
} as const;

/** Ways visitors not ready to give can stay involved → correct CTA targets (brief priority #1). */
export const PARTNER_ACTIONS: {
  title: string;
  body: string;
  cta: { label: string; href: string };
  variant: "primary" | "secondary";
}[] = [
  {
    title: "Donate or give goods",
    body: "Fund the launch or contribute quality kids' items through our transparent local channel.",
    cta: { label: "Donate / Give Goods", href: "/donate" },
    variant: "primary",
  },
  {
    title: "Become a partner program",
    body: "Local 501(c)(3) programs serving kids: apply to receive grant funding from resale proceeds.",
    cta: { label: "Become a Partner", href: "/contact?intent=partner" },
    variant: "secondary",
  },
  {
    title: "Host a bin or drive",
    body: "Set up a donation bin or run a goods drive at your business, school, or place of worship.",
    cta: { label: "Host a Bin / Drive", href: "/contact?intent=host" },
    variant: "secondary",
  },
  {
    title: "Volunteer",
    body: "Volunteer Service is in development — tell us how you'd like to help and we'll be in touch as it launches.",
    cta: { label: "Volunteer", href: "/contact?intent=volunteer" },
    variant: "secondary",
  },
  {
    title: "Request support",
    body: "A family or program in need? Reach out and we'll point you to the right resource.",
    cta: { label: "Request Support", href: "/contact?intent=support" },
    variant: "secondary",
  },
];

/**
 * Social channels are not live yet (pages in development). Listed as
 * "coming soon" — add an `href` to each as the accounts go live and the
 * footer will render them as real links automatically.
 */
export const SOCIAL: { label: string; href?: string }[] = [
  { label: "Instagram" },
  { label: "Facebook" },
  { label: "LinkedIn" },
];
