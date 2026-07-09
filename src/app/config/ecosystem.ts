/**
 * Registry del Ecosistema Manglar — FUENTE ÚNICA DE VERDAD.
 *
 * Cada proyecto real del ecosistema expone GET /api/widget en su propio
 * backend (ver server.js de WC2026Streams). Ese endpoint es el contrato:
 * siempre regresa la forma de EcosystemWidgetResponse, sin importar el
 * proyecto de donde venga.
 *
 * Nav, Footer y las tarjetas del EcosystemStrip leen TODOS de este
 * mismo array. Para sumar un proyecto nuevo (ej. NBA, ManglarPelis)
 * ya no se toca Navbar.tsx ni Footer.tsx a mano:
 *
 *   1. Ese proyecto implementa su propio GET /api/widget
 *   2. Se agrega UNA entrada aquí abajo con sus campos
 *   3. Si el proyecto tiene tarjeta propia (como fútbol), se agrega su
 *      hook en web/registry.ts (eso sí requiere código porque cada
 *      vertical tiene su forma de datos — MatchCard, etc. No hay forma
 *      de automatizar 100% ahí por las rules of hooks de React)
 *
 * Campos opcionales — si faltan, esa parte simplemente NO aparece:
 *   - navLabel + anchor  → sin esto, no sale en el navbar
 *   - footerLabel + footerUrl → sin esto, no sale en el footer
 *
 * No agregar proyectos que todavía no tengan su /api/widget funcionando
 * (o que no quieras publicar aún, como manglarpelis por ahora): déjalos
 * comentados. El hook ignora los que fallan, pero es mejor no ensuciar
 * el registry con cosas a medias.
 */
export interface EcosystemProjectConfig {
  /** Identificador único del proyecto (usado por los hooks de widget). */
  slug: string;
  /** Nombre del proyecto, ej. "WC2026 Streams". */
  label: string;
  /** Endpoint GET /api/widget del proyecto. */
  widgetUrl: string;

  /**
   * Texto que aparece en el navbar (ej. "Fútbol"). Si se omite, este
   * proyecto NO sale en el nav.
   */
  navLabel?: string;
  /**
   * Ancla en la misma página (Home) a la que el link del nav debe
   * llevar, ej. "#ecosistema". El Navbar ya sabe navegar a Home primero
   * si no estás ahí. Requiere navLabel para tener efecto.
   */
  anchor?: string;

  /**
   * Texto completo mostrado en la columna "Productos" del footer, ej.
   * "Fútbol · WC2026 Streams". Si se omite, este proyecto NO sale en
   * el footer.
   */
  footerLabel?: string;
  /**
   * URL real del producto (dominio propio), ej.
   * "https://wc2026streams.manglar.fun". A diferencia del nav, el
   * footer SIEMPRE lleva al sitio real del producto, no a un ancla.
   */
  footerUrl?: string;
}

export const ECOSYSTEM_PROJECTS: EcosystemProjectConfig[] = [
  {
    slug: "wc2026streams",
    label: "WC2026 Streams",
    widgetUrl: "https://wc2026stream-api.azurewebsites.net/api/widget",
    navLabel: "Fútbol",
    anchor: "#ecosistema",
    footerLabel: "Fútbol · WC2026 Streams",
    footerUrl: "https://wc2026streams.manglar.fun",
  },
  {
    slug: "manglarpelis",
    label: "ManglarPelis",
    // Local por ahora (backend/.env de ManglarPelis, puerto 3001).
    // Cuando despliegues ese backend (Azure/Render/etc), cambia esto
    // Y src/app/web/peliculas/config.ts (PELICULAS_CONFIG.apiBaseUrl)
    // al mismo dominio real.
    widgetUrl: "http://localhost:3001/api/widget",
    navLabel: "Películas",
    anchor: "#peliculas",
    footerLabel: "Películas · ManglarPelis",
    // Dominio real del FRONTEND de ManglarPelis. Ajusta cuando esté
    // desplegado — debe ser el mismo PUBLIC_SITE_URL que su backend.
    footerUrl: "https://manglarpelis.manglar.fun",
  },
  // {
  //   slug: "nba",
  //   label: "NBA Streams",
  //   widgetUrl: "https://nba.manglar.hub/api/widget",
  //   navLabel: "NBA",
  //   anchor: "#ecosistema",
  //   footerLabel: "NBA · NBA Streams",
  //   footerUrl: "https://nba.manglar.fun",
  // },
];
