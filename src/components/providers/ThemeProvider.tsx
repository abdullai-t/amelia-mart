"use client";

import { useEffect } from "react";
import { applyTheme } from "@/utils/themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load theme settings from API
    const loadTheme = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const settings = await response.json();
          applyTheme(
            settings.primaryColor || "#16a34a",
            settings.secondaryColor || "#059669",
            settings.accentColor || "#10b981"
          );
        }
      } catch (error) {
        console.error("Failed to load theme settings:", error);
        // Apply default theme if fetch fails
        applyTheme("#16a34a", "#059669", "#10b981");
      }
    };

    loadTheme();
  }, []);

  return <>{children}</>;
}
