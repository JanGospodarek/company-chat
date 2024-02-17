import {
  useContext,
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { User } from "@shared/types";
import { login, register, authenticate, logout } from "@shared/api";

interface AuthProvider {
  user: User | null;
  logIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthProvider);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await authenticate();

        setUser(user);
      } catch (e) {}
      setLoading(false);
    }

    loadUser();
  }, []);

  const value = {
    user,
    logIn,
    signUp,
    logOut,
  };

  async function signUp(username: string, password: string) {
    await register(username, password);

    const user = await authenticate();
    setUser(user);
  }

  async function logIn(username: string, password: string) {
    await login(username, password);

    const user = await authenticate();
    setUser(user);
  }

  async function logOut() {
    await logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
