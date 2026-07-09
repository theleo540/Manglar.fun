import type { AppRoute } from "@/config/routes";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export function Terminos({ navigate }: { navigate: (route: AppRoute) => void }) {
  return (
    <LegalPageLayout title="Términos de Uso" lastUpdated="9 de julio de 2026" navigate={navigate}>
      <p>
        Al usar cualquier sitio del ecosistema Manglar (Manglar, WC2026Streams, ManglarPelis) aceptas estos
        términos. Si no estás de acuerdo, por favor no uses el servicio.
      </p>

      <h2>Uso del servicio</h2>
      <p>
        Manglar es una plataforma de entretenimiento y deportes en vivo. El acceso es gratuito y está sujeto a
        disponibilidad. Nos reservamos el derecho de suspender cuentas que hagan un uso indebido del servicio.
      </p>

      <h2>Contenido de terceros</h2>
      <p>
        Sitios como WC2026Streams y ManglarPelis no alojan ni son propietarios del contenido audiovisual que
        enlazan; únicamente indexan transmisiones y reproductores ya disponibles públicamente en internet.
        Todos los derechos pertenecen a sus respectivos dueños.
      </p>

      <h2>Cuentas de usuario</h2>
      <p>
        Eres responsable de mantener la confidencialidad de tu cuenta y de toda actividad que ocurra bajo
        ella.
      </p>

      <h2>Limitación de responsabilidad</h2>
      <p>
        El servicio se ofrece "tal cual", sin garantías de disponibilidad continua o ausencia de errores. No
        somos responsables por daños derivados del uso del sitio o de contenido de terceros enlazado desde
        él.
      </p>

      <h2>Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos periódicamente. El uso continuado del sitio tras un cambio implica
        aceptación de los nuevos términos.
      </p>

      <h2>Contacto</h2>
      <p>Para dudas sobre estos términos, contáctanos a través de nuestras redes sociales oficiales.</p>
    </LegalPageLayout>
  );
}
