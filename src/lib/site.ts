/**
 * Single source of truth for site content & config.
 * All organizational copy is preserved verbatim from the brief (§1).
 */

export const ORG = {
  name: "The Children's Collective of Florida",
  legalName: "The Children's Collective of Florida, Inc.",
  abbr: "CCOF",
  tagline: "Powered by Community. Supporting Kids.",
  // Display forms capitalize FL so the state stands out and mistypes drop
  // (childrenscollective.org belongs to someone else). Domains are
  // case-insensitive, so links/mailto still resolve identically; ORG.url
  // stays lowercase for machine URLs (canonical, OG, sitemap, JSON-LD @id).
  domain: "ChildrensCollectiveFL.org",
  url: "https://childrenscollectivefl.org",
  email: "info@ChildrensCollectiveFL.org",
  ein: "42-2020310",
  flReg: "CH83131",
  flDoc: "N26000005374",
  location: "Martin County, FL",
  // Geography is a site-level fact: the service area appears in the footer,
  // /contact, and /registration ONLY, all rendered from this one string
  // (founder ruling 2026-08-23). "Based in Stuart" is a permanent fact;
  // "neighboring communities" is anchored to it and absorbs partners outside
  // Martin County (Hannah's Home is in Tequesta, Palm Beach County) without
  // an edit. Body copy never names a service-area county.
  serviceArea: "Based in Stuart, serving Martin County and neighboring communities",
  // Workspace Super Admin contact — published per Google for Nonprofits
  // verification requirements (admin email must be visible on the site).
  adminEmail: "stephanie@ChildrensCollectiveFL.org",
  // Official public line (Google Voice), secured 2026-07-31.
  phone: "(772) 202-0554",
  phoneHref: "tel:+17722020554",
  // Public business address (W Executive Suites, Stuart — locked 2026-07-28;
  // The Space Connect remains registered agent only). Published instead of the
  // founder's home address, per standing privacy rule.
  streetAddress: "770 SE Indian St",
  cityStateZip: "Stuart, FL 34997",
  storefrontProgram: "Collective Kids Closet",
  // Founder rulings 2026-09-03: the year is "2027" (never "early 2027"), the
  // location is "Martin County" until a specific city is chosen (candidates
  // include Hobe Sound, Palm City, Stuart, Jensen Beach; supersedes the
  // canonical file's "opens in Stuart"), and "flagship" is retired: the
  // Closet is the STOREFRONT program, one of two sibling programs beside
  // direct-to-partner distribution.
  storefrontLaunch: "2027",
  storefrontCity: "Martin County",
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
  // Rewritten 2026-08-24 (founder's wording) under the refuse-never-certify
  // principle: states her standard and her refusal, promises no process and
  // certifies no outcome (insurance binding condition; see the quality-
  // warranty ticket of 2026-08-24). Do not reintroduce process verbs
  // (inspected/cleaned/checked) here or anywhere on the site.
  text: "If I wouldn't give it to my child, or the children closest to my heart, we won't pass it along. The proceeds are reinvested right here in our community, supporting local children in foster care, kinship homes, crisis, and mentoring. We'll show you exactly where it goes.",
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
    "Guided by her Christian faith and a heart for children, Stephanie has spent years supporting organizations focused on foster care, family support, youth development, and community outreach. After becoming a mother to her daughter, Summer, she became even more aware of how quickly children outgrow clothing, toys, and essentials, and how many families could benefit from those same resources.",
    "That realization inspired the creation of The Children's Collective of Florida and its first program, The Collective Kids Closet. Stephanie's vision is to create a clear, trusted place where families can donate gently used children's items, shop affordable quality goods, and support programs serving children throughout Florida.",
  ],
  promisePrimary:
    "I started The Children's Collective of Florida as a mother, not an institution. So let me make you a promise you can hold me to. If I wouldn't give it to my child, or the children closest to my heart, we won't pass it along, and nothing that reaches a Treasure Coast family will be disposable surplus. The proceeds from The Collective Kids Closet are reinvested in our community, supporting local programs that serve children in foster care, crisis, and mentoring. And we will show you where it goes. We're starting small, on purpose, because trust is built one honored donation and one well-served family at a time.",
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
    body: "Donate goods & funds through a transparent local channel: every donation honored and accounted for.",
  },
  {
    number: "02",
    title: "Affordable Access",
    body: "Collective Kids Closet resells quality kids' goods at affordable prices for all families throughout the community.",
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
export const GIVING_CYCLE: {
  step: string;
  title: string;
  body: string;
  /** Optional fork: after `body`, the step splits into parallel, equally
   *  legitimate paths. Rendered as a nested list in DOM order so the
   *  either/or is carried by text, never by color or position alone. */
  paths?: { title: string; body: string }[];
}[] = [
  {
    step: "You give",
    title: "You give",
    body: "Donate quality kids' goods or funds through a transparent local channel.",
  },
  {
    step: "We steward",
    title: "We steward",
    body: "Everything you give is held to one standard. Then one of two things happens.",
    // Founder wording standards (2026-08-19), not suggestions: the partner
    // path reads as a contribution ("contributed directly to them"), never
    // "free"/"at no cost"; the resale path stays unqualified ("for all
    // families throughout the community"), never "open to everyone" or
    // "no income requirements". Both paths are equally legitimate outcomes.
    paths: [
      {
        title: "Straight to a partner.",
        body: "When one of our 501(c)(3) partners has a child who needs something now, the goods are contributed directly to them.",
      },
      {
        title: "Fills the Closet.",
        body: "Everything else stocks the Collective Kids Closet, providing affordable goods for all families throughout the community.",
      },
    ],
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
  // "in a single year", not "last year": the cited source is FFY2022 (stated
  // beneath the tiles and on /sources), so the label must not claim currency.
  // Live value/label come from the impact_stats table (migration 0010 aligns
  // the row); this is the fallback. Data refresh tracked in Cowork.
  { value: 1319, label: "child-maltreatment reports in Martin County in a single year" },
  // Nearly 1 in 6 (children under 18) — U.S. Census Bureau American Community
  // Survey (ACS) 5-year estimates, ~17%. Standardized 2026-07 (retired the
  // older SAIPE-based "~1 in 9"); matches the About page prose so the two
  // pages report the same figure. This is the Supabase fallback; the live
  // value lives in the impact_stats table (see migration 0005).
  { value: 1, prefix: "nearly ", suffix: " in 6", label: "local children (under 18) live in poverty" },
  {
    value: 6,
    suffix: " in 10",
    label:
      "removed children placed with relatives (kinship caregivers), the least-funded in the system",
  },
  { value: 115, label: "children served in foster care" },
];

export const IMPACT_SOURCES =
  "Sources: U.S. Census Bureau, American Community Survey (ACS); AFCARS/NCANDS FFY2022; FL Dept. of Health CHARTS; CCKids 2024 Annual Report.";

/**
 * "Why This Matters Here" — local-need framing for the About page (paste-ready
 * from CCOF_AboutPage_PasteKit, June 2026). Forward-looking / scaling lines are
 * intentionally omitted: the "What's Next" plan is undetermined.
 */
export const WHY_THIS_MATTERS = {
  intro:
    "Martin County is home to roughly 26,000 children, and to The Children's Collective of Florida. Our county's prosperity hides real need: nearly 1 in 6 local children (children under 18) lives in poverty, per the U.S. Census Bureau's American Community Survey, and behind every foster-care removal or kinship placement is a household scrambling for basics and a local program working to support them.",
  dataIntro: "In a single year, our county sees:",
  data: [
    { figure: "1,319", label: "child-maltreatment reports" },
    { figure: "115", label: "children served in foster care" },
    {
      figure: "~6 in 10",
      label:
        "removed children placed with relatives (kinship caregivers), the least-funded caregivers in the system",
    },
    {
      figure: "15%",
      label: "of children in care placed in group homes, nearly double the state rate",
    },
  ],
  closing:
    "No single organization can meet all of this alone. The Children's Collective of Florida strengthens the local network already doing the work: goods and grant funding contributed directly to our 501(c)(3) partners, and the Collective Kids Closet, our storefront program coming to Martin County in 2027.",
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
      "Led by her Christian faith, Stephanie has always had a heart for philanthropy, drawn to organizations that lift up children and families. Yet like many, she wanted to do more and didn't know how. With so many worthy organizations, it was never clear where a donation landed, where volunteer hours mattered most, or what fruit those efforts bore.",
      "After nearly a decade in corporate leadership, she paused her career to be present for her daughter's earliest years. In that quieter season, motherhood sharpened that conviction. She watched her own child, and the children closest to her heart, outgrow clothing and everyday essentials. She saw what those things could mean to a family a few streets away.",
      "From that longing grew a vision: The Children's Collective of Florida, founded on a promise to connect community generosity with the children who need it most. That promise is already at work through our 501(c)(3) partners, and it will grow further when the Collective Kids Closet opens in Martin County in 2027.",
      "What began as a pause became a purpose.",
    ],
  },
  {
    name: "Amy Harris",
    role: "Vice President",
    bio: [
      "Amy's Christian faith calls her to love her neighbors through service, and she believes even the smallest act of generosity can remind a child they are deeply valued. She has long held that gently used things deserve a second purpose, becoming meaningful resources for families who truly need them. As an interior and custom closet designer, she believes every child deserves to open a closet filled with things they love, and the dignity of belongings all their own. A South Florida native, Amy calls Stuart home, where she and her husband are raising their youngest daughter, cheering on two sons in college, and soaking up Florida life on the water.",
    ],
  },
  {
    name: "Ashley Gregory",
    role: "Treasurer",
    bio: [
      "Ashley is inspired by the belief that every child deserves to experience love, hope, and the opportunity to flourish. She is passionate about bringing people together to build meaningful support for children and families facing hardship. With a background in law, education, nonprofit leadership, and mission-driven communications, she has spent her career advancing initiatives that strengthen communities and expand opportunities for the next generation. A proud Treasure Coast resident, Ashley is honored to carry the Collective's mission forward in the community she loves, where she and her husband are raising their young son in Stuart, investing daily in the future they hope every child can share.",
    ],
  },
  {
    name: "Isabel Rodas Torres",
    role: "Secretary",
    bio: [
      "Growing up in Ecuador and immigrating to the United States, Isabel experienced firsthand how a supportive community and a helping hand can change the course of a life. That lesson shaped her passion for creating opportunity for children and families. Isabel brings experience in branding, marketing strategy, sales, and communications, which she uses to expand the Collective's reach and deepen its connection to the community it serves. She joined the board to help create that same sense of belonging here: neighbors coming together for meaningful, lasting impact. Outside of work, Isabel loves to travel and dance, because nothing brings people together like great music.",
    ],
  },
  {
    name: "Tracie Mallett",
    role: "Director at Large",
    bio: [
      "Tracie and her husband became parents at a young age, a season that taught her a lasting truth: a strong home, a strong family, and the basic necessities every child deserves give children the foundation they need to thrive. For Tracie, a mission built on faith and family, and so close to her own story, is the opportunity of a lifetime. As the owner of a salon studio that rents space to women entrepreneurs building their own businesses, she brings that same builder's energy to the board. Midwest-raised and devoted to the cause, Tracie spends her free time with her husband and two daughters, self-proclaimed foodies who travel for local flavors, architecture, and artistry.",
    ],
  },
];

