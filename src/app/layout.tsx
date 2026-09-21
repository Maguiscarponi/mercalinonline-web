import type { Metadata } from "next";
import { Alfa_Slab_One, Barlow, Barlow_Condensed, Caprasimo, Courier_Prime, Source_Sans_3 } from "next/font/google";
import "./globals.css";

// Fuentes del sitio público: titulares en slab pesada, texto en Source Sans,
// etiquetas y precios en máquina de escribir, y Caprasimo solo para el
// wordmark gigante del pie.
const alfa = Alfa_Slab_One({ variable: "--font-alfa", weight: "400", subsets: ["latin"] });
const source = Source_Sans_3({ variable: "--font-source", weight: ["400", "600", "700"], subsets: ["latin"] });
const courier = Courier_Prime({ variable: "--font-courier", weight: ["400", "700"], subsets: ["latin"] });
const caprasimo = Caprasimo({ variable: "--font-caprasimo", weight: "400", subsets: ["latin"] });

// Barlow es de la tipografía del panel admin. Sin preload para que el sitio
// público no las descargue: solo se bajan si una página las usa.
const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  preload: false,
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  weight: ["500", "600", "700", "800"],
  subsets: ["latin"],
  preload: false,
});

// Si la variable viniera sin "https://" (o mal escrita), new URL() tiraría
// abajo el build entero: se cae al dominio real en vez de romper.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://mercalinonline.com";
  try {
    new URL(raw);
    return raw;
  } catch {
    return "https://mercalinonline.com";
  }
}

const SITE_URL = resolveSiteUrl();
const TITLE = "Mercalin — Sistema de gestión para comercios";
const DESCRIPTION =
  "Sistema de gestión para comercios que venden productos: ventas, stock, caja, clientes y proveedores. Pago único, $65.000 ARS. Probá 7 días gratis.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Mercalin",
    locale: "es_AR",
    type: "website",
    images: [{ url: "/capturas/dashboard.png", width: 1919, height: 985, alt: "Dashboard de Mercalin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/capturas/dashboard.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${alfa.variable} ${source.variable} ${courier.variable} ${caprasimo.variable} ${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
