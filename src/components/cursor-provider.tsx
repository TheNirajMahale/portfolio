"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

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

export function CursorProvider({ children }: { children: React.ReactNode }) {
  // Default is OFF (false)
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("custom-cursor-enabled");
    if (saved === "true") {
      setCursorEnabled(true);
    }
    setMounted(true);
  }, []);

  const toggleCursor = useCallback(() => {
    setCursorEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("custom-cursor-enabled", String(next));
      return next;
    });
  }, []);

  return (
    <CursorContext.Provider value={{ cursorEnabled: mounted ? cursorEnabled : false, toggleCursor }}>
      {children}
    </CursorContext.Provider>
  );
}
