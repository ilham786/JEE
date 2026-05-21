import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Mock auth for local development
 * In production, replace with Clerk, Auth.js, or similar
 */

export interface User {
  id: string;
  email: string;
  name: string;
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  monkModeEnabled: boolean;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const MOCK_USER: User = {
  id: "user-demo-123",
  email: "demo@focusforge.com",
  name: "JEE Aspirant",
  xp: 3450,
  level: 4,
  currentStreak: 12,
  longestStreak: 21,
  monkModeEnabled: false,
  createdAt: new Date().toISOString(),
};

const STORAGE_KEY = "focusforge-auth-session";

/**
 * useAuth Hook - Mock authentication for local development
 * Returns auth state and methods to login/logout
 */
export function useAuth(): AuthSession & {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
} {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSession({
            user: parsed.user,
            token: parsed.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setSession((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        setSession((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        // Mock API call - in production, call your auth backend
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error("Login failed");
        }

        const data = await response.json();

        const newSession: AuthSession = {
          user: {
            ...MOCK_USER,
            email,
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
          },
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
        router.push("/dashboard");
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    [router]
  );

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        // Mock sign up - in production, call your auth backend
        const newSession: AuthSession = {
          user: {
            ...MOCK_USER,
            email,
            name,
            id: `user-${Math.random().toString(36).substring(2, 9)}`,
          },
          token: Buffer.from(`${email}:${password}`).toString("base64"),
          isAuthenticated: true,
          isLoading: false,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
        setSession(newSession);
        router.push("/dashboard");
      } catch (error) {
        console.error("Sign up error:", error);
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push("/");
  }, [router]);

  return {
    ...session,
    login,
    logout,
    signUp,
  };
}

/**
 * Hook to check if user is authenticated
 * Useful for route protection
 */
export function useRequireAuth(): User | null {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  return isAuthenticated ? user : null;
}
