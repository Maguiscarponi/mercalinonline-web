import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/actions/products";
import { getProductById } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Editar producto</h1>
      <ProductForm action={updateProductAction.bind(null, id)} defaultValues={product} />
    </div>
  );
}
