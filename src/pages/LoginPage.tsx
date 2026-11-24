import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SimulationBadge } from "../components/auth/SimulationBadge";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getAuthErrorMessage } from "../services/authErrors";

export default function LoginPage() {
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
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(
    locationState?.successMessage || null
  );
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const from = locationState?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setSuccess(null);
    setLoading(true);

    try {
      await login(email, password);
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

  const handleForgotPassword = () => {
    setInfoMessage(
      "El restablecimiento automático de contraseña estará disponible próximamente. Si necesitás ayuda con tu cuenta, contactá al equipo de soporte."
    );
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Badge superior */}
        <SimulationBadge className="mb-4" />

        {/* Título de bienvenida */}
        <h2 className="text-2xl sm:text-[1.75rem] font-bold text-ink tracking-tight mb-6">
          Te damos la bienvenida
        </h2>

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

        {infoMessage && (
          <div className="mb-4 p-3 rounded-xl bg-brand-soft border border-brand/20 text-ink text-sm flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <span className="text-brand font-bold shrink-0">ℹ</span>
              <span>{infoMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setInfoMessage(null)}
              className="text-muted hover:text-ink text-xs font-bold px-1"
              aria-label="Cerrar aviso"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            hideRequiredIndicator
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <div className="space-y-1.5">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              hideRequiredIndicator
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                    /* Ojo tachado */
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
                    /* Ojo abierto */
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
                onClick={handleForgotPassword}
                className="text-brand text-sm font-semibold hover:underline focus:outline-none cursor-pointer"
              >
                Olvidé mi contraseña
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Ingresando…"
            className="w-full mt-3 !py-3 font-bold rounded-xl"
          >
            Ingresar
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Primera vez?{" "}
          <Link
            to="/register"
            className="text-brand font-bold hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
