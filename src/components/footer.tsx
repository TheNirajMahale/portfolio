import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";
import { SocialHoverCard, type SocialType } from "@/components/ui/social-hover-card";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

const links: { href: string; icon: typeof GitHubIcon; label: string; type: SocialType }[] = [
  {
    href: `mailto:${resumeData.personal.email}`,
    icon: MailIcon,
    label: "Email",
    type: "email",
  },
  {
    href: resumeData.personal.linkedin,
    icon: LinkedInIcon,
    label: "LinkedIn",
    type: "linkedin",
  },
  {
    href: resumeData.personal.github,
    icon: GitHubIcon,
    label: "GitHub",
    type: "github",
  },
];

export function Footer() {
  return (
    <footer className="print:hidden mx-auto w-full max-w-5xl px-6 md:px-8 mt-20">
      {/* Decorative line */}
      <div className="decorative-line" />

      <div className="py-12">
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
            {links.map((link) => (
              <SocialHoverCard key={link.label} type={link.type} side="top">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-dotted border-foreground/40 bg-muted text-muted-foreground transition-all duration-300 ease-out hover:border-foreground/30 hover:text-foreground hover:bg-background hover:-translate-y-1"
                >
                  <link.icon size={16} />
                </a>
              </SocialHoverCard>
            ))}
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between text-xs text-muted-foreground/60 font-mono">
          <p>© {new Date().getFullYear()} {resumeData.personal.name}</p>
        </div>
      </div>
    </footer>
  );
}
