"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { MapPin, ArrowDown, ArrowUpRight, Sparkles, Volume2, VolumeX, Music } from "lucide-react";
import { SocialHoverGroup, SocialHoverCard } from "@/components/ui/social-hover-card";
import { useCursor } from "@/components/cursor-provider";
import { useSound } from "@/components/sound-provider";
import { useMusic } from "@/components/music-provider";
import { AudioWaveformLine } from "@/components/ui/audio-waveform-line";
import { socialLinks } from "@/lib/socials";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

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
  const lenis = useLenis();
  const { cursorEnabled, toggleCursor } = useCursor();
  const { soundEnabled, toggleSound } = useSound();
  const { musicEnabled, toggleMusic } = useMusic();

  const scrollToExperience = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo("#experience", { offset: -90, duration: 1.4 });
    } else {
      const target = document.getElementById("experience");
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

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
          {/* Top Row: Location Badge + Underneath Right-Aligned Toggles */}
          <motion.div variants={item} className="mb-4 sm:mb-1 w-fit flex flex-col items-start">
            {/* Status badge */}
            <div className="group inline-flex items-center gap-2 rounded-md border border-border bg-muted/80 backdrop-blur-sm px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/30">
              <MapPin size={12} strokeWidth={1.5} className="-translate-y-[0.5px] transition-transform duration-300 group-hover:-translate-y-1 text-muted-foreground group-hover:text-foreground" />
              <span>{resumeData.personal.location}</span>
              <span className="text-border">·</span>
              <span className="inline-flex items-center gap-1.5 text-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                {resumeData.personal.relocation}
              </span>
            </div>

            {/* Controls directly under badge, aligned flush with badge's right end (Desktop only) */}
            <div className="hidden sm:flex w-full justify-between items-center gap-2.5 mt-1.5">
              {/* Subtle dotted waveform line to the left of the buttons */}
              <AudioWaveformLine isPlaying={musicEnabled} className="flex-1 justify-end mr-0.5" />

              {/* Button Cluster */}
              <div className="flex items-center gap-2">
                {/* Background Music Toggle */}
                <motion.button
                  type="button"
                  onClick={toggleMusic}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  title={musicEnabled ? "Pause ambient piano music" : "Play ambient piano music"}
                  aria-label="Toggle ambient piano music"
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 select-none ${
                    musicEnabled
                      ? "border-foreground/75 bg-card text-foreground shadow-xs"
                      : "border-border/80 bg-muted/60 text-muted-foreground/60 hover:border-foreground/60 hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {musicEnabled && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse border-2 border-background" />
                  )}
                  <motion.span
                    animate={musicEnabled ? { rotate: [-5, 5, -5] } : { rotate: 0 }}
                    transition={musicEnabled ? { repeat: Infinity, duration: 1.8, ease: "easeInOut" } : { duration: 0.2 }}
                    className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-115"
                  >
                    <Music
                      size={14}
                      strokeWidth={musicEnabled ? 2.25 : 1.5}
                      className={musicEnabled ? "text-foreground" : "text-muted-foreground/60"}
                    />
                  </motion.span>
                </motion.button>

                {/* Sound FX Toggle */}
                <motion.button
                  type="button"
                  onClick={toggleSound}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  title={soundEnabled ? "Mute UI click sound" : "Enable UI click sound"}
                  aria-label="Toggle UI click sound"
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 select-none ${
                    soundEnabled
                      ? "border-foreground/75 bg-card text-foreground shadow-xs"
                      : "border-border/80 bg-muted/60 text-muted-foreground/60 hover:border-foreground/60 hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {soundEnabled && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse border-2 border-background" />
                  )}
                  <span className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-115">
                    {soundEnabled ? (
                      <motion.span
                        key="vol-on"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <Volume2 size={14} strokeWidth={2.25} className="text-foreground" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="vol-off"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <VolumeX size={14} strokeWidth={1.5} className="text-muted-foreground/60" />
                      </motion.span>
                    )}
                  </span>
                </motion.button>

                {/* Cursor FX Toggle */}
                <motion.button
                  type="button"
                  onClick={toggleCursor}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  title={cursorEnabled ? "Disable cursor follower" : "Enable cursor follower"}
                  aria-label="Toggle custom cursor follower"
                  className={`group relative flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 select-none ${
                    cursorEnabled
                      ? "border-foreground/75 bg-card text-foreground shadow-xs"
                      : "border-border/80 bg-muted/60 text-muted-foreground/60 hover:border-foreground/60 hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {cursorEnabled && (
                    <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse border-2 border-background" />
                  )}
                  <motion.span
                    animate={cursorEnabled ? { rotate: 360 } : { rotate: 0 }}
                    transition={cursorEnabled ? { repeat: Infinity, duration: 8, ease: "linear" } : { duration: 0.3 }}
                    className="inline-flex items-center justify-center transition-transform duration-200 group-hover:scale-115 group-hover:rotate-45"
                  >
                    <Sparkles
                      size={14}
                      strokeWidth={cursorEnabled ? 2.25 : 1.5}
                      className={cursorEnabled ? "text-foreground" : "text-muted-foreground/60"}
                    />
                  </motion.span>
                </motion.button>
              </div>
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

              {/* Title / Role */}
              <motion.p
                variants={item}
                className="my-3 sm:my-4 font-mono text-lg text-muted-foreground sm:text-2xl"
              >
                {resumeData.experience[0].title}
              </motion.p>

              {/* Description */}
              <motion.p
                variants={item}
                className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base"
              >
                {resumeData.personal.summary}
              </motion.p>

              {/* Social links & Action buttons */}
              <motion.div variants={item} className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2.5">
                <SocialHoverGroup side="top" className="flex items-center gap-2.5">
                  {socialLinks.map((link) => (
                    <SocialHoverCard key={link.label} type={link.type} side="top">
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className="group relative flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-muted/60 text-muted-foreground overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 hover:border-foreground/70 hover:text-foreground hover:bg-background hover:shadow-sm"
                      >
                        {/* Primary resting brand icon */}
                        <span className="transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-0 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:translate-x-2 flex items-center justify-center">
                          <link.icon size={16} />
                        </span>
                        {/* Incoming trade arrow on hover (MicroKit Social Icon Buttons) */}
                        <span className="absolute transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] scale-0 opacity-0 translate-y-2 -translate-x-2 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 flex items-center justify-center text-foreground">
                          <ArrowUpRight size={15} strokeWidth={2} />
                        </span>
                      </a>
                    </SocialHoverCard>
                  ))}
                </SocialHoverGroup>

                {/* Primary CTA: MicroKit Read More Swap with Lenis smooth scroll */}
                <a
                  href="#experience"
                  onClick={scrollToExperience}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-md border border-border bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-all duration-300 ease-out hover:bg-foreground/90 hover:shadow-md active:scale-95"
                >
                  {/* Incoming leading arrow on hover */}
                  <span className="inline-flex w-0 -translate-x-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-3.5 group-hover:translate-x-0 group-hover:opacity-100 mr-0 group-hover:mr-1.5 items-center">
                    <ArrowDown size={12} strokeWidth={2.5} />
                  </span>

                  {/* Label */}
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    View my work
                  </span>

                  {/* Default trailing arrow */}
                  <span className="inline-flex w-3.5 translate-x-0 opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-0 group-hover:translate-x-2 group-hover:opacity-0 ml-1.5 group-hover:ml-0 items-center">
                    <ArrowDown size={12} strokeWidth={2} />
                  </span>
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
                  src={siteData.hero?.avatar ?? "/developer-avatar.png"}
                  alt={siteData.hero?.avatarAlt ?? `${resumeData.personal.name} - Coding illustration`}
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
