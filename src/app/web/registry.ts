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
import type { EcosystemWidgetResponse } from "./shared/types";

export function useEcosystemWidgets(): { widgets: EcosystemWidgetResponse[]; checked: boolean } {
  const futbol = useFutbolWidget();
  const peliculas = usePeliculasWidget();

  // const nba = useNbaWidget();

  const widgets = [futbol.data, peliculas.data /*, nba.data */].filter(
    (w): w is EcosystemWidgetResponse => w !== null
  );

  const checked = !futbol.loading && !peliculas.loading /* && !nba.loading */;

  return { widgets, checked };
}
