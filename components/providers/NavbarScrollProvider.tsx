"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

interface NavbarScrollContextValue {
  /** Ref compartida con TracklistSection (scroll + detección viewport para el header) */
  tracklistSectionRef: RefObject<HTMLElement | null>;
  /** La tracklist cubre toda la altura del viewport */
  tracklistFillsViewport: boolean;
  /** Llamar al montar TracklistSection para enganchar listeners si el primer layout aún no veía la ref */
  markTracklistMounted: () => void;
}

const NavbarScrollContext = createContext<NavbarScrollContextValue | null>(null);

function sectionFillsViewportHeight(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top <= 1 && rect.bottom >= vh - 1;
}

export function NavbarScrollProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const tracklistSectionRef = useRef<HTMLElement | null>(null);
  const [tracklistLayoutToken, setTracklistLayoutToken] = useState(0);
  const [tracklistFillsViewport, setTracklistFillsViewport] = useState(false);

  const markTracklistMounted = useCallback(() => {
    setTracklistLayoutToken((t) => t + 1);
  }, []);

  useLayoutEffect(() => {
    if (!isHome) {
      return;
    }

    const el = tracklistSectionRef.current;
    if (!el) {
      return;
    }

    const update = () => {
      setTracklistFillsViewport(sectionFillsViewportHeight(el));
    };

    const raf = requestAnimationFrame(() => update());

    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update);

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      document.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [isHome, pathname, tracklistLayoutToken]);

  const value = useMemo(
    () => ({
      tracklistSectionRef,
      tracklistFillsViewport,
      markTracklistMounted,
    }),
    [tracklistFillsViewport, markTracklistMounted],
  );

  return (
    <NavbarScrollContext.Provider value={value}>
      {children}
    </NavbarScrollContext.Provider>
  );
}

export function useNavbarScroll() {
  const ctx = useContext(NavbarScrollContext);
  if (!ctx) {
    throw new Error("useNavbarScroll must be used within NavbarScrollProvider");
  }
  return ctx;
}
