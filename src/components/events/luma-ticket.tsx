import Image from "next/image";
import type { EventImage } from "@/content/events/types";
import { LumaLogo } from "./luma-logo";

export function LumaTicket({ href, image }: { href: string; image: EventImage }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="luma-ticket group mx-auto block w-full max-w-md rounded-[1.35rem] bg-[#0a0a0a] px-3 pt-5 pb-3 text-white ring-1 ring-white/10 outline-offset-4"
    >
      <span className="luma-ticket-poster block overflow-hidden rounded-[0.9rem] bg-black">
        <Image
          src={image.src}
          alt={image.alt}
          sizes="(min-width: 768px) 28rem, 100vw"
          preload
          className="h-auto w-full"
          style={{ width: "100%", height: "auto" }}
        />
      </span>
      <span className="mx-1 mt-3 block border-t border-dashed border-white/35" aria-hidden />
      <span className="flex items-center justify-between gap-4 px-2 pt-3 pb-1">
        <LumaLogo className="h-4 w-auto" />
        <span className="text-sm font-medium">
          Abrir en Luma
          <span className="sr-only">, se abre en otra ventana</span>
        </span>
      </span>
    </a>
  );
}
