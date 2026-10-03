import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Código de conducta · SpaceXAI Villahermosa",
};

const POSITIVE_BEHAVIORS = [
  "Mostrar empatía y amabilidad hacia los demás",
  "Respetar las opiniones, puntos de vista y experiencias diferentes",
  "Ofrecer y aceptar con cortesía comentarios constructivos",
  "Asumir la responsabilidad y disculparse ante quienes se vean afectados por nuestros errores, aprendiendo de la experiencia",
  "Centrarse en lo que es mejor no solo para nosotros como individuos, sino para la comunidad en su conjunto",
];

const ENFORCEMENT_LEVELS = [
  {
    title: "Corrección",
    impact:
      "Uso de lenguaje inapropiado u otro comportamiento considerado poco profesional o inaceptable en la comunidad.",
    consequence:
      "Una advertencia privada por escrito de los líderes de la comunidad, aclarando la naturaleza de la infracción y explicando por qué el comportamiento fue inapropiado. Se podrá solicitar una disculpa pública.",
  },
  {
    title: "Advertencia",
    impact: "Una infracción derivada de un incidente aislado o de una serie de acciones.",
    consequence:
      "Una advertencia que conlleva consecuencias si persiste el comportamiento. Prohibición de interactuar con las personas involucradas —incluida la interacción no solicitada con quienes hacen cumplir el Código de Conducta— durante un periodo de tiempo determinado. Esto incluye evitar interacciones tanto en espacios comunitarios como en canales externos, como las redes sociales. El incumplimiento de estas condiciones puede dar lugar a una expulsión temporal o permanente.",
  },
  {
    title: "Expulsión temporal",
    impact:
      "Una infracción grave de las normas de la comunidad, incluido un comportamiento inapropiado continuado.",
    consequence:
      "Expulsión temporal de cualquier tipo de interacción o comunicación pública con la comunidad durante un periodo de tiempo determinado. Durante este periodo, no se permite ninguna interacción pública o privada con las personas involucradas, incluida la interacción no solicitada con quienes hacen cumplir el Código de Conducta. El incumplimiento de estas condiciones puede dar lugar a una expulsión permanente.",
  },
  {
    title: "Expulsión permanente",
    impact:
      "Demostración de un patrón de incumplimiento de las normas de la comunidad, incluido un comportamiento inapropiado continuado, el acoso a una persona o la agresión o el menosprecio hacia grupos de personas.",
    consequence: "Expulsión permanente de cualquier tipo de interacción pública dentro de la comunidad.",
  },
];

