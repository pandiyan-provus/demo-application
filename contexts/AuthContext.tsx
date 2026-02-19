"use client";

/**
 * Auth Context — Client-Side Auth State
 *
 * Demonstrates to interns:
 * 1. React Context API — a way to share global state without prop drilling
 * 2. How the client learns who is logged in (via GET /api/auth/me)
 * 3. Custom hooks — `useAuth()` gives components clean access to auth state
 *
 * Usage in any client component:
 *   const { user, loading, logout } = useAuth();
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ─── Context ───────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => { },
  refreshUser: async () => { },
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch the current user from the server.
   * The server reads the HTTP-only cookie (invisible to JS) and returns user info.
   */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for an existing session when the app first loads
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = async () => {
    // Tell the server to clear the cookie
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    // Hard redirect so middleware re-evaluates the route
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Custom Hook ───────────────────────────────────────────────────────────────
/** Use this hook in any client component to access the current user and auth actions */
export function useAuth() {
  return useContext(AuthContext);
}
