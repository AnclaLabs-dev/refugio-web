import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Accedé a tu billetera Refugio
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-400">
            Formulario de Login (Próximamente con Firebase Auth)
          </div>

          <Link
            to="/dashboard"
            className="block w-full text-center py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-lg transition"
          >
            Ingresar al Dashboard
          </Link>

          <p className="text-center text-sm text-slate-400 mt-4">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="text-emerald-400 hover:underline">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
