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
          onClick={() => applyTheme(theme)}
          className={`rounded-full px-3 py-1 transition ${
            active === theme ? "bg-gold text-white" : "text-foreground hover:bg-surface"
          }`}
        >
          {LABELS[theme]}
        </button>
      ))}
    </div>
  );
}
