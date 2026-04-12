"use client";

import { motion } from "framer-motion";
import { EB_Garamond } from "next/font/google";
import {
  Facebook,
  Instagram,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import {
  footerContactColumns,
  footerLegalLines,
  footerSocialLinks,
} from "@/content/footer";

const ebGaramondMediumItalic = EB_Garamond({
  subsets: ["latin"],
  weight: "500",
  style: "italic",
});

const contactEase = [0.22, 1, 0.36, 1] as const;

const iconMap = {
  Instagram,
  X,
  Facebook,
  Youtube,
} as const;

const columnVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: contactEase },
  },
};

export function SiteFooter() {
  return (
    <footer id="contacto" className="relative w-full scroll-mt-4">
      <div className="bg-[#C4B04D] text-[#0A0A0A]">
        <div className="mx-auto w-full max-w-[1600px] px-6 py-14 md:px-10 md:py-16 lg:px-14 lg:py-20">
          <motion.h2
            className="text-center font-sans text-[clamp(1.5rem,4vw,2rem)] font-bold uppercase tracking-[0.22em] text-[#0A0A0A]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: contactEase }}
          >
            Contacto
          </motion.h2>

          <div className="mt-12 grid grid-cols-1 gap-12 md:mt-14 md:grid-cols-3 md:gap-10 lg:gap-14">
            {footerContactColumns.map((col, colIndex) => (
              <motion.div
                key={col.id}
                className="min-w-0 space-y-10"
                variants={columnVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
                transition={{ delay: colIndex * 0.08 }}
              >
                {col.blocks.map((block) => (
                  <div key={block.title} className="space-y-3">
                    <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#0A0A0A] md:text-[13px]">
                      {block.title}
                    </h3>
                    {block.lines.map((line) => (
                      <p
                        key={line}
                        className={`text-[15px] leading-relaxed text-[#1a1a1a] md:text-base ${ebGaramondMediumItalic.className}`}
                      >
                        {line}
                      </p>
                    ))}
                    <ul className="space-y-2">
                      {block.links.map((link) => (
                        <li key={link.href + link.label}>
                          <a
                            href={link.href}
                            className="break-words text-sm font-medium text-[#0A0A0A] underline decoration-[#0A0A0A]/35 underline-offset-[5px] transition-colors hover:decoration-[#0A0A0A]"
                            {...(link.href.startsWith("http")
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-[#0A0A0A] text-[#D2D0CE]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 py-10 md:px-10 md:py-12 lg:px-14">
          <motion.nav
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
            aria-label="Redes sociales"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: contactEase }}
          >
            {footerSocialLinks.map((item) => {
              const Icon = iconMap[item.IconName];
              return (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="text-[#D2D0CE] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D2D0CE]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A]"
                >
                  <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.35} />
                </a>
              );
            })}
          </motion.nav>

          <motion.div
            className="mt-8 max-w-3xl text-center text-[11px] leading-relaxed text-[#9a9894] sm:text-xs md:mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.1, duration: 0.45, ease: contactEase }}
          >
            <p>{footerLegalLines.copyright}</p>
            <p className="mt-2">
              Reservados todos los derechos
              <span className="mx-1.5 text-white/25" aria-hidden>
                |
              </span>
              {footerLegalLines.links.map((link, i) => (
                <span key={link.href + link.label}>
                  {i > 0 ? (
                    <span className="mx-1.5 text-white/25" aria-hidden>
                      |
                    </span>
                  ) : null}
                  <Link
                    href={link.href}
                    className="underline decoration-white/25 underline-offset-[3px] transition-colors hover:text-[#D2D0CE] hover:decoration-[#D2D0CE]/50"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
