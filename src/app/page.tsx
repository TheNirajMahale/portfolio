import { Hero } from "@/components/hero";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { AnimatedGrid } from "@/components/animated-grid";

export default function Home() {
  return (
    <main className="relative">
      <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-b-2 border-dotted border-foreground/40 bg-background">
        {/* Above the fold: Hero + Vertically centered Terminal animation (100dvh on all screens) */}
        <div className="relative min-h-[100dvh] flex flex-col">
          <Hero />
          <div className="flex-1 flex items-center justify-center border-b border-border/30">
            <AnimatedGrid />
          </div>
        </div>
        {/* <LinesAnimation variant="grid" /> */}
        <Experience />
        {/* <LinesAnimation variant="particles" /> */}
        <Projects />
        {/* <LinesAnimation variant="lines" /> */}
        <Skills />
        {/* <LinesAnimation variant="grid" /> */}
        <Education />
      </div>
    </main>
  );
}
