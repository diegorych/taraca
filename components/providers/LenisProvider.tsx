"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

/** Instancia de Lenis (null hasta que se monta). */
export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      duration: 2.4,
      easing: (t) => 1 - Math.pow(1 - t, 4), // easeOutQuart - smoother deceleration
      wheelMultiplier: 2,
      touchMultiplier: 2,
    });
    // Se publica en un callback (no sincrónico en el efecto) para no encadenar renders.
    const frame = requestAnimationFrame(() => setLenis(instance));

    return () => {
      cancelAnimationFrame(frame);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
