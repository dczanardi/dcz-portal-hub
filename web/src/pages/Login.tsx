import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { ROUTE_PATHS } from "@/lib/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { springPresets, fadeInUp } from "@/lib/motion";

/**
 * Login Page - DCZ Pensando Educação
 *
 * Fluxo: Magic Link (link no e-mail)
 * 1) Usuário digita o e-mail
 * 2) App envia um link de acesso por e-mail
 * 3) Usuário clica no link e volta logado para o Hub
 */
export default function Login() {
  const { sendOTP, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado de UI: depois de enviar, mostramos a tela “confira seu e-mail”
  const [sent, setSent] = useState(false);

// Redirect if already authenticated
useEffect(() => {
if (isAuthenticated && !authLoading) {
  const stateFrom = (location.state as any)?.from;
  const stateTarget = (location.state as any)?.target as string | undefined;

  const lsFrom = localStorage.getItem("dczhub_postLoginFrom") || undefined;
  const lsTarget = localStorage.getItem("dczhub_postLoginTarget") || undefined;

  const from = stateFrom || lsFrom || ROUTE_PATHS.HOME;
  const target = stateTarget || lsTarget;

if (target) {
  localStorage.removeItem("dczhub_postLoginTarget");
  localStorage.removeItem("dczhub_postLoginFrom");

  if (target.startsWith("/")) {
    navigate(target, { replace: true });
    return;
  }

  window.location.assign(target);
  return;
}

  navigate(from, { replace: true });
}

}, [isAuthenticated, authLoading, navigate, location]);

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await sendOTP(email);
      if (success) {
        setSent(true);
      } else {
        setError("Não foi possível enviar o link. Tente novamente.");
      }
    } catch {
      setError("Ocorreu um erro ao enviar o link. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        transition={springPresets.gentle}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              {sent ? (
                <CheckCircle2 className="text-primary w-6 h-6" />
              ) : (
                <Mail className="text-primary w-6 h-6" />
              )}
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight">
              {sent ? "Confira seu e-mail" : "Acessar o Hub"}
            </CardTitle>

            <CardDescription className="text-muted-foreground">
              {sent ? (
                <>
                  Enviamos um <b>link de acesso</b> para <b>{email}</b>. <br />
                  Abra o e-mail e clique em <b>“Log In”</b> para entrar.
                </>
              ) : (
                "Digite seu e-mail para receber um link de acesso (Magic Link)."
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendLink}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail institucional ou pessoal</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full font-medium h-11"
                    disabled={isSubmitting || !email}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Enviar link de acesso
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent-step"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="rounded-md border border-border bg-background/40 p-4 text-sm text-muted-foreground">
                    <p className="mb-2">
                      1) Abra o seu e-mail (<b>Inbox</b> e <b>Spam</b>)
                    </p>
                    <p className="mb-2">
                      2) Procure por <b>Supabase Auth</b>
                    </p>
                    <p>
                      3) Clique no botão <b>“Log In”</b>
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSent(false);
                      setError(null);
                    }}
                  >
                    Trocar e-mail
                  </Button>

                  <Button
                    type="button"
                    className="w-full h-11"
                    disabled={isSubmitting}
                    onClick={async () => {
                      if (!email) return;
                      setIsSubmitting(true);
                      setError(null);
                      try {
                        const success = await sendOTP(email);
                        if (!success) setError("Não foi possível reenviar o link.");
                      } catch {
                        setError("Ocorreu um erro ao reenviar o link.");
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Reenviar link"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <Alert variant="destructive" className="mt-4 py-2">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-2">
            <p className="text-xs text-center text-muted-foreground px-4">
              Ao continuar, você concorda com nossos termos de uso e política de
              privacidade. © 2026 DCZ Pensando Educação.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}