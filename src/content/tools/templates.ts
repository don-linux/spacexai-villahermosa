import type { ExpressionId } from "@/lib/grok-bot/expressions";
import type { ColorId, ShapeId } from "@/lib/grok-bot/skins";
import type { ToolSectionSlug } from "./sections";

export type CommunityTemplate = {
  slug: string;
  section: ToolSectionSlug;
  name: string;
  author: string;
  description: string;
  /** Share link. Swap this when the real Grok Bot template URL exists. */
  href: string;
  skills: string[];
  routines: string[];
  plugins: string[];
  look: {
    shape: ShapeId;
    color: ColorId;
    expression: ExpressionId;
  };
};

export const COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    slug: "meetup-desk",
    section: "plantillas-grok-bot",
    name: "Meetup Desk",
    author: "Comunidad Villahermosa",
    description:
      "Arma el siguiente meetup en Villahermosa. Redacta el texto de Luma, el recordatorio para el grupo y el orden del día. No publica nada sin tu visto bueno.",
    href: "https://x.ai/bot/marketplace",
    skills: ["Texto para Luma", "Recordatorios", "Orden del día"],
    routines: ["Cada lunes a las 9"],
    plugins: ["Calendar", "X"],
    look: { shape: "galet", color: "violet", expression: "curieux" },
  },
];

export function templatesForSection(section: ToolSectionSlug): CommunityTemplate[] {
  return COMMUNITY_TEMPLATES.filter((template) => template.section === section);
}
