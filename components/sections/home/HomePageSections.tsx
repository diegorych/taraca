import { HeroSection } from "@/components/sections/hero/HeroSection";
import { ManifestoSection } from "@/components/sections/manifesto/ManifestoSection";
import { TracklistSection } from "@/components/sections/tracklist/TracklistSection";
import { TourSection } from "@/components/sections/tour/TourSection";
import { MerchSection } from "@/components/sections/merch/MerchSection";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { TourEvent } from "@/lib/domain";

type HomePageSectionsProps = {
  tourEvents: TourEvent[];
};

export function HomePageSections({ tourEvents }: HomePageSectionsProps) {
  return (
    <main className="min-h-screen relative bg-[#0A0A0A]">
      <HeroSection />
      <ManifestoSection />
      <TracklistSection />
      <TourSection events={tourEvents} />
      <MerchSection />
      <SiteFooter />
    </main>
  );
}
