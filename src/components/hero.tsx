"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { SocialHoverGroup, SocialHoverCard } from "@/components/ui/social-hover-card";
import { socialLinks } from "@/lib/socials";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
  },
};

interface HeroProps {
  isLoading?: boolean;
  /** True after the first-visit splash has completed (persisted in session) */
  hasLoaded?: boolean;
}

export function Hero({ isLoading = false, hasLoaded = false }: HeroProps) {
  // Only use stagger variants on return visits — during first visit,
  // the layoutId handles the splash-to-hero transition and item variants
  // would conflict (adding opacity:0 + y:14 on top of the layout anim).
  const avatarVariants = hasLoaded ? item : undefined;
  const nameVariants = hasLoaded ? item : undefined;
  return (
    <section className="relative w-full">
      {/* Radial dot pattern - starts below nav bar, ends at vertical midpoint of avatar */}
      <div
        className="pointer-events-none absolute top-20 left-0 right-0 z-0 h-[136px] sm:h-[148px] md:h-[156px] w-full opacity-35 dark:opacity-20"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1.5px, transparent 0)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative px-4 pt-36 pb-6 sm:pt-38 md:px-6 md:pt-40">
        <motion.div
          variants={container}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}
        >
          {/* Grid: Left (avatar + text) / Right (socials + email) */}
          <div className="grid w-full grid-cols-1 gap-y-6 sm:grid-cols-3">
            {/* Left Column: Avatar + Name + Role + Location (col-span-2) */}
            <div className="col-span-2 space-y-2">
              {/* Avatar */}
              <motion.div variants={avatarVariants} className="relative mt-4 flex w-full justify-center sm:justify-start">
                {isLoading ? (
                  <div className="size-28 sm:size-30 shrink-0" aria-hidden="true" />
                ) : (
                  <motion.div
                    layout
                    layoutId="hero-avatar"
                    transition={{ type: "tween", duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-center justify-center will-change-transform"
                  >
                    <Image
                      src={siteData.hero?.avatar ?? "/avatar.png"}
                      alt={`${resumeData.personal.name}'s avatar`}
                      width={120}
                      height={120}
                      priority
                      unoptimized
                      className="size-28 rounded-full border-2 border-border/80 shadow-md object-cover select-none sm:size-30"
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Name + Verified Badge */}
              <motion.div variants={nameVariants} className="flex items-center justify-center gap-1.5 sm:mt-2 sm:justify-start">
                {isLoading ? (
                  <div className="h-7 sm:h-8 w-44" aria-hidden="true" />
                ) : (
                  <motion.div
                    layout
                    layoutId="hero-name"
                    transition={{ type: "tween", duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-center gap-1.5 sm:justify-start will-change-transform"
                  >
                    <h1 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-left sm:text-2xl">
                      {resumeData.personal.name.toUpperCase()}
                    </h1>
                    {/* Blue verified checkmark */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" className="size-5 shrink-0">
                      <path
                        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                        fill="#1d9bf0"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Role + Location (compact inline) */}
              <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground sm:justify-start">
                <span>{resumeData.experience[0]?.title}</span>
                <span className="text-muted-foreground/40 font-light" aria-hidden="true">|</span>
                <span className="group/loc inline-flex items-center gap-1.5 cursor-default">
                  <motion.span
                    className="inline-flex items-center justify-center shrink-0"
                    animate={{ y: [0, -2.5, 0] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      y: -4,
                      scale: 1.15,
                      rotate: [-6, 6, 0],
                      transition: { duration: 0.35, ease: "easeOut" },
                    }}
                  >
                    <MapPin size={12} strokeWidth={1.5} className="text-muted-foreground group-hover/loc:text-foreground transition-colors" />
                  </motion.span>
                  <span className="group-hover/loc:text-foreground transition-colors">{resumeData.personal.location}</span>
                </span>
              </motion.div>
            </div>

            {/* Right Column: Social links + Email (vertically centered in plain bg section) */}
            <motion.div
              variants={item}
              className="mx-0 sm:mx-2 flex flex-col items-center justify-center sm:items-end sm:justify-center sm:pt-[76px]"
            >
              {/* Social icon grid */}
              <SocialHoverGroup side="top" className="flex items-center">
                <div className="grid grid-cols-3 gap-x-6 sm:gap-x-8">
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
                        {/* Incoming trade arrow on hover */}
                        <span className="absolute transition-all duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] scale-0 opacity-0 translate-y-2 -translate-x-2 group-hover:scale-100 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 flex items-center justify-center text-foreground">
                          <ArrowUpRight size={15} strokeWidth={2} />
                        </span>
                      </a>
                    </SocialHoverCard>
                  ))}
                </div>
              </SocialHoverGroup>

              {/* Email address */}
              <div className="mt-2.5 flex w-full items-center justify-center sm:justify-end">
                <a
                  href={`mailto:${resumeData.personal.email}`}
                  className="font-mono text-xs text-foreground underline-offset-4 hover:underline transition-colors"
                >
                  {resumeData.personal.email}
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
