/**
 * DCZ Pensando Educação - Core Constants & Types
 *
 * @description This file contains route constants, data structures for AI agents,
 * user session interfaces, and the primary catalog of educational AI tools.
 * @year 2026
 */

export const ROUTE_PATHS = {
  HOME: "/",
  LOGIN: "/login",
} as const;

export interface User {
  email: string;
  isAuthenticated: boolean;
}

export type AIAgentIcon =
  | "BookOpen"
  | "FileText"
  | "Atom"
  | "FlaskConical"
  | "Dna"
  | "Library"
  | "Globe"
  | "Languages"
  | "PenTool"
  | "GraduationCap";

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: AIAgentIcon;
  requiresLogin: boolean;

  // ✅ NOVO: controla se o card está ativo (clicável) ou “em breve”
  isActive: boolean;
}

/**
 * List of AI Agents for the Educational HUB
 * Note: The "Redação" agent handles its own credit-based access internally,
 * but access to the link from the Hub still requires login for consistency.
 */
export const AI_AGENTS: AIAgent[] = [
  {
  id: "ai-ebook",
  name: "Agente IA do E-book",
  description: "Perguntas e respostas sobre os assuntos do e-book.",
  url: "/livro",
  icon: "BookOpen",
  requiresLogin: true,
  isActive: true,
},
{
  id: "ai-redacao",
  name: "Agente IA Corretor de Redação",
  description: "Correção automática com critérios de banca e relatório detalhado.",
  url: "https://redacao-grader-starter-geral.vercel.app/tools/redacao", // <-- COLE AQUI O LINK COMPLETO REAL (sem "...")
  icon: "FileText",
  requiresLogin: true,
  isActive: true,
},

  {
    id: "ai-fisica",
    name: "Agente IA Tutor de Física",
    description: "Tutoria passo a passo com foco em vestibulares.",
    url: "https://fisica.dcz-pensando-educacao.com",
    icon: "Atom",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-quimica",
    name: "Agente IA Tutor de Química",
    description: "Tutoria passo a passo com foco em vestibulares.",
    url: "https://quimica.dcz-pensando-educacao.com",
    icon: "FlaskConical",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-biologia",
    name: "Agente IA Tutor de Biologia",
    description: "Tutoria passo a passo com foco em vestibulares.",
    url: "https://biologia.dcz-pensando-educacao.com",
    icon: "Dna",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-historia",
    name: "Agente IA Tutor de História",
    description: "Tutoria passo a passo com foco em vestibulares.",
    url: "https://historia.dcz-pensando-educacao.com",
    icon: "Library",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-geografia",
    name: "Agente IA Tutor de Geografia",
    description: "Tutoria passo a passo com foco em vestibulares.",
    url: "https://geografia.dcz-pensando-educacao.com",
    icon: "Globe",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-portugues",
    name: "Agente IA Tutor de Português",
    description: "Gramática, interpretação e produção de texto.",
    url: "https://portugues.dcz-pensando-educacao.com",
    icon: "Languages",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-english-writing",
    name: "Agente IA Escrita em Inglês",
    description: "Correção e melhoria de escrita em inglês com feedback claro.",
    url: "https://writing-english.dcz-pensando-educacao.com",
    icon: "PenTool",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
  {
    id: "ai-english-learning",
    name: "Agente IA Aprendizagem de Inglês",
    description: "Prática guiada e personalizada para aprender inglês.",
    url: "https://learn-english.dcz-pensando-educacao.com",
    icon: "GraduationCap",
    requiresLogin: true,
    isActive: false, // ⛔ EM BREVE
  },
];