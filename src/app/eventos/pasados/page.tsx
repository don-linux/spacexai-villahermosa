import type { Metadata } from "next";
import { PastEventsBrowser } from "@/components/events/past-events-browser";
import type { PastEventCardData } from "@/components/events/event-card";
import { pastEvents } from "@/content/events";

export const metadata: Metadata = {
  title: "Eventos pasados · SpaceXAI Villahermosa",
  description: "Fotos y programa de los meetups de SpaceXAI en Villahermosa.",
};

const cards: PastEventCardData[] = pastEvents.map((event) => ({
  slug: event.slug,
  title: event.title,
  date: event.date,
  city: event.city,
  venue: event.venue,
  lumaUrl: event.lumaUrl,
  cover: event.cover,
}));

export default function PastEventsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-6 md:py-16">
      <PastEventsBrowser events={cards} />
    </div>
  );
}