/**
 * ★ ACCEPTED_GOODS: THE MASTER accepted/declined goods list (brief §6; Donated
 * Goods Safety Policy 2026-08-18, channel amendment 2026-08-21).
 *
 * One constant, imported everywhere, transformed at render time where needed,
 * never re-stored. The homepage marquee, /give-goods, and /pickup all render
 * from it, and every future artifact (laminated intake card, volunteer
 * training, partner comms, Good360 SOP) must be generated from it too, never
 * typed from a screenshot. Fifteen variants of the FDACS disclosure drifted
 * into existence that way; do not let this list repeat it.
 *
 * Channels (the axis that governs risk is unattended vs. controlled):
 * - binEligible: small, soft, no mechanism. Suitable for an unattended bin drop.
 * - pickupOnly: bulky or mechanical. Scheduled handoff only; never shown as
 *   bin-droppable (a stroller left beside a bin overnight is an item CCOF owns
 *   without ever having seen it).
 * - sealedOnly: new, sealed, unopened, unexpired. `controlledChannel: true`
 *   (infant food, OTC drug products) is NEVER shown as bin-droppable; it
 *   renders only in the handed-in-person group.
 * - declined: never accepted, any channel. DISPLAY terms only; the policy file
 *   keeps the full legal enumeration. "Large baby gear" is a catch-all that
 *   only works beside the decline sentence, so the homepage omits it.
 *
 * Car seats, cribs, bassinets, pack-and-plays, and all infant sleep products
 * are declined (CPSIA §104(c); Safe Sleep for Babies Act). Never re-add them
 * to any accepted group. No public rationale is published (founder decision
 * 2026-08-19, pending counsel).
 *
 * Permitted render-time transforms, all pure functions of this object:
 *   1. lowercasing inside the running decline sentence
 *   2. "&" -> "and" inside the running decline sentence only
 *   3. stripping a label's parenthetical sub-list on the homepage marquee only
 *   4. omitting "Large baby gear" on the homepage marquee only
 * Nothing else. If wording reads awkwardly somewhere, flag it; do not fork it.
 */
