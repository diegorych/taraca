"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { ChevronDown } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";

/** Parallax del cursor sobre el logo (el video queda quieto). */
const LOGO_MOUSE_X_PX = 14;
const LOGO_MOUSE_Y_PX = 11;
const MOUSE_SPRING = { stiffness: 220, damping: 28, mass: 0.35 } as const;

/** Plano del tambor de “Toco madera” (1:08.4 – 1:12.25 del clip original). */
const VIDEO_SRC = "/video/toco-madera-drum.mp4";
const VIDEO_ASPECT = 1466 / 1080;
/**
 * Alto del video en fracciones del viewport. Con 1.02 el parche (radio DRUM_R) mide
 * ≈ el alto de la pantalla; en pantallas anchas los costados se funden a negro.
 */
const VIDEO_HEIGHT_VH = 1.02;

/**
 * Trayectoria del parche: medida en los 96 frames del clip (círculo ajustado al borde del
 * parche en cada frame) y suavizada con un polinomio cúbico en u = t / DRUM_TRACK_SPAN.
 * cx, cy en fracciones del frame; r relativo al alto. El error del ajuste es < 1 px, así
 * que la compensación cancela el travelling de la cámara sin dejar temblor.
 */
const DRUM_TRACK_SPAN = 3.8;
const DRUM_FIT = {
  cx: [0.497441, 0.0444118, -0.0363289, 0.0100541],
  cy: [0.523047, -0.0389193, 0.00871206, -0.00112861],
  r: [0.492795, -0.0987336, -0.0599414, 0.044702],
} as const;

function cubic(c: readonly number[], u: number) {
  return c[0] + u * (c[1] + u * (c[2] + u * c[3]));
}

function drumAt(t: number) {
  const u = Math.max(0, t) / DRUM_TRACK_SPAN;
  return { cx: cubic(DRUM_FIT.cx, u), cy: cubic(DRUM_FIT.cy, u), r: cubic(DRUM_FIT.r, u) };
}

const { cx: DRUM_CX, cy: DRUM_CY, r: DRUM_R } = drumAt(0);

/** Fundido entre las dos copias del video para que el loop no salte. */
const XFADE_AT = 3.42;
const XFADE_DURATION = 0.4;

const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * Salida con el scroll (progreso del hero, 0..1 sobre 150vh). El hero queda fijo los
 * primeros 50vh (≈0.33): ahí se desvanece primero el video y después el logo, sin
 * moverse, y el manifiesto arranca justo debajo.
 */
const VIDEO_FADE_OUT: [number, number] = [0.02, 0.17];
/** El logo se achica apenas mientras se va el video y después se desvanece. */
const LOGO_SHRINK: [number, number] = [0.04, 0.3];
const LOGO_SHRINK_TO = 0.92;
const LOGO_FADE_OUT: [number, number] = [0.16, 0.3];

/** Transform que fija el parche en su posición/tamaño del primer frame. */
function stabilizeTransform(t: number) {
  const { cx, cy, r } = drumAt(t);
  return `scale(${DRUM_R / r}) translate(${(DRUM_CX - cx) * 100}%, ${(DRUM_CY - cy) * 100}%)`;
}

