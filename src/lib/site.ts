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
  location: "Treasure Coast, FL",
  flagshipProgram: "Collective Kids Closet",
  flagshipLaunch: "Fall 2026",
  flagshipCity: "Stuart, FL",
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

/** Founder promise — featured pull-quote (brief §1). */
export const FOUNDER_QUOTE = {
  text: "I started The Children's Collective of Florida as a mother, not an institution… Every item that moves through our hands is inspected, cleaned, and chosen the way I'd choose it for my own children — never disposable surplus.",
  name: "Stephanie Haskins",
  title: "Founder & President",
} as const;

export const MISSION =
  "Channel community generosity into practical support for children and families — donated goods, an affordable community resale program, and grants to local programs serving kids in foster care, kinship homes, and crisis.";

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
  { value: 6, suffix: " in 10", label: "removed children placed with relatives (kinship)" },
  { value: 115, label: "children served in foster care" },
];

export const IMPACT_SOURCES =
  "Sources: U.S. Census; AFCARS/NCANDS FFY2022; FL Dept. of Health CHARTS; CCKids 2024 Annual Report.";

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

export const SOCIAL: { label: string; href: string }[] = [
  // Placeholders — update with real handles when available.
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];
