import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/auth/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getAuthErrorMessage } from "../services/authErrors";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

function getPasswordStrength(pass: string): { score: number; label: string; color: string; width: string } {
  if (!pass) return { score: 0, label: "", color: "", width: "w-0" };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: "Débil", color: "bg-danger", width: "w-1/3" };
  if (score <= 3) return { score: 2, label: "Media", color: "bg-warning", width: "w-2/3" };
  return { score: 3, label: "Fuerte", color: "bg-success", width: "w-full" };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

export default function RegisterPage() {
  useDocumentTitle("Creá tu cuenta | Refugio");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validaciones campo a campo
  const errors: Record<string, string | undefined> = {};

  if (touched.name && !name.trim()) {
    errors.name = "El nombre y apellido es obligatorio.";
  } else if (touched.name && name.trim().length < 3) {
    errors.name = "Ingresá al menos 3 caracteres.";
  } else if (touched.name && !NAME_REGEX.test(name.trim())) {
    errors.name = "El nombre solo puede contener letras y espacios.";
  }

  if (touched.email && !email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (touched.email && !EMAIL_REGEX.test(email.trim())) {
    errors.email = "Ingresá un correo electrónico válido.";
  }

  if (touched.password && !password) {
    errors.password = "La contraseña es obligatoria.";
  } else if (touched.password && password.length < 8) {
    errors.password = "Debe tener al menos 8 caracteres.";
  } else if (touched.password && !(/[0-9]/.test(password) && /[a-zA-Z]/.test(password))) {
    errors.password = "Incluí al menos una letra y un número.";
  }

  if (touched.confirmPassword && !confirmPassword) {
    errors.confirmPassword = "Por favor confirmá tu contraseña.";
  } else if (touched.confirmPassword && password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  if (touched.terms && !termsAccepted) {
    errors.terms = "Debés aceptar los términos para continuar.";
  }

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Marcar todos los campos como tocados
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    // Validar antes de enviar
    if (!name.trim() || name.trim().length < 3 || !NAME_REGEX.test(name.trim())) return;
    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) return;
    if (password.length < 8 || !(/[0-9]/.test(password) && /[a-zA-Z]/.test(password))) return;
    if (password !== confirmPassword) return;
    if (!termsAccepted) return;

    setLoading(true);
    try {
      await register(email.trim(), password, name.trim());
      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: email.trim(),
          successMessage: "Cuenta creada correctamente. Iniciá sesión con tus credenciales.",
        },
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setGeneralError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setGeneralError("No se pudo completar el registro. Por favor intentá nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroHeadline={
        <>
          Tu ahorro<br />
          empieza<br />
          acá.
        </>
      }
      heroSubtitle="Creá tu cuenta en Refugio y empezá a proteger tus pesos en monedas duras."
    >
      <div className="w-full">
        {/* Título y subtítulo */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-[1.75rem] font-bold text-ink tracking-tight">
            Creá tu cuenta
          </h2>
          <p className="text-sm text-muted mt-1">
            Ingresá tus datos para acceder a tu billetera
          </p>
        </div>

        {/* Mensaje de error general */}
        {generalError && (
          <div className="mb-4 p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Ej. Juan Pérez"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur("name")}
            error={errors.name}
            disabled={loading}
          />

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="nombre@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur("email")}
            error={errors.email}
            disabled={loading}
          />

          <div className="space-y-1.5">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres, números y letras"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              error={errors.password}
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

            {/* Medidor visual de fortaleza */}
            {password.length > 0 && (
              <div className="pt-1 space-y-1">
                <div className="h-1.5 w-full bg-surface-soft rounded-full overflow-hidden">
                  <div className={`h-full ${strength.width} ${strength.color} transition-all duration-300`} />
                </div>
                <div className="flex justify-between items-center text-[11px] text-muted font-medium">
                  <span>Seguridad: {strength.label}</span>
                  <span>Mínimo 8 caracteres con letras y números</span>
                </div>
              </div>
            )}
          </div>

          <Input
            label="Confirmar contraseña"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repetí tu contraseña"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={errors.confirmPassword}
            disabled={loading}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={0}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="p-1 text-muted hover:text-ink focus:outline-none focus:text-brand transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
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

          {/* Checkbox de Términos y Saldo de Demostración */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                onBlur={() => handleBlur("terms")}
                className="mt-0.5 rounded border-line text-brand focus:ring-brand/30 h-4 w-4 shrink-0"
              />
              <span>
                Entiendo que <strong className="text-ink">Refugio opera con saldo de demostración</strong> y no utiliza dinero bancario real.
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs text-danger font-medium">{errors.terms}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Creando tu cuenta…"
            className="w-full mt-3 !py-3 font-bold rounded-xl"
          >
            Crear cuenta gratis
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          ¿Ya tenés una cuenta?{" "}
          <Link
            to="/login"
            className="text-brand font-bold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
