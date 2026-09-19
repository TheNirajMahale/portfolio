"use client";

import { motion } from "motion/react";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.2, 0, 0, 1] as [number, number, number, number],
    },
  },
};

// Custom animated download icon: Arrow slides down smoothly into the tray on hover
function AnimatedDownloadIcon({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        {/* Fixed Bottom Tray */}
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        {/* Sliding Arrow with spring ease */}
        <g className="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-1">
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </g>
      </svg>
    </span>
  );
}

export default function ResumePage() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-b-2 border-dotted border-foreground/40 bg-background px-6 pt-28 pb-16 min-h-screen">
        {/* Resume content — styled as a clean document with Hero-style entrance */}
        <motion.article
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-8 print:space-y-4 max-w-2xl mx-auto"
        >
          {/* Header */}
          <motion.header variants={item} className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground print:text-xl">
              {resumeData.personal.name}
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              {resumeData.personal.location}
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              <a href={`mailto:${resumeData.personal.email}`} className="hover:text-foreground transition-colors duration-150">
                {resumeData.personal.email}
              </a>
            </p>
            <p className="mt-1 text-base text-muted-foreground">
              <a href={resumeData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-150">
                LinkedIn
              </a>
              {" · "}
              <a href={resumeData.personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-150">
                GitHub
              </a>
            </p>
          </motion.header>

          {/* Summary */}
          <motion.p variants={item} className="text-base leading-relaxed text-muted-foreground text-center max-w-lg mx-auto">
            {resumeData.personal.summary}
          </motion.p>

          <motion.hr variants={item} className="border-t-2 border-dotted border-foreground/50" />

          {/* Experience */}
          <motion.section variants={item}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
              Experience
            </h2>
            <div className="space-y-6">
              {resumeData.experience.map((job: any) => {
                const details = job.details ?? job.highlights ?? [];

                return (
                  <div key={job.company}>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-base font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {job.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    {job.summary && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground/90 font-sans">
                        {job.summary}
                      </p>
                    )}
                    {details.length > 0 && (
                      <ul className="mt-2 space-y-1.5">
                        {details.map((h: string, i: number) => (
                          <li
                            key={i}
                            className="relative pl-3.5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/40"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.hr variants={item} className="border-t-2 border-dotted border-foreground/50" />

          {/* Projects */}
          <motion.section variants={item}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project) => (
                <div key={project.name}>
                  <h3 className="text-base font-semibold text-foreground">
                    {project.name}
                  </h3>
                  <ul className="mt-2 space-y-1.5">
                    {project.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="relative pl-3.5 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/40"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.hr variants={item} className="border-t-2 border-dotted border-foreground/50" />

          {/* Education */}
          <motion.section variants={item}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
              Education
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.institution}>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-base font-semibold text-foreground">
                      {edu.degree}
                    </h3>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {edu.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {edu.institution} • {edu.score}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.hr variants={item} className="border-t-2 border-dotted border-foreground/50" />

          {/* Skills */}
          <motion.section variants={item}>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
              Skills
            </h2>
            <div className="space-y-2">
              {Object.entries(resumeData.skills)
                .filter(([key]) => key !== "Languages Spoken")
                .map(([category, items]) => (
                  <div key={category} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {category}:
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(items as string[]).join(", ")}
                    </span>
                  </div>
                ))}
            </div>
          </motion.section>
        </motion.article>
      </div>

      {/* Floating Sticky Download Action Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35, ease: [0.2, 0, 0, 1] }}
        className="fixed bottom-6 right-6 z-40 print:hidden"
      >
        <a
          href={siteData.resumePdfUrl || "/resume.pdf"}
          download={`${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`}
          className="group flex items-center gap-2.5 rounded-full border border-border/80 bg-background/90 px-4 py-2.5 font-mono text-xs font-semibold text-foreground shadow-xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md transition-all duration-300 hover:border-foreground hover:bg-background hover:scale-105 active:scale-95"
        >
          <AnimatedDownloadIcon size={15} />
          <span>Download PDF</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </a>
      </motion.div>
    </main>
  );
}
