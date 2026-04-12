"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { EB_Garamond } from "next/font/google";
import {
  Fragment,
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import { useNavbarScroll } from "@/components/providers/NavbarScrollProvider";
import { tracklistContent } from "@/content/sections";
import type { Track } from "@/lib/domain";
import { TracklistYoutubeModal } from "./TracklistYoutubeModal";

const ebGaramondItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
});

const terracotta = "#A64D3D";
const cream = "#F5F0E8";
const legalText =
  "(P) y © 2026 Sony Music Entertainment España S.L. Todas las marcas y logotipos están protegidos. Editado y distribuido por Sony Music España. Paseo de la Castellana 202, 7ª planta, 28046 Madrid (Spain). Sony Music Entertainment International Services GmbH, PO Box 510, 33311 Gütersloh, Germany. Sony Music UK, 2 Canal Reach, Kings Cross, London N1C 4DB, United Kingdom. product.service@sonymusic.com / All trademarks and logos are protected. All rights reserved. Made in the EU.";

const tracklistViewport = { once: true, amount: 0.12 } as const;

/** Cada fila se revela al hacer scroll (no todas a la vez). */
const trackRowViewport = {
  once: true,
  amount: 0.28,
  margin: "0px 0px -12% 0px",
} as const;

const headerFooterTransition = {
  duration: 0.62,
  ease: [0.22, 1, 0.36, 1] as const,
};

const rowSweepFromBottom = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

/** Hover preview: sin máscara de recorte para que el video nunca se vea “cortado”. */
const videoHoverVariants = {
  closed: { opacity: 0, scale: 0.97, y: 8 },
  open: { opacity: 1, scale: 1, y: 0 },
};

type TracklistHoverVideoProps = {
  src: string;
  visible: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
};

const TracklistHoverVideo = forwardRef<HTMLDivElement, TracklistHoverVideoProps>(
  function TracklistHoverVideo(
    { src, visible, videoRef },
    ref
  ) {
    return (
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
        aria-hidden
      >
        <motion.div
          ref={ref}
          className="overflow-hidden rounded-sm shadow-xl shadow-black/35 ring-1 ring-black/40"
          initial="closed"
          animate={visible ? "open" : "closed"}
          variants={videoHoverVariants}
          transition={{
            duration: 0.24,
            ease: [0.22, 1, 0.36, 1] as const,
          }}
        >
        <div className="bg-black p-0.5">
          <video
            ref={videoRef}
            src={src}
            muted
            playsInline
            loop
            preload="none"
            className="block max-h-[min(52vh,24rem)] w-auto max-w-[min(42vw,20rem)] object-contain sm:max-w-[min(38vw,22rem)] md:max-h-[min(50vh,26rem)] md:max-w-[min(34vw,24rem)] lg:max-h-[min(48vh,28rem)] lg:max-w-[min(30vw,26rem)] xl:max-w-[28rem]"
          />
        </div>
      </motion.div>
    </div>
    );
  }
);

type TracklistRowProps = {
  track: Track;
  index: number;
  hoveredTrackId: string | null;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
  onTrackClick: (track: Track, previewRect: DOMRect | null) => void;
  /** true si el modal de YouTube está abierto para esta fila: desmonta el preview sin barrido inverso */
  hidePreviewForModal: boolean;
};

