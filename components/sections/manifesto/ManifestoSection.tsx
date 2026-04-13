"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
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
const TEXT_TRIGGER_PROGRESS = 0.05;

/** Video primero; el texto entra después con este retraso (s) */
const TEXT_AFTER_VIDEO_DELAY = 1.5;
const TEXT_FADE_IN_DURATION = 0.7;

const numberedListNumClass =
  "shrink-0 w-8 md:w-10 pt-[0.08em] text-right font-sans font-normal tabular-nums text-[22px] md:text-[22px] leading-[1.45]";
const numberedListBodyClass =
  "min-w-0 flex-1 font-sans text-[18px] md:text-[24px] font-normal leading-[1.45] text-[#ffffff]";

const subtitleAlignWithListBodyClass = "pl-12 md:pl-[3.75rem]";

const DEFINITION_1_PLAIN =
  "Patrón rítmico:\nSonido del Tambor Chico: un golpe de mano acentuado (TA) seguido de dos golpes de palo (RA-CA).";

const DEFINITION_2_PLAIN =
  "Localización:\nAféresis de \u201cestar acá\u201d, utilizada en la zona del Río de la Plata como expresión de ubicación inmediata.";

const TEXT_PARALLAX_START_PROGRESS = 0.82;
const TEXT_PARALLAX_END_PROGRESS = 1;
const TEXT_PARALLAX_SHIFT_PX = -30;
const VIDEO_PARALLAX_SHIFT_PX = 6;

/** El vídeo del tambor desaparece en este tramo. */
const VIDEO_FADE_START_PROGRESS = 0.48;
const VIDEO_FADE_END_PROGRESS = 0.6;

/** Tras el tambor, entra el vídeo «estar acá» (mismo asset que la sección cinemática). */
const SECOND_VIDEO_FADE_IN_START = VIDEO_FADE_END_PROGRESS;
const SECOND_VIDEO_FADE_IN_END = 0.72;

/** Tras el fade-in, la máscara (gradiente) revela el vídeo ya a ancho completo. */
const SECOND_VIDEO_EXPAND_START = SECOND_VIDEO_FADE_IN_END;
const SECOND_VIDEO_EXPAND_END = 0.96;

/** Transición suave del borde de la máscara (% del ancho del contenedor). */
const ESTAR_VIDEO_MASK_FEATHER_PCT = 20;

/** Tras la 2.ª definición: más recorrido de scroll antes del fade-out del bloque de texto. */
const MANIFESTO_TEXT_FADE_OUT_START = 0.84;
const MANIFESTO_TEXT_FADE_OUT_END = 0.92;

/** Overlay con botón play: entra cuando el texto ya terminó de desvanecerse. */
const MANIFESTO_PLAY_OVERLAY_START = 0.92;
const MANIFESTO_PLAY_OVERLAY_END = 0.985;

/** Por debajo de esto se resetea el overlay / audio del «estar acá». */
const MANIFESTO_PLAY_RESET_PROGRESS = 0.74;

