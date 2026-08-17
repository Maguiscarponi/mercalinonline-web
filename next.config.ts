import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
