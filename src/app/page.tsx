import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { IntroGate } from "./intro-gate";

export default function Home() {
  return (
    <IntroGate>
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </IntroGate>
  );
}
