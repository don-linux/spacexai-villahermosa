import Link from "next/link";

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

  return (
    <Link
      href={`/herramientas/${section.slug}`}
      className={
        list
          ? "flex items-center justify-between gap-4 rounded-2xl border border-foreground/10 p-3 transition-colors hover:border-foreground/25"
          : "flex h-full flex-col gap-2 rounded-2xl border border-foreground/10 p-4 transition-colors hover:border-foreground/25"
      }
    >
      <span className="min-w-0">
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
