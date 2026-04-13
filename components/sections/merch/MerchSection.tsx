"use client";

import { MERCH_STORE_URL, merchProducts } from "@/content/sections";
import type { MerchProduct } from "@/lib/domain";
import { motion } from "framer-motion";
import { EB_Garamond } from "next/font/google";
import Image from "next/image";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

const merchSubtitle = EB_Garamond({
  subsets: ["latin"],
  style: "italic",
  weight: "400",
});

const MERCH_HERO_TITLE = "Tienda Oficial";

const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function formatMerchPrice(p: MerchProduct): string {
  if (p.currencyCode === "EUR") return `${p.price} €`;
  if (p.currencyCode === "USD") return `$${p.price}`;
  return `${p.price} ${p.currencyCode}`;
}

function MerchHeroTitleChars() {
  return MERCH_HERO_TITLE.split("").map((char, i) => {
    if (char === " ") {
      return (
        <span
          key={`space-${i}`}
          className="inline-block"
          aria-hidden="true"
        >
          &nbsp;
        </span>
      );
    }
    return (
      <span
        key={`${char}-${i}`}
        className="char-mask inline-block overflow-visible align-bottom [transform-style:preserve-3d]"
      >
        <span className="char inline-block will-change-transform [transform-style:preserve-3d] [backface-visibility:hidden]">
          {char}
        </span>
      </span>
    );
  });
}

export function MerchSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const chars = section.querySelectorAll<HTMLElement>(".hero-title .char");
    const subtitle = section.querySelector<HTMLElement>(".merch-hero-subtitle");
    if (chars.length === 0) return;

    /** Entrada 3D con GSAP: letras basculan en X desde “tumbadas” hacia el plano. */
    const tl = gsap.timeline({ paused: true });

    tl.from(
      chars,
      {
        duration: 0.78,
        rotationX: -78,
        opacity: 0,
        y: 40,
        z: -72,
        transformOrigin: "50% 100% 0",
        ease: "power3.out",
        stagger: 0.028,
        force3D: true,
      },
      0.06,
    );

    if (subtitle) {
      tl.from(
        subtitle,
        {
          duration: 0.58,
          rotationX: -40,
          opacity: 0,
          y: 22,
          transformOrigin: "50% 0% 0",
          ease: "power3.out",
          force3D: true,
        },
        "-=0.42",
      );
    }

    let played = false;
    let observer: IntersectionObserver | null = null;

    const play = () => {
      if (played) return;
      played = true;
      observer?.disconnect();
      tl.play(0);
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) play();
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(section);

    requestAnimationFrame(() => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh * 0.92 && rect.bottom > vh * 0.08) {
        play();
      }
    });

    return () => {
      observer?.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="merch"
      data-cursor-light-bg
      aria-labelledby="merch-heading"
      className="flex min-h-screen flex-col items-center overflow-visible bg-white px-6 pb-24 pt-24 text-black md:pt-28"
    >
      <div className="flex w-full max-w-6xl flex-col items-center xl:max-w-7xl">
        <div className="overflow-visible text-center [perspective:min(100vw,1400px)] [transform-style:preserve-3d]">
          <h2
            id="merch-heading"
            className="hero-title font-sans text-[clamp(3rem,10vw,6rem)] font-black leading-[1.05] tracking-tight text-black [transform-style:preserve-3d]"
          >
            <MerchHeroTitleChars />
          </h2>
          <p
            className={`merch-hero-subtitle mt-3 text-[clamp(1rem,2.4vw,1.375rem)] leading-tight text-neutral-500 [transform-style:preserve-3d] ${merchSubtitle.className}`}
          >
            Temporada 2026
          </p>
        </div>

        <motion.div
          className="mt-16 grid w-full grid-cols-2 gap-x-4 gap-y-10 md:mt-20 md:grid-cols-4 md:gap-x-6 md:gap-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
          variants={gridVariants}
        >
          {merchProducts.map((product) => (
            <motion.a
              key={product.id}
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-200 transition-colors duration-300 group-hover:bg-neutral-300/90">
                {product.imageSrc ? (
                  <Image
                    src={product.imageSrc}
                    alt={product.title}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : null}
              </div>
              <div className="mt-3 flex items-start justify-between gap-3 text-sm font-medium leading-snug text-black md:text-base">
                <span className="min-w-0 text-left">{product.title}</span>
                <span className="shrink-0 tabular-nums">
                  {formatMerchPrice(product)}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          className="mt-14 flex justify-center md:mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <a
            href={MERCH_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 min-w-[10rem] items-center justify-center rounded-sm bg-[#1a2744] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#141e33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Ver todo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
