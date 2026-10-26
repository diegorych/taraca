"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  /** Progreso del scroll de la sección (0–1). */
  progress: MotionValue<number>;
  /** Tramo de progreso en el que la palabra viaja del párrafo al título. */
  range: [number, number];
  /** Contenedor posicionado (fijo durante el tramo) en el que se dibuja la copia. */
  sceneRef: RefObject<HTMLElement | null>;
  /** Palabra de origen dentro del párrafo. */
  sourceSelector: string;
  /** Palabra de destino dentro del título. */
  targetRef: RefObject<HTMLElement | null>;
  sourceText: string;
  sourceClassName: string;
  targetText: string;
  targetClassName: string;
};

/**
 * Transición de elemento compartido: una copia de la palabra arranca exactamente encima
 * de la del párrafo, viaja y crece hasta la posición/tamaño de la del título, y en el
 * camino cambia de tipografía (fundido entre las dos versiones). Fuera del tramo no se ve:
 * antes manda la palabra del párrafo y después la del título.
 */
export function ManifestoWordMorph({
  progress,
  range,
  sceneRef,
  sourceSelector,
  targetRef,
  sourceText,
  sourceClassName,
  targetText,
  targetClassName,
}: Props) {
  const sourceCopyRef = useRef<HTMLSpanElement>(null);
  const targetCopyRef = useRef<HTMLSpanElement>(null);

  // Geometría medida (px, relativa a la escena) y tamaños de fuente.
  const from = { x: useMotionValue(0), y: useMotionValue(0), font: useMotionValue(16) };
  const to = { x: useMotionValue(0), y: useMotionValue(0), font: useMotionValue(64) };
  const sourceCopySize = { w: useMotionValue(0), h: useMotionValue(0) };
  const targetCopySize = { w: useMotionValue(0), h: useMotionValue(0) };

  const measure = useCallback(() => {
    const scene = sceneRef.current;
    const source = scene?.querySelector<HTMLElement>(sourceSelector);
    const target = targetRef.current;
    if (!scene || !source || !target) return;
    const base = scene.getBoundingClientRect();
    const center = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top };
    };
    const s = center(source);
    const t = center(target);
    from.x.set(s.x);
    from.y.set(s.y);
    from.font.set(parseFloat(getComputedStyle(source).fontSize));
    to.x.set(t.x);
    to.y.set(t.y);
    to.font.set(parseFloat(getComputedStyle(target).fontSize));
    const sc = sourceCopyRef.current;
    const tc = targetCopyRef.current;
    if (sc) {
      sourceCopySize.w.set(sc.offsetWidth);
      sourceCopySize.h.set(sc.offsetHeight);
    }
    if (tc) {
      targetCopySize.w.set(tc.offsetWidth);
      targetCopySize.h.set(tc.offsetHeight);
    }
    // Los motion values son estables: medir no necesita volver a crear el callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneRef, sourceSelector, targetRef]);

  // Se mide justo antes y durante el viaje (y al cambiar el tamaño de la ventana).
  useMotionValueEvent(progress, "change", (p) => {
    if (p > range[0] - 0.08 && p < range[1] + 0.02) measure();
  });
  useLayoutEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const eased = useTransform(progress, (p) =>
    easeInOutCubic(Math.min(1, Math.max(0, (p - range[0]) / (range[1] - range[0])))),
  );
  const visible = useTransform(progress, (p) => (p >= range[0] && p < range[1] ? 1 : 0));

  const cx = useTransform([eased, from.x, to.x], ([e, a, b]) => lerp(Number(a), Number(b), Number(e)));
  const cy = useTransform([eased, from.y, to.y], ([e, a, b]) => lerp(Number(a), Number(b), Number(e)));
  const fontRatio = useTransform([from.font, to.font], ([a, b]) => Number(b) / Number(a) || 1);

  // Copia con la tipografía del párrafo: crece desde su tamaño real y se apaga a mitad.
  const sourceX = useTransform([cx, sourceCopySize.w], ([c, w]) => Number(c) - Number(w) / 2);
  const sourceY = useTransform([cy, sourceCopySize.h], ([c, h]) => Number(c) - Number(h) / 2);
  const sourceScale = useTransform([eased, fontRatio], ([e, r]) => lerp(1, Number(r), Number(e)));
  const sourceOpacity = useTransform(eased, [0.15, 0.6], [1, 0], { clamp: true });

  // Copia con la tipografía del título: llega a su tamaño real (nítida) al final.
  const targetX = useTransform([cx, targetCopySize.w], ([c, w]) => Number(c) - Number(w) / 2);
  const targetY = useTransform([cy, targetCopySize.h], ([c, h]) => Number(c) - Number(h) / 2);
  const targetScale = useTransform([eased, fontRatio], ([e, r]) => lerp(1 / Number(r), 1, Number(e)));
  const targetOpacity = useTransform(eased, [0.3, 0.8], [0, 1], { clamp: true });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[26]"
      style={{ opacity: visible }}
    >
      <motion.span
        ref={sourceCopyRef}
        className={`absolute left-0 top-0 inline-block whitespace-nowrap ${sourceClassName}`}
        style={{
          x: sourceX,
          y: sourceY,
          scale: sourceScale,
          opacity: sourceOpacity,
          textShadow: "0 0 18px rgba(255,255,255,0.5)",
        }}
      >
        {sourceText}
      </motion.span>
      <motion.span
        ref={targetCopyRef}
        className={`absolute left-0 top-0 inline-block whitespace-nowrap ${targetClassName}`}
        style={{ x: targetX, y: targetY, scale: targetScale, opacity: targetOpacity }}
      >
        {targetText}
      </motion.span>
    </motion.div>
  );
}
