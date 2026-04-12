import type { TourEvent } from "@/lib/domain";

export interface TourEventsProvider {
  listUpcomingEvents(): Promise<TourEvent[]>;
}
