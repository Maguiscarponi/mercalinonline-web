import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad — Mercalin",
  description: "Qué datos recibe Mercalin, para qué los usa, con quién los comparte y cómo pedir que los borremos.",
};

const CONTACTO = "onlinemercalin@gmail.com";

const SECCIONES: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "Quién es el responsable",
    contenido: (
      <p>
        Mercalin, sistema de gestión para comercios. Para cualquier consulta sobre tus datos, escribinos a{" "}
        <a href={`mailto:${CONTACTO}`} className="font-semibold text-brand">
          {CONTACTO}
        </a>
        .
      </p>
    ),
  },
  {
    titulo: "Qué datos recibimos",
    contenido: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Tu mail y el nombre de tu negocio</strong> (este último es opcional), cuando pedís la prueba gratis o
          comprás.
        </li>
        <li>
          <strong>Datos de la compra:</strong> monto, fecha e identificador del pago. Los datos de tu tarjeta los procesa
          Mercado Pago: nosotros no los vemos ni los guardamos.
        </li>
        <li>
          <strong>Datos de navegación del sitio:</strong> qué páginas mirás, qué botones tocás, desde qué sitio llegaste y
          si entrás desde un celular o una computadora. Se asocian a un código anónimo generado al azar en tu navegador.
          No usamos cookies ni herramientas de publicidad de terceros. Si más adelante pedís la prueba o comprás, podemos
          relacionar ese código con tu mail para saber cómo llegaste a Mercalin.
        </li>
        <li>
          <strong>Información de los mails que te enviamos:</strong> nuestro servicio de envío nos informa si cada mail fue
          entregado, rebotó, se marcó como spam o se abrió, para saber si recibiste tu clave.
        </li>
        <li>
          <strong>Lo que cargues en Mercalin</strong> (ventas, productos, clientes, proveedores) queda en tu computadora.
          La app funciona sin internet y no lo enviamos a nuestros servidores.
        </li>
      </ul>
    ),
  },
  {
    titulo: "Para qué los usamos",
    contenido: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Enviarte el instalador y la clave de activación.</li>
        <li>
          Avisarte durante tu prueba: un recordatorio a los 3 días, otro cuando falta poco para que venza y otro cuando
          venció. Cada uno trae un link para darte de baja con un clic, y también podés escribirnos.
        </li>
        <li>Procesar tu compra y darte soporte.</li>
        <li>Entender cómo se usa el sitio para mejorarlo.</li>
      </ul>
    ),
  },
  {
    titulo: "Con quién los compartimos",
    contenido: (
      <>
        <p>
          No vendemos ni cedemos tus datos. Para que el servicio funcione usamos proveedores que los procesan por nuestra
          cuenta:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Supabase:</strong> base de datos donde guardamos tu mail, tu prueba o licencia y los datos de
            navegación.
          </li>
          <li>
            <strong>Vercel:</strong> alojamiento del sitio.
          </li>
          <li>
            <strong>Resend:</strong> envío de los mails.
          </li>
          <li>
            <strong>Mercado Pago:</strong> cobro de la licencia.
          </li>
          <li>
            <strong>WhatsApp (Meta):</strong> si nos escribís por ahí, la conversación pasa por sus servidores.
          </li>
        </ul>
        <p className="mt-3">
          Algunos de estos proveedores almacenan datos en servidores fuera de Argentina, por ejemplo en Estados Unidos.
        </p>
      </>
    ),
  },
  {
    titulo: "Cuánto tiempo los guardamos",
    contenido: (
      <p>
        Mientras tengas una prueba o una licencia, y después el tiempo necesario para darte soporte y cumplir obligaciones
        legales. Podés pedir que los eliminemos en cualquier momento.
      </p>
    ),
  },
  {
    titulo: "Tus derechos",
    contenido: (
      <>
        <p>
          Podés pedirnos acceso a tus datos, que los corrijamos o que los eliminemos, escribiendo a{" "}
          <a href={`mailto:${CONTACTO}`} className="font-semibold text-brand">
            {CONTACTO}
          </a>
          . Te respondemos lo antes posible.
        </p>
        <p className="mt-3 text-[14px] text-foreground/60">
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo
          establecido en el artículo 14, inciso 3 de la Ley Nº 25.326. La Agencia de Acceso a la Información Pública, en su
          carácter de Órgano de Control de la Ley Nº 25.326, tiene la atribución de atender las denuncias y reclamos que
          interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de
          protección de datos personales.
        </p>
      </>
    ),
  },
  {
    titulo: "Seguridad",
    contenido: (
      <p>
        El sitio funciona con conexión cifrada (HTTPS) y el acceso a los datos que guardamos está protegido y limitado a
        quienes administran Mercalin.
      </p>
    ),
  },
  {
    titulo: "Cambios en esta política",
    contenido: <p>Si la actualizamos, publicamos la nueva versión en esta página con la fecha de la última modificación.</p>,
  },
];

export default function Privacidad() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="tag-numbered text-xs text-brand">Privacidad</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Política de privacidad</h1>
      <p className="mt-3 text-[14px] text-foreground/50">Última actualización: 20 de septiembre de 2026</p>

      <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
        {SECCIONES.map((s) => (
          <div key={s.titulo} className="py-7">
            <h2 className="text-lg font-bold text-foreground">{s.titulo}</h2>
            <div className="mt-3 text-[15px] leading-relaxed text-foreground/70">{s.contenido}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
