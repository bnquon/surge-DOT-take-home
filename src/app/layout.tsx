import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { RootLayoutProps } from "@/types/layout";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const title = "Highlights | BQ Surge Take-Home";
const description =
  "Places, experiences, and a few good memories. A Surge take-home by BQ.";
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const siteUrl =
  process.env.SITE_URL ||
  (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  authors: [{ name: "BQ" }],
  openGraph: {
    title,
    description,
    siteName: "Highlights",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Highlights — BQ Surge Take-Home, with illustrated landscape cards.",
      },
    ],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  );
}
