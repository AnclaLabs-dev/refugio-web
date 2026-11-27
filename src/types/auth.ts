import type { User as FirebaseUser, AuthCredential } from "firebase/auth";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  pendingEmail: string | null;
  pendingGoogleCredential: AuthCredential | null;
  linkPendingGoogleAccount: (password: string) => Promise<void>;
  clearPendingGoogleLinking: () => void;
}
