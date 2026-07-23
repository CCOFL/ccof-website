import Link from "next/link";
import Image from "next/image";
import {
  ORG,
  NAV,
  PRIMARY_CTA,
  FL_DISCLOSURE,
  TAX_NOTE,
} from "@/lib/site";
import { LinkButton } from "./Button";

export function Footer() {
  const year = 2026;
  return (
    <footer className="bg-ink text-cream/85">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand + mission */}
          <div>
            <Image
              src="/brand/CCOF_Logo_v1_Reverse.svg"
              alt="The Children's Collective of Florida logo"
              width={160}
              height={160}
              className="h-auto w-40"
            />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
              {ORG.tagline} Built in Martin County. Building for Florida.
            </p>
            <LinkButton href={PRIMARY_CTA.href} className="mt-5">
              {PRIMARY_CTA.label}
            </LinkButton>
          </div>

          {/* Explore */}
          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cream/80 transition-colors hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/give-goods"
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  Give Goods
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  Give Funds
                </Link>
              </li>
              <li>
                <Link
                  href="/where-it-goes"
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  Where It Goes
                </Link>
              </li>
              <li>
                <Link
                  href="/partner-nonprofits"
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  For Partner Nonprofits
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact + social */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cream/60">
              Connect
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${ORG.email}`}
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  {ORG.email}
                </a>
              </li>
              <li className="text-cream/70">{ORG.location}</li>
              <li className="text-cream/70">Physical location coming soon</li>
            </ul>
          </div>
        </div>

        {/* Legal links */}
        <nav
          aria-label="Legal"
          className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-cream/15 pt-8 text-sm"
        >
          {[
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms of Use", href: "/terms" },
            { label: "Donation & Refund Policy", href: "/donation-policy" },
            { label: "Sources & Methodology", href: "/sources" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-cream/75 transition-colors hover:text-cream"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Transparency / legal block (brief §5, §1) */}
        <div className="mt-6 space-y-3 text-xs leading-relaxed text-cream/55">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>501(c)(3) public charity</span>
            <span aria-hidden>·</span>
            <span>EIN {ORG.ein}</span>
            <span aria-hidden>·</span>
            <span>FL Charitable Registration No. {ORG.flReg}</span>
            <span aria-hidden>·</span>
            <span>FL Doc. No. {ORG.flDoc}</span>
          </p>
          <p>{TAX_NOTE}</p>
          <p className="max-w-3xl">{FL_DISCLOSURE}</p>
          <p className="pt-2 text-cream/60">
            © {year} {ORG.legalName}. All rights reserved.
            <span aria-hidden className="mx-2">
              ·
            </span>
            {/* Exact wording required by Netlify's Open Source plan. */}
            <a
              href="https://www.netlify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              This site is powered by Netlify
            </a>
            <span aria-hidden className="mx-2">
              ·
            </span>
            {/* Public source repo — satisfies the Netlify Open Source plan's
                requirement that the site link to its open-source repository. */}
            <a
              href="https://github.com/CCOFL/ccof-website"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 transition-colors hover:text-cream hover:underline"
            >
              Open source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
