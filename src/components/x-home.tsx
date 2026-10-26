import type { SVGProps } from "react";
import { GrokBotWordmark } from "@/components/credits/grok-bot-wordmark";

type AccountLogoKind = "donlinux" | "grok-bot" | "cursor" | "grok" | "x";

type Account = {
  handle: string;
  logo: AccountLogoKind;
};

const ACCOUNTS: Account[] = [
  { handle: "donlinuxdev", logo: "donlinux" },
  { handle: "bot", logo: "grok-bot" },
  { handle: "cursor_ai", logo: "cursor" },
  { handle: "grok", logo: "grok" },
  { handle: "X", logo: "x" },
];

/**
 * Last homepage section. The X logo replaces the letter in the heading and the
 * subtitle. Each account opens its profile.
 */
export function XHome() {
  return (
    <section aria-labelledby="x-home" className="px-5 pt-8 pb-28 md:px-6 md:pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <h2 id="x-home" className="page-title text-3xl text-foreground md:text-4xl">
          Lo que pasa en la comunidad se queda <span className="whitespace-nowrap">en <XMark /></span>
        </h2>
        <p className="mt-3 text-base text-pretty text-foreground/60 md:text-lg">
          Lo que pasa en los meetups tambien se vive{" "}
          <span className="whitespace-nowrap">en <XMark />.</span> Entra a la conversacion!
          <br />
          Etiqueta a las cuentas del producto con el que estes construyendo, puede que alguien del
          equipo este viendo!
        </p>
      </header>
      <ul className="x-home-grid mx-auto mt-10 w-full max-w-6xl md:mt-14">
        {ACCOUNTS.map((account) => (
          <li key={account.handle}>
            <a
              href={`https://x.com/${account.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="x-home-account"
            >
              <span className="x-home-logo">
                <AccountLogo kind={account.logo} />
              </span>
              <span className="pill pill-solid">@{account.handle}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function XMark() {
  return (
    <span className="x-home-mark">
      <XLogo role="img" aria-label="X" aria-hidden={false} />
    </span>
  );
}

function AccountLogo({ kind }: { kind: AccountLogoKind }) {
  switch (kind) {
    case "donlinux":
      return (
        <ThemeWordmark
          onDark="/brand/donlinux/logo-dark.svg"
          onLight="/brand/donlinux/logo-light.svg"
          width={802}
          height={98}
        />
      );
    case "grok-bot":
      return <GrokBotWordmark aria-hidden />;
    case "cursor":
      return (
        <ThemeWordmark
          onDark="/brand/cursor/wordmark-dark.svg"
          onLight="/brand/cursor/wordmark-light.svg"
          width={1655}
          height={279}
        />
      );
    case "grok":
      return (
        <ThemeWordmark
          onDark="/brand/grok/Grok_Wordmark_Light.svg"
          onLight="/brand/grok/Grok_Wordmark_Dark.svg"
          width={1024}
          height={400}
        />
      );
    case "x":
      return <XLogo aria-hidden className="x-home-logo-x" />;
  }
}

/** Official X mark, viewBox tight to the glyph so it fills the box. */
function XLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1200 1227" fill="currentColor" aria-hidden {...props}>
      <path d="M714.2 519.3 1160.9 0H1055L667.1 450.9 357.3 0H0l468.5 681.8L0 1226.4h105.9l409.6-476.2 327.2 476.2H1200L714.2 519.3Zm-145 168.5-47.5-67.9L144 79.7h162.6l304.8 436 47.5 67.9 396.2 566.7H892.5L569.2 687.8Z" />
    </svg>
  );
}

function ThemeWordmark({
  onDark,
  onLight,
  width,
  height,
}: {
  onDark: string;
  onLight: string;
  width: number;
  height: number;
}) {
  return (
    <>
      <img src={onDark} alt="" width={width} height={height} className="theme-dark-only" />
      <img src={onLight} alt="" width={width} height={height} className="theme-light-only" />
    </>
  );
}
