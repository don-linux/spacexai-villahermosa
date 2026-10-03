import type { StaticImageData } from "next/image";

export type EventImage = {
  src: StaticImageData;
  alt: string;
};

export type EventFlyer = EventImage & {
  title: string;
  speaker: string;
};

export type PastEvent = {
  slug: string;
  title: string;
  /** Visible date line, as it should read on the page. */
  date: string;
  city: string;
  venue: string;
  summary: string;
  lumaUrl?: string;
  cover: EventImage;
  flyers: EventFlyer[];
  /** First photo is the wide tile at the top of the mosaic. */
  photos: EventImage[];
};
