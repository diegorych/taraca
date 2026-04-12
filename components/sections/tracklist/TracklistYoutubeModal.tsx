"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { Track } from "@/lib/domain";

const DEFAULT_YOUTUBE_ID = "dQw4w9WgXcQ";

function embedSrc(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`;
}

function getFinalLayout() {
  if (typeof window === "undefined") {
    return { left: 0, top: 0, width: 960, height: 540 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let w = Math.min(vw * 0.92, 1100);
  let h = (w * 9) / 16;
  const maxH = vh * 0.9;
  if (h > maxH) {
    h = maxH;
    w = (h * 16) / 9;
  }
  const left = (vw - w) / 2;
  const top = (vh - h) / 2;
  return { left, top, width: w, height: h };
}

type TracklistYoutubeModalProps = {
  open: boolean;
  track: Track | null;
  originRect: DOMRect | null;
  onClose: () => void;
  onExitComplete: () => void;
};

export function TracklistYoutubeModal({
  open,
  track,
  originRect,
  onClose,
  onExitComplete,
}: TracklistYoutubeModalProps) {
  const [mounted, setMounted] = useState(false);
  const final = useMemo(() => getFinalLayout(), [track, open]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEscape);
    };
  }, [open, onEscape]);

  if (!mounted) return null;

  const videoId = track?.youtubeVideoId ?? DEFAULT_YOUTUBE_ID;
  const hasOrigin =
    originRect != null &&
    originRect.width > 1 &&
    originRect.height > 1;

  const ease = [0.22, 1, 0.36, 1] as const;
  const expandDuration = 0.52;

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && track ? (
        <>
          <motion.div
            key={`yt-bg-${track.id}`}
            className="fixed inset-0 z-[199] bg-black/75 backdrop-blur-[2px]"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={onClose}
          />
          <motion.div
            key={`yt-panel-${track.id}`}
            role="dialog"
            aria-modal="true"
            aria-label={`Reproducir ${track.title}`}
            className="fixed z-[200] overflow-hidden bg-black shadow-2xl ring-1 ring-white/12"
            initial={
              hasOrigin
                ? {
                    left: originRect.left,
                    top: originRect.top,
                    width: originRect.width,
                    height: originRect.height,
                    borderRadius: 6,
                  }
                : {
                    left: final.left + final.width * 0.12,
                    top: final.top + final.height * 0.12,
                    width: final.width * 0.76,
                    height: final.height * 0.76,
                    borderRadius: 10,
                  }
            }
            animate={{
              left: final.left,
              top: final.top,
              width: final.width,
              height: final.height,
              borderRadius: 12,
              opacity: 1,
            }}
            exit={{ opacity: 0, transition: { duration: 0.22, ease: "easeOut" } }}
            transition={{ duration: expandDuration, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/90"
              aria-label="Cerrar"
              onClick={onClose}
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            <iframe
              title={`${track.title} — YouTube`}
              src={embedSrc(videoId)}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
