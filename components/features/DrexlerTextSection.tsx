"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const QUOTE_LINES = [
  "“Taracá es una aféresis (pérdida de",
  "sonidos al comienzo de una palabra)",
  "rioplatense de ‘estar acá’ y yo",
  "solamente uso esa expresión y el",
  "adverbio de lugar ‘acá’ cuando estoy en",
  "uruguay.",
  "",
  "Tiene para mí algo de cercanía familiar,",
  "de casa, de presencia afectiva. resume",
  "también la necesidad que tuve de volver",
  "después de mucho tiempo a grabar acá,",
  "en uruguay.”",
];

const WordRevealText = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.35 });

  return (
    <div ref={textRef} className="max-w-[540px]">
      <div className="mb-8">
        {QUOTE_LINES.map((line, lineIndex) =>
          line === "" ? (
            <div key={`spacer-${lineIndex}`} className="h-5" />
          ) : (
            <span key={`line-${lineIndex}`} className="block overflow-hidden">
              <motion.p
                className="text-[24px] leading-[1.2] font-bold text-white/70"
                style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
                initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                animate={isInView ? { clipPath: "inset(0% 0 0 0)", opacity: 0.7 } : undefined}
                transition={{ duration: 0.42, ease: "easeOut", delay: lineIndex * 0.12 }}
              >
                {line}
              </motion.p>
            </span>
          )
        )}
      </div>

      <motion.p
        className="text-[24px] leading-[1.2] font-bold text-white/70"
        style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
        animate={isInView ? { clipPath: "inset(0% 0 0 0)", opacity: 0.7 } : undefined}
        transition={{ duration: 0.42, ease: "easeOut", delay: QUOTE_LINES.length * 0.12 + 0.08 }}
      >
        Jorge Drexler
      </motion.p>
    </div>
  );
};

export const DrexlerTextSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax sutil para mantener el lenguaje visual de la galería.
  const imageParallaxY = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const textParallaxY = useTransform(scrollYProgress, [0, 1], ["2%", "-4%"]);
  const decoRightY = useTransform(scrollYProgress, [0, 1], ["-6%", "10%"]);
  const decoLeftY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section ref={sectionRef} className="relative w-full min-h-[125vh] bg-black px-6 md:px-16 lg:px-24 py-20 md:py-28">
      <motion.div
        className="pointer-events-none absolute inset-0 z-[2] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/%3E%3C/svg%3E\")",
          backgroundSize: "260px 260px",
          opacity: 0.16,
        }}
        animate={{ backgroundPosition: ["0px 0px", "120px 80px", "-80px 140px", "0px 0px"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />
      <motion.img
        src="/images/deco-lineas.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute z-0 top-[18%] right-[2%] w-[140px] md:w-[210px] opacity-40"
        style={{ y: decoRightY }}
      />
      <motion.img
        src="/images/deco-amarillo.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute z-0 top-[54%] -left-8 w-[90px] md:w-[130px] opacity-40"
        style={{ y: decoLeftY }}
      />
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
        <motion.div style={{ y: imageParallaxY }} className="relative z-10 flex justify-center md:justify-start">
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[4/5] w-[84%] max-w-[640px]"
          >
            <Image src="/images/jorge-drexler.png" alt="Jorge Drexler" fill className="object-cover" />
          </motion.div>
        </motion.div>

        <motion.div style={{ y: textParallaxY }} className="relative z-10">
          <WordRevealText />
        </motion.div>
      </div>
    </section>
  );
};
