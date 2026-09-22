"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface LoaderContextValue {
  /** True while the initial site loader is active */
  isLoaderActive: boolean;
  /** Called by the page component to signal loader start/end */
  setLoaderActive: (active: boolean) => void;
}

const LoaderContext = createContext<LoaderContextValue>({
  isLoaderActive: false,
  setLoaderActive: () => {},
});

export function useLoader() {
  return useContext(LoaderContext);
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoaderActive, setActive] = useState(true);

  const setLoaderActive = useCallback((active: boolean) => {
    setActive(active);
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoaderActive, setLoaderActive }}>
      {children}
    </LoaderContext.Provider>
  );
}
