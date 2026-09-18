"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { FileText, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme, useSound } from "@/components/providers";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";
import siteData from "@/data/site.json";

const NAV_ITEMS = siteData.nav.items;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { theme, toggleTheme } = useTheme();
  const { playClick } = useSound();
  const lenis = useLenis();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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

  // Handle scroll bounce
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll Spy functionality
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = NAV_ITEMS.map((item) => item.href.replace("/#", ""));
      let current = "";
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Trigger if section top is above middle of screen and bottom is below header
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    // Retry once after a short delay in case of slow hydration
    const timeout = setTimeout(handleScrollSpy, 500);
    handleScrollSpy();

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      clearTimeout(timeout);
    };
  }, [activeSection]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ y: scrolled ? 0 : 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="print:hidden fixed left-0 right-0 top-0 z-50 w-full"
      >
        <header className="w-full border-y-2 border-dotted border-foreground/40">
        <nav className="mx-auto flex w-[95%] items-center justify-between border-x-2 border-dotted border-foreground/40 bg-foreground/5 px-6 py-4 backdrop-blur-2xl md:w-[80%] max-w-7xl">
          {/* Logo */}
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                playClick();
                if (lenis) {
                  lenis.scrollTo(0, { duration: 1.4 });
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            }}
            className="flex items-center justify-center transition-opacity hover:opacity-80 -ml-2"
          >
            <span className="font-mono text-xl font-bold text-foreground">NM</span>
          </Link>

          {/* Desktop nav */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("/#", "");
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "relative hidden sm:inline-flex font-mono text-xs px-3 py-2 rounded-md transition-colors duration-150",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute inset-0 rounded-md bg-muted"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              );
            })}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 hover:text-foreground hover:bg-muted overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                  >
                    <Sun size={15} strokeWidth={1.5} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                  >
                    <Moon size={15} strokeWidth={1.5} />
                  </motion.span>
                )}
              </AnimatePresence>
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
              className="group hidden sm:inline-flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-background ml-1"
            >
              <FileText size={13} strokeWidth={1.5} className="-translate-y-[1px] transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" />
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
          activeSection={activeSection}
        />
      </motion.div>
    </>
  );
}
