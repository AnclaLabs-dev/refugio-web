import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/auth/AuthLayout";
import { GoogleButton } from "../components/auth/GoogleButton";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getAuthErrorMessage } from "../services/authErrors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  useDocumentTitle("Iniciá sesión | Refugio");

  const location = useLocation();
  const locationState = location.state as {
    from?: { pathname: string };
    registeredEmail?: string;
    successMessage?: string;
  } | null;

  const [email, setEmail] = useState(locationState?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    locationState?.successMessage || null
  );
  const [loading, setLoading] = useState(false);

  // Estados para recuperación de contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [googleLoading, setGoogleLoading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkPassword, setLinkPassword] = useState("");
  const [showLinkPassword, setShowLinkPassword] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  const {
    login,
    loginWithGoogle,
    pendingEmail,
    linkPendingGoogleAccount,
    clearPendingGoogleLinking,
  } = useAuth();
  const navigate = useNavigate();

  const from = locationState?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailError(null);
    setPasswordError(null);

    let hasErrors = false;

    if (!email.trim()) {
      setEmailError("Ingresá tu correo electrónico.");
      hasErrors = true;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError("Ingresá un correo electrónico válido.");
      hasErrors = true;
    }

    if (!password) {
      setPasswordError("Ingresá tu contraseña.");
      hasErrors = true;
    }

    if (hasErrors) return;

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setError("No se pudo iniciar sesión. Verificá tus credenciales.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "auth/account-exists-with-different-credential") {
          setShowLinkModal(true);
        } else if (code !== "auth/popup-closed-by-user") {
          setError(getAuthErrorMessage(code));
        }
      } else {
        setError("No pudimos iniciar sesión con Google. Intentá nuevamente.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLinkAccount = async (e: FormEvent) => {
    e.preventDefault();
    if (!linkPassword) {
      setLinkError("Ingresá la contraseña de tu cuenta.");
      return;
    }
    setLinkLoading(true);
    setLinkError(null);
    try {
      await linkPendingGoogleAccount(linkPassword);
      setShowLinkModal(false);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setLinkError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setLinkError("No pudimos vincular las cuentas. Verificá tu contraseña.");
      }
    } finally {
      setLinkLoading(false);
    }
  };

  const handleSendResetEmail = async (e: FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);

    if (!forgotEmail.trim() || !EMAIL_REGEX.test(forgotEmail.trim())) {
      setForgotError("Por favor ingresá un correo electrónico válido.");
      return;
    }

    setForgotLoading(true);
    try {
      await sendPasswordResetEmail(auth, forgotEmail.trim());
      setForgotMessage(
        "Te enviamos un enlace a tu correo para restablecer tu contraseña. Revisá tu bandeja de entrada o spam."
      );
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setForgotError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setForgotError("No pudimos enviar el correo de recuperación. Intentá de nuevo.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Título de bienvenida */}
        <h2 className="text-2xl sm:text-[1.75rem] font-bold text-ink tracking-tight mb-2">
          Te damos la bienvenida
        </h2>
        <p className="text-sm text-muted mb-6">
          Ingresá a tu cuenta para gestionar tu billetera
        </p>

        {/* Mensajes de feedback */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-success-surface border border-success/20 text-success text-sm font-medium">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            error={emailError || undefined}
            disabled={loading}
          />

          <div className="space-y-1.5">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              error={passwordError || undefined}
              disabled={loading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="p-1 text-muted hover:text-ink focus:outline-none focus:text-brand transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              }
            />

            <div className="flex justify-start pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(true);
                  setForgotEmail(email);
                  setForgotMessage(null);
                  setForgotError(null);
                }}
                className="text-brand text-sm font-semibold hover:underline focus:outline-none cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Ingresando…"
            className="w-full mt-3 !py-3 font-bold rounded-xl"
            disabled={googleLoading}
          >
            Ingresar a mi cuenta
          </Button>
        </form>

        {/* Separador */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-surface px-3 text-muted font-semibold tracking-wider">
              o continuar con
            </span>
          </div>
        </div>

        {/* Botón de Google */}
        <GoogleButton
          onClick={() => {
            void handleGoogleSignIn();
          }}
          loading={googleLoading}
          disabled={loading}
          text="Continuar con Google"
        />

        <p className="text-center text-sm text-muted mt-6">
          ¿Primera vez en Refugio?{" "}
          <Link
            to="/register"
            className="text-brand font-bold hover:underline"
          >
            Crear cuenta gratis
          </Link>
        </p>

        {/* Modal de Recuperación de Contraseña */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-surface rounded-2xl border border-line p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">Recuperar contraseña</h3>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="text-muted hover:text-ink text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-muted">
                Ingresá el correo asociado a tu cuenta de Refugio y te enviaremos un enlace para crear una nueva contraseña.
              </p>

              {forgotMessage ? (
                <div className="p-3 rounded-xl bg-success-surface border border-success/20 text-success text-sm font-medium">
                  {forgotMessage}
                  <div className="mt-3">
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full !py-2.5 text-sm font-bold"
                      onClick={() => setShowForgotModal(false)}
                    >
                      Volver a iniciar sesión
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendResetEmail} className="space-y-4">
                  {forgotError && (
                    <div className="p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
                      {forgotError}
                    </div>
                  )}

                  <Input
                    label="Correo electrónico"
                    type="email"
                    placeholder="nombre@ejemplo.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />

                  <div className="flex gap-2 justify-end pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={forgotLoading}
                      loadingText="Enviando…"
                    >
                      Enviar enlace
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal para Vincular Cuenta de Google con Cuenta Existente por Contraseña */}
        {showLinkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs">
            <div className="w-full max-w-md bg-surface rounded-2xl border border-line p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔗</span>
                  <h3 className="text-lg font-bold text-ink">Vincular con tu cuenta</h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowLinkModal(false);
                    clearPendingGoogleLinking();
                  }}
                  className="text-muted hover:text-ink text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-ink/80 leading-relaxed">
                <p>
                  Ya tenés una cuenta registrada en Refugio con el correo{" "}
                  <strong className="text-ink font-semibold">{pendingEmail}</strong>.
                </p>
                <p className="text-muted text-xs">
                  Ingresá tu contraseña habitual para vincular tu acceso de Google. A partir de ahora podrás ingresar con cualquiera de las dos formas sin duplicar tu cuenta ni tus fondos.
                </p>
              </div>

              {linkError && (
                <div className="p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-xs font-semibold">
                  {linkError}
                </div>
              )}

              <form onSubmit={handleLinkAccount} className="space-y-4 pt-1">
                <Input
                  label="Contraseña de tu cuenta"
                  type={showLinkPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={linkPassword}
                  onChange={(e) => setLinkPassword(e.target.value)}
                  required
                  disabled={linkLoading}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowLinkPassword((prev) => !prev)}
                      tabIndex={0}
                      aria-label={showLinkPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      className="p-1 text-muted hover:text-ink focus:outline-none focus:text-brand transition-colors cursor-pointer"
                    >
                      {showLinkPassword ? (
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  }
                />

                <div className="flex gap-2 justify-end pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowLinkModal(false);
                      clearPendingGoogleLinking();
                    }}
                    disabled={linkLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={linkLoading}
                    loadingText="Vinculando…"
                  >
                    Vincular y acceder
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