export const ACCEPTED_GOODS = {
  binEligible: [
    "Kids' clothing",
    "Shoes",
    "Coats & outerwear",
    "Books",
    "Toys & games",
    "School supplies",
    "Backpacks & duffel bags",
  ],
  pickupOnly: [
    "Strollers",
    "Highchairs",
    "Baby carriers",
    "Bouncers",
    "Large baby gear",
  ],
  sealedOnly: [
    { label: "Diapers & wipes", condition: "new, sealed packages", controlledChannel: false },
    { label: "Formula", condition: "new, sealed, unexpired", controlledChannel: true },
    { label: "Bottles & nipples", condition: "new, sealed", controlledChannel: false },
    { label: "Toiletries", condition: "new, sealed", controlledChannel: false },
    {
      label: "Youth undergarments (underwear & socks)",
      condition: "new, unopened packages",
      controlledChannel: false,
    },
    {
      label: "Baby ointment & infant medical supplies (diaper rash cream, antibiotic ointment)",
      condition: "new, sealed, unexpired",
      controlledChannel: true,
    },
  ],
  declined: [
    "Cribs",
    "Bassinets",
    "Pack-and-plays",
    "Crib mattresses & bumpers",
    "Infant sleep products",
    "Car seats",
    // Insurance-driven (2026-08-24): the carrier's Designated Products
    // Exclusion (USLI L 727) removes products coverage for bunk beds, so an
    // accepted bunk bed would be uninsured for bodily injury, contributed or
    // sold. Displayed here; the policy file carries the legal enumeration.
    "Bunk beds",
  ],
} as const;

