
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  import { supabase } from "@/lib/supabase";

  // Si esta página se cargó dentro del popup de login (ver oauthPopup.ts),
  // esperamos a que Supabase confirme la sesión real (onAuthStateChange)
  // antes de cerrar. Timeout de seguridad por si el evento nunca llega.
  const authPopupParams = new URLSearchParams(window.location.search);
  const isAuthPopup = authPopupParams.get("authPopup") === "1" && !!window.opener;

  if (isAuthPopup) {
    let closed = false;
    const closeOnce = () => {
      if (closed) return;
      closed = true;
      window.close();
    };

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) closeOnce();
    });

    setTimeout(closeOnce, 5000);
  } else {
    createRoot(document.getElementById("root")!).render(<App />);
  }
  