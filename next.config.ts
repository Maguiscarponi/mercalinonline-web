import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Next.js 16 solo permite calidad 75 salvo que se declare acá. Las
    // capturas de la app tienen texto y líneas finas — comprimirlas al 75
    // por defecto se nota muchísimo más que en una foto común.
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
          {
            // Nada de terceros en el admin: si algún día se cuela un script
            // inyectado (una dependencia comprometida, un campo mal
            // sanitizado), esto le impide cargar o mandar datos a otro
            // dominio. 'unsafe-inline' y 'unsafe-eval' quedan porque
            // Next.js arranca la página con scripts propios inline (el
            // payload de React) y, en desarrollo, usa eval() para reconstruir
            // el stack de errores — sacarlos requeriría un nonce por pedido.
            // Lo que sí bloquea esto es cualquier script/estilo que NO sea
            // del propio sitio, que es el riesgo real (exfiltrar datos a
            // otro dominio).
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
