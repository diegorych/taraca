"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const VIDEO_ID = "N5TXzAPGppc";
const START_SECONDS = 225;

export function buildEstarAcaYoutubeEmbedSrc() {
  return `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&autoplay=1&start=${START_SECONDS}`;
}

type EstarAcaYoutubeEmbedProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * Reproductor incrustado (mismo vídeo que la URL compartida, inicio en t=225s).
 * Pensado para superponerse al bloque de vídeo local (`position: relative` en el padre).
 */
export function EstarAcaYoutubeEmbed({ open, onClose }: EstarAcaYoutubeEmbedProps) {
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (open) setIframeKey((k) => k + 1);
  }, [open]);

  const onEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    },
    [open, onClose],
  );

  useEffect(() => {
    if (!open) return;
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onEscape]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[60] flex flex-col bg-[#0A0A0A]/96"
      role="dialog"
      aria-modal="true"
      aria-label="Reproductor de YouTube"
    >
      <div className="flex shrink-0 justify-end p-2 md:p-3">
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar reproductor"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-3 pb-4 md:px-6 md:pb-8">
        <div
          className="relative mx-auto w-full max-w-6xl shadow-xl ring-1 ring-white/10"
          style={{
            aspectRatio: "16 / 9",
            width: "min(92vw, min(72rem, calc(70vh * 16 / 9)))",
            maxHeight: "70vh",
          }}
        >
          <iframe
            key={iframeKey}
            title="Estar acá y estar ahora — YouTube"
            src={buildEstarAcaYoutubeEmbedSrc()}
            className="absolute inset-0 h-full w-full rounded-sm border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  );
}
