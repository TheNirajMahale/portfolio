import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-5xl px-6 py-10 md:px-8 md:py-16", className)}
    >
      {title && (
        <div className="mb-12">
          {/* Decorative line above title */}
          <div className="decorative-line mb-8" />
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
