import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProductAction } from "@/lib/actions/products";
import { getProductById } from "@/lib/products";
import { PageHeader } from "@/components/admin/stats";

export const dynamic = "force-dynamic";

export default async function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="max-w-5xl">
      <PageHeader title="Editar producto" subtitle={product.name} />
      <ProductForm action={updateProductAction.bind(null, id)} defaultValues={product} />
    </div>
  );
}
