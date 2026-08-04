/**
 * ManglarHentai reutiliza los mismos hooks/componentes que
 * ManglarAnime (mismo backend anime1v-api, mismo contrato de datos)
 * en vez de duplicar código -- ver web/anime/. Esta carpeta solo fija
 * el HENTAI_CONFIG para que el resto del Hub (Hero, EcosystemStrip,
 * etc.) lo importe como un vertical propio, con su propia URL.
 */
import { useAnimeWidget, useAnimeTop10 } from "../anime";
import { HENTAI_CONFIG } from "./config";

export { HENTAI_CONFIG } from "./config";
export { AnimeCard as HentaiCard, AnimePreviewModal as HentaiPreviewModal } from "../anime";

export function useHentaiWidget() {
  return useAnimeWidget(HENTAI_CONFIG);
}

export function useHentaiTop10() {
  return useAnimeTop10(HENTAI_CONFIG);
}
