import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Atom,
  FlaskConical,
  Dna,
  Library,
  Globe,
  Languages,
  PenTool,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { AIAgent, AIAgentIcon, ROUTE_PATHS } from "@/lib/index";
import { useAuth } from "@/hooks/useAuth";
import { IMAGES } from "@/assets/images";

/**
 * DCZ Pensando Educação - Agent Card Component
 *
 * @description Displays an AI agent with an icon, name, and description.
 * Handles navigation and authentication logic for accessing agents.
 * @year 2026
 */

interface AgentCardProps {
  agent: AIAgent;
}

const IconMap: Record<AIAgentIcon, React.ComponentType<{ className?: string }>> =
  {
    BookOpen,
    FileText,
    Atom,
    FlaskConical,
    Dna,
    Library,
    Globe,
    Languages,
    PenTool,
    GraduationCap,
  };

const getAgentData = (agentId: string) => {
  const agentMap: Record<
    string,
    { image: string; color: string; category: string }
  > = {
    "ai-ebook": {
      image: IMAGES.DIGITAL_EBOOK_20260214_221842_62,
      color: "bg-blue-500",
      category: "Tecnologia Educacional",
    },
    "ai-redacao": {
      image: IMAGES.ESSAY_CORRECTION_20260214_221842_61,
      color: "bg-red-500",
      category: "Linguagens",
    },
    "ai-fisica": {
      image: IMAGES.PHYSICS_INCLINED_PLANE_20260214_221844_54,
      color: "bg-blue-600",
      category: "Ciências Exatas",
    },
    "ai-quimica": {
      image: IMAGES.CHEMISTRY_MOLECULES_20260214_221842_56,
      color: "bg-green-500",
      category: "Ciências da Natureza",
    },
    "ai-biologia": {
      image: IMAGES.DNA_HELIX_BIOLOGY_20260214_221843_55,
      color: "bg-emerald-500",
      category: "Ciências da Natureza",
    },
    "ai-historia": {
      image: IMAGES.HISTORY_TIMELINE_20260214_221842_57,
      color: "bg-amber-600",
      category: "Ciências Humanas",
    },
    "ai-geografia": {
      image: IMAGES.GEOGRAPHY_WORLD_MAP_20260214_221844_58,
      color: "bg-teal-500",
      category: "Ciências Humanas",
    },
    "ai-portugues": {
      image: IMAGES.PORTUGUESE_GRAMMAR_20260214_221843_59,
      color: "bg-purple-500",
      category: "Linguagens",
    },
    "ai-english-writing": {
      image: IMAGES.ENGLISH_WRITING_ICON_20260214_221310_50,
      color: "bg-indigo-500",
      category: "Linguagens",
    },
    "ai-english-learning": {
      image: IMAGES.ENGLISH_CONVERSATION_20260214_221842_60,
      color: "bg-cyan-500",
      category: "Linguagens",
    },
  };

  return (
    agentMap[agentId] || {
      image: IMAGES.AI_EDUCATION_2,
      color: "bg-primary",
      category: "Educação",
    }
  );
};

export function AgentCard({ agent }: AgentCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const agentData = getAgentData(agent.id);

  // ✅ Controle central do estado (ativo x em breve)
  const isDisabled = !agent.isActive;

  const handleAccess = () => {
    // 1) Se o agente ainda não está ativo, não faz nada
    if (isDisabled) return;

    // 2) Se precisa login e o usuário não está logado:
    // salvamos o alvo para ser aberto após o Magic Link
    if (agent.requiresLogin && !isAuthenticated) {
      localStorage.setItem("dczhub_postLoginTarget", agent.url);
      localStorage.setItem("dczhub_postLoginFrom", window.location.pathname);

      navigate(ROUTE_PATHS.LOGIN, {
        state: {
          from: window.location.pathname,
          target: agent.url,
        },
      });
      return;
    }

    // 3) Se já está logado, abre normalmente
    window.open(agent.url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      // ✅ Se estiver desabilitado, não faz animação de hover
      whileHover={isDisabled ? undefined : { y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="h-full"
    >
      <div
        // ✅ Se estiver desabilitado, fica cinza + não sobe + não tem hover shadow
        className={`relative bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 ${
          isDisabled
            ? "opacity-50 grayscale cursor-not-allowed"
            : "hover:shadow-2xl"
        }`}
      >
        {/* Tarja EM BREVE */}
        {isDisabled && (
          <div className="pointer-events-none absolute -right-10 top-6 rotate-45 bg-zinc-800/90 px-14 py-1 text-xs font-semibold text-white shadow z-10">
            EM BREVE
          </div>
        )}

        {/* Image Section - Takes up half the card */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={agentData.image}
            alt={`Ilustração ${agent.name}`}
            className="w-full h-full object-cover"
          />

          {/* Category Tag */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {agentData.category}
          </div>

          {/* Brand Icon */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-gray-700">DCZ</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Title with colored dot */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-3 h-3 rounded-full ${agentData.color} mt-1.5 flex-shrink-0`}
            ></div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">
              {agent.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
            {agent.description}
          </p>

          {/* Action Button */}
          <button
            // ✅ Não clica quando está desabilitado
            onClick={isDisabled ? undefined : handleAccess}
            disabled={isDisabled}
            className={`w-full font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg ${
              isDisabled
                ? "bg-zinc-300 text-zinc-600 cursor-not-allowed"
                : `${agentData.color} text-white hover:opacity-90`
            }`}
          >
            <span className="text-sm">{isDisabled ? "⏳" : "✨"}</span>
            {isDisabled ? "Em breve" : "Acessar Agente de Estudo"}
            {!isDisabled && (
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}