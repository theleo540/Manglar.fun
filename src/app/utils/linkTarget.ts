// Enlaces externos: en PC (dispositivos con mouse) abren en pestaña nueva
// (target="_blank"); en celulares y tablets (dispositivos táctiles) navegan
// en la misma ventana/WebView, para no romper el flujo dentro de la app o
// el WebView de Android (ver MainActivity.kt: onCreateWindow con
// target="_blank" crea un WebView fantasma que no siempre navega bien).
//
// Se usa "(hover: hover) and (pointer: fine)" en vez de detectar el ancho
// de pantalla, porque es la forma más confiable de distinguir "tiene mouse"
// (PC) de "es táctil" (celular/tablet, sin importar el tamaño de pantalla).
export function getExternalLinkTarget(): "_blank" | undefined {
  if (typeof window === "undefined" || !window.matchMedia) return "_blank";
  const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return isDesktop ? "_blank" : undefined;
}
