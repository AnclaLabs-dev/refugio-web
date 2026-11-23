import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { getAuthErrorMessage } from "../services/authErrors";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-ink tracking-tight">
            Refugio
          </h1>
          <p className="text-muted text-sm mt-1">
            Tu billetera digital multimoneda
          </p>
        </div>

        <Card>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-ink">Crear cuenta</h2>
            <p className="text-sm text-muted mt-1">Ingresá tus datos para comenzar</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-danger-surface border border-danger/20 text-danger text-sm font-medium">
                {error}
              </div>
            )}

            <Input
              label="Nombre y Apellido"
              placeholder="Juan Pérez"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />

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
              placeholder="Mínimo 6 caracteres"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              hint="Al menos 6 caracteres"
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              loadingText="Creando cuenta…"
              className="w-full mt-2"
            >
              Registrarme
            </Button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            ¿Ya tenés cuenta?{" "}
            <Link
              to="/login"
              className="text-brand font-semibold hover:underline"
            >
              Iniciá sesión
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
