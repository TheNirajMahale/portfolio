import { SocialHoverGroup, SocialHoverCard } from "@/components/ui/social-hover-card";
import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/lib/socials";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

export function Footer() {
  return (
    <footer className="print:hidden mx-auto w-full max-w-5xl px-6 md:px-8 min-h-[380px] md:min-h-[460px] flex flex-col justify-center">
      {/* Decorative line */}
      <div className="decorative-line" />

      <div className="py-8 sm:py-10">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
              {resumeData.personal.name}
            </span>
            <p className="text-sm text-muted-foreground">
              {siteData.footer.tagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SocialHoverGroup side="top" className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <SocialHoverCard key={link.label} type={link.type} side="top">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="group relative flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-muted/60 text-muted-foreground overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 hover:border-foreground/70 hover:text-foreground hover:bg-background hover:shadow-sm"
                  >
                    {/* Primary resting brand icon */}
                    <span className="transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-0 group-hover:opacity-0 group-hover:-translate-y-2 group-hover:translate-x-2 flex items-center justify-center">
                      <link.icon size={16} />
                    </span>
                    {/* Incoming trade arrow on hover (MicroKit Social Icon Buttons) */}
                    <span className="absolute transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] scale-0 opacity-0 translate-y-2 -translate-x-2 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 flex items-center justify-center text-foreground">
                      <ArrowUpRight size={15} strokeWidth={2} />
                    </span>
                  </a>
                </SocialHoverCard>
              ))}
            </SocialHoverGroup>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-muted-foreground/60 font-mono">
          <p>© {new Date().getFullYear()} {resumeData.personal.name}</p>
        </div>
      </div>
    </footer>
  );
}
