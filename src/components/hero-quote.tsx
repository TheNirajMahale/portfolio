"use client";

import { useRef } from "react";
import { motion } from "motion/react";
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
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={constraintsRef}
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

      {/* Centered Content Area */}
      <div className="relative z-10 flex min-h-[115px] sm:min-h-0 h-full w-full items-center justify-center px-4 pointer-events-none">
        {/* Only the exact quote element is draggable, with calibrated subtle travel range */}
        <motion.div
          drag
          dragConstraints={{ top: -20, bottom: 20, left: -45, right: 45 }}
          dragSnapToOrigin
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 140, bounceDamping: 15 }}
          whileDrag={{ scale: 1.015, cursor: "grabbing" }}
          style={{ touchAction: "none" }}
          className="group relative flex max-w-md sm:max-w-lg flex-col items-center text-center will-change-transform pointer-events-auto px-5 py-2.5 rounded-xl select-none cursor-grab active:cursor-grabbing"
        >
          {/* Quotation icon */}
          <div className="mb-1 flex items-center justify-center text-foreground/70">
            <QuoteIcon size={15} strokeWidth={1.5} />
          </div>

          {/* Quote Body Typography */}
          <blockquote className="m-0 text-balance font-serif italic text-sm sm:text-[15px] md:text-[17px] font-medium tracking-tight text-foreground/90 transition-colors group-hover:text-foreground leading-snug">
            &ldquo;{quote.text}&rdquo;
          </blockquote>

          {/* Author Citation & Source Badge */}
          <footer className="mt-1 flex items-center justify-center gap-1.5 font-mono text-[10.5px] sm:text-xs text-muted-foreground/80 tracking-wider">
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
