import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

import { AuthHeader } from "@/components/AuthHeader";
import { ColumnGlyph } from "@/components/motifs/ColumnGlyph";
import { GoldRule } from "@/components/ui/GoldRule";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Rhetoripendium",
  description: "Learn the art of rhetoric and persuasion, one lesson at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <header>
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-2 text-foreground">
              <ColumnGlyph className="text-gold" />
              <span className="font-display text-lg tracking-wide">Rhetoripendium</span>
            </div>
            <AuthHeader />
          </div>
          <GoldRule />
        </header>
        {children}
      </body>
    </html>
  );
}