const MANIFESTO_SCROLL_HEIGHT_VH = 425;

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
  /** Alineado con `w-[58%] md:w-[60%]` de la columna del tambor. */
  const estarVideoNarrowPctRef = useRef(58);
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

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      estarVideoNarrowPctRef.current = mq.matches ? 60 : 58;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
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

  const estarVideoOpacity = useTransform(
    scrollYProgress,
    [
      SECOND_VIDEO_FADE_IN_START,
      SECOND_VIDEO_FADE_IN_END,
      1,
    ],
    [0, 1, 1],
    { clamp: true },
  );

  /**
   * Vídeo a ancho completo; el scroll desplaza un borde suave (mask-image en lugar de clip-path recto).
   */
  const estarVideoMaskGradient = useTransform(scrollYProgress, (p) => {
    const narrowPct = estarVideoNarrowPctRef.current;
    const leftInsetMax = 100 - narrowPct;
    const F = ESTAR_VIDEO_MASK_FEATHER_PCT;

    const softMask = (edgePct: number) => {
      if (edgePct <= 0.25) {
        return "linear-gradient(to right, #000 0%, #000 100%)";
      }
      const fadeStart = Math.max(0, edgePct - F);
      const fadeEnd = Math.min(100, edgePct + F * 0.4);
      return `linear-gradient(to right, transparent 0%, transparent ${fadeStart}%, #000 ${fadeEnd}%, #000 100%)`;
    };

    if (prefersReducedMotion === true) {
      return "none";
    }
    if (p < SECOND_VIDEO_EXPAND_START) {
      return softMask(leftInsetMax);
    }
    if (p >= SECOND_VIDEO_EXPAND_END) {
      return "none";
    }
    const t =
      (p - SECOND_VIDEO_EXPAND_START) /
      (SECOND_VIDEO_EXPAND_END - SECOND_VIDEO_EXPAND_START);
    const edge = leftInsetMax * (1 - t);
    return softMask(edge);
  });

  const textBlockScrollOpacity = useTransform(scrollYProgress, (p) => {
    if (p < MANIFESTO_TEXT_FADE_OUT_START) return 1;
    if (prefersReducedMotion === true) {
      return p >= MANIFESTO_TEXT_FADE_OUT_END ? 0 : 1;
    }
    if (p >= MANIFESTO_TEXT_FADE_OUT_END) return 0;
    return (
      1 -
      (p - MANIFESTO_TEXT_FADE_OUT_START) /
        (MANIFESTO_TEXT_FADE_OUT_END - MANIFESTO_TEXT_FADE_OUT_START)
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
    [TEXT_PARALLAX_START_PROGRESS, TEXT_PARALLAX_END_PROGRESS],
    [0, TEXT_PARALLAX_SHIFT_PX],
    { clamp: true },
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
    setShowDefinition2(progress >= SECOND_VIDEO_FADE_IN_END - 0.04);

    const rangePx = manifestoScrollRangePxRef.current;
    const leadProgress = Math.min(
      ESTAR_VIDEO_PLAY_LEAD_PROGRESS_CAP,
      (ESTAR_VIDEO_PLAY_PREROLL_MS / 1000) *
        ESTAR_VIDEO_ASSUMED_SCROLL_PX_PER_SEC /
        rangePx,
    );
    const estarPlayProgress = Math.max(
      VIDEO_FADE_START_PROGRESS + 0.04,
      SECOND_VIDEO_FADE_IN_START - leadProgress,
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

  const titleDelay = TEXT_AFTER_VIDEO_DELAY;
  const blockGapS = 0.45;
  const subtitleDelay = titleDelay + 0.45;
  const def1Delay = subtitleDelay + blockGapS;
  const def2Delay = 0.04;

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
              className="absolute inset-x-0 top-0 z-[11] h-full w-full overflow-hidden"
              style={{
                opacity: estarVideoOpacity,
                y: videoParallaxY,
              }}
            >
              <motion.div
                className="relative h-full w-full will-change-[mask-image]"
                style={{
                  maskImage: estarVideoMaskGradient,
                  WebkitMaskImage: estarVideoMaskGradient,
                  maskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
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
              className="relative flex min-h-[200px] w-full flex-col justify-start text-left will-change-transform md:max-w-[min(40vw,34rem)] lg:max-w-[min(40vw,36rem)]"
              style={{ y: textBlockY, opacity: textBlockScrollOpacity }}
            >
              <motion.div className="flex flex-col items-start justify-start">
                <motion.div
                  className={`w-full ${block1Title.wrapperClass ?? ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scene1Active ? 1 : 0 }}
                  transition={{
                    duration: TEXT_FADE_IN_DURATION,
                    ease: "easeOut",
                    delay: titleDelay,
                  }}
                >
                  <div className={block1Title.className}>{block1Title.text}</div>
                </motion.div>
                <motion.div
                  className={`w-full ${block1Subtitle.wrapperClass ?? ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: scene1Active ? 1 : 0 }}
                  transition={{
                    duration: TEXT_FADE_IN_DURATION,
                    ease: "easeOut",
                    delay: subtitleDelay,
                  }}
                >
                  <div className={block1Subtitle.className}>{block1Subtitle.text}</div>
                </motion.div>
              </motion.div>

              <motion.div className="mt-10 flex w-full flex-col gap-y-6 md:mt-12 md:gap-y-8">
                <div className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-1"
                    num="1."
                    plainText={DEFINITION_1_PLAIN}
                    boldWord="Patrón rítmico:"
                    active={blockPhase === 1}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={def1Delay}
                  />
                </div>
                <div className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-2"
                    num="2."
                    plainText={DEFINITION_2_PLAIN}
                    boldWord="Localización:"
                    active={blockPhase === 1 && showDefinition2}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={def2Delay}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-4"
            style={{ opacity: playOverlayOpacity }}
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
