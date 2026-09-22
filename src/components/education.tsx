"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { GraduationCap, Award } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import resumeData from "@/data/resume.json";

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
  score: string;
  description?: string;
}

/**
 * Solid Education Card (Clean, minimal, no expansion)
 */
function EducationTimelineCard({ edu }: { edu: EducationItem }) {
  return (
    <div className="group/card relative rounded-lg border border-border bg-card p-4 sm:p-5 transition-colors hover:border-foreground/40 flex flex-col">
      {/* Top row: Degree Icon + Degree Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-muted-foreground transition-all duration-300 group-hover/card:border-foreground/40 group-hover/card:text-foreground group-hover/card:bg-muted">
          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/card:-translate-y-0.5 group-hover:scale-110 group-hover:-rotate-6">
            <GraduationCap size={17} strokeWidth={1.5} />
          </span>
        </div>
        <h3 className="text-sm font-medium leading-snug text-foreground/95 sm:text-base flex-1 min-w-0">
          {edu.degree}
        </h3>
      </div>

      {/* Year badge - sticks to left */}
      <div className="md:hidden mt-2.5 flex items-center">
        <span className="inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
          {edu.duration}
        </span>
      </div>

      {/* College Name - sticks to left */}
      <p className="mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
        {edu.institution}
      </p>

      {edu.description && (
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          {edu.description}
        </p>
      )}

      {/* Score Badge - sticks to left with dashed divider */}
      <div className="mt-3.5 pt-3 border-t-2 border-dotted border-foreground/45 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
          <Award className="h-3.5 w-3.5 text-emerald-400/80" />
          Score: <span className="font-semibold">{edu.score}</span>
        </span>
      </div>
    </div>
  );
}

export function Education() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ startOffset: 0, totalSpan: 0 });

  const items = resumeData.education as EducationItem[];

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateMetrics = () => {
      const itemEls = el.querySelectorAll('[data-timeline-item="true"]');
      const anchors = el.querySelectorAll('[data-timeline-anchor="true"]');
      if (itemEls.length > 0 && anchors.length > 0) {
        const firstAnchor = anchors[0] as HTMLElement;
        const lastItem = itemEls[itemEls.length - 1] as HTMLElement;
        const lastSticky = lastItem.querySelector('[data-timeline-sticky="true"]') as HTMLElement | null;
        const lastAnchor = anchors[anchors.length - 1] as HTMLElement;

        const containerRect = el.getBoundingClientRect();
        const firstRect = firstAnchor.getBoundingClientRect();
        const lastAnchorRect = lastAnchor.getBoundingClientRect();

        // Exact center of first circle (starts here, zero line above)
        const startOffset = Math.round(firstRect.top - containerRect.top + firstRect.height / 2);

        // Resting center of last circle
        const restingLastCircle = Math.round(lastAnchorRect.top - containerRect.top + lastAnchorRect.height / 2);

        // Maximum sticky travel of the last circle as user scrolls through the last card
        const maxStickyTravel = lastSticky
          ? Math.max(0, lastItem.offsetHeight - lastSticky.offsetHeight)
          : 0;

        // Final center of the last circle when scrolled to the end of the last item
        const finalLastCircle = restingLastCircle + maxStickyTravel;

        // Total span covered so circle never detaches from the line
        const totalSpan = Math.max(0, finalLastCircle - startOffset);

        setMetrics({ startOffset, totalSpan });
      } else {
        const rect = el.getBoundingClientRect();
        setMetrics({ startOffset: 0, totalSpan: rect.height });
      }
    };

    updateMetrics();

    const ro = new ResizeObserver(updateMetrics);
    ro.observe(el);

    return () => ro.disconnect();
  }, [items]);

  // Track scroll within this timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 75%", "end 80%"],
  });

  // Physics smoothing
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Map progress into line pixel height
  const lineHeight = useTransform(smoothProgress, [0, 1], [0, metrics.totalSpan]);

  return (
    <Section id="education" title="Education">
      <div ref={containerRef} className="relative w-full">
        <div ref={contentRef} className="relative w-full py-2">
          {/* 1. Permanent Static Rail (Desktop only) */}
          {metrics.totalSpan > 0 && (
            <div
              className="hidden md:block absolute left-8 -translate-x-1/2 w-[2px] bg-neutral-300/80 dark:bg-neutral-800 pointer-events-none z-0"
              style={{
                top: `${metrics.startOffset}px`,
                height: `${metrics.totalSpan}px`,
              }}
            />
          )}

          {/* 2. Animated Glowing Progress Beam (Desktop only) */}
          {metrics.totalSpan > 0 && (
            <div
              style={{
                top: `${metrics.startOffset}px`,
                height: `${metrics.totalSpan}px`,
              }}
              className="hidden md:block absolute left-8 -translate-x-1/2 w-[2px] overflow-hidden pointer-events-none z-10"
            >
              <motion.div
                style={{ height: lineHeight }}
                className="relative w-full bg-gradient-to-t from-emerald-400 via-teal-400 to-transparent from-[0%] via-[20%] shadow-[0_0_14px_rgba(52,211,153,0.9)]"
              >
                {/* Pinned Glowing Laser Tip */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_8px_2px_#34d399,0_0_18px_6px_#10b981,0_0_40px_10px_rgba(16,185,129,0.8)] animate-pulse" />
              </motion.div>
            </div>
          )}

          {/* Timeline Items List */}
          <div className="space-y-4 md:space-y-6">
            {items.map((edu, index) => {
              const isLatest = index === 0;

              return (
                <div
                  key={edu.institution}
                  data-timeline-item="true"
                  className="relative flex flex-col md:flex-row md:items-start md:gap-8 group"
                >
                  {/* Measurement Anchor */}
                  <div
                    data-timeline-anchor="true"
                    className="hidden md:block absolute left-8 -translate-x-1/2 top-6 h-5 w-5 pointer-events-none opacity-0"
                    aria-hidden="true"
                  />

                  {/* Left Column: Sticky Header with Node Circle & Duration (Desktop only) */}
                  <div
                    data-timeline-sticky="true"
                    className="hidden md:flex sticky top-36 self-start z-20 flex-col items-start w-48 shrink-0"
                  >
                    {/* Minimal Node Bullet pinned exactly to line center */}
                    <div
                      data-timeline-node="true"
                      className="absolute left-8 -translate-x-1/2 top-6 flex items-center justify-center z-20"
                    >
                      <div
                        className="flex h-5 w-5 items-center justify-center rounded-full border bg-background transition-all duration-200 border-border/70 group-hover:border-foreground/40"
                      >
                        <div
                          className="h-2 w-2 rounded-full transition-all duration-200 bg-muted-foreground/40 group-hover:bg-foreground/70"
                        />
                      </div>
                    </div>

                    {/* Desktop Sticky Duration & Degree Tag */}
                    <div className="flex flex-col pl-16 pt-5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        {edu.duration}
                      </span>
                      {isLatest && (
                        <span className="mt-2 w-fit inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-500 dark:text-emerald-400">
                          LATEST
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Solid Non-Expandable Card (Full width on mobile, no left padding) */}
                  <div className="relative w-full flex-1 min-w-0">
                    <EducationTimelineCard edu={edu} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}
