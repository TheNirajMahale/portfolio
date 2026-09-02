"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useCursor } from "@/components/cursor-provider";

const DEFAULT_SIZE = 20; // 20px default circle
const DEFAULT_RADIUS = 999; // Circular border-radius

export function CustomCursor() {
  const { cursorEnabled } = useCursor();

  // Unified Motion Values (Zero React state re-renders during mouse movement)
  const targetX = useMotionValue(-100);
  const targetY = useMotionValue(-100);
  const targetW = useMotionValue(DEFAULT_SIZE);
  const targetH = useMotionValue(DEFAULT_SIZE);
  const targetR = useMotionValue(DEFAULT_RADIUS);
  const cursorOpacity = useMotionValue(0);

  // Position spring: High stiffness + low mass = instantaneous 0ms tracking + silky morph transitions
  const posSpring = { damping: 40, stiffness: 850, mass: 0.08 };
  const smoothX = useSpring(targetX, posSpring);
  const smoothY = useSpring(targetY, posSpring);

  // Geometry spring: Buttery width, height, and border-radius morphing
  const shapeSpring = { damping: 32, stiffness: 600, mass: 0.1 };
  const smoothW = useSpring(targetW, shapeSpring);
  const smoothH = useSpring(targetH, shapeSpring);
  const smoothR = useSpring(targetR, shapeSpring);

  const activeTargetRef = useRef<HTMLElement | null>(null);

  // Toggle global native cursor hiding
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (cursorEnabled && !isTouch) {
      document.documentElement.classList.add("custom-cursor-active");
    } else {
      document.documentElement.classList.remove("custom-cursor-active");
    }

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [cursorEnabled]);

  useEffect(() => {
    if (!cursorEnabled || window.matchMedia("(pointer: coarse)").matches) {
      cursorOpacity.set(0);
      return;
    }

    const parseRadius = (str: string): number => {
      const match = str.match(/^([\d.]+)px/);
      if (match) return parseFloat(match[1]);
      if (str.includes("%") || str === "9999px" || str.includes("full")) return 999;
      return 8;
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorOpacity.set(1);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, [data-cursor-morph]"
      );

      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        const computed = window.getComputedStyle(interactive);
        const radiusVal = parseRadius(computed.borderRadius);

        activeTargetRef.current = interactive;

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        targetX.set(centerX);
        targetY.set(centerY);
        targetW.set(rect.width);
        targetH.set(rect.height);
        targetR.set(radiusVal);
      } else {
        activeTargetRef.current = null;

        targetX.set(e.clientX);
        targetY.set(e.clientY);
        targetW.set(DEFAULT_SIZE);
        targetH.set(DEFAULT_SIZE);
        targetR.set(DEFAULT_RADIUS);
      }
    };

    const handleScroll = () => {
      if (activeTargetRef.current) {
        const rect = activeTargetRef.current.getBoundingClientRect();
        targetX.set(rect.left + rect.width / 2);
        targetY.set(rect.top + rect.height / 2);
      }
    };

    const handleMouseLeave = () => cursorOpacity.set(0);
    const handleMouseEnter = () => cursorOpacity.set(1);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorEnabled, targetX, targetY, targetW, targetH, targetR, cursorOpacity]);

  if (!cursorEnabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[99999] bg-white mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        width: smoothW,
        height: smoothH,
        borderRadius: smoothR,
        opacity: cursorOpacity,
        translateX: "-50%",
        translateY: "-50%",
      }}
    />
  );
}
