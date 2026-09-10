"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function LenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      // 1. Stop any residual scroll inertia from the previous page
      lenis.stop();
      // 2. Instantly snap virtual scroll to top (0px) without animation lag
      lenis.scrollTo(0, { immediate: true });
      // 3. Force Lenis to recalculate document dimensions for the new page layout
      lenis.resize();
      // 4. Resume smooth scrolling for the new page
      lenis.start();
    }
    // 5. Reset native browser window scroll coordinate
    window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <LenisRouteHandler />
      {children}
    </ReactLenis>
  );
}
