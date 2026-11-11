import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

// Fonts load via <link> (Google Fonts CDN) instead of next/font/google —
// next/font fetches font data at build time and fails on hosts where that
// request is blocked or rate-limited. Literal family names are mapped to the
// same --font-* variables in globals.css, so nothing else changes.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined)
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)
  ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Souk Lens — عدسة السوق | PayPal AI Hackathon",
  description: "Snap, speak, search — turn anything into a ready listing, then check out with PayPal. Vision + Listing + Studio + Voice AI.",
  manifest: "/manifest.webmanifest",
  applicationName: "Souk Lens",
  appleWebApp: { capable: true, title: "Souk Lens", statusBarStyle: "black-translucent" },
  icons: { icon: "/logo.svg", apple: "/logo.svg", shortcut: "/logo.svg" },
  openGraph: { title: "Souk Lens — عدسة السوق", description: "Turn any photo, voice note, link or old store into a complete listing.", images: ["/brand/og-cover.svg"] },
};

export const viewport: Viewport = { themeColor: "#7c5cff", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-center" toastOptions={{ style: { fontFamily: "inherit" } }} />
      </body>
    </html>
  );
}
