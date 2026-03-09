import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "@/lib/index";
import { supabase } from "@/lib/supabase";
import { EBOOK_DRIVE_FOLDER } from "@/lib/ebookMaterials";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type Msg = { role: "user" | "assistant"; text: string };

export default function Livro() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [hasEntitlement, setHasEntitlement] = useState<boolean | null>(null);
  const [code, setCode] = useState<string>("");
  const [checkingEntitlement, setCheckingEntitlement] = useState<boolean>(false);
  const [submittingCode, setSubmittingCode] = useState<boolean>(false);
  const [codeError, setCodeError] = useState<string>("");

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Olá! Pode enviar a sua dúvida sobre o e-book." },
  ]);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      localStorage.setItem("dczhub_postLoginTarget", "/livro");
      localStorage.setItem("dczhub_postLoginFrom", "/");
      navigate(ROUTE_PATHS.LOGIN, { state: { from: "/" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    async function loadAndCheck() {
      if (isLoading) return;
      if (!isAuthenticated) return;

      setCheckingEntitlement(true);
      setCodeError("");

      try {
        const { data: sessionData, error: sessionErr } =
          await supabase.auth.getSession();
        if (sessionErr) throw sessionErr;

        const sessionEmail = sessionData.session?.user?.email || "";
        setEmail(sessionEmail);

        if (!sessionEmail) {
          setHasEntitlement(false);
          return;
        }

        const { data, error } = await supabase
          .from("ebook_entitlements")
          .select("email")
          .eq("email", sessionEmail)
          .maybeSingle();

        if (error) {
          setHasEntitlement(false);
          return;
        }

        setHasEntitlement(!!data?.email);
      } finally {
        setCheckingEntitlement(false);
      }
    }

    loadAndCheck();
  }, [isAuthenticated, isLoading]);

  async function submitCode() {
    const normalized = code.trim();
    if (!normalized) {
      setCodeError("Digite o código do e-book.");
      return;
    }

    setSubmittingCode(true);
    setCodeError("");

    try {
      const { data: codeRow, error: codeErr } = await supabase
        .from("ebook_access_codes")
        .select("code, is_active")
        .eq("code", normalized)
        .eq("is_active", true)
        .maybeSingle();

      if (codeErr) {
        setCodeError("Não consegui validar o código agora. Tente novamente.");
        return;
      }

      if (!codeRow?.code) {
        setCodeError("Código inválido (ou desativado). Confira e tente de novo.");
        return;
      }

      if (!email) {
        setCodeError("Não consegui identificar seu e-mail. Faça login novamente.");
        return;
      }

      const { error: insErr } = await supabase
        .from("ebook_entitlements")
        .insert({ email });

      if (
        insErr &&
        String(insErr.message || "").toLowerCase().includes("duplicate")
      ) {
        setHasEntitlement(true);
        return;
      }

      if (insErr) {
        setCodeError(
          "Seu código está correto, mas o sistema não conseguiu liberar seu acesso (bloqueio de permissão)."
        );
        return;
      }

      setHasEntitlement(true);
    } finally {
      setSubmittingCode(false);
    }
  }

  async function send() {
    const pergunta = input.trim();
    if (!pergunta || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: pergunta }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("https://dczanardi.app.n8n.cloud/webhook/chat-livro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pergunta }),
      });

      const data = (await res.json()) as { text?: string };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data?.text || "Não consegui obter resposta do servidor.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Falha de conexão com o servidor. Tente novamente.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (isAuthenticated && checkingEntitlement) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">PERGUNTE AO AGENTE IA DO EBOOK</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Eu vou responder com base no conteúdo do e-book.
        </p>
        <div className="mt-6 rounded-xl border bg-card p-4 text-sm">
          Verificando seu acesso...
        </div>
      </div>
    );
  }

  if (isAuthenticated && hasEntitlement === false) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">PERGUNTE AO AGENTE IA DO EBOOK</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Eu vou responder com base no conteúdo do e-book.
        </p>

        <div className="mt-6 rounded-xl border bg-card p-5">
          <p className="text-sm">
            Para acessar o agente, digite abaixo o{" "}
            <span className="font-semibold">código do e-book</span>.
          </p>

          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground">
              Seu e-mail (logado)
            </label>
            <div className="mt-1 rounded-lg border px-3 py-2 text-sm bg-muted/30">
              {email || "(não encontrado)"}
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground">
              Código do e-book
            </label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="Digite o código do e-book"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitCode();
              }}
              disabled={submittingCode}
            />
            {codeError && <p className="mt-2 text-sm text-red-600">{codeError}</p>}
          </div>

          <button
            className="mt-4 rounded-lg border px-4 py-2 text-sm"
            onClick={submitCode}
            disabled={submittingCode}
          >
            {submittingCode ? "Validando..." : "Liberar acesso"}
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Se você comprou o e-book e está com o código, mas ainda não conseguiu
          liberar, me envie o seu e-mail acima.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">PERGUNTE AO AGENTE IA DO EBOOK</h1>

      <p className="text-sm text-muted-foreground mt-1">
        Eu vou responder com base no conteúdo do e-book.
      </p>

      <div className="mt-6 rounded-xl border bg-card p-4">
        <h2 className="text-lg font-semibold">{EBOOK_DRIVE_FOLDER.title}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {EBOOK_DRIVE_FOLDER.description}
        </p>

        <a
          href={EBOOK_DRIVE_FOLDER.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-muted/30 transition"
        >
          Abrir pasta no Google Drive
        </a>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-4 h-[60vh] overflow-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                    components={{
                      p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-3 last:mb-0">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 last:mb-0">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      h3: ({ children }) => <h3 className="font-semibold text-base mt-3 mb-2">{children}</h3>,
                      h2: ({ children }) => <h2 className="font-semibold text-lg mt-3 mb-2">{children}</h2>,
                      h1: ({ children }) => <h1 className="font-semibold text-xl mt-3 mb-2">{children}</h1>,
                      strong: ({ children }) => <strong>{children}</strong>,
                      em: ({ children }) => <em>{children}</em>,
                      code: ({ children }) => (
                        <code className="px-1 py-0.5 rounded bg-black/5">{children}</code>
                      ),
                    }}
                  >
                    {m.text ?? ""}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{m.text}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
          placeholder="Digite sua dúvida..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={sending}
        />
        <button
          className="rounded-lg border px-4 py-2 text-sm"
          onClick={send}
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}