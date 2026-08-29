import { Hero } from "@/components/hero";
import { AnimatedGrid } from "@/components/animated-grid";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { LinesAnimation } from "@/components/lines";

export default function Home() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-dashed border-foreground/40 bg-foreground/[0.02]">
        <Hero />
        <AnimatedGrid />
        
        <Experience />
        <LinesAnimation variant="particles" />
        <Projects />
        <LinesAnimation variant="lines" />
        <Skills />
        <LinesAnimation variant="grid" />
        <Education />
      </div>
    </main>
  );
}
