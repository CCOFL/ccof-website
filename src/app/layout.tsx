import type { Metadata } from "next";
import Script from "next/script";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { ORG } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

/**
 * GA4 measurement id (public by design). Set in Netlify's PRODUCTION context
 * ONLY, so deploy previews, branch deploys, and local dev never pollute the
 * data; unsetting the variable turns analytics off sitewide. Supports the
 * Google Ad Grants application (Google for Nonprofits). Disclosed in
 * /privacy. NOTE: this measures site traffic only; the standing no-tracking
 * rule for receipts and statutory URLs is unaffected.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

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
    default: `${ORG.name} · ${ORG.tagline}`,
    template: `%s · ${ORG.name}`,
  },
  description: `${ORG.tagline} ${ORG.legalName}, a Florida 501(c)(3) channeling community generosity into practical support for children and families.`,
  openGraph: {
    type: "website",
    siteName: ORG.name,
    locale: "en_US",
    url: ORG.url,
    title: `${ORG.name} · ${ORG.tagline}`,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  // Favicons / app icons from the v4 "child in hand" icon mark.
  icons: {
    icon: [
      { url: "/brand/CCOF_Logo_v4_Icon.svg", type: "image/svg+xml" },
      { url: "/brand/CCOF_Logo_v4_Favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/CCOF_Logo_v4_Favicon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/brand/CCOF_Logo_v4_Favicon_180.png", sizes: "180x180" }],
  },
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
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
