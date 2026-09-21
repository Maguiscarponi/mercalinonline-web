import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad — Mercalin",
  description:
    "Qué datos personales trata Mercalin, con qué finalidad, cuánto tiempo los conserva y cómo ejercer los derechos de acceso, rectificación y supresión.",
};

const CONTACTO = "onlinemercalin@gmail.com";

const SECCIONES: { titulo: string; contenido: React.ReactNode }[] = [
  {
    titulo: "Responsable del tratamiento",
    contenido: (
      <p>
        Mercalin, sistema de gestión para comercios, es responsable del tratamiento de los datos personales descriptos en
        esta política. Cualquier consulta vinculada con ellos puede dirigirse a{" "}
        <a href={`mailto:${CONTACTO}`} className="font-bold text-brand underline underline-offset-4">
          {CONTACTO}
        </a>
        .
      </p>
    ),
  },
  {
    titulo: "Datos personales que se recolectan",
    contenido: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong>Datos de contacto:</strong> dirección de correo electrónico y, de manera opcional, nombre del comercio,
          proporcionados al solicitar la prueba gratuita o al adquirir una licencia.
        </li>
        <li>
          <strong>Datos de la compra:</strong> monto, fecha e identificador del pago. La información de la tarjeta es
          procesada exclusivamente por la plataforma de pagos; Mercalin no accede a ella ni la almacena.
        </li>
        <li>
          <strong>Datos de navegación:</strong> páginas visitadas, acciones realizadas en el sitio, origen de la visita y
          tipo de dispositivo. Se asocian a un identificador anónimo generado de forma aleatoria en el navegador. No se
          utilizan cookies ni herramientas publicitarias de terceros. Si el usuario solicita la prueba o adquiere una
          licencia, dicho identificador puede vincularse con su correo electrónico para conocer el origen de la consulta.
        </li>
        <li>
          <strong>Estado de los correos enviados:</strong> el servicio de envío informa si cada mensaje fue entregado,
          rebotó, fue marcado como no deseado o fue abierto, con el fin de verificar que el usuario haya recibido su clave
          de activación.
        </li>
        <li>
          <strong>Información cargada en Mercalin</strong> (ventas, productos, clientes y proveedores): permanece en el
          equipo del usuario y no se transmite a los servidores de Mercalin.
        </li>
      </ul>
    ),
  },
  {
    titulo: "Finalidad del tratamiento",
    contenido: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Enviar el instalador y la clave de activación.</li>
        <li>
          Comunicar el estado de la prueba gratuita: un aviso a los tres días, otro cuando su vencimiento es próximo y otro
          una vez vencida. Cada comunicación incluye un enlace para dejar de recibirlas, y también puede solicitarse por
          correo electrónico.
        </li>
        <li>Gestionar la compra y brindar asistencia al usuario.</li>
        <li>Analizar el uso del sitio con el fin de mejorarlo.</li>
      </ul>
    ),
  },
  {
    titulo: "Comunicación a terceros",
    contenido: (
      <>
        <p>
          Mercalin no vende ni cede los datos personales. Para prestar el servicio, contrata proveedores que actúan por su
          cuenta y bajo sus instrucciones, en las siguientes categorías: procesamiento de pagos, envío de correos
          electrónicos, alojamiento e infraestructura del sitio, y almacenamiento de datos. Cuando el usuario se comunica
          por mensajería, la conversación se rige además por las condiciones de esa plataforma.
        </p>
        <p className="mt-3">
          Algunos de estos proveedores pueden almacenar información en servidores ubicados fuera de la República Argentina.
        </p>
      </>
    ),
  },
  {
    titulo: "Plazo de conservación",
    contenido: (
      <p>
        Los datos se conservan mientras el usuario mantenga una prueba o una licencia vigente y, luego, durante el tiempo
        necesario para brindar asistencia y cumplir con las obligaciones legales aplicables.
      </p>
    ),
  },
  {
    titulo: "Derechos del titular",
    contenido: (
      <>
        <p>
          El titular de los datos puede solicitar el acceso, la rectificación o la supresión de su información personal
          escribiendo a{" "}
          <a href={`mailto:${CONTACTO}`} className="font-bold text-brand underline underline-offset-4">
            {CONTACTO}
          </a>
          . Mercalin responderá a la solicitud a la brevedad.
        </p>
        <p className="mt-3 text-[14.5px] text-ink-mute">
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
    titulo: "Medidas de seguridad",
    contenido: (
      <p>
        El sitio utiliza conexión cifrada (HTTPS) y el acceso a la información almacenada se encuentra protegido y limitado
        a las personas que administran Mercalin.
      </p>
    ),
  },
  {
    titulo: "Modificaciones",
    contenido: (
      <p>
        Cualquier modificación de esta política será publicada en esta página, junto con la fecha de su última
        actualización.
      </p>
    ),
  },
];

export default function Privacidad() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
      <p className="rt-label">Privacidad</p>
      <h1 className="mt-3 text-[clamp(34px,5.4vw,56px)] leading-[1.05] text-ink">Política de privacidad</h1>
      <p className="tag-numbered mt-3 text-[12.5px] uppercase text-ink-mute">Última actualización: 21 de septiembre de 2026</p>

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
