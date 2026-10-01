import { useSyncExternalStore } from "react";

export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export const THEME_STORAGE_KEY = "theme";
const DEFAULT_PREFERENCE: ThemePreference = "dark";
const CHANGE_EVENT = "spacexai:themechange";
export const DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_COLOR: Record<ResolvedTheme, string> = { dark: "#0a0a0a", light: "#ffffff" };

/**
 * Runs while the HTML is parsed, before the first paint, and must stay in sync with
 * `applyTheme`. The server always renders the dark theme.
 */
export const THEME_SCRIPT = `(function(){try{var p=localStorage.getItem("${THEME_STORAGE_KEY}");var d=p==="light"?false:p==="system"?matchMedia("${DARK_QUERY}").matches:true;var t=d?"dark":"light";var r=document.documentElement;r.classList.remove(d?"light":"dark");r.classList.add(t);r.style.colorScheme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",d?"${THEME_COLOR.dark}":"${THEME_COLOR.light}")}catch(e){}})()`;

function isPreference(value: string | null): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isPreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    return DEFAULT_PREFERENCE;
  }
}

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== "system") return preference;
  return window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
}

export function applyTheme(preference = readThemePreference()) {
  const theme = resolveTheme(preference);
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function setThemePreference(preference: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Storage can be unavailable (private mode, quota); the theme still applies for this visit.
  }
  applyTheme(preference);
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CHANGE_EVENT, onChange);
}

export function useThemePreference() {
  return useSyncExternalStore(subscribe, readThemePreference, () => DEFAULT_PREFERENCE);
}

/** The theme on screen; follows the OS while the preference is `system`. */
export function useResolvedTheme() {
  return useSyncExternalStore<ResolvedTheme>(
    subscribe,
    () => (document.documentElement.classList.contains("light") ? "light" : "dark"),
    () => "dark",
  );
}
