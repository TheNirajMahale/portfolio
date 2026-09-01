"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCursor } from "@/components/cursor-provider";

export function CustomCursor() {
  const { cursorEnabled } = useCursor();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for buttery trailing effect (outer ring)
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Fast spring for inner dot
  const fastSpringConfig = { damping: 20, stiffness: 400, mass: 0.2 };
  const fastX = useSpring(cursorX, fastSpringConfig);
  const fastY = useSpring(cursorY, fastSpringConfig);

  useEffect(() => {
    // Only run if custom cursor is enabled and on non-touch devices
    if (!cursorEnabled || window.matchMedia("(pointer: coarse)").matches) {
      setIsVisible(false);
      return;
    }

    const moveCursor = (e: MouseEvent) => {
      // Offset target to trail below and to the right of the native cursor
      cursorX.set(e.clientX + 12);
      cursorY.set(e.clientY + 12);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest("[role='button']") ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorEnabled, cursorX, cursorY, isVisible]);

  if (!cursorEnabled || !isVisible) return null;

  return (
    <>
      {/* Outer hollow trailing ring */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-white"
        animate={{
          scale: isHovered ? 1.25 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          x: smoothX,
          y: smoothY,
          mixBlendMode: "difference",
        }}
      />
      {/* Inner solid dot */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-5 w-5 rounded-full bg-white"
        animate={{
          scale: isHovered ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          x: fastX,
          y: fastY,
          translateX: 6, // Center 20px dot inside 32px wrapper
          translateY: 6,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}