export default function CodigoDeConductaPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <article
          className="mx-auto w-full max-w-3xl px-5 py-16 md:px-6 md:py-20"
          style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
        >
          <BrandLockup />

          <h1 className="mt-10 text-center text-3xl font-semibold tracking-tight text-balance text-foreground md:text-4xl">
            Código de conducta de la comunidad SpaceXAI
          </h1>

          <section className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Nuestro compromiso
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-pretty text-foreground/80">
              <p>
                Como miembros, colaboradores y líderes, nos comprometemos a hacer de la
                participación en nuestra comunidad una experiencia libre de acoso para todos,
                independientemente de la edad, complexión física, discapacidad visible o invisible,
                etnia, características sexuales, identidad y expresión de género, nivel de
                experiencia, educación, estatus socioeconómico, nacionalidad, apariencia personal,
                raza, casta, color, religión u orientación e identidad sexual.
              </p>
              <p>
                Nos comprometemos a actuar e interactuar de manera que contribuyamos a una
                comunidad abierta, acogedora, diversa, inclusiva y saludable.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Nuestras normas</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-pretty text-foreground/80">
              <p>
                Ejemplos de comportamiento que contribuyen a un entorno positivo para nuestra
                comunidad incluyen:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                {POSITIVE_BEHAVIORS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p>Ejemplos de comportamiento inaceptable incluyen:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  El uso de lenguaje o imágenes de contenido sexual, así como atención o
                  insinuaciones sexuales de cualquier tipo
                </li>
                <li>
                  El <em className="italic">trolleo</em>, los comentarios insultantes o despectivos y los ataques
                  personales o políticos
                </li>
                <li>El acoso público o privado</li>
                <li>
                  La publicación de información privada de otras personas, como direcciones físicas
                  o de correo electrónico, sin su permiso explícito
                </li>
                <li>
                  Otras conductas que razonablemente puedan considerarse inapropiadas en un entorno
                  profesional
                </li>
              </ul>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Responsabilidades de aplicación
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-pretty text-foreground/80">
              <p>
                Los líderes de la comunidad son responsables de aclarar y hacer cumplir nuestras
                normas de comportamiento aceptable, y tomarán medidas correctivas adecuadas y
                justas ante cualquier comportamiento que consideren inapropiado, amenazante,
                ofensivo o perjudicial.
              </p>
              <p>
                Los líderes de la comunidad tienen el derecho y la responsabilidad de eliminar,
                editar o rechazar comentarios, <em className="italic">commits</em>, código, ediciones en wikis,
                incidencias (<em className="italic">issues</em>) y otras contribuciones que no se ajusten a este
                Código de conducta, y comunicarán las razones de las decisiones de moderación
                cuando proceda.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Alcance</h2>
            <p className="mt-4 text-[15px] leading-7 text-pretty text-foreground/80">
              Este Código de conducta se aplica en todos los espacios de la comunidad y también
              cuando una persona representa oficialmente a la comunidad en espacios públicos.
              Ejemplos de representación de nuestra comunidad incluyen el uso de una dirección de
              correo electrónico oficial, la publicación a través de una cuenta oficial en redes
              sociales o la actuación como representante designado en un evento en línea o
              presencial.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Aplicación de normas
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-7 text-pretty text-foreground/80">
              <p>
                Los casos de comportamiento abusivo, acoso o cualquier otra conducta inaceptable
                pueden comunicarse a los líderes de la comunidad responsables de hacer cumplir las
                normas a través de la dirección{" "}
                <a
                  href="mailto:blang@anysphere.co"
                  className="text-foreground underline decoration-foreground/40 underline-offset-2 hover:decoration-foreground"
                >
                  blang@anysphere.co
                </a>
                . Todas las quejas se revisarán e investigarán de manera rápida e imparcial.
              </p>
              <p>
                Todos los líderes de la comunidad están obligados a respetar la privacidad y la
                seguridad de la persona que notifique cualquier incidente.
              </p>
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Directrices para la aplicación de normas
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-pretty text-foreground/80">
              Los líderes de la comunidad seguirán estas directrices de impacto en la comunidad
              para determinar las consecuencias de cualquier acción que consideren una infracción
              de este Código de Conducta:
            </p>
            <ol className="mt-6 list-decimal space-y-8 pl-5 text-[15px] leading-7 text-foreground/80">
              {ENFORCEMENT_LEVELS.map((level) => (
                <li key={level.title} className="text-pretty">
                  <h3 className="text-base font-semibold text-foreground">{level.title}</h3>
                  <p className="mt-2">
                    <span className="font-semibold text-foreground">Impacto en la comunidad:</span>{" "}
                    {level.impact}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold text-foreground">Consecuencia:</span>{" "}
                    {level.consequence}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-full items-center justify-center gap-3 sm:gap-4">
      <img
        src="/brand/spacexai/spacexai-symbol-white-transparent.svg"
        alt=""
        width={834}
        height={318}
        className="theme-dark-only h-7 w-auto sm:h-9"
      />
      <img
        src="/brand/spacexai/spacexai-symbol-black-transparent.svg"
        alt=""
        width={834}
        height={318}
        className="theme-light-only h-7 w-auto sm:h-9"
      />
      <img
        src="/brand/spacexai/spacexai-wordmark-white-transparent.svg"
        alt="SpaceXAI"
        width={1294}
        height={158}
        className="theme-dark-only h-7 w-auto sm:h-9"
      />
      <img
        src="/brand/spacexai/spacexai-wordmark-black-transparent.svg"
        alt="SpaceXAI"
        width={1294}
        height={158}
        className="theme-light-only h-7 w-auto sm:h-9"
      />
    </div>
  );
}
