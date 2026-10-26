export type ToolSectionSlug = "plantillas-grok-bot";

export type ToolSection = {
  slug: ToolSectionSlug;
  title: string;
  description: string;
};

export const TOOL_SECTIONS: readonly ToolSection[] = [
  {
    slug: "plantillas-grok-bot",
    title: "Plantillas de Grok Bot",
    description: "Bots listos para agregar, hechos por la comunidad.",
  },
];

export function templateCountLabel(count: number): string {
  return count === 1 ? "1 plantilla" : `${count} plantillas`;
}

export function getToolSection(slug: ToolSectionSlug): ToolSection | undefined {
  return TOOL_SECTIONS.find((section) => section.slug === slug);
}
