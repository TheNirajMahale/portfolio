"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "motion/react";
import { useLoader } from "@/components/providers";

export function ScrollProgressBar() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const { isLoaderActive } = useLoader();

  // Smooth responsive spring for tightly synced fluid tracking
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 38,
    restDelta: 0.0001,
  });

  // Snap the progress bar to 0% immediately when switching routes (e.g. / -> /resume)
  useEffect(() => {
    scaleX.jump(0);
  }, [pathname, scaleX]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[3.5px] w-full bg-neutral-200/80 dark:bg-neutral-800/80 border-b border-neutral-300/80 dark:border-neutral-700/60 print:hidden transition-opacity duration-500 ${isLoaderActive ? "opacity-0" : "opacity-100"}`}
    >
      <motion.div
        style={{ scaleX, transformOrigin: "0% 50%" }}
        className="h-full w-full bg-neutral-950 dark:bg-white shadow-[0_2px_8px_rgba(0,0,0,0.35)] dark:shadow-[0_0_12px_rgba(255,255,255,0.85)]"
      />
    </div>
  );
}
