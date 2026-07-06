# web/peliculas — todavía no existe

Este vertical no tiene backend ni datos reales todavía. No hay que
poner nada de contenido inventado aquí — solo esta guía de cómo armarlo
cuando el proyecto de Películas exista de verdad.

## Cuando el backend de Películas ya tenga /api/widget funcionando:

1. Copia la carpeta `web/futbol/` completa a `web/peliculas/`
2. Renombra:
   - `FUTBOL_CONFIG` → `PELICULAS_CONFIG` (en `config.ts`, con el `apiBaseUrl` real de Películas)
   - `useFutbolWidget` → `usePeliculasWidget`
   - `useFutbolMatches` → `usePeliculasMatches`
   - `WidgetFutbol` → `WidgetPeliculas`
   - `SportsRow` puede quedarse igual, o renombrarse si quieres textos distintos
3. Ajusta textos específicos de Películas en `WidgetPeliculas.tsx` (título, badge, etc.)
4. En `web/registry.ts`, descomenta y agrega:
   ```ts
   import { usePeliculasWidget } from "./peliculas";
   const peliculas = usePeliculasWidget();
   // sumar peliculas.data al array de widgets
   ```
5. En `pages/Home.tsx`, agrega `<SportsRow title="Películas" />` importado de `../web/peliculas`
6. En `components/Footer.tsx`, agrega el link real de Películas a `productLinks`

Nada de esto se hace hasta que el backend de Películas responda de verdad en
su propio `/api/widget`.
