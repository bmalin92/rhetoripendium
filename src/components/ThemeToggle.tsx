"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "rp-theme";
const THEMES: Theme[] = ["light", "dark", "system"];
const LABELS: Record<Theme, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): Theme {
  if (typeof localStorage === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

function getServerSnapshot(): Theme {
  return "system";
}

function applyTheme(theme: Theme) {
  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem(STORAGE_KEY);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }
  // `storage` events only fire in *other* tabs by default — dispatch one
  // manually so this tab's useSyncExternalStore subscribers re-read it too.
  window.dispatchEvent(new Event("storage"));
}

function ThemeIcon({ theme }: { theme: Theme }) {
  switch (theme) {
    case "light":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      );
    case "dark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case "system":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <rect x="2" y="4" width="20" height="13" rx="1.5" />
          <path d="M8 20h8M12 17v3" />
        </svg>
      );
  }
}

export function ThemeToggle() {
  const active = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-full border border-border p-1 text-sm"
    >
      {THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          role="radio"
          aria-checked={active === theme}
          aria-label={LABELS[theme]}
          title={LABELS[theme]}
          onClick={() => applyTheme(theme)}
          className={`flex items-center justify-center rounded-full p-1.5 transition ${
            active === theme ? "bg-gold text-white" : "text-foreground hover:bg-surface"
          }`}
        >
          <ThemeIcon theme={theme} />
        </button>
      ))}
    </div>
  );
}
