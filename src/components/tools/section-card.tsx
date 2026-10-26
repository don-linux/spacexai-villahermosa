import Link from "next/link";
import { GrokBotWordmark } from "@/components/credits/grok-bot-wordmark";

export type ToolSectionCardData = {
  slug: string;
  title: string;
  description: string;
  countLabel: string;
};

export function SectionCard({
  section,
  presentation,
}: {
  section: ToolSectionCardData;
  presentation: "grid" | "list";
}) {
  const list = presentation === "list";
  const wordmark = section.slug === "plantillas-grok-bot";

  return (
    <Link
      href={`/herramientas/${section.slug}`}
      className={
        list
          ? wordmark
            ? "flex flex-col gap-3 rounded-2xl border border-foreground/10 p-3 transition-colors hover:border-foreground/25 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            : "flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 p-3 transition-colors hover:border-foreground/25"
          : "flex h-full flex-col gap-2 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-foreground/25"
      }
    >
      {wordmark ? (
        <GrokBotWordmark
          aria-hidden
          className={
            list
              ? "block aspect-[317.7/60.94] h-8 w-auto max-w-full self-start sm:h-7"
              : "block aspect-[317.7/60.94] h-9 w-auto max-w-full self-start"
          }
        />
      ) : null}
      <span className={list ? "min-w-0 flex-1" : "min-w-0"}>
        <h2 className="text-[15px] leading-snug font-medium text-balance">{section.title}</h2>
        <span className={`mt-1 block text-[13px] text-foreground/60 ${list ? "truncate" : ""}`}>
          {section.description}
        </span>
      </span>
      <span className={`text-[13px] text-foreground/60 ${list ? "shrink-0" : "mt-auto pt-3"}`}>
        {section.countLabel}
      </span>
    </Link>
  );
}
