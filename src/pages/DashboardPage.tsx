import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-page text-ink p-6">
      <header className="flex justify-between items-center pb-6 border-b border-line max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-ink">
            Hola,{" "}
            <span className="text-brand">
              {user?.displayName || user?.email}
            </span>{" "}
            👋
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Billetera Multi-moneda (ARS, USD, USDT, BTC)
          </p>
        </div>
        <Button variant="ghost" onClick={handleLogout} className="text-sm">
          Cerrar sesión
        </Button>
      </header>

      <main className="mt-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["ARS", "USD", "USDT", "BTC"].map((currency) => (
          <div
            key={currency}
            className="bg-surface border border-line p-5 rounded-2xl shadow-sm"
          >
            <span className="text-xs font-semibold text-muted">{currency}</span>
            <p className="text-2xl font-bold mt-2 text-ink">$ 0.00</p>
          </div>
        ))}
      </main>
    </div>
  );
}
