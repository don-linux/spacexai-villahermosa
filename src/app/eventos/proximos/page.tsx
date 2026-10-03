import type { Metadata } from "next";
import { EventCard, type PastEventCardData } from "@/components/events/event-card";
import { upcomingMeetup } from "@/content/events/upcoming";

export const metadata: Metadata = {
  title: "Proximos meetups · SpaceXAI Villahermosa",
  description: "El siguiente meetup de SpaceXAI en Villahermosa.",
};

const EMPTY_COPY =
  "Ups! Por el momento no hay eventos planeados, vuelve aqui despues para ver si hay algo ;)";

const card: PastEventCardData | null = upcomingMeetup
  ? {
      slug: upcomingMeetup.slug,
      title: upcomingMeetup.title,
      date: upcomingMeetup.date,
      city: upcomingMeetup.city,
      venue: upcomingMeetup.venue,
      lumaUrl: upcomingMeetup.lumaUrl,
      cover: upcomingMeetup.cover,
    }
  : null;

export default function UpcomingMeetupsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-6 md:py-16">
      <header>
        <h1 className="page-title text-4xl md:text-5xl">Proximos meetups</h1>
        <p className="mt-3 max-w-xl text-foreground/60">El siguiente meetup de la comunidad.</p>
      </header>
      {card ? (
        <ul className="mt-8">
          <li>
            <EventCard
              event={card}
              presentation="feature"
              hrefBase="/eventos/proximos"
              preload
            />
          </li>
        </ul>
      ) : (
        <p className="mt-10 max-w-xl text-foreground/60">{EMPTY_COPY}</p>
      )}
    </div>
  );
}
