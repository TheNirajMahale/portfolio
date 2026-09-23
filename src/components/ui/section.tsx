"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <section
      id={id}
      className={cn("w-full", className)}
    >
      {title && (
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 14 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-10 w-full items-center justify-start border-b border-border"
        >
          <h2
            className="px-4 text-xl font-bold text-foreground/90 md:px-6 md:text-2xl"
          >
            {title}
          </h2>
        </motion.div>
      )}
      <div className="px-4 py-6 md:px-6 md:py-8">
        {children}
      </div>
    </section>
  );
}
