"use client";

import { motion } from "motion/react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";
import { 
  SiDart, SiJavascript, SiMysql, SiPostgresql, SiMongodb,
  SiFlutter, SiSpringboot, SiNodedotjs, SiExpress,
  SiHtml5, SiCss,
  SiGit, SiLinux, SiPostman, SiEclipseide, SiDocker, SiGooglecloud,
} from "react-icons/si";
import { FaDatabase, FaGears, FaLock, FaNetworkWired, FaCode, FaJava } from "react-icons/fa6";
import { VscVscode } from "react-icons/vsc";

const skillIcons: Record<string, React.ElementType> = {
  // Programming Languages
  "Java": FaJava,
  "Dart": SiDart,
  "JavaScript": SiJavascript,
  "SQL": FaDatabase,

  // Frameworks & Libraries
  "Flutter": SiFlutter,
  "Spring Boot": SiSpringboot,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,

  // Databases
  "MongoDB": SiMongodb,
  "MySQL": SiMysql,
  "PostgreSQL": SiPostgresql,

  // Web Development
  "HTML": SiHtml5,
  "CSS": SiCss,
  "REST APIs": FaNetworkWired,
  "JWT / OAuth": FaLock,

  // Cloud & Tools
  "Git": SiGit,
  "VS Code": VscVscode,
  "Linux": SiLinux,
  "Postman": SiPostman,
  "Eclipse": SiEclipseide,
  "Docker": SiDocker,
  "Google Cloud Platform (GCP)": SiGooglecloud,

  // Concepts
  "Data Structures & Algorithms (DSA)": FaCode,
  "Software Development Life Cycle (SDLC)": FaGears,
};

export function Skills() {
  const categories = Object.keys(resumeData.skills);

  return (
    <Section id="skills" title="Skills" subtitle="Technologies I work with.">
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const items = resumeData.skills[category as keyof typeof resumeData.skills];
          if (!items || !Array.isArray(items)) return null;

          return (
            <StaggerItem key={category} className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full flex flex-col rounded-lg border-2 border-dotted border-foreground/40 bg-card p-5 card-glow"
              >
                <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => {
                    const Icon = skillIcons[skill];
                    return (
                      <span
                        key={skill}
                        className="flex items-center gap-1.5 rounded-md border border-border bg-muted px-2.5 py-1 font-mono text-xs text-foreground transition-colors duration-200 hover:border-foreground/30 hover:bg-background"
                      >
                        {Icon && <Icon className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground" size={14} />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </Section>
  );
}
