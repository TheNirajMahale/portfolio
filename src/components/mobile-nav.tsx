"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { FileText } from "lucide-react";
import { useLenis } from "lenis/react";
import { useSound } from "@/components/providers";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: { href: string; label: string }[];
  activeSection: string;
}

export function MobileNav({ isOpen, setIsOpen, navItems, activeSection }: MobileNavProps) {
  const lenis = useLenis();
  const { playClick } = useSound();

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false);
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace("/#", "").replace("#", "");
      if (window.location.pathname === "/") {
        e.preventDefault();
        playClick();
        if (lenis) {
          lenis.scrollTo(`#${targetId}`, { offset: -90, duration: 1.4 });
        } else {
          const element = document.getElementById(targetId);
          if (element) {
            const top = element.getBoundingClientRect().top + window.scrollY - 90;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
        window.history.pushState(null, "", `#${targetId}`);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="mx-auto w-[95%] max-w-7xl border-x-2 border-b-2 border-dotted border-foreground/45 bg-background/98 backdrop-blur-2xl sm:hidden shadow-2xl shadow-black/20"
        >
          <div className="flex flex-col px-4 py-3 gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("/#", "");
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className={cn(
                    "font-mono text-xs px-3 py-2 rounded-md transition-colors duration-150 flex items-center justify-between",
                    isActive
                      ? "text-foreground bg-muted border border-border font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  )}
                </Link>
              );
            })}
            <Link
              href="/resume"
              onClick={(e) => {
                setIsOpen(false);
                if (window.location.pathname === "/resume") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-muted/70 px-3 py-2 font-mono text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground/40 hover:bg-background mt-1.5"
            >
              <FileText size={13} strokeWidth={1.5} />
              <span>Resume</span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
