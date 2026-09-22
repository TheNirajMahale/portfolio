"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme, type Theme } from "@/components/providers/theme-provider";
import { useSound } from "@/components/providers";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { value: Theme; label: string; icon: typeof Monitor }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { playClick } = useSound();

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (selectedTheme: Theme, e?: React.MouseEvent) => {
    playClick();
    const origin = e ? { clientX: e.clientX, clientY: e.clientY } : undefined;
    setTheme(selectedTheme, origin);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          playClick();
          setIsOpen((prev) => !prev);
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Select theme, current theme is ${theme}`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        className={cn(
          "group relative flex h-8 w-8 items-center justify-center rounded-md border text-muted-foreground transition-all duration-150 cursor-pointer overflow-hidden",
          isOpen
            ? "border-foreground/40 bg-muted text-foreground shadow-sm"
            : "border-transparent hover:border-border/80 hover:bg-muted/70 hover:text-foreground"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === "system" && (
            <motion.span
              key="system"
              initial={{ rotate: -30, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 30, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            >
              <Monitor size={15} strokeWidth={1.75} />
            </motion.span>
          )}
          {theme === "light" && (
            <motion.span
              key="light"
              initial={{ rotate: -60, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 60, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center justify-center transition-transform duration-500 ease-out group-hover:rotate-45"
            >
              <Sun size={15} strokeWidth={1.75} />
            </motion.span>
          )}
          {theme === "dark" && (
            <motion.span
              key="dark"
              initial={{ rotate: 60, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -60, scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center justify-center transition-transform duration-300 ease-out group-hover:-rotate-12"
            >
              <Moon size={15} strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Floating Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-orientation="vertical"
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-36 origin-top-right rounded-lg border border-border/80 bg-background/95 p-1 shadow-xl shadow-black/15 backdrop-blur-xl z-50 focus:outline-none"
          >
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70 select-none">
              Appearance
            </div>
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="menuitem"
                  onClick={(e) => handleSelect(option.value, e)}
                  className={cn(
                    "group/item relative flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs font-mono transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Icon
                      size={14}
                      strokeWidth={1.75}
                      className={cn(
                        "transition-transform duration-200 group-hover/item:scale-110",
                        isSelected ? "text-foreground" : "text-muted-foreground"
                      )}
                    />
                    <span>{option.label}</span>
                  </span>

                  {isSelected && (
                    <motion.span
                      layoutId="theme-selected-check"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="text-foreground"
                    >
                      <Check size={12} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
