"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { FileText } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: { href: string; label: string }[];
  activeSection: string;
}

export function MobileNav({ isOpen, setIsOpen, navItems, activeSection }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 right-0 top-full z-40 border-b border-dotted border-foreground/40 bg-background/95 backdrop-blur-xl sm:hidden"
        >
          <div className="flex flex-col px-6 py-4 gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.replace("/#", "");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-mono text-sm px-3 py-2.5 rounded-md transition-colors duration-150 ${
                    isActive 
                      ? "text-foreground bg-muted font-semibold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </a>
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
              className="inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2.5 font-mono text-sm font-medium text-foreground transition-all duration-200 hover:border-foreground/20 mt-2"
            >
              <FileText size={14} strokeWidth={1.5} />
              Resume
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
