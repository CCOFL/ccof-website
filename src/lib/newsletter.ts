/**
 * Monthly letter editions for /newsletter (web editions of the Board &
 * Community Partner Newsletter). GOVERNING POSTURE (founder ruling
 * 2026-10-06): the public web edition is GENERAL ONLY. Specific case
 * stories and partner-shared photos stay in the emailed letter to the
 * trusted circle, permanently, for partner SAFETY (shelter locations and
 * identities are protection). No facility is ever named or identifiable;
 * only CCOF-owned photos of CCOF's own people appear here.
 *
 * Web-edition deltas from the circulated PDF are flagged inline; the
 * founder approved each. Adding an edition renders a new block, newest
 * first, with no code changes.
 */
export type NewsletterEdition = {
  slug: string;
  label: string;
  headline: string;
  opening: string;
  whoWeAre: string;
  whatWeDo: string;
  howWeDoIt: string;
  letterHeading: string;
  letterParagraphs: string[];
  letterSignoffName: string;
  letterSignoffTitle: string;
  communityHeading: string;
  communityParagraph: string;
  photos: { src: string; alt: string; caption: string }[];
  plainlyHeading: string;
  plainlyBullets: string[];
  socialHeading: string;
  socialParagraph: string;
  thankYouHeading: string;
  thankYouParagraph: string;
  nextHeading: string;
  nextItems: string[];
  partHeading: string;
  partItems: { text: string; href?: string; label?: string }[];
  scripture: string;
};

export const newsletterEditions: NewsletterEdition[] = [
  {
    slug: "2026-09",
    label: "September 2026",
    headline:
      "Somewhere near us, a child is arriving somewhere new tomorrow with very little to call their own.",
    opening:
      "That is why we exist. A grandparent gets a call and five children are at the door by nightfall. A mother is due this week and has nowhere to put the car seat she does not have. A teenager arrives at a shelter with what fits in a bag. A child arrives at a new foster home, and the family's budget was already stretched before the knock on the door. Love is there. Stability is being rebuilt. What is missing is the basics, and the dignity of having something of your own. That is something a community can supply.",
    whoWeAre:
      "We are The Children's Collective of Florida, a 501(c)(3) public charity of Martin County, led by a founding board of five women who show up.",
    whatWeDo:
      "We connect our community's generosity to the children who need it most.",
    // Web-edition deltas from the PDF, founder-flagged: "stock their
    // shelves" reads "stock their supply rooms" (shelves rule), and
    // "launder, screen, pack" reads via the approved stewardship
    // vocabulary (quality-warranty ruling: no process verbs in site copy).
    howWeDoIt:
      "We work closely with the nonprofit organizations already caring for those children, and we do more than answer the phone. We walk their shelters, sit with their teams, and learn what their children need to thrive. Then we work behind the scenes to stock their supply rooms with necessities and a few smiles, so the goods are there before the need arrives. Our community fills the bins. We hold everything to one standard, pack by exact size, and deliver. Every transfer is recorded in writing and signed by both organizations. They call. We supply.",
    letterHeading: "A letter from Stephanie",
    letterParagraphs: [
      "Dear friends,",
      "September is the month everything we had been building went into action. The trust you placed in us, as board members, as partners, as hosts and as neighbors, turned into clothes in a child's exact size, packed into a bag they could call their own.",
      "I am writing to say thank you, and to show you what your generosity did. The numbers are the honest record. They are small because we are new, and every one of them was weighed, counted and signed for. What the numbers cannot hold is what it felt like to hand a grandfather five duffel bags the day after his life changed, or to put a car seat in a partner's hands before a baby arrived. You did that.",
      "God's work is underway here, and it is a welcome stewardship. We are grateful, we are only getting started, and we are so glad you are part of it.",
    ],
    letterSignoffName: "Stephanie Haskins",
    letterSignoffTitle: "Founder & President, The Children's Collective of Florida",
    communityHeading: "How a community did this",
    communityParagraph:
      "None of this came from a warehouse. It came from people. Bin hosts who said yes before there was anything to say yes to. Neighbors who dropped a bag of outgrown clothes in a lobby on the way to work. A partner organization that handed us a pile of its own new supplies for mothers and babies so we could pass them along. Caseworkers who trusted a new organization with a real family's list. And a founding board that put on matching shirts and spent a Wednesday afternoon sorting donations at a local nonprofit's warehouse, because showing up is the whole point.",
    photos: [
      {
        src: "/images/newsletter/board-service-day-1.jpg",
        alt: "Board members in CCOF shirts sorting donated goods into large boxes",
        caption:
          "Our board's first service day. We came together, we showed up, and we did real work.",
      },
      {
        src: "/images/newsletter/board-service-day-2.jpg",
        alt: "Two board members laughing together between sorting boxes",
        caption: "And we had a very good time doing it.",
      },
    ],
    plainlyHeading: "How we work, said plainly",
    plainlyBullets: [
      "We never ask a partner for a child's name, and we never photograph a child. Ages and sizes are all we need.",
      "We contribute goods to the organizations caring for a family, never cash or gift cards to an individual. The people who know the family decide what reaches them.",
      "Every delivery is written down and signed by both organizations, with the source of every item. Our numbers are small because we are new, and each one can be traced.",
    ],
    socialHeading: "Why aren't we on social media?",
    socialParagraph:
      "We get asked, and the answer is on purpose. The organizations we serve beside earned this community's trust over a decade or more of quiet, consistent work. We intend to earn ours the same way: by showing up, delivering, and keeping our word, before we ask anyone to follow us. For now, our story lives at ChildrensCollectiveFL.org. And if you want to tell people what we are doing together, please do. Whatever you choose, simply say thank you to The Children's Collective of Florida and our community. That is the best post we could ask for.",
    thankYouHeading: "Thank you",
    thankYouParagraph:
      "To our partners, who let us serve beside you and trusted us with the families in your care. To our bin hosts and the neighbors who filled the bins. To our board, who showed up. We are grateful for every one of you. We pray that October finds more children with what they need, and more neighbors with the joy of having given it. This letter comes from The Children's Collective of Florida and the community that built it. I am just the grateful person who gets to lead the way.",
    nextHeading: "What comes next",
    nextItems: [
      "More bins in more lobbies, serviced every week.",
      "More partners, and more children served.",
      "The Collective Kids Closet, our storefront, opening in Martin County in 2027.",
      "A letter like this one every month, with the next chapter.",
    ],
    partHeading: "Be part of it",
    partItems: [
      // Web-edition delta, founder-flagged: "Forward this" becomes
      // "Share this page" for the medium.
      { text: "Share this page with someone who loves our community's kids." },
      {
        text: "Host a bin: two feet of indoor floor space, and we do the rest.",
        href: "/host-a-bin",
        label: "Host a bin",
      },
      { text: "Give online.", href: "/donate", label: "Give online" },
      {
        text: "If you care for children and need goods, call us.",
        href: "/partner-nonprofits",
        label: "Request goods",
      },
    ],
    scripture:
      "“And let us not be weary in well doing: for in due season we shall reap, if we faint not.”  Galatians 6:9 (KJV)",
  },
];
