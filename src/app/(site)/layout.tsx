import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartProvider } from "@/lib/cart";

// Header/footer/carrito solo para el sitio público — el admin (fuera de
// este route group) no los hereda.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </CartProvider>
  );
}
