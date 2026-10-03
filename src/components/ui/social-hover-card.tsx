"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Copy,
  Mail,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/ui/icons";
import socialsData from "@/data/socials.json";
import { cn } from "@/lib/utils";

export type SocialType = "github" | "linkedin" | "twitter" | "email";

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
  closeImmediately: () => void;
}

const SocialHoverContext = React.createContext<SocialHoverContextValue | null>(null);

const ORDER: Record<SocialType, number> = {
  github: 0,
  linkedin: 1,
  twitter: 2,
  email: 3,
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
  const [displayType, setDisplayType] = React.useState<SocialType | null>(null);
  const [coords, setCoords] = React.useState<CardCoords | null>(null);

  const groupRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<Map<SocialType, HTMLElement>>(new Map());
  const [slideDirection, setSlideDirection] = React.useState(0);
  const openTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

      // Compact card width
      const cardWidth = Math.min(235, viewportWidth - 24);
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
        setDisplayType(type);
        setActiveType(type);
      } else {
        // Opening fresh: brief 130ms delay to prevent flashing on fast cursor pass
        openTimeoutRef.current = setTimeout(() => {
          const nextCoords = computeCoords(type);
          if (nextCoords) setCoords(nextCoords);
          setSlideDirection(0);
          setDisplayType(type);
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
      setDisplayType(type);
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

  const closeImmediately = React.useCallback(() => {
    clearTimers();
    setActiveType(null);
    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  }, [clearTimers]);

  const handleCopyEmail = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(socialsData.email.address);
      }
      closeImmediately();
    },
    [closeImmediately]
  );

  // Window resize, keyboard Escape & click-outside handling
  React.useEffect(() => {
    const handleResize = () => {
      if (activeType) {
        const nextCoords = computeCoords(activeType);
        if (nextCoords) setCoords(nextCoords);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeImmediately();
      }
    };
    const handlePointerDownOutside = (e: PointerEvent) => {
      if (
        groupRef.current &&
        !groupRef.current.contains(e.target as Node)
      ) {
        closeImmediately();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);
    if (activeType) {
      document.addEventListener("pointerdown", handlePointerDownOutside);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDownOutside);
    };
  }, [activeType, computeCoords, closeImmediately]);

  // Clean up timers on unmount
  React.useEffect(() => {
    return () => {
      clearTimers();
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
      closeImmediately,
    }),
    [
      activeType,
      side,
      registerTrigger,
      onTriggerEnter,
      onTriggerLeave,
      onTriggerFocus,
      onTriggerBlur,
      closeImmediately,
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
              onClick={closeImmediately}
              onAuxClick={closeImmediately}
              style={{
                position: "absolute",
                left: 0,
                ...(side === "bottom"
                  ? { top: coords.topY }
                  : { bottom: coords.bottomY }),
                width: coords.cardWidth,
              }}
              className="hidden md:block [@media(hover:none)]:!hidden [@media(pointer:coarse)]:!hidden z-40 focus:outline-none pointer-events-auto cursor-pointer"
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
                className="relative rounded-lg border border-border bg-card/95 p-2.5 px-3 text-card-foreground shadow-xl shadow-black/20 dark:shadow-2xl dark:shadow-black/50 backdrop-blur-md select-none overflow-hidden"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayType && (
                    <motion.div
                      key={displayType}
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
                        type={displayType}
                        onCopyEmail={handleCopyEmail}
                      />
                    </motion.div>
                  )}
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
  const context = React.useContext(SocialHoverContext);
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!context) return;
    context.registerTrigger(type, triggerRef.current);
    return () => {
      context.registerTrigger(type, null);
    };
  }, [context, type]);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={() => context?.onTriggerEnter(type)}
      onMouseLeave={() => context?.onTriggerLeave()}
      onFocus={() => context?.onTriggerFocus(type)}
      onBlur={() => context?.onTriggerBlur()}
      onClick={() => context?.closeImmediately()}
      onAuxClick={() => context?.closeImmediately()}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

function CardContent({
  type,
  onCopyEmail,
}: {
  type: SocialType;
  onCopyEmail: (e: React.MouseEvent) => void;
}) {
  if (type === "github") {
    return (
      <a
        href={socialsData.github.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/card flex items-center justify-between gap-2.5 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
            <GitHubIcon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-semibold text-foreground leading-tight truncate">
              {socialsData.github.name}
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
              {socialsData.github.handle}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground">
          <ArrowUpRight size={14} strokeWidth={2} />
        </div>
      </a>
    );
  }

  if (type === "linkedin") {
    return (
      <a
        href={socialsData.linkedin.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/card flex items-center justify-between gap-2.5 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#0077b5]/30 bg-[#0077b5]/10 text-[#0077b5] dark:text-[#38a0dc]">
            <LinkedInIcon size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-semibold text-foreground leading-tight truncate">
              {socialsData.linkedin.name}
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
              in/nirajmahale
            </span>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground">
          <ArrowUpRight size={14} strokeWidth={2} />
        </div>
      </a>
    );
  }

  if (type === "twitter") {
    return (
      <a
        href={socialsData.twitter?.url || "https://x.com/TheNirajMahale"}
        target="_blank"
        rel="noopener noreferrer"
        className="group/card flex items-center justify-between gap-2.5 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
            <TwitterIcon size={15} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-semibold text-foreground leading-tight truncate">
              {socialsData.twitter?.name || "Niraj Mahale"}
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
              {socialsData.twitter?.handle || "@TheNirajMahale"}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 group-hover/card:text-foreground">
          <ArrowUpRight size={14} strokeWidth={2} />
        </div>
      </a>
    );
  }

  if (type === "email") {
    return (
      <button
        type="button"
        onClick={onCopyEmail}
        className="group/card flex w-full items-center justify-between gap-2.5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
            <Mail size={16} strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-semibold text-foreground leading-tight truncate">
              {socialsData.email.name}
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground leading-tight truncate mt-0.5">
              {socialsData.email.address}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground transition-colors group-hover/card:text-foreground">
          <span className="flex items-center justify-center">
            <Copy size={13} strokeWidth={1.75} />
          </span>
        </div>
      </button>
    );
  }

}
