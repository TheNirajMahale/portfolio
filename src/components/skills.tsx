"use client";

import * as React from "react";
import { Section } from "@/components/ui/section";
import {
  SiFlutter,
  SiDart,
  SiNodedotjs,
  SiSpringboot,
  SiExpress,
  SiMongodb,
  SiMariadb,
  SiPostgresql,
  SiDocker,
  SiPostman,
  SiGooglecloud,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";

interface SkillItem {
  name: string;
  shortName?: string;
  color: string;
  icon: React.ElementType;
}

const skills: SkillItem[] = [
  { name: "Flutter", color: "#02569b", icon: SiFlutter },
  { name: "Dart", color: "#00b4ab", icon: SiDart },
  { name: "Node.js", color: "#68a063", icon: SiNodedotjs },
  { name: "Spring Boot", color: "#6db33f", icon: SiSpringboot },
  { name: "Java", color: "#f89820", icon: FaJava },
  { name: "Express.js", color: "#9ca3af", icon: SiExpress },
  { name: "MongoDB", color: "#47a248", icon: SiMongodb },
  { name: "MariaDB", color: "#003545", icon: SiMariadb },
  { name: "PostgreSQL", color: "#336791", icon: SiPostgresql },
  { name: "Docker", color: "#2496ed", icon: SiDocker },
  { name: "Postman", color: "#ff6c37", icon: SiPostman },
  { name: "GCP", color: "#4285f4", icon: SiGooglecloud },
];

export function Skills() {
  return (
    <Section id="skills" title="Tech Stack">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:gap-3">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <div
              key={skill.name}
              title={skill.name}
              className="group flex items-center justify-center sm:justify-start gap-2.5 rounded-md border border-transparent p-2 transition-all duration-150 hover:border-border/60 hover:bg-muted/40 cursor-default select-none"
            >
              <div className="flex size-7 shrink-0 items-center justify-center transition-transform duration-200 group-hover:scale-110">
                <Icon
                  className="size-6 shrink-0"
                  style={{ color: skill.color }}
                  aria-hidden="true"
                />
              </div>
              <span className="hidden sm:inline-block truncate text-sm font-medium text-foreground/85 transition-colors group-hover:text-foreground">
                {skill.shortName ?? skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
