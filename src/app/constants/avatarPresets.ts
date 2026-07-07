/**
 * Avatares preestablecidos para usuarios normales (no admins). En vez de
 * subir una foto propia, eligen uno de estos íconos — son SVG simples
 * codificados como data-URI, así que funcionan igual que cualquier otra
 * `avatar` (URL) en el resto de la app (Navbar, ProfileCard, etc.) sin
 * tener que tocar cómo se renderizan.
 *
 * Para agregar un ícono nuevo: sube el color (bg) y el emoji/símbolo,
 * nada más.
 */
function makeAvatar(bg: string, glyph: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" rx="28" fill="${bg}"/><text x="50%" y="54%" font-size="64" text-anchor="middle" dominant-baseline="middle">${glyph}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface AvatarPreset {
  id: string;
  label: string;
  url: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "leaf", label: "Hoja", url: makeAvatar("#0f6e3f", "🌿") },
  { id: "wave", label: "Ola", url: makeAvatar("#0284c7", "🌊") },
  { id: "fox", label: "Zorro", url: makeAvatar("#ea580c", "🦊") },
  { id: "cat", label: "Gato", url: makeAvatar("#7e22ce", "🐱") },
  { id: "star", label: "Estrella", url: makeAvatar("#ca8a04", "⭐") },
  { id: "bolt", label: "Rayo", url: makeAvatar("#0f766e", "⚡") },
  { id: "ghost", label: "Fantasma", url: makeAvatar("#475569", "👻") },
  { id: "robot", label: "Robot", url: makeAvatar("#be123c", "🤖") },
];
