/**
 * Registry del Ecosistema Manglar.
 *
 * Cada proyecto real del ecosistema expone GET /api/widget en su propio
 * backend (ver server.js de WC2026Streams). Ese endpoint es el contrato:
 * siempre regresa la forma de EcosystemWidgetResponse, sin importar el
 * proyecto de donde venga.
 *
 * Para sumar un proyecto nuevo (ej. NBA cuando exista):
 *   1. Ese proyecto implementa su propio GET /api/widget
 *   2. Se agrega UNA línea aquí
 *   3. Nada más se toca — el Hero, el EcosystemStrip y cualquier
 *      <WidgetX /> lo recogen solos.
 *
 * No agregar proyectos que todavía no tengan su /api/widget funcionando:
 * el hook simplemente los ignora si el fetch falla, pero es mejor no
 * ensuciar el registry con cosas que no existen aún.
 */
export interface EcosystemProjectConfig {
  slug: string;
  label: string;
  widgetUrl: string;
}

export const ECOSYSTEM_PROJECTS: EcosystemProjectConfig[] = [
  {
    slug: "wc2026streams",
    label: "WC2026 Streams",
    widgetUrl: "https://wc2026streams.manglar.fun/api/widget",
  },
  // {
  //   slug: "nba",
  //   label: "NBA Streams",
  //   widgetUrl: "https://nba.manglar.hub/api/widget",
  // },
  // {
  //   slug: "games",
  //   label: "Games",
  //   widgetUrl: "https://games.manglar.hub/api/widget",
  // },
];
