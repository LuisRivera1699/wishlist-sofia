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
    "Lista de deseos para el cumpleaños de Sofía. Aporta a lo que más desea y ayúdala a cumplir sus sueños 💙",
  openGraph: {
    title: "Mis 27 | Sofía - Wishlist",
    description:
      "Lista de deseos para el cumpleaños de Sofía. Aporta a lo que más desea y ayúdala a cumplir sus sueños 💙",
    url: siteUrl,
    siteName: "Mis 27 | Sofía - Wishlist",
    images: [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/FOT_8015.jpg?alt=media&token=82d71176-edf6-4974-8def-f957ad455991",
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
      "Lista de deseos para el cumpleaños de Sofía. Aporta a lo que más desea y ayúdala a cumplir sus sueños 💙",
    images: [
      "https://firebasestorage.googleapis.com/v0/b/atmo-67f01.firebasestorage.app/o/FOT_8015.jpg?alt=media&token=82d71176-edf6-4974-8def-f957ad455991",
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
