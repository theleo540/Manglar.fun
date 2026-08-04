# web/anime — ManglarAnime + ManglarHentai (ya existe)

Vertical de anime/hentai real, con datos de `anime1v-api`. A diferencia
de `web/futbol` y `web/peliculas` (proyectos distintos entre sí), acá
**un solo componente sirve para dos verticales** porque ManglarAnime y
ManglarHentai son literalmente el mismo backend (`anime1v-api`),
deployado dos veces con un `.env` distinto cada uno (ver
`.env.example` de ese repo: `ANIME_SITE_URL` + `WIDGET_PROVIDER`).

## Estructura

- `config.ts` — `ANIME_CONFIG` y `HENTAI_CONFIG`. `apiBaseUrl` sale de
  `VITE_ANIME_API_URL` / `VITE_HENTAI_API_URL` (con fallback al deploy
  real actual). **Nada hardcodeado**: si el backend cambia de dominio o
  de instancia, se cambia el `.env` del hub, no el código.
- `hooks/useWidget.ts` — `useAnimeWidget(config)`, pide `GET /api/widget`.
- `hooks/useTop10.ts` — `useAnimeTop10(config)`, pide `GET /api/widget/top10`
  (top 10 + recién agregado, con poster real).
- `components/AnimeCard.tsx` — tarjeta poster, abre `AnimePreviewModal`
  al click (igual que `MovieCard`/`MoviePreviewModal` en `web/peliculas`).
- `components/AnimePreviewModal.tsx` — vista previa + botón "Ver ahora",
  que redirige a `${domain}/?title=${item.id}`. `item.id` ya viene
  armado por el backend con el mismo esquema `anime-<base64url(url)>`
  que usa `lib/animeId.ts` en el frontend real — el hub no inventa
  ningún id ni mapeo, solo pasa el que le da el backend.
- `components/AnimeRow.tsx` — sección "Top 10" + "Recién agregado",
  parametrizada por `config` (mismo componente para anime y hentai).

## Cómo se usa

```tsx
// pages/Home.tsx
import { AnimeRow } from "../web/anime";
import { ANIME_CONFIG } from "../web/anime/config";

<AnimeRow config={ANIME_CONFIG} title="Anime" sectionId="anime" />

// Cuando se quiera publicar Hentai en el Home (hoy está listo pero
// comentado a propósito):
// import { HENTAI_CONFIG } from "../web/anime/config";
// <AnimeRow config={HENTAI_CONFIG} title="Hentai" sectionId="hentai" />
```

El widget chico (banner del `EcosystemStrip`) para ambos ya se arma
solo desde `web/registry.ts` (`useAnimeWidget(ANIME_CONFIG)` /
`useAnimeWidget(HENTAI_CONFIG)`), y las URLs del navbar/footer salen de
`config/ecosystem.ts`, que a su vez lee `ANIME_CONFIG`/`HENTAI_CONFIG`
de acá — un solo lugar de verdad para el `apiBaseUrl`.

## Si algún día agregas un tercer deploy de este mismo backend (anime3, etc.)

1. Suma una entrada más en `config.ts` (ej. `ANIME3_CONFIG`) con su
   propia env var `VITE_ANIME3_API_URL`.
2. Usa `<AnimeRow config={ANIME3_CONFIG} .../>` donde corresponda — no
   hace falta tocar ningún componente, están todos parametrizados.
3. Si quieres que también aparezca en el `EcosystemStrip`, súmalo en
   `web/registry.ts` (`useAnimeWidget(ANIME3_CONFIG)`) y en
   `config/ecosystem.ts`.

## Contrato del backend (anime1v-api)

- `GET /api/widget` → `{ project, title, description, domain, status, card: null }`
- `GET /api/widget/top10` → `{ domain, top10: EcosystemAnimeItem[], trending: EcosystemAnimeItem[] }`

Ver `web/shared/types.ts` (`EcosystemAnimeItem`) y `src/server.js` /
`src/utils/animeId.js` en `anime1v-api` para el detalle de cómo se arma
cada tarjeta.
