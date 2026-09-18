"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ChevronsDownUp, ChevronsUpDown } from "lucide-react";
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
 * Collapsible Experience Card — Uday Kiran's design:
 * - Company initials avatar on the left
 * - Dashed border separator
 * - Click to expand/collapse (NOT hover)
 * - Expanded: dashed top border, bullet points, tech chip badges
 */
function CollapsibleExperienceCard({ job }: { job: ExperienceJob }) {
  const [isOpen, setIsOpen] = useState(false);

  const detailList = job.details ?? job.highlights ?? [];
  const hasDetails = detailList.length > 0;
  const canExpand = hasDetails;
  const isCurrent = job.duration.toLowerCase().includes("present");

  return (
    <div
      className={cn(
        "w-full border-b border-border last:border-b-0",
      )}
      data-state={isOpen ? "open" : "closed"}
    >
      <button
        type="button"
        onClick={() => {
          if (canExpand) setIsOpen((prev) => !prev);
        }}
        className={cn(
          "group/project flex flex-col w-full p-4 sm:p-5 text-left select-none transition-colors hover:bg-muted/20",
          canExpand && "cursor-pointer",
        )}
      >
        {/* Header row: Role title + Chevron */}
        <div className="flex w-full items-center justify-between gap-3">
          <h3 className="text-sm font-medium leading-snug text-foreground/95 sm:text-base">
            {job.title}
          </h3>

          {/* Chevron toggle */}
          {canExpand && (
            <div className="shrink-0 text-muted-foreground transition-colors group-hover/project:text-foreground" aria-hidden="true">
              {isOpen ? (
                <ChevronsDownUp className="h-4 w-4" />
              ) : (
                <ChevronsUpDown className="h-4 w-4" />
              )}
            </div>
          )}
        </div>

        {/* Badges row: Company | Type | Duration */}
        <div className="mt-1.5 flex flex-row flex-wrap items-center gap-x-2 gap-y-1 w-full">
          {/* Company badge */}
          <div className="border-r border-border pr-2">
            <span className="inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
              {job.company.split(",")[0]}
            </span>
          </div>

          {/* Employment type badge */}
          <span className="inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
            {isCurrent ? "Full-time" : "Internship"}
          </span>

          {/* Duration */}
          <div className="border-l border-border pl-2">
            <div className="flex flex-row items-center space-x-1.5">
              {job.duration.split(" - ").map((part, i) => (
                <span key={i} className="text-xs text-muted-foreground">
                  {i > 0 && <span className="mr-1.5">-</span>}
                  {part.trim().toLowerCase() === "present" ? (
                    <span className="font-medium">{part}</span>
                  ) : (
                    part
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Job summary — full width across card */}
        {job.summary && (
          <p className="mt-2.5 w-full text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
            {job.summary}
          </p>
        )}

        {/* Tags — full width across card */}
        {job.tags && job.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5 w-full">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground transition-[color,box-shadow]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </button>

      {/* Collapsible content with dashed separator */}
      <AnimatePresence initial={false}>
        {isOpen && canExpand && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-dashed border-border space-y-3 p-4 sm:p-5">
              {detailList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    Key Technical Details & Achievements
                  </p>
                  <ul className="flex list-disc flex-col gap-2 pl-4 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {detailList.map((detail, i) => (
                      <li key={i}>
                        <span className="text-foreground/90">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

        const startOffset = Math.round(firstRect.top - containerRect.top + firstRect.height / 2);
        const restingLastCircle = Math.round(lastAnchorRect.top - containerRect.top + lastAnchorRect.height / 2);
        const maxStickyTravel = lastSticky
          ? Math.max(0, lastItem.offsetHeight - lastSticky.offsetHeight)
          : 0;
        const finalLastCircle = restingLastCircle + maxStickyTravel;
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 50%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], [0, metrics.totalSpan]);

  return (
    <Section id="experience" title="Experience">
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
          <div className="space-y-6 md:space-y-16">
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
                    <div className="flex flex-col pl-16 pt-5">
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

                  {/* Right Column: Collapsible Card (Full width on mobile, no left padding) */}
                  <div className="relative w-full flex-1 min-w-0">
                    <div className="rounded-lg border border-border overflow-hidden">
                      <CollapsibleExperienceCard job={job} />
                    </div>
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
