"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface LoaderContextValue {
  /** True while the initial site loader is active */
  isLoaderActive: boolean;
  /** True once the initial site loader has ever finished in this session */
  hasLoaded: boolean;
  /** Signal that the initial site loader has completed */
  markLoaded: () => void;
  /** Direct setter if needed */
  setLoaderActive: (active: boolean) => void;
}

const LoaderContext = createContext<LoaderContextValue>({
  isLoaderActive: false,
  hasLoaded: false,
  markLoaded: () => {},
  setLoaderActive: () => {},
});

export function useLoader() {
  return useContext(LoaderContext);
}

/**
 * Synchronous sessionStorage read — must happen during the first render
 * (not in a useEffect) so that `hasLoaded` is correct BEFORE any child
 * components mount. This avoids the one-frame flash where the avatar
 * would re-animate with `initial={{ y: -800 }}`.
 */
function readSessionFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("portfolio_has_loaded") === "true";
  } catch {
    return false;
  }
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  // Lazy initializers run synchronously on mount — no useEffect delay
  const [hasLoaded, setHasLoaded] = useState<boolean>(readSessionFlag);
  const [isLoaderActive, setLoaderActiveState] = useState<boolean>(() => !readSessionFlag());

  const markLoaded = useCallback(() => {
    setHasLoaded(true);
    setLoaderActiveState(false);
    try {
      sessionStorage.setItem("portfolio_has_loaded", "true");
    } catch {
      // Ignore if sessionStorage is disabled
    }
  }, []);

  const setLoaderActive = useCallback((active: boolean) => {
    setLoaderActiveState(active);
  }, []);

  return (
    <LoaderContext.Provider
      value={{
        isLoaderActive,
        hasLoaded,
        markLoaded,
        setLoaderActive,
      }}
    >
      {children}
    </LoaderContext.Provider>
  );
}
