import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AI_AGENTS } from "@/lib/index";
import { AgentCard } from "@/components/AgentCard";
import { IMAGES } from "@/assets/images";
import { Button } from "@/components/ui/button";

/**
 * DCZ Pensando Educação - Home Page
 * @description Landing page featuring a premium academic hero section and a 
 * modular grid of AI agents for education.
 * @year 2026
 */
export default function Home() {
  const scrollToCatalog = () => {
    const element = document.getElementById("catalogo");
    element?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };
  return <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.AI_EDUCATION_2} alt="Academic Environment" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          ease: "easeOut"
        }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              DCZ <span className="text-primary">Pensando Educação</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              Inovação tecnológica e tradição acadêmica unidas para transformar 
              o aprendizado. Explore nossa biblioteca de agentes de Inteligência 
              Artificial especializados.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={scrollToCatalog} className="h-14 px-10 text-lg font-medium shadow-lg hover:shadow-primary/20 transition-all">
                Explorar Agentes
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1,
        duration: 1
      }} className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer" onClick={scrollToCatalog}>
          <ChevronDown className="w-8 h-8 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* Catalog Section */}
      <section id="catalogo" className="py-24 px-4 bg-muted/20 border-t border-border/30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Agentes de IA para Educação
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Ferramentas modulares desenvolvidas para potencializar o ensino, 
                da correção de redações à tutoria especializada em disciplinas do vestibular.
              </p>
            </div>
            <div className="h-px flex-1 bg-border hidden md:block mx-8 mb-3" />
            <div className="text-sm font-mono text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {AI_AGENTS.length} AGENTES DISPONÍVEIS
            </div>
          </div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: "-100px"
        }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {AI_AGENTS.map(agent => <motion.div key={agent.id} variants={itemVariants}>
                <AgentCard agent={agent} />
              </motion.div>)}
          </motion.div>
        </div>
      </section>

      {/* Academic Footer Accent */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="w-12 h-1 bg-primary mx-auto mb-8 rounded-full" />
            <p className="italic text-lg text-muted-foreground font-medium">"A boa educação não transfere conhecimento: conduz à sabedoria."</p>
            <span className="block mt-4 text-sm font-semibold tracking-widest uppercase">
              © 2026 DCZ Pensando Educação
            </span>
          </div>
        </div>
      </section>
    </div>;
}