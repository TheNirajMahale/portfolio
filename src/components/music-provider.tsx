"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STORAGE_KEY = "portfolio-music";
export const BACKGROUND_MUSIC_SRC = "/sounds/ambient-piano.mp3";
export const TARGET_VOLUME = 0.18; // Soft ambient volume (18%)

type MusicContextType = {
  musicEnabled: boolean;
  toggleMusic: () => void;
  setMusicEnabled: (value: boolean) => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [musicEnabled, setMusicEnabledState] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(BACKGROUND_MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "on") {
        setMusicEnabledState(true);
      }
    } catch {
      // localStorage unavailable fallback
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle smooth fade-in and fade-out
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const stepMs = 30;
    const fadeDurationMs = 450;
    const steps = fadeDurationMs / stepMs;

    if (musicEnabled) {
      void audio.play().catch(() => {
        // Autoplay policy prevented playback until user interaction
        setMusicEnabledState(false);
      });

      const volumeIncrement = (TARGET_VOLUME - audio.volume) / steps;

      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) return;
        if (audio.volume + volumeIncrement >= TARGET_VOLUME) {
          audio.volume = TARGET_VOLUME;
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        } else {
          audio.volume = Math.min(TARGET_VOLUME, audio.volume + volumeIncrement);
        }
      }, stepMs);
    } else {
      const volumeDecrement = audio.volume / steps;

      fadeIntervalRef.current = setInterval(() => {
        if (!audioRef.current) return;
        if (audio.volume - volumeDecrement <= 0.01) {
          audio.volume = 0;
          audio.pause();
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        } else {
          audio.volume = Math.max(0, audio.volume - volumeDecrement);
        }
      }, stepMs);
    }
  }, [musicEnabled]);

  const setMusicEnabled = useCallback((value: boolean) => {
    setMusicEnabledState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    } catch {
      // localStorage unavailable fallback
    }
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabledState((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      } catch {
        // localStorage unavailable fallback
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      musicEnabled,
      toggleMusic,
      setMusicEnabled,
    }),
    [musicEnabled, toggleMusic, setMusicEnabled]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic(): MusicContextType {
  const ctx = useContext(MusicContext);
  if (ctx) return ctx;
  return {
    musicEnabled: false,
    toggleMusic: () => {},
    setMusicEnabled: () => {},
  };
}
