import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { PageHero } from "@/components/PageHero";
import { ORG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sources & Methodology",
  description:
    "Full citations for the child-welfare statistics cited across The Children's Collective of Florida's site, and how we use them.",
  alternates: { canonical: "/sources" },
};

const FIGURES: { figure: string; statement: string; source: string }[] = [
  {
    figure: "1,319",
    statement: "child-maltreatment reports in Martin County in a single year.",
    source: "FL Dept. of Health, FLHealthCHARTS; NCANDS (FFY2022).",
  },
  {
    figure: "~3,000",
    statement: "local children living in poverty.",
    source: "U.S. Census Bureau (Small Area Income & Poverty Estimates).",
  },
  {
    figure: "~6 in 10",
    statement:
      "removed children placed with relatives (kinship care) rather than in non-relative foster homes.",
    source: "Federal AFCARS (FFY2022).",
  },
  {
    figure: "115",
    statement: "children served in foster care locally.",
    source: "Communities Connected for Kids (CCKids) 2024 Annual Report.",
  },
  {
    figure: "15%",
    statement:
      "of children in care placed in group homes — nearly double the state rate.",
    source: "Federal AFCARS (FFY2022); FL Dept. of Children & Families.",
  },
];

export default function SourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparency"
        title="Sources & Methodology"
        intro="We cite real data because the need is real. Here is exactly where each figure on this site comes from."
      />

      <Section background="white">
        <div className="prose-legal">
          <h2>The figures we cite</h2>
          <p>
            Throughout this site we reference child-welfare data for Martin
            County and Florida. Each figure and its primary source is listed
            below.
          </p>
          <ul>
            {FIGURES.map((f) => (
              <li key={f.figure}>
                <strong>{f.figure}</strong> — {f.statement}{" "}
                <span className="text-muted">Source: {f.source}</span>
              </li>
            ))}
          </ul>

          <h2>Primary sources</h2>
          <ul>
            <li>U.S. Census Bureau</li>
            <li>
              Federal Adoption &amp; Foster Care Analysis and Reporting System
              (AFCARS) and National Child Abuse &amp; Neglect Data System
              (NCANDS), FFY2022
            </li>
            <li>Florida Department of Health — FLHealthCHARTS</li>
            <li>Communities Connected for Kids (CCKids) 2024 Annual Report</li>
          </ul>

          <h2>How we use these figures</h2>
          <p>
            Figures reflect the most recent data available at the time of
            publication and are used to describe local need, not to represent
            outcomes of {ORG.abbr}&apos;s own programs (we are pre-launch). As
            newer data is released — and once {ORG.flagshipProgram} is operating
            — we will update these numbers and publish our own program results
            on our{" "}
            <a href="/where-it-goes">Where It Goes</a> page.
          </p>
          <p className="text-sm text-muted">
            Spotted something that needs updating? Email{" "}
            <a href={`mailto:${ORG.email}`}>{ORG.email}</a>.
          </p>
        </div>
      </Section>
    </>
  );
}
