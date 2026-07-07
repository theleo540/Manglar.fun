/** Número compacto: 12840 → "12.8k" */
export function fmt(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}
