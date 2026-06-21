import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Dastakhat — Create & sign legal documents in seconds";
const description =
  "Dastakhat lets freelancers and creators create an NDA, freelance contract, or licensing agreement, sign it, and share a link for the other party to sign. Free to use.";

// FAVICON / APP ICONS — handled by Next's file convention (no tags needed here).
// Just replace / add these files in the app/ folder and Next wires them up:
//   app/favicon.ico      → browser tab favicon  (already present; replace it)
//   app/icon.png         → 512×512 PWA / general icon (transparent)
//   app/apple-icon.png   → 180×180 iOS home-screen icon
//
// OG IMAGE — drop a 1200×630 share image at:  public/og.png
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://dastakhat.app"),
  title,
  description,
  applicationName: "Dastakhat",
  openGraph: {
    type: "website",
    siteName: "Dastakhat",
    url: "/",
    title,
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Dastakhat — create & sign documents" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  // Apply font variable classes on the html element to ensure
  // the same attributes are present during SSR and on the client.
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={`antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
