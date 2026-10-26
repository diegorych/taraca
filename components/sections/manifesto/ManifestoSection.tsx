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
import { ManifestoWordMorph } from "./ManifestoWordMorph";
import { ClaveStaff } from "./ClaveStaff";

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

/** Párrafos a 22px; crecen recién en pantallas grandes (≥1536, ≥1920, ≥2560px). */
const manifestoParagraphSizeClass =
  "text-[22px] min-[1536px]:text-[24px] min-[1920px]:text-[26px] min-[2560px]:text-[30px]";
const numberedListNumClass =
  `shrink-0 w-8 md:w-10 pt-[0.08em] text-right font-sans font-normal tabular-nums leading-[1.5] ${manifestoParagraphSizeClass}`;
const numberedListBodyClass =
  `min-w-0 flex-1 font-sans font-normal leading-[1.5] text-[#ffffff] ${manifestoParagraphSizeClass}`;

const subtitleAlignWithListBodyClass = "pl-12 md:pl-[3.75rem]";

/** Cada definición: entrada en negrita y, en la línea siguiente, el texto (como el frame). */
const DEFINITION_1_LEAD = "Sonido del Tambor Chico:";
const DEFINITION_1_PLAIN = `${DEFINITION_1_LEAD}\nUn golpe de mano acentuado (TA) seguido de dos golpes de palo (RA-CA).`;

const DEFINITION_2_LEAD = "Aféresis de \u201cestar acá\u201d:";
const DEFINITION_2_PLAIN = `${DEFINITION_2_LEAD}\nUtilizada en la zona del Río de la Plata como expresión de ubicación inmediata.`;

/**
 * Transición tambor → «estar acá»: se van el tambor y los textos, queda sola la segunda
 * definición; «estar acá» se ilumina mientras el resto de la frase se apaga, y esas
 * palabras viajan y crecen hasta «Estar acá» del título del video (cambiando de
 * tipografía) mientras aparece el video. Después entra el resto del título y el play.
 */
const VIDEO_FADE_START_PROGRESS = 0.28;
const VIDEO_FADE_END_PROGRESS = 0.38;

/** Título, subtítulo, definición 1 y pentagrama se desvanecen (con un leve blur) uno tras otro. */
const TEXT_FADE_OUT_START = 0.3;
const TEXT_FADE_OUT_STAGGER = 0.02;
const TEXT_FADE_OUT_LENGTH = 0.08;

/** El pentagrama aparece después de las definiciones (s desde que arranca la escena). */
const CLAVE_STAFF_DELAY = 2.3;

/** En la definición 2 se apaga todo menos «estar acá», que se ilumina. */
const DEFINITION_2_HIGHLIGHT = "estar acá";
const DEF2_REST_FADE: [number, number] = [0.4, 0.5];

/** «estar acá» viaja al título mientras entra el video «estar acá». */
const HIGHLIGHT_TO_TITLE: [number, number] = [0.54, 0.68];
const SECOND_VIDEO_FADE_START = 0.54;
const SECOND_VIDEO_FADE_END = 0.7;
/** «y estar ahora» completa el título cuando la palabra ya llegó. */
const ESTAR_TITLE_REST_FADE: [number, number] = [0.64, 0.74];
const ESTAR_PLAY_BUTTON_FADE: [number, number] = [0.72, 0.8];

const ESTAR_TITLE_CLASS = "text-[clamp(2rem,6vw+1.25rem,100px)] leading-[0.95] tracking-tight";

/**
 * Escenas en reposo (progreso 0–1) donde se detiene el scroll por escenas: texto + tambor.
 * La transición a «estar acá» queda en scroll libre, al ritmo de quien scrollea.
 */
export const MANIFESTO_SCENE_STOPS = [0.2] as const;

