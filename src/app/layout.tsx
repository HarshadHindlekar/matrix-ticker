import type { Metadata, Viewport } from "next";
import { VT323, Share_Tech_Mono, Silkscreen, Inter } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-share-tech",
});

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LED Marquee Display | Train & Medical Banner Ticker",
  description:
    "Realistic LED dot-matrix marquee scroller for train station announcements, pharmacy signs, medical stores, and advertisement displays. Installable as a mobile app.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "LED Marquee",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff9900",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${shareTechMono.variable} ${silkscreen.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
