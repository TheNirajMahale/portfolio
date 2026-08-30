"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const textOptions = [
  "Building digital products.",
  "Writing clean code.",
  "Designing robust systems.",
  "Solving hard problems.",
];

const techWords = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", 
  "AWS", "Docker", "GraphQL", "Tailwind", "Framer",
  "PostgreSQL", "MongoDB", "Redis", "Vercel", "Git"
];

// Option A: Digital Billboard (Subtle Grid + Fading Text)
export function GridOptionA() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-12 relative overflow-hidden min-h-[200px] flex items-center justify-center border-b border-border/30">
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
      
      {/* Fading text */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="relative z-10 font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground text-center px-4"
        >
          {textOptions[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// Option B: Typewriter Terminal
export function GridOptionB() {
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
    <div className="w-full py-16 flex items-center justify-center border-b border-border/30">
      <div className="font-mono text-lg sm:text-xl md:text-2xl text-foreground flex items-center min-h-[40px]">
        <span className="text-muted-foreground mr-3">{">"}</span>
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "linear", times: [0, 0.49, 0.5, 1] }}
          className="inline-block w-3 h-5 bg-foreground ml-1 -translate-y-0.5"
        />
      </div>
    </div>
  );
}

// Option C: Scattered Words Grid
export function GridOptionC() {
  const COLUMNS = typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 8;
  const ROWS = 4;
  const TOTAL_CELLS = COLUMNS * ROWS;
  
  const [activeWords, setActiveWords] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    // Fill initial words
    const map = new Map<number, string>();
    const initialCount = Math.floor(TOTAL_CELLS * 0.3);
    for (let i = 0; i < initialCount; i++) {
      let r = Math.floor(Math.random() * TOTAL_CELLS);
      while(map.has(r)) r = Math.floor(Math.random() * TOTAL_CELLS);
      const word = techWords[Math.floor(Math.random() * techWords.length)];
      map.set(r, word);
    }
    setActiveWords(map);

    const interval = setInterval(() => {
      setActiveWords((prev) => {
        const next = new Map(prev);
        // Randomly remove 1-2 words
        const keys = Array.from(next.keys());
        if (keys.length > 0) {
          const toRemove = Math.floor(Math.random() * 2) + 1;
          for (let i = 0; i < toRemove; i++) {
            if (keys.length > 0) {
              const idx = Math.floor(Math.random() * keys.length);
              next.delete(keys[idx]);
              keys.splice(idx, 1);
            }
          }
        }
        
        // Randomly add 1-2 words
        const toAdd = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < toAdd; i++) {
          let r = Math.floor(Math.random() * TOTAL_CELLS);
          if (!next.has(r)) {
            const word = techWords[Math.floor(Math.random() * techWords.length)];
            next.set(r, word);
          }
        }
        
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [TOTAL_CELLS]);

  return (
    <div className="w-full py-12 overflow-hidden border-b border-border/30">
      <div 
        className="mx-auto grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 60px)`,
          maxWidth: '900px'
        }}
      >
        {Array.from({ length: TOTAL_CELLS }).map((_, i) => {
          const word = activeWords.get(i);
          return (
            <div key={i} className="relative flex items-center justify-center border border-border/20">
              <AnimatePresence mode="wait">
                {word && (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="font-mono text-xs sm:text-sm font-medium text-muted-foreground"
                  >
                    {word}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
