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
  type User as FirebaseUser,
} from "firebase/auth";
import { apiFetch } from "../services/api";
import { auth } from "../services/firebase";
import type { AuthContextType, UserProfile } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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

  const register = async (email: string, pass: string, name: string) => {
    // 1. Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, pass);

    // 2. Asignar el nombre en el perfil de Firebase
    await updateProfile(cred.user, { displayName: name });

    // 3. Sincronizar con el Backend de Railway (crea usuario en Postgres, wallet y saldo ARS)
    try {
      const token = await cred.user.getIdToken();
      await apiFetch("/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });
    } catch (apiError) {
      console.error("Error al sincronizar usuario con backend:", apiError);
      // No frenamos el flujo si el backend ya lo registró
    }

    // 4. Cerramos sesión por seguridad (solicitud de Caro) para que ingrese desde login
    await signOut(auth);
    setFirebaseUser(null);
    setUser(null);
  };

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);

    // Sincronizamos también al iniciar sesión para asegurar consistencia
    try {
      const token = await cred.user.getIdToken();
      await apiFetch("/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: cred.user.displayName || "" }),
      });
    } catch (apiError) {
      console.warn("Advertencia al sincronizar en login:", apiError);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        login,
        register,
        logout,
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
