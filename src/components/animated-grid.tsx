"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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

export function AnimatedGrid() {
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

  // O(1) lookup for active cells
  const activeMap = useMemo(() => {
    const map = new Map<string, ActiveCell>();
    activeCells.forEach((cell) => map.set(cell.id, cell));
    return map;
  }, [activeCells]);

  return (
    <div className="w-full overflow-hidden py-6">
      <div
        className="mx-auto grid"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${CELL_SIZE}px)`,
          width: `${COLUMNS * CELL_SIZE}px`,
          gap: "1px",
        }}
      >
        {Array.from({ length: ROWS * COLUMNS }, (_, i) => {
          const r = Math.floor(i / COLUMNS);
          const c = i % COLUMNS;
          const cellId = `${r}-${c}`;
          const active = activeMap.get(cellId);

          return (
            <div
              key={cellId}
              className="relative border border-border/30"
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            >
              <AnimatePresence>
                {active && (
                  <motion.div
                    key={active.key}
                    className="absolute inset-0 grid-cell-active"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: active.delay,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
