"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  // Return safe default during SSR/static generation when provider isn't mounted yet
  if (!ctx) return { theme: "dark" as Theme, toggleTheme: () => {} };
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    try {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "dark";
    }
  });

  const mounted = useMounted();
  const isTransitioningRef = useRef(false);

  // Sync class on <html> whenever theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage unavailable fallback
    }
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
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
    const root = document.documentElement;

    const cleanup = () => {
      isTransitioningRef.current = false;
    };

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
          if (nextTheme === "light") {
            root.classList.add("light");
          } else {
            root.classList.remove("light");
          }
        });
      });

      transition.ready
        .then(() => {
          const animation = root.animate(
            {
              clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 0 0 0)",
              ],
            },
            {
              duration: 900,
              easing: "cubic-bezier(0.25, 1, 0.4, 1)",
              pseudoElement: "::view-transition-new(root)",
            }
          );
          animation.finished.finally(cleanup).catch(cleanup);
        })
        .catch(cleanup);
    } catch {
      cleanup();
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
