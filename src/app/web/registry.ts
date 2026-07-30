/**
 * Une los widgets de cada vertical REAL para pintarlos en el
 * EcosystemStrip de la home. No hay descubrimiento automático de
 * carpetas — cada vertical se agrega a mano aquí cuando ya existe de
 * verdad (con su propio /api/widget funcionando).
 *
 * Por qué no es un array de hooks: los hooks de React no se pueden
 * invocar dentro de un loop/array (rules of hooks). Por eso cada
 * vertical se llama explícito en useEcosystemWidgets() de abajo.
 *
 * Cuando exista NBA:
 *   1. Crea web/nba/ copiando la estructura de web/futbol/
 *   2. Aquí abajo agregas: const nba = useNbaWidget();
 *      y lo sumas al array de retorno si nba.data existe.
 */
import { useFutbolWidget } from "./futbol";
import { usePeliculasWidget } from "./peliculas";
import { useEcosystemWidget } from "../hooks/useEcosystemWidget";
import type { EcosystemWidgetResponse } from "./shared/types";

export function useEcosystemWidgets(): { widgets: EcosystemWidgetResponse[]; checked: boolean } {
  const futbol = useFutbolWidget();
  const peliculas = usePeliculasWidget();
  // ManglarAnime y ManglarHentai no tienen tarjeta propia (no hay
  // MatchCard/MovieCard para ellos todavía), asi que usan directo el
  // hook generico por slug (mismo que usa el Hero) en vez de un
  // web/anime/hooks/useWidget.ts dedicado -- su /api/widget ya cumple
  // el contrato tal cual.
  const anime = useEcosystemWidget("manglaranime");
  const hentai = useEcosystemWidget("manglarhentai");

  // const nba = useNbaWidget();

  const widgets = [futbol.data, peliculas.data, anime.data, hentai.data /*, nba.data */].filter(
    (w): w is EcosystemWidgetResponse => w !== null
  );

  const checked =
    !futbol.loading && !peliculas.loading && !anime.loading && !hentai.loading /* && !nba.loading */;

  return { widgets, checked };
}
