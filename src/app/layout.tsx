import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const universalSans = localFont({
  src: [
    {
      path: "./fonts/UniversalSansGrokTest-Text-400-Trial.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/UniversalSansGrokTest-Text-550-Trial.ttf",
      weight: "550",
      style: "normal",
    },
  ],
  variable: "--font-universal",
});

const universalDisplay = localFont({
  src: "./fonts/UniversalSansGrokTest-Display-400-Trial.ttf",
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SpaceXAI Villahermosa",
  description: "SpaceXAI Villahermosa",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${universalSans.variable} ${universalDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`.intro-screen{display:none}[data-intro] .reveal{opacity:1;animation:none}`}</style>
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
