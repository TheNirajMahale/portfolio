"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";
import { cn } from "@/lib/utils";
import {
  SiDart,
  SiJavascript,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFlutter,
  SiSpringboot,
  SiNodedotjs,
  SiExpress,
  SiHtml5,
  SiCss,
  SiGit,
  SiLinux,
  SiPostman,
  SiEclipseide,
  SiDocker,
  SiGooglecloud,
} from "react-icons/si";
import {
  FaDatabase,
  FaGears,
  FaLock,
  FaNetworkWired,
  FaCode,
  FaJava,
} from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";
import { LayoutGrid, Rows3 } from "lucide-react";

interface SkillMeta {
  name: string;
  category: string;
  tag: string;
  color: string;
  icon: React.ElementType;
}

const allSkills: SkillMeta[] = [
  // Programming Languages
  { name: "Java", category: "Programming Languages", tag: "Language", color: "#f89820", icon: FaJava },
  { name: "Dart", category: "Programming Languages", tag: "Language", color: "#00b4ab", icon: SiDart },
  { name: "JavaScript", category: "Programming Languages", tag: "Language", color: "#f7df1e", icon: SiJavascript },
  { name: "SQL", category: "Programming Languages", tag: "Language", color: "#e38c00", icon: FaDatabase },

  // Frameworks & Libraries
  { name: "Flutter", category: "Frameworks & Libraries", tag: "Framework", color: "#02569b", icon: SiFlutter },
  { name: "Spring Boot", category: "Frameworks & Libraries", tag: "Backend", color: "#6db33f", icon: SiSpringboot },
  { name: "Node.js", category: "Frameworks & Libraries", tag: "Runtime", color: "#68a063", icon: SiNodedotjs },
  { name: "Express", category: "Frameworks & Libraries", tag: "Backend", color: "#9ca3af", icon: SiExpress },

  // Databases
  { name: "MongoDB", category: "Databases", tag: "NoSQL", color: "#47a248", icon: SiMongodb },
  { name: "MySQL", category: "Databases", tag: "Relational", color: "#00758f", icon: SiMysql },
  { name: "PostgreSQL", category: "Databases", tag: "Relational", color: "#336791", icon: SiPostgresql },

  // Web Development
  { name: "HTML", category: "Web Development", tag: "Markup", color: "#e34f26", icon: SiHtml5 },
  { name: "CSS", category: "Web Development", tag: "Styling", color: "#1572b6", icon: SiCss },
  { name: "REST APIs", category: "Web Development", tag: "API", color: "#3b82f6", icon: FaNetworkWired },
  { name: "JWT / OAuth", category: "Web Development", tag: "Auth", color: "#10b981", icon: FaLock },

  // Cloud & Tools
  { name: "Git", category: "Cloud & Tools", tag: "DevOps", color: "#f05032", icon: SiGit },
  { name: "VS Code", category: "Cloud & Tools", tag: "Editor", color: "#007acc", icon: VscVscode },
  { name: "Linux", category: "Cloud & Tools", tag: "OS", color: "#fcc624", icon: SiLinux },
  { name: "Postman", category: "Cloud & Tools", tag: "API Tool", color: "#ff6c37", icon: SiPostman },
  { name: "Eclipse", category: "Cloud & Tools", tag: "IDE", color: "#2c2255", icon: SiEclipseide },
  { name: "Docker", category: "Cloud & Tools", tag: "Container", color: "#2496ed", icon: SiDocker },
  { name: "Google Cloud Platform (GCP)", category: "Cloud & Tools", tag: "Cloud", color: "#4285f4", icon: SiGooglecloud },

  // Concepts
  { name: "Data Structures & Algorithms (DSA)", category: "Concepts", tag: "CS Core", color: "#a855f7", icon: FaCode },
  { name: "Software Development Life Cycle (SDLC)", category: "Concepts", tag: "Process", color: "#06b6d4", icon: FaGears },
];

