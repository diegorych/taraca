import { HomePageSections } from "@/components/sections/home/HomePageSections";
import { getTourEventsProvider } from "@/lib/integrations/bandsintown";

export default async function Home() {
  const tourEvents = await getTourEventsProvider().listUpcomingEvents();
  return <HomePageSections tourEvents={tourEvents} />;
}
