import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { SectionDivider } from "@/components/ui/section-divider";

export default function Home() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-b-2 border-dotted border-foreground/40 bg-background">
        {/* Compact Hero (no 100dvh wrapper, no terminal animation) */}
        <Hero />

        <SectionDivider />
        <About />

        <SectionDivider />
        <Experience />

        <SectionDivider />
        <Projects />

        <SectionDivider />
        <Skills />

        <SectionDivider />
        <Education />
      </div>
    </main>
  );
}
