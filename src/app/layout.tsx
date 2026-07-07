import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

import { AuthHeader } from "@/components/AuthHeader";
import { ColumnGlyph } from "@/components/motifs/ColumnGlyph";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoldRule } from "@/components/ui/GoldRule";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("rp-theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.setAttribute("data-theme", theme);
    }
  } catch (e) {}
})();
`;

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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <header className="sticky md:static top-0 z-10 bg-background">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-foreground">
              <ColumnGlyph className="text-gold" />
              <span className="hidden font-display text-lg tracking-wide sm:inline">Rhetoripendium</span>
            </Link>
            <div className="flex items-center gap-3">
              <AuthHeader />
              <ThemeToggle />
            </div>
          </div>
          <GoldRule />
        </header>
        {children}
      </body>
    </html>
  );
}
