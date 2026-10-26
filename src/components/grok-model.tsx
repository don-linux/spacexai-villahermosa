/**
 * Homepage section for the Grok model. The official wordmark replaces the word "Grok"
 * in the heading, the same way the other homepage sections carry their names.
 * xAI names the files by ink: Light is white, Dark is #0A0A0A.
 */
export function GrokModel() {
  return (
    <section aria-labelledby="grok-model" className="px-5 pt-8 pb-28 md:px-6 md:pt-12">
      <header className="mx-auto max-w-2xl text-center">
        <h2 id="grok-model" className="page-title text-3xl text-foreground md:text-4xl">
          La Super Inteligencia en un solo modelo, eso es{" "}
          <span className="grok-model-wordmark">
            <img
              src="/brand/grok/Grok_Wordmark_Light.svg"
              alt="Grok"
              width={1024}
              height={400}
              className="theme-dark-only"
            />
            <img
              src="/brand/grok/Grok_Wordmark_Dark.svg"
              alt="Grok"
              width={1024}
              height={400}
              className="theme-light-only"
            />
          </span>
        </h2>
        <p className="mt-3 text-base text-pretty text-foreground/60 md:text-lg">
          Contexto largo y herramientas, directamente desde los laboratorios de SpaceXAI hasta
          Villahermosa.
        </p>
      </header>
      <div aria-hidden className="grok-model-mark mx-auto mt-10 md:mt-14">
        <img
          src="/brand/grok/Grok_Logomark_Light.svg"
          alt=""
          width={1024}
          height={1024}
          className="theme-dark-only"
        />
        <img
          src="/brand/grok/Grok_Logomark_Dark.svg"
          alt=""
          width={1024}
          height={1024}
          className="theme-light-only"
        />
      </div>
    </section>
  );
}
