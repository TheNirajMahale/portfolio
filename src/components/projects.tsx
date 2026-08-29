import { ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import resumeData from "@/data/resume.json";

export function Projects() {
  return (
    <Section id="projects" title="Projects" subtitle="Things I've built.">
      <StaggerContainer className="grid gap-5 sm:grid-cols-2">
        {resumeData.projects.map((project) => (
          <StaggerItem key={project.name} className="h-full">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-lg border-2 border-dashed border-foreground/40 bg-card p-6 card-glow hover:-translate-y-1.5 active:scale-[0.98] transition-transform duration-500 ease-out delay-75"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors duration-200">
                  {project.name}
                </h3>
                <ExternalLink
                  size={14}
                  strokeWidth={1.5}
                  className="mt-0.5 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </div>

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

              <div className="mt-5 pt-4 border-t-2 border-dashed border-foreground/40">
                <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  View on GitHub →
                </span>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Section>
  );
}
