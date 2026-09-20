import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Next.js 16 solo permite calidad 75 salvo que se declare acá. Los
    // banners del carrusel son gráficos con texto y colores planos —
    // comprimirlos al 75 por defecto se nota muchísimo más que en una foto.
    qualities: [75, 90, 100],
  },
  experimental: {
    serverActions: {
      // La subida de imágenes del admin pasa por una Server Action, y el
      // límite por defecto del body es 1 MB. Un banner de 3840×1280 sin
      // compresión con pérdida pesa ~2 MB, así que no entraba.
      bodySizeLimit: "10mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Nadie puede meter el sitio (ni el admin) dentro de otra página.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
