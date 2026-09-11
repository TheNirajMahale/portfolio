"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";
import resumeData from "@/data/resume.json";

export interface ExperienceJob {
  title: string;
  company: string;
  duration: string;
  location?: string;
  summary?: string;
  details?: string[];
  highlights?: string[];
  tags?: string[];
}

/**
 * ExpandableTimelineCard
 * - Shows a punchy summary by default.
 * - If `details` (or `highlights`) exist, smoothly expands on hover or tap.
 * - If only `summary` exists, stays clean and static without an expander cue.
 */
function ExpandableTimelineCard({ job }: { job: ExperienceJob; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const detailList = job.details ?? job.highlights ?? [];
  const hasDetails = detailList.length > 0;

  const summaryText = job.summary ?? (hasDetails ? detailList[0] : "");
  const displayDetails = job.summary ? detailList : detailList.slice(1);
  const canExpand = hasDetails && (Boolean(job.summary) || displayDetails.length > 0);

  const isOpen = canExpand && (isHovered || isMobileExpanded);
  const isCurrent = job.duration.toLowerCase().includes("present");

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (canExpand) setIsMobileExpanded((prev) => !prev);
      }}
      className={cn(
        "group/card relative rounded-lg border-2 border-dotted border-foreground/35 bg-card/80 p-5 md:p-6 backdrop-blur-sm transition-all duration-300 card-glow",
        canExpand && "cursor-pointer hover:border-foreground/75 hover:bg-card/95",
        isOpen && "border-emerald-500/70 shadow-[0_4px_28px_rgba(52,211,153,0.1)]"
      )}
    >
      {/* Top Header: Role & Badges */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-mono text-base md:text-lg font-semibold text-foreground tracking-tight group-hover/card:text-emerald-400 transition-colors">
              {job.title}
            </h3>
            {isCurrent && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.15)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CURRENT ROLE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/90">{job.company}</span>
            {job.location && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-xs">{job.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Duration pill (mobile inline) */}
        <span className="md:hidden font-mono text-xs tabular-nums text-muted-foreground whitespace-nowrap self-start sm:self-auto px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
          {job.duration}
        </span>
      </div>

      {/* Summary (Always visible) */}
      {summaryText && (
        <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground/90 font-sans">
          {summaryText}
        </p>
      )}

      {/* Tags / Technologies Pill Row */}
      {job.tags && job.tags.length > 0 && (
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors group-hover/card:border-emerald-500/30 group-hover/card:text-foreground/90"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Technical Details */}
      {canExpand && (
        <>
          <div className="mt-3.5 flex items-center justify-end pt-2 border-t border-border/25">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="text-muted-foreground/60 group-hover/card:text-emerald-400 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden pt-1"
              >
                <ul className="space-y-2.5 pt-2">
                  {displayDetails.map((highlight, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: i * 0.04 }}
                      className="relative pl-4 text-xs md:text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[8px] before:h-1.5 before:w-1.5 before:rounded-full before:bg-emerald-400/80"
                    >
                      {highlight}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({ startOffset: 0, totalSpan: 0 });

  const jobs = resumeData.experience as ExperienceJob[];

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateMetrics = () => {
      const items = el.querySelectorAll('[data-timeline-item="true"]');
      const anchors = el.querySelectorAll('[data-timeline-anchor="true"]');
      if (items.length > 0 && anchors.length > 0) {
        const firstAnchor = anchors[0] as HTMLElement;
        const lastItem = items[items.length - 1] as HTMLElement;
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
  }, [jobs]);

  // Track scroll within this timeline container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 50%"],
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
    <Section id="experience" title="Experience" subtitle="Where I've been building.">
      <div ref={containerRef} className="relative w-full">
        <div ref={contentRef} className="relative w-full py-2">
          {/* 1. Permanent Static Rail */}
          {metrics.totalSpan > 0 && (
            <div
              className="absolute left-6 md:left-8 -translate-x-1/2 w-[2px] bg-neutral-300/80 dark:bg-neutral-800 pointer-events-none z-0"
              style={{
                top: `${metrics.startOffset}px`,
                height: `${metrics.totalSpan}px`,
              }}
            />
          )}

          {/* 2. Animated Glowing Progress Beam */}
          {metrics.totalSpan > 0 && (
            <div
              style={{
                top: `${metrics.startOffset}px`,
                height: `${metrics.totalSpan}px`,
              }}
              className="absolute left-6 md:left-8 -translate-x-1/2 w-[2px] overflow-hidden pointer-events-none z-10"
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
          <div className="space-y-12 md:space-y-16">
            {jobs.map((job, index) => {
              const isCurrent = job.duration.toLowerCase().includes("present");

              return (
                <div
                  key={`${job.company}-${job.title}`}
                  data-timeline-item="true"
                  className="relative flex flex-col md:flex-row md:items-start md:gap-8 group"
                >
                  {/* Measurement Anchor */}
                  <div
                    data-timeline-anchor="true"
                    className="absolute left-6 md:left-8 -translate-x-1/2 top-5 md:top-6 h-5 w-5 pointer-events-none opacity-0"
                    aria-hidden="true"
                  />

                  {/* Left Column: Sticky Header with Node Circle & Duration */}
                  <div
                    data-timeline-sticky="true"
                    className="sticky top-36 self-start z-20 flex items-center md:flex-col md:items-start md:w-48 shrink-0"
                  >
                    {/* Minimal Node Bullet pinned exactly to line center */}
                    <div
                      data-timeline-node="true"
                      className="absolute left-6 md:left-8 -translate-x-1/2 top-5 md:top-6 flex items-center justify-center z-20"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border bg-background transition-all duration-200",
                          isCurrent
                            ? "border-emerald-500/80 shadow-[0_0_10px_rgba(52,211,153,0.3)]"
                            : "border-border/70 group-hover:border-foreground/40"
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full transition-all duration-200",
                            isCurrent
                              ? "bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse"
                              : "bg-muted-foreground/40 group-hover:bg-foreground/70"
                          )}
                        />
                      </div>
                    </div>

                    {/* Desktop Sticky Duration & Location Info */}
                    <div className="hidden md:flex flex-col pl-16 pt-5">
                      <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                        {job.duration}
                      </span>
                      {job.location && (
                        <span className="text-[11px] font-mono text-muted-foreground/60 mt-1">
                          {job.location}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="mt-2 w-fit inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-500 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          CURRENT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Expandable Card */}
                  <div className="relative pl-14 md:pl-0 w-full flex-1 min-w-0">
                    <ExpandableTimelineCard job={job} index={index} />
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
