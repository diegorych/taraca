"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import Image from "next/image";
import { manifestoSnapshots } from "@/content/manifesto";

/**
 * Posición base + impulso de entrada (x/y/rotate desde valores más extremos hacia el reposo).
 * La opacidad sube en un tramo muy corto al inicio para que el efecto se lea por movimiento y escala.
 */
const LAYERS = [
  {
    rotateRest: -7,
    rotateFromDelta: -3,
    left: "8%",
    top: "22%",
    width: "min(46%, 260px)",
    z: 10,
    xFrom: 10,
    yFrom: 16,
  },
  {
    rotateRest: 2,
    rotateFromDelta: 3,
    left: "19%",
    top: "16%",
    width: "min(48%, 280px)",
    z: 20,
    xFrom: -8,
    yFrom: 14,
  },
  {
    rotateRest: 9,
    rotateFromDelta: -3,
    left: "30%",
    top: "10%",
    width: "min(48%, 280px)",
    z: 30,
    xFrom: 10,
    yFrom: 12,
  },
  {
    rotateRest: -4,
    rotateFromDelta: 3,
    left: "39%",
    top: "14%",
    width: "min(43%, 240px)",
    z: 40,
    xFrom: -8,
    yFrom: 14,
  },
] as const;

export type ManifestoPhotoRange = readonly [number, number];

type ManifestoPhotoStackProps = {
  scrollYProgress: MotionValue<number>;
  /** [start, end] por foto; el padre puede acortar el tramo si hay reduced motion */
  photoRanges: readonly ManifestoPhotoRange[];
};

type LayerDef = (typeof LAYERS)[number];

/** Fracción inicial del tramo dedicada a llevar la opacidad casi a 1 (el resto es solo transform). */
const OPACITY_IN_FRACTION = 0.14;
const MOTION_IN_FRACTION = 0.42;

function ManifestoPhotoLayer({
  scrollYProgress,
  rangeStart,
  rangeEnd,
  src,
  alt,
  layer,
}: {
  scrollYProgress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  src: string;
  alt: string;
  layer: LayerDef;
}) {
  const span = rangeEnd - rangeStart;
  const opacityT1 = rangeStart + span * OPACITY_IN_FRACTION;
  const motionT2 = rangeStart + span * MOTION_IN_FRACTION;

  /**
   * El primer valor de salida debe ser 0: con `clamp`, si el scroll va por debajo de
   * `rangeStart`, Framer fija la salida al primer keyframe (antes estaba en 0,55 y las
   * fotos se veían durante todo el manifiesto).
   */
  const opacity = useTransform(
    scrollYProgress,
    [rangeStart, opacityT1, rangeEnd],
    [0, 1, 1],
    { clamp: true }
  );

  const scale = useTransform(
    scrollYProgress,
    [rangeStart, motionT2, rangeEnd],
    [0.98, 1, 1],
    { clamp: true }
  );

  const x = useTransform(
    scrollYProgress,
    [rangeStart, motionT2, rangeEnd],
    [layer.xFrom, 0, 0],
    { clamp: true }
  );

  const y = useTransform(
    scrollYProgress,
    [rangeStart, motionT2, rangeEnd],
    [layer.yFrom, 0, 0],
    { clamp: true }
  );

  const rotate = useTransform(
    scrollYProgress,
    [rangeStart, motionT2, rangeEnd],
    [layer.rotateRest + layer.rotateFromDelta, layer.rotateRest, layer.rotateRest],
    { clamp: true }
  );

  return (
    <motion.div
      className="absolute shadow-[0_12px_40px_rgba(0,0,0,0.45)] will-change-transform"
      style={{
        left: layer.left,
        top: layer.top,
        width: layer.width,
        zIndex: layer.z,
        opacity,
        scale,
        x,
        y,
        rotate,
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-800 ring-1 ring-white/10">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 45vw, 280px"
        />
      </div>
    </motion.div>
  );
}

export function ManifestoPhotoStack({
  scrollYProgress,
  photoRanges,
}: ManifestoPhotoStackProps) {
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-[12] h-full w-[57%] max-w-[700px] sm:w-[56%] md:w-[54%] md:max-w-[640px] lg:pr-3"
      aria-hidden
    >
      <div className="relative ml-auto h-full w-[min(100%,620px)] translate-x-[0.6vw] sm:translate-x-[1.2vw] md:translate-x-[2vw]">
        {manifestoSnapshots.map((snap, i) => {
          const range = photoRanges[i];
          const layer = LAYERS[i];
          if (!range || !layer) return null;
          const [start, end] = range;
          return (
            <ManifestoPhotoLayer
              key={snap.src}
              scrollYProgress={scrollYProgress}
              rangeStart={start}
              rangeEnd={end}
              src={snap.src}
              alt={snap.alt}
              layer={layer}
            />
          );
        })}
      </div>
    </div>
  );
}
