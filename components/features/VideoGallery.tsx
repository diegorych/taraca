"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { EB_Garamond } from "next/font/google";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";

interface Track {
  id: number;
  title: string;
  number: string;
  videoSrc: string;
  className: string;
  parallaxSpeed: number;
}

const tracks: Track[] = [
  { id: 1, title: "Toco madera", number: "01", videoSrc: "/video/toco-madera.mp4", className: "col-span-1", parallaxSpeed: 0.15 },
  { id: 2, title: "¿Cómo se ama?", number: "02", videoSrc: "/video/publico.mp4", className: "col-span-1 mt-20", parallaxSpeed: 0.25 },
  { id: 3, title: "El tambor chico", number: "03", videoSrc: "/video/drum.mp4", className: "col-span-1 -mt-12", parallaxSpeed: 0.35 },
  { id: 4, title: "Ante la duda, baila", number: "04", videoSrc: "/video/publico.mp4", className: "col-span-1 mt-32", parallaxSpeed: 0.2 },
  { id: 5, title: "Te llevo tatuada", number: "05", videoSrc: "/video/te-llevo-tatuada.mp4", className: "col-span-1 mt-8", parallaxSpeed: 0.1 },
  { id: 6, title: "¿Qué será que es?", number: "06", videoSrc: "/video/que-sera.mp4", className: "col-span-1 mt-48", parallaxSpeed: 0.3 },
  { id: 7, title: "¿Hay alguien A.I?", number: "07", videoSrc: "/video/publico.mp4", className: "col-span-1 mt-24", parallaxSpeed: 0.18 },
  { id: 8, title: "Cuando cantaba Morente", number: "08", videoSrc: "/video/drum.mp4", className: "col-span-1 mt-0", parallaxSpeed: 0.28 },
  { id: 9, title: "Amar y ser amado", number: "09", videoSrc: "/video/publico.mp4", className: "col-span-1 mt-20", parallaxSpeed: 0.12 },
  { id: 10, title: "Nuestro trabajo / Los puentes", number: "10", videoSrc: "/video/drum.mp4", className: "col-span-1 mt-16", parallaxSpeed: 0.22 },
  { id: 11, title: "Las palabras", number: "11", videoSrc: "/video/publico.mp4", className: "col-span-1 mt-12", parallaxSpeed: 0.32 },
];

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: "600",
  style: "italic",
});

const INTRO_LINES = [
  { text: "Taracá:", sizeClass: "text-[72px] leading-[1.05]" },
  { text: "1. Forma rioplatense surgida por aféresis de “estar acá”", sizeClass: "text-[42px] leading-[1.22]" },
  { text: "2. Onomatopeya del sonido del tambor chico en el candombe.", sizeClass: "text-[42px] leading-[1.22]" },
];

const IntroRevealText = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.35 });
  let wordCursor = 0;

  return (
    <div ref={textRef} className="mx-auto max-w-[1200px] text-left flex flex-col items-start">
      {INTRO_LINES.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <p className={`${ebGaramond.className} ${line.sizeClass} font-semibold italic tracking-[-0.03em] text-[#7A7C79]`}>
            {line.text.split(" ").map((word) => {
              const wordIndex = wordCursor++;
              return (
                <span key={`${word}-${wordIndex}`} className="inline-block overflow-hidden align-bottom mr-[0.24em]">
                  <motion.span
                    className="inline-block"
                    initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
                    animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
                    transition={{ duration: 0.55, ease: "easeOut", delay: wordIndex * 0.05 }}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

const VideoItem = ({
  track,
  index,
  scrollYProgress,
}: {
  track: Track;
  index: number;
  scrollYProgress: MotionValue<number>;
}) => {
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, track.parallaxSpeed * -1200]);

  return (
    <motion.div className={`relative group ${track.className}`} style={{ y: parallaxY }}>
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.6, margin: "0px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
      >
        <div className="relative aspect-video overflow-hidden bg-gray-900 rounded-sm">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-100">
            <source src={track.videoSrc} type="video/mp4" />
          </video>
        </div>

        <div className="flex justify-between items-end mt-2 px-1">
          <h3 className="text-[#636560] text-sm md:text-base font-bold tracking-wide  transition-colors">
            {track.title}
          </h3>
          <span className={`${ebGaramond.className} text-[#636560] text-sm md:text-base font-semibold italic tracking-wider`}>
            {track.number}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const VideoGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Existing gallery assets (keep in original positions)
  const doodleRightY = useTransform(scrollYProgress, [0, 1], ["-4%", "12%"]);
  const doodleLeftY = useTransform(scrollYProgress, [0, 1], ["10%", "-6%"]);
  const greenY = useTransform(scrollYProgress, [0, 1], ["20%", "-10%"]);

  // Intro quote parallax - starts after static phase
  const introY = useTransform(scrollYProgress, [0.3, 1], ["0%", "-14%"]);
  // Expanding wipe only after the gallery has effectively passed.
  const transitionPanelY = useTransform(scrollYProgress, [0.93, 1], ["100%", "0%"]);
  const transitionLineScaleX = useTransform(scrollYProgress, [0.9, 0.95], [0.06, 1]);
  const transitionOverlayOpacity = useTransform(scrollYProgress, [0.9, 0.95], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[220vh] -mt-[200vh] bg-[#0A0A0A] pt-64 md:pt-96 pb-24 md:pb-32 px-6 md:px-16 lg:px-24 overflow-visible z-10"
    >
      {/* Main Content - Moves with scroll */}
      <div className="relative w-full h-full">
        {/* Existing gallery assets in original positions */}
        <motion.img
          src="/images/deco-tinta.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-0 top-[38%] -right-8 w-[150px] md:w-[220px] lg:w-[280px] opacity-50"
          style={{ y: doodleRightY }}
        />
        <motion.img
          src="/images/deco-lineas.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-0 bottom-[4%] -left-12 w-[130px] md:w-[190px] lg:w-[240px] opacity-50 -scale-x-100 rotate-[6deg]"
          style={{ y: doodleLeftY }}
        />
        <motion.img
          src="/images/deco-amarillo.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-0 top-[65%] -right-4 w-[100px] md:w-[140px] lg:w-[180px] opacity-40 rotate-[12deg]"
          style={{ y: greenY }}
        />

        <motion.div className="relative z-10 mx-auto mt-[85vh]" style={{ y: introY }}>
          <IntroRevealText />
        </motion.div>

        <div className="relative z-10 mt-96 md:mt-[34rem] max-w-6xl mx-auto grid grid-cols-3 gap-x-12 gap-y-20 md:gap-x-20 md:gap-y-28 lg:gap-x-24 lg:gap-y-32">
          {tracks.map((track, index) => (
            <VideoItem key={track.id} track={track} index={index} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-40">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-[2px] bg-[#F5F5F0]"
            style={{ scaleX: transitionLineScaleX, opacity: transitionOverlayOpacity, originX: 0.5 }}
          />
          <motion.div
            className="absolute inset-0"
            style={{ y: transitionPanelY }}
          >
            <div
              className="h-full w-full"
              style={{
                backgroundColor: "#F5F5F0",
                backgroundImage: "url('/images/deco-cuadrado.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
