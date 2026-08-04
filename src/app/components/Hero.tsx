import { useFutbolWidget, WidgetFutbol } from "../web/futbol";
import { HeroEcosystemFallback } from "./HeroEcosystemFallback";

/**
 * Hero de la home. Si ManglarFutbol tiene un partido en vivo o
 * programado, ese es el Hero (<WidgetFutbol />). Si no hay nada de
 * fútbol en este momento, el Hero NO debe quedar negro y vacío -- en
 * su lugar se rellena con contenido real de los otros verticales
 * activos (Películas, Anime) vía <HeroEcosystemFallback />.
 *
 * Cuando haya más de un vertical con contenido "en vivo" (ej. NBA en
 * temporada), este es el lugar para decidir cuál se destaca -- por
 * estado ("live" gana sobre "scheduled"), por fecha, o rotando entre
 * <WidgetFutbol /> y <WidgetNba />.
 */
export function Hero() {
  const { data, loading } = useFutbolWidget();
  const hasMatch = !!data?.card;

  if (loading) {
    return <section className="relative w-full h-[88vh] min-h-[520px] bg-black" />;
  }

  if (hasMatch) {
    return <WidgetFutbol />;
  }

  return <HeroEcosystemFallback />;
}
