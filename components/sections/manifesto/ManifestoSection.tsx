"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { EB_Garamond } from "next/font/google";
import { Play } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { EstarAcaYoutubeEmbed } from "@/components/features/EstarAcaYoutubeEmbed";
import { ManifestoDefinitionListItem } from "./ManifestoDefinitionListItem";

const ebGaramondMediumItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

/** Al pasar este progreso, arranca el bloque (texto + video del tambor). */
const TEXT_TRIGGER_PROGRESS = 0.04;

/** Video primero; el texto entra después con este retraso (s) */
const TEXT_AFTER_VIDEO_DELAY = 1.5;
const TEXT_FADE_IN_DURATION = 0.7;

const numberedListNumClass =
  "shrink-0 w-8 md:w-10 pt-[0.08em] text-right font-sans font-normal tabular-nums text-[20px] leading-[1.45]";
const numberedListBodyClass =
  "min-w-0 flex-1 font-sans text-[22px] md:text-[24px] font-normal leading-[1.35] text-[#ffffff]";

const subtitleAlignWithListBodyClass = "pl-12 md:pl-[3.75rem]";

const DEFINITION_1_PLAIN =
  "Sonido del Tambor Chico: un golpe de mano acentuado (TA) seguido de dos golpes de palo (RA-CA).";

const DEFINITION_2_PLAIN =
  "Aféresis de \u201cestar acá\u201d, utilizada en la zona del Río de la Plata como expresión de ubicación inmediata.";

const TEXT_PARALLAX_START_PROGRESS = 0.0;
const TEXT_PARALLAX_END_PROGRESS = 0.85;
const TEXT_PARALLAX_SHIFT_PX = -30;
const VIDEO_PARALLAX_SHIFT_PX = 6;

/** El vídeo del tambor desaparece en este tramo. */
const VIDEO_FADE_START_PROGRESS = 0.35;
const VIDEO_FADE_END_PROGRESS = 0.45;

/** El texto se va hacia arriba y desaparece. */
const MANIFESTO_TEXT_SCROLL_UP_START = 0.45;
const MANIFESTO_TEXT_SCROLL_UP_END = 0.75;
const MANIFESTO_TEXT_SHIFT_PX = -1000;

/** Tras el tambor, entra el vídeo «estar acá» desde abajo. */
const SECOND_VIDEO_SLIDE_START = 0.45;
const SECOND_VIDEO_SLIDE_END = 0.65;

/** El vídeo «estar acá» escala de 90% a 100%. Empieza antes de aparecer. */
const SECOND_VIDEO_SCALE_START = 0.35;
const SECOND_VIDEO_SCALE_END = 0.80;

/** Overlay con botón play: entra cuando el texto ya terminó de desvanecerse y el video escaló. */
const MANIFESTO_PLAY_OVERLAY_START = 0.80;
const MANIFESTO_PLAY_OVERLAY_END = 0.90;

/** Por debajo de esto se resetea el overlay / audio del «estar acá». */
const MANIFESTO_PLAY_RESET_PROGRESS = 0.40;

const MANIFESTO_SCROLL_HEIGHT_VH = 300;

/** Anticipar reproducción ~1s antes del fade-in (mapeado scroll ≈ px/s sobre el tramo del manifiesto). */
const ESTAR_VIDEO_PLAY_PREROLL_MS = 1000;
const ESTAR_VIDEO_ASSUMED_SCROLL_PX_PER_SEC = 480;
/** Tope de adelanto en progreso 0–1 para no solaparse con el tambor. */
const ESTAR_VIDEO_PLAY_LEAD_PROGRESS_CAP = 0.055;

const SECOND_VIDEO_SRC = "/video/estar-aca-corto.mov";

