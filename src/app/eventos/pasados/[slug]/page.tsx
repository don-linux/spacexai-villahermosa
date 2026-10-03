import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventGallery } from "@/components/events/event-gallery";
import { LumaTicket } from "@/components/events/luma-ticket";
import { getPastEvent, pastEvents } from "@/content/events";

export function generateStaticParams() {
  return pastEvents.map((event) => ({ slug: event.slug }));
}

export const dynamicParams = false;

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = getPastEvent(slug);
  if (!event) return { title: "Eventos pasados · SpaceXAI Villahermosa" };
  return {
    title: `${event.title} · SpaceXAI Villahermosa`,
    description: event.summary,
  };
}

export default async function PastEventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = getPastEvent(slug);
  if (!event) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-6 md:py-16">
      <Link
        href="/eventos/pasados"
        className="text-sm text-foreground/55 transition-colors hover:text-foreground"
      >
        Eventos pasados
      </Link>
      <h1 className="page-title mt-4 text-4xl md:text-5xl">{event.title}</h1>
      <p className="mt-4 text-base text-foreground/70">{event.date}</p>
      <p className="mt-1 text-base text-foreground/70">{event.venue}</p>
      <p className="mt-4 max-w-2xl text-foreground/60">{event.summary}</p>
      {event.lumaUrl ? (
        <div className="mt-10">
          <LumaTicket href={event.lumaUrl} image={event.cover} />
        </div>
      ) : null}
      <EventGallery flyers={event.flyers} photos={event.photos} />
    </div>
  );
}
