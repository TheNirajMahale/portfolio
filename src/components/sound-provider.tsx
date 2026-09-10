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

import siteData from "@/data/site.json";

const STORAGE_KEY = "ui-sound";
export const CLICK_SOUND = siteData.audio?.clickSoundSrc ?? "/sounds/click.mp3";
export const CLICK_VOLUME = siteData.audio?.clickVolume ?? 0.3;

type SoundContextType = {
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  toggleSound: () => void;
  playClick: () => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

function getClickAudio() {
  const audio = new Audio(CLICK_SOUND);
  audio.volume = CLICK_VOLUME;
  return audio;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      return false;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setSoundEnabled = useCallback((value: boolean) => {
    setSoundEnabledState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "on" : "off");
    } catch {
      // Storage unavailable fallback
    }
  }, []);

  const playClick = useCallback(() => {
    if (!soundEnabled) return;

    try {
      if (!audioRef.current) {
        audioRef.current = getClickAudio();
      }
      const audio = audioRef.current;
      audio.currentTime = 0;
      void audio.play().catch(() => {});
    } catch {
      // Audio playback blocked
    }

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(8);
    }
  }, [soundEnabled]);

  // Delegated global listener on pointerdown for instant tactile feedback
  useEffect(() => {
    if (!soundEnabled) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;

      const hit = target.closest(
        'a[href], button, summary, [role="button"], [role="menuitem"], [role="option"], [role="switch"], [role="tab"], input[type="submit"], input[type="checkbox"], input[type="radio"], label[for]'
      );

      if (!hit) return;
      if (hit.hasAttribute("disabled") || hit.getAttribute("aria-disabled") === "true") {
        return;
      }

      playClick();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [soundEnabled, playClick]);

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      try {
        if (!audioRef.current) {
          audioRef.current = getClickAudio();
        }
        const audio = audioRef.current;
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      } catch {
        // Audio playback blocked
      }
    }
  }, [soundEnabled, setSoundEnabled]);

  const value = useMemo(
    () => ({
      soundEnabled,
      setSoundEnabled,
      toggleSound,
      playClick,
    }),
    [soundEnabled, setSoundEnabled, toggleSound, playClick]
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (ctx) return ctx;
  return {
    soundEnabled: false,
    setSoundEnabled: () => {},
    toggleSound: () => {},
    playClick: () => {},
  };
}
