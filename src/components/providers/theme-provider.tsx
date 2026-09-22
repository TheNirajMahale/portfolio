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

export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export interface TransitionOrigin {
  clientX: number;
  clientY: number;
}

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: TransitionOrigin) => void;
  toggleTheme: (origin?: TransitionOrigin) => void;
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

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "system" as Theme,
      resolvedTheme: "dark" as ResolvedTheme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    try {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved === "light" || saved === "dark" || saved === "system") return saved;
      return "system";
    } catch {
      return "system";
    }
  });

  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(getSystemTheme);
  const mounted = useMounted();
  const isTransitioningRef = useRef(false);

  // Active theme calculation
  const resolvedTheme: ResolvedTheme = theme === "system" ? systemResolved : theme;

  // Listen to OS theme changes if theme === "system"
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemResolved(e.matches ? "dark" : "light");
    };

    setSystemResolved(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Sync class on <html> whenever resolved theme changes
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (resolvedTheme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage unavailable fallback
    }
  }, [theme, resolvedTheme, mounted]);

  const applyThemeTransition = useCallback(
    (targetTheme: Theme, origin?: TransitionOrigin) => {
      if (isTransitioningRef.current) return;

      const nextResolved: ResolvedTheme =
        targetTheme === "system" ? getSystemTheme() : targetTheme;
      const currentResolved = resolvedTheme;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // If themes resolve to the same visual mode or no View Transitions
      if (
        !document.startViewTransition ||
        prefersReducedMotion ||
        nextResolved === currentResolved
      ) {
        const root = document.documentElement;
        if (nextResolved === "light") {
          root.classList.add("light");
        } else {
          root.classList.remove("light");
        }
        setThemeState(targetTheme);
        return;
      }

      isTransitioningRef.current = true;
      const root = document.documentElement;

      const x = origin?.clientX ?? (typeof window !== "undefined" ? window.innerWidth - 60 : 0);
      const y = origin?.clientY ?? (typeof window !== "undefined" ? 40 : 0);
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const styleId = "theme-view-transition-styles";
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = `
        ::view-transition-group(root) {
          animation-duration: 0.7s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: none !important;
          z-index: -1 !important;
        }
        ::view-transition-new(root),
        .dark::view-transition-new(root) {
          animation: reveal-theme-blur 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          filter: blur(2px);
          z-index: 1 !important;
        }
        @keyframes reveal-theme-blur {
          0% {
            clip-path: circle(0% at ${x}px ${y}px);
            filter: blur(8px);
          }
          50% {
            filter: blur(4px);
          }
          100% {
            clip-path: circle(${endRadius}px at ${x}px ${y}px);
            filter: blur(0px);
          }
        }
      `;

      const cleanup = () => {
        isTransitioningRef.current = false;
        const el = document.getElementById(styleId);
        if (el) el.remove();
      };

      try {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setThemeState(targetTheme);
            if (nextResolved === "light") {
              root.classList.add("light");
            } else {
              root.classList.remove("light");
            }
          });
        });

        transition.finished.finally(cleanup).catch(cleanup);
      } catch {
        cleanup();
      }
    },
    [resolvedTheme]
  );

  const toggleTheme = useCallback(
    (origin?: TransitionOrigin) => {
      // Cycle: system -> light -> dark -> system
      const cycleMap: Record<Theme, Theme> = {
        system: "light",
        light: "dark",
        dark: "system",
      };
      applyThemeTransition(cycleMap[theme], origin);
    },
    [theme, applyThemeTransition]
  );

  const setTheme = useCallback(
    (newTheme: Theme, origin?: TransitionOrigin) => {
      applyThemeTransition(newTheme, origin);
    },
    [applyThemeTransition]
  );

  // Prevent flash of wrong theme by hiding content until mounted
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