export type SealedGood = (typeof ACCEPTED_GOODS.sealedOnly)[number];

/** A renderable channel group: plain labels become pills, conditioned entries
 *  become lines ("label: condition"). One rule, split by one property. */
export type GoodsGroup = {
  pills: readonly string[];
  lines: readonly SealedGood[];
};

/** Bin-droppable group: binEligible + sealed items not restricted to a
 *  controlled channel. */
export function binDroppableGoods(): GoodsGroup {
  return {
    pills: ACCEPTED_GOODS.binEligible,
    lines: ACCEPTED_GOODS.sealedOnly.filter((g) => !g.controlledChannel),
  };
}

/** Handed-in-person group: pickupOnly + sealed items restricted to a
 *  controlled channel (infant food, OTC drug products). */
export function controlledChannelGoods(): GoodsGroup {
  return {
    pills: ACCEPTED_GOODS.pickupOnly,
    lines: ACCEPTED_GOODS.sealedOnly.filter((g) => g.controlledChannel),
  };
}

/** Transform 3 (marquee only): drop a label's parenthetical sub-list. */
function stripParenthetical(label: string): string {
  return label.replace(/\s*\([^)]*\)/g, "").trim();
}

/** Homepage marquee chips, in order: bin-eligible, then all sealed items with
 *  a short "(sealed)" marker (transform 3 applied), then pickup-only with
 *  "Large baby gear" omitted (transform 4). Labels only: the marquee is a
 *  glance surface and makes no channel distinction. */
export function marqueeGoods(): string[] {
  return [
    ...ACCEPTED_GOODS.binEligible,
    ...ACCEPTED_GOODS.sealedOnly.map((g) => `${stripParenthetical(g.label)} (sealed)`),
    ...ACCEPTED_GOODS.pickupOnly.filter((label) => label !== "Large baby gear"),
  ];
}

