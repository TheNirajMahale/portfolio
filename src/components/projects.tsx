"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { ArrowRight, FolderGit2 } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import { GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import resumeData from "@/data/resume.json";

type ProjectItem = (typeof resumeData.projects)[number];

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <StaggerContainer className="grid gap-6 sm:grid-cols-2">
        {resumeData.projects.map((project) => (
          <StaggerItem key={project.name} className="h-full">
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches)) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseLeave() {
    mouseX.set(-1000);
    mouseY.set(-1000);
  }

  const tags = ("tags" in project && Array.isArray(project.tags) ? project.tags : []) as string[];

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card p-5 sm:p-6 md:p-7 transition-colors duration-300 hover:border-foreground/40 hover:z-10"
    >
      {/* 2D Radial Spotlight Overlay following the cursor */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--foreground) 7%, transparent), transparent 80%)`,
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-muted-foreground transition-all duration-300 group-hover:border-foreground/40 group-hover:text-foreground group-hover:bg-muted">
            <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110">
              <FolderGit2 size={18} strokeWidth={1.5} />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-medium leading-snug text-foreground/95 sm:text-base">
              {project.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Tech Tags */}
      {tags.length > 0 && (
        <div className="relative z-10 mt-3.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center justify-center rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground transition-[color,box-shadow]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Highlights List */}
      <ul className="relative z-10 mt-4 flex-1 space-y-2.5">
        {project.highlights.map((highlight, i) => (
          <li
            key={i}
            className="relative pl-4 text-xs sm:text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[10px] before:h-px before:w-2 before:bg-border"
          >
            {highlight}
          </li>
        ))}
      </ul>

      {/* Footer with Demo and Source Buttons */}
      <div className="relative z-10 mt-6 flex items-center justify-between border-t-2 border-dotted border-foreground/45 pt-4">
        <ProjectDemoButton
          demo={"demo" in project && typeof project.demo === "string" ? project.demo : undefined}
          name={project.name}
        />

        {/* Fluidly Expanding Project Source Button */}
        <ProjectSourceButton href={project.link} name={project.name} />
      </div>
    </motion.div>
  );
}

function ProjectDemoButton({ demo, name }: { demo?: string; name: string }) {
  if (!demo) {
    return (
      <span
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/80 bg-muted/30 px-3 font-mono text-xs font-medium select-none cursor-not-allowed"
        title="Demo not available"
        aria-disabled="true"
      >
        <span className="text-muted-foreground/40">Demo</span>
        <ArrowRight size={12} strokeWidth={2} className="-rotate-45 text-muted-foreground/30" />
      </span>
    );
  }

  return (
    <a
      href={demo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View live demo of ${name}`}
      className="group/demo inline-flex h-8 items-center gap-1.5 rounded-md border border-border/80 bg-muted/60 px-3 font-mono text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground/75 hover:bg-background hover:text-foreground active:scale-[0.98]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>Demo</span>
      <ArrowRight
        size={12}
        strokeWidth={2}
        className="-rotate-45 text-muted-foreground transition-transform duration-200 group-hover/demo:text-foreground group-hover/demo:translate-x-0.5 group-hover/demo:-translate-y-0.5"
      />
    </a>
  );
}

const RESTING_CHARS = "GitHub".split("");
const HOVER_CHARS = "Source Code".split("");

// MicroKit Preview Browser Arrow Slide-Through Animation
// Reference: https://microkit.co/components/preview-browser-button
function SlideThroughArrow({ size = 13, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-grid place-items-center overflow-hidden shrink-0 text-muted-foreground transition-colors duration-200 group-hover/btn:text-foreground",
        className
      )}
      style={{ width: size + 3, height: size + 3 }}
      aria-hidden="true"
    >
      {/* Current arrow: shoots out diagonally to top-right on hover */}
      <ArrowRight
        size={size}
        strokeWidth={2.2}
        className="absolute -rotate-45 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-3.5 group-hover/btn:-translate-y-3.5"
      />
      {/* Incoming arrow: shoots in diagonally from bottom-left into position on hover */}
      <ArrowRight
        size={size}
        strokeWidth={2.2}
        className="absolute -rotate-45 -translate-x-3.5 translate-y-3.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0"
      />
    </span>
  );
}

// Motion Primitives 3D TextRoll: Characters rotate in 3D perspective with staggered delay
// GPU-accelerated: zero DOM layout reflow, pure transform and opacity execution
function ProjectSourceButton({ href, name }: { href: string; name: string }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${name} on GitHub`}
      onMouseEnter={() => {
        if (typeof window !== "undefined" && window.innerWidth >= 768 && window.matchMedia("(hover: hover)").matches) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
      className="group/btn relative inline-flex h-8 items-center gap-2 overflow-hidden rounded-md border border-border/80 bg-muted/60 px-3 font-mono text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/75 hover:bg-background hover:text-foreground active:scale-[0.98]"
    >
      <GitHubIcon
        size={14}
        className={cn(
          "shrink-0 transition-colors duration-200",
          isHovered ? "text-foreground" : "text-muted-foreground"
        )}
      />

      {/* GPU-Safe TextRoll Container: stable width prevents adjacent layout reflows and text cutoff */}
      <div className="relative h-4 w-[88px] flex items-center overflow-hidden shrink-0">
        {/* Resting Text: "GitHub" with 3D tumble exit */}
        <div
          aria-hidden={isHovered}
          className={cn(
            "flex items-center whitespace-nowrap [perspective:1000px] [transform-style:preserve-3d]",
            isHovered ? "pointer-events-none absolute left-0" : "relative"
          )}
        >
          <span className="inline-flex items-center">
            {RESTING_CHARS.map((char, i) => (
              <span
                key={`rest-${i}`}
                className="relative inline-block [perspective:1000px] [transform-style:preserve-3d]"
              >
                <motion.span
                  className="inline-block [backface-visibility:hidden] [transform-origin:50%_25%]"
                  animate={{
                    rotateX: isHovered ? 90 : 0,
                    opacity: isHovered ? 0 : 1,
                    y: isHovered ? -4 : 0,
                  }}
                  transition={{
                    duration: 0.24,
                    delay: isHovered ? i * 0.018 : (RESTING_CHARS.length - 1 - i) * 0.014,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
        </div>

        {/* Hovered Text: "Source Code" with 3D tumble entry (zero letter-spacing gaps) */}
        <div
          aria-hidden={!isHovered}
          className={cn(
            "flex items-center whitespace-nowrap [perspective:1000px] [transform-style:preserve-3d]",
            !isHovered ? "pointer-events-none absolute left-0" : "relative"
          )}
        >
          <span className="inline-flex items-center font-semibold text-foreground">
            {HOVER_CHARS.map((char, i) => (
              <span
                key={`hover-${i}`}
                className="relative inline-block [perspective:1000px] [transform-style:preserve-3d]"
              >
                <motion.span
                  className="inline-block [backface-visibility:hidden] [transform-origin:50%_100%]"
                  animate={{
                    rotateX: isHovered ? 0 : -90,
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 4,
                  }}
                  transition={{
                    duration: 0.24,
                    delay: isHovered ? i * 0.018 : (HOVER_CHARS.length - 1 - i) * 0.014,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* MicroKit Slide-Through Diagonal Arrow Animation */}
      <SlideThroughArrow size={13} />
    </a>
  );
}
