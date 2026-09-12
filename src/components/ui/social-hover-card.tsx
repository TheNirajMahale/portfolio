"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  MapPin,
  GraduationCap,
  Sparkles,
  GitBranch,
  BookOpen,
  Mail,
  Building2,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import socialsData from "@/data/socials.json";
import { cn } from "@/lib/utils";

export type SocialType = "github" | "linkedin" | "email";

interface CardCoords {
  cardX: number;
  arrowX: number;
  topY: number;
  bottomY: number;
  cardWidth: number;
}

interface SocialHoverContextValue {
  activeType: SocialType | null;
  side: "top" | "bottom";
  registerTrigger: (type: SocialType, node: HTMLElement | null) => void;
  onTriggerEnter: (type: SocialType) => void;
  onTriggerLeave: () => void;
  onTriggerFocus: (type: SocialType) => void;
  onTriggerBlur: () => void;
}

const SocialHoverContext = React.createContext<SocialHoverContextValue | null>(null);

const ORDER: Record<SocialType, number> = {
  github: 0,
  linkedin: 1,
  email: 2,
};

function isCursorDevice(): boolean {
  if (typeof window === "undefined") return false;
  if (window.innerWidth < 768) return false;
  const hasHover = window.matchMedia("(hover: hover)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  return hasHover && hasFinePointer;
}

export interface SocialHoverGroupProps {
  children: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
}

export function SocialHoverGroup({
  children,
  side = "top",
  className,
}: SocialHoverGroupProps) {
  const [activeType, setActiveType] = React.useState<SocialType | null>(null);
  const [coords, setCoords] = React.useState<CardCoords | null>(null);
  const [copied, setCopied] = React.useState(false);

  const groupRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<Map<SocialType, HTMLElement>>(new Map());
  const [slideDirection, setSlideDirection] = React.useState(0);
  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const copyTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const registerTrigger = React.useCallback(
    (type: SocialType, node: HTMLElement | null) => {
      if (node) {
        triggerRefs.current.set(type, node);
      } else {
        triggerRefs.current.delete(type);
      }
    },
    []
  );

  const computeCoords = React.useCallback(
    (targetType: SocialType): CardCoords | null => {
      if (!isCursorDevice()) return null;
      const triggerEl = triggerRefs.current.get(targetType);
      if (!triggerEl || !groupRef.current) return null;

      const triggerRect = triggerEl.getBoundingClientRect();
      const groupRect = groupRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Card width capped to 288px (272px on narrow mobile)
      const cardWidth = Math.min(288, viewportWidth - 24);
      const triggerCenterX = triggerRect.left + triggerRect.width / 2;
      const idealLeft = triggerCenterX - cardWidth / 2;

      // Clamp card position within viewport with 12px padding
      const padding = 12;
      const clampedLeft = Math.max(
        padding,
        Math.min(idealLeft, viewportWidth - cardWidth - padding)
      );

      // Card X relative to the group container
      const cardX = clampedLeft - groupRect.left;

      // Arrow X relative to the card container
      const rawArrowX = triggerCenterX - clampedLeft;
      const arrowX = Math.max(20, Math.min(rawArrowX, cardWidth - 20));

      // Vertical position relative to group
      const topY = triggerRect.bottom - groupRect.top + 8;
      const bottomY = groupRect.bottom - triggerRect.top + 8;

      return { cardX, arrowX, topY, bottomY, cardWidth };
    },
    []
  );

  const clearTimers = React.useCallback(() => {
    if (openTimeoutRef.current) {
      clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const onTriggerEnter = React.useCallback(
    (type: SocialType) => {
      // Block hover cards on touch devices or mobile viewports
      if (!isCursorDevice()) return;

      clearTimers();

      if (activeType !== null) {
        // Card already open: Glide immediately with 0 delay
        const nextCoords = computeCoords(type);
        if (nextCoords) setCoords(nextCoords);
        setSlideDirection(Math.sign(ORDER[type] - ORDER[activeType]));
        setActiveType(type);
      } else {
        // Opening fresh: brief 130ms delay to prevent flashing on fast cursor pass
        openTimeoutRef.current = setTimeout(() => {
          const nextCoords = computeCoords(type);
          if (nextCoords) setCoords(nextCoords);
          setSlideDirection(0);
          setActiveType(type);
        }, 130);
      }
    },
    [activeType, clearTimers, computeCoords]
  );

  const onTriggerLeave = React.useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveType(null);
    }, 200);
  }, [clearTimers]);

  const onTriggerFocus = React.useCallback(
    (type: SocialType) => {
      // Block hover cards on touch devices or mobile viewports
      if (!isCursorDevice()) return;

      clearTimers();
      const nextCoords = computeCoords(type);
      if (nextCoords) setCoords(nextCoords);
      if (activeType) {
        setSlideDirection(Math.sign(ORDER[type] - ORDER[activeType]));
      } else {
        setSlideDirection(0);
      }
      setActiveType(type);
    },
    [activeType, clearTimers, computeCoords]
  );

  const onTriggerBlur = React.useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveType(null);
    }, 200);
  }, [clearTimers]);

  const handleCardMouseEnter = React.useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleCardMouseLeave = React.useCallback(() => {
    clearTimers();
    closeTimeoutRef.current = setTimeout(() => {
      setActiveType(null);
    }, 200);
  }, [clearTimers]);

  const handleCopyEmail = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(socialsData.email.address);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, []);

  // Window resize & keyboard Escape handling
  React.useEffect(() => {
    const handleResize = () => {
      if (activeType) {
        const nextCoords = computeCoords(activeType);
        if (nextCoords) setCoords(nextCoords);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveType(null);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeType, computeCoords]);

  // Clean up timers on unmount
  React.useEffect(() => {
    return () => {
      clearTimers();
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, [clearTimers]);

  const contextValue = React.useMemo<SocialHoverContextValue>(
    () => ({
      activeType,
      side,
      registerTrigger,
      onTriggerEnter,
      onTriggerLeave,
      onTriggerFocus,
      onTriggerBlur,
    }),
    [
      activeType,
      side,
      registerTrigger,
      onTriggerEnter,
      onTriggerLeave,
      onTriggerFocus,
      onTriggerBlur,
    ]
  );

  return (
    <SocialHoverContext.Provider value={contextValue}>
      <div
        ref={groupRef}
        className={cn("relative inline-flex items-center", className)}
      >
        {children}

        <AnimatePresence>
          {activeType && coords && (
            <motion.div
              key="social-floating-card-container"
              initial={{
                opacity: 0,
                scale: 0.95,
                y: side === "top" ? 8 : -8,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: coords.cardX,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: side === "top" ? 6 : -6,
              }}
              transition={{
                opacity: { duration: 0.16, ease: "easeOut" },
                scale: { duration: 0.16, ease: "easeOut" },
                y: { duration: 0.16, ease: "easeOut" },
                x: { type: "spring", stiffness: 350, damping: 28 },
              }}
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              style={{
                position: "absolute",
                left: 0,
                ...(side === "bottom"
                  ? { top: coords.topY }
                  : { bottom: coords.bottomY }),
                width: coords.cardWidth,
              }}
              className="hidden md:block [@media(hover:none)]:!hidden [@media(pointer:coarse)]:!hidden z-50 focus:outline-none pointer-events-auto"
              role="region"
              aria-label="Social profile preview"
            >
              {/* Hit-test bridge between trigger and floating card */}
              <div
                className={cn(
                  "absolute inset-x-0 h-3 pointer-events-auto",
                  side === "bottom" ? "-top-3" : "-bottom-3"
                )}
              />

              {/* Dynamic Arrow pointing at active trigger button */}
              <motion.div
                className="absolute pointer-events-none z-20"
                animate={{ x: coords.arrowX }}
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                style={{
                  left: 0,
                  ...(side === "bottom" ? { top: -6 } : { bottom: -6 }),
                }}
              >
                {side === "bottom" ? (
                  <svg
                    width="14"
                    height="7"
                    viewBox="0 0 14 7"
                    className="-translate-x-1/2"
                  >
                    <path
                      d="M1 7 L7 1 L13 7"
                      className="fill-card stroke-foreground/40 stroke-[1.5]"
                    />
                  </svg>
                ) : (
                  <svg
                    width="14"
                    height="7"
                    viewBox="0 0 14 7"
                    className="-translate-x-1/2"
                  >
                    <path
                      d="M1 0 L7 6 L13 0"
                      className="fill-card stroke-foreground/40 stroke-[1.5]"
                    />
                  </svg>
                )}
              </motion.div>

              {/* Card Body with fluid layout morphing */}
              <motion.div
                layout
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 28 },
                }}
                className="relative rounded-lg border-2 border-dotted border-foreground/40 bg-card p-3.5 text-card-foreground shadow-xl shadow-black/10 dark:shadow-2xl dark:shadow-black/40 backdrop-blur-md select-text overflow-hidden"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeType}
                    initial={{
                      opacity: 0,
                      x: slideDirection * 14,
                      filter: "blur(2px)",
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      x: -slideDirection * 14,
                      filter: "blur(2px)",
                    }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <CardContent
                      type={activeType}
                      copied={copied}
                      onCopyEmail={handleCopyEmail}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SocialHoverContext.Provider>
  );
}

export interface SocialHoverCardProps {
  type: SocialType;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function SocialHoverCard({
  type,
  children,
  side = "top",
}: SocialHoverCardProps) {
  const context = React.useContext(SocialHoverContext);

  if (!context) {
    const resolvedSide = side === "bottom" ? "bottom" : "top";
    return (
      <SocialHoverGroup side={resolvedSide}>
        <SocialHoverTrigger type={type}>{children}</SocialHoverTrigger>
      </SocialHoverGroup>
    );
  }

  return <SocialHoverTrigger type={type}>{children}</SocialHoverTrigger>;
}

function SocialHoverTrigger({
  type,
  children,
}: {
  type: SocialType;
  children: React.ReactNode;
}) {
  const context = React.useContext(SocialHoverContext)!;
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    context.registerTrigger(type, triggerRef.current);
    return () => {
      context.registerTrigger(type, null);
    };
  }, [context, type]);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={() => context.onTriggerEnter(type)}
      onMouseLeave={() => context.onTriggerLeave()}
      onFocus={() => context.onTriggerFocus(type)}
      onBlur={() => context.onTriggerBlur()}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

function CardContent({
  type,
  copied,
  onCopyEmail,
}: {
  type: SocialType;
  copied: boolean;
  onCopyEmail: (e: React.MouseEvent) => void;
}) {
  if (type === "github") {
    return (
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              <GitHubIcon size={16} />
              <span
                className="absolute -top-0.5 -right-0.5 flex h-2 w-2"
                title={socialsData.github.status}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs font-semibold text-foreground leading-tight">
                  {socialsData.github.name}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground leading-tight block">
                {socialsData.github.handle}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            <GitBranch size={9} />
            {socialsData.github.platform}
          </span>
        </div>

        {/* Bio */}
        <p className="text-[11px] leading-snug text-muted-foreground">
          {socialsData.github.bio}
        </p>

        {/* Featured Repositories */}
        <div className="rounded-md border border-border/80 bg-muted/40 p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] font-medium text-foreground flex items-center gap-1">
              <BookOpen size={10} className="text-muted-foreground" />
              {socialsData.github.featuredRepositoriesTitle}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              {socialsData.github.badge}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {socialsData.github.featuredRepositories.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/repo flex items-center justify-between rounded px-1.5 py-0.5 hover:bg-background/80 transition-colors"
              >
                <span className="font-mono text-[11px] text-foreground group-hover/repo:text-foreground font-medium truncate">
                  {repo.name}
                </span>
                <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                  {repo.tech}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <a
          href={socialsData.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2.5 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
        >
          <span>{socialsData.github.ctaText}</span>
          <ArrowUpRight size={11} strokeWidth={2} />
        </a>
      </div>
    );
  }

  if (type === "linkedin") {
    return (
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#0077b5]/30 bg-[#0077b5]/10 text-[#0077b5] dark:text-[#38a0dc]">
              <LinkedInIcon size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-mono text-xs font-semibold text-foreground leading-tight">
                  {socialsData.linkedin.name}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground leading-tight block truncate max-w-[130px]">
                {socialsData.linkedin.headline}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-0.5 rounded border border-[#0077b5]/30 bg-[#0077b5]/10 px-1.5 py-0.5 font-mono text-[9px] text-[#0077b5] dark:text-[#38a0dc] font-medium">
            {socialsData.linkedin.platform}
          </span>
        </div>

        {/* Snapshot info */}
        <div className="flex flex-col gap-1 rounded-md border border-border/80 bg-muted/40 p-2 font-mono text-[10px]">
          <div className="flex items-center gap-1.5 text-foreground">
            <Building2 size={11} className="shrink-0 text-muted-foreground" />
            <span className="font-medium truncate">
              {socialsData.linkedin.role}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground truncate">
              {socialsData.linkedin.company}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
            <GraduationCap size={11} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{socialsData.linkedin.education}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
            <MapPin size={11} className="shrink-0 text-muted-foreground" />
            <span className="truncate">{socialsData.linkedin.location}</span>
          </div>
        </div>

        {/* Skills preview */}
        <div className="flex flex-wrap gap-1">
          {socialsData.linkedin.skills.map((skill) => (
            <span
              key={skill}
              className="rounded border border-border bg-muted/70 px-1 py-0.25 font-mono text-[9px] text-muted-foreground"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Footer CTA */}
        <a
          href={socialsData.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2.5 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
        >
          <span>{socialsData.linkedin.ctaText}</span>
          <ArrowUpRight size={11} strokeWidth={2} />
        </a>
      </div>
    );
  }

  if (type === "email") {
    return (
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              <Mail size={16} strokeWidth={1.5} />
            </div>
            <div>
              <span className="font-mono text-xs font-semibold text-foreground leading-tight block">
                {socialsData.email.name}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground leading-tight block">
                {socialsData.email.label}
              </span>
            </div>
          </div>

          <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
            <Sparkles size={9} />
            {socialsData.email.statusBadge}
          </span>
        </div>

        {/* Email Box */}
        <div className="flex items-center justify-between gap-1.5 rounded-md border border-border/80 bg-muted/40 p-2">
          <span className="font-mono text-[11px] text-foreground truncate select-all">
            {socialsData.email.address}
          </span>
          <button
            type="button"
            onClick={onCopyEmail}
            aria-label="Copy email address"
            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check-icon"
                  initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.4, rotate: 20, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="text-emerald-500 flex items-center justify-center"
                >
                  <Check size={11} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy-icon"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <Copy size={11} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* CTA Actions */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={onCopyEmail}
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] font-medium text-foreground transition-all hover:bg-muted/80 cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check-btn"
                  initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="text-emerald-500 flex items-center justify-center"
                >
                  <Check size={12} strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span
                  key="copy-btn"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-center"
                >
                  <Copy size={12} />
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "copied-text" : "copy-text"}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.15 }}
                className={copied ? "text-emerald-500 font-semibold" : ""}
              >
                {copied
                  ? socialsData.email.copiedButtonText
                  : socialsData.email.copyButtonText}
              </motion.span>
            </AnimatePresence>
          </button>

          <a
            href={`mailto:${socialsData.email.address}`}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
          >
            <span>{socialsData.email.sendMailButtonText}</span>
            <ArrowUpRight size={11} strokeWidth={2} />
          </a>
        </div>
      </div>
    );
  }

  return null;
}
