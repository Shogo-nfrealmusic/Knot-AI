import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Shogo Kikuchi — AI Automation & Full-Stack Developer";
const description =
  "I build software, run it in a real business, and grow the audience around it. Booking platforms, internal apps, AI agents, and automation pipelines in production.";

// metadataBase turns the opengraph-image / twitter-image file conventions into absolute URLs.
export const metadata: Metadata = {
  metadataBase: new URL("https://shogo.build"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "Shogo Kikuchi",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary">
        {children}
        {/* Cookieless. Only collects in production, and only while the project's Analytics toggle is on. */}
        <Analytics />
      </body>
    </html>
  );
}
