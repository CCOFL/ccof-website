import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ORG } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

// Nunito Sans — LOCKED CCOF brand typeface, used throughout.
const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(ORG.url),
  title: {
    default: `${ORG.name} — ${ORG.tagline}`,
    template: `%s · ${ORG.name}`,
  },
  description: `${ORG.tagline} ${ORG.legalName}, a Florida 501(c)(3) channeling community generosity into practical support for children and families.`,
  openGraph: {
    type: "website",
    siteName: ORG.name,
    locale: "en_US",
    url: ORG.url,
    title: `${ORG.name} — ${ORG.tagline}`,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${nunitoSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background">
        <a
          href="#main"
          className="sr-only z-50 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-sage focus:px-4 focus:py-2 focus:text-cream"
        >
          Skip to main content
        </a>
        <JsonLd />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
