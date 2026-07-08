import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Github, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";

export type AuthMode = "login" | "register";

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.7 34.7 27 35.7 24 35.7c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.3-4.1 5.7l6.6 5.6C41.8 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

/**
 * Modal de autenticación (login/registro) que aparece SOBRE la propia
 * página (no una ventana nueva del navegador). El fondo del overlay es
 * transparente a propósito — solo la tarjeta lleva blur (glass).
 *
 * GitHub, Google y correo (código de 6 dígitos vía Supabase OTP)
 * funcionan de verdad. El flujo de correo tiene dos pasos: 1) pide el
 * email y envía el código (onEmailOtpRequest), 2) pide el código y
 * confirma la sesión (onEmailOtpVerify).
 */
export function AuthModal({
  open,
  mode,
  onModeChange,
  onClose,
  onGithubLogin,
  onGoogleLogin,
  onEmailOtpRequest,
  onEmailOtpVerify,
  onPasswordLogin,
  onPasswordRegister,
}: {
  open: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
  onGithubLogin: () => void;
  onGoogleLogin: () => void;
  onEmailOtpRequest: (email: string) => Promise<void>;
  onEmailOtpVerify: (email: string, code: string) => Promise<void>;
  onPasswordLogin: (email: string, password: string) => Promise<void>;
  onPasswordRegister: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [emailMethod, setEmailMethod] = useState<"otp" | "password">("password");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Al cerrar el modal o cambiar de modo, volvemos siempre al paso inicial
  function resetEmailFlow() {
    setStep("email");
    setCode("");
    setPassword("");
    setSending(false);
    setVerifying(false);
  }

  function handleClose() {
    resetEmailFlow();
    onClose();
  }

  function handleModeChange(newMode: AuthMode) {
    resetEmailFlow();
    onModeChange(newMode);
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      await onEmailOtpRequest(email);
      toast.success("Te enviamos un código de 6 dígitos a tu correo.");
      setStep("code");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo enviar el código. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    try {
      await onEmailOtpVerify(email, code);
      toast.success("¡Sesión iniciada!");
      resetEmailFlow();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Código incorrecto o expirado.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    setSending(true);
    try {
      await onEmailOtpRequest(email);
      toast.success("Te reenviamos el código.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo reenviar el código.");
    } finally {
      setSending(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      if (mode === "login") {
        await onPasswordLogin(email, password);
        toast.success("¡Sesión iniciada!");
      } else {
        await onPasswordRegister(email, password);
        toast.success("Cuenta creada. Si te pedimos confirmar el correo, revisa tu bandeja.");
      }
      resetEmailFlow();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo completar la solicitud.");
    } finally {
      setSending(false);
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={handleClose}
        >
          <div className="relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-black/80 border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-colors z-10"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.65)] p-6 overflow-hidden">
              {/* tabs — siempre visibles, solo el contenido de abajo se anima */}
              <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-black/30 border border-white/10">
                <button
                  onClick={() => handleModeChange("login")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                    mode === "login" ? "bg-[#0be881] text-black font-semibold" : "text-white/50 hover:text-white"
                  )}
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => handleModeChange("register")}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                    mode === "register" ? "bg-[#0be881] text-black font-semibold" : "text-white/50 hover:text-white"
                  )}
                >
                  Registrarse
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <h2 className="text-white font-bold text-lg mb-1">
                    {mode === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
                  </h2>
                  <p className="text-white/40 text-xs mb-5">
                    {mode === "login"
                      ? "Entra con tu cuenta para continuar."
                      : "Regístrate para guardar tu progreso y preferencias."}
                  </p>

                  <div className="space-y-2 mb-5">
                    <button
                      onClick={onGithubLogin}
                      className="hidden lg:flex w-full items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      {mode === "login" ? "Continuar con GitHub" : "Registrarme con GitHub"}
                    </button>
                    <button
                      onClick={onGoogleLogin}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-sm text-white transition-colors"
                    >
                      <GoogleIcon className="w-4 h-4" />
                      {mode === "login" ? "Continuar con Google" : "Registrarme con Google"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-white/30 text-[10px] font-medium tracking-widest uppercase">
                      o con tu correo
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {step === "email" ? (
                    <>
                      <div className="flex items-center gap-1 mb-3 p-0.5 rounded-lg bg-black/20 border border-white/[0.06] w-fit">
                        <button
                          type="button"
                          onClick={() => setEmailMethod("password")}
                          className={cn(
                            "px-3 py-1 rounded-md text-[11px] font-medium transition-colors",
                            emailMethod === "password" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
                          )}
                        >
                          Contraseña
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailMethod("otp")}
                          className={cn(
                            "px-3 py-1 rounded-md text-[11px] font-medium transition-colors",
                            emailMethod === "otp" ? "bg-white/10 text-white" : "text-white/35 hover:text-white/60"
                          )}
                        >
                          Código
                        </button>
                      </div>

                      {emailMethod === "otp" ? (
                        <>
                          <form onSubmit={handleEmailSubmit} className="space-y-2.5">
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="tu@correo.com"
                              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#0be881]/50 transition-colors"
                            />
                            <button
                              type="submit"
                              disabled={sending}
                              className="w-full py-2.5 rounded-lg bg-[#0be881] text-black text-sm font-semibold hover:bg-[#0be881]/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {sending ? "Enviando..." : "Enviar código de acceso"}
                            </button>
                          </form>
                          <p className="text-white/25 text-[10px] mt-3 text-center leading-relaxed">
                            Te mandaremos un código de 6 dígitos por correo para confirmar que la cuenta es tuya.
                          </p>
                        </>
                      ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-2.5">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@correo.com"
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#0be881]/50 transition-colors"
                          />
                          <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#0be881]/50 transition-colors"
                          />
                          <button
                            type="submit"
                            disabled={sending}
                            className="w-full py-2.5 rounded-lg bg-[#0be881] text-black text-sm font-semibold hover:bg-[#0be881]/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {sending ? "Enviando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-white/50 text-xs mb-3">
                        Enviamos un código a <span className="text-white">{email}</span>. Revisa tu bandeja (y spam).
                      </p>
                      <form onSubmit={handleCodeSubmit} className="space-y-2.5">
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          required
                          maxLength={6}
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-[#0be881]/50 transition-colors text-center tracking-[0.5em] font-semibold"
                        />
                        <button
                          type="submit"
                          disabled={verifying || code.length < 6}
                          className="w-full py-2.5 rounded-lg bg-[#0be881] text-black text-sm font-semibold hover:bg-[#0be881]/85 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {verifying ? "Verificando..." : "Confirmar código"}
                        </button>
                      </form>
                      <div className="flex items-center justify-between mt-3">
                        <button
                          type="button"
                          onClick={() => setStep("email")}
                          className="text-white/40 hover:text-white text-[11px] transition-colors"
                        >
                          ← Cambiar correo
                        </button>
                        <button
                          type="button"
                          onClick={handleResend}
                          disabled={sending}
                          className="text-[#0be881] hover:text-white text-[11px] font-medium transition-colors disabled:opacity-60"
                        >
                          Reenviar código
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}