// Single continuous lineup of all 24 skills in an alternating, curated rhythm
const singleLineSkills: SkillMeta[] = [
  allSkills.find((s) => s.name === "Java")!,
  allSkills.find((s) => s.name === "Flutter")!,
  allSkills.find((s) => s.name === "Spring Boot")!,
  allSkills.find((s) => s.name === "PostgreSQL")!,
  allSkills.find((s) => s.name === "MongoDB")!,
  allSkills.find((s) => s.name === "Dart")!,
  allSkills.find((s) => s.name === "Node.js")!,
  allSkills.find((s) => s.name === "Express")!,
  allSkills.find((s) => s.name === "Docker")!,
  allSkills.find((s) => s.name === "Google Cloud Platform (GCP)")!,
  allSkills.find((s) => s.name === "Git")!,
  allSkills.find((s) => s.name === "JavaScript")!,
  allSkills.find((s) => s.name === "MySQL")!,
  allSkills.find((s) => s.name === "Linux")!,
  allSkills.find((s) => s.name === "Postman")!,
  allSkills.find((s) => s.name === "VS Code")!,
  allSkills.find((s) => s.name === "REST APIs")!,
  allSkills.find((s) => s.name === "JWT / OAuth")!,
  allSkills.find((s) => s.name === "HTML")!,
  allSkills.find((s) => s.name === "CSS")!,
  allSkills.find((s) => s.name === "SQL")!,
  allSkills.find((s) => s.name === "Eclipse")!,
  allSkills.find((s) => s.name === "Data Structures & Algorithms (DSA)")!,
  allSkills.find((s) => s.name === "Software Development Life Cycle (SDLC)")!,
];

const categoryList = [
  "All",
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Web Development",
  "Cloud & Tools",
  "Concepts",
];

const categoryShortNames: Record<string, string> = {
  "All": "All",
  "Programming Languages": "Languages",
  "Frameworks & Libraries": "Frameworks",
  "Databases": "Databases",
  "Web Development": "Web",
  "Cloud & Tools": "Cloud & Tools",
  "Concepts": "Concepts",
};

interface ActiveTooltip {
  id: string;
  skill: SkillMeta;
  centerX: number;
}

