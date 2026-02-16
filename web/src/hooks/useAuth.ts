import { useState, useEffect, useCallback } from "react";
import { User } from "@/lib/index";
import { requestOtp, signOut } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * Supabase Auth (Magic Link) - Hook de sessão
 * - Envia magic link por e-mail
 * - Detecta sessão após o callback (/auth/callback) e mantém o estado sincronizado
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null =
      null;

    async function init() {
      try {
        // 1) Restaura sessão (se já existir)
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setUser({ email: data.session.user.email, isAuthenticated: true });
        } else {
          setUser(null);
        }

        // 2) Mantém sincronizado quando o Supabase muda o estado (login/logout/refresh)
        unsub = supabase.auth.onAuthStateChange((_event, session) => {
          const email = session?.user?.email;
          if (email) {
            setUser({ email, isAuthenticated: true });
          } else {
            setUser(null);
          }
        });
      } finally {
        setIsLoading(false);
      }
    }

    init();

    return () => {
      unsub?.data.subscription.unsubscribe();
    };
  }, []);

  const sendOTP = useCallback(async (email: string): Promise<boolean> => {
    // Envia magic link (vai aparecer request no Network; e o Supabase manda o e-mail)
    await requestOtp(email);
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      window.location.reload();
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user?.isAuthenticated,
    sendOTP,
    // Mantido só para compatibilidade; o Hub usa Magic Link (não precisa de código de 6 dígitos)
    login: async () => false,
    logout,
  };
}
