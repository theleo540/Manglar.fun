import { INSTAGRAM_USER } from "./FeedbackBanner";
import { getExternalLinkTarget } from "../../utils/linkTarget";

interface Props {
  className?: string;
}

/**
 * Widget flotante fijo (esquina inferior derecha) con link directo a un
 * chat de Instagram (ig.me/m/usuario). Es un componente independiente y
 * reutilizable: se importa y se coloca en cualquier página donde se
 * quiera mostrar (por ahora solo en Home). Reutiliza el mismo usuario
 * (INSTAGRAM_USER) que el banner de feedback.
 *
 * Estilo y proporciones (gradiente, tamaño, posición, ícono SVG oficial
 * de Instagram) replicados 1:1 del snippet de referencia.
 */
export function IGWidgetButton({ className = "" }: Props) {
  return (
    <a
      href={`https://ig.me/m/${INSTAGRAM_USER}`}
      target={getExternalLinkTarget()}
      rel="noopener noreferrer"
      aria-label="Envíame un mensaje en Instagram"
      className={className}
      style={{
        position: "fixed",
        bottom: "80px",
        right: "16px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, rgb(240, 148, 51) 0%, rgb(230, 104, 60) 25%, rgb(220, 39, 67) 50%, rgb(204, 35, 102) 75%, rgb(188, 24, 136) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 4px 16px",
        zIndex: 9999,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="white" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    </a>
  );
}