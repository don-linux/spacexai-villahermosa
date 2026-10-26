import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TemplateCard } from "@/components/tools/template-card";
import { COMMUNITY_TEMPLATES } from "@/content/tools/templates";

export const metadata: Metadata = {
  title: "Herramientas de la comunidad · SpaceXAI Villahermosa",
  description: "Herramientas creadas por la comunidad para la comunidad.",
};

export default function HerramientasPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-6 md:py-16">
          <header>
            <h1 className="page-title text-4xl md:text-5xl">Herramientas de la comunidad</h1>
            <p className="mt-3 max-w-xl text-foreground/60">
              Herramientas creadas por la comunidad para la comunidad
            </p>
          </header>
          <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {COMMUNITY_TEMPLATES.map((template) => (
              <li key={template.slug} className="min-w-0">
                <TemplateCard template={template} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
