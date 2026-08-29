"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";

const displayCategories = [
  "Programming Languages",
  "Frameworks & Libraries",
  "Databases",
  "Web Development",
  "Cloud & Tools",
] as const;

export function Skills() {
  return (
    <Section id="skills" title="Skills" subtitle="Technologies I work with.">
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayCategories.map((category) => {
          const items = resumeData.skills[category as keyof typeof resumeData.skills];
          if (!items || !Array.isArray(items)) return null;

          return (
            <StaggerItem key={category}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="rounded-lg border-2 border-dashed border-foreground/40 bg-card p-5 card-glow"
              >
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground transition-colors duration-200 hover:border-foreground/30 hover:bg-background"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
