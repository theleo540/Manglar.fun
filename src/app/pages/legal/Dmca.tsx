import type { AppRoute } from "@/config/routes";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export function Dmca({ navigate }: { navigate: (route: AppRoute) => void }) {
  return (
    <LegalPageLayout title="Política DMCA" lastUpdated="9 de julio de 2026" navigate={navigate}>
      <p>
        Manglar respeta los derechos de propiedad intelectual de terceros y espera lo mismo de sus usuarios.
        Sitios como WC2026Streams y ManglarPelis no almacenan contenido audiovisual propio: únicamente
        enlazan o indexan reproductores y transmisiones ya disponibles públicamente en internet.
      </p>

      <h2>Cómo reportar una infracción</h2>
      <p>Si consideras que algún contenido enlazado desde nuestro sitio infringe tus derechos de autor, envíanos una notificación que incluya:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Identificación de la obra protegida por derechos de autor.</li>
        <li>La URL exacta dentro de nuestro sitio donde aparece el enlace o contenido cuestionado.</li>
        <li>Tus datos de contacto (nombre y correo electrónico).</li>
        <li>Una declaración de buena fe de que el uso no está autorizado por el titular de los derechos.</li>
      </ul>

      <h2>Qué hacemos al recibir un reporte</h2>
      <p>
        Revisamos cada solicitud válida y removemos o deshabilitamos el acceso al enlace o contenido
        cuestionado en un plazo razonable, sin perjuicio de que el contenido original permanezca alojado en
        servidores de terceros fuera de nuestro control.
      </p>

      <h2>Contacto</h2>
      <p>
        Envía tus reportes de DMCA a través de nuestras redes sociales oficiales indicando claramente "DMCA"
        en el mensaje.
      </p>
    </LegalPageLayout>
  );
}
