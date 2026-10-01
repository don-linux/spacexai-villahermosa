import type { Metadata } from "next";
import { CreditsWall } from "@/components/credits/credits-wall";
import { isHttpUrl, qrSvg } from "@/lib/claim-qr";

export const metadata: Metadata = {
  title: "Créditos · SpaceXAI Villahermosa",
  description: "Canjea los créditos del meetup de Grok en Villahermosa.",
};

// Read at build time, like any env var of a static page: changing one needs a redeploy.
export default function CreditsPage() {
  const claimUrl = process.env.CREDITS_CLAIM_URL;
  const lumaUrl = process.env.LUMA_EVENT_URL;

  return (
    <CreditsWall
      qrSvg={isHttpUrl(claimUrl) ? qrSvg(claimUrl) : null}
      lumaUrl={isHttpUrl(lumaUrl) ? lumaUrl.trim() : null}
    />
  );
}
