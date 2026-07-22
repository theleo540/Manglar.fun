// Abre el flujo de OAuth (Google/GitHub) en una ventana pequeña y
// centrada, en vez de navegar la página actual hacia el proveedor.
//
// Por qué existe esto: Google bloquea que su pantalla de login se
// renderice dentro de un <iframe> (protección anti-clickjacking) y
// devuelve un 403. Como Laduela embebe este sitio en un iframe, hay
// que sacar el login a una ventana de verdad -- así el usuario nunca
// pierde de vista la página en la que estaba.
const POPUP_WIDTH = 460;
const POPUP_HEIGHT = 600;

export function openOAuthPopup(url: string, name = "manglar-oauth"): Window | null {
  const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
  const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

  return window.open(
    url,
    name,
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no,location=no`
  );
}

// Espera a que el popup se cierre (login terminado, exitoso o no) y
// entonces avisa para que quien llamó refresque la sesión.
export function waitForPopupClose(popup: Window, onClosed: () => void) {
  const timer = setInterval(() => {
    if (popup.closed) {
      clearInterval(timer);
      onClosed();
    }
  }, 400);
}
