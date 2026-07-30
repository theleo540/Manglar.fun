# web/hentai — todavía no existe

Este vertical no tiene `/api/widget` todavía. No hay que poner nada de
contenido inventado aquí — solo esta guía de cómo armarlo cuando el
backend de hentai.manglar.fun lo tenga funcionando.

Ver `web/README.md` para el panorama completo, y **especialmente**
`web/anime/README.md` — la misma duda aplica acá: `hentai.manglar.fun`
puede ser el mismo backend de ManglarPelis filtrado por
`product = 'hentai'`, no necesariamente un backend nuevo.

## Consideración aparte para este vertical

Contenido `hentai` es contenido adulto/NSFW. Si en algún momento se
arma su tarjeta para el `EcosystemStrip` de la Home (que es
público, sin verificación de edad ni login), vale la pena decidir
explícitamente:

- si esta tarjeta debe aparecer en el Strip público igual que las
  demás, o
- si solo debe ser accesible desde el perfil del usuario ya logueado
  (como la sección de actividad de `EcosystemActivitySection.tsx`,
  que si distingue `product: "hentai"` internamente pero no expone
  nada en la Home pública)

Esa decisión es de producto, no técnica — no asumir ninguna de las dos
por defecto.

## Cuando exista un /api/widget real (y se resuelva lo anterior):

Mismos pasos que en `web/anime/README.md`, cambiando
`ANIME_CONFIG` → `HENTAI_CONFIG`, `useAnimeWidget` → `useHentaiWidget`,
y `domain: "https://hentai.manglar.fun"`.
