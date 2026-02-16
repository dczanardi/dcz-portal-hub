import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Livro from "@/pages/Livro";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * DCZ Pensando Educação - Root Application Component
 *
 * @description Sets up the essential providers for the application including
 * React Query for state management, Tooltip for UI enhancements, and
 * React Router for navigation between the Educational HUB and Login screens.
 * @year 2026
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTE_PATHS.HOME} element={<Home />} />
              <Route path={ROUTE_PATHS.LOGIN} element={<Login />} />
              <Route path="/livro" element={<Livro />} />


              {/* Supabase Magic Link callback */}
              <Route path="/auth/callback" element={<AuthCallback />} />

              {/* Catch-all route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </BrowserRouter>

        {/* Global UI Notifications */}
        <Toaster />
        <Sonner position="top-right" expand={false} richColors closeButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}