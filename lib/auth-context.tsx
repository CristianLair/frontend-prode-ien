"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as api from "./api";

interface AuthState {
  user: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: string, password: string) => Promise<void>;
  registro: (user: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

// El token es un JWT simple; decodificamos el payload para sacar el
// nombre de usuario sin pegarle de nuevo al backend en cada carga de página.
function decodeUserFromToken(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.user ?? decoded.sub ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Sincronizamos el estado de auth con localStorage (un sistema externo al
  // árbol de React) recién en el primer render del cliente, ya que en el
  // servidor no existe localStorage. Este es el caso de uso documentado por
  // React para setState dentro de un efecto: sincronizar con un sistema externo.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sincroniza el estado
       de auth con localStorage en el mount inicial del cliente; es el caso
       de uso que React documenta para setState dentro de un efecto. */
    const token = api.getToken();
    if (token) {
      setUser(decodeUserFromToken(token));
    }
    setIsLoading(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = useCallback(async (userInput: string, password: string) => {
    const res = await api.login(userInput, password);
    api.setToken(res.token);
    setUser(decodeUserFromToken(res.token) ?? userInput);
  }, []);

  const registro = useCallback(async (userInput: string, password: string) => {
    await api.registro(userInput, password);
    // El backend no devuelve token en /registro; pedimos login después.
    await login(userInput, password);
  }, [login]);

  const logout = useCallback(() => {
    api.clearToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
