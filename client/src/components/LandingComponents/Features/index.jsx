import { motion } from "framer-motion";
import { Split, BookOpen, Users, Zap, Shield, BarChart3 } from "lucide-react";
import {
  FeaturesSection,
  FeaturesInner,
  FeaturesHeader,
  FeaturesEyebrow,
  FeaturesTitle,
  FeaturesSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIconBox,
  FeatureCardTitle,
  FeatureCardDesc,
} from "./styles";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Fluxos navegáveis e vivos",
    desc: "Crie documentações interativas com nós, etapas e decisões. Conhecimento que as pessoas realmente usam.",
    color: "#233DFF",
    bg: "rgba(35,61,255,0.08)",
  },
  {
    icon: Users,
    title: "Colaboração em tempo real",
    desc: "Times inteiros contribuem, comentam e validam fluxos. Feedback contínuo integrado ao processo de criação.",
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.08)",
  },
  {
    icon: Split,
    title: "Feed corporativo inteligente",
    desc: "Descubra fluxos relevantes da sua organização com filtros por categoria, time e relevância.",
    color: "#34C759",
    bg: "rgba(52,199,89,0.08)",
  },
  {
    icon: Zap,
    title: "Modo de execução",
    desc: "Transforme fluxos em playbooks operacionais executáveis. Acompanhe o progresso step-by-step.",
    color: "#FF9500",
    bg: "rgba(255,149,0,0.08)",
  },
  {
    icon: BarChart3,
    title: "Analytics operacional",
    desc: "Entenda quais fluxos são mais usados, onde surgem gargalos e como o conhecimento circula.",
    color: "#233DFF",
    bg: "rgba(35,61,255,0.08)",
  },
  {
    icon: Shield,
    title: "Segurança empresarial",
    desc: "Controle granular de permissões, workspaces por equipe e auditoria completa de acesso.",
    color: "#6C63FF",
    bg: "rgba(108,99,255,0.08)",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function LandingFeatures() {
  return (
    <FeaturesSection id="features">
      <FeaturesInner>
        <FeaturesHeader
          as={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <FeaturesEyebrow>Por que o KnowFlow</FeaturesEyebrow>
          <FeaturesTitle>
            Conhecimento que <em>funciona</em> na prática
          </FeaturesTitle>
          <FeaturesSubtitle>
            Chega de documentação morta. O KnowFlow transforma processos em
            estruturas vivas que a equipe realmente usa no dia a dia.
          </FeaturesSubtitle>
        </FeaturesHeader>

        <FeaturesGrid>
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <FeatureCard
              key={title}
              as={motion.div}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <FeatureIconBox style={{ background: bg, color }}>
                <Icon size={22} strokeWidth={1.8} />
              </FeatureIconBox>
              <FeatureCardTitle>{title}</FeatureCardTitle>
              <FeatureCardDesc>{desc}</FeatureCardDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesInner>
    </FeaturesSection>
  );
}