export function Skills() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [activeTooltip, setActiveTooltip] = React.useState<ActiveTooltip | null>(null);
  const [viewMode, setViewMode] = React.useState<"ticker" | "grid">("ticker");

  const tickerRef = React.useRef<HTMLDivElement>(null);
  const marqueeContainerRef = React.useRef<HTMLDivElement>(null);
  const isMarqueeHoveredRef = React.useRef(false);
  const wheelVelocityRef = React.useRef(0);
  const mousePosRef = React.useRef<{ x: number; y: number } | null>(null);
  const activeTooltipRef = React.useRef<ActiveTooltip | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const clearCloseTimeout = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleViewModeChange = React.useCallback(
    (newMode: "ticker" | "grid") => {
      if (newMode !== viewMode) {
        setViewMode(newMode);
        setSelectedCategory("All");
        activeTooltipRef.current = null;
        setActiveTooltip(null);
      }
    },
    [viewMode]
  );

  const handleBadgeEnter = React.useCallback(
    (id: string, skill: SkillMeta, e: React.MouseEvent<HTMLDivElement>) => {
      clearCloseTimeout();
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      const badgeEl = e.currentTarget;
      const centerX = badgeEl.offsetLeft + badgeEl.offsetWidth / 2;
      const newTooltip = { id, skill, centerX };
      activeTooltipRef.current = newTooltip;
      setActiveTooltip(newTooltip);
    },
    [clearCloseTimeout]
  );

  const handleBadgeLeave = React.useCallback(() => {
    clearCloseTimeout();
    // 110ms grace period so moving across badges keeps the tooltip alive
    closeTimeoutRef.current = setTimeout(() => {
      activeTooltipRef.current = null;
      setActiveTooltip(null);
    }, 110);
  }, [clearCloseTimeout]);

  const handleMarqueeMouseLeave = React.useCallback(() => {
    isMarqueeHoveredRef.current = false;
    mousePosRef.current = null;
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      activeTooltipRef.current = null;
      setActiveTooltip(null);
    }, 110);
  }, [clearCloseTimeout]);

  // 4x repetition for seamless wide-screen infinite translation
  const marqueeBadges = React.useMemo(() => {
    const list: Array<{ id: string; skill: SkillMeta }> = [];
    for (let loop = 0; loop < 4; loop++) {
      singleLineSkills.forEach((skill, idx) => {
        list.push({
          id: `ticker-${loop}-${skill.name}-${idx}`,
          skill,
        });
      });
    }
    return list;
  }, []);

  const isSkillHighlighted = React.useCallback(
    (category: string) => {
      if (selectedCategory === "All") return true;
      return selectedCategory === category;
    },
    [selectedCategory]
  );

  // Single-line smooth inertial rAF Marquee with physics-based horizontal mouse wheel scrolling
  React.useEffect(() => {
    if (viewMode !== "ticker") return;

    let animId: number;
    let lastTime = performance.now();
    let x = 0;
    let currentSpeed = 0.62;

    const container = marqueeContainerRef.current;
    const handleWheel = (e: WheelEvent) => {
      const ticker = tickerRef.current;
      if (!ticker) return;

      const tickerRect = ticker.getBoundingClientRect();
      const badgeCenterY = (tickerRect.top + tickerRect.bottom) / 2;
      const halfBadgeHeight = 32; // 64px badge / 2
      const buffer = 28; // Exact symmetrical buffer matching 28px area under icons (pb-4 + py-3)

      const blockZoneTop = badgeCenterY - halfBadgeHeight - buffer;
      const blockZoneBottom = badgeCenterY + halfBadgeHeight + buffer;

      // Only block vertical scrolling if cursor is within the symmetrical icon zone
      const isInBlockZone = e.clientY >= blockZoneTop && e.clientY <= blockZoneBottom;
      if (!isInBlockZone) {
        // Outside the icon zone (e.g. near tabs or section divider): allow native vertical scrolling
        return;
      }

      // Completely block vertical page scrolling while directly over the icon zone
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      // Record cursor coordinates for instant hit-detection during wheel rotation
      mousePosRef.current = { x: e.clientX, y: e.clientY };

      let delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (e.deltaMode === 1) {
        // DOM_DELTA_LINE
        delta *= 20;
      } else if (e.deltaMode === 2) {
        // DOM_DELTA_PAGE
        delta *= 60;
      }

      // Smooth impulse accumulator
      wheelVelocityRef.current += delta * 0.18;

      // Clamp max velocity for comfortable gliding
      const maxVel = 26;
      if (wheelVelocityRef.current > maxVel) wheelVelocityRef.current = maxVel;
      if (wheelVelocityRef.current < -maxVel) wheelVelocityRef.current = -maxVel;
    };

    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    }

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // On hover, coast down to a gentle 0.12 px/frame (~7-8px/s). Cruising speed is 0.62 px/frame (~38px/s)
      const targetSpeed = isMarqueeHoveredRef.current ? 0.12 : 0.62;
      // Exponential inertia smoothing: natural deceleration with physical momentum
      currentSpeed += (targetSpeed - currentSpeed) * Math.min(dt * 5, 1);

      // Smooth wheel momentum with frame-rate independent friction damping
      const wheelStep = wheelVelocityRef.current;
      wheelVelocityRef.current *= Math.pow(0.88, dt * 60);
      if (Math.abs(wheelVelocityRef.current) < 0.01) {
        wheelVelocityRef.current = 0;
      }

      const autoStep = currentSpeed * 60 * dt;

      // Total displacement: wheeling down (positive delta) advances ticker forward (decreases x)
      x -= (autoStep + wheelStep);

      if (tickerRef.current) {
        const half = tickerRef.current.scrollWidth / 2;
        if (half > 0) {
          // Bi-directional seamless wrapping
          while (x <= -half) {
            x += half;
          }
          while (x > 0) {
            x -= half;
          }
        }
        tickerRef.current.style.transform = `translate3d(${x}px, 0, 0)`;

        // Dynamically detect which badge is currently under the cursor as badges slide
        if (mousePosRef.current) {
          const tickerRect = tickerRef.current.getBoundingClientRect();
          const badgeCenterY = (tickerRect.top + tickerRect.bottom) / 2;
          const halfBadgeHeight = 32;
          const buffer = 28;
          const blockZoneTop = badgeCenterY - halfBadgeHeight - buffer;
          const blockZoneBottom = badgeCenterY + halfBadgeHeight + buffer;

          const isInsideIconZone =
            mousePosRef.current.y >= blockZoneTop &&
            mousePosRef.current.y <= blockZoneBottom &&
            mousePosRef.current.x >= tickerRect.left &&
            mousePosRef.current.x <= tickerRect.right;

          if (isInsideIconZone) {
            isMarqueeHoveredRef.current = true;
            const badgeNodes = tickerRef.current.querySelectorAll<HTMLDivElement>("[data-skill-id]");
            let matchedBadge: HTMLDivElement | null = null;
            let minDistance = Infinity;

            for (let i = 0; i < badgeNodes.length; i++) {
              const node = badgeNodes[i];
              const rect = node.getBoundingClientRect();
              if (rect.right < 0 || rect.left > window.innerWidth) continue;

              // Expand horizontal hit boundary by half the 16px gap (8px)
              if (mousePosRef.current.x >= rect.left - 8 && mousePosRef.current.x <= rect.right + 8) {
                matchedBadge = node;
                break;
              }

              const centerX = (rect.left + rect.right) / 2;
              const dist = Math.abs(mousePosRef.current.x - centerX);
              if (dist < minDistance) {
                minDistance = dist;
                matchedBadge = node;
              }
            }

            if (matchedBadge) {
              const id = matchedBadge.getAttribute("data-skill-id");
              if (id && id !== activeTooltipRef.current?.id) {
                const found = marqueeBadges.find((b) => b.id === id);
                if (found) {
                  const centerX = matchedBadge.offsetLeft + matchedBadge.offsetWidth / 2;
                  const newTooltip = { id, skill: found.skill, centerX };
                  activeTooltipRef.current = newTooltip;
                  setActiveTooltip(newTooltip);
                  clearCloseTimeout();
                }
              }
            }
          } else {
            isMarqueeHoveredRef.current = false;
            if (activeTooltipRef.current) {
              activeTooltipRef.current = null;
              setActiveTooltip(null);
            }
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      if (container) {
        container.removeEventListener("wheel", handleWheel, { capture: true });
      }
    };
  }, [viewMode, marqueeBadges, clearCloseTimeout]);

  React.useEffect(() => {
    return () => {
      clearCloseTimeout();
    };
  }, [clearCloseTimeout]);

  return (
    <Section
      id="skills"
      title="Skills"
      subtitle="Technologies and tools I build with."
      className={cn(viewMode === "ticker" && "pb-0 sm:pb-0 md:pb-0")}
    >
      <div className="flex flex-col">
        {/* Controls Toolbar: Categories & View Mode Switcher */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/70 pb-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categoryList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "relative px-3 py-1 font-mono text-xs rounded-md transition-colors duration-150 cursor-pointer select-none",
                    isActive
                      ? "text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSkillCategoryTab"
                      className="absolute inset-0 rounded-md bg-foreground -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span>{categoryShortNames[cat] || cat}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Ticker vs Grid */}
          <div className="flex items-center gap-1 self-start sm:self-auto rounded-md border border-border bg-muted/60 p-0.5">
            <button
              type="button"
              onClick={() => handleViewModeChange("ticker")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs rounded transition-all cursor-pointer",
                viewMode === "ticker"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Continuous Marquee Ticker View"
            >
              <Rows3 size={13} />
              <span>Ticker</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewModeChange("grid")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 font-mono text-xs rounded transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Categorized Matrix Grid View"
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {/* View 1: Prominent Single-Line Infinite Marquee with Sliding Inspector Pill */}
        {viewMode === "ticker" && (
          <div
            ref={marqueeContainerRef}
            onMouseMove={(e) => {
              mousePosRef.current = { x: e.clientX, y: e.clientY };
            }}
            onMouseLeave={handleMarqueeMouseLeave}
            className="relative w-full overflow-hidden pt-[100px] pb-4 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
          >
            <div
              ref={tickerRef}
              className="relative flex gap-4 py-3 w-max will-change-transform items-center select-none"
            >
              {/* Single Gliding Floating Inspector Pill (SocialHoverGroup style spring slide across badges) */}
              <AnimatePresence>
                {activeTooltip && (
                  <motion.div
                    key="marquee-sliding-tooltip"
                    initial={{
                      opacity: 0,
                      scale: 0.85,
                      y: 10,
                      x: activeTooltip.centerX,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 0,
                      x: activeTooltip.centerX,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.85,
                      y: 8,
                    }}
                    transition={{
                      x: { type: "spring", stiffness: 350, damping: 28 },
                      opacity: { duration: 0.16, ease: "easeOut" },
                      scale: { duration: 0.16, ease: "easeOut" },
                      y: { duration: 0.16, ease: "easeOut" },
                    }}
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: "calc(100% + 12px)",
                    }}
                    className="pointer-events-none z-30 flex items-center justify-center will-change-transform"
                  >
                    <div className="-translate-x-1/2 flex items-center gap-2 rounded-lg border border-border/80 bg-card/95 px-3 py-1.5 text-card-foreground shadow-xl shadow-black/15 dark:shadow-black/45 backdrop-blur-md whitespace-nowrap">
                      {/* Signature brand dot */}
                      <span
                        className="h-2 w-2 rounded-full shrink-0 transition-colors duration-200"
                        style={{ backgroundColor: activeTooltip.skill.color }}
                      />
                      {/* Skill Name */}
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {activeTooltip.skill.name}
                      </span>
                      {/* Specialized Category Tag */}
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground bg-muted/90 px-1.5 py-0.5 rounded border border-border">
                        {activeTooltip.skill.tag}
                      </span>

                      {/* Downward pointing arrow with rounded apex pointing directly at badge center */}
                      <svg
                        width="12"
                        height="6"
                        viewBox="0 0 12 6"
                        className="absolute -bottom-[5.5px] left-1/2 -translate-x-1/2 fill-card stroke-foreground/50 stroke-[1.2]"
                      >
                        <path d="M1 0 L6 5 L11 0" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {marqueeBadges.map(({ id, skill }) => (
                <TickerSkillBadge
                  key={id}
                  id={id}
                  skill={skill}
                  isHighlighted={isSkillHighlighted(skill.category)}
                  isHovered={activeTooltip?.id === id}
                  onMouseEnter={(e) => handleBadgeEnter(id, skill, e)}
                  onMouseLeave={handleBadgeLeave}
                />
              ))}
            </div>
          </div>
        )}

        {/* View 2: Categorized Grid (Fixed-size, Zero Layout Glitches) */}
        {viewMode === "grid" && (
          <div className="pt-6">
            <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Object.keys(resumeData.skills).map((category) => {
                const isCatActive =
                  selectedCategory === "All" || selectedCategory === category;
                const items =
                  resumeData.skills[category as keyof typeof resumeData.skills];
                if (!items || !Array.isArray(items)) return null;

                return (
                  <StaggerItem key={category} className="h-full">
                    <motion.div
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      className={cn(
                        "group h-full flex flex-col rounded-lg border-2 border-dotted p-4.5 bg-card transition-colors duration-300 hover:z-10",
                        isCatActive
                          ? "border-foreground/40 hover:border-foreground/80 card-glow opacity-100"
                          : "border-border/40 opacity-40 grayscale"
                      )}
                    >
                      <div className="mb-3.5 border-b border-border/60 pb-2">
                        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                          {category}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {items.map((skillName) => {
                          const meta = allSkills.find((s) => s.name === skillName);
                          if (!meta) return null;

                          return (
                            <GridSkillBadge
                              key={meta.name}
                              skill={meta}
                              isHighlighted={isCatActive}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </div>
    </Section>
  );
}

// Single-line Ticker Badge with 64x64px footprint and prominent 32px icon
function TickerSkillBadge({
  id,
  skill,
  isHighlighted,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: {
  id: string;
  skill: SkillMeta;
  isHighlighted: boolean;
  isHovered: boolean;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}) {
  const Icon = skill.icon;

  return (
    <div
      data-skill-id={id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative shrink-0 flex items-center justify-center cursor-pointer select-none"
    >
      <motion.div
        animate={{
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          "group relative flex h-16 w-16 items-center justify-center rounded-xl border transition-colors duration-200",
          isHovered
            ? "border-foreground bg-card shadow-lg shadow-black/10 dark:shadow-black/35 z-20"
            : "border-border/80 bg-card/90 hover:border-foreground/70",
          !isHighlighted && !isHovered && "opacity-35 grayscale"
        )}
        style={{
          background: isHovered
            ? `radial-gradient(circle at center, ${skill.color}22, var(--card) 75%)`
            : undefined,
        }}
      >
        {/* Prominent Tech Icon (32px) with signature brand color on hover */}
        <span
          className="flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{
            color: isHovered ? skill.color : undefined,
          }}
        >
          <Icon size={32} />
        </span>
      </motion.div>
    </div>
  );
}

// Grid View Badge: Stable dimensions, zero lift, smooth micro-scale and brightening on hover
function GridSkillBadge({
  skill,
  isHighlighted,
}: {
  skill: SkillMeta;
  isHighlighted: boolean;
}) {
  const Icon = skill.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group/badge flex items-center gap-2.5 rounded-md border px-3 py-2 font-mono text-xs transition-colors duration-200 select-none cursor-default hover:z-10",
        isHovered
          ? "border-foreground/70 bg-background shadow-xs text-foreground"
          : "border-border/80 bg-muted/50 text-foreground",
        !isHighlighted && "opacity-35 grayscale"
      )}
    >
      <span
        className="flex items-center justify-center shrink-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/badge:scale-115 group-hover/badge:rotate-6"
        style={{
          color: isHovered ? skill.color : undefined,
        }}
      >
        <Icon size={20} />
      </span>
      <span className="font-medium text-foreground">{skill.name}</span>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70 ml-auto border border-border/60 rounded px-1.5 py-0.2 bg-background/60">
        {skill.tag}
      </span>
    </motion.div>
  );
}
