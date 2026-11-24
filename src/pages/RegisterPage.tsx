import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/auth/AuthLayout";
import { SimulationBadge } from "../components/auth/SimulationBadge";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getAuthErrorMessage } from "../services/authErrors";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name.trim());
      navigate("/login", {
        replace: true,
        state: {
          registeredEmail: email,
          successMessage: "¡Cuenta creada con éxito! Por favor iniciá sesión para continuar.",
        },
      });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setError("No se pudo completar el registro.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroHeadline={
        <>
          Empezá a<br />
          practicar<br />
          hoy.
        </>
      }
      heroSubtitle="Creá tu cuenta de simulación en segundos y accedé a saldo ficticio para comenzar."
    >
      <div className="w-full">
        {/* Badge indicador de simulación */}
        <SimulationBadge className="mb-4" />

        {/* Título y subtítulo */}
        <div className="mb-6">
          <h2 className="text-2xl sm:text-[1.75rem] font-bold text-ink tracking-tight">
            Creá tu cuenta
          </h2>
          <p className="text-sm text-muted mt-1">
            Completá tus datos para empezar a simular
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre completo"
            type="text"
            placeholder="Tu nombre y apellido"
            required
            hideRequiredIndicator
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

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

          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            required
            hideRequiredIndicator
            hint="Debe tener al menos 6 caracteres"
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

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            loadingText="Creando cuenta…"
            className="w-full mt-3 !py-3 font-bold rounded-xl"
          >
            Crear cuenta
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
