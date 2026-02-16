import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Finalizando login...");

  useEffect(() => {
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    async function run() {
      try {
        // 1) Se o Supabase estiver usando PKCE, pode vir ?code=...
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
        }

        // 2) Checa sessão
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/", { replace: true });
          return;
        }

        // 3) Se ainda não tiver sessão, escuta uma mudança (fallback)
        unsub = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            navigate("/", { replace: true });
          } else {
            setMsg("Não foi possível concluir o login. Tente novamente.");
          }
        });
      } catch (err) {
        setMsg("Não foi possível concluir o login. Tente novamente.");
      }
    }

    run();

    return () => {
      unsub?.data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h2>{msg}</h2>
      <p>Você pode fechar esta aba se for redirecionado automaticamente.</p>
    </div>
  );
}