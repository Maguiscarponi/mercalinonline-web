import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mercalinonline.com";

// Dinámico: se arma en cada request (cacheado por la plataforma), no en el
// build. Así el build no necesita la base, y un producto nuevo aparece sin
// tener que redeployar.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Si la base no responde, el sitemap sigue sirviendo las páginas fijas en
  // vez de romperse.
  const products = await listProducts().catch(() => []);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/productos`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/prueba-gratis`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/preguntas-frecuentes`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terminos`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