/** Collective Kids Closet "What you'll find" chips: the store-appropriate
 *  subset of the same master list. Sealed consumables (formula, diapers,
 *  OTC ointments) are deliberately OMITTED, not declined: whether they can
 *  be resold depends on their source (community-donated goods may be
 *  eligible; goods from an intermediary such as Good360 must be contributed
 *  to partners, never sold), and the site makes no claim either way until
 *  that is settled (founder ruling 2026-08-22). "Large baby gear" is
 *  omitted for the same reason as the homepage: no decline sentence nearby. */
export function storeMarqueeGoods(): string[] {
  return [
    ...ACCEPTED_GOODS.binEligible,
    ...ACCEPTED_GOODS.pickupOnly.filter((label) => label !== "Large baby gear"),
  ];
}

/** The single decline sentence, rendered from ACCEPTED_GOODS.declined with
 *  transforms 1 and 2. Byte-identical wherever it appears. "Please give" is
 *  deliberate: this is the one sentence that tells someone no, and it should
 *  still sound like a person. No rationale is published. */
export function declinedSentence(): string {
  const items = ACCEPTED_GOODS.declined.map((d) =>
    d.toLowerCase().replace(/ & /g, " and "),
  );
  const list = `${items.slice(0, -1).join(", ")}, or ${items[items.length - 1]}`;
  return `We cannot accept ${list}. ${DONOR_CONDITION_REQUEST}`;
}

/** The single donor condition request: a request CCOF makes of donors, never
 *  a promise CCOF makes about outcomes (that distinction is the entire point
 *  under the insurance binding conditions). Rendered by declinedSentence()
 *  and the donation policy. One constant, no variants. */
export const DONOR_CONDITION_REQUEST =
  "Please give used items that are clean, complete, and in good condition.";

/** Approved lead-ins (eight words max, no headings). They describe the goods
 *  or the handoff, never the existence of bins: CCOF has none placed yet.
 *  /pickup's bin lead-in adds "Also welcome" because a pickup takes
 *  everything and a bare "small enough for a bin" could read as bin-only. */
export const GOODS_LEAD_INS = {
  pickup: {
    bin: "Also welcome, and small enough for a bin:",
    controlled: "Handed to us in person.",
  },
  giveGoods: {
    bin: "Small enough for a bin:",
    controlled: "Handed to us in person.",
  },
  controlledLink: "Schedule a pickup →",
} as const;

// /pickup is the variable surface behind the bin decal QR: the decals
// (permanent vinyl) read "Scan the code above for our full list" and point
// there, so when counsel answers the broader CPSIA durable-infant-product
// question, ACCEPTED_GOODS changes here for free instead of costing a reprint.

/**
 * Sustainability co-benefit — a SECONDARY thread to the kids-first mission
 * (harmony, not the melody). Uses only sourced, general industry facts, never
 * CCOF's own operational numbers (we have none pre-launch). The measured
 * "your purchase saved X" impact is deferred to the Where It Goes report once
 * real resale/diversion data exists. Any specific quantified green claim should
 * be reviewed against the FTC Green Guides before publishing.
 * Sources: U.S. EPA Facts & Figures (textiles, 2018, most recent comprehensive
 * data); Water Footprint Network (Mekonnen & Hoekstra), popularized by WWF.
 */
