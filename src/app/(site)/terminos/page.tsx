import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y condiciones — Mercalin",
  description:
    "Condiciones de uso y de compra de Mercalin: la prueba gratuita, el pago único, la licencia, el derecho de arrepentimiento y las demás condiciones que rigen el servicio.",
};

const CONTACTO = "onlinemercalin@gmail.com";

const SECCIONES: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "Objeto",
    contenido: (
      <p>
        Estos términos regulan el uso del sitio mercalin.online y la compra de la licencia de uso del sistema Mercalin
        (el &quot;Software&quot;), un sistema de gestión para comercios. Al solicitar la prueba gratuita, comprar una
        licencia o usar el sitio, se entienden aceptadas estas condiciones.
      </p>
    ),
  },
  {
    titulo: "Prueba gratuita",
    contenido: (
      <p>
        La prueba dura 7 días corridos desde que se genera la clave, no pide tarjeta ni crea una suscripción, y se
        activa con el mismo instalador y el mismo procedimiento que la licencia completa. Al vencer, el sistema deja
        de funcionar hasta que se ingrese una clave completa — los datos cargados durante la prueba no se borran y
        siguen disponibles si luego se compra la licencia.
      </p>
    ),
  },
  {
    titulo: "Precio y forma de pago",
    contenido: (
      <p>
        La licencia se paga una sola vez, en pesos argentinos, a través de Mercado Pago. No es una suscripción: la
        clave completa no vence ni se renueva, y no genera cobros posteriores. Los datos de la tarjeta o medio de
        pago son procesados por Mercado Pago; Mercalin no accede a ellos ni los almacena.
      </p>
    ),
  },
  {
    titulo: "Derecho de arrepentimiento",
    contenido: (
      <>
        <p>
          De acuerdo con la Ley de Defensa del Consumidor (Ley Nº 24.240) y el Código Civil y Comercial, quien compra
          a distancia tiene derecho a arrepentirse de la compra dentro de los 10 (diez) días corridos desde que
          adquiere la licencia, sin necesidad de justificar el motivo.
        </p>
        <p className="mt-3">
          Para ejercerlo alcanza con escribir a{" "}
          <a href={`mailto:${CONTACTO}`} className="font-bold text-brand-dark underline underline-offset-4">
            {CONTACTO}
          </a>{" "}
          o por WhatsApp indicando el mail con el que se compró. El reintegro se hace por el mismo medio de pago
          utilizado, y la clave de activación queda sin efecto.
        </p>
      </>
    ),
  },
  {
    titulo: "Licencia de uso",
    contenido: (
      <p>
        La licencia habilita el uso del Software para el comercio que la adquiere. No incluye el código fuente ni
        autoriza a revender, sublicenciar, copiar para otro comercio o distribuir el Software a terceros. El sistema
        Multicaja, cuando está activado, permite que varias computadoras del mismo comercio compartan una misma
        base de datos — no habilita el uso de una licencia por parte de comercios distintos.
      </p>
    ),
  },
  {
    titulo: "Actualizaciones y soporte",
    contenido: (
      <p>
        La licencia incluye las actualizaciones del Software y soporte por WhatsApp, sin costo adicional ni límite
        de tiempo.
      </p>
    ),
  },
  {
    titulo: "Datos cargados en el sistema",
    contenido: (
      <p>
        La información que se carga en Mercalin (ventas, productos, clientes, proveedores) se guarda en la
        computadora del comercio y no se transmite a los servidores de Mercalin. Hacer copias de seguridad
        periódicas es responsabilidad de quien usa el sistema — Mercalin incluye una función de respaldo para
        facilitarlo, pero no tiene acceso a esos datos ni puede recuperarlos si no se hicieron copias. Más detalle
        sobre el tratamiento de datos personales en la{" "}
        <Link href="/privacidad" className="font-bold text-brand-dark underline underline-offset-4">
          Política de privacidad
        </Link>
        .
      </p>
    ),
  },
  {
    titulo: "Propiedad intelectual",
    contenido: (
      <p>
        El Software, su código, su diseño y la marca Mercalin son propiedad de quien desarrolla y provee el sistema.
        La compra de una licencia no transfiere ninguno de estos derechos: solo habilita el uso del Software en los
        términos descriptos arriba.
      </p>
    ),
  },
  {
    titulo: "Límites de responsabilidad",
    contenido: (
      <p>
        El Software se entrega tal como está descripto en el sitio. No se garantiza que funcione sin interrupciones
        ni libre de errores, aunque se trabaja para que así sea. En la medida permitida por la ley aplicable, no se
        responde por daños indirectos derivados del uso del Software, sin perjuicio de los derechos que la Ley de
        Defensa del Consumidor reconoce a quien lo adquiere.
      </p>
    ),
  },
  {
    titulo: "Modificaciones",
    contenido: (
      <p>
        Estos términos pueden actualizarse; la versión vigente es siempre la publicada en esta página, con la fecha
        de la última actualización. Los cambios no afectan condiciones ya pactadas en una compra anterior.
      </p>
    ),
  },
  {
    titulo: "Ley aplicable",
    contenido: (
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Para cualquier consulta o reclamo, el
        contacto es{" "}
        <a href={`mailto:${CONTACTO}`} className="font-bold text-brand-dark underline underline-offset-4">
          {CONTACTO}
        </a>
        .
      </p>
    ),
  },
];

export default function Terminos() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Términos</p>
      <h1 className="mt-3 text-[clamp(34px,5.4vw,56px)] leading-[1.05] text-ink">Términos y condiciones</h1>
      <p className="tag-numbered mt-3 text-[12.5px] uppercase text-ink-mute">Última actualización: 25 de septiembre de 2026</p>

      <div className="mt-10 border-t-[3px] border-ink">
        {SECCIONES.map((s, i) => (
          <div key={s.titulo} className="border-b-2 border-dashed border-ink/40 py-7">
            <h2 className="text-[22px] leading-tight text-ink">
              <span className="tag-numbered mr-3 text-[13px] text-brand">{String(i + 1).padStart(2, "0")}</span>
              {s.titulo}
            </h2>
            <div className="mt-3 text-[16.5px] leading-relaxed text-ink-soft">{s.contenido}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
