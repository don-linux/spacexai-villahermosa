import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <noscript>
          <style>{`.intro-screen{display:none}[data-intro] .reveal{opacity:1;animation:none}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
