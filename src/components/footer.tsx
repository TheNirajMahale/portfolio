"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { SocialHoverGroup, SocialHoverCard } from "@/components/ui/social-hover-card";
import { socialLinks } from "@/lib/socials";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

export function Footer() {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress to reveal the sticky footer
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.15, 0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-40, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ["blur(12px)", "blur(0px)"]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumeData.personal.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  return (
    <footer
      ref={containerRef}
      className="relative w-full h-[580px] sm:h-[540px] md:h-[500px]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative h-[calc(100vh+580px)] sm:h-[calc(100vh+540px)] md:h-[calc(100vh+500px)] -top-[100vh]">
        <div className="sticky top-[calc(100vh-580px)] sm:top-[calc(100vh-540px)] md:top-[calc(100vh-500px)] h-[580px] sm:h-[540px] md:h-[500px] w-full flex items-center justify-center overflow-hidden bg-background bg-grid-texture">
          {/* Animated Revealed Content */}
          <motion.div
            style={{
              scale,
              opacity,
              y,
              filter: blur,
            }}
            className="relative z-10 mx-auto w-full max-w-5xl px-6 md:px-8 pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-24 md:pb-12"
          >
            {/* Top Label */}
            <span className="font-mono text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Let's Connect
            </span>

            {/* Big Email Display */}
            <div className="mt-3 flex flex-wrap items-baseline gap-3 sm:gap-4">
              <a
                href={`mailto:${resumeData.personal.email}`}
                className="group inline-flex items-center gap-2 font-mono text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground hover:text-emerald-400 transition-colors"
              >
                <span>{resumeData.personal.email}</span>
                <ArrowUpRight className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-muted-foreground group-hover:text-emerald-400" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground hover:border-foreground/50 hover:text-foreground hover:bg-muted/30 transition-all select-none cursor-pointer"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Dotted Divider Line */}
            <div className="my-5 sm:my-6 border-b-2 border-dotted border-border/60" />

            {/* Humanized Note */}
            <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground font-sans">
              {siteData.footer.pitch}
            </p>

            {/* Signature Social Icon Button Cards with Main Page Background */}
            <div className="mt-7 sm:mt-8 flex items-center gap-2.5">
              <SocialHoverGroup side="top" className="flex items-center gap-2.5">
                {socialLinks.map((link) => (
                  <SocialHoverCard key={link.label} type={link.type} side="top">
                    <a
                      href={link.href}
                      target={link.type === "email" ? undefined : "_blank"}
                      rel={link.type === "email" ? undefined : "noopener noreferrer"}
                      aria-label={link.label}
                      className="group relative flex h-9 w-9 items-center justify-center rounded-md border border-border/80 bg-background text-muted-foreground overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 hover:border-foreground/70 hover:text-foreground hover:bg-muted/30 hover:shadow-sm"
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

            {/* Bottom Minimal Copyright Bar */}
            <div className="mt-8 pt-4 border-t border-border/20 flex items-center justify-between text-xs font-mono text-muted-foreground/60">
              <p>© {new Date().getFullYear()} {resumeData.personal.name} • {resumeData.personal.location}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
