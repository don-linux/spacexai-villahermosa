---
name: upcoming-meetups-checker
description: Antes de programar el siguiente meetup, comprueba que esten la foto de Luma, el link de Luma y los flyers del programa. Usalo cuando pidan agregar, publicar o calendarizar el proximo meetup.
---

# Upcoming meetups checker

Hay un solo hueco: `upcomingMeetup` en `src/content/events/upcoming.ts`. Si ya no es `null`, no agregues otro. Di que primero hay que pasar el que esta planeado al archivo, con el subagente `past-meetups-migrator`.

No escribas archivos del evento hasta tener todo lo de abajo. Si falta algo, deten la creacion y lista exactamente lo que falta. No inventes fotos, links, titulos ni nombres.

## Assets

- Foto de portada de Luma. Es la cara del listado y del ticket. No es una foto del lugar.
- Link de Luma, con la forma `https://luma.com/...`.
- Un flyer por charla. De cada uno: el archivo de imagen, el titulo y el nombre tal como estan impresos en el flyer.

## Texto de la tarjeta

- Nombre del evento.
- Fecha textual, como se lee en la pagina. Ejemplo: `jueves 1 de octubre de 2026`.
- Ubicacion (`venue`), el lugar donde se hace.

## Cuando ya esta todo

1. Copia los archivos a una carpeta nueva bajo `src/content/events/`, sin mover ni borrar los originales que te pasaron.
2. Importa cada imagen con una ruta literal.
3. Sustituye `null` por un objeto `UpcomingMeetup`. `lumaUrl` es obligatorio. Este tipo no lleva `photos`.
4. El listado en `/eventos/proximos` es una sola tarjeta grande, sin selector de vista. La pagina del evento muestra el ticket de Luma y el programa, no la galeria.
