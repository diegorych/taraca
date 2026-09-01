"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { BreathingStroke } from "@/components/ui/BreathingStroke";
import { tourSectionContent } from "@/content/sections";

/** Animación: el texto sube desde abajo (100%) y aparece suavemente. */
const textHiddenBottom = { y: "100%", opacity: 0 };
const textVisibleFull = { y: "0%", opacity: 1 };

const textRevealTransition = (delay: number) => ({
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1] as const,
  delay,
});

export function TourHeaderBlock() {
  const headerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  /** Observar el contenedor del texto específicamente para que la animación se dispare cuando el texto entra en pantalla. */
  const textContainerRef = useRef<HTMLDivElement>(null);
  const textInView = useInView(textContainerRef, { once: true, amount: 0.9 });

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
  /** Figura Drexler: parallax más marcado (capa “atrás” respecto al manuscrito). */
  const drexlerY = useTransform(scrollYProgress, (p) =>
    prefersReducedMotion === true ? 0 : -110 + p * 220,
  );

  const {
    ctaLinkLabel,
    ctaAfterLine1,
    ctaAfterLine2,
    followHref,
  } = tourSectionContent;

  const linkIsExternal = /^https?:\/\//i.test(followHref);

  return (
    <header
      ref={headerRef}
      className="relative flex h-[520px] min-h-[520px] flex-col justify-end overflow-x-clip overflow-y-visible bg-[#0D0D0D]"
    >
      {/* Figura derecha: PNG con transparencia; parallax Y; el panel azul de fechas tapa la parte inferior */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex h-full items-end justify-end px-6 will-change-transform md:px-10 lg:px-14"
        style={{ y: drexlerY }}
        aria-hidden
      >
        <img
          src="/images/tour-drexler-pose.png"
          alt=""
          className="h-[700px] translate-y-[42%] object-contain object-bottom [filter:sepia(0.12)_contrast(1.05)]"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Manuscrito detrás del título */}
      <motion.div
        className="pointer-events-none absolute bottom-6 left-6 z-[4] h-[460px] w-[min(52vw,560px)] max-w-[95vw] -translate-x-[15%] -rotate-[3deg] will-change-transform md:bottom-0 md:left-10 lg:left-14"
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
        className="pointer-events-none absolute left-[25%] top-[7%] z-[5] w-[580px] max-w-[92vw] lg:top-[-32%]"
        style={{ y: manuscriptY }}
        aria-hidden
      >
        <div className="origin-[18%_88%] rotate-[7deg] will-change-transform md:rotate-[8deg] lg:rotate-[32deg]">
          <BreathingStroke>
            <img
              src="/images/tour-header-flecha.png"
              alt=""
              className="h-auto w-full object-contain object-left-bottom opacity-[0.9] [filter:brightness(1.12)_contrast(1.05)]"
              loading="lazy"
            />
          </BreathingStroke>
        </div>
      </motion.div>

      <motion.div
        ref={textContainerRef}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 pb-6 pt-8 will-change-transform md:flex-row md:items-end md:justify-between md:gap-8 md:px-10 md:pb-7 md:pt-10 lg:gap-10 lg:px-14 lg:pb-8"
        style={{ y: titleRowY }}
      >
        <div className="relative z-[6] min-w-0 max-w-[min(100%,52rem)]">
          <div className="overflow-hidden pb-2">
            <motion.h2
              className="font-serif text-[clamp(4rem,12vw,130px)] italic font-semibold leading-[0.9] tracking-tight text-white mb-4"
              initial={textHiddenBottom}
              animate={textInView ? textVisibleFull : textHiddenBottom}
              transition={textRevealTransition(0.06)}
              style={{ fontFamily: 'Garamond, "EB Garamond", "Times New Roman", serif' }}
            >
              Gira Taracá
            </motion.h2>
          </div>
          <div className="overflow-hidden pt-1">
            <motion.p
              className="mt-0 font-sans text-[24px] font-light leading-tight text-[#D2D0CE]/80"
              initial={textHiddenBottom}
              animate={textInView ? textVisibleFull : textHiddenBottom}
              transition={textRevealTransition(0.16)}
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
            >
              <a 
                href={followHref}
                target={linkIsExternal ? "_blank" : undefined}
                rel={linkIsExternal ? "noopener noreferrer" : undefined}
                className="text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                data-cursor-interactive
              >
                {ctaLinkLabel}
              </a>
              {" "}para recibir novedades sobre espectáculos y música
            </motion.p>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
