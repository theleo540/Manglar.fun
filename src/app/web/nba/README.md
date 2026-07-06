# web/nba — todavía no existe

Este vertical no tiene backend ni datos reales todavía. No hay que
poner nada de contenido inventado aquí — solo esta guía de cómo armarlo
cuando el proyecto de NBA exista de verdad.

## Cuando el backend de NBA ya tenga /api/widget funcionando:

1. Copia la carpeta `web/futbol/` completa a `web/nba/`
2. Renombra:
   - `FUTBOL_CONFIG` → `NBA_CONFIG` (en `config.ts`, con el `apiBaseUrl` real de NBA)
   - `useFutbolWidget` → `useNbaWidget`
   - `useFutbolMatches` → `useNbaMatches`
   - `WidgetFutbol` → `WidgetNba`
   - `SportsRow` puede quedarse igual, o renombrarse si quieres textos distintos
3. Ajusta textos específicos de NBA en `WidgetNba.tsx` (título, badge, etc.)
4. En `web/registry.ts`, descomenta y agrega:
   ```ts
   import { useNbaWidget } from "./nba";
   const nba = useNbaWidget();
   // sumar nba.data al array de widgets
   ```
5. En `pages/Home.tsx`, agrega `<SportsRow title="NBA" />` importado de `../web/nba`
6. En `components/Footer.tsx`, agrega el link real de NBA a `productLinks`

Nada de esto se hace hasta que el backend de NBA responda de verdad en
su propio `/api/widget`.
