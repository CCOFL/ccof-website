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
  location: "Martin County, FL",
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
export const PRIMARY_CTA = { label: "Give Goods", href: "/give-goods" } as const;

/**
 * Founder's Promise — short version, for the Home pull-quote where space is
 * tight (per CCOF_Founders_Promise_and_Where_It_Goes, June 2026).
 */
export const FOUNDER_QUOTE = {
  text: "Every item we place in a family's hands is inspected, cleaned, and chosen as if for my own children. The proceeds are reinvested right here in our community — supporting local children in foster care, kinship homes, crisis, and mentoring. We'll show you exactly where it goes.",
  name: "Stephanie Haskins",
  title: "Founder & President",
} as const;

/** Meet Our Founder — paste-ready bio + the primary (full) Founder's Promise. */
export const FOUNDER = {
  name: "Stephanie Haskins",
  title: "Founder & President",
  intro:
    "Founded by Stephanie Haskins, The Children's Collective of Florida was born from Christian faith, motherhood, and a belief that everyday generosity can create lasting opportunities for children.",
  bio: [
    "Stephanie Haskins is the Founder and President of The Children's Collective of Florida, a nonprofit created to connect community generosity with practical support for children and families in need.",
    "Guided by her Christian faith and a heart for children, Stephanie has spent years supporting organizations focused on foster care, family support, youth development, and community outreach. After becoming a mother to her daughter, Summer, she became even more aware of how quickly children outgrow clothing, toys, and essentials — and how many families could benefit from those same resources.",
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
  "The Children's Collective of Florida supports children and families across Florida through donated goods, affordable community resale programs, and partnerships. We turn everyday generosity into real resources like clothing, essentials, and dignity for children in foster care, kinship homes, and families navigating crisis. Powered by community, we meet families at their moment of greatest need and reinvest the proceeds of our work into the programs and services that support them.";

/** Concise lead drawn from the mission, for the hero where space is tight. */
export const MISSION_LEAD =
  "We turn everyday community generosity into clothing, essentials, and dignity for Florida children in foster care, kinship homes, and families navigating crisis.";

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

/** Giving-cycle steps (brief §5). */
export const GIVING_CYCLE: { step: string; title: string; body: string }[] = [
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
  // ~1 in 9 — matches the About page's "1 in 9 local children lives in poverty"
  // so the two pages report the same figure (brief task 1). This is the
  // Supabase fallback; the live value lives in the impact_stats table.
  { value: 1, prefix: "~", suffix: " in 9", label: "local children live in poverty" },
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

/**
 * Board of directors / team (brief §1). Each member carries a short bio for the
 * About "Our team" grid; an omitted `bio` renders a clearly-marked placeholder
 * until the org supplies copy. Stephanie leads the grid as one equally-weighted
 * member — not a full-width founder hero.
 */
export const BOARD: { name: string; role: string; bio?: string[] }[] = [
  {
    name: "Stephanie Haskins",
    role: "Founder & President",
    bio: [
      "Led by her Christian faith, Stephanie has always had a heart for philanthropy, drawn to organizations that lift up children and families. Yet like many, she wanted to do more and didn't know how. With so many worthy organizations, it was never clear where a donation landed, where volunteer hours mattered most, or what fruit those efforts bore. Motherhood sharpened that conviction. Watching her own child, and the children closest to her heart, outgrow clothing and everyday essentials, she saw how much those resources could mean to a family in need. From that longing grew a vision: The Children's Collective of Florida, founded on a promise to connect community generosity with the children who need it most, beginning with its first program, the Collective Kids Closet.",
    ],
  },
  {
    name: "Amy Harris",
    role: "Vice President",
    bio: [
      "Amy is a founding board member of The Children's Collective of Florida. Her Christian faith calls her to love her neighbors through service, and she believes even the smallest act of generosity can remind a child they are deeply valued. Amy has long held that gently used things deserve a second purpose, becoming meaningful resources for families who truly need them. As an interior and custom closet designer, she believes every child deserves to open a closet filled with things they love, and the dignity of belongings all their own. A South Florida native, Amy calls Stuart home, where she and her husband are raising their youngest daughter, cheering on two sons in college, and soaking up Florida life on the water.",
    ],
  },
  {
    name: "Ashley Gregory",
    role: "Treasurer",
    bio: [
      "Ashley is a founding board member of The Children's Collective of Florida, inspired by the belief that every child deserves to experience love, hope, and the opportunity to flourish. She is passionate about bringing people together to build meaningful support for children and families facing hardship. With a background in law, education, nonprofit leadership, and mission-driven communications, she has spent her career advancing initiatives that strengthen communities and expand opportunities for the next generation. A proud Treasure Coast resident, Ashley is honored to carry the Collective's mission forward in the community she loves, where she and her husband are raising their young son in Stuart, investing daily in the future they hope every child can share.",
    ],
  },
  {
    name: "Isabel Rodas Torres",
    role: "Secretary",
    bio: [
      "Isabel is a founding board member of The Children's Collective of Florida. Growing up in Ecuador and immigrating to the United States, she experienced firsthand how a supportive community and a helping hand can change the course of a life. That lesson shaped her passion for creating opportunity for children and families. Isabel brings experience in branding, marketing strategy, sales, and communications, which she uses to expand the Collective's reach and deepen its connection to the community it serves. She joined the board to help create that same sense of belonging here: neighbors coming together for meaningful, lasting impact. Outside of work, Isabel loves to travel and dance, because nothing brings people together like great music.",
    ],
  },
  {
    name: "Tracie Mallett",
    role: "Director at Large",
    bio: [
      "Tracie is a founding board member of The Children's Collective of Florida. She and her husband became parents at a young age, a season that taught her a lasting truth: a strong home, a strong family, and the basic necessities every child deserves give children the foundation they need to thrive. For Tracie, a mission built on faith and family, and so close to her own story, is the opportunity of a lifetime. As the owner of a salon studio that rents space to women entrepreneurs building their own businesses, she brings that same builder's energy to the board. Midwest-raised and devoted to the cause, Tracie spends her free time with her husband and two daughters, self-proclaimed foodies who travel for local flavors, architecture, and artistry.",
    ],
  },
];

/** "What we collect" marquee chips (brief §6). */
// Note: car seats are intentionally NOT accepted (safety/liability — expiration
// and crash history can't be verified). Do not add them to this collected list.
export const COLLECT_CHIPS = [
  "Strollers",
  "Cribs & bassinets",
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

/**
 * "Give Goods" — the goods-donation experience. Building the pipeline of donated
 * goods is CCOF's #1 priority for the launch phase, so goods leads over funds.
 * Three intake channels reflect current reality (2026-07): pickup is available
 * now in Martin County; bins are finalizing production (host-a-bin); drives are
 * open. Dual impact mirrors the How-It-Works "two paths."
 */
export const GIVE_GOODS = {
  eyebrow: "Give Goods",
  title: "Your child outgrew it. Another child needs it.",
  intro:
    "Building our pipeline of donated goods is the heart of what we do right now. The quality kids' items your family has outgrown can become clothing, essentials, and dignity for a child in our community who needs them. It's the simplest, most direct way to help a neighbor today.",
  // Two ways every donated item helps (mirrors the How It Works "two paths").
  impact: [
    {
      title: "Resold to fund local programs",
      body: "Quality items are cleaned, inspected, and sold affordably through the Collective Kids Closet. The proceeds fund local programs for children in foster care, kinship homes, and crisis.",
    },
    {
      title: "Given directly to a child in need",
      body: "When a partner nonprofit has a child in crisis who needs clothing, shoes, or essentials now, we provide the goods directly through them, at no cost.",
    },
  ],
  // How to give, current channels. Pickup is featured (available now).
  ways: [
    {
      title: "Schedule a pickup",
      body: "Available now across Martin County. Have a bag or a carload of quality kids' items? Tell us what you have and we'll arrange to come to you.",
      cta: { label: "Schedule a pickup", href: "/contact?intent=pickup" },
      featured: true,
    },
    {
      title: "Host a donation bin",
      body: "Our donation bins are rolling out across Martin County soon. Host one at your business, school, or place of worship and become a neighborhood drop-off point.",
      cta: { label: "Host a bin", href: "/contact?intent=host" },
    },
    {
      title: "Run a goods drive",
      body: "Rally your workplace, school, team, or congregation to collect kids' essentials together. We'll help you set it up and make it easy.",
      cta: { label: "Start a drive", href: "/contact?intent=host" },
    },
  ],
  // What we can't accept + the quality bar.
  notAccepted:
    "For safety and liability, we can't accept car seats, because their expiration and crash history can't be verified. Please give items that are clean, complete, and in good, gently-used condition.",
  taxNote:
    "In-kind donations are tax-deductible. We'll acknowledge what you give; you determine its value for your records.",
} as const;

/** Donation presets with outcome framing (brief priority #2). */
export const DONATION_PRESETS: { amount: number; outcome: string }[] = [
  { amount: 25, outcome: "a welcome bag of essentials for a child entering care" },
  { amount: 50, outcome: "a backpack and school supplies for the school year" },
  { amount: 100, outcome: "a season of clothing for a growing child" },
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
    "We're a new organization, and we believe trust is earned, not assumed. Until we have years of numbers to show you, here is what we promise, and what we will report the moment we open.",
  pledges: [
    {
      title: "We honor what you give.",
      body: "Items are inspected, cleaned, and chosen with care: quality goods for the next family, never disposable surplus. We treat every donation as something a neighbor entrusted to us.",
    },
    {
      title: "Local dollars stay local.",
      body: "What The Collective Kids Closet earns is reinvested right here on the Treasure Coast, supporting children in foster care, crisis, and mentoring, and the families working to meet their children's essential needs.",
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
    "Goods provided directly to partner organizations for children in immediate need.",
    "Volunteer hours contributed by our community.",
    "Financial transparency: our IRS Form 990 and Florida charitable registration are available to anyone who asks.",
  ],
  closing:
    "These aren't aspirations we hope to grow into. They're commitments you can hold us to, and the scorecard we'll report against.",
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
    title: "Request goods for a child in your care",
    body: "Partner 501(c)(3)s serving kids in crisis or foster care: ask us for the specific clothing, shoes, and essentials a child needs — provided directly, at no cost.",
    cta: { label: "For Partner Nonprofits", href: "/partner-nonprofits" },
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
 * Partner Requests — the direct, in-kind provision channel, distinct from the
 * resale-funds-grants (money) channel. Vetted, mission-aligned 501(c)(3)
 * partners request specific goods for a child in immediate need; CCOF matches
 * from donated inventory and provides the goods directly through the partner,
 * at no cost. Framed as stewardship: donated goods are directed to the children
 * who need them — nothing is sold in this channel. Copy lives here so the
 * How-It-Works card and the /partner-nonprofits page stay in sync.
 */
export const PARTNER_REQUESTS = {
  /** The "second path" card on How It Works. */
  card: {
    title: "Partner Requests — goods, directly",
    body: "When a partner has a child in crisis who needs clothing, shoes, or essentials now, we provide the goods directly through them — at no cost, never resold.",
  },
  /** /partner-nonprofits page. */
  eyebrow: "For Partner Nonprofits",
  title: "When a child needs goods right now",
  intro:
    "Not every need should wait for a shelf. When a partner organization has a child in crisis or entering foster care who needs clothing, shoes, or everyday essentials today, they can ask us directly — and we provide the goods through them, at no cost, as an extension of the community's generosity.",
  steps: [
    {
      title: "A partner reaches out",
      body: "A vetted, mission-aligned 501(c)(3) serving children in foster care, kinship homes, or crisis tells us what a specific child needs — sizes, categories, and how soon.",
    },
    {
      title: "We match the need",
      body: "We check what the community has entrusted to us and set aside the right goods — inspected, clean, and ready.",
    },
    {
      title: "Goods reach the child",
      body: "We provide the items directly through the partner organization, so the child receives what they need from the people already caring for them.",
    },
  ],
  stewardship:
    "These goods are given by our community and entrusted to our care. As part of our charitable mission, we provide them — at no cost — to children in need through our partner nonprofit organizations. Nothing in this channel is sold.",
  // Sets honest expectations — we don't overpromise what we can't provide.
  expectation:
    "We match what we can from current stock, so the sooner and more specifically you tell us what's needed, the better we can help. We won't promise what we don't have on hand — but we'll always tell you what we can do.",
  // Phase 1 gate: 501(c)(3) attestation + a promise to verify and onboard each
  // partner before fulfilling. Formal partner approval is Phase 2.
  eligibility:
    "Partner Requests are for vetted 501(c)(3) organizations serving children in foster care, kinship care, or crisis. New partners are welcome — we verify and onboard each partner before fulfilling requests, so your first request also starts that conversation.",
  // Interim direct line for urgent needs, until the formal partner
  // communications plan (and a published phone number) are in place.
  urgentIntro:
    "Have an urgent need right now? While we formalize our partner communications — a direct line and phone number are on the way — email us and we'll respond as fast as we can:",
  cta: { label: "Request goods for a child", href: "/partner-nonprofits" },
} as const;

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
