import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://luisysofia-regalos.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mis 27 | Sofía - Wishlist",
  description:
    "Hola! Esta es mi lista de deseos para mi cumpleaños. Si quieres regalarme algo, puedes hacer tu aporte aquí ✨",
  openGraph: {
    title: "Mis 27 | Sofía - Wishlist",
    description:
      "Hola! Esta es mi lista de deseos para mi cumpleaños. Si quieres regalarme algo, puedes hacer tu aporte aquí ✨",
    url: siteUrl,
    siteName: "Mis 27 | Sofía - Wishlist",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/Screenshot%202026-03-18%20at%2011.05.11%E2%80%AFPM.png?alt=media&token=65c837b6-c170-4af3-b32d-5ec0f854de3f",
        width: 1200,
        height: 630,
        alt: "Cumpleaños de Sofía",
      },
    ],
    locale: "es",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mis 27 | Sofía - Wishlist",
    description:
      "Hola! Esta es mi lista de deseos para mi cumpleaños. Si quieres regalarme algo, puedes hacer tu aporte aquí ✨",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/Screenshot%202026-03-18%20at%2011.05.11%E2%80%AFPM.png?alt=media&token=65c837b6-c170-4af3-b32d-5ec0f854de3f",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${inter.variable} font-body antialiased bg-disco-black text-disco-goldLight`}
      >
        {children}
      </body>
    </html>
  );
}
