"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, animate, type AnimationPlaybackControls } from "motion/react";
import { Quote as QuoteIcon } from "lucide-react";
import siteData from "@/data/site.json";

export interface QuoteData {
  text: string;
  author: string;
  source?: string;
  subtext?: string;
}

interface HeroQuoteProps {
  quote?: QuoteData;
  className?: string;
}

export function HeroQuote({ quote = siteData.hero.quote, className = "" }: HeroQuoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationsRef = useRef<AnimationPlaybackControls[]>([]);

  // Motion values for magnetic displacement & drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const stopActiveAnimations = useCallback(() => {
    animationsRef.current.forEach((anim) => anim.stop());
    animationsRef.current = [];
  }, []);

  const snapBack = useCallback(() => {
    stopActiveAnimations();
    // High-fidelity damped spring snap-back matching Sahil Codex physics
    const springConfig = { type: "spring" as const, stiffness: 95, damping: 9, mass: 1 };
    animationsRef.current = [
      animate(x, 0, springConfig),
      animate(y, 0, springConfig),
    ];
  }, [x, y, stopActiveAnimations]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopActiveAnimations();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture safety
    }
    setIsDragging(true);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const n = (e.clientX - rect.left) / rect.width - 0.5;
      const a = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(n * 72);
      y.set(a * 44);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const n = (e.clientX - rect.left) / rect.width - 0.5;
    const a = (e.clientY - rect.top) / rect.height - 0.5;

    if (isDragging || e.buttons === 1) {
      stopActiveAnimations();
      x.set(n * 72);
      y.set(a * 44);
    } else {
      stopActiveAnimations();
      x.set(n * 22);
      y.set(a * 14);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safety
      }
      setIsDragging(false);
    }
    snapBack();
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      snapBack();
    }
  };

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
    >
      {/* Dot Matrix Canvas with Radial Vignette Mask */}
      <div
        className="pointer-events-none absolute inset-0 select-none opacity-35 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1.5px, transparent 1.5px)",
          backgroundSize: "12px 12px",
          backgroundPosition: "center",
          maskImage: "radial-gradient(ellipse at center, black 45%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 45%, transparent 85%)",
        }}
        aria-hidden="true"
      />

      {/* Centered Interactive Drag & Magnetic Content Area */}
      <div className="relative z-10 flex min-h-[115px] sm:min-h-0 h-full w-full items-center justify-center px-4 pointer-events-none">
        <motion.div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          style={{ x, y, touchAction: "none" }}
          className={`group relative flex max-w-md sm:max-w-lg flex-col items-center text-center will-change-transform pointer-events-auto px-5 py-2.5 rounded-xl select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          {/* Subtle quotation icon */}
          <div className="mb-1 flex items-center justify-center text-muted-foreground/35 transition-colors group-hover:text-muted-foreground/60">
            <QuoteIcon size={14} strokeWidth={1.5} />
          </div>

          {/* Quote Body Typography */}
          <blockquote className="m-0 text-balance font-serif italic text-xs sm:text-sm md:text-base font-medium tracking-tight text-foreground/90 transition-colors group-hover:text-foreground leading-snug">
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Author Citation & Source Badge */}
          <footer className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-muted-foreground/80 tracking-wider">
            <span className="h-px w-2.5 sm:w-3 bg-foreground/20" aria-hidden="true" />
            <cite className="font-semibold text-foreground/80 not-italic uppercase">
              {quote.author}
            </cite>
            {quote.source && (
              <>
                <span className="text-muted-foreground/40 font-light" aria-hidden="true">•</span>
                <span className="italic font-sans text-muted-foreground/75 normal-case">
                  {quote.source}
                </span>
              </>
            )}
            <span className="h-px w-2.5 sm:w-3 bg-foreground/20" aria-hidden="true" />
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
