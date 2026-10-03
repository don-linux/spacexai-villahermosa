"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, PointerEvent, ReactNode, SVGProps } from "react";
import { ChevronDownIcon, InstagramIcon, XIcon } from "./icons";
import { NavLogo } from "./nav-logo";

type MenuIcon = ComponentType<SVGProps<SVGSVGElement>>;
type NavLink = {
  label: string;
  description?: string;
  href: string;
  icon?: MenuIcon;
  external?: boolean;
};
type NavItem = { label: string; href: string } | { label: string; items: NavLink[] };

// Placeholder navigation until the real sections exist.
const NAV_ITEMS: NavItem[] = [
  {
    label: "Comunidad",
    items: [
      { label: "Sobre nosotros", description: "Quiénes somos y qué hacemos", href: "#" },
      { label: "Organizadores", description: "El equipo detrás de los eventos", href: "#" },
      { label: "Código de conducta", description: "Cómo convivimos", href: "/codigo-de-conducta" },
    ],
  },
  {
    label: "Eventos",
    items: [
      { label: "Próximos meetups", description: "Calendario en Villahermosa", href: "#" },
      { label: "Talleres", description: "Sesiones prácticas con Grok", href: "#" },
      { label: "Eventos pasados", description: "Grabaciones y fotos", href: "#" },
    ],
  },
  {
    label: "Recursos",
    items: [
      { label: "Guías", description: "Para empezar a construir", href: "#" },
      { label: "API de SpaceXAI", description: "Documentación oficial", href: "#" },
      { label: "Herramientas", description: "Lo que usa la comunidad", href: "#" },
    ],
  },
  { label: "Créditos", href: "/creditos" },
  { label: "Noticias", href: "#" },
];

const CONTACT_LINKS: NavLink[] = [
  {
    label: "Instagram",
    description: "@donlinux.dev",
    href: "https://www.instagram.com/donlinux.dev/",
    icon: InstagramIcon,
    external: true,
  },
  {
    label: "X",
    description: "@donlinuxdev",
    href: "https://x.com/donlinuxdev",
    icon: XIcon,
    external: true,
  },
];

const JOIN_LINKS: NavLink[] = [
  {
    label: "Comunidad global",
    href: "https://luma.com/spacexai-community",
    external: true,
  },
  {
    label: "Villahermosa",
    href: "https://luma.com/spacexai-villahermosa",
    external: true,
  },
];

const MOBILE_BREAKPOINT_QUERY = "(min-width: 768px)";
const HOVER_CLOSE_DELAY_MS = 120;

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!mobileOpen) return;
    const desktop = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const close = () => desktop.matches && setMobileOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    const root = document.documentElement;
    root.style.overflow = "hidden";
    desktop.addEventListener("change", close);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      root.style.overflow = "";
      desktop.removeEventListener("change", close);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const hoverOpen = (label: string) => (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const hoverClose = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY_MS);
  };
  const toggle = (label: string) => setOpenMenu((current) => (current === label ? null : label));

  // `backdrop-filter` (like the reveal's transform) would become the containing block of the
  // fixed mobile panel, so neither may sit on the header itself while the menu is open.
  const surface = mobileOpen
    ? "border-foreground/[0.06] bg-background"
    : scrolled
      ? "border-foreground/[0.06] bg-background/75 backdrop-blur-xl"
      : "border-transparent bg-transparent";

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${surface}`}
    >
      <div className="reveal mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-5 md:px-6">
        <div className="flex items-center gap-8">
          <NavLogo />
          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) =>
                "items" in item ? (
                  <li
                    key={item.label}
                    className="relative"
                    onPointerEnter={hoverOpen(item.label)}
                    onPointerLeave={hoverClose}
                  >
                    <NavDropdown
                      label={item.label}
                      links={item.items}
                      isOpen={openMenu === item.label}
                      onToggle={() => toggle(item.label)}
                      onNavigate={() => setOpenMenu(null)}
                    />
                  </li>
                ) : (
                  <li key={item.label}>
                    <a href={item.href} className="nav-link">
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="relative hidden md:block"
            onPointerEnter={hoverOpen("contacto")}
            onPointerLeave={hoverClose}
          >
            <ContactButton
              isOpen={openMenu === "contacto"}
              onToggle={() => toggle("contacto")}
              onNavigate={() => setOpenMenu(null)}
            />
          </div>
          <div
            className="relative hidden md:block"
            onPointerEnter={hoverOpen("join")}
            onPointerLeave={hoverClose}
          >
            <JoinButton
              isOpen={openMenu === "join"}
              onToggle={() => toggle("join")}
              onNavigate={() => setOpenMenu(null)}
            />
          </div>
          <button
            type="button"
            className="pill pill-solid md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
          >
            Únete
          </button>
          <MobileMenuButton isOpen={mobileOpen} onToggle={() => setMobileOpen((open) => !open)} />
        </div>
      </div>

      {mobileOpen ? <MobileMenu onNavigate={() => setMobileOpen(false)} /> : null}
    </header>
  );
}

function NavDropdown({
  label,
  links,
  isOpen,
  onToggle,
  onNavigate,
}: {
  label: string;
  links: NavLink[];
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className="nav-link"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {label}
        <ChevronDownIcon
          className={`size-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen ? (
        <div id={panelId} className="dropdown left-1/2 -translate-x-1/2">
          <DropdownLinks links={links} onNavigate={onNavigate} />
        </div>
      ) : null}
    </>
  );
}

