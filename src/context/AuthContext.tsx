import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  linkWithCredential,
  GoogleAuthProvider,
  type User as FirebaseUser,
  type AuthCredential,
} from "firebase/auth";
import { apiFetch } from "../services/api";
import { auth, googleProvider } from "../services/firebase";
import type { AuthContextType, UserProfile } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Estados para vinculación de cuentas cuando ya existe el correo (Account Linking)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<AuthCredential | null>(null);

  useEffect(() => {
    // onAuthStateChanged se suscribe a los cambios de estado en Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setFirebaseUser(currentUser);
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup al desmontar el componente
    return () => unsubscribe();
  }, []);

  const syncUserWithBackend = async (fUser: FirebaseUser, overrideName?: string) => {
    try {
      const token = await fUser.getIdToken();
      await apiFetch("/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: overrideName ?? fUser.displayName ?? "" }),
      });
    } catch (apiError) {
      console.warn("Advertencia al sincronizar con backend:", apiError);
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    // 1. Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, pass);

    // 2. Asignar el nombre en el perfil de Firebase
    await updateProfile(cred.user, { displayName: name });

    // 3. Sincronizar con el Backend de Railway (crea usuario en Postgres, wallet y saldos)
    await syncUserWithBackend(cred.user, name);

    // 4. Cerramos sesión por seguridad (solicitud de Caro) para que ingrese desde login
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
  };

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await syncUserWithBackend(cred.user);
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await syncUserWithBackend(cred.user);
    } catch (error: unknown) {
      const fbError = error as { code?: string; customData?: { email?: string } };
      if (fbError?.code === "auth/account-exists-with-different-credential") {
        const pendingCred = GoogleAuthProvider.credentialFromError(error as Parameters<typeof GoogleAuthProvider.credentialFromError>[0]);
        const email = fbError.customData?.email || null;
        setPendingGoogleCredential(pendingCred);
        setPendingEmail(email);
      }
      throw error;
    }
  };

  const linkPendingGoogleAccount = async (password: string) => {
    if (!pendingGoogleCredential || !pendingEmail) {
      throw new Error("No hay credenciales pendientes para vincular.");
    }
    const userCred = await signInWithEmailAndPassword(auth, pendingEmail, password);
    await linkWithCredential(userCred.user, pendingGoogleCredential);
    setPendingGoogleCredential(null);
    setPendingEmail(null);
    await syncUserWithBackend(userCred.user);
  };

  const clearPendingGoogleLinking = () => {
    setPendingGoogleCredential(null);
    setPendingEmail(null);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateProfileName = async (name: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    setUser((prev) => (prev ? { ...prev, displayName: name } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfileName,
        pendingEmail,
        pendingGoogleCredential,
        linkPendingGoogleAccount,
        clearPendingGoogleLinking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
