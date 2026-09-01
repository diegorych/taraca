"use client";

import {
  Facebook,
  Instagram,
  X,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntroSequence } from "@/components/providers/IntroSequenceProvider";
import { useNavbarScroll } from "@/components/providers/NavbarScrollProvider";
import { footerSocialLinks } from "@/content/footer";
import { mainNavLinks } from "@/content/nav";

/** Logo e icono de menú en tracklist (fondo claro), mismo asset con tinte */
const TRACKLIST_HEADER_ACCENT = "#5F5229";

const maskContain = {
  WebkitMaskRepeat: "no-repeat" as const,
  maskRepeat: "no-repeat" as const,
  WebkitMaskPosition: "center" as const,
  maskPosition: "center" as const,
  WebkitMaskSize: "100% auto" as const,
  maskSize: "100% auto" as const,
};

const socialIconMap = {
  Instagram,
  X,
  Facebook,
  Youtube,
} as const;

export const Navbar = () => {
  const pathname = usePathname();
  const { showHeader } = useIntroSequence();
  const { tracklistFillsViewport } = useNavbarScroll();
  const isHome = pathname === "/";
  const isVisible = !isHome || showHeader;
  const headerIconsTracklist = isHome && tracklistFillsViewport;

  const accent = headerIconsTracklist;
  const navMuted = accent ? "text-[#5F5229]/85" : "text-[#E8E4DC]/85";
  const navHover = accent ? "hover:text-[#5F5229]" : "hover:text-white";
  const socialClass = accent
    ? "text-[#5F5229]/90 transition-colors hover:text-[#5F5229]"
    : "text-[#E8E4DC]/90 transition-colors hover:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[70] will-change-transform transition-transform duration-[380ms] ease-out ${
        isVisible
          ? "translate-y-0"
          : "-translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-[1600px] items-center gap-3 px-6 py-3 md:gap-6 md:px-10 lg:gap-10">
        <Link href="/" className="pointer-events-auto shrink-0">
          {headerIconsTracklist ? (
            <span
              className="block h-[29px] w-[150px] max-w-full md:w-[188px]"
              style={{
                backgroundColor: TRACKLIST_HEADER_ACCENT,
                WebkitMaskImage: "url(/images/drexler-logo.svg)",
                maskImage: "url(/images/drexler-logo.svg)",
                ...maskContain,
              }}
              role="img"
              aria-label="Jorge Drexler"
            />
          ) : (
            <Image
              src="/images/drexler-logo.svg"
              alt="Jorge Drexler"
              width={188}
              height={29}
              className="h-auto w-[150px] md:w-[188px]"
              priority
            />
          )}
        </Link>

        <nav
          aria-label="Principal"
          className="flex min-w-0 flex-1 justify-center gap-x-3 overflow-x-auto overscroll-x-contain px-1 text-[10px] font-medium uppercase tracking-[0.12em] [scrollbar-width:none] sm:gap-x-4 sm:text-[11px] md:gap-x-5 md:text-xs lg:gap-x-6 lg:text-[13px] [&::-webkit-scrollbar]:hidden"
        >
          {mainNavLinks.map((item) => {
            const external = item.href.startsWith("http");
            const className = `shrink-0 whitespace-nowrap underline-offset-4 transition-colors ${navMuted} ${navHover}`;
            if (external) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {item.label}
                </a>
              );
            }
            return (
              <Link key={item.label} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 md:gap-3.5">
          {footerSocialLinks.map((s) => {
            const Icon = socialIconMap[s.IconName];
            return (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={socialClass}
              >
                <Icon className="size-[18px] md:size-5" strokeWidth={1.75} />
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};
