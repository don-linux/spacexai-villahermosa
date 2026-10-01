import { ThemeToggle } from "./theme-toggle";

type FooterGroup = { title: string; links: string[] };

// Placeholder links until the real sections exist; each column stacks one or two groups.
const FOOTER_COLUMNS: FooterGroup[][] = [
  [
    { title: "Comunidad", links: ["Sobre nosotros", "Créditos", "Código de conducta"] },
    { title: "Organizadores", links: ["Equipo", "Voluntariado", "Patrocinios"] },
  ],
  [
    { title: "Eventos", links: ["Próximos meetups", "Eventos pasados", "Calendario"] },
    { title: "Talleres", links: ["Grok", "API de SpaceXAI", "Hackathons"] },
  ],
  [
    { title: "Recursos", links: ["Guías", "Documentación", "Noticias"] },
    { title: "Herramientas", links: ["Plantillas", "Ejemplos", "Lo que usa la comunidad"] },
  ],
  [
    { title: "Únete", links: ["Discord", "WhatsApp", "Newsletter"] },
    { title: "Social", links: ["X", "YouTube", "Instagram"] },
  ],
  [{ title: "Legal", links: ["Privacidad", "Términos de uso", "Contacto"] }],
];

// The sections that already exist; every other link stays a placeholder.
const FOOTER_HREFS: Record<string, string> = { Créditos: "/creditos" };

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/[0.06]">
      <div className="reveal mx-auto grid w-full max-w-6xl gap-x-10 gap-y-12 px-5 pt-14 pb-10 md:px-6 lg:grid-cols-[13rem_1fr] lg:grid-rows-[auto_1fr]">
        <div className="flex flex-col gap-4">
          <a href="/" className="block w-fit rounded-sm outline-offset-4">
            <img
              src="/brand/spacexai/spacexai-wordmark-white-transparent.svg"
              alt="SpaceXAI"
              width={1294}
              height={158}
              className="theme-dark-only h-4 w-auto"
            />
            <img
              src="/brand/spacexai/spacexai-wordmark-black-transparent.svg"
              alt="SpaceXAI"
              width={1294}
              height={158}
              className="theme-light-only h-4 w-auto"
            />
          </a>
          <p className="text-[13px] text-foreground/50">© 2026 SpaceXAI Villahermosa</p>
        </div>

        <nav
          aria-label="Pie de página"
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:grid-cols-5 lg:border-l lg:border-foreground/[0.06] lg:pl-10"
        >
          {FOOTER_COLUMNS.map((groups) => (
            <div key={groups[0].title} className="flex flex-col gap-8">
              {groups.map((group) => (
                <div key={group.title}>
                  <h2 className="text-[13px] font-medium text-foreground">{group.title}</h2>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {group.links.map((label) => (
                      <li key={label}>
                        <a
                          href={FOOTER_HREFS[label] ?? "#"}
                          className="text-[13px] text-foreground/55 transition-colors hover:text-foreground"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </nav>

        <div className="-ml-1.5 flex items-end">
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