function TracklistRow({
  track,
  index,
  hoveredTrackId,
  onHoverStart,
  onHoverEnd,
  onTrackClick,
  hidePreviewForModal,
}: TracklistRowProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const rowInView = useInView(rowRef, trackRowViewport);
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const src = track.previewVideoSrc;
  /** Pares: vídeo a la derecha del eje del título; impares: a la izquierda */
  const videoOnRight = index % 2 === 0;

  const handleEnter = () => {
    onHoverStart(track.id);
    const v = videoRef.current;
    if (!v || !src) return;
    void v.play().catch(() => {});
  };

  const handleLeave = () => {
    onHoverEnd();
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  const otherRowHovered =
    hoveredTrackId !== null && hoveredTrackId !== track.id;
  const titleHovered = hoveredTrackId === track.id;

  const previewRectForModal = () => {
    const r = previewBoxRef.current?.getBoundingClientRect();
    return r && r.width > 1 && r.height > 1 ? r : null;
  };

  const handleRowActivate = () => {
    onTrackClick(track, previewRectForModal());
  };

  const handleRowKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onTrackClick(track, previewRectForModal());
    }
  };

  return (
    <li
      ref={rowRef}
      className={`relative overflow-visible border-b border-[#A64D3D]/30 py-5 md:py-7 lg:py-8 ${
        titleHovered ? "z-[15]" : "z-0"
      }`}
      style={{ color: terracotta }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        className={`relative z-10 grid cursor-pointer grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-sm transition-opacity duration-300 ease-out outline-none focus-visible:ring-2 focus-visible:ring-[#A64D3D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F0E8] sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-4 md:grid-cols-[4rem_minmax(0,1fr)_auto] lg:grid-cols-[minmax(4.5rem,5.5rem)_minmax(0,1fr)_minmax(3.5rem,auto)] lg:gap-x-6 ${
          otherRowHovered ? "opacity-50" : "opacity-100"
        }`}
        initial="hidden"
        animate={rowInView ? "visible" : "hidden"}
        variants={rowSweepFromBottom}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: Math.min(index * 0.05, 0.24),
        }}
        onClick={handleRowActivate}
        onKeyDown={handleRowKeyDown}
      >
        <span className="font-sans text-sm font-medium tabular-nums sm:text-base md:text-lg">
          {track.number}
        </span>

        {/* Hueco número–título | título | hueco título–duración: el preview va centrado en el hueco (escalonado) */}
        <div className="relative min-w-0 overflow-visible lg:px-2">
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 sm:gap-x-3 md:gap-x-4 lg:gap-x-5">
            <div className="relative min-h-0 min-w-0 overflow-visible">
              {src && !videoOnRight && !hidePreviewForModal ? (
                <TracklistHoverVideo
                  ref={previewBoxRef}
                  src={src}
                  videoRef={videoRef}
                  visible={titleHovered}
                />
              ) : null}
            </div>

            <div
              className="relative z-20 min-w-0 cursor-pointer text-center lg:px-4 xl:px-6"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <p className="inline-block font-sans text-base font-bold leading-tight sm:text-lg md:text-xl lg:text-3xl">
                {track.title}
              </p>
              {track.feature ? (
                <p
                  className={`mt-1 text-sm text-[#A64D3D]/95 sm:text-base md:text-3xl ${ebGaramondItalic.className}`}
                >
                  {track.feature}
                </p>
              ) : null}
            </div>

            <div className="relative min-h-0 min-w-0 overflow-visible">
              {src && videoOnRight && !hidePreviewForModal ? (
                <TracklistHoverVideo
                  ref={previewBoxRef}
                  src={src}
                  videoRef={videoRef}
                  visible={titleHovered}
                />
              ) : null}
            </div>
          </div>
        </div>

        <span className="justify-self-end font-sans text-sm font-medium tabular-nums sm:text-base md:text-lg">
          {track.duration ?? "—"}
        </span>
      </motion.div>
    </li>
  );
}

