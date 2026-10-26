import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/organisms/Navigation";
import EasterEggs from "@/components/atoms/EasterEggs";
import MotionProvider from "@/components/templates/MotionProvider";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = `${profile.name} | ${profile.title}`;
const siteDescription =
  "James Minton is a full stack lead software engineer in Leatherhead, UK, with 10+ years building scalable web applications with .NET, React, Next.js and Azure.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.website),
  title: {
    default: siteTitle,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  authors: [{ name: profile.name, url: profile.website }],
  openGraph: {
    type: "website",
    siteName: profile.name,
    locale: "en_GB",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-black text-white`}
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-purple-600 focus:text-white"
        >
          Skip to content
        </a>
        {/* Shared animated gradient background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-b from-gray-950 via-black to-gray-950" />
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/30 via-transparent to-blue-900/30" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

          {/* Animated orbs */}
          <div className="absolute top-20 left-1/4 w-125 h-125 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
          <div
            className="absolute bottom-20 right-1/4 w-100 h-100 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-800/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Persistent Navigation */}
        <MotionProvider>
          <Navigation />

          {/* Easter Eggs (Console messages + Konami Code) */}
          <EasterEggs />

          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
