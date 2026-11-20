import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">
          Crear Cuenta
        </h1>
        <p className="text-slate-400 text-sm mb-6">Registrate en Refugio</p>

        <div className="space-y-4">
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 text-xs text-slate-400">
            Formulario de Registro (Próximamente con Firebase Auth)
          </div>

          <Link
            to="/login"
            className="block w-full text-center py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