export function ManifestoSection() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [blockPhase, setBlockPhase] = useState<0 | 1>(0);
  const [showDefinition2, setShowDefinition2] = useState(false);
  const estarVideoRef = useRef<HTMLVideoElement>(null);
  const estarVideoStartedRef = useRef(false);
  const playOverlayDismissed = useMotionValue(0);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  /** ~px recorridos en el eje de scroll para progress 0→1 (offset start/end del manifiesto). */
  const manifestoScrollRangePxRef = useRef(8000);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;
    const syncRange = () => {
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      manifestoScrollRangePxRef.current = Math.max(400, h - vh);
    };
    syncRange();
    const ro = new ResizeObserver(syncRange);
    ro.observe(el);
    window.addEventListener("resize", syncRange);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncRange);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const sceneOpacity = useTransform(
    scrollYProgress,
    [0, TEXT_TRIGGER_PROGRESS, 1],
    [0, 1, 1],
    { clamp: true },
  );

  const tamborVideoOpacity = useTransform(
    scrollYProgress,
    [
      0,
      TEXT_TRIGGER_PROGRESS,
      VIDEO_FADE_START_PROGRESS,
      VIDEO_FADE_END_PROGRESS,
    ],
    [0, 1, 1, 0],
    { clamp: true },
  );

  const estarVideoY = useTransform(
    scrollYProgress,
    [SECOND_VIDEO_SLIDE_START, SECOND_VIDEO_SLIDE_END],
    ["100%", "0%"],
    { clamp: true }
  );

  const estarVideoScale = useTransform(
    scrollYProgress,
    [SECOND_VIDEO_SCALE_START, SECOND_VIDEO_SCALE_END],
    [0.9, 1],
    { clamp: true }
  );

  const estarVideoRadius = useTransform(
    scrollYProgress,
    [SECOND_VIDEO_SCALE_START, SECOND_VIDEO_SCALE_END],
    ["2rem", "0rem"],
    { clamp: true }
  );

  const textBlockScrollOpacity = useTransform(scrollYProgress, (p) => {
    if (p < MANIFESTO_TEXT_SCROLL_UP_START) return 1;
    if (prefersReducedMotion === true) {
      return p >= MANIFESTO_TEXT_SCROLL_UP_END ? 0 : 1;
    }
    if (p >= MANIFESTO_TEXT_SCROLL_UP_END) return 0;
    return (
      1 -
      (p - MANIFESTO_TEXT_SCROLL_UP_START) /
        (MANIFESTO_TEXT_SCROLL_UP_END - MANIFESTO_TEXT_SCROLL_UP_START)
    );
  });

  const playOverlayOpacity = useTransform(
    [scrollYProgress, playOverlayDismissed],
    ([pIn, dismissedIn]) => {
      const p = pIn as number;
      const dismissed = dismissedIn as number;
      if (dismissed > 0.5) return 0;
      if (p < MANIFESTO_PLAY_OVERLAY_START) return 0;
      if (prefersReducedMotion === true) {
        return p >= MANIFESTO_PLAY_OVERLAY_START ? 1 : 0;
      }
      if (p >= MANIFESTO_PLAY_OVERLAY_END) return 1;
      return (
        (p - MANIFESTO_PLAY_OVERLAY_START) /
        (MANIFESTO_PLAY_OVERLAY_END - MANIFESTO_PLAY_OVERLAY_START)
      );
    },
  );

  const playBackdropOpacity = useTransform(playOverlayOpacity, (o) => o * 0.35);

  const textBlockY = useTransform(
    scrollYProgress,
    [MANIFESTO_TEXT_SCROLL_UP_START, MANIFESTO_TEXT_SCROLL_UP_END],
    [0, MANIFESTO_TEXT_SHIFT_PX],
    { clamp: true },
  );

  const titleParallaxY = useTransform(
    scrollYProgress,
    [MANIFESTO_TEXT_SCROLL_UP_START, MANIFESTO_TEXT_SCROLL_UP_END],
    [0, MANIFESTO_TEXT_SHIFT_PX * 1.08],
    { clamp: true }
  );

  const subtitleParallaxY = useTransform(
    scrollYProgress,
    [MANIFESTO_TEXT_SCROLL_UP_START, MANIFESTO_TEXT_SCROLL_UP_END],
    [0, MANIFESTO_TEXT_SHIFT_PX * 1.04],
    { clamp: true }
  );

  const def1ParallaxY = useTransform(
    scrollYProgress,
    [MANIFESTO_TEXT_SCROLL_UP_START, MANIFESTO_TEXT_SCROLL_UP_END],
    [0, MANIFESTO_TEXT_SHIFT_PX * 0.96],
    { clamp: true }
  );

  const def2ParallaxY = useTransform(
    scrollYProgress,
    [MANIFESTO_TEXT_SCROLL_UP_START, MANIFESTO_TEXT_SCROLL_UP_END],
    [0, MANIFESTO_TEXT_SHIFT_PX * 0.92],
    { clamp: true }
  );

  const videoParallaxY = useTransform(
    scrollYProgress,
    [TEXT_PARALLAX_START_PROGRESS, VIDEO_FADE_END_PROGRESS],
    [0, VIDEO_PARALLAX_SHIFT_PX],
    { clamp: true },
  );

  const applyScrollPhase = useCallback((progress: number) => {
    if (progress < MANIFESTO_PLAY_RESET_PROGRESS) {
      playOverlayDismissed.set(0);
      setYoutubeOpen(false);
      const vMuted = estarVideoRef.current;
      if (vMuted) vMuted.muted = true;
    }

    if (progress < TEXT_TRIGGER_PROGRESS) {
      setBlockPhase(0);
    } else {
      setBlockPhase(1);
    }
    // Mostramos la segunda definición al mismo tiempo que el resto del bloque
    setShowDefinition2(progress >= TEXT_TRIGGER_PROGRESS);

    const rangePx = manifestoScrollRangePxRef.current;
    const leadProgress = Math.min(
      ESTAR_VIDEO_PLAY_LEAD_PROGRESS_CAP,
      (ESTAR_VIDEO_PLAY_PREROLL_MS / 1000) *
        ESTAR_VIDEO_ASSUMED_SCROLL_PX_PER_SEC /
        rangePx,
    );
    const estarPlayProgress = Math.max(
      VIDEO_FADE_START_PROGRESS + 0.04,
      SECOND_VIDEO_SLIDE_START - leadProgress,
    );
    const estarHysteresis = Math.max(0.01, leadProgress * 0.35);

    if (progress < estarPlayProgress - estarHysteresis) {
      estarVideoStartedRef.current = false;
      const v = estarVideoRef.current;
      if (v) {
        v.pause();
        v.currentTime = 0;
      }
      return;
    }
    if (progress >= estarPlayProgress && !estarVideoStartedRef.current) {
      const v = estarVideoRef.current;
      if (!v) return;
      estarVideoStartedRef.current = true;
      v.muted = true;
      void v.play().catch(() => {});
    }
  }, []);

  const handleManifestoPlayClick = useCallback(() => {
    playOverlayDismissed.set(1);
    const v = estarVideoRef.current;
    if (v) {
      v.pause();
      v.muted = true;
    }
    setYoutubeOpen(true);
  }, []);

  const handleYoutubeClose = useCallback(() => {
    setYoutubeOpen(false);
    playOverlayDismissed.set(0);
    const v = estarVideoRef.current;
    if (v) {
      v.muted = true;
      void v.play().catch(() => {});
    }
  }, []);

  useLayoutEffect(() => {
    applyScrollPhase(scrollYProgress.get());
  }, [scrollYProgress, applyScrollPhase]);

  useMotionValueEvent(scrollYProgress, "change", applyScrollPhase);

  const block1Title = {
    key: "title1",
    text: "taracá",
    className:
      "font-sans font-bold text-[48px] md:text-[70px] text-[#ffffff] leading-[0.95] tracking-tight",
    wrapperClass: "mb-1",
  };

  const block1Subtitle = {
    key: "subtitle1",
    text: "onomatopeya, aféresis",
    className: `${ebGaramondMediumItalic.className} text-[20px] md:text-[32px] text-[#ffffff] leading-tight`,
    wrapperClass: `mb-0 ${subtitleAlignWithListBodyClass}`,
  };

  const scene1Active = blockPhase === 1;

  const textContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (scene1Active) {
      gsap.fromTo(
        ".manifesto-title-text",
        { y: "100%" },
        { y: "0%", duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".manifesto-subtitle-text",
        { y: "100%" },
        { y: "0%", duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
    } else {
      gsap.set(".manifesto-title-text, .manifesto-subtitle-text", { y: "100%" });
    }
  }, { dependencies: [scene1Active], scope: textContainerRef });

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative z-10 bg-[#0A0A0A]"
      style={{ minHeight: `${MANIFESTO_SCROLL_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-start overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-start pt-[10vh] md:pt-[12vh]"
          style={{ opacity: sceneOpacity }}
        >
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute right-0 top-0 h-full w-[58%] overflow-hidden bg-[#0A0A0A] will-change-transform md:w-[60%]"
              style={{ opacity: tamborVideoOpacity, y: videoParallaxY }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none block h-full w-full bg-[#0A0A0A] object-cover object-center [transform:translateZ(0)_scale3d(-1.04,1.04,1)]"
              >
                <source src="/video/manifiesto.mov" type="video/quicktime" />
                <source src="/video/manifiesto.mov" type="video/mp4" />
              </video>
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
            </motion.div>

            <motion.div
              className="absolute inset-x-0 top-0 z-[11] h-full w-full overflow-hidden flex items-center justify-center"
              style={{
                y: estarVideoY,
              }}
            >
              <motion.div
                className="relative h-full w-full overflow-hidden"
                style={{
                  scale: estarVideoScale,
                  borderRadius: estarVideoRadius,
                  transformOrigin: "center center",
                }}
              >
                <video
                  ref={estarVideoRef}
                  className="pointer-events-none block h-full w-full object-cover object-center"
                  src={SECOND_VIDEO_SRC}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-[#0A0A0A] via-transparent to-transparent" />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[21] bg-black"
            style={{ opacity: playBackdropOpacity }}
            aria-hidden
          />

          <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14">
            <motion.div
              ref={textContainerRef}
              className="relative flex min-h-[200px] w-full flex-col justify-start text-left will-change-transform md:max-w-[min(40vw,34rem)] lg:max-w-[min(40vw,36rem)]"
              style={{ opacity: textBlockScrollOpacity }}
            >
              <div className="flex flex-col items-start justify-start">
                <motion.div style={{ y: titleParallaxY }} className={`w-full overflow-hidden ${block1Title.wrapperClass ?? ""}`}>
                  <div className={`manifesto-title-text will-change-transform ${block1Title.className}`}>{block1Title.text}</div>
                </motion.div>
                <motion.div style={{ y: subtitleParallaxY }} className={`w-full overflow-hidden ${block1Subtitle.wrapperClass ?? ""}`}>
                  <div className={`manifesto-subtitle-text will-change-transform ${block1Subtitle.className}`}>{block1Subtitle.text}</div>
                </motion.div>
              </div>

              <div className="mt-10 flex w-full max-w-[min(100%,22rem)] flex-col gap-y-6 md:mt-12 md:max-w-[min(100%,32rem)] md:gap-y-8">
                <motion.div style={{ y: def1ParallaxY }} className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-1"
                    num="1."
                    plainText={DEFINITION_1_PLAIN}
                    boldWord=""
                    active={blockPhase === 1}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.2}
                  />
                </motion.div>
                <motion.div style={{ y: def2ParallaxY }} className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-2"
                    num="2."
                    plainText={DEFINITION_2_PLAIN}
                    boldWord=""
                    active={blockPhase === 1 && showDefinition2}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.6}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-4"
            style={{ y: estarVideoY }}
          >
            <div className="flex max-w-[min(100%,56rem)] flex-col items-center text-center">
              <h2
                className={`${ebGaramondMediumItalic.className} text-[clamp(2rem,6vw+1.25rem,100px)] leading-[0.95] tracking-tight text-white drop-shadow-md`}
              >
                Estar acá y estar ahora
              </h2>
              <button
                type="button"
                aria-label="Reproducir video desde el inicio"
                onClick={handleManifestoPlayClick}
                className="pointer-events-auto mt-6 flex h-[4.5rem] w-[4.5rem] cursor-pointer items-center justify-center rounded-full border-2 border-white/45 text-white/90 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white md:mt-8 md:h-24 md:w-24"
              >
                <Play className="ml-1 h-9 w-9 fill-current md:h-11 md:w-11" aria-hidden />
              </button>
            </div>
          </motion.div>

          <EstarAcaYoutubeEmbed open={youtubeOpen} onClose={handleYoutubeClose} />
        </motion.div>
      </div>
    </section>
  );
}
