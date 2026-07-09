import { ManglarFooter } from "@manglar/footer";

/**
 * Footer del Hub (manglar.fun). Ya no mantiene su propio ECOSYSTEM_PROJECTS
 * local — ese registry ahora vive una sola vez en @manglar/footer y lo
 * comparten los 3 (pronto 4) sitios. Aquí solo se agrega la columna propia
 * del Hub.
 */
export function Footer() {
  return (
    <ManglarFooter
      site="hub"
      siteName={
        <>
          MANG<span className="text-[#0be881]">LAR</span>
        </>
      }
      accent="#0be881"
      disclaimer="Plataforma premium de entretenimiento y deportes en vivo."
      columns={[
        {
          heading: "Producto",
          links: [
            { label: "Inicio", href: "/" },
          ],
        },
      ]}
    />
  );
}
