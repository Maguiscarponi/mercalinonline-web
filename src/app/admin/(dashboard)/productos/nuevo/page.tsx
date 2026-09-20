import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/products";
import { PageHeader } from "@/components/admin/stats";

export default function NuevoProducto() {
  return (
    <div className="max-w-5xl">
      <PageHeader title="Nuevo producto" />
      <ProductForm action={createProductAction} />
    </div>
  );
}
