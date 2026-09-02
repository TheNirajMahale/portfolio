"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  MapPin,
  GraduationCap,
  Sparkles,
  GitBranch,
  BookOpen,
  Mail,
  Building2,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import socialsData from "@/data/socials.json";

export type SocialType = "github" | "linkedin" | "email";

interface SocialHoverCardProps {
  type: SocialType;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function SocialHoverCard({
  type,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 8,
}: SocialHoverCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(socialsData.email.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <HoverCardPrimitive.Root
      openDelay={180}
      closeDelay={200}
      onOpenChange={setIsOpen}
    >
      <HoverCardPrimitive.Trigger asChild>
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          avoidCollisions={true}
          collisionPadding={10}
          className="z-50 focus:outline-none"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: side === "top" ? 4 : -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: side === "top" ? 3 : -3 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="w-68 sm:w-72 rounded-lg border-2 border-dotted border-foreground/40 bg-card p-3.5 text-card-foreground shadow-md shadow-black/5 dark:shadow-lg dark:shadow-black/20 backdrop-blur-md select-text"
              >
                {type === "github" && (
                  <div className="flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
                          <GitHubIcon size={16} />
                          <span
                            className="absolute -top-0.5 -right-0.5 flex h-2 w-2"
                            title={socialsData.github.status}
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-semibold text-foreground leading-tight">
                              {socialsData.github.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground leading-tight block">
                            {socialsData.github.handle}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        <GitBranch size={9} />
                        {socialsData.github.platform}
                      </span>
                    </div>

                    {/* Bio */}
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      {socialsData.github.bio}
                    </p>

                    {/* Featured Repositories */}
                    <div className="rounded-md border border-border/80 bg-muted/40 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-[10px] font-medium text-foreground flex items-center gap-1">
                          <BookOpen size={10} className="text-muted-foreground" />
                          {socialsData.github.featuredRepositoriesTitle}
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {socialsData.github.badge}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {socialsData.github.featuredRepositories.map((repo) => (
                          <a
                            key={repo.name}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/repo flex items-center justify-between rounded px-1 py-0.5 hover:bg-background/80 transition-colors"
                          >
                            <span className="font-mono text-[11px] text-foreground group-hover/repo:text-foreground font-medium truncate">
                              {repo.name}
                            </span>
                            <span className="shrink-0 font-mono text-[9px] text-muted-foreground">
                              {repo.tech}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <a
                      href={socialsData.github.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2.5 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
                    >
                      <span>{socialsData.github.ctaText}</span>
                      <ArrowUpRight size={11} strokeWidth={2} />
                    </a>
                  </div>
                )}

                {type === "linkedin" && (
                  <div className="flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#0077b5]/30 bg-[#0077b5]/10 text-[#0077b5] dark:text-[#38a0dc]">
                          <LinkedInIcon size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs font-semibold text-foreground leading-tight">
                              {socialsData.linkedin.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground leading-tight block truncate max-w-[130px]">
                            {socialsData.linkedin.headline}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-0.5 rounded border border-[#0077b5]/30 bg-[#0077b5]/10 px-1.5 py-0.5 font-mono text-[9px] text-[#0077b5] dark:text-[#38a0dc] font-medium">
                        {socialsData.linkedin.platform}
                      </span>
                    </div>

                    {/* Snapshot info */}
                    <div className="flex flex-col gap-1 rounded-md border border-border/80 bg-muted/40 p-2 font-mono text-[10px]">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Building2 size={11} className="shrink-0 text-muted-foreground" />
                        <span className="font-medium truncate">
                          {socialsData.linkedin.role}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground truncate">
                          {socialsData.linkedin.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                        <GraduationCap size={11} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{socialsData.linkedin.education}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-[10px]">
                        <MapPin size={11} className="shrink-0 text-muted-foreground" />
                        <span className="truncate">{socialsData.linkedin.location}</span>
                      </div>
                    </div>

                    {/* Skills preview */}
                    <div className="flex flex-wrap gap-1">
                      {socialsData.linkedin.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded border border-border bg-muted/70 px-1 py-0.25 font-mono text-[9px] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Footer CTA */}
                    <a
                      href={socialsData.linkedin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2.5 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
                    >
                      <span>{socialsData.linkedin.ctaText}</span>
                      <ArrowUpRight size={11} strokeWidth={2} />
                    </a>
                  </div>
                )}

                {type === "email" && (
                  <div className="flex flex-col gap-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
                          <Mail size={16} strokeWidth={1.5} />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-semibold text-foreground leading-tight block">
                            {socialsData.email.name}
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground leading-tight block">
                            {socialsData.email.label}
                          </span>
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-0.5 rounded border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                        <Sparkles size={9} />
                        {socialsData.email.statusBadge}
                      </span>
                    </div>

                    {/* Email Box */}
                    <div className="flex items-center justify-between gap-1.5 rounded-md border border-border/80 bg-muted/40 p-2">
                      <span className="font-mono text-[11px] text-foreground truncate select-all">
                        {socialsData.email.address}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address"
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        {copied ? (
                          <Check size={11} className="text-emerald-500" />
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>

                    {/* CTA Actions */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyEmail}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-muted px-2 py-1 font-mono text-[11px] font-medium text-foreground transition-all hover:bg-muted/80"
                      >
                        {copied ? (
                          <>
                            <Check size={11} className="text-emerald-500" />
                            <span>{socialsData.email.copiedButtonText}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>{socialsData.email.copyButtonText}</span>
                          </>
                        )}
                      </button>

                      <a
                        href={`mailto:${socialsData.email.address}`}
                        className="inline-flex items-center justify-center gap-1 rounded-md border border-border bg-foreground px-2 py-1 font-mono text-[11px] font-medium text-background transition-all hover:bg-foreground/90"
                      >
                        <span>{socialsData.email.sendMailButtonText}</span>
                        <ArrowUpRight size={11} strokeWidth={2} />
                      </a>
                    </div>
                  </div>
                )}

                <HoverCardPrimitive.Arrow className="fill-border" />
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
