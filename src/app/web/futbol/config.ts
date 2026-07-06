/**
 * Config del vertical Fútbol (WC2026 Streams).
 *
 * Cuando armes web/nba/config.ts, es este mismo archivo pero con los
 * datos de NBA: su propio backend en Azure (o donde sea) y su slug.
 */
export const FUTBOL_CONFIG = {
  slug: "wc2026streams",
  label: "WC2026 Streams",
  // Backend real (Azure) — aquí vive /api/widget y /api/widget/matches.
  // El link al que se manda al usuario NO es esta URL — ese viene en
  // el campo `domain` de la respuesta del propio /api/widget.
  apiBaseUrl: "https://wc2026stream-api.azurewebsites.net",
};
