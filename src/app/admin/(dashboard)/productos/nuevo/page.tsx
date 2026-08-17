import ProductForm from "@/components/admin/ProductForm";
import { createProductAction } from "@/lib/actions/products";

export default function NuevoProducto() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Nuevo producto</h1>
      <ProductForm action={createProductAction} />
    </div>
  );
}
