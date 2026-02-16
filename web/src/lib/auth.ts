import { supabase } from "./supabase";

export async function requestOtp(email: string) {
  // Sempre volta para /login no mesmo domínio onde o Hub estiver rodando
  // (Codespaces ou Vercel)
  const emailRedirectTo = `${window.location.origin}/login`;

  console.log("[Auth 2026] Solicitando OTP para:", email);
  console.log("[Auth 2026] Redirect:", emailRedirectTo);

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    console.error("[Auth 2026] ERRO signInWithOtp:", error);
    throw error;
  }

  console.log("[Auth 2026] signInWithOtp OK:", data);
  return data;
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}