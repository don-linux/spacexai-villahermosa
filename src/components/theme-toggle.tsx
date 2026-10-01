"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { setThemePreference, useThemePreference } from "@/lib/theme";
import type { ThemePreference } from "@/lib/theme";

const NEXT: Record<ThemePreference, ThemePreference> = {
  dark: "system",
  system: "light",
  light: "dark",
};

const LABEL: Record<ThemePreference, string> = {
  dark: "Cambiar a tema oscuro",
  system: "Usar el tema del sistema",
  light: "Cambiar a tema claro",
};

/** Cycles dark, system and light like x.ai; the icon always shows the opposite of the theme on screen. */
export function ThemeToggle() {
  const next = NEXT[useThemePreference()];

  return (
    <button
      type="button"
      onClick={() => setThemePreference(next)}
      aria-label={LABEL[next]}
      title={LABEL[next]}
      className="flex size-7 items-center justify-center rounded-full text-foreground/40 transition-colors hover:text-foreground focus-visible:text-foreground"
    >
      <SunIcon className="theme-dark-only size-4" />
      <MoonIcon className="theme-light-only size-4" />
    </button>
  );
}
