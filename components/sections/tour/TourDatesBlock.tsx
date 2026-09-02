"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { EB_Garamond } from "next/font/google";
import { useLayoutEffect, useRef } from "react";
import type { TourEvent } from "@/lib/domain";
import {
  formatTourCityCountryLine,
  formatTourDateMonDDYYYY,
} from "@/lib/tour/format";

const ebGaramondBoldItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "600",
  style: "italic",
});

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function linkProps(href: string) {
  const external = /^https?:\/\//i.test(href);
  return external
    ? ({ target: "_blank" as const, rel: "noopener noreferrer" as const })
    : {};
}

type TourDateRowProps = { event: TourEvent };

function TourDateRow({ event }: TourDateRowProps) {
  const locationLine = formatTourCityCountryLine(event.city, event.countryCode);
  const dateLine = formatTourDateMonDDYYYY(event.localDate);
  const ticketHref = event.ticketUrl ?? "#";
  const rsvpHref = event.rsvpUrl ?? "#";

  return (
    <motion.li
      variants={rowVariants}
      className="grid grid-cols-1 gap-4 border-b border-white/15 py-6 text-[#9FAEBE] sm:py-7 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6 lg:gap-8"
    >
      <div className="min-w-0 md:justify-self-start">
        <p className="font-sans text-xl font-bold uppercase tracking-[0.06em] sm:text-2xl md:text-2xl 2xl:text-3xl min-[1920px]:text-4xl">
          {locationLine}
        </p>
        <p
          className={`mt-1 text-lg font-semibold sm:text-xl md:text-2xl 2xl:text-3xl min-[1920px]:text-4xl ${ebGaramondBoldItalic.className}`}
        >
          {event.venue}
        </p>
      </div>
      <p className="w-full justify-self-center text-center font-sans text-xl font-bold tabular-nums sm:text-2xl md:w-auto md:px-2 md:text-2xl 2xl:text-3xl min-[1920px]:text-4xl">
        {dateLine}
      </p>
      <div className="flex flex-wrap gap-2 justify-self-end md:justify-end">
        <a
          href={rsvpHref}
          {...linkProps(rsvpHref)}
          className="inline-flex min-h-10 min-w-[5.5rem] items-center justify-center rounded-sm bg-[#F5F0E8] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#1a1a1a] transition-opacity hover:opacity-90"
        >
          RSVP
        </a>
        <a
          href={ticketHref}
          {...linkProps(ticketHref)}
          className="inline-flex min-h-10 min-w-[5.5rem] items-center justify-center rounded-sm bg-[#F5F0E8] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#1a1a1a] transition-opacity hover:opacity-90"
        >
          Tickets
        </a>
      </div>
    </motion.li>
  );
}

/** 1920+: the dates panel stops expanding at this width and stays centered. */
const MAX_EXPANDED_PANEL_WIDTH_PX = 1850;

export function TourDatesBlock({ events }: { events: TourEvent[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const baseWidthPx = useMotionValue(0);
  const bleedLeftPx = useMotionValue(0);
  const viewportWidthPx = useMotionValue(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === "undefined") return;

    const sync = () => {
      const r = el.getBoundingClientRect();
      baseWidthPx.set(r.width);
      bleedLeftPx.set(r.left);
      viewportWidthPx.set(window.innerWidth);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [baseWidthPx, bleedLeftPx, viewportWidthPx]);

  /** whileInView en el ul falla a menudo con antepasado transform (parallax); el área visible queda en 0 u off. */
  const datesInView = useInView(sectionRef, {
    once: true,
    amount: 0.08,
    margin: "0px 0px 12% 0px",
  });

  const { scrollYProgress } = useScroll({
    target: panelRef,
    /** 0: el panel entra por abajo; 1: el borde superior llega ~12% del viewport (antes de tocar el tope). */
    offset: ["start end", "start 12%"],
  });

  const panelWidthPx = useTransform(
    [scrollYProgress, baseWidthPx, viewportWidthPx],
    ([p, bw, vw]) => {
      const bwN = Number(bw);
      const maxW = Math.min(Number(vw), MAX_EXPANDED_PANEL_WIDTH_PX);
      return bwN + Number(p) * (Math.max(maxW, bwN) - bwN);
    },
  );

  const panelMarginLeftPx = useTransform(
    [scrollYProgress, bleedLeftPx, baseWidthPx, viewportWidthPx],
    ([p, left, bw, vw]) => {
      if (Number(bw) <= 0) return 0;
      const maxW = Math.min(Number(vw), MAX_EXPANDED_PANEL_WIDTH_PX);
      const targetLeft = (Number(vw) - maxW) / 2;
      return Number(p) * (targetLeft - Number(left));
    },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip"
      aria-labelledby="gira-dates-heading"
    >
      {/* Fondo transparente: el overflow del hero (foto) se ve en este tramo; el color lo da #gira */}
      <div className="relative z-10 bg-transparent pt-12 md:pt-16 lg:pt-20">
        <div className="mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14">
          <div ref={wrapperRef} className="w-full">
            <motion.div
              ref={panelRef}
              className="relative z-20 -mt-14 overflow-hidden rounded-sm md:-mt-16 lg:-mt-20"
              style={{
                width: panelWidthPx,
                marginLeft: panelMarginLeftPx,
              }}
            >
              <div
                className="absolute inset-0 bg-fixed bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/images/bg-tour-dates.png')",
                  backgroundColor: "#152238",
                }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[#0f1a2e]/35"
                aria-hidden
              />

              <div className="relative z-10 px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
                <h3 id="gira-dates-heading" className="sr-only">
                  Fechas de la gira
                </h3>

                {events.length === 0 ? (
                  <motion.p
                    className="py-12 text-center font-sans text-base font-bold text-[#9FAEBE]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={
                      datesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                    }
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  >
                    Próximamente anunciaremos fechas. Vuelve pronto o síguenos en
                    redes.
                  </motion.p>
                ) : (
                  <motion.ul
                    className="list-none"
                    variants={listVariants}
                    initial="hidden"
                    animate={datesInView ? "visible" : "hidden"}
                  >
                    {events.map((event) => (
                      <TourDateRow key={event.id} event={event} />
                    ))}
                  </motion.ul>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div
        className="bg-white pb-12 md:pb-16 lg:pb-20"
        aria-hidden
      />
    </section>
  );
}
