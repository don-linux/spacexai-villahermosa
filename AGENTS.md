<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Fuente

Universal Sans (los tres TTF de `src/app/fonts/`) solo trae 67 glifos, iguales en los tres cortes: espacio, coma, guion, punto, dígitos `0-9`, `A-Z`, `a-z` y la comilla tipográfica `’` (U+2019).

Por esa limitación, el texto en español no se dibuja completo en esta tipografía. No existen `á é í ó ú Á É Í Ó Ú`, `ñ Ñ`, `ü Ü`, `¿ ¡`, ni ningún otro signo fuera de esa lista (por ejemplo `! ? : ; " ' ( ) /`). Esos caracteres salen en la fuente de respaldo (`ui-sans-serif`), no en Universal Sans.

Al agregar texto, hay que tenerlo en cuenta: cualquier carácter fuera de ese juego no se verá en Universal Sans.
