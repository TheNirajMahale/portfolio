"use client";

import { motion } from "motion/react";
import { Briefcase } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";

export function Experience() {
  return (
    <Section id="experience" title="Experience" subtitle="Where I've been building.">
      <StaggerContainer className="space-y-6">
        {resumeData.experience.map((job) => (
          <StaggerItem key={job.company}>
            <motion.div 
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="group relative rounded-lg border-2 border-dotted border-foreground/40 bg-card p-5 md:p-8 card-glow transition-colors duration-300 hover:border-foreground/80 hover:z-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-muted-foreground transition-all duration-300 group-hover:border-foreground/40 group-hover:text-foreground group-hover:bg-muted">
                  <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-6">
                    <Briefcase size={18} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-mono text-sm font-semibold text-foreground">
                        {job.title}
                      </h3>
                      {job.duration.toLowerCase().includes("present") && (
                        <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          CURRENT ROLE
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                      {job.duration}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>

                  <ul className="mt-5 space-y-3">
                    {job.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[10px] before:h-px before:w-2 before:bg-border"
                      >
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
