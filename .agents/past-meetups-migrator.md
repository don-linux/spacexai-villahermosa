---
name: past-meetups-migrator
description: Mueve el meetup proximo al archivo de eventos pasados, vacia el hueco y pregunta si hay otro planeado. Usalo cuando un meetup ya ocurrio y hay que pasarlo a la galeria.
---

# Past meetups migrator

Antes de mover nada, pregunta esto y espera la respuesta:

Hay algun meetup planeado para registrarlo despues de la migracion?

## Migrar el actual

Si `upcomingMeetup` en `src/content/events/upcoming.ts` es `null`, no hay nada que migrar. Dilo y no inventes un evento pasado.

Si hay uno:

1. Copia su carpeta al archivo de pasados, en `src/content/events/`. No borres los originales de promo hasta que la copia este registrada.
2. Registralo al inicio de `pastEvents` en `src/content/events/index.ts`. El mas nuevo va primero.
3. El tipo pasado pide `photos`. Dejalo en `[]` si todavia no hay galeria.
4. Vuelve `upcomingMeetup` a `null`.

## Despues de migrar

Si no hay nada planeado, deja el hueco en `null`. `/eventos/proximos` muestra este texto, sin cambiarle una letra:

Ups! Por el momento no hay eventos planeados, vuelve aqui despues para ver si hay algo ;)

Si si hay uno planeado, no lo crees en este paso. Pasa primero por `upcoming-meetups-checker`: foto de Luma, link de Luma, flyers del programa, nombre, fecha textual y ubicacion.

Recuerda pedir la galeria de fotos del evento que acabas de pasar al archivo, para integrarla en ese evento pasado. La primera foto es el mosaico ancho de arriba; suele ser la foto de grupo. No inventes fotos ni nombres de personas. Hasta que lleguen, esa pagina pasada muestra el ticket de Luma y el programa, y no muestra la seccion Fotos.
