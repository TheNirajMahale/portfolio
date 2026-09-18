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
      className={cn("w-full", className)}
    >
      {title && (
        <div className="flex h-10 w-full items-center justify-start border-b border-border">
          <h2
            className="px-4 text-xl font-bold text-foreground/90 md:px-6 md:text-2xl"
          >
            {title}
          </h2>
        </div>
      )}
      <div className="px-4 py-6 md:px-6 md:py-8">
        {children}
      </div>
    </section>
  );
}
