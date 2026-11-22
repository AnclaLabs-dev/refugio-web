import { useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
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
  const [error, setError] = useState<string | null>(null);
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
    setSuccess(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err) {
        setError(getAuthErrorMessage((err as { code: string }).code));
      } else {
        setError("No se pudo iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Refugio
          </h1>
          <p className="text-muted text-sm mt-1">
            Billetera digital multimoneda
          </p>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ink">Iniciar sesión</h2>
            <p className="text-sm text-muted mt-1">Ingresá tus credenciales para acceder</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="p-3 rounded-xl bg-success-surface border border-success/20 text-success text-sm font-medium">
                {success}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingresá tu contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Ingresando…"
              className="w-full mt-2"
            >
              Iniciar Sesión
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            ¿No tenés una cuenta?{" "}
            <Link
              to="/register"
              className="text-brand font-semibold hover:underline"
            >
              Registrate
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
