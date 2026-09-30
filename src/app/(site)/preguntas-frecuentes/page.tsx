import FaqList from "@/components/FaqList";
import { getFaqs } from "@/lib/faqs";
import { listProducts } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Mercalin",
  description: "Dudas sobre la prueba gratis, el pago, la activación y la instalación de Mercalin.",
};

// Se sirve desde el CDN y se regenera cada 5 minutos (o al instante cuando se
// edita un producto en el admin, que llama a revalidatePath). Antes se armaba
// en cada visita con una consulta a la base: tardaba ~0,8 s más en responder.
export const revalidate = 300;

export default async function PreguntasFrecuentes() {
  const [producto] = await listProducts();
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <p className="rt-label">Preguntas frecuentes</p>
        <h1 className="mt-3 text-[clamp(38px,6vw,64px)] leading-[1.05] text-ink">Dudas antes de comprar.</h1>
        <div className="mt-10">
          <FaqList faqs={getFaqs(producto?.priceArs ?? 65000)} columnas={1} />
        </div>
      </section>
    </>
  );
}
