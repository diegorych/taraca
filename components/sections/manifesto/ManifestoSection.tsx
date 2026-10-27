"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { EB_Garamond } from "next/font/google";
import { Play } from "lucide-react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { EstarAcaYoutubeEmbed } from "@/components/features/EstarAcaYoutubeEmbed";
import { ManifestoDefinitionListItem } from "./ManifestoDefinitionListItem";
import { ClaveStaff } from "./ClaveStaff";

const ebGaramondMediumItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

const MANIFESTO_SCROLL_HEIGHT_VH = 350;
/** Recorrido de scroll de la sección (vh): su alto menos la pantalla fija. */
const MANIFESTO_RANGE_VH = MANIFESTO_SCROLL_HEIGHT_VH - 100;
/** La línea de tiempo se escribe en vh de scroll dentro de la sección → progreso 0–1. */
const at = (scrollVh: number) => scrollVh / MANIFESTO_RANGE_VH;
const span = (fromVh: number, toVh: number): [number, number] => [at(fromVh), at(toVh)];

/** Al pasar este punto se monta el bloque y aparece el video del tambor. */
const TEXT_TRIGGER_PROGRESS = at(8);

/**
 * Entrada con el scroll, un elemento por vez: título (y subtítulo), definición 1,
 * definición 2 y pentagrama, cada uno con un fade y un leve blur. Después la escena
 * queda quieta hasta que empieza la salida.
 */
const TITLE_FADE_IN = span(6, 22);
const SUBTITLE_FADE_IN = span(12, 28);
const DEF1_FADE_IN = span(26, 44);
const DEF2_FADE_IN = span(42, 60);
const STAFF_FADE_IN = span(58, 76);

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
 * Transición al video «estar acá» como un scroll normal: el video sube desde abajo a la
 * misma velocidad que el scroll (cubre la pantalla en exactamente 100vh). Para que se
 * sienta natural y con profundidad, el manifiesto sube más lento por detrás (parallax) y
 * se oscurece de a poco, el borde del video proyecta una sombra suave y la imagen dentro
 * del video sube un poco más lento que su marco.
 */
const ESTAR_RISE = span(100, 200);
/** Cuánto sube el manifiesto mientras lo tapa el video (vh) y cuánto se oscurece. */
const MANIFESTO_PARALLAX_VH = 28;
const MANIFESTO_DIM_MAX = 0.6;
/** Desfase de la imagen dentro del video al entrar (vh): se acomoda al llegar arriba. */
const ESTAR_INNER_PARALLAX_VH = 12;

/** Con el video ya arriba: título y botón de play. */
const ESTAR_TITLE_FADE = span(184, 204);
const ESTAR_PLAY_BUTTON_FADE = span(196, 214);

const ESTAR_TITLE_CLASS = "text-[clamp(2rem,6vw+1.25rem,100px)] leading-[0.95] tracking-tight";

/** Oscurecido detrás del título/botón: acompaña su entrada. */
const MANIFESTO_PLAY_OVERLAY_START = at(186);
const MANIFESTO_PLAY_OVERLAY_END = at(208);

/** Por debajo de esto se resetea el overlay / audio del «estar acá». */
const MANIFESTO_PLAY_RESET_PROGRESS = ESTAR_RISE[0];

/** Anticipar reproducción ~1s antes del fade-in (mapeado scroll ≈ px/s sobre el tramo del manifiesto). */
const ESTAR_VIDEO_PLAY_PREROLL_MS = 1000;
const ESTAR_VIDEO_ASSUMED_SCROLL_PX_PER_SEC = 480;
/** Tope de adelanto en progreso 0–1 (arranca un poco antes de asomar). */
const ESTAR_VIDEO_PLAY_LEAD_PROGRESS_CAP = at(11);

const SECOND_VIDEO_SRC = "/video/estar-aca-corto.mov";

