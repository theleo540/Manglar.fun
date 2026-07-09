import type { AppRoute } from "@/config/routes";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export function Privacidad({ navigate }: { navigate: (route: AppRoute) => void }) {
  return (
    <LegalPageLayout title="Política de Privacidad" lastUpdated="9 de julio de 2026" navigate={navigate}>
      <p>
        Esta política describe cómo el ecosistema Manglar (Manglar, WC2026Streams y ManglarPelis, en conjunto
        "Manglar", "nosotros") recopila, usa y protege la información de quienes usan nuestros sitios.
      </p>

      <h2>Qué información recopilamos</h2>
      <p>
        Recopilamos información básica de uso (páginas visitadas, dispositivo, navegador) con fines
        estadísticos, y datos de cuenta (nombre, correo) cuando el usuario decide registrarse. No solicitamos
        ni almacenamos datos de pago dentro del sitio.
      </p>

      <h2>Cómo usamos la información</h2>
      <p>
        Usamos los datos recopilados para operar y mejorar el servicio, personalizar la experiencia (por
        ejemplo, "Mi Lista" en ManglarPelis), prevenir abuso y comunicarnos con el usuario cuando sea
        necesario. No vendemos información personal a terceros.
      </p>

      <h2>Cookies</h2>
      <p>
        Usamos cookies para mantener sesiones activas y recordar preferencias. Puedes leer más detalle en
        nuestra <a href="/legal/cookies">Política de Cookies</a>.
      </p>

      <h2>Servicios de terceros</h2>
      <p>
        Algunos sitios del ecosistema enlazan o incrustan reproductores y contenido alojado por terceros. Esos
        servicios tienen sus propias políticas de privacidad, que no controlamos.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento desde tu perfil, o
        escribiéndonos directamente.
      </p>

      <h2>Contacto</h2>
      <p>Para dudas sobre privacidad, contáctanos a través de nuestras redes sociales oficiales.</p>
    </LegalPageLayout>
  );
}
