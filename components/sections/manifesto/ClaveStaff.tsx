"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Pentagrama de la clave de candombe (la «madera») en 4/4: golpes en las semicorcheas
 * 0, 3, 7, 10 y 12. Cada nota se enciende en naranja en su golpe, en tempo.
 */
const HITS = [0, 3, 7, 10, 12] as const;
const BPM = 104;
const SIXTEENTH_MS = 60000 / BPM / 4;
const BAR_MS = SIXTEENTH_MS * 16;
/** Sin animación se ve como el frame de referencia: la tercera nota encendida. */
const STATIC_ACTIVE = 2;

const ACTIVE_COLOR = "#F5A623";
const HEAD_Y = 48.5;
/** Cinco líneas del pentagrama, de 20 a 96 (la cabeza de las notas va en el 1.er espacio). */
const STAFF_LINES_Y = [20, 39, 58, 77, 96] as const;
const STEM_BOTTOM = 118;

/** x de cada nota (viewBox de 760 de ancho, proporciones del frame). */
const NOTE_X = [215, 300, 420, 565, 635] as const;

function Head({ x }: { x: number }) {
  return <ellipse cx={x} cy={HEAD_Y} rx={11} ry={8} transform={`rotate(-20 ${x} ${HEAD_Y})`} />;
}

function Stem({ x }: { x: number }) {
  return <line x1={x - 10} y1={HEAD_Y + 3} x2={x - 10} y2={STEM_BOTTOM} strokeWidth={3} />;
}

/** Corchete hacia arriba desde la punta de una plica hacia abajo; `level` apila el segundo. */
function Flag({ x, level = 0 }: { x: number; level?: number }) {
  const sx = x - 10;
  const y = STEM_BOTTOM - level * 11;
  return (
    <path
      d={`M ${sx} ${y} C ${sx + 2} ${y - 9}, ${sx + 17} ${y - 10}, ${sx + 14} ${y - 26}`}
      fill="none"
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function EighthRest({ x }: { x: number }) {
  return (
    <g fill="currentColor" stroke="currentColor">
      <circle cx={x - 3} cy={40} r={4} stroke="none" />
      <path d={`M ${x - 3} 44 Q ${x + 3} 45 ${x + 7} 36 L ${x - 1} 66`} fill="none" strokeWidth={3} />
    </g>
  );
}

type Props = {
  /** Si la escena está activa (si no, no corre el reloj). */
  playing: boolean;
  className?: string;
};

export function ClaveStaff({ playing, className }: Props) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<number>(STATIC_ACTIVE);
  const running = playing && inView && !reducedMotion;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const slot = Math.floor(((now - start) % BAR_MS) / SIXTEENTH_MS);
      let idx = 0;
      HITS.forEach((h, i) => {
        if (h <= slot) idx = i;
      });
      setActive((prev) => (prev === idx ? prev : idx));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setActive(STATIC_ACTIVE);
    };
  }, [running]);

  /** Color de la nota `i`: naranja con un leve brillo si es la que suena. */
  const noteProps = (i: number) => {
    const on = i === active;
    const color = on ? ACTIVE_COLOR : "currentColor";
    return {
      fill: color,
      stroke: color,
      style: {
        transition: "fill 220ms ease-out, stroke 220ms ease-out, filter 220ms ease-out",
        filter: on ? `drop-shadow(0 0 6px ${ACTIVE_COLOR}99)` : "none",
      },
    };
  };

  return (
    <svg
      ref={ref}
      viewBox="0 0 760 124"
      className={className}
      role="img"
      aria-label="Clave de candombe en cuatro por cuatro"
      fill="currentColor"
      stroke="currentColor"
    >
      {/* Pentagrama: cinco líneas (las de los bordes más marcadas) y barra inicial */}
      {STAFF_LINES_Y.map((y, i) => (
        <line
          key={y}
          x1={0}
          y1={y}
          x2={760}
          y2={y}
          strokeWidth={i === 0 || i === STAFF_LINES_Y.length - 1 ? 3 : 2.4}
        />
      ))}
      <line x1={1.5} y1={20} x2={1.5} y2={96} strokeWidth={3} />

      {/* Clave de percusión y compás 4/4 */}
      <rect x={35} y={37} width={8} height={40} stroke="none" />
      <rect x={51} y={37} width={8} height={40} stroke="none" />
      <g stroke="none" fontFamily="ui-sans-serif, system-ui, sans-serif" fontWeight={800} fontSize={30} textAnchor="middle">
        <text x={122} y={49}>4</text>
        <text x={122} y={87}>4</text>
      </g>

      {/* 1: corchea con puntillo + 2: semicorchea (barrados) */}
      <g {...noteProps(0)}>
        <Head x={NOTE_X[0]} />
        <Stem x={NOTE_X[0]} />
        <circle cx={NOTE_X[0] + 22} cy={HEAD_Y - 3} r={3.5} stroke="none" />
      </g>
      <g {...noteProps(1)}>
        <Head x={NOTE_X[1]} />
        <Stem x={NOTE_X[1]} />
      </g>
      <rect x={NOTE_X[0] - 11.5} y={STEM_BOTTOM - 7} width={NOTE_X[1] - NOTE_X[0] + 3} height={7} stroke="none" />
      <rect x={NOTE_X[1] - 26} y={STEM_BOTTOM - 18} width={17.5} height={6} stroke="none" />

      <EighthRest x={340} />

      {/* 3: semicorchea */}
      <g {...noteProps(2)}>
        <Head x={NOTE_X[2]} />
        <Stem x={NOTE_X[2]} />
        <Flag x={NOTE_X[2]} />
        <Flag x={NOTE_X[2]} level={1} />
      </g>

      <EighthRest x={475} />

      {/* 4: corchea */}
      <g {...noteProps(3)}>
        <Head x={NOTE_X[3]} />
        <Stem x={NOTE_X[3]} />
        <Flag x={NOTE_X[3]} />
      </g>

      {/* 5: negra */}
      <g {...noteProps(4)}>
        <Head x={NOTE_X[4]} />
        <Stem x={NOTE_X[4]} />
      </g>

      {/* Barra final */}
      <line x1={742} y1={20} x2={742} y2={96} strokeWidth={3} />
      <rect x={750} y={20} width={8} height={76} stroke="none" />
    </svg>
  );
}
