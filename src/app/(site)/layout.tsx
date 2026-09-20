import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Analytics from "@/components/Analytics";

// Header/footer y analítica solo para el sitio público — el admin (fuera de
// este route group) no los hereda, así tampoco se mide a sí mismo.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
      <Analytics />
    </>
  );
}
