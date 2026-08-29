"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";

const NAV_ITEMS = [
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#skills", label: "Skills" },
  { href: "/#education", label: "Education" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();

  // Handle scroll bounce
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Spy functionality
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" } // Trigger when a section is near the middle of the screen
    );

    const sections = NAV_ITEMS.map((item) => item.href.replace("/#", ""));
    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ y: scrolled ? 0 : 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="print:hidden fixed left-0 right-0 top-0 z-50 w-full"
      >
        <header className="w-full border-y-2 border-dashed border-foreground/40">
        <nav className="mx-auto flex w-[95%] items-center justify-between border-x-2 border-dashed border-foreground/40 bg-foreground/5 px-6 py-4 backdrop-blur-2xl md:w-[80%] max-w-7xl">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="font-mono text-lg font-bold tracking-tight text-foreground transition-colors duration-150 hover:text-muted-foreground"
          >
            N
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("/#", "");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "hidden sm:inline-flex font-mono text-xs px-3 py-2 rounded-md transition-colors duration-150 hover:bg-muted",
                    isActive
                      ? "text-foreground bg-muted font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </a>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:text-foreground hover:bg-muted"
            >
              {theme === "dark" ? (
                <Sun size={15} strokeWidth={1.5} />
              ) : (
                <Moon size={15} strokeWidth={1.5} />
              )}
            </button>

            {/* Resume link */}
            <Link
              href="/resume"
              onClick={(e) => {
                if (window.location.pathname === "/resume") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="hidden sm:inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-background ml-1"
            >
              <FileText size={13} strokeWidth={1.5} className="-translate-y-[1px]" />
              Resume
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:text-foreground hover:bg-muted ml-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X size={16} strokeWidth={1.5} />
              ) : (
                <Menu size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
        </header>

        {/* Mobile menu */}
        <MobileNav 
          isOpen={mobileOpen} 
          setIsOpen={setMobileOpen} 
          navItems={NAV_ITEMS} 
        />
      </motion.div>
    </>
  );
}
