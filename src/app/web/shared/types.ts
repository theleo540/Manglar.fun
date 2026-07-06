/**
 * Contrato que todo GET /api/widget de cualquier vertical (fútbol, NBA,
 * películas...) debe cumplir. No es específico de fútbol — es la forma
 * fija que espera el Hero, el EcosystemStrip, y cualquier <Widget*/>.
 */
export interface EcosystemWidgetCard {
  home: string;
  away: string;
  homeCrest?: string;
  awayCrest?: string;
  utcDate: string;
}

export interface EcosystemWidgetResponse {
  project: string;
  title: string;
  description: string;
  domain: string;
  status: "live" | "scheduled" | "idle";
  card: EcosystemWidgetCard | null;
}

/**
 * Contrato de un item de /api/widget/matches (partidos, funciones de
 * cine, juegos, lo que aplique por vertical).
 */
export interface EcosystemMatch {
  id: string;
  home: string;
  away: string;
  homeCrest?: string;
  awayCrest?: string;
  utcDate: string;
  isLive: boolean;
}
