"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, ArrowDown, Sparkles, Volume2, VolumeX } from "lucide-react";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import { SocialHoverCard, type SocialType } from "@/components/ui/social-hover-card";
import { useCursor } from "@/components/cursor-provider";
import { useSound } from "@/components/sound-provider";
import resumeData from "@/data/resume.json";

const socialLinks: { href: string; icon: typeof GitHubIcon; label: string; type: SocialType }[] = [
  { href: resumeData.personal.github, icon: GitHubIcon, label: "GitHub", type: "github" },
  { href: resumeData.personal.linkedin, icon: LinkedInIcon, label: "LinkedIn", type: "linkedin" },
  {
    href: `mailto:${resumeData.personal.email}`,
    icon: MailIcon,
    label: "Email",
    type: "email",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
};

export function Hero() {
  const { cursorEnabled, toggleCursor } = useCursor();
  const { soundEnabled, toggleSound } = useSound();

  return (
    <section className="relative w-full">
      {/* Dynamic SVG Texture for Hero */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.15] dark:opacity-[0.07]">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-fabric" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 16V0h16v16H0zm8-16v16M0 8h16" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-fabric)" className="text-foreground" />
        </svg>
        {/* Fade the texture out at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-28 pb-2 sm:pt-30 md:pt-32 sm:pb-3 md:px-8">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Top Header Bar: Status Badge (Left) + Interactive Controls (Right) */}
          <motion.div variants={item} className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
              <MapPin size={12} strokeWidth={1.5} className="-translate-y-[1px]" />
              <span>{resumeData.personal.location}</span>
              <span className="text-border">·</span>
              <span className="text-foreground">{resumeData.personal.relocation}</span>
            </div>

            {/* Interactive FX & Sound Controls cluster (Top-Right, desktop only) */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Sound FX Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                title={soundEnabled ? "Mute UI click sound" : "Enable UI click sound"}
                aria-label="Toggle UI click sound"
                className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                  soundEnabled
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-border bg-muted/80 text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-background"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 size={14} strokeWidth={1.75} />
                ) : (
                  <VolumeX size={14} strokeWidth={1.75} />
                )}
              </button>

              {/* Cursor FX Toggle */}
              <button
                type="button"
                onClick={toggleCursor}
                title={cursorEnabled ? "Disable cursor follower" : "Enable cursor follower"}
                aria-label="Toggle custom cursor follower"
                className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-300 ease-out hover:-translate-y-0.5 ${
                  cursorEnabled
                    ? "border-foreground bg-foreground text-background shadow-sm"
                    : "border-border bg-muted/80 text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-background"
                }`}
              >
                <Sparkles size={14} strokeWidth={1.75} />
              </button>
            </div>
          </motion.div>

          {/* 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Text & Actions (7 cols on desktop) */}
            <div className="md:col-span-7 flex flex-col justify-center">
              {/* Name */}
              <motion.h1
                variants={item}
                className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                {resumeData.personal.name}
              </motion.h1>

              {/* Title */}
              <motion.p
                variants={item}
                className="mt-2 font-mono text-lg text-muted-foreground sm:text-2xl"
              >
                {resumeData.experience[0].title}
              </motion.p>

              {/* Description */}
              <motion.p
                variants={item}
                className="mt-4 sm:mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {resumeData.personal.summary}
              </motion.p>

              {/* Social links & Action buttons */}
              <motion.div variants={item} className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2">
                {socialLinks.map((link) => (
                  <SocialHoverCard key={link.label} type={link.type} side="bottom">
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/30 hover:text-foreground hover:bg-background"
                    >
                      <link.icon size={16} />
                    </a>
                  </SocialHoverCard>
                ))}

                {/* CTA */}
                <a
                  href="#experience"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-all duration-200 hover:bg-foreground/90"
                >
                  View my work
                  <ArrowDown size={12} strokeWidth={2} />
                </a>
              </motion.div>
            </div>

            {/* Right Column: Floating Transparent Anime Developer Companion (5 cols on desktop) */}
            <motion.div
              variants={item}
              className="hidden md:flex md:col-span-5 items-center justify-center lg:justify-end relative select-none overflow-visible p-2 pb-2"
            >
              {/* Soft ambient backlight glow behind monitor */}
              <div className="absolute -left-4 top-1/4 h-36 w-36 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
              <div className="absolute right-4 bottom-1/4 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

              <div className="relative group transition-transform duration-500 hover:scale-[1.02] overflow-visible">
                <Image
                  src="/developer-avatar.png"
                  alt="Niraj Mahale - Coding illustration"
                  width={420}
                  height={420}
                  priority
                  className="relative z-10 w-full max-w-[300px] lg:max-w-[340px] h-auto object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
