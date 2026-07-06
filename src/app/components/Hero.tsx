import { WidgetFutbol } from "../web/futbol";

/**
 * Hero de la home. Hoy solo existe un vertical real (Fútbol), así que
 * el Hero es directamente su widget grande.
 *
 * Cuando haya más de un vertical real y activo (ej. NBA en temporada),
 * este es el lugar para decidir cuál se destaca — por estado ("live"
 * gana sobre "scheduled"), por fecha, o rotando entre <WidgetFutbol />
 * y <WidgetNba />. Por ahora no hace falta esa lógica.
 */
export function Hero() {
  return <WidgetFutbol />;
}
