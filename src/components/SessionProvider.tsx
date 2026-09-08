"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authClient } from "@/lib/auth-client";

type SessionState = {
  email: string | null;
  name: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionState>({
  email: null,
  name: null,
  loading: true,
  signOut: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    authClient
      .getSession()
      .then(({ data }) => {
        if (cancelled) return;
        setEmail(data?.user?.email || null);
        setName(data?.user?.name || null);
      })
      .catch(() => {
        if (cancelled) return;
        setEmail(null);
        setName(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  }

  const value = useMemo(
    () => ({ email, name, loading, signOut }),
    [email, name, loading],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