export const SUSTAINABILITY = {
  eyebrow: "Good for kids, good for the planet",
  // Featured impact = landfill diversion (bigger, universal, and it celebrates
  // reuse without implying new textile production is bad — no dig at the
  // businesses/entrepreneurs who make goods for commerce).
  stat: "11 million tons",
  statCaption:
    "of clothing and textiles Americans send to landfills every year, with only about 15% recycled",
  // Per-page lead line.
  shop: "Every item you buy secondhand stays in use instead of adding to that pile.",
  give: "The quality kids' items your family has outgrown stay in use for another child instead of adding to that pile.",
  // Secondary, positive conservation note (water saved, not production shamed).
  // Jeans figure (~7,500 L ≈ 2,000 gal) is stated directly by the UN — bigger
  // impact than a T-shirt AND a gold-standard, verifiable source.
  waterNote:
    "Reuse also saves precious resources; making one new pair of jeans takes about 2,000 gallons of water.",
  // Clickable sources for verifiable transparency.
  sources: [
    {
      label: "U.S. EPA (textiles)",
      url: "https://www.epa.gov/facts-and-figures-about-materials-waste-and-recycling/textiles-material-specific-data",
    },
    {
      label: "United Nations",
      url: "https://www.un.org/en/actnow/facts-and-figures",
    },
  ],
} as const;

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
  // Partner path listed FIRST (partners-first framing, founder ruling 9/3).
  impact: [
    {
      title: "Given to a child in need through a partner",
      body: "When a partner nonprofit has a child in crisis who needs clothing, shoes, or essentials now, the goods are contributed directly to them.",
    },
    {
      title: "Resold to fund local programs",
      body: "Quality items are sold affordably through the Collective Kids Closet. The proceeds fund local programs for children in foster care, kinship homes, and crisis.",
    },
  ],
  // How to give, current channels. Pickup is featured (available now).
  ways: [
    {
      title: "Schedule a pickup",
      body: "Available now across Martin County. Have a bag or a carload of quality kids' items? Tell us what you have and we'll arrange to come to you.",
      cta: { label: "Schedule a pickup", href: "/pickup" },
      featured: true,
    },
    {
      title: "Host a donation bin",
      body: "Host one at your business, school, or place of worship and become a neighborhood drop-off point.",
      cta: { label: "Host a bin", href: "/host-a-bin" },
    },
    {
      title: "Run a goods drive",
      body: "Rally your workplace, school, team, or congregation to collect kids' essentials together. We'll help you set it up and make it easy.",
      cta: { label: "Start a drive", href: "/contact?intent=host" },
    },
  ],
  // What we can't accept + the quality bar.
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
 * THE single sitewide FDACS disclosure (F.S. §496.411; registration number
 * embedded per §496.411(6)). Must appear wherever funds or goods are
 * solicited, and, per FDACS's written answer of 2026-08-19, in emailed
 * donation receipts and acknowledgment messages.
 *
 * Provenance: this exact wording was submitted to FDACS and reviewed twice by
 * a Division of Consumer Services Regulatory Consultant without objection
 * (2026-08-17, 2026-08-19). WWW.FDACS.GOV was functionally verified
 * 2026-08-19: Check-A-Charity there serves CH83131 with the linked DBA and
 * financial info, and www.floridaconsumerhelp.com 301-redirects into
 * fdacs.gov, so both candidate URLs land on the same department.
 *
 * USE VERBATIM. Do not re-punctuate, move the registration number, shorten
 * "OR ONLINE AT", or "improve" it. Render as plain readable text everywhere;
 * NEVER wrap the URL in a tracking redirect, shortener, or click-analytics
 * wrapper (June 2026 outreach emails shipped with a google.com/url?q= link
 * inside the statutory disclosure; never repeat that). If you find yourself
 * typing the disclosure's opening words anywhere other than this definition,
 * stop and import this constant instead.
 */
export const FDACS_DISCLOSURE =
  "A COPY OF THE OFFICIAL REGISTRATION AND FINANCIAL INFORMATION MAY BE OBTAINED FROM THE DIVISION OF CONSUMER SERVICES BY CALLING TOLL-FREE 1-800-HELP-FLA (1-800-435-7352) WITHIN THE STATE OR ONLINE AT WWW.FDACS.GOV. REGISTRATION DOES NOT IMPLY ENDORSEMENT, APPROVAL, OR RECOMMENDATION BY THE STATE. FL REGISTRATION #CH83131";

/** Org-identity line for letterheads and detail lists. The FDACS statement
 *  above already ends with the registration number; never render this line
 *  directly after it. */
