# web/gocut — todavía no existe

Este vertical no tiene `/api/widget` todavía. No hay que poner nada de
contenido inventado aquí — solo esta guía de cómo armarlo cuando el
backend de GoCut lo tenga funcionando.

Ver `web/README.md` para el panorama completo (diferencia entre esto y
`config/ecosystem.ts`, y el contrato de `/api/widget`).

## Cuando el backend de GoCut ya tenga /api/widget funcionando:

1. Copia la carpeta `web/futbol/` completa a `web/gocut/`
2. Renombra:
   - `FUTBOL_CONFIG` → `GOCUT_CONFIG` (en `config.ts`, con el
     `apiBaseUrl` real del backend de GoCut, ej. su App Service de
     Azure — **no** confundir con `domain`, que debe ser
     `https://gocut.manglar.fun`)
   - `useFutbolWidget` → `useGocutWidget`
   - `useFutbolMatches` → el `card` de GoCut probablemente no es un
     "partido" sino algo tipo "último link creado" o "link destacado"
     — el hook y el tipo de `card` pueden simplificarse o adaptarse,
     no hay que forzar la forma de fútbol
   - `WidgetFutbol` → `WidgetGocut`
3. Ajusta textos específicos de GoCut en `WidgetGocut.tsx` (título,
   badge, etc.) — probablemente algo como "acortador de links del
   ecosistema", sin necesidad de `SportsRow`/`MatchCard` (esos son
   específicos de fútbol/NBA, GoCut no tiene partidos)
4. En `web/registry.ts`, agrega:
   ```ts
   import { useGocutWidget } from "./gocut";
   const gocut = useGocutWidget();
   // sumar gocut.data al array de widgets
   ```
5. En `web/shared/EcosystemWidgetCard.tsx`, agrega `gocut` a
   `PROJECT_ICONS` (ej. `Link2` de lucide-react) y `PROJECT_GRADIENTS`
6. Si `gocut` no está ya en `config/ecosystem.ts`, agrégalo para que
   salga también en Navbar/Footer (ya tiene `footerUrl` apuntando a
   gocut.manglar.fun en algunas versiones — revisar antes de duplicar)

Nada de esto se hace hasta que el backend de GoCut responda de verdad
en su propio `/api/widget`.
