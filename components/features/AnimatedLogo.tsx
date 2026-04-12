"use client";

import Image from "next/image";

export const AnimatedLogo = () => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="relative z-10 w-[min(92vw,22rem)] sm:w-96 md:w-[28rem] lg:w-[38rem] xl:w-[32rem] h-auto">
        <Image
          src="/images/logo.png"
          alt="Taraca Album Logo"
          width={880}
          height={440}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
};
