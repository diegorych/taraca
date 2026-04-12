"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EB_Garamond } from "next/font/google";
import { Pause, Play } from "lucide-react";
import { EstarAcaYoutubeEmbed } from "@/components/features/EstarAcaYoutubeEmbed";

const ebGaramondMediumItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Vista previa en silencio: empieza en 6:45 */
const PREVIEW_START_SECONDS = 6 * 60 + 45;

function clampPreviewStart(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return PREVIEW_START_SECONDS;
  return Math.min(PREVIEW_START_SECONDS, Math.max(0, duration - 0.05));
}

/**
 * Progreso local de scroll (0–1) a partir del cual la preview silenciada empieza a reproducir.
 * Un valor bajo = “un poco antes” de que el bloque cinemático se note en pantalla.
 */
const PREVIEW_SCROLL_PLAY_THRESHOLD = 0.14;

/** Por debajo de esto se considera que el usuario volvió a la sección de arriba: reset del video. */
const RESET_SCROLL_PROGRESS = 0.07;

const ESTAR_ACA_VIDEO_SRC = "/video/estar-aca-corto.mov";

export function CinematicSection() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubRef = useRef(false);

  const [introVisible, setIntroVisible] = useState(true);
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const introVisibleRef = useRef(true);
  introVisibleRef.current = introVisible;
  const previewScrollPlayingRef = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const syncPreviewToScroll = useCallback((p: number) => {
    if (!introVisibleRef.current) return;
    const v = videoRef.current;
    if (!v || v.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const t = clampPreviewStart(v.duration);

    if (p >= PREVIEW_SCROLL_PLAY_THRESHOLD) {
      if (!previewScrollPlayingRef.current) {
        previewScrollPlayingRef.current = true;
        v.muted = true;
        v.currentTime = t;
        void v.play().catch(() => {});
      }
    } else {
      if (previewScrollPlayingRef.current) {
        previewScrollPlayingRef.current = false;
        v.pause();
        v.currentTime = t;
      }
    }
  }, []);

  const handleScrollProgress = useCallback(
    (p: number) => {
      if (p <= RESET_SCROLL_PROGRESS && !introVisibleRef.current) {
        setYoutubeOpen(false);
        introVisibleRef.current = true;
        setIntroVisible(true);
        previewScrollPlayingRef.current = false;
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.muted = true;
          if (v.readyState >= HTMLMediaElement.HAVE_METADATA) {
            const t = clampPreviewStart(v.duration);
            v.currentTime = t;
            setCurrentTime(t);
          }
        }
        setIsPlaying(false);
      }
      syncPreviewToScroll(p);
    },
    [syncPreviewToScroll]
  );

  useMotionValueEvent(scrollYProgress, "change", handleScrollProgress);

  useLayoutEffect(() => {
    handleScrollProgress(scrollYProgress.get());
  }, [introVisible, scrollYProgress, handleScrollProgress]);

  useEffect(() => {
    if (!introVisible) return;
    const v = videoRef.current;
    if (!v) return;

    const freezeAtPreview = () => {
      v.muted = true;
      v.currentTime = clampPreviewStart(v.duration);
      v.pause();
      syncPreviewToScroll(scrollYProgress.get());
    };

    if (v.readyState >= HTMLMediaElement.HAVE_METADATA) {
      freezeAtPreview();
    }

    const onMeta = () => {
      freezeAtPreview();
      v.removeEventListener("loadedmetadata", onMeta);
    };
    v.addEventListener("loadedmetadata", onMeta);
    return () => v.removeEventListener("loadedmetadata", onMeta);
  }, [introVisible, scrollYProgress, syncPreviewToScroll]);

  const width = useTransform(
    scrollYProgress,
    [0, 1],
    ["95%", "100%"],
    { clamp: true }
  );

  const height = "100vh";

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    ["16px", "0px"],
    { clamp: true }
  );

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15], {
    clamp: true,
  });

  const textY = useTransform(scrollYProgress, [0, 1], [80, -80], {
    clamp: true,
  });

  const handlePlayIntro = useCallback(() => {
    const v = videoRef.current;
    previewScrollPlayingRef.current = false;
    if (v) {
      v.pause();
      v.muted = true;
    }
    setIntroVisible(false);
    setYoutubeOpen(true);
  }, []);

  const handleYoutubeClose = useCallback(() => {
    setYoutubeOpen(false);
    setIntroVisible(true);
    const v = videoRef.current;
    if (v && v.readyState >= HTMLMediaElement.HAVE_METADATA) {
      v.muted = true;
      v.currentTime = clampPreviewStart(v.duration);
      v.pause();
    }
    syncPreviewToScroll(scrollYProgress.get());
  }, [scrollYProgress, syncPreviewToScroll]);

  const togglePlayPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (scrubRef.current) return;
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration || 0);
  }, []);

  const handleSeek = useCallback((value: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = value;
    setCurrentTime(value);
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100vh] bg-[#0A0A0A]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ width, height, borderRadius }}
          className="relative overflow-hidden bg-neutral-900 flex items-center justify-center"
        >
          <motion.div
            style={{ scale }}
            className="absolute inset-0 w-full h-full"
          >
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={ESTAR_ACA_VIDEO_SRC}
              playsInline
              preload="auto"
              muted={introVisible}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleLoadedMetadata}
              onPlay={() => {
                setIsPlaying(true);
                setCurrentTime(videoRef.current?.currentTime ?? 0);
              }}
              onPause={() => {
                setIsPlaying(false);
                setCurrentTime(videoRef.current?.currentTime ?? 0);
              }}
              onEnded={() => {
                const v = videoRef.current;
                if (
                  introVisibleRef.current &&
                  previewScrollPlayingRef.current &&
                  v
                ) {
                  v.muted = true;
                  v.currentTime = clampPreviewStart(v.duration);
                  void v.play().catch(() => {});
                  return;
                }
                setIsPlaying(false);
              }}
            />

            <motion.div
              className="absolute inset-0 bg-black/35 pointer-events-none"
              animate={{ opacity: introVisible ? 1 : 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center px-4"
            initial={false}
            animate={{ opacity: introVisible ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ pointerEvents: introVisible ? "auto" : "none" }}
          >
            <motion.div
              style={{ y: textY }}
              className="flex flex-col items-center text-center"
            >
              <h2
                className={`${ebGaramondMediumItalic.className} text-[40px] md:text-[70px] lg:text-[110px] text-white leading-tight drop-shadow-md`}
              >
                Estar acá y estar ahora
              </h2>
              <button
                type="button"
                aria-label="Reproducir video desde el inicio"
                onClick={handlePlayIntro}
                className="mt-8 md:mt-10 flex items-center justify-center rounded-full border-2 border-white/45 text-white/90 backdrop-blur-sm transition-colors hover:border-white/70 hover:text-white cursor-pointer w-[4.5rem] h-[4.5rem] md:w-24 md:h-24"
              >
                <Play className="w-9 h-9 md:w-11 md:h-11 ml-1" fill="currentColor" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-16 md:px-8 md:pb-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
            initial={false}
            animate={{
              opacity: introVisible ? 0 : youtubeOpen ? 0 : 1,
            }}
            transition={{ duration: 0.45, ease: "easeOut", delay: introVisible ? 0 : 0.15 }}
            style={{
              pointerEvents: introVisible || youtubeOpen ? "none" : "auto",
            }}
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-3">
              <label className="sr-only" htmlFor="cinematic-scrub">
                Posición en el video
              </label>
              <input
                id="cinematic-scrub"
                type="range"
                min={0}
                max={duration > 0 ? duration : 0}
                step={0.05}
                value={duration > 0 ? Math.min(currentTime, duration) : 0}
                onMouseDown={() => {
                  scrubRef.current = true;
                }}
                onMouseUp={() => {
                  scrubRef.current = false;
                }}
                onTouchStart={() => {
                  scrubRef.current = true;
                }}
                onTouchEnd={() => {
                  scrubRef.current = false;
                }}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-white [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />

              <div className="flex items-center justify-between gap-4 font-sans text-sm text-white/90 tabular-nums">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? "Pausar" : "Reproducir"}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 transition-colors hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" fill="currentColor" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  )}
                </button>

                <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-xs md:text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span className="text-white/50">/</span>
                  <span className="text-white/70">{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <EstarAcaYoutubeEmbed open={youtubeOpen} onClose={handleYoutubeClose} />
        </motion.div>
      </div>
    </section>
  );
}
