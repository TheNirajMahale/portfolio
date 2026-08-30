"use client";

import { Download } from "lucide-react";
import resumeData from "@/data/resume.json";

export default function ResumePage() {

  return (
    <main className="relative">
      <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-b-2 border-dotted border-foreground/40 bg-background px-6 pt-28 pb-16 min-h-screen">
        {/* Download button — hidden during print */}
        <div className="print:hidden mb-12 flex justify-end">
        <a
          href="/resume.pdf"
          download={`${resumeData.personal.name.replace(/\s+/g, "_")}_Resume.pdf`}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2 text-base font-medium text-background transition-[transform] duration-150 active:scale-[0.96]"
        >
          <Download size={16} strokeWidth={1.5} />
          <span>Download Resume</span>
        </a>
      </div>

      {/* Resume content — styled as a clean document */}
      <article className="space-y-8 print:space-y-4 max-w-2xl mx-auto">
        {/* Header */}
        <header className="text-center">
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
            {" · "}
            <span>{resumeData.personal.phone}</span>
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
        </header>

        {/* Summary */}
        <p className="text-base leading-relaxed text-muted-foreground text-center max-w-lg mx-auto">
          {resumeData.personal.summary}
        </p>

        <hr className="border-t-2 border-dotted border-foreground/50" />

        {/* Experience */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
            Experience
          </h2>
          {resumeData.experience.map((job) => (
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
              <ul className="mt-2 space-y-1.5">
                {job.highlights.map((h, i) => (
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
        </section>

        <hr className="border-t-2 border-dotted border-foreground/50" />

        {/* Projects */}
        <section>
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
        </section>

        <hr className="border-t-2 border-dotted border-foreground/50" />

        {/* Education */}
        <section>
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
                  {edu.institution} — {edu.score}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-t-2 border-dotted border-foreground/50" />

        {/* Skills */}
        <section>
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
        </section>
        </article>

      </div>
    </main>
  );
}