/** Oscurecido detrás del título/botón: acompaña su entrada. */
const MANIFESTO_PLAY_OVERLAY_START = 0.62;
const MANIFESTO_PLAY_OVERLAY_END = 0.74;

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const estarTitleWordRef = useRef<HTMLSpanElement>(null);
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

  const estarVideoOpacity = useTransform(
    scrollYProgress,
    [SECOND_VIDEO_FADE_START, SECOND_VIDEO_FADE_END],
    [0, 1],
    { clamp: true },
  );

  /** Fundido de salida de la línea `index` del texto (0 = título). */
  const textFadeRange = (index: number): [number, number] => {
    const start = TEXT_FADE_OUT_START + index * TEXT_FADE_OUT_STAGGER;
    return [start, start + TEXT_FADE_OUT_LENGTH];
  };
  const titleOpacity = useTransform(scrollYProgress, textFadeRange(0), [1, 0], { clamp: true });
  const titleBlur = useTransform(scrollYProgress, textFadeRange(0), ["blur(0px)", "blur(8px)"], {
    clamp: true,
  });
  const subtitleOpacity = useTransform(scrollYProgress, textFadeRange(1), [1, 0], {
    clamp: true,
  });
  const subtitleBlur = useTransform(
    scrollYProgress,
    textFadeRange(1),
    ["blur(0px)", "blur(8px)"],
    { clamp: true },
  );
  const def1Opacity = useTransform(scrollYProgress, textFadeRange(2), [1, 0], { clamp: true });
  const def1Blur = useTransform(scrollYProgress, textFadeRange(2), ["blur(0px)", "blur(8px)"], {
    clamp: true,
  });
  const staffOpacity = useTransform(scrollYProgress, textFadeRange(3), [1, 0], { clamp: true });
  const staffBlur = useTransform(scrollYProgress, textFadeRange(3), ["blur(0px)", "blur(8px)"], {
    clamp: true,
  });
  const def2RestOpacity = useTransform(scrollYProgress, DEF2_REST_FADE, [1, 0], {
    clamp: true,
  });
  const highlightGlow = useTransform(scrollYProgress, DEF2_REST_FADE, [0, 1], { clamp: true });
  // Al empezar el viaje, la copia de ManifestoWordMorph toma el lugar de la palabra.
  const highlightStyle = {
    opacity: useTransform(scrollYProgress, (p) => (p < HIGHLIGHT_TO_TITLE[0] ? 1 : 0)),
    textShadow: useTransform(
      highlightGlow,
      (g) => `0 0 ${18 * g}px rgba(255,255,255,${0.5 * g})`,
    ),
  };

  // «Estar acá» del título aparece cuando la copia llega; el resto entra con un fade.
  const estarTitleWordOpacity = useTransform(scrollYProgress, (p) =>
    p >= HIGHLIGHT_TO_TITLE[1] ? 1 : 0,
  );
  const estarTitleRestOpacity = useTransform(scrollYProgress, ESTAR_TITLE_REST_FADE, [0, 1], {
    clamp: true,
  });
  const estarTitleRestBlur = useTransform(
    scrollYProgress,
    ESTAR_TITLE_REST_FADE,
    ["blur(12px)", "blur(0px)"],
    { clamp: true },
  );
  const estarPlayButtonOpacity = useTransform(scrollYProgress, ESTAR_PLAY_BUTTON_FADE, [0, 1], {
    clamp: true,
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
      SECOND_VIDEO_FADE_START - leadProgress,
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
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out", delay: 0.2 }
      );
      gsap.fromTo(
        ".manifesto-subtitle-text",
        { opacity: 0 },
        { opacity: 1, duration: 1.1, ease: "power2.out", delay: 0.45 }
      );
    } else {
      gsap.set(".manifesto-title-text, .manifesto-subtitle-text", { opacity: 0 });
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
          ref={sceneRef}
          className="absolute inset-0 flex items-start pt-[10vh] md:pt-[12vh]"
          style={{ opacity: sceneOpacity }}
        >
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute right-0 top-0 h-full w-[58%] overflow-hidden bg-[#0A0A0A] will-change-transform md:w-[60%]"
              style={{ opacity: tamborVideoOpacity }}
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
              style={{ opacity: estarVideoOpacity }}
            >
              <div className="relative h-full w-full overflow-hidden">
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
              </div>
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[21] bg-black"
            style={{ opacity: playBackdropOpacity }}
            aria-hidden
          />

          <div className="relative z-20 mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14">
            <div
              ref={textContainerRef}
              className="relative flex min-h-[200px] w-full flex-col justify-start text-left md:max-w-[min(40vw,34rem)] lg:max-w-[min(40vw,36rem)]"
            >
              <div className="flex flex-col items-start justify-start">
                <motion.div style={{ opacity: titleOpacity, filter: titleBlur }} className={`w-full overflow-hidden ${block1Title.wrapperClass ?? ""}`}>
                  <div className={`manifesto-title-text ${block1Title.className}`}>{block1Title.text}</div>
                </motion.div>
                <motion.div style={{ opacity: subtitleOpacity, filter: subtitleBlur }} className={`w-full overflow-hidden ${block1Subtitle.wrapperClass ?? ""}`}>
                  <div className={`manifesto-subtitle-text ${block1Subtitle.className}`}>{block1Subtitle.text}</div>
                </motion.div>
              </div>

              <div className="mt-10 flex w-full max-w-[min(100%,22rem)] flex-col gap-y-6 md:mt-12 md:max-w-[min(100%,32rem)] md:gap-y-8">
                <motion.div style={{ opacity: def1Opacity, filter: def1Blur }} className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-1"
                    num="1."
                    plainText={DEFINITION_1_PLAIN}
                    boldWord={DEFINITION_1_LEAD}
                    active={blockPhase === 1}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.2}
                  />
                </motion.div>
                <div className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-2"
                    num="2."
                    plainText={DEFINITION_2_PLAIN}
                    boldWord={DEFINITION_2_LEAD}
                    active={blockPhase === 1 && showDefinition2}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.6}
                    highlight={DEFINITION_2_HIGHLIGHT}
                    restStyle={{ opacity: def2RestOpacity }}
                    highlightStyle={highlightStyle}
                  />
                </div>
                <motion.div
                  className="w-full pl-16 md:pl-[5.5rem]"
                  style={{ opacity: staffOpacity, filter: staffBlur }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: blockPhase === 1 ? 1 : 0 }}
                    transition={{
                      duration: 1.1,
                      ease: "easeOut",
                      delay: blockPhase === 1 ? CLAVE_STAFF_DELAY : 0,
                    }}
                  >
                    <ClaveStaff playing={blockPhase === 1} className="block h-auto w-full text-white" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-4">
            <div className="flex max-w-[min(100%,56rem)] flex-col items-center text-center">
              <h2
                className={`${ebGaramondMediumItalic.className} ${ESTAR_TITLE_CLASS} text-white drop-shadow-md`}
              >
                <motion.span ref={estarTitleWordRef} style={{ opacity: estarTitleWordOpacity }}>
                  Estar acá
                </motion.span>
                <motion.span style={{ opacity: estarTitleRestOpacity, filter: estarTitleRestBlur }}>
                  {" "}y estar ahora
                </motion.span>
              </h2>
              <motion.button
                style={{ opacity: estarPlayButtonOpacity }}
                type="button"
                aria-label="Reproducir video desde el inicio"
                onClick={handleManifestoPlayClick}
                className="pointer-events-auto mt-6 flex h-[4.5rem] w-[4.5rem] cursor-pointer items-center justify-center rounded-full border-2 border-white/45 text-white/90 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white md:mt-8 md:h-24 md:w-24"
              >
                <Play className="ml-1 h-9 w-9 fill-current md:h-11 md:w-11" aria-hidden />
              </motion.button>
            </div>
          </div>

          <ManifestoWordMorph
            progress={scrollYProgress}
            range={HIGHLIGHT_TO_TITLE}
            sceneRef={sceneRef}
            sourceSelector="[data-manifesto-highlight]"
            targetRef={estarTitleWordRef}
            sourceText={DEFINITION_2_HIGHLIGHT}
            sourceClassName={`font-sans font-bold leading-[1.5] text-white ${manifestoParagraphSizeClass}`}
            targetText="Estar acá"
            targetClassName={`${ebGaramondMediumItalic.className} ${ESTAR_TITLE_CLASS} text-white drop-shadow-md`}
          />

          <EstarAcaYoutubeEmbed open={youtubeOpen} onClose={handleYoutubeClose} />
        </motion.div>
      </div>
    </section>
  );
}
