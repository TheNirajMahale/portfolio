"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  // Return safe default during SSR/static generation when provider isn't mounted yet
  if (!ctx) return { theme: "dark" as Theme, toggleTheme: () => {} };
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Read saved preference or system preference on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  // Sync class on <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback((event?: React.MouseEvent) => {
    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    // Fallback if browser doesn't support View Transitions or no event provided
    if (!document.startViewTransition || !event) {
      setTheme(nextTheme);
      return;
    }

    // Expand from the center of the screen
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    
    // Calculate distance to the furthest corner (which is from center to any corner)
    const endRadius = Math.hypot(x, y);

    const transition = document.startViewTransition(() => {
      // Set CSS variables for the animation origin and radius
      document.documentElement.style.setProperty("--theme-x", `${x}px`);
      document.documentElement.style.setProperty("--theme-y", `${y}px`);
      document.documentElement.style.setProperty("--theme-radius", `${endRadius}px`);

      // Sync the DOM immediately for the snapshot transition
      const root = document.documentElement;
      if (nextTheme === "light") {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
      // Force React to finish re-rendering before the animation starts
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.finished.then(() => {
      // Clean up CSS variables
      document.documentElement.style.removeProperty("--theme-x");
      document.documentElement.style.removeProperty("--theme-y");
      document.documentElement.style.removeProperty("--theme-radius");
    });
  }, [theme]);

  // Prevent flash of wrong theme by hiding content until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
