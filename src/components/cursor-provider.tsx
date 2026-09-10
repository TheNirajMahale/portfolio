"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";

interface CursorContextValue {
  cursorEnabled: boolean;
  toggleCursor: () => void;
}

const CursorContext = createContext<CursorContextValue>({
  cursorEnabled: false,
  toggleCursor: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export function CursorProvider({ children }: { children: React.ReactNode }) {
  // Default is OFF (false)
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("custom-cursor-enabled") === "true";
    } catch {
      return false;
    }
  });
  const mounted = useMounted();

  const toggleCursor = useCallback(() => {
    setCursorEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("custom-cursor-enabled", String(next));
      } catch {
        // Storage unavailable fallback
      }
      return next;
    });
  }, []);

  return (
    <CursorContext.Provider value={{ cursorEnabled: mounted ? cursorEnabled : false, toggleCursor }}>
      {children}
    </CursorContext.Provider>
  );
}