/** Opacidad + blur atados al scroll: el elemento aparece a lo largo de `fadeIn`. */
function useScrollFadeIn(progress: MotionValue<number>, fadeIn: [number, number]) {
  return {
    opacity: useTransform(progress, fadeIn, [0, 1], { clamp: true }),
    filter: useTransform(progress, fadeIn, ["blur(8px)", "blur(0px)"], { clamp: true }),
  };
}

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

  const tamborVideoOpacity = useTransform(scrollYProgress, [0, TEXT_TRIGGER_PROGRESS], [0, 1], {
    clamp: true,
  });

  // Subida del video «estar acá»: lineal, 1:1 con el scroll.
  const estarRiseY = useTransform(scrollYProgress, ESTAR_RISE, ["100vh", "0vh"], { clamp: true });
  const estarInnerY = useTransform(
    scrollYProgress,
    ESTAR_RISE,
    ["0vh", `${ESTAR_INNER_PARALLAX_VH}vh`],
    { clamp: true },
  );
  const manifestoContentY = useTransform(
    scrollYProgress,
    ESTAR_RISE,
    ["0vh", `-${MANIFESTO_PARALLAX_VH}vh`],
    { clamp: true },
  );
  const manifestoDim = useTransform(scrollYProgress, ESTAR_RISE, [0, MANIFESTO_DIM_MAX], {
    clamp: true,
  });

  const titleStyle = useScrollFadeIn(scrollYProgress, TITLE_FADE_IN);
  const subtitleStyle = useScrollFadeIn(scrollYProgress, SUBTITLE_FADE_IN);
  const def1Style = useScrollFadeIn(scrollYProgress, DEF1_FADE_IN);
  const def2Style = useScrollFadeIn(scrollYProgress, DEF2_FADE_IN);
  const staffStyle = useScrollFadeIn(scrollYProgress, STAFF_FADE_IN);
  const estarTitleStyle = useScrollFadeIn(scrollYProgress, ESTAR_TITLE_FADE);
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
    const estarPlayProgress = Math.max(TEXT_TRIGGER_PROGRESS, ESTAR_RISE[0] - leadProgress);
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
              style={{ opacity: tamborVideoOpacity, y: manifestoContentY }}
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

            {/* Video «estar acá»: sube desde abajo con el scroll, por encima del manifiesto. */}
            <motion.div className="absolute inset-0 z-[22]" style={{ y: estarRiseY }}>
              {/* Sombra suave que el borde del video proyecta sobre lo que tapa */}
              <div className="absolute inset-x-0 bottom-full h-[18vh] bg-gradient-to-b from-transparent to-black/55" />
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute inset-x-0"
                  style={{
                    top: `-${ESTAR_INNER_PARALLAX_VH}vh`,
                    height: `calc(100% + ${ESTAR_INNER_PARALLAX_VH}vh)`,
                    y: estarInnerY,
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
              </div>
            </motion.div>
          </div>

          {/* El manifiesto se oscurece de a poco mientras el video lo tapa */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[21] bg-[#0A0A0A]"
            style={{ opacity: manifestoDim }}
            aria-hidden
          />

          <motion.div
            className="pointer-events-none absolute inset-0 z-[23] bg-black"
            style={{ opacity: playBackdropOpacity }}
            aria-hidden
          />

          <motion.div
            className="relative z-20 mx-auto w-full max-w-[1600px] px-6 md:px-10 lg:px-14"
            style={{ y: manifestoContentY }}
          >
            <div
              className="relative flex min-h-[200px] w-full flex-col justify-start text-left md:max-w-[min(40vw,34rem)] lg:max-w-[min(40vw,36rem)]"
            >
              <div className="flex flex-col items-start justify-start">
                <motion.div style={titleStyle} className={`w-full overflow-hidden ${block1Title.wrapperClass ?? ""}`}>
                  <div className={`manifesto-title-text ${block1Title.className}`}>{block1Title.text}</div>
                </motion.div>
                <motion.div style={subtitleStyle} className={`w-full overflow-hidden ${block1Subtitle.wrapperClass ?? ""}`}>
                  <div className={`manifesto-subtitle-text ${block1Subtitle.className}`}>{block1Subtitle.text}</div>
                </motion.div>
              </div>

              <div className="mt-10 flex w-full max-w-[min(100%,22rem)] flex-col gap-y-6 md:mt-12 md:max-w-[min(100%,32rem)] md:gap-y-8">
                <motion.div style={def1Style} className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-1"
                    num="1."
                    plainText={DEFINITION_1_PLAIN}
                    boldWord={DEFINITION_1_LEAD}
                    active={blockPhase === 1}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.2}
                    revealOnMount={false}
                  />
                </motion.div>
                <motion.div style={def2Style} className="w-full">
                  <ManifestoDefinitionListItem
                    key="def-2"
                    num="2."
                    plainText={DEFINITION_2_PLAIN}
                    boldWord={DEFINITION_2_LEAD}
                    active={blockPhase === 1 && showDefinition2}
                    numClassName={numberedListNumClass}
                    bodyClassName={numberedListBodyClass}
                    baseDelay={1.6}
                    revealOnMount={false}
                  />
                </motion.div>
                <motion.div className="w-full pl-16 md:pl-[5.5rem]" style={staffStyle}>
                  <ClaveStaff playing={blockPhase === 1} className="block h-auto w-full text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-[25] flex items-center justify-center px-4">
            <div className="flex max-w-[min(100%,56rem)] flex-col items-center text-center">
              <motion.h2
                className={`${ebGaramondMediumItalic.className} ${ESTAR_TITLE_CLASS} text-white drop-shadow-md`}
                style={estarTitleStyle}
              >
                Estar acá y estar ahora
              </motion.h2>
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

          <EstarAcaYoutubeEmbed open={youtubeOpen} onClose={handleYoutubeClose} />
        </motion.div>
      </div>
    </section>
  );
}