export function TracklistSection() {
  const { tracklistSectionRef, markTracklistMounted } = useNavbarScroll();

  useLayoutEffect(() => {
    markTracklistMounted();
  }, [markTracklistMounted]);
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    track: Track;
    origin: DOMRect | null;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleTrackClick = (track: Track, origin: DOMRect | null) => {
    setHoveredTrackId(null);
    setModal({ track, origin });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleModalExitComplete = () => {
    setModal(null);
  };

  const { scrollYProgress } = useScroll({
    target: tracklistSectionRef,
    offset: ["start end", "end start"],
  });

  /**
   * Parallax en px (no %): con %, Framer usa la altura del propio nodo; si el listado
   * crece (imágenes, fuentes) o cambia el rango de scroll, el valor en píxeles salta y
   * parece un “zoom” del fondo junto a bg-cover.
   */
  const contentY = useTransform(scrollYProgress, [0, 1], [-36, 36]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const baseWidthPx = useMotionValue(0);
  const bleedLeftPx = useMotionValue(0);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof window === "undefined") return;

    const sync = () => {
      const r = el.getBoundingClientRect();
      baseWidthPx.set(r.width);
      bleedLeftPx.set(r.left);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [baseWidthPx, bleedLeftPx]);

  /**
   * Inversa de TourDatesBlock: allí width = bw + p*(vw-bw) al entrar (p 0→1).
   * Aquí, al final de la sección: width = bw + (1-p)*(vw-bw), margin = -(1-p)*bleedLeft.
   */
  const { scrollYProgress: sectionProgress } = useScroll({
    target: tracklistSectionRef,
    offset: ["start start", "end start"],
  });

  const exitP = useTransform(sectionProgress, [0.68, 1], [0, 1], {
    clamp: true,
  });

  const panelWidthPx = useTransform([exitP, baseWidthPx], ([p, bw]) => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 0;
    const bwN = Number(bw);
    if (bwN <= 0 || vw <= 0) return vw;
    return bwN + (1 - Number(p)) * (vw - bwN);
  });

  const panelMarginLeftPx = useTransform(
    [exitP, bleedLeftPx, baseWidthPx],
    ([p, left, bw]) =>
      Number(bw) <= 0 ? 0 : -(1 - Number(p)) * Number(left),
  );

  return (
    <section
      ref={tracklistSectionRef}
      id="tracklist"
      className="relative min-h-screen overflow-x-clip overflow-y-visible pb-20 md:pb-24 lg:pb-28"
    >
      {/* Negro detrás del panel solo al estrechar al final; sin padding superior para enlace directo con el vídeo. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[#0D0D0D]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-6 md:px-8 lg:px-10">
        <div ref={wrapperRef} className="w-full">
          <motion.div
            className="relative overflow-hidden rounded-sm"
            style={{
              backgroundColor: cream,
              width: panelWidthPx,
              marginLeft: panelMarginLeftPx,
            }}
          >
            {/* Imagen de textura encima del crema (como antes: no hay capa opaca encima). */}
            <div
              className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat [transform:translateZ(0)] [backface-visibility:hidden]"
              style={{
                backgroundImage: "url('/images/bg-tracklist.png')",
              }}
              aria-hidden
            />

            <motion.div
              className="relative z-10 px-6 py-8 pt-24 sm:px-8 sm:py-10 sm:pt-28 md:px-10 md:py-12 md:pt-28 lg:px-12 lg:py-14 lg:pt-32"
              style={{ y: contentY }}
            >
              <motion.div
                className={`grid grid-cols-[minmax(0,1fr)_auto] items-center pb-5 text-[#A64D3D] md:pb-7 lg:pb-8 ${ebGaramond.className}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={tracklistViewport}
                transition={headerFooterTransition}
              >
                <p className={`text-[40px] leading-none ${ebGaramondItalic.className}`}>
                  Taracá
                </p>
                <p className="text-[40px] leading-none">A</p>
              </motion.div>

              <ol className="list-none overflow-visible">
                {tracklistContent.map((track, index) => (
                  <Fragment key={track.id}>
                    <TracklistRow
                      track={track}
                      index={index}
                      hoveredTrackId={hoveredTrackId}
                      onHoverStart={setHoveredTrackId}
                      onHoverEnd={() => setHoveredTrackId(null)}
                      onTrackClick={handleTrackClick}
                      hidePreviewForModal={
                        modalOpen && modal?.track.id === track.id
                      }
                    />
                    {track.id === "05" ? (
                      <li
                        className={`grid min-h-[5.5rem] grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center py-5 text-[#A64D3D] sm:grid-cols-[3rem_minmax(0,1fr)_auto] md:min-h-[6.25rem] md:grid-cols-[4rem_minmax(0,1fr)_auto] md:py-7 lg:min-h-[6.75rem] lg:grid-cols-[minmax(4.5rem,5.5rem)_minmax(0,1fr)_minmax(3.5rem,auto)] lg:py-8`}
                      >
                        <span />
                        <span />
                        <span
                          className={`justify-self-end text-[40px] leading-none ${ebGaramond.className}`}
                        >
                          B
                        </span>
                      </li>
                    ) : null}
                  </Fragment>
                ))}
              </ol>

              <motion.div
                className="mt-20 flex flex-col items-center justify-center text-[#A64D3D] md:mt-24 lg:mt-32"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={tracklistViewport}
                transition={headerFooterTransition}
              >
                <img
                  src="/images/barcode-taraca.png"
                  alt="Codigo de barras Taraca"
                  width={1024}
                  height={620}
                  className="h-auto w-full max-w-[200px] object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <p className="mt-5 w-full text-justify text-[12px] leading-tight text-black">
                  {legalText}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <TracklistYoutubeModal
        open={modalOpen}
        track={modal?.track ?? null}
        originRect={modal?.origin ?? null}
        onClose={closeModal}
        onExitComplete={handleModalExitComplete}
      />
    </section>
  );
}
