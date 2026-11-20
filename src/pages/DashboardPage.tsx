import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <header className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">
            Refugio Wallet
          </h1>
          <p className="text-xs text-slate-400">
            Panel Principal Multi-moneda (ARS, USD, USDT, BTC)
          </p>
        </div>
        <Link
          to="/login"
          className="text-sm px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
        >
          Cerrar sesión
        </Link>
      </header>

      <main className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["ARS", "USD", "USDT", "BTC"].map((currency) => (
          <div
            key={currency}
            className="bg-slate-900 border border-slate-800 p-5 rounded-xl shadow"
          >
            <span className="text-xs font-semibold text-slate-400">
              {currency}
            </span>
            <p className="text-xl font-bold mt-2 text-slate-100">$ 0.00</p>
          </div>
        ))}
      </main>
    </div>
  );
}
