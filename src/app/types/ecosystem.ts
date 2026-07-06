/**
 * Contrato que todo GET /api/widget del ecosistema debe cumplir,
 * sin importar de qué proyecto venga (WC2026Streams, NBA, etc).
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
