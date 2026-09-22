"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, LayoutGroup } from "motion/react";
import { useLenis } from "lenis/react";
import { useLoader } from "@/components/providers";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Education } from "@/components/education";
import { SectionDivider } from "@/components/ui/section-divider";
import resumeData from "@/data/resume.json";
import siteData from "@/data/site.json";

// Motion timing constants matching abhee.dev exactly
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const tweenDrop = { type: "tween" as const, duration: 0.85, ease: EASE_OUT };

// Split name into individual characters for wave animation
const NAME_CHARS = resumeData.personal.name.toUpperCase().split("");

/**
 * Wave animation for loader name text.
 * Each character slides up from below inside an overflow-hidden mask
 * with staggered delay, matching abhee.dev's entrance.
 */
function WaveName() {
  return (
    <motion.div
      layout
      layoutId="hero-name"
      className="relative z-[100] flex items-center justify-center gap-1.5"
    >
      <h1 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl flex overflow-hidden">
        {NAME_CHARS.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.5,
              delay: i * 0.035,
              ease: EASE_OUT,
            }}
            className="inline-block will-change-transform"
            style={{ display: "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
      {/* Verified checkmark fades in after last character */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 22 22"
        className="size-5 shrink-0"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.35,
          delay: NAME_CHARS.length * 0.035 + 0.1,
          ease: EASE_OUT,
        }}
      >
        <path
          d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
          fill="#1d9bf0"
        />
      </motion.svg>
    </motion.div>
  );
}

function SplashCenter({ showName }: { showName: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Avatar dropping down from top — pure GPU transform, no filter */}
      <motion.div
        layout
        layoutId="hero-avatar"
        initial={{ y: -800 }}
        animate={{ y: 0 }}
        transition={tweenDrop}
        className="relative z-[100] will-change-transform"
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

      {/* Name with wave animation — characters stagger up from below */}
      {showName && <WaveName />}
    </div>
  );
}

export function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [showName, setShowName] = useState(false);
  const lenis = useLenis();
  const { setLoaderActive } = useLoader();
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  useEffect(() => {
    // Lock scroll during initial splash
    const l = lenisRef.current;
    if (l) {
      l.stop();
      l.scrollTo(0, { immediate: true });
    }
    document.body.style.overflow = "hidden";

    // Exact timing from abhee.dev: name appears at 850ms
    const nameTimer = setTimeout(() => {
      setShowName(true);
    }, 850);

    // Exact timing from abhee.dev: total splash duration is 2300ms
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      setLoaderActive(false);
      document.body.style.overflow = "";
      const currentLenis = lenisRef.current;
      if (currentLenis) {
        currentLenis.start();
        currentLenis.resize();
      }
    }, 2300);

    return () => {
      clearTimeout(nameTimer);
      clearTimeout(loadTimer);
      document.body.style.overflow = "";
      const currentLenis = lenisRef.current;
      if (currentLenis) {
        currentLenis.start();
      }
    };
    // Empty dependency: run only once on mount. Lenis accessed via ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LayoutGroup id="site-loader-group">
      {/* 100% Solid Plain Backdrop — instant frame-0 paint without Motion hydration delay */}
      <div
        className={`fixed inset-0 z-[9999] bg-background pointer-events-none select-none transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoading ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Centered splash stage — z-[10000] above the backdrop */}
      {isLoading && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none">
          <SplashCenter showName={showName} />
        </div>
      )}

      <main className="relative max-w-full overflow-x-clip">
        <div className="relative z-10 mx-auto w-[95%] md:w-[80%] max-w-7xl border-x-2 border-dotted border-foreground/45 bg-background overflow-x-clip">
          {/* Hero receives loading state to coordinate placeholder vs motion component */}
          <Hero isLoading={isLoading} />

          {/* Smooth entrance for sections — GPU-compositable properties only (opacity + translateY) */}
          <motion.div
            initial="hidden"
            animate={isLoading ? "hidden" : "visible"}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, ease: EASE_OUT, delay: 0.4 },
              },
            }}
          >
            <SectionDivider />
            <About />

            <SectionDivider />
            <Experience />

            <SectionDivider />
            <Projects />

            <SectionDivider />
            <Skills />

            <SectionDivider />
            <Education />
          </motion.div>
        </div>

        {/* Full-width horizontal line extending to screen edges, matching nav bar */}
        <div className="w-full border-b-2 border-dotted border-foreground/45" />
      </main>
    </LayoutGroup>
  );
}
