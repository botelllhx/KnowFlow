import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import {
  HeroSection,
  HeroInner,
  Eyebrow,
  HeroTitle,
  HeroSubtitle,
  HeroActions,
  HeroPrimaryBtn,
  HeroSecondaryBtn,
  HeroVisual,
  BrowserFrame,
  BrowserBar,
  BrowserDots,
  BrowserContent,
  CanvasMockup,
  MockupNode,
  MockupLine,
  FloatingCard,
  TrustBar,
  TrustText,
  TrustAvatars,
  TrustAvatar,
} from "./styles";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
};

const visualVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.4 },
  },
};

export default function LandingHero() {
  return (
    <HeroSection>
      <HeroInner
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text side */}
        <div>
          <Eyebrow as={motion.div} variants={itemVariants}>
            Plataforma de Conhecimento Operacional
          </Eyebrow>

          <HeroTitle as={motion.h1} variants={itemVariants}>
            O conhecimento da sua empresa,{" "}
            <em>finalmente acessível</em>
          </HeroTitle>

          <HeroSubtitle as={motion.p} variants={itemVariants}>
            Transforme processos internos em fluxos navegáveis, colaborativos
            e vivos. Pare de perder conhecimento quando alguém sai da empresa.
          </HeroSubtitle>

          <HeroActions as={motion.div} variants={itemVariants}>
            <HeroPrimaryBtn as={Link} to="/cadastro">
              Começar grátis
              <ArrowRight size={15} strokeWidth={2.5} />
            </HeroPrimaryBtn>
            <HeroSecondaryBtn href="#features">
              <Play size={14} strokeWidth={2} />
              Ver como funciona
            </HeroSecondaryBtn>
          </HeroActions>

          <TrustBar as={motion.div} variants={itemVariants}>
            <TrustAvatars>
              {["M", "A", "R", "C"].map((letter, i) => (
                <TrustAvatar key={i} $index={i}>
                  {letter}
                </TrustAvatar>
              ))}
            </TrustAvatars>
            <TrustText>
              Teste gratuito de 30 dias · Sem cartão de crédito
            </TrustText>
          </TrustBar>
        </div>

        {/* Product visual */}
        <HeroVisual
          as={motion.div}
          variants={visualVariants}
          initial="hidden"
          animate="visible"
        >
          <BrowserFrame>
            <BrowserBar>
              <BrowserDots>
                <span />
                <span />
                <span />
              </BrowserDots>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  background: "rgba(0,0,0,0.04)",
                  borderRadius: 6,
                  marginLeft: 8,
                }}
              />
            </BrowserBar>
            <BrowserContent>
              <CanvasMockup>
                {/* Simulated flow nodes */}
                <MockupNode $x={10} $y={15} $w={22} $h={8} $primary />
                <MockupLine $x1={32} $y1={19} $x2={40} $y2={19} />
                <MockupNode $x={40} $y={14} $w={22} $h={10} />
                <MockupLine $x1={62} $y1={19} $x2={70} $y2={26} />
                <MockupNode $x={70} $y={22} $w={20} $h={8} />

                <MockupNode $x={10} $y={45} $w={22} $h={8} />
                <MockupLine $x1={32} $y1={49} $x2={40} $y2={49} />
                <MockupNode $x={40} $y={43} $w={22} $h={12} $primary />
                <MockupLine $x1={62} $y1={49} $x2={70} $y2={42} />
                <MockupNode $x={70} $y={38} $w={20} $h={8} />

                <MockupNode $x={10} $y={72} $w={22} $h={8} />
                <MockupLine $x1={32} $y1={76} $x2={55} $y2={76} />
                <MockupNode $x={55} $y={70} $w={22} $h={12} />

                <FloatingCard $x={60} $y={55}>
                  <div />
                  <div />
                  <div />
                </FloatingCard>
              </CanvasMockup>
            </BrowserContent>
          </BrowserFrame>
        </HeroVisual>
      </HeroInner>
    </HeroSection>
  );
}
