import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { UserAvatar } from "../components/ui/UserAvatar";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { getMe, updateUserName, type BackendUser } from "../services/user";

export default function ProfilePage() {
  useDocumentTitle("Mi Perfil | Refugio");

  const { user, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();

  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [copiedUid, setCopiedUid] = useState(false);
  const [copiedDbId, setCopiedDbId] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Edición de nombre conectada a PATCH /me
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUserProfile() {
      setLoadingProfile(true);
      setProfileError(null);

      try {
        const data = await getMe(controller.signal);
        if (!controller.signal.aborted) {
          setBackendUser(data);
          setNameInput(data.name || "");
        }
      } catch {
        if (!controller.signal.aborted) {
          setProfileError("No pudimos consultar los datos del servidor. Mostrando información de sesión.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingProfile(false);
        }
      }
    }

    void fetchUserProfile();

    return () => controller.abort();
  }, []);

  const displayName = backendUser?.name || user?.displayName || "Usuario de Refugio";
  const email = backendUser?.email || user?.email || "Sin correo registrado";
  const uid = backendUser?.firebase_uid || user?.uid || "—";
  const dbId = backendUser?.id || "—";

  const rawCreationDate = backendUser?.created_at || firebaseUser?.metadata.creationTime;
  const creationDate = rawCreationDate
    ? new Date(rawCreationDate).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Reciente";

  const handleCopyText = async (text: string, type: "uid" | "dbId") => {
    if (!text || text === "—") return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === "uid") {
        setCopiedUid(true);
        setTimeout(() => setCopiedUid(false), 2000);
      } else {
        setCopiedDbId(true);
        setTimeout(() => setCopiedDbId(false), 2000);
      }
    } catch {
      // Fallback silencioso si el portapapeles está bloqueado
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError("El nombre no puede estar vacío");
      return;
    }

    setSavingName(true);
    setNameError(null);
    setNameSuccess(null);

    try {
      const updated = await updateUserName(trimmed);
      setBackendUser(updated);
      setNameSuccess("¡Nombre actualizado correctamente en la base de datos!");
      setIsEditingName(false);
      setTimeout(() => setNameSuccess(null), 4000);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "No pudimos actualizar tu nombre");
    } finally {
      setSavingName(false);
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
              Datos personales y credenciales sincronizadas con el servidor
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

        {/* Notificación de error o éxito al guardar */}
        {profileError && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-800">
            {profileError}
          </div>
        )}
        {nameSuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800 flex items-center justify-between">
            <span>✓ {nameSuccess}</span>
            <button
              type="button"
              onClick={() => setNameSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tarjeta de Identidad y Foto de Perfil */}
        <section
          aria-labelledby="profile-summary-title"
          className="relative overflow-hidden rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar generado automáticamente con iniciales */}
            <div className="relative group shrink-0">
              <UserAvatar
                name={displayName}
                email={email}
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
                  {loadingProfile ? "Sincronizando…" : "Cuenta Sincronizada"}
                </span>
              </div>

              <p className="text-sm font-medium text-muted truncate">
                {email}
              </p>

              <p className="text-xs text-muted/80 max-w-lg leading-relaxed pt-1">
                Foto de perfil generada a partir de tus iniciales y sincronizada con tu cuenta en el backend.
              </p>
            </div>
          </div>
        </section>

        {/* Bloque de Información Personal (Conectado a PostgreSQL) */}
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
                Datos de usuario en tiempo real desde la base de datos (PostgreSQL)
              </p>
            </div>
            <span className="rounded-lg bg-surface-soft px-2.5 py-1 text-[11px] font-semibold text-muted border border-line">
              PostgreSQL · Railway
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo: Nombre completo (con edición PATCH /me) */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                  Nombre y apellido
                </span>
                {!isEditingName && (
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(displayName);
                      setIsEditingName(true);
                      setNameError(null);
                    }}
                    className="text-xs font-bold text-brand hover:underline cursor-pointer"
                  >
                    Editar nombre
                  </button>
                )}
              </div>

              {isEditingName ? (
                <form onSubmit={handleSaveName} className="space-y-3 pt-1">
                  <Input
                    label="Nuevo nombre"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={100}
                    placeholder="Tu nombre completo"
                    required
                    disabled={savingName}
                  />
                  {nameError && (
                    <p className="text-xs font-semibold text-danger">{nameError}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      className="!py-1.5 !px-3 text-xs font-bold rounded-lg"
                      loading={savingName}
                      loadingText="Guardando…"
                    >
                      Guardar cambios
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!py-1.5 !px-3 text-xs font-semibold rounded-lg"
                      disabled={savingName}
                      onClick={() => {
                        setIsEditingName(false);
                        setNameError(null);
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm font-bold text-ink truncate">
                  {displayName}
                </p>
              )}
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

            {/* Campo: Fecha de alta */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <span className="text-xs font-semibold text-muted">
                Miembro de Refugio desde
              </span>
              <p className="text-sm font-bold text-ink">
                {creationDate}
              </p>
            </div>

            {/* Campo: Identificador de Usuario (Firebase UID) */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                  Identificador de autenticación (Firebase UID)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void handleCopyText(uid, "uid");
                  }}
                  className="text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  {copiedUid ? "✓ ¡Copiado!" : "Copiar UID"}
                </button>
              </div>
              <p className="font-mono text-xs text-ink/80 truncate">
                {uid}
              </p>
            </div>

            {/* Campo: ID interno en base de datos PostgreSQL */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">
                  ID de usuario en Base de Datos (UUID)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    void handleCopyText(dbId, "dbId");
                  }}
                  className="text-xs font-bold text-brand hover:underline cursor-pointer"
                >
                  {copiedDbId ? "✓ ¡Copiado!" : "Copiar ID"}
                </button>
              </div>
              <p className="font-mono text-xs text-ink/80 truncate">
                {dbId}
              </p>
            </div>

            {/* Campo: Tipo de entorno */}
            <div className="space-y-1.5 rounded-xl border border-line bg-page/50 p-3.5 sm:col-span-2">
              <span className="text-xs font-semibold text-muted">
                Modalidad de la cuenta
              </span>
              <p className="text-sm font-bold text-brand">
                Simulador Financiero 100% de Práctica · Fondos ficticios
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
