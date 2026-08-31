"use client";

import { motion } from "motion/react";
import { MapPin, ArrowDown } from "lucide-react";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import resumeData from "@/data/resume.json";

const socialLinks = [
  { href: resumeData.personal.github, icon: GitHubIcon, label: "GitHub" },
  { href: resumeData.personal.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
  {
    href: `mailto:${resumeData.personal.email}`,
    icon: MailIcon,
    label: "Email",
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
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
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

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-36 pb-16 md:px-8">
        <motion.div variants={container} initial="hidden" animate="visible">
          {/* Status badge */}
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground"
          >
            <MapPin size={12} strokeWidth={1.5} className="-translate-y-[1px]" />
            <span>{resumeData.personal.location}</span>
            <span className="text-border">·</span>
            <span className="text-foreground">{resumeData.personal.relocation}</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {resumeData.personal.name}
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={item}
            className="mt-2 font-mono text-xl text-muted-foreground sm:text-2xl"
          >
            {resumeData.experience[0].title}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
          >
            {resumeData.personal.summary}
          </motion.p>

          {/* Social links */}
          <motion.div variants={item} className="mt-8 flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground transition-all duration-500 ease-out delay-75 hover:-translate-y-1 hover:border-foreground/30 hover:text-foreground hover:bg-background"
              >
                <link.icon size={16} />
              </a>
            ))}

            {/* CTA */}
            <a
              href="#experience"
              className="ml-2 inline-flex items-center gap-2 rounded-md border border-border bg-foreground px-4 py-2 font-mono text-xs font-medium text-background transition-all duration-200 hover:bg-foreground/90"
            >
              View my work
              <ArrowDown size={12} strokeWidth={2} />
            </a>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}
