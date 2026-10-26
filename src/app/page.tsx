import { BotCradle } from "@/components/bot-cradle";
import { CursorHome } from "@/components/cursor-home";
import { GrokModel } from "@/components/grok-model";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { IntroGate } from "./intro-gate";

export default function Home() {
  return (
    <IntroGate>
      <SiteHeader />
      {/* 4rem is the sticky header's height, so the hero alone fills the first screen. */}
      <main className="flex flex-1 flex-col">
        <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
          <Hero />
        </div>
        <BotCradle />
        <CursorHome />
        <GrokModel />
      </main>
      <SiteFooter />
    </IntroGate>
  );
}
