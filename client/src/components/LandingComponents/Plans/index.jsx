import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PlansSection,
  PlansInner,
  PlansHeader,
  PlansEyebrow,
  PlansTitle,
  PlansSubtitle,
  PlansGrid,
  PlanCard,
  PlanBadge,
  PlanName,
  PlanPrice,
  PlanPriceUnit,
  PlanDesc,
  PlanDivider,
  PlanFeatureList,
  PlanFeature,
  PlanCTA,
} from "./styles";

const PLANS = [
  {
    name: "Premium",
    price: "R$ 64",
    period: "/mês",
    desc: "Para equipes em crescimento que querem centralizar o conhecimento.",
    features: [
      "Até 10 usuários",
      "R$ 12,00 por usuário adicional",
      "Feed corporativo inteligente",
      "Criação ilimitada de fluxos",
      "Integração com Google Drive",
      "Comentários e curtidas",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$ 129",
    period: "/mês",
    desc: "Para organizações que precisam de controle avançado e analytics.",
    badge: "Mais popular",
    features: [
      "Até 50 usuários",
      "R$ 10,00 por usuário adicional",
      "Tudo do Premium",
      "Validação por cargo/nível",
      "Gamificação e engajamento",
      "Pastas privadas por equipe",
      "Analytics de uso",
      "Múltiplos workspaces",
      "Suporte prioritário",
    ],
    cta: "Começar com Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    desc: "Para grandes empresas com necessidades customizadas e compliance.",
    features: [
      "Usuários ilimitados",
      "Tudo do Pro",
      "SSO e autenticação corporativa",
      "Integração com SharePoint",
      "Branding personalizado",
      "Relatórios avançados",
      "Implantação dedicada",
      "SLA e suporte 24/7",
    ],
    cta: "Falar com vendas",
    highlight: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function LandingPlans() {
  return (
    <PlansSection id="plans">
      <PlansInner>
        <PlansHeader
          as={motion.div}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <PlansEyebrow>Planos e preços</PlansEyebrow>
          <PlansTitle>
            Simples, <em>transparente</em> e escalável
          </PlansTitle>
          <PlansSubtitle>
            Teste gratuitamente por 30 dias, sem cartão de crédito.
            Cancele a qualquer momento.
          </PlansSubtitle>
        </PlansHeader>

        <PlansGrid>
          {PLANS.map(({ name, price, period, desc, badge, features, cta, highlight }, i) => (
            <PlanCard
              key={name}
              $highlight={highlight}
              as={motion.div}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1 }}
            >
              {badge && (
                <PlanBadge>
                  <Zap size={12} strokeWidth={2.5} />
                  {badge}
                </PlanBadge>
              )}
              <PlanName $highlight={highlight}>{name}</PlanName>
              <PlanPrice $highlight={highlight}>
                {price}
                <PlanPriceUnit>{period}</PlanPriceUnit>
              </PlanPrice>
              <PlanDesc>{desc}</PlanDesc>
              <PlanDivider />
              <PlanFeatureList>
                {features.map((f) => (
                  <PlanFeature key={f} $highlight={highlight}>
                    <Check size={14} strokeWidth={2.5} />
                    {f}
                  </PlanFeature>
                ))}
              </PlanFeatureList>
              <PlanCTA
                as={Link}
                to="/cadastro"
                $highlight={highlight}
              >
                {cta}
              </PlanCTA>
            </PlanCard>
          ))}
        </PlansGrid>
      </PlansInner>
    </PlansSection>
  );
}
