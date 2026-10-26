"use client";

import { useSyncExternalStore } from "react";
import { GrokBot } from "@/components/credits/grok-bot";
import type { CommunityTemplate } from "@/content/tools/templates";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";

const PAPER: Record<ResolvedTheme, string> = { dark: "#0a0a0a", light: "#ffffff" };
const subscribeNothing = () => () => {};

const cardFont = { fontFamily: "ui-sans-serif, system-ui, sans-serif" } as const;

export function TemplateCard({
  template,
  presentation,
}: {
  template: CommunityTemplate;
  presentation: "grid" | "list";
}) {
  const theme = useResolvedTheme();
  const mounted = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const list = presentation === "list";

  if (list) {
    return (
      <article className="flex flex-col gap-4 rounded-2xl border border-foreground/[0.08] p-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <BotFace template={template} theme={theme} mounted={mounted} />
          <div className="min-w-0" style={cardFont}>
            <h2 className="truncate text-[15px] leading-snug font-medium text-foreground">
              {template.name}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-foreground/50">{template.author}</p>
            <p className="mt-1 truncate text-sm text-foreground/70">{template.description}</p>
          </div>
        </div>
        <AddLink href={template.href} />
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col rounded-3xl border border-foreground/[0.08] p-5 md:p-6">
      <div className="flex items-center gap-4">
        <BotFace template={template} theme={theme} mounted={mounted} />
        <div className="min-w-0" style={cardFont}>
          <h2 className="text-xl text-foreground">{template.name}</h2>
          <p className="mt-1 text-sm text-foreground/50">{template.author}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-foreground/70" style={cardFont}>
        {template.description}
      </p>

      <div className="mt-5 flex flex-col gap-4" style={cardFont}>
        <ChipList label="Habilidades" items={template.skills} />
        <ChipList label="Rutinas" items={template.routines} />
        <ChipList label="Plugins" items={template.plugins} />
      </div>

      <div
        className="mt-6 flex flex-col gap-3 border-t border-foreground/[0.06] pt-4"
        style={cardFont}
      >
        <a
          href={template.href}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-[13px] text-foreground/45 underline decoration-foreground/20 underline-offset-2 transition-colors hover:text-foreground"
        >
          {template.href}
        </a>
        <AddLink href={template.href} />
      </div>
    </article>
  );
}

function BotFace({
  template,
  theme,
  mounted,
}: {
  template: CommunityTemplate;
  theme: ResolvedTheme;
  mounted: boolean;
}) {
  return (
    <div className="size-20 shrink-0 [&_svg]:block [&_svg]:h-full [&_svg]:w-full" aria-hidden>
      {mounted ? (
        <GrokBot
          state="idle"
          shape={template.look.shape}
          color={template.look.color}
          expression={template.look.expression}
          paper={PAPER[theme]}
          decorative
        />
      ) : null}
    </div>
  );
}

function AddLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="pill pill-solid w-fit shrink-0"
    >
      Agregar a Grok Bot
    </a>
  );
}

function ChipList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-medium tracking-wide text-foreground/40 uppercase">{label}</h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-[13px] text-foreground/80"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
