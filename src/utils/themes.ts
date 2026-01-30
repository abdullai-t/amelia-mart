export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  description: string;
}

/**
 * Apply theme colors to the DOM as CSS custom properties
 */
export const applyTheme = (primaryColor: string, secondaryColor: string, accentColor: string) => {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.style.setProperty('--color-primary', primaryColor);
  root.style.setProperty('--color-secondary', secondaryColor);
  root.style.setProperty('--color-accent', accentColor);
};

export const themes: Theme[] = [
  {
    name: "Emerald",
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    accentColor: "#34d399",
    description: "Fresh and natural - perfect for markets"
  },
  {
    name: "Sapphire",
    primaryColor: "#0369a1",
    secondaryColor: "#0ea5e9",
    accentColor: "#38bdf8",
    description: "Professional and trustworthy"
  },
  {
    name: "Coral",
    primaryColor: "#dc2626",
    secondaryColor: "#f97316",
    accentColor: "#fb923c",
    description: "Warm and inviting"
  },
  {
    name: "Indigo",
    primaryColor: "#4f46e5",
    secondaryColor: "#6366f1",
    accentColor: "#818cf8",
    description: "Bold and modern"
  },
  {
    name: "Purple",
    primaryColor: "#7c3aed",
    secondaryColor: "#a855f7",
    accentColor: "#d8b4fe",
    description: "Creative and premium"
  },
  {
    name: "Rose",
    primaryColor: "#e11d48",
    secondaryColor: "#f43f5e",
    accentColor: "#fb7185",
    description: "Elegant and feminine"
  },
  {
    name: "Amber",
    primaryColor: "#d97706",
    secondaryColor: "#f59e0b",
    accentColor: "#fbbf24",
    description: "Warm and energetic"
  },
  {
    name: "Slate",
    primaryColor: "#475569",
    secondaryColor: "#64748b",
    accentColor: "#94a3b8",
    description: "Clean and minimal"
  },
  {
    name: "Teal",
    primaryColor: "#0d9488",
    secondaryColor: "#14b8a6",
    accentColor: "#2dd4bf",
    description: "Calm and balanced"
  },
  {
    name: "Fuchsia",
    primaryColor: "#c2185b",
    secondaryColor: "#ec407a",
    accentColor: "#f06292",
    description: "Bold and vibrant"
  },
];
