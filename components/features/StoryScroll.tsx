"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { useLenis } from "@/components/providers/LenisProvider";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";
import { MANIFESTO_SCENE_STOPS } from "@/components/sections/manifesto/ManifestoSection";

/**
 * Scroll por escenas entre el hero y el manifiesto: un gesto de scroll lleva a la escena
 * siguiente con un desplazamiento automático, y las transiciones atadas al scroll se
 * reproducen en el camino. Desde el manifiesto hacia abajo (incluida la transición a
 * «estar acá») el scroll es libre.
 */

/** Silencio de rueda (ms) que marca el fin de un gesto / de la inercia del trackpad. */
const WHEEL_GESTURE_GAP_MS = 220;
/** Un pico así respecto del evento anterior es un gesto nuevo aunque siga la inercia. */
const WHEEL_NEW_GESTURE_RATIO = 1.6;
const WHEEL_NEW_GESTURE_MIN_DELTA = 30;
const WHEEL_MIN_DELTA = 4;
/**
 * Recorrido mínimo para pasar de escena, en las unidades de Lenis (dedo × touchMultiplier 2):
 * ≈45px de dedo, así un roce no cambia de escena.
 */
const TOUCH_MIN_DISTANCE = 90;
/** Tolerancia (px) para considerar que ya estamos en una parada. */
const STOP_EPSILON = 4;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Duración según la distancia: escenas cercanas pasan más rápido, nunca brusco. */
function travelDuration(distancePx: number) {
  const vh = distancePx / window.innerHeight;
  return Math.min(2.2, Math.max(1.1, 0.9 + vh * 0.9));
}

/** Posiciones de scroll (px) de cada escena en reposo. */
function sceneStops(): number[] {
  const manifesto = document.getElementById("manifesto");
  if (!manifesto) return [];
  const manifestoTop = manifesto.getBoundingClientRect().top + window.scrollY;
  const manifestoRange = manifesto.offsetHeight - window.innerHeight;
  return [0, ...MANIFESTO_SCENE_STOPS.map((p) => manifestoTop + p * manifestoRange)];
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT", "IFRAME"].includes(target.tagName)
  );
}

/** Un overlay (p. ej. el video de YouTube) puede pausar el scroll por escenas. */
function isPaused() {
  return document.querySelector("[data-story-scroll-pause]") !== null;
}

function startStoryScroll(lenis: Lenis) {
  let travelling = false;
  /** Tras un viaje, se ignora la inercia hasta que el gesto termina o empieza otro. */
  let awaitingNewGesture = false;
  let lastWheelAt = 0;
  let lastWheelAbs = 0;
  let touchDistance = 0;

  /** Dirección +1 / -1; devuelve false si no hay escena hacia ese lado. */
  const travel = (dir: number, stops = sceneStops()) => {
    const y = lenis.scroll;
    const target =
      dir > 0
        ? stops.find((s) => s > y + STOP_EPSILON)
        : [...stops].reverse().find((s) => s < y - STOP_EPSILON);
    if (target === undefined) return false;
    travelling = true;
    awaitingNewGesture = true;
    lenis.scrollTo(target, {
      duration: travelDuration(Math.abs(target - y)),
      easing: easeInOutCubic,
      lock: true,
      force: true,
      onComplete: () => {
        travelling = false;
      },
    });
    return true;
  };

  /**
   * ¿Este gesto lo maneja el scroll por escenas? Sí dentro de la zona inmersiva, o al
   * subir desde más abajo cuando el scroll libre entraría en ella.
   */
  const handles = (dir: number, stops: number[], nextY: number) => {
    const last = stops[stops.length - 1];
    if (last === undefined) return false;
    const y = lenis.scroll;
    if (y < last - STOP_EPSILON) return true;
    return dir < 0 && nextY < last + STOP_EPSILON;
  };

  lenis.options.virtualScroll = ({ deltaY, event }) => {
    if (isPaused() || event.ctrlKey) return true;
    const stops = sceneStops();
    const dir = Math.sign(deltaY);

    if (event.type === "wheel") {
      const now = performance.now();
      const abs = Math.abs(deltaY);
      const gap = now - lastWheelAt;
      const prevAbs = lastWheelAbs;
      lastWheelAt = now;
      lastWheelAbs = abs;

      if (!travelling && !handles(dir, stops, lenis.targetScroll + deltaY)) return true;
      if (event.cancelable) event.preventDefault();
      if (travelling) return false;
      if (awaitingNewGesture) {
        const isNewGesture =
          gap > WHEEL_GESTURE_GAP_MS ||
          (abs > prevAbs * WHEEL_NEW_GESTURE_RATIO && abs > WHEEL_NEW_GESTURE_MIN_DELTA);
        if (!isNewGesture) return false;
        awaitingNewGesture = false;
      }
      if (abs >= WHEEL_MIN_DELTA) travel(dir, stops);
      return false;
    }

    // Touch: se acumula el recorrido del dedo y se decide al soltar.
    if (event.type === "touchmove") {
      if (!travelling && !handles(dir, stops, lenis.scroll + touchDistance + deltaY)) {
        touchDistance = 0;
        return true;
      }
      if (event.cancelable) event.preventDefault();
      touchDistance += deltaY;
      return false;
    }
    if (event.type === "touchend") {
      const distance = touchDistance;
      touchDistance = 0;
      if (distance === 0) return true;
      if (!travelling && Math.abs(distance) >= TOUCH_MIN_DISTANCE) {
        travel(Math.sign(distance), stops);
      }
      return false;
    }
    return true;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    if (isEditableTarget(e.target) || isPaused()) return;
    const down = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
    const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
    if (!down && !up) return;
    const dir = down ? 1 : -1;
    const stops = sceneStops();
    if (!travelling && !handles(dir, stops, lenis.scroll + dir * window.innerHeight * 0.1)) {
      return;
    }
    e.preventDefault();
    if (!travelling) travel(dir, stops);
  };
  window.addEventListener("keydown", onKeyDown);

  return () => {
    lenis.options.virtualScroll = undefined;
    window.removeEventListener("keydown", onKeyDown);
  };
}

export function StoryScroll() {
  const lenis = useLenis();
  const { preloaderFinished } = useIntroSequence();

  useEffect(() => {
    if (!lenis || !preloaderFinished) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    return startStoryScroll(lenis);
  }, [lenis, preloaderFinished]);

  return null;
}
