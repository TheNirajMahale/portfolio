"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import siteData from "@/data/site.json";

const textOptions = siteData.terminal.quotes;

export function AnimatedGrid() {
  const [index, setIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = textOptions[index];
    let typingSpeed = 100;
    
    if (isDeleting) {
      typingSpeed = 50;
    }

    const timer = setTimeout(() => {
      if (!isDeleting && displayedText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % textOptions.length);
      } else {
        setDisplayedText((prev) => 
          isDeleting ? fullText.substring(0, prev.length - 1) : fullText.substring(0, prev.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, index]);

  return (
    <div className="w-full px-4 pt-5 pb-8 sm:pt-8 sm:pb-14 flex items-center justify-center border-b border-border/30 relative z-20">
      <div className="font-mono text-xs sm:text-base md:text-xl text-foreground flex items-center min-h-[32px] sm:min-h-[40px] text-center justify-center flex-wrap">
        <div className="mr-2 sm:mr-3 flex items-center shrink-0">
          <span className="text-green-500 dark:text-green-400">{siteData.terminal.prompt}</span>
          <span className="text-foreground">:</span>
          <span className="text-blue-500 dark:text-blue-400">~</span>
          <span className="text-foreground ml-0.5">$</span>
        </div>
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear", times: [0, 0.49, 0.5, 1] }}
          className="inline-block w-2 h-3.5 sm:w-2.5 sm:h-4.5 md:w-3 md:h-5 bg-foreground ml-1 -translate-y-0.5"
        />
      </div>
    </div>
  );
}
