"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";
import { useNavbarScroll } from "@/components/providers/NavbarScrollProvider";

/** Logo e icono de menú en tracklist (fondo claro), mismo asset con tinte */
const TRACKLIST_HEADER_ACCENT = "#5F5229";

const maskContain = {
  WebkitMaskRepeat: "no-repeat" as const,
  maskRepeat: "no-repeat" as const,
  WebkitMaskPosition: "center" as const,
  maskPosition: "center" as const,
  WebkitMaskSize: "100% auto" as const,
  maskSize: "100% auto" as const,
};

export const Navbar = () => {
  const pathname = usePathname();
  const { showHeader } = useIntroSequence();
  const { tracklistFillsViewport } = useNavbarScroll();
  const isHome = pathname === "/";
  /** En home puede ocultarse hasta que termine la intro; en otras rutas siempre visible */
  const isVisible = !isHome || showHeader;
  /** Mismo logo e icono que en hero, tinte en tracklist cuando la sección llena el viewport */
  const headerIconsTracklist = isHome && tracklistFillsViewport;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[70] will-change-transform transition-transform duration-[380ms] ease-out ${
        isVisible
          ? "translate-y-0"
          : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="pointer-events-auto">
          {headerIconsTracklist ? (
            <span
              className="block h-[29px] w-[150px] max-w-full md:w-[188px]"
              style={{
                backgroundColor: TRACKLIST_HEADER_ACCENT,
                WebkitMaskImage: "url(/images/drexler-logo.svg)",
                maskImage: "url(/images/drexler-logo.svg)",
                ...maskContain,
              }}
              role="img"
              aria-label="Jorge Drexler"
            />
          ) : (
            <Image
              src="/images/drexler-logo.svg"
              alt="Jorge Drexler"
              width={188}
              height={29}
              className="h-auto w-[150px] md:w-[188px]"
              priority
            />
          )}
        </Link>

        <button
          type="button"
          aria-label="Abrir menu"
          className="pointer-events-auto inline-flex items-center justify-center"
        >
          {headerIconsTracklist ? (
            <span
              className="block h-3 w-[41px]"
              style={{
                backgroundColor: TRACKLIST_HEADER_ACCENT,
                WebkitMaskImage: "url(/images/menu-icon.svg)",
                maskImage: "url(/images/menu-icon.svg)",
                ...maskContain,
              }}
              role="img"
              aria-label="Menu"
            />
          ) : (
            <Image
              src="/images/menu-icon.svg"
              alt="Menu"
              width={41}
              height={12}
              className="h-3 w-[41px]"
              priority
            />
          )}
        </button>
      </div>
    </header>
  );
};
