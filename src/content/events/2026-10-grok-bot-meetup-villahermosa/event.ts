import type { PastEvent } from "../types";
import coverLuma from "./promo/cover-luma.png";
import flyerFernando from "./promo/flyer-fernando-diaz.png";
import flyerJoryer from "./promo/flyer-joryer-jimenez.png";
import photoAudience from "./photos/audiencia-sentada.jpg";
import photoWelcome from "./photos/banner-welcome.jpg";
import photoGroup from "./photos/grupo-puerta.jpg";
import photoSpeakerAws from "./photos/orador-aws-builder.jpg";
import photoSpeakerBottle from "./photos/orador-botella.jpg";
import photoHall from "./photos/pasillo-papel-picado.jpg";

export const grokBotMeetupVillahermosa = {
  slug: "grok-bot-meetup-villahermosa-2026-10",
  title: "Grok Bot Meetup Villahermosa",
  date: "jueves 1 de octubre de 2026",
  city: "Villahermosa",
  venue: "Algorithmics Villahermosa",
  summary: "Primer meetup de la comunidad en Algorithmics Villahermosa.",
  lumaUrl: "https://luma.com/spacexai-chzd",
  cover: {
    src: coverLuma,
    alt: "Poster de Luma con cuatro figuras de Grok. October 1st. 2026. Villahermosa, MX",
  },
  flyers: [
    {
      src: flyerFernando,
      alt: "Flyer de la charla Introduccion a Grok Bot, de Fernando Diaz",
      title: "Introduccion a Grok Bot",
      speaker: "Fernando Diaz",
    },
    {
      src: flyerJoryer,
      alt: "Flyer de la charla Crea Tu Primer Agente de IA, de Joryer Jimenez",
      title: "Crea Tu Primer Agente de IA",
      speaker: "Joryer Jimenez",
    },
  ],
  photos: [
    {
      src: photoGroup,
      alt: "Foto de grupo en la puerta, con papel picado y un banner de Welcome",
    },
    {
      src: photoHall,
      alt: "Pasillo con papel picado y personas de pie",
    },
    {
      src: photoWelcome,
      alt: "Dos personas frente al banner de Welcome",
    },
    {
      src: photoSpeakerAws,
      alt: "Persona gesticulando, con una camisa de AWS Builder",
    },
    {
      src: photoAudience,
      alt: "Personas sentadas durante una charla",
    },
    {
      src: photoSpeakerBottle,
      alt: "Persona hablando, con una botella de agua",
    },
  ],
} satisfies PastEvent;
