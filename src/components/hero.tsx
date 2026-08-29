"use client";

import { motion } from "motion/react";
import { Mail, MapPin, ArrowDown } from "lucide-react";
import resumeData from "@/data/resume.json";

function GitHubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

const socialLinks = [
  { href: resumeData.personal.github, icon: GitHubIcon, label: "GitHub" },
  { href: resumeData.personal.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
  {
    href: `mailto:${resumeData.personal.email}`,
    icon: ({ size }: { size?: number }) => <Mail size={size} strokeWidth={1.5} />,
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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background grid texture */}
      <div className="absolute inset-0 bg-grid-texture" />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24 md:px-8">
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

      {/* Decorative line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 decorative-line" />
    </section>
  );
}
