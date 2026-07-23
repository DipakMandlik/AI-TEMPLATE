import { ThemeProvider } from "@ai-template/ui";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import { SITE_URL } from "../lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "The world's best AI Prompt & AI Agent Template Library — production-ready templates for Claude Code, Cursor, Copilot, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI-TEMPLATE",
    template: "%s · AI-TEMPLATE",
  },
  description: DESCRIPTION,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  // Absolute URLs (not the `icon`/`apple-icon` file convention) so the
  // favicon links resolve through metadataBase — see the route comments in
  // app/favicon.png/route.tsx for why.
  icons: {
    icon: `${SITE_URL}/favicon.png`,
    apple: `${SITE_URL}/apple-touch-icon.png`,
  },
  openGraph: {
    type: "website",
    siteName: "AI-TEMPLATE",
    title: "AI-TEMPLATE",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-TEMPLATE",
    description: DESCRIPTION,
  },
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AI-TEMPLATE",
  description: DESCRIPTION,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/templates?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          // WEBSITE_JSON_LD is a static, developer-authored object — no user
          // input reaches this serialization.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <NuqsAdapter>
          <ThemeProvider>
            <SiteHeader />
            <div className="flex flex-1 flex-col">{children}</div>
            <SiteFooter />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
