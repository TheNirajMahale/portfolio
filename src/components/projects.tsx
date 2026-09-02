"use client";

import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import { GitHubIcon } from "@/components/ui/icons";
import resumeData from "@/data/resume.json";

export function Projects() {
  return (
    <Section id="projects" title="Projects" subtitle="Things I've built.">
      <StaggerContainer className="grid gap-5 sm:grid-cols-2">
        {resumeData.projects.map((project) => (
          <StaggerItem key={project.name} className="h-full">
            <div className="flex h-full flex-col rounded-lg border-2 border-dotted border-foreground/40 bg-card p-6 card-glow transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h3 className="font-mono text-base font-semibold text-foreground">
                  {project.name}
                </h3>
              </div>

              {/* Highlights */}
              <ul className="mt-4 flex-1 space-y-2.5">
                {project.highlights.slice(0, 3).map((highlight, i) => (
                  <li
                    key={i}
                    className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[10px] before:h-px before:w-2 before:bg-border"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>

              {/* Dedicated GitHub Button Link */}
              <div className="mt-5 pt-4 border-t-2 border-dotted border-foreground/40 flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">Open Source</span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-background"
                >
                  <GitHubIcon size={14} />
                  <span>GitHub</span>
                  <ArrowUpRight size={13} className="text-muted-foreground" />
                </a>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
