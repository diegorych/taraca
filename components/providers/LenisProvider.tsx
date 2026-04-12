"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 2.4,
      easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart - smoother deceleration
      wheelMultiplier: 2,
      touchMultiplier: 2,
    });

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
