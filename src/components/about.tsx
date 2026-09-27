import { Section } from "@/components/ui/section";
import { StaggerContainer, StaggerItem } from "@/components/ui/in-view";
import siteData from "@/data/site.json";

/**
 * About section - concise paragraphs in Uday Kiran's writing style,
 * placed directly below the Hero with a section header banner bar.
 */
export function About() {
  return (
    <section id="about" className="w-full">
      <div className="h-px w-full bg-border" />
      <div className="px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-8">
        <StaggerContainer className="space-y-2.5">
          {siteData.about.paragraphs.map((paragraph, index) => (
            <StaggerItem key={index}>
              <p className="text-base text-foreground/90 font-sans leading-relaxed">
                {paragraph}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
