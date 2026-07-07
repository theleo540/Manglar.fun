import { ArrowLeft } from "lucide-react";

/**
 * Cuando se entra a /profile desde otro subdominio (ej. wc2026streams.manglar.fun),
 * el link trae ?from=<url de origen>. Como es cruzar de dominio y no una ruta
 * interna de la SPA, la vuelta tiene que ser un window.location.href normal,
 * no el `navigate` interno de Manglar.
 *
 * Si no hay ?from= (se entró directo desde manglar.fun), no se muestra nada.
 */
export function BackToOrigin() {
  const params = new URLSearchParams(window.location.search);
  const from = params.get("from");

  if (!from) return null;

  let label = "Volver";
  try {
    label = `Volver a ${new URL(from).hostname}`;
  } catch {
    // from no es una URL válida, se usa el label genérico
  }

  return (
    <button
      onClick={() => {
        window.location.href = from;
      }}
      className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
}