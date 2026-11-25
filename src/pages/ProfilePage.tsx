import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { UserAvatar } from "../components/ui/UserAvatar";
import { Button } from "../components/ui/Button";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function ProfilePage() {
  useDocumentTitle("Mi Perfil | Refugio");

  const { user, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();

  const [copiedUid, setCopiedUid] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const displayName = user?.displayName || "Usuario de Refugio";
  const email = user?.email || "Sin correo registrado";
  const uid = user?.uid || "—";

  const creationDate = firebaseUser?.metadata.creationTime
    ? new Date(firebaseUser.metadata.creationTime).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Reciente";

  const handleCopyUid = async () => {
    if (!user?.uid) return;
    try {
      await navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    } catch {
      // Fallback silencioso si el portapapeles está bloqueado
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    setLogoutError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      setLogoutError("No pudimos cerrar sesión. Intentá nuevamente.");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AppLayout>
      <div className="relative mx-auto min-w-0 max-w-4xl space-y-6">
        {/* Encabezado con navegación de retorno */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-ink">
              Mi Perfil
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1">
              Consultá tus datos personales y estado de tu cuenta simulada
            </p>
          </div>

          <Link to="/dashboard">
            <Button
              type="button"
              variant="secondary"
              className="!py-2 !px-4 text-xs sm:text-sm font-semibold rounded-xl"
            >
              ← Volver a mi Billetera
            </Button>
          </Link>
        </header>

        {/* Tarjeta de Identidad y Foto de Perfil */}
        <section
          aria-labelledby="profile-summary-title"
          className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar generado automáticamente con iniciales */}
            <div className="relative group shrink-0">
              <UserAvatar
                name={user?.displayName}
                email={user?.email}
                size="xl"
              />
              <span
                title="Generado automáticamente con tus iniciales"
                className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-surface border-2 border-line text-xs shadow-2xs"
              >
                ✨
              </span>
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2
                  id="profile-summary-title"
                  className="text-xl sm:text-2xl font-black text-ink tracking-tight truncate max-w-full"
                >
                  {displayName}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cuenta Activa
                </span>
              </div>

              <p className="text-sm font-medium text-muted truncate">
                {email}
              </p>

              <p className="text-xs text-muted/80 max-w-lg leading-relaxed pt-1">
                Foto de perfil generada automáticamente a partir de tus iniciales.
                La carga de foto personalizada con almacenamiento seguro en la nube se incorporará en la próxima actualización.
              </p>
            </div>
          </div>
        </section>

        {/* Bloque de Información Personal (Solo Lectura) */}
        <section
          aria-labelledby="personal-data-title"
          className="rounded-2xl border border-line bg-surface p-6 shadow-xs space-y-5"
        >
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h3
                id="personal-data-title"
                className="text-base font-bold text-ink"
              >
                Datos personales y de acceso
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Visualización de solo lectura para esta versión
              </p>
            </div>
            <span className="rounded-lg bg-surface-soft px-2.5 py-1 text-[11px] font-semibold text-muted border border-line">
              Solo lectura
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo: Nombre completo */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <span className="text-xs font-semibold text-muted">
                Nombre y apellido
              </span>
              <p className="text-sm font-bold text-ink truncate">
                {displayName}
              </p>
            </div>

            {/* Campo: Correo electrónico */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <span className="text-xs font-semibold text-muted">
                Correo electrónico registrado
              </span>
              <p className="text-sm font-bold text-ink truncate">
                {email}
              </p>
            </div>

            {/* Campo: Identificador de Usuario (UID) */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                  Identificador de cuenta (UID)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void handleCopyUid();
                  }}
                  className="text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  {copiedUid ? "✓ ¡Copiado!" : "Copiar ID"}
                </button>
              </div>
              <p className="font-mono text-xs text-ink/80 truncate">
                {uid}
              </p>
            </div>

            {/* Campo: Fecha de alta */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <span className="text-xs font-semibold text-muted">
                Miembro de Refugio desde
              </span>
              <p className="text-sm font-bold text-ink">
                {creationDate}
              </p>
            </div>

            {/* Campo: Tipo de entorno */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <span className="text-xs font-semibold text-muted">
                Modalidad de la cuenta
              </span>
              <p className="text-sm font-bold text-brand">
                Simulador Financiero 100% de Práctica
              </p>
            </div>
          </div>
        </section>

        {/* Card Informativa de Próxima Edición */}
        <section className="rounded-2xl border border-line/80 bg-surface-soft/60 p-5">
          <div className="flex items-start gap-3.5">
            <div className="size-9 rounded-xl bg-surface border border-line flex items-center justify-center text-brand font-bold text-sm shrink-0 shadow-2xs">
              ☁
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink">
                Próximamente: Edición y almacenamiento en la nube
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Estamos trabajando en la infraestructura de almacenamiento (AWS S3) para que puedas subir tu propia fotografía de perfil, cambiar tu nombre y gestionar tus claves de seguridad directamente desde este panel.
              </p>
            </div>
          </div>
        </section>

        {/* Zona de salida */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {logoutError && (
            <p role="alert" className="text-xs font-semibold text-danger">
              {logoutError}
            </p>
          )}
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                void handleLogout();
              }}
              loading={loggingOut}
              loadingText="Saliendo…"
              className="text-xs sm:text-sm font-semibold text-danger hover:bg-danger-surface"
            >
              Cerrar sesión de mi cuenta
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
