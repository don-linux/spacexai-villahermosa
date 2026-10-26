"use client";

import { useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { GrokBot } from "@/components/credits/grok-bot";
import type { CommunityTemplate } from "@/content/tools/templates";
import { templateQrSvg } from "@/lib/claim-qr";
import { useResolvedTheme, type ResolvedTheme } from "@/lib/theme";

const PAPER: Record<ResolvedTheme, string> = { dark: "#0a0a0a", light: "#ffffff" };
const subscribeNothing = () => () => {};
const MARK_SRC = "/brand/grok-bot/bw/01.svg";

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

  if (presentation === "list") {
    return <ListCard template={template} theme={theme} mounted={mounted} />;
  }

  return <FlipCard template={template} theme={theme} mounted={mounted} />;
}

function ListCard({
  template,
  theme,
  mounted,
}: {
  template: CommunityTemplate;
  theme: ResolvedTheme;
  mounted: boolean;
}) {
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

function FlipCard({
  template,
  theme,
  mounted,
}: {
  template: CommunityTemplate;
  theme: ResolvedTheme;
  mounted: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    setFlipped((current) => !current);
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) return;
    toggle();
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key !== "Enter" && event.key !== " " && event.code !== "Space") return;
    event.preventDefault();
    toggle();
  }

  return (
    <article
      className="template-flip cursor-pointer"
      tabIndex={0}
      aria-label={
        flipped ? `Volver a ${template.name}` : `Mostrar el código QR de ${template.name}`
      }
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      <div className="template-flip-inner" data-turned={flipped ? "true" : "false"}>
        <div
          className={`template-flip-face template-flip-front flex h-full flex-col rounded-3xl border border-foreground/[0.08] p-5 md:p-6 ${
            flipped ? "pointer-events-none" : ""
          }`}
          inert={flipped}
          aria-hidden={flipped}
        >
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

          <div className="mt-6 flex justify-center border-t border-foreground/[0.06] pt-4">
            <AddLink href={template.href} />
          </div>
        </div>

        <div
          className={`template-flip-face template-flip-back flex h-full flex-col items-center justify-center rounded-3xl border border-foreground/[0.08] bg-white px-6 py-5 text-[#111111] ${
            flipped ? "" : "pointer-events-none"
          }`}
          inert={!flipped}
          aria-hidden={!flipped}
        >
          <TemplateQr href={template.href} name={template.name} />
        </div>
      </div>
    </article>
  );
}

function TemplateQr({ href, name }: { href: string; name: string }) {
  const qr = templateQrSvg(href);
  if (!qr) {
    return <p className="template-qr-name">Esta plantilla no tiene un enlace.</p>;
  }

  return (
    <div className="template-qr">
      <div className="relative w-full" role="img" aria-label={`Código QR de ${name}`}>
        <div
          className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
          dangerouslySetInnerHTML={{ __html: qr.svg }}
        />
        <img
          src={MARK_SRC}
          alt=""
          width={126}
          height={126}
          draggable={false}
          className="pointer-events-none absolute top-1/2 left-1/2 h-auto -translate-x-1/2 -translate-y-1/2"
          style={{ width: `calc(${qr.markSize * 100}% + 2px)` }}
        />
      </div>
      <p className="template-qr-label">Grok Bot</p>
      <p className="template-qr-name">{name}</p>
    </div>
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
      onClick={stopCardFlip}
    >
      Agregar a Grok Bot
    </a>
  );
}

function stopCardFlip(event: MouseEvent<HTMLAnchorElement>) {
  event.stopPropagation();
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
