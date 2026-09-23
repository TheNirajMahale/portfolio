"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";

function LenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const targetHash = window.location.hash.replace("#", "");

    // When navigating to a hash (e.g. /resume → /#about), DON'T touch
    // Lenis here. The page component (home-client.tsx) handles hash scrolling
    // after its DOM is mounted. Any stop/resize/start here would race with it.
    if (targetHash) return;

    // Normal page navigation (no hash) — snap to top
    lenis.stop();
    lenis.scrollTo(0, { immediate: true });
    lenis.resize();
    lenis.start();
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
