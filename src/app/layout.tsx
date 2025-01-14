import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Air Alert | Protect Your Family's Health",
  description: "⚠️ See how toxic air is affecting your family's health right now. See immediate impacts on children's development and elderly health. Act now to protect your loved ones.",
  keywords: "air quality, health impact, family safety, air pollution, children's health, elderly care, air toxicity",
  icons: {
    icon: "/favicon.png",
  },
  metadataBase: new URL("https://air.nmn.gl"),
  openGraph: {
    title: "Toxic Air Alert | Protect Your Family's Health",
    description: "See how toxic air is affecting your family's health right now. Real-time monitoring of health impacts on children and elderly.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Air Quality Health Impact Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "⚠️ Toxic Air Alert | Protect Your Family",
    description: "Real-time monitoring showing how toxic air affects your family's health. Act now to protect your loved ones.",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased w-full max-w-full m-0`}>
        {children}
        <GoogleAnalytics gaId="G-NQXS67XNGL" />
      </body>
    </html>
  );
}
