"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle RGB-cycling glow that follows the cursor — Brittany Chiang style.
 *
 * Uses a radial-gradient positioned via CSS custom properties.
 * JS only updates `--mouse-x`, `--mouse-y`, and `--glow-hue`.
 * CSS handles the gradient construction and theme-aware alpha.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Bail on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = glowRef.current;
    if (!el) return;

    // ── Mouse tracking (target stored, lerped in rAF) ──
    const target = { x: -200, y: -200 };
    const current = { x: -200, y: -200 };

    const handleMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      el.style.opacity = "1";
    };

    const handleMouseLeave = () => {
      el.style.opacity = "0";
    };

    const handleMouseEnter = () => {
      el.style.opacity = "1";
    };

    // ── Animation loop: color cycling + smooth position ──
    // Rotate through HSL hues: 0 → 360 over 7 seconds, repeating.
    let hue = 0;
    let lastTime = performance.now();

    // Lerp factor 0.08 gives a soft, floaty trailing feel
    // (lower = more lag/float, higher = snappier)
    const LERP = 0.08;

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      // Smooth position interpolation
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      el.style.setProperty("--mouse-x", `${current.x}px`);
      el.style.setProperty("--mouse-y", `${current.y}px`);

      // Color cycling
      hue = (hue + (delta * 360) / 7000) % 360;
      el.style.setProperty("--glow-hue", String(Math.round(hue)));

      rafId = requestAnimationFrame(animate);
    };

    let rafId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return <div ref={glowRef} aria-hidden="true" className="cursor-glow" />;
}