export const Hero = () => {
  const [logoIn, setLogoIn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { setShowHeader, preloaderFinished } = useIntroSequence();
  const containerRef = useRef<HTMLElement>(null);
  /** Dos copias del mismo clip que se alternan con un fundido. */
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const primaryVideoRef = useRef(0);
  const heroInViewRef = useRef(false);
  const reducedMotion = useReducedMotion();

  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);

  /** Fade de entrada del video (0..1). */
  const videoIntro = useMotionValue(0);
  const videoAOpacity = useMotionValue(1);
  const videoBOpacity = useMotionValue(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        heroInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.08, rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: MouseEvent) => {
      if (!heroInViewRef.current) return;
      mouseNormX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseNormY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reducedMotion, mouseNormX, mouseNormY]);

  const logoMouseX = useSpring(
    useTransform(mouseNormX, [-1, 1], [-LOGO_MOUSE_X_PX, LOGO_MOUSE_X_PX]),
    MOUSE_SPRING,
  );
  const logoMouseY = useSpring(
    useTransform(mouseNormY, [-1, 1], [-LOGO_MOUSE_Y_PX, LOGO_MOUSE_Y_PX]),
    MOUSE_SPRING,
  );
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const videoOpacity = useTransform(
    [videoIntro, scrollYProgress],
    ([intro, p]) => {
      const [a, b] = VIDEO_FADE_OUT;
      const out = 1 - Math.min(1, Math.max(0, (Number(p) - a) / (b - a)));
      return Number(intro) * out;
    },
  );
  const logoScrollOpacity = useTransform(scrollYProgress, LOGO_FADE_OUT, [1, 0], {
    clamp: true,
  });
  const logoScrollScale = useTransform(scrollYProgress, LOGO_SHRINK, [1, LOGO_SHRINK_TO], {
    clamp: true,
  });
  const logoScrollBlur = useTransform(
    scrollYProgress,
    LOGO_FADE_OUT,
    ["blur(0px)", "blur(14px)"],
    { clamp: true },
  );

  /** Indicador “seguí bajando”: se va apenas empieza el scroll. */
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0], {
    clamp: true,
  });

  /** Secuencia de entrada: aparece el video y después el logo desde el blur. */
  useEffect(() => {
    setShowHeader(false);
    if (!preloaderFinished) return;

    if (reducedMotion) {
      videoARef.current?.play().catch(() => {});
      videoIntro.set(1);
      const timer = window.setTimeout(() => {
        setLogoIn(true);
        setShowHint(true);
        setShowHeader(true);
      }, 0);
      return () => window.clearTimeout(timer);
    }

    let cancelled = false;
    const controls: AnimationPlaybackControls[] = [];
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    const run = async () => {
      videoARef.current?.play().catch(() => {});
      controls.push(animate(videoIntro, 1, { duration: 1.6, ease: EASE_OUT_SOFT }));
      await wait(1100);
      if (cancelled) return;
      setLogoIn(true);
      await wait(1100);
      if (cancelled) return;
      setShowHeader(true);
      await wait(700);
      if (cancelled) return;
      setShowHint(true);
    };
    run();

    return () => {
      cancelled = true;
      controls.forEach((c) => c.stop());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [setShowHeader, preloaderFinished, reducedMotion, videoIntro]);

  /**
   * Estabilización: cada copia corrige su escala/posición en el frame que realmente
   * presenta (requestVideoFrameCallback), así la corrección nunca va desfasada del video.
   */
  useEffect(() => {
    const videos = [videoARef.current, videoBRef.current].filter(
      (v): v is HTMLVideoElement => !!v,
    );
    if (!("requestVideoFrameCallback" in HTMLVideoElement.prototype)) return;
    const ids = new Map<HTMLVideoElement, number>();
    const watch = (v: HTMLVideoElement) => {
      const onFrame: VideoFrameRequestCallback = (_now, meta) => {
        v.style.transform = stabilizeTransform(meta.mediaTime);
        ids.set(v, v.requestVideoFrameCallback(onFrame));
      };
      ids.set(v, v.requestVideoFrameCallback(onFrame));
    };
    videos.forEach(watch);
    return () => ids.forEach((id, v) => v.cancelVideoFrameCallback(id));
  }, []);

  /**
   * Loop con fundido entre las dos copias del clip. La copia que sale queda pausada y
   * rebobinada, lista para el próximo fundido.
   */
  useEffect(() => {
    const videos = [videoARef.current, videoBRef.current];
    const opacities = [videoAOpacity, videoBOpacity];
    if (!videos[0] || !videos[1]) return;
    const hasFrameCallback = "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    let raf = 0;
    const tick = () => {
      if (!hasFrameCallback) {
        for (const v of videos) v!.style.transform = stabilizeTransform(v!.currentTime);
      }
      const current = primaryVideoRef.current;
      const video = videos[current]!;
      const t = video.currentTime;

      if (t >= XFADE_AT) {
        const next = 1 - current;
        const incoming = videos[next]!;
        incoming.play().catch(() => {});
        animate(opacities[next], 1, { duration: XFADE_DURATION, ease: "easeInOut" });
        animate(opacities[current], 0, {
          duration: XFADE_DURATION,
          ease: "easeInOut",
        }).then(() => {
          video.pause();
          video.currentTime = 0;
          video.style.transform = stabilizeTransform(0);
        });
        primaryVideoRef.current = next;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [videoAOpacity, videoBOpacity]);

  return (
    /*
     * Fondo transparente y -100vh abajo: cuando el hero termina de desvanecerse, el
     * manifiesto ya está debajo, así no hay un tramo de negro “muerto” al scrollear.
     */
    <section
      ref={containerRef}
      className="pointer-events-none relative z-20 -mb-[100vh] h-[150vh] w-full"
    >
      <div className="sticky top-0 h-dvh min-h-0 w-full flex items-center justify-center overflow-hidden">
        {/* Video del tambor: aparece al entrar y se desvanece con el scroll. */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden bg-[#0A0A0A]"
          style={{ opacity: videoOpacity }}
        >
          <div className="absolute inset-0 [filter:grayscale(1)_brightness(0.92)_contrast(1.08)]">
            {/* Marco fijo centrado en el parche; sus bordes laterales se funden a negro. */}
            <div
              className="absolute left-1/2 top-1/2 overflow-hidden"
              style={{
                height: `${VIDEO_HEIGHT_VH * 100}dvh`,
                width: `calc(${VIDEO_HEIGHT_VH * 100}dvh * ${VIDEO_ASPECT})`,
                translate: `-${DRUM_CX * 100}% -${DRUM_CY * 100}%`,
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
              }}
            >
              {[
                { ref: videoARef, opacity: videoAOpacity },
                { ref: videoBRef, opacity: videoBOpacity },
              ].map(({ ref, opacity }, i) => (
                <motion.video
                  key={i}
                  ref={ref}
                  src={VIDEO_SRC}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden
                  className="absolute inset-0 h-full w-full max-w-none object-cover"
                  style={{
                    transformOrigin: `${DRUM_CX * 100}% ${DRUM_CY * 100}%`,
                    opacity,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_18%,rgba(0,0,0,0.5)_58%,rgba(0,0,0,0.88)_100%)]" />
        </motion.div>

        {/* Logo: parallax del cursor */}
        <motion.div
          style={{
            x: logoMouseX,
            y: logoMouseY,
            scale: logoScrollScale,
            opacity: logoScrollOpacity,
            filter: logoScrollBlur,
          }}
          className="absolute inset-x-0 top-0 z-20 flex h-dvh min-h-0 origin-center items-center justify-center px-4 pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.04, filter: "blur(28px)" }}
            animate={
              logoIn
                ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                : { opacity: 0, scale: 1.04, filter: "blur(28px)" }
            }
            transition={{
              opacity: { duration: 1.4, ease: EASE_OUT_SOFT },
              filter: { duration: 1.8, ease: EASE_OUT_SOFT },
              scale: { duration: 2.2, ease: EASE_OUT_SOFT },
            }}
          >
            <div className="scale-[0.98] md:scale-[1.06] lg:scale-[1.1] 2xl:scale-[1.2] min-[1920px]:scale-[1.4] drop-shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <AnimatedLogo />
            </div>
          </motion.div>
        </motion.div>

        {showHint && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[35] flex flex-col items-center md:bottom-8"
            style={{ opacity: scrollHintOpacity }}
            aria-hidden
          >
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55 md:text-[11px]"
            >
              Seguir bajando
            </motion.span>
            <motion.div
              animate={reducedMotion ? { y: 0 } : { y: [0, 7, 0] }}
              transition={{
                duration: 1.55,
                repeat: reducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown
                className="h-5 w-5 text-white/45 md:h-6 md:w-6"
                strokeWidth={1.5}
                aria-hidden
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
