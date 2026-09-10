"use client";

import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";

export function Education() {
  return (
    <Section
      id="education"
      title="Education"
      subtitle="Academic background."
      className="pt-[84px] sm:pt-[84px] md:pt-[84px]"
    >
      <StaggerContainer className="space-y-5">
        {resumeData.education.map((edu) => (
          <StaggerItem key={edu.institution}>
            <motion.div
              whileHover={{ scale: 1.012 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className="group relative rounded-lg border-2 border-dotted border-foreground/40 bg-card p-6 md:p-8 card-glow transition-colors duration-300 hover:border-foreground/80 hover:z-10"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-muted/70 text-muted-foreground transition-all duration-300 group-hover:border-foreground/40 group-hover:text-foreground group-hover:bg-muted">
                  <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1 group-hover:scale-115 group-hover:-rotate-12">
                    <GraduationCap size={18} strokeWidth={1.5} />
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-mono text-sm font-semibold text-foreground">
                      {edu.degree}
                    </h3>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                      {edu.duration}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{edu.institution}</p>

                  <div className="mt-4 pt-4 border-t-2 border-dotted border-foreground/40">
                    <p className="font-mono text-xs text-muted-foreground">
                      Grade: <span className="text-foreground">{edu.score}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
