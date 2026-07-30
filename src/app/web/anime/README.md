# web/anime — todavía no existe

Este vertical no tiene `/api/widget` todavía. No hay que poner nada de
contenido inventado aquí — solo esta guía de cómo armarlo cuando el
backend de anime.manglar.fun lo tenga funcionando.

Ver `web/README.md` para el panorama completo.

## Ojo con esto antes de empezar

`web/peliculas/` (ManglarPelis) ya existe y en la base de datos las
tablas de contenido (`manglarpelis_watch_history`,
`manglarpelis_user_items`, `anime_media_views`) usan una columna
`product` con valores `'anime'` / `'hentai'` — es decir, puede que
"anime.manglar.fun" y "hentai.manglar.fun" sean el **mismo backend**
que ManglarPelis, solo separado por dominio/filtro de producto, y no
un backend nuevo desde cero. Antes de copiar `web/futbol/` de cero,
confirmar con el backend real si `anime.manglar.fun` expone su propio
`/api/widget` independiente o si conviene extender
`usePeliculasWidget()` para que reciba un parámetro `product`.

## Cuando exista un /api/widget real y separado para Anime:

1. Copia la carpeta `web/futbol/` (o `web/peliculas/`, que es más
   parecida en tipo de contenido) completa a `web/anime/`
2. Renombra `FUTBOL_CONFIG`/`PELICULAS_CONFIG` → `ANIME_CONFIG` con el
   `apiBaseUrl` real y `domain: "https://anime.manglar.fun"`
3. Renombra hooks/componentes (`useFutbolWidget` → `useAnimeWidget`,
   etc.)
4. En `web/registry.ts`, agrega:
   ```ts
   import { useAnimeWidget } from "./anime";
   const anime = useAnimeWidget();
   // sumar anime.data al array de widgets
   ```
5. En `web/shared/EcosystemWidgetCard.tsx`, agrega `anime` a
   `PROJECT_ICONS`/`PROJECT_GRADIENTS`
6. Confirmar si va aparte de `manglarpelis` en `config/ecosystem.ts` o
   si lo reemplaza

Nada de esto se hace hasta confirmar la relación real con
ManglarPelis y que el `/api/widget` correspondiente exista.
