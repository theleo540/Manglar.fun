import type { AppRoute } from "@/config/routes";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export function Cookies({ navigate }: { navigate: (route: AppRoute) => void }) {
  return (
    <LegalPageLayout title="Política de Cookies" lastUpdated="9 de julio de 2026" navigate={navigate}>
      <p>
        Esta política explica qué son las cookies y cómo las usamos en los sitios del ecosistema Manglar.
      </p>

      <h2>Qué son las cookies</h2>
      <p>
        Las cookies son pequeños archivos de texto que se guardan en tu dispositivo al visitar un sitio web,
        y que permiten recordar información entre visitas.
      </p>

      <h2>Cómo las usamos</h2>
      <p>
        Usamos cookies esenciales para mantener tu sesión iniciada, cookies de preferencia (por ejemplo, tu
        idioma o tu progreso al ver contenido) y cookies analíticas para entender cómo se usa el sitio y
        mejorarlo.
      </p>

      <h2>Cookies de terceros</h2>
      <p>
        Algunos reproductores o widgets incrustados (como el chat en vivo o redes sociales) pueden establecer
        sus propias cookies, sujetas a las políticas de esos terceros.
      </p>

      <h2>Cómo controlarlas</h2>
      <p>
        Puedes borrar o bloquear cookies desde la configuración de tu navegador. Ten en cuenta que bloquear
        cookies esenciales puede afectar el funcionamiento del sitio, por ejemplo cerrando tu sesión
        automáticamente.
      </p>
    </LegalPageLayout>
  );
}
