"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// --- Lines Animation (Original) ---
const TOTAL_LINES = 36;
const CUT_LINES = 8;
const SEGMENTS = 5;

const LinesArt = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true, margin: "-100px" }}
      className="-rotate-6"
      style={{
        display: "flex",
        gap: "20px",
        height: "68px",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {Array.from({ length: TOTAL_LINES }).map((_, i) => (
        <div key={i} style={{ height: "100%" }}>
          {i < CUT_LINES ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              {Array.from({ length: SEGMENTS }).map((_, j) => (
                <div
                  key={j}
                  className="bg-muted-foreground/60"
                  style={{
                    width: "2px",
                    height: "6px",
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              className="bg-muted-foreground/60"
              style={{
                width: "2px",
                height: "100%",
              }}
            />
          )}
        </div>
      ))}
    </motion.div>
  );
};

// --- Grid Animation (from Kartik's Grid) ---
const COLUMNS = 32;
const ROWS = 4;
const CELL_SIZE = 26;

type ActiveCell = {
  id: string;
  key: number;
  delay: number;
};

const MAX_ACTIVE = 28;
const TRIM_TO = 20;
const INTERVAL = 300;

const GridArt = () => {
  const [activeCells, setActiveCells] = useState<ActiveCell[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCells((prev) => {
        let next = prev;

        if (next.length > MAX_ACTIVE) {
          next = next.slice(next.length - TRIM_TO);
        }

        const count = Math.floor(Math.random() * 4) + 2;

        for (let i = 0; i < count; i++) {
          const r = Math.floor(Math.random() * ROWS);
          const c = Math.floor(Math.random() * COLUMNS);

          next = [
            ...next,
            {
              id: `${r}-${c}`,
              key: Math.random(),
              delay: Math.random() * 0.4,
            },
          ];
        }

        return next;
      });
    }, INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const activeMap = useMemo(() => {
    const map = new Map<string, ActiveCell>();
    activeCells.forEach((cell) => map.set(cell.id, cell));
    return map;
  }, [activeCells]);

  return (
    <div className="flex justify-center items-center w-full select-none overflow-hidden py-4">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: ROWS * COLUMNS }).map((_, i) => {
          const r = Math.floor(i / COLUMNS);
          const c = i % COLUMNS;
          const id = `${r}-${c}`;
          const instance = activeMap.get(id);

          return (
            <div key={id} className="relative w-full h-full border border-foreground/5 overflow-hidden">
              <AnimatePresence>
                {instance && (
                  <motion.div
                    key={instance.key}
                    initial={{ x: "-100%", y: "-100%", opacity: 0 }}
                    animate={{
                      x: "100%",
                      y: "100%",
                      opacity: [0, 1, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.4,
                      ease: "easeInOut",
                      delay: instance.delay,
                    }}
                    className="absolute inset-0 z-10 pointer-events-none"
                  >
                    {/* Diagonal Beam */}
                    <div
                      className="absolute -top-1/2 -left-1/2 w-[250%] h-[250%] rotate-[15deg]"
                      style={{
                        background: `linear-gradient(
                          115deg,
                          transparent 0%,
                          rgba(255,255,255,0) 45%,
                          rgba(255,255,255,0.4) 50%,
                          rgba(255,255,255,0) 55%,
                          transparent 100%
                        )`,
                      }}
                    />
                    {/* Glow */}
                    <div className="absolute inset-0 bg-foreground/10 shadow-[0_0_18px_rgba(255,255,255,0.1)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Particles / Wave Animation ---
const ParticlesArt = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-24 w-full" />;

  return (
    <div className="flex justify-center items-center h-24 overflow-hidden w-full relative">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-foreground/40"
          initial={{
            x: Math.random() * 800 - 400,
            y: Math.random() * 60 - 30,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 0.8, 0],
            scale: [0, Math.random() * 1.5 + 0.5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};

// --- Main Divider Component ---
export type DividerVariant = "lines" | "grid" | "particles";

export const LinesAnimation = ({ variant = "lines" }: { variant?: DividerVariant }) => {
  return (
    <div className="border-y-2 relative border-foreground/40 border-dashed p-4 overflow-hidden my-6 md:my-10 flex items-center justify-center">
      {variant === "lines" && <LinesArt />}
      {variant === "grid" && <GridArt />}
      {variant === "particles" && <ParticlesArt />}
    </div>
  );
};
