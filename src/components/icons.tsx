import type { SVGProps } from "react";

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M4.5 6.25 8 9.75l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M6.25 4.5 9.75 8l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowUpRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M5.5 10.5 10.5 5.5M6 5.5h4.5V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M4 10.5 12 4l8 6.5V20h-5.25v-5.5h-5.5V20H4v-9.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The theme toggle icons from x.ai. */
export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13 23H11V20H13V23Z" />
      <path d="M7.0498 18.3643L4.92871 20.4854L3.51465 19.0713L5.63574 16.9502L7.0498 18.3643Z" />
      <path d="M20.4854 19.0713L19.0713 20.4854L16.9492 18.3643L18.3643 16.9502L20.4854 19.0713Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6ZM12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z"
      />
      <path d="M4 13H1V11H4V13Z" />
      <path d="M23 13H20V11H23V13Z" />
      <path d="M7.0498 5.63574L5.63574 7.0498L3.51465 4.92871L4.92871 3.51465L7.0498 5.63574Z" />
      <path d="M20.4854 4.92871L18.3643 7.0498L16.9492 5.63574L19.0713 3.51465L20.4854 4.92871Z" />
      <path d="M13 4H11V1H13V4Z" />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 12.0005C3.00022 17.5231 7.47729 22.0005 13 22.0005C17.1018 22.0005 20.6236 19.529 22.166 15.9956C22.1419 15.996 22.1179 15.997 22.0937 15.998C22.0625 15.9992 22.0313 16.0005 22 16.0005C16.4773 16.0005 12.0002 11.5231 12 6.00049C12 4.57969 12.2978 3.22836 12.832 2.00439C7.38668 2.0941 3 6.53376 3 12.0005ZM10 6.00049C10 5.50987 10.0303 5.02594 10.0879 4.55029C7.10969 5.71429 5 8.61027 5 12.0005C5.00022 16.4187 8.58197 20.0005 13 20.0005C15.2588 20.0005 17.2994 19.0623 18.7549 17.5522C13.7047 16.1364 10.0002 11.5027 10 6.00049Z"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
    </svg>
  );
}

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.223-6.824L6.57 21.75H3.26l7.727-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
