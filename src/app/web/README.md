# web/ — Sistema de widgets del Ecosistema Manglar

Esta carpeta es lo que alimenta las tarjetas de "Ecosistema Manglar" en
la Home (`<EcosystemStrip />`). Existe **aparte** de
`config/ecosystem.ts` — son dos sistemas distintos y es fácil
confundirlos:

| Archivo | Para qué sirve | Qué controla |
|---|---|---|
| `config/ecosystem.ts` | Links estáticos | Qué aparece en el **Navbar** y el **Footer** (no depende de ningún backend, es solo un link fijo) |
| `web/registry.ts` (esta carpeta) | Tarjetas con datos en vivo | Qué aparece en el **EcosystemStrip** de la Home (sí depende de que el backend del proyecto tenga `/api/widget` funcionando) |

Un proyecto puede estar en uno de los dos, en ambos, o en ninguno. Por
eso hoy pasa esto: un producto puede ya tener su link en el footer
(`config/ecosystem.ts`) pero **no** su tarjeta en la Home, si todavía
no tiene `/api/widget` implementado.

## Por qué el registry no es automático

`web/registry.ts` llama a un hook por cada vertical de forma explícita
(`useFutbolWidget()`, `usePeliculasWidget()`, ...), no en un loop. Es a
propósito: las *rules of hooks* de React no permiten invocar hooks
dentro de un `.map()` o array dinámico. Por eso sumar un vertical
nuevo siempre implica tocar este archivo a mano, línea por línea — no
hay forma de automatizarlo del todo.

## Estado actual (revisar antes de asumir que algo "no sirve")

| Vertical | Carpeta `web/<x>/` | En `web/registry.ts` | Tarjeta en Home | Por qué |
|---|---|---|---|---|
| ManglarFutbol | ✅ completa | ✅ activo | ✅ sí | tiene `/api/widget` real funcionando |
| ManglarPelis | ✅ completa | ✅ activo | ✅ sí | tiene `/api/widget` real funcionando |
| ManglarNBA | ❌ solo `README.md` | ❌ comentado | ❌ no | backend sin `/api/widget` todavía |
| GoCut | ❌ no existe | ❌ no | ❌ no | backend sin `/api/widget` todavía |
| Anime (anime.manglar.fun) | ❌ no existe | ❌ no | ❌ no | backend sin `/api/widget` todavía |
| Hentai (hentai.manglar.fun) | ❌ no existe | ❌ no | ❌ no | backend sin `/api/widget` todavía |

Si un producto no aparece en la Home, casi siempre es por esto — **no**
es un bug del frontend, es que todavía no le tocó su turno de
implementación (le falta el endpoint en su propio backend).

## El contrato: `GET /api/widget`

Cada backend de un vertical (Node, lo que sea) debe exponer su propio
`GET /api/widget` que responda con esta forma exacta
(`types/ecosystem.ts` / `web/shared/types.ts`):

```ts
interface EcosystemWidgetResponse {
  project: string;       // slug único, ej. "gocut"
  title: string;         // ej. "GoCut"
  description: string;   // texto corto para la tarjeta
  domain: string;        // URL real del producto (gocut.manglar.fun) —
                          // a ESTA se manda al usuario al hacer click,
                          // nunca al apiBaseUrl del backend
  status: "live" | "scheduled" | "idle";
  card: EcosystemWidgetCard | null; // dato específico del vertical
                                      // (partido, película, link...) o null
}
```

`domain` y `apiBaseUrl` **no son lo mismo**: `apiBaseUrl` es donde vive
el backend (ej. Azure App Service) y solo lo usa el frontend para
pedir datos; `domain` es el sitio real al que se manda al usuario. Ver
`web/futbol/config.ts` y `web/peliculas/config.ts` para el patrón.

## Cómo agregar un vertical nuevo (GoCut, Anime, Hentai, NBA...)

Solo cuando el backend de ese proyecto ya tenga `/api/widget`
respondiendo de verdad en producción:

1. Copia `web/futbol/` completa a `web/<vertical>/`
2. En `config.ts`, renombra `FUTBOL_CONFIG` → `<VERTICAL>_CONFIG` y pon
   el `apiBaseUrl` real de ese backend
3. Renombra los hooks/componentes (`useFutbolWidget` →
   `use<Vertical>Widget`, etc. — ver el README de cada carpeta stub
   para el detalle exacto)
4. En `web/registry.ts`, descomenta/agrega la línea de ese vertical y
   súmalo al array de `widgets`
5. En `web/shared/EcosystemWidgetCard.tsx`, agrega una entrada en
   `PROJECT_ICONS` y `PROJECT_GRADIENTS` para ese `project` (si no,
   usa el ícono/gradiente por defecto — no rompe, pero se ve genérico)
6. Si ese producto no estaba ya en `config/ecosystem.ts`, agrégalo ahí
   también para que salga en Navbar/Footer

No hay que adelantar nada de esto (ni datos de ejemplo, ni configs a
medias) mientras el backend correspondiente no tenga su `/api/widget`
real. Ver los README individuales de `web/nba/`, `web/gocut/`,
`web/anime/` y `web/hentai/` para el detalle paso a paso de cada uno.