export const FL_REG_LINE = "Florida Registration #CH83131.";

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
      body: "Everything given is held to one standard: quality goods for the next family, never disposable surplus. We treat every donation as something a neighbor entrusted to us.",
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
    // Terminology standardized 9/3 (founder): the role is "partner
    // nonprofit" everywhere; "partner program" is retired. Never pluralize
    // as "501(c)(3)s": write "501(c)(3) organizations".
    title: "Become a Partner Nonprofit",
    body: "For 501(c)(3) organizations serving children in foster care, kinship care, or crisis: receive grant funding, or request goods for a child in your care.",
    // Routes to the dedicated application (EIN, mission, consent capture),
    // not the generic contact form (routing fix, 9/3). /contact keeps its own
    // partner intent option for anyone who prefers to just write in.
    cta: { label: "Become a Partner Nonprofit", href: "/partner-apply" },
    variant: "secondary",
  },
  {
    title: "Request goods for a child in your care",
    body: "Ask us for the specific clothing, shoes, and essentials a child needs, contributed directly to your organization.",
    cta: { label: "For Partner Nonprofits", href: "/partner-nonprofits" },
    variant: "secondary",
  },
  {
    title: "Host a bin or drive",
    body: "Set up a donation bin or run a goods drive at your business, school, or place of worship.",
    cta: { label: "Host a Bin / Drive", href: "/host-a-bin" },
    variant: "secondary",
  },
  {
    title: "Volunteer",
    body: "Volunteer Service is in development. Tell us how you'd like to help and we'll be in touch as it launches.",
    cta: { label: "Volunteer", href: "/volunteer" },
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
 * Public one-line definitions (approved 9/3; Cowork spec, corrected per the
 * chain-of-custody ruling and the no-bare-acronym rule). "Directly" attaches
 * ONLY to the partner organization, never to children. Neither definition
 * implies the two roles are exclusive: an organization can be both.
 */
export const PARTNER_NONPROFIT_DEFINITION =
  "Partner nonprofits are the vetted 501(c)(3) organizations already caring for children in foster care, kinship care, or crisis. The Children's Collective of Florida contributes goods and grant funding directly to them, so what the community gives reaches the children who need it most.";

export const COMMUNITY_PARTNER_DEFINITION =
  "Community Partners are the businesses, schools, and congregations who host a donation bin or drive, collecting the community's generosity for The Children's Collective of Florida to steward and put to work for local kids.";

/**
 * Partner Requests — the direct, in-kind provision channel, distinct from the
 * resale-funds-grants (money) channel. Vetted, mission-aligned 501(c)(3)
 * partners request specific goods for a child in immediate need; the goods
 * are contributed directly to the partner organization. Framed as
 * stewardship: nothing is sold in this channel. Copy lives here so the
 * How-It-Works card and the /partner-nonprofits page stay in sync.
 */
export const PARTNER_REQUESTS = {
  /** The FIRST path card on How It Works (partners-first ordering, 9/3). */
  card: {
    title: "Partner Requests: goods, directly",
    body: "When a partner has a child in crisis who needs clothing, shoes, or essentials now, the goods are contributed directly to them, never resold.",
  },
  /** /partner-nonprofits page. */
  eyebrow: "For Partner Nonprofits",
  title: "When a child needs goods right now",
  intro:
    "Not every child can wait for the Closet's doors to open. When a partner organization has a child in crisis or entering foster care who needs clothing, shoes, or everyday essentials today, they can ask us directly, and the goods are contributed to them as an extension of the community's generosity.",
  steps: [
    {
      title: "A partner reaches out",
      body: "A vetted, mission-aligned 501(c)(3) serving children in foster care, kinship homes, or crisis tells us what a specific child needs: sizes, categories, and how soon.",
    },
    {
      title: "We match the need",
      body: "We set aside the right goods from what the community has entrusted to us, ready for the child who needs them.",
    },
    {
      title: "Goods reach the child",
      body: "We provide the items directly through the partner organization, so the child receives what they need from the people already caring for them.",
    },
  ],
  stewardship:
    "These goods are given by our community and entrusted to our care. As part of our charitable mission, we contribute them to our partner nonprofit organizations, which directly serve children in need. Nothing in this channel is sold.",
  // Sets honest expectations — we don't overpromise what we can't provide.
  expectation:
    "We match what we can from current stock, so the sooner and more specifically you tell us what's needed, the better we can help. We won't promise what we don't have on hand, but we'll always tell you what we can do.",
  // Phase 1 gate: 501(c)(3) attestation + a promise to verify and onboard each
  // partner before fulfilling. Formal partner approval is Phase 2.
  eligibility:
    "Partner Requests are for vetted 501(c)(3) organizations serving children in foster care, kinship care, or crisis. New partners are welcome. We verify and onboard each partner before fulfilling requests, so your first request also starts that conversation.",
  // Urgent-need channel: the official line plus email.
  urgentIntro:
    "Have an urgent need right now? Call us at (772) 202-0554, or email us and we'll respond as fast as we can:",
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
