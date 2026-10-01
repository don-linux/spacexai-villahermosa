"use client";

import { useEffect, useLayoutEffect } from "react";
import {
  applyTheme,
  DARK_QUERY,
  readThemePreference,
  THEME_SCRIPT,
  THEME_STORAGE_KEY,
} from "@/lib/theme";

/**
 * Applies the saved theme before the first paint, then keeps it in sync with the OS (in
 * `system` mode) and with other tabs.
 */
export function ThemeScript() {
  // Strict Mode's dev remount resets `<html>` to its JSX attributes; a no-op in production.
  useLayoutEffect(() => applyTheme(), []);

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const handleSystemChange = () => {
      if (readThemePreference() === "system") applyTheme("system");
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === THEME_STORAGE_KEY) applyTheme();
    };
    query.addEventListener("change", handleSystemChange);
    window.addEventListener("storage", handleStorage);
    return () => {
      query.removeEventListener("change", handleSystemChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <script
      // React warns about rendering <script> on the client; only the server copy needs to run.
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  );
}
