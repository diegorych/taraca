"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { tourSectionContent } from "@/content/sections";

/** Misma lógica que el preview de tracklist: barrido con máscara desde abajo. */
const maskHiddenBottom = { clipPath: "inset(0 0 100% 0)" as const };
const maskVisibleFull = { clipPath: "inset(0 0 0% 0)" as const };

const maskRevealTransition = (delay: number) => ({
  duration: 0.58,
  ease: [0.22, 1, 0.36, 1] as const,
  delay,
});

export function TourHeaderBlock() {
  const headerRef = useRef<HTMLElement>(null);
  /** Observar el header entero: si la máscara está en el texto, whileInView puede no dispararse (área visible 0). */
  const headerInView = useInView(headerRef, { once: true, amount: 0.12, margin: "0px 0px -10% 0px" });

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"],
  });
  /**
   * Parallax en px (no %): translateY(%) usa la altura del propio nodo; el bloque del título
   * es bajo y quedaba ~10–15px de recorrido, casi invisible.
   */
  /** Manuscrito y flecha: mismo parallax Y (px); la flecha lleva rotate solo en el hijo. */
  const manuscriptY = useTransform(scrollYProgress, [0, 1], [-72, 72]);
  const titleRowY = useTransform(scrollYProgress, [0, 1], [-7, 7]);

  const {
    titleLine1,
    titleLine2,
    ctaLinkLabel,
    ctaAfterLine1,
    ctaAfterLine2,
    followHref,
  } = tourSectionContent;

  const linkIsExternal = /^https?:\/\//i.test(followHref);

  return (
    <header
      ref={headerRef}
      className="relative flex h-[520px] min-h-[520px] flex-col justify-end overflow-hidden bg-[#0D0D0D]"
    >
      {/* Manuscrito detrás del título */}
      <motion.div
        className="pointer-events-none absolute bottom-6 left-6 z-[4] h-[460px] w-[min(52vw,560px)] max-w-[95vw] -translate-x-[12%] -rotate-[3deg] will-change-transform sm:bottom-7 sm:left-10 sm:-translate-x-[14%] md:-translate-x-[16%] lg:bottom-0 lg:left-14 lg:w-[min(48vw,540px)] lg:-translate-x-[18%] xl:left-[max(1.5rem,calc((100vw-100rem)/2+1.5rem))]"
        style={{ y: manuscriptY }}
        aria-hidden
      >
        <img
          src="/images/lapiz-taraca.png"
          alt=""
          className="h-full w-full object-contain object-left-bottom opacity-[0.72] [filter:brightness(1.35)_contrast(1.06)]"
          loading="lazy"
        />
      </motion.div>

      {/* Flecha: mismo y que el manuscrito; contenedor sin rotate (eje Y pantalla); hijo con inclinación */}
      <motion.div
        className="pointer-events-none absolute left-[26%] top-[7%] z-[5] w-[min(72vw,720px)] max-w-[92vw] sm:left-[30%] md:left-[34%] lg:left-[30%] lg:top-[-24%] lg:w-[min(64vw,760px)]"
        style={{ y: manuscriptY }}
        aria-hidden
      >
        <div className="origin-[18%_88%] rotate-[7deg] will-change-transform md:rotate-[8deg] lg:rotate-[32deg]">
          <img
            src="/images/tour-header-flecha.png"
            alt=""
            className="h-auto w-full object-contain object-left-bottom opacity-[0.9] [filter:brightness(1.12)_contrast(1.05)]"
            loading="lazy"
          />
        </div>
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-6 pt-8 will-change-transform md:flex-row md:items-end md:justify-between md:gap-8 md:px-10 md:pb-7 md:pt-10 lg:gap-10 lg:px-14 lg:pb-8"
        style={{ y: titleRowY }}
      >
        <div className="relative z-[6] min-w-0 max-w-[min(100%,52rem)]">
          <div className="overflow-hidden">
            <motion.h2
              className="font-sans text-[clamp(2.5rem,9vw,100px)] font-bold leading-[0.88] tracking-tight text-[#D2D0CE]"
              initial={maskHiddenBottom}
              animate={headerInView ? maskVisibleFull : maskHiddenBottom}
              transition={maskRevealTransition(0.06)}
            >
              {titleLine1}
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              className="mt-0 font-sans text-[clamp(2.5rem,9vw,100px)] font-bold leading-[0.88] tracking-tight text-[#D2D0CE]"
              initial={maskHiddenBottom}
              animate={headerInView ? maskVisibleFull : maskHiddenBottom}
              transition={maskRevealTransition(0.16)}
            >
              {titleLine2}
            </motion.h2>
          </div>
        </div>

        <div className="max-w-xl overflow-hidden md:max-w-2xl lg:max-w-2xl">
          <motion.p
            className="font-sans text-xl leading-snug text-[#c8c5c0] lg:pb-1 lg:text-right"
            initial={maskHiddenBottom}
            animate={headerInView ? maskVisibleFull : maskHiddenBottom}
            transition={maskRevealTransition(0.26)}
          >
            <a
              href={followHref}
              className="font-medium text-[#e8e6e3] underline decoration-[#e8e6e3]/80 underline-offset-4 transition-colors hover:text-white"
              {...(linkIsExternal
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {ctaLinkLabel}
            </a>
            {ctaAfterLine1}
            <br />
            {ctaAfterLine2}
          </motion.p>
        </div>
      </motion.div>
    </header>
  );
}