function ContactButton({
  isOpen,
  onToggle,
  onNavigate,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = useId();

  return (
    <>
      <button
        type="button"
        className="pill pill-soft"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        Contacto
      </button>
      {isOpen ? (
        <div id={panelId} className="dropdown right-0">
          <DropdownLinks links={CONTACT_LINKS} onNavigate={onNavigate} />
        </div>
      ) : null}
    </>
  );
}

function JoinButton({
  isOpen,
  onToggle,
  onNavigate,
}: {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const panelId = useId();

  return (
    <>
      <div className="flex h-9 items-stretch overflow-hidden rounded-full bg-foreground text-sm font-medium text-background">
        <button
          type="button"
          className="flex items-center pr-3 pl-4 transition-colors hover:bg-background/[0.1]"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          Únete
        </button>
        <span className="my-2 w-px bg-background/20" aria-hidden />
        <button
          type="button"
          className="flex items-center px-2.5 transition-colors hover:bg-background/[0.1]"
          aria-label="Más formas de unirte"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <ChevronDownIcon
            className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {isOpen ? (
        <div id={panelId} className="dropdown right-0">
          <DropdownLinks
            links={JOIN_LINKS}
            onNavigate={onNavigate}
            leading={
              <div className="px-3 pt-2.5 pb-1">
                <LumaWordmark />
              </div>
            }
          />
        </div>
      ) : null}
    </>
  );
}

function LumaWordmark() {
  return (
    <>
      <img
        src="/brand/luma/luma-logo-white.svg"
        alt="Luma"
        width={724}
        height={264}
        className="theme-dark-only block h-5 w-auto"
      />
      <img
        src="/brand/luma/luma-logo-black.svg"
        alt="Luma"
        width={724}
        height={264}
        className="theme-light-only block h-5 w-auto"
      />
    </>
  );
}

function DropdownLinks({
  links,
  onNavigate,
  leading,
}: {
  links: NavLink[];
  onNavigate: () => void;
  leading?: ReactNode;
}) {
  const list = (
    <ul className={leading ? undefined : "dropdown-panel"}>
      {links.map((link) => (
        <li key={link.label}>
          <MenuAnchor
            link={link}
            onNavigate={onNavigate}
            className={`rounded-xl px-3 py-2.5 transition-colors hover:bg-foreground/[0.06] ${
              link.icon ? "flex items-start gap-3" : "block"
            }`}
          />
        </li>
      ))}
    </ul>
  );

  if (!leading) return list;

  return (
    <div className="dropdown-panel">
      {leading}
      {list}
    </div>
  );
}

function MenuAnchor({
  link,
  onNavigate,
  className,
}: {
  link: NavLink;
  onNavigate: () => void;
  className: string;
}) {
  const Icon = link.icon;

  return (
    <a
      href={link.href}
      onClick={onNavigate}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {Icon ? <Icon className="mt-0.5 size-4 shrink-0 text-foreground" /> : null}
      <span className={Icon ? "min-w-0" : "contents"}>
        <span className="block text-sm text-foreground">{link.label}</span>
        {link.description ? (
          <span className="mt-0.5 block text-[13px] text-foreground/50">{link.description}</span>
        ) : null}
      </span>
    </a>
  );
}

function MobileMenuButton({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="relative flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/[0.08] md:hidden"
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
      onClick={onToggle}
    >
      <span
        className={`absolute h-px w-4 bg-current transition-transform duration-200 ${
          isOpen ? "rotate-45" : "-translate-y-1"
        }`}
      />
      <span
        className={`absolute h-px w-4 bg-current transition-transform duration-200 ${
          isOpen ? "-rotate-45" : "translate-y-1"
        }`}
      />
    </button>
  );
}

function MobileLinkGroup({
  label,
  links,
  onNavigate,
  leading,
}: {
  label: string;
  links: NavLink[];
  onNavigate: () => void;
  leading?: ReactNode;
}) {
  return (
    <div>
      <p className="px-1 text-xs font-medium tracking-wide text-foreground/40 uppercase">{label}</p>
      {leading}
      <ul className="mt-2 flex flex-col">
        {links.map((link) => (
          <li key={link.label}>
            <MenuAnchor
              link={link}
              onNavigate={onNavigate}
              className={`rounded-lg px-1 py-2.5 hover:bg-foreground/[0.06] ${
                link.icon ? "flex items-start gap-3" : "block"
              }`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <nav
      id="mobile-menu"
      aria-label="Principal"
      className="mobile-menu fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-background px-5 pt-4 pb-10 md:hidden"
    >
      <ul className="flex flex-col gap-6">
        {NAV_ITEMS.map((item) =>
          "items" in item ? (
            <li key={item.label}>
              <p className="px-1 text-xs font-medium tracking-wide text-foreground/40 uppercase">
                {item.label}
              </p>
              <ul className="mt-2 flex flex-col">
                {item.items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={onNavigate}
                      className="block rounded-lg px-1 py-2 text-lg text-foreground/90 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ) : (
            <li key={item.label}>
              <a
                href={item.href}
                onClick={onNavigate}
                className="block rounded-lg px-1 py-1 text-lg text-foreground/90 hover:text-foreground"
              >
                {item.label}
              </a>
            </li>
          ),
        )}
      </ul>
      <div className="mt-10 flex flex-col gap-8">
        <MobileLinkGroup label="Contacto" links={CONTACT_LINKS} onNavigate={onNavigate} />
        <MobileLinkGroup
          label="Únete"
          links={JOIN_LINKS}
          onNavigate={onNavigate}
          leading={
            <div className="px-1 pt-3">
              <LumaWordmark />
            </div>
          }
        />
      </div>
    </nav>
  );
}
