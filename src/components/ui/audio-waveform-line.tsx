"use client";

import { motion } from "motion/react";

interface AudioWaveformLineProps {
  isPlaying: boolean;
  className?: string;
}

// Preset subtle wave heights (minimal spikes: 2px baseline, peaking at 6-8px)
const BARS = [
  { min: 2, max: 5, duration: 1.1, delay: 0.0 },
  { min: 2, max: 7, duration: 1.3, delay: 0.15 },
  { min: 2, max: 4, duration: 0.9, delay: 0.3 },
  { min: 2, max: 8, duration: 1.4, delay: 0.1 },
  { min: 2, max: 6, duration: 1.2, delay: 0.25 },
  { min: 2, max: 4, duration: 1.0, delay: 0.4 },
  { min: 2, max: 7, duration: 1.3, delay: 0.05 },
  { min: 2, max: 5, duration: 1.1, delay: 0.2 },
  { min: 2, max: 8, duration: 1.5, delay: 0.35 },
  { min: 2, max: 4, duration: 0.95, delay: 0.1 },
  { min: 2, max: 6, duration: 1.25, delay: 0.3 },
  { min: 2, max: 3, duration: 1.05, delay: 0.15 },
];

export function AudioWaveformLine({ isPlaying, className = "" }: AudioWaveformLineProps) {
  return (
    <div
      className={`flex items-center gap-[3px] px-1 select-none pointer-events-none transition-opacity duration-300 ${
        isPlaying ? "opacity-90" : "opacity-30"
      } ${className}`}
      aria-hidden="true"
    >
      {BARS.map((bar, i) => (
        <motion.span
          key={i}
          className={`w-[2px] rounded-full transition-colors duration-300 ${
            isPlaying ? "bg-foreground" : "bg-muted-foreground/60"
          }`}
          animate={
            isPlaying
              ? {
                  height: [bar.min, bar.max, bar.min],
                }
              : {
                  height: 2,
                }
          }
          transition={
            isPlaying
              ? {
                  repeat: Infinity,
                  duration: bar.duration,
                  delay: bar.delay,
                  ease: "easeInOut",
                }
              : {
                  duration: 0.3,
                }
          }
          style={{ height: 2 }}
        />
      ))}
    </div>
  );
}
