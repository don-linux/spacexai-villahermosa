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
