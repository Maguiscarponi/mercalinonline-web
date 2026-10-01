import Hero from "@/components/home/Hero";
import Rubros from "@/components/home/Rubros";
import Carpetas from "@/components/home/Carpetas";
import VideoSlot from "@/components/home/VideoSlot";
import RevelarSecciones from "@/components/home/RevelarSecciones";
import { DemoConsejosEtiquetas } from "@/components/home/Demos";
import Preguntas from "@/components/home/Preguntas";
import Precio from "@/components/home/Precio";
import { listProducts } from "@/lib/products";

// Se sirve desde el CDN y se regenera cada 5 minutos (o al instante cuando se
// edita un producto en el admin, que llama a revalidatePath). Antes se armaba
// en cada visita con una consulta a la base: tardaba ~0,8 s más en responder.
export const revalidate = 300;

// Orden de la página: hero → rubros → módulos (carpetas) → "Así se usa." (video de
// Caja) → Consejo del día y Etiquetas en video → preguntas → precio. El pie
// (mostaza + oscuro) lo pone el layout.
export default async function Home() {
  // El precio y los links de compra salen del producto destacado (listProducts
  // ya lo ordena primero). Si no hay productos cargados no hay nada que vender:
  // la home igual muestra todo lo demás.
  const [producto] = await listProducts();

  return (
    <>
      <Hero />
      {/* Todo lo que está abajo del hero se arma recién cuando se acerca con
          el scroll (ver .rt-diferida en globals.css). */}
      <div className="rt-diferida"><Rubros /></div>
      <div className="rt-diferida"><Carpetas /></div>
      <div className="rt-diferida"><VideoSlot /></div>
      <div className="rt-diferida"><DemoConsejosEtiquetas /></div>
      <div className="rt-diferida"><Preguntas priceArs={producto?.priceArs ?? 65000} /></div>
      {producto && <div className="rt-diferida"><Precio product={producto} /></div>}
      <RevelarSecciones />
    </>
  );
}
