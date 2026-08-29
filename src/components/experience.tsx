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
              whileHover={{ y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group rounded-lg border-2 border-dashed border-foreground/40 bg-card p-5 md:p-8 card-glow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                  <Briefcase size={18} strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-mono text-sm font-semibold text-foreground">
                      {job.title}
                    </h3>
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
