import { Section } from "@/components/ui/section";

/**
 * About section — concise paragraphs in Uday Kiran's writing style,
 * placed directly below the Hero with a section header banner bar.
 */
export function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-2.5">
        <p className="text-base text-foreground/90">
          I&apos;m Niraj, a Software Engineer at{" "}
          <span className="font-medium">Velastra</span>, with hands-on experience
          building production apps using Flutter, Node.js, and Spring Boot.
        </p>
        <p className="text-base text-foreground/90">
          I work on IoT fleet telematics — real-time GPS tracking, sensor data
          pipelines, and WebSocket-driven dashboards, shipping native mobile apps
          backed by structured microservices.
        </p>
        <p className="text-base text-foreground/90">
          I&apos;ve worked with{" "}
          <span className="font-medium">clean architecture</span> and{" "}
          <span className="font-medium">end-to-end mobile + backend systems</span>,
          building modular, scalable applications from the ground up.
        </p>
      </div>
    </Section>
  );
}
