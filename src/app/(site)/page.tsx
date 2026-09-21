import Hero from "@/components/home/Hero";
import Rubros from "@/components/home/Rubros";
import Carpetas from "@/components/home/Carpetas";
import VideoSlot from "@/components/home/VideoSlot";
import { DemoCaja, DemoConsejosEtiquetas } from "@/components/home/Demos";
import Preguntas from "@/components/home/Preguntas";
import Precio from "@/components/home/Precio";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

// Orden de la página: hero → rubros → módulos (carpetas) → video → pantallas
// reales → preguntas → precio. El pie (mostaza + oscuro) lo pone el layout.
export default async function Home() {
  // El precio y los links de compra salen del producto destacado (listProducts
  // ya lo ordena primero). Si no hay productos cargados no hay nada que vender:
  // la home igual muestra todo lo demás.
  const [producto] = await listProducts();

  return (
    <>
      <Hero />
      <Rubros />
      <Carpetas />
      <VideoSlot />
      <DemoCaja />
      <DemoConsejosEtiquetas />
      <Preguntas />
      {producto && <Precio product={producto} />}
    </>
  );
}
