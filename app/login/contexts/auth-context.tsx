"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";

import {
  fetchCurrentUser,
  loginRequest,
  logoutRequest,
  refreshRequest,
  restoreUserSession,
} from "@/app/login/services/auth-service";
import { clearTokens, readTokens, writeTokens } from "@/app/login/lib/token-storage";
import type { AuthContextValue, AuthTokens, AuthUser, LoginPayload } from "@/app/login/types/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

function useAuthSession() {
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);
  const tokensRef = useRef<AuthTokens | null>(null);

  const syncAuthenticatedState = (nextTokens: AuthTokens, nextUser: AuthUser) => {
    tokensRef.current = nextTokens;
    writeTokens(nextTokens);
    startTransition(() => {
      setUser(nextUser);
      setStatus("authenticated");
    });
  };

  const clearSession = () => {
    tokensRef.current = null;
    clearTokens();
    startTransition(() => {
      setUser(null);
      setStatus("guest");
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const storedTokens = readTokens();

      if (!storedTokens) {
        if (!cancelled) {
          setStatus("guest");
        }
        return;
      }

      try {
        const restoredSession = await restoreUserSession(storedTokens);

        if (!cancelled) {
          syncAuthenticatedState(restoredSession.tokens, restoredSession.user);
        }
      } catch {
        if (!cancelled) {
          clearSession();
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const session = await loginRequest(payload);

    syncAuthenticatedState(session.tokens, session.user);
  };

  const logout = async () => {
    const refreshToken = tokensRef.current?.refreshToken;

    clearSession();

    if (refreshToken) {
      await logoutRequest(refreshToken);
    }
  };

  const refreshSession = async () => {
    const currentTokens = tokensRef.current ?? readTokens();

    if (!currentTokens) {
      clearSession();
      return false;
    }

    try {
      const nextTokens = await refreshRequest(currentTokens.refreshToken);
      const nextUser = await fetchCurrentUser(nextTokens.accessToken);

      syncAuthenticatedState(nextTokens, nextUser);

      return true;
    } catch {
      clearSession();
      return false;
    }
  };

  return useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      logout,
      refreshSession,
    }),
    [status, user],
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthSession();

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
