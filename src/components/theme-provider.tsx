"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
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
  const isTransitioningRef = useRef(false);

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
    if (isTransitioningRef.current) return;

    const isDark = theme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    // Fallback if reduced motion is preferred or View Transitions not supported
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || prefersReducedMotion) {
      const root = document.documentElement;
      if (nextTheme === "light") {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }
      setTheme(nextTheme);
      return;
    }

    isTransitioningRef.current = true;

    // Origin coordinates from center of screen
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;

    // Calculate maximum radius from center to furthest corner
    const maxRadius = Math.hypot(x, y);

    const root = document.documentElement;
    root.style.setProperty("--ripple-x", `${x}px`);
    root.style.setProperty("--ripple-y", `${y}px`);
    root.style.setProperty("--ripple-r", `${Math.ceil(maxRadius)}px`);

    const transition = document.startViewTransition(() => {
      if (nextTheme === "light") {
        root.classList.add("light");
      } else {
        root.classList.remove("light");
      }

      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    const cleanup = () => {
      isTransitioningRef.current = false;
    };

    if (transition.finished && typeof transition.finished.finally === "function") {
      transition.finished.finally(cleanup).catch(cleanup);
    } else {
      setTimeout(cleanup, 550);
    }
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
