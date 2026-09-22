"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { FileText, Menu, X } from "lucide-react";
import { useSound } from "@/components/providers";
import { ThemeDropdown } from "@/components/ui/theme-dropdown";
import { cn } from "@/lib/utils";
import { MobileNav } from "@/components/mobile-nav";
import siteData from "@/data/site.json";

const NAV_ITEMS = siteData.nav.items;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
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

  // Sync scrolled state with Lenis scroll
  useLenis(({ scroll }) => {
    setScrolled(scroll > 40);
  });

  // Zero-overhead IntersectionObserver scroll-spy
  useEffect(() => {
    // Initial check for non-zero scroll on page refresh
    if (typeof window !== "undefined") {
      setScrolled(window.scrollY > 40);
    }

    const sectionIds = NAV_ITEMS.map((item) => item.href.replace("/#", "").replace("#", ""));
    const visibleEntries = new Map<string, IntersectionObserverEntry>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleEntries.set(entry.target.id, entry);
          } else {
            visibleEntries.delete(entry.target.id);
          }
        });

        if (visibleEntries.size > 0) {
          const topEntry = Array.from(visibleEntries.values()).sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          )[0];
          if (topEntry && topEntry.target.id !== activeSection) {
            setActiveSection(topEntry.target.id);
          }
        }
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: [0, 0.2, 0.5],
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeSection]);

  return (
    <>
      <motion.div
        initial={false}
        animate={{ y: scrolled ? 0 : 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="print:hidden fixed left-0 right-0 top-0 z-50 w-full"
      >
        <header className="w-full border-y-2 border-dotted border-foreground/45">
        <nav className="mx-auto flex w-[95%] items-center justify-between border-x-2 border-dotted border-foreground/45 bg-foreground/5 px-6 py-4 backdrop-blur-2xl md:w-[80%] max-w-7xl">
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

            {/* Theme Dropdown (System / Light / Dark) */}
            <ThemeDropdown />

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
