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
  const activeAnimRef = useRef<Animation | null>(null);

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

    // Fallback if browser doesn't support View Transitions or reduced motion is preferred
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    // Expand from the center of the screen
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    
    // Calculate distance to the furthest corner (center to corner)
    const endRadius = Math.hypot(x, y);

    isTransitioningRef.current = true;

    // Cancel any ongoing animation if still active
    if (activeAnimRef.current) {
      activeAnimRef.current.cancel();
      activeAnimRef.current = null;
    }

    const transition = document.startViewTransition(() => {
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

    const cleanup = () => {
      isTransitioningRef.current = false;
      activeAnimRef.current = null;
    };

    if (transition.finished && typeof transition.finished.finally === "function") {
      transition.finished.finally(cleanup).catch(() => {});
    }

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        const anim = document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 850,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            pseudoElement: "::view-transition-new(root)",
            fill: "both",
          }
        );
        activeAnimRef.current = anim;
      })
      .catch(() => {
        cleanup();
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
