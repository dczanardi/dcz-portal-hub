import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTE_PATHS } from "@/lib/index";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(64);

  // ✅ Estado real de autenticação (vindo do Supabase)
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        document.documentElement.style.setProperty("--header-height", `${height}px`);
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // ✅ Pega sessão ao carregar e escuta mudanças de login/logout
  useEffect(() => {
    let unsub: { data: { subscription: { unsubscribe: () => void } } } | null = null;

    async function load() {
      const { data } = await supabase.auth.getSession();
      setUserEmail(data.session?.user?.email ?? null);

      unsub = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email ?? null);
      });
    }

    load();

    return () => {
      unsub?.data.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    navigate(ROUTE_PATHS.HOME);
  };

  const isAuthenticated = Boolean(userEmail);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300"
      >
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link
            to={ROUTE_PATHS.HOME}
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl leading-none tracking-tight text-foreground group-hover:text-primary transition-colors">
                DCZ
              </span>
              <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Pensando Educação
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to={ROUTE_PATHS.HOME}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Início
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 md:gap-4"
                >
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      Logado como
                    </span>
                    <span className="text-sm font-mono font-medium text-foreground">
                      {userEmail}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-border hidden sm:block" />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Sair"
                  >
                    <LogOut size={20} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Button
                    variant="default"
                    asChild
                    className="rounded-full px-6 shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Link to={ROUTE_PATHS.LOGIN} className="flex items-center gap-2">
                      <UserIcon size={18} />
                      <span>Entrar</span>
                    </Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col" style={{ paddingTop: `${headerHeight}px` }}>
        {children}
      </main>

      <footer className="py-12 border-t border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-primary" />
                <span className="font-semibold text-foreground tracking-tight">DCZ Pensando Educação</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Transformando a educação através da Inteligência Artificial.
              </p>
            </div>

            <div className="text-xs text-muted-foreground font-medium">
              © 2026 DCZ Pensando Educação. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}