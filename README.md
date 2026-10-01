# SpaceXAI Villahermosa

Sitio en Next.js para SpaceXAI Villahermosa, desplegado en Vercel.

## Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

Las dos son opcionales y solo afectan a `/creditos`. Para desarrollo, copia `.env.example` a `.env.local`; en Vercel, agrégalas en Settings > Environment Variables.

| Variable            | Si existe                                                            | Si no existe                                          |
| ------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `CREDITS_CLAIM_URL` | "Canjear créditos" muestra un QR con este link                       | Muestra el aviso de que no hay ningún evento en curso |
| `LUMA_EVENT_URL`    | El logo de Luma, arriba a la derecha, abre el evento en otra pestaña | No se muestra el logo                                 |

Solo cuentan los links `http://` o `https://`. La página se genera en el build, así que cambiar una variable requiere un nuevo deploy.

## Créditos

El Grok Bot de `/creditos` es un port de [grok-bot-meetup](https://github.com/MatiasBoldrini/grok-bot-meetup). Su motor, en `src/lib/grok-bot/`, es de Jérémy Perret, con licencia MIT.

## Build de producción

```bash
npm run build
npm start
```
