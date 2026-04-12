"use client";

import type { TourEvent } from "@/lib/domain";
import { TourDatesBlock } from "./TourDatesBlock";
import { TourHeaderBlock } from "./TourHeaderBlock";

type TourSectionProps = {
  events: TourEvent[];
};

export function TourSection({ events }: TourSectionProps) {
  return (
    <section id="gira" className="relative scroll-mt-4 bg-[#0D0D0D]">
      <TourHeaderBlock />
      <TourDatesBlock events={events} />
    </section>
  );
}
