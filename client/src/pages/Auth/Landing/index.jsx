import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  BookOpen,
  Users,
  GitBranch,
  Zap,
  BarChart3,
  Shield,
  Check,
  Menu,
  X,
} from "lucide-react";

/* ─── UTILS ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1], delay },
});

const inViewUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1], delay },
});

/* ─── FEATURES ───────────────────────────────── */
const FEATURES = [
  {
    icon: BookOpen,
    title: "Fluxos navegáveis e vivos",
    desc: "Crie documentações interativas com nós, etapas e decisões. Conhecimento que as pessoas realmente usam.",
    accent: "#233DFF",
    bg: "rgba(35,61,255,0.07)",
  },
  {
    icon: Users,
    title: "Colaboração em tempo real",
    desc: "Times inteiros contribuem, comentam e validam fluxos. Feedback contínuo integrado ao processo de criação.",
    accent: "#6C63FF",
    bg: "rgba(108,99,255,0.07)",
  },
  {
    icon: GitBranch,
    title: "Feed corporativo inteligente",
    desc: "Descubra fluxos relevantes com filtros por categoria, time e relevância. Conhecimento como um feed vivo.",
    accent: "#34C759",
    bg: "rgba(52,199,89,0.07)",
  },
  {
    icon: Zap,
    title: "Modo de execução",
    desc: "Transforme fluxos em playbooks operacionais executáveis. Acompanhe o progresso step-by-step.",
    accent: "#FF9500",
    bg: "rgba(255,149,0,0.07)",
  },
  {
    icon: BarChart3,
    title: "Analytics operacional",
    desc: "Entenda quais fluxos são mais usados, onde surgem gargalos e como o conhecimento circula.",
    accent: "#233DFF",
    bg: "rgba(35,61,255,0.07)",
  },
  {
    icon: Shield,
    title: "Segurança empresarial",
    desc: "Controle granular de permissões, workspaces por equipe e auditoria completa de acesso.",
    accent: "#6C63FF",
    bg: "rgba(108,99,255,0.07)",
  },
];

/* ─── PLANS ─────────────────────────────────── */
const PLANS = [
  {
    name: "Premium",
    price: "R$ 64",
    period: "/mês",
    desc: "Para equipes em crescimento que querem centralizar o conhecimento.",
    features: [
      "Até 10 usuários",
      "R$ 12 por usuário adicional",
      "Feed corporativo inteligente",
      "Criação ilimitada de fluxos",
      "Integração com Google Drive",
      "Comentários e curtidas",
      "Suporte por e-mail",
    ],
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
      "R$ 10 por usuário adicional",
      "Tudo do Premium",
      "Validação por cargo e nível",
      "Gamificação e engajamento",
      "Pastas privadas por equipe",
      "Analytics de uso",
      "Múltiplos workspaces",
      "Suporte prioritário",
    ],
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
      "Suporte 24/7 dedicado",
      "SLA garantido",
    ],
    highlight: false,
  },
];

/* ─── HEADER ─────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.header
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-32px)] max-w-5xl rounded-2xl transition-all duration-300 ${
        scrolled
          ? "glass shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          : "bg-white/60 backdrop-blur-xl border border-black/[0.06]"
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-3 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img src="/KnowFlow-Logo.png" alt="KnowFlow" className="w-7 h-7 object-contain" />
          <span className="text-[15px] font-bold text-[#1D1D1F] tracking-tight">KnowFlow</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {[["Produto", "#features"], ["Planos", "#plans"], ["Comunidade", "#"]].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="text-[14px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] px-3 py-1.5 rounded-lg transition-all duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/login"
            className="text-[14px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] hover:bg-black/[0.05] px-3.5 py-1.5 rounded-lg transition-all duration-150"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-white bg-[#233DFF] hover:bg-[#1A2ECC] px-4 py-1.5 rounded-lg transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-px"
          >
            Começar grátis
            <ChevronRight size={13} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[#6E6E73] hover:bg-black/[0.05] transition-colors"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-black/[0.06] px-5 pb-4 flex flex-col gap-2 pt-3"
          >
            {[["Produto", "#features"], ["Planos", "#plans"], ["Comunidade", "#"]].map(([label, href]) => (
              <a key={label} href={href} className="text-[14px] font-medium text-[#6E6E73] py-1.5">
                {label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" className="text-[14px] font-medium text-[#1D1D1F] py-1.5">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="inline-flex items-center justify-center gap-1.5 text-[14px] font-semibold text-white bg-[#233DFF] px-4 py-2.5 rounded-lg"
              >
                Começar grátis
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─── HERO ───────────────────────────────────── */
function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-28 pb-20 px-6 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[rgba(35,61,255,0.05)] rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[rgba(108,99,255,0.04)] rounded-full blur-[60px]" />
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative">
        {/* Text */}
        <div>
          <motion.div {...fadeUp(0.1)}>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] uppercase text-[#233DFF] bg-[rgba(35,61,255,0.08)] border border-[rgba(35,61,255,0.18)] rounded-full px-3.5 py-1.5 mb-7">
              Plataforma de Conhecimento Operacional
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.18)}
            className="font-serif text-[clamp(36px,5vw,60px)] font-bold text-[#1D1D1F] leading-[1.1] tracking-[-0.03em] mb-6"
          >
            O conhecimento da sua empresa,{" "}
            <em className="font-normal italic text-[#233DFF]">finalmente acessível</em>
          </motion.h1>

          <motion.p {...fadeUp(0.26)} className="text-[17px] text-[#6E6E73] leading-[1.7] tracking-[-0.01em] mb-9 max-w-[420px]">
            Pare de perder conhecimento quando alguém sai. Transforme processos
            internos em fluxos navegáveis, colaborativos e vivos.
          </motion.p>

          <motion.div {...fadeUp(0.34)} className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              to="/cadastro"
              className="inline-flex items-center gap-2 text-[15px] font-semibold text-white bg-[#233DFF] hover:bg-[#1A2ECC] px-6 py-3.5 rounded-xl transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-0.5"
            >
              Começar grátis
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 text-[15px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] bg-transparent hover:bg-black/[0.04] border border-black/[0.10] hover:border-black/[0.14] px-5 py-3.5 rounded-xl transition-all duration-150"
            >
              Ver como funciona
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.42)} className="flex items-center gap-3">
            <div className="flex">
              {["M", "A", "R", "C"].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
                  style={{
                    marginLeft: i > 0 ? "-8px" : "0",
                    background: ["rgba(35,61,255,0.12)", "rgba(108,99,255,0.12)", "rgba(52,199,89,0.12)", "rgba(255,149,0,0.12)"][i],
                    color: ["#233DFF", "#6C63FF", "#34C759", "#FF9500"][i],
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-[#86868B] tracking-[-0.01em]">
              30 dias grátis · Sem cartão de crédito
            </p>
          </motion.div>
        </div>

        {/* Product visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
          className="relative"
        >
          {/* Browser frame */}
          <div className="rounded-2xl overflow-hidden border border-black/[0.09] shadow-float bg-white">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#F5F5F7] border-b border-black/[0.07]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <span className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 h-5 bg-black/[0.06] rounded-md ml-2" />
            </div>

            {/* Canvas mockup */}
            <div className="h-72 bg-[#FAFAFA] relative overflow-hidden">
              <div className="absolute inset-0 p-6">
                {/* Flow nodes */}
                {[
                  { x: 5, y: 15, w: 26, h: 10, primary: true },
                  { x: 36, y: 10, w: 26, h: 12, primary: false },
                  { x: 67, y: 18, w: 24, h: 9, primary: false },
                  { x: 5, y: 48, w: 26, h: 10, primary: false },
                  { x: 36, y: 43, w: 26, h: 14, primary: true },
                  { x: 67, y: 50, w: 24, h: 9, primary: false },
                  { x: 18, y: 76, w: 24, h: 9, primary: false },
                  { x: 50, y: 72, w: 26, h: 11, primary: false },
                ].map((node, i) => (
                  <div
                    key={i}
                    className={`absolute rounded-lg border ${
                      node.primary
                        ? "bg-[rgba(35,61,255,0.08)] border-[rgba(35,61,255,0.22)]"
                        : "bg-white border-black/[0.08]"
                    }`}
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      width: `${node.w}%`,
                      height: `${node.h}%`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  />
                ))}

                {/* Connections */}
                {[[31, 20, 36, 20], [62, 17, 67, 22], [31, 53, 36, 50], [62, 52, 67, 54]].map(
                  ([x1, y1, x2, y2], i) => (
                    <div
                      key={i}
                      className="absolute h-px bg-[rgba(35,61,255,0.18)]"
                      style={{
                        left: `${x1}%`,
                        top: `${y1}%`,
                        width: `${Math.abs(x2 - x1)}%`,
                      }}
                    />
                  )
                )}

                {/* Floating detail card */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-[22%] bg-white rounded-xl border border-black/[0.07] p-3 shadow-card-hover">
                  <div className="space-y-1.5">
                    <div className="h-2 w-3/4 bg-black/[0.07] rounded" />
                    <div className="h-1.5 w-full bg-black/[0.05] rounded" />
                    <div className="h-1.5 w-2/3 bg-black/[0.05] rounded" />
                    <div className="mt-2.5 h-5 w-4/5 bg-[rgba(35,61,255,0.10)] rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="absolute -left-6 top-1/3 bg-white rounded-xl border border-black/[0.08] shadow-card px-4 py-3 hidden lg:flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[rgba(52,199,89,0.12)] flex items-center justify-center text-[#34C759]">
              <Check size={16} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#1D1D1F] leading-none mb-0.5">Flow aprovado</p>
              <p className="text-[11px] text-[#86868B]">por 3 revisores</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FEATURES ───────────────────────────────── */
function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16 max-w-xl mx-auto"
          {...inViewUp(0)}
        >
          <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#233DFF] mb-4 block">
            Por que o KnowFlow
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] font-bold text-[#1D1D1F] leading-[1.15] tracking-[-0.03em] mb-4">
            Conhecimento que <em className="font-normal italic text-[#233DFF]">funciona</em> na prática
          </h2>
          <p className="text-[16px] text-[#6E6E73] leading-[1.65] tracking-[-0.01em]">
            Chega de documentação morta. O KnowFlow transforma processos em
            estruturas vivas que a equipe realmente usa.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, accent, bg }, i) => (
            <motion.div
              key={title}
              {...inViewUp(i * 0.07)}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#FAFAFA] border border-black/[0.07] rounded-2xl p-7 cursor-default hover:bg-white hover:shadow-card-hover hover:border-black/[0.10] transition-all duration-250"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: bg, color: accent }}
              >
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.02em] leading-snug mb-2.5">
                {title}
              </h3>
              <p className="text-[13.5px] text-[#6E6E73] leading-[1.65] tracking-[-0.01em]">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PLANS ─────────────────────────────────── */
function Plans() {
  return (
    <section id="plans" className="py-24 px-6 bg-[#FAFAFA] relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/[0.07] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-16 max-w-xl mx-auto" {...inViewUp(0)}>
          <span className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#233DFF] mb-4 block">
            Planos e preços
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,42px)] font-bold text-[#1D1D1F] leading-[1.15] tracking-[-0.03em] mb-4">
            Simples, <em className="font-normal italic text-[#233DFF]">transparente</em> e escalável
          </h2>
          <p className="text-[16px] text-[#6E6E73] leading-[1.65] tracking-[-0.01em]">
            Teste gratuitamente por 30 dias, sem cartão de crédito. Cancele a qualquer momento.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map(({ name, price, period, desc, badge, features, highlight }, i) => (
            <motion.div
              key={name}
              {...inViewUp(i * 0.1)}
              className={`relative rounded-2xl p-8 transition-all duration-250 ${
                highlight
                  ? "bg-[#233DFF] shadow-[0_16px_48px_rgba(35,61,255,0.28),0_4px_12px_rgba(35,61,255,0.15)] md:scale-[1.04] hover:shadow-[0_20px_56px_rgba(35,61,255,0.35)]"
                  : "bg-white border border-black/[0.07] shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
              }`}
            >
              {badge && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#233DFF] bg-white/20 border border-white/30 rounded-full px-3 py-1 mb-5">
                  <Zap size={11} strokeWidth={2.5} />
                  {badge}
                </span>
              )}

              <div className={`text-[12px] font-semibold tracking-[0.04em] uppercase mb-3 ${highlight ? "text-white/60" : "text-[#86868B]"}`}>
                {name}
              </div>

              <div className={`font-serif text-[36px] font-bold leading-none tracking-[-0.03em] mb-3 flex items-baseline gap-1 ${highlight ? "text-white" : "text-[#1D1D1F]"}`}>
                {price}
                <span className={`font-sans text-[14px] font-normal ${highlight ? "text-white/70" : "text-[#86868B]"}`}>
                  {period}
                </span>
              </div>

              <p className={`text-[13.5px] leading-[1.6] tracking-[-0.01em] mb-6 ${highlight ? "text-white/70" : "text-[#6E6E73]"}`}>
                {desc}
              </p>

              <div className={`h-px mb-6 ${highlight ? "bg-white/15" : "bg-black/[0.07]"}`} />

              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-[13.5px] tracking-[-0.01em] leading-snug ${highlight ? "text-white/85" : "text-[#4A4A4A]"}`}>
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      className={`mt-0.5 flex-shrink-0 ${highlight ? "text-white/80" : "text-[#34C759]"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/cadastro"
                className={`block w-full text-center py-3 rounded-xl text-[14px] font-semibold tracking-[-0.01em] transition-all duration-150 ${
                  highlight
                    ? "bg-white text-[#233DFF] hover:bg-white/95 hover:shadow-lg hover:-translate-y-px"
                    : "bg-[#233DFF] text-white hover:bg-[#1A2ECC] shadow-brand hover:shadow-brand-hover hover:-translate-y-px"
                }`}
              >
                {name === "Enterprise" ? "Falar com vendas" : "Começar grátis"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────── */
function Footer() {
  const FOOTER_LINKS = {
    Produto: ["Features", "Planos", "Integrações", "API", "Segurança"],
    Empresa: ["Sobre nós", "Carreiras", "Blog", "Imprensa", "Parceiros"],
    Suporte: ["Central de Ajuda", "FAQ", "Contato", "Status", "Comunidade"],
  };

  return (
    <footer className="bg-white border-t border-black/[0.07] pt-16 pb-8 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/KnowFlow-Logo.png" alt="KnowFlow" className="w-7 h-7 object-contain" />
              <span className="text-[15px] font-bold text-[#1D1D1F] tracking-tight">KnowFlow</span>
            </div>
            <p className="text-[14px] text-[#6E6E73] leading-[1.65] mb-5 max-w-[280px]">
              Transforme o jeito como sua empresa acessa o próprio conhecimento.
            </p>
            <div className="flex gap-3">
              {["LI", "TW", "IG"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-[#F5F5F7] border border-black/[0.07] flex items-center justify-center text-[11px] font-bold text-[#6E6E73] hover:bg-[#233DFF] hover:text-white hover:border-transparent transition-all duration-150"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-[13px] font-semibold text-[#1D1D1F] mb-4 tracking-[-0.01em]">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-[13.5px] text-[#6E6E73] hover:text-[#233DFF] transition-colors duration-150 tracking-[-0.01em]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-black/[0.07] pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-semibold text-[#1D1D1F] mb-1 tracking-[-0.01em]">
                Newsletter
              </p>
              <p className="text-[13px] text-[#6E6E73]">
                Novidades sobre gestão de conhecimento. Sem spam.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2 w-full sm:w-auto"
            >
              <input
                type="email"
                placeholder="seu@email.com"
                className="flex-1 sm:w-52 text-[13.5px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-lg px-3.5 py-2.5 outline-none focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all"
              />
              <button
                type="submit"
                className="text-[13.5px] font-semibold text-white bg-[#233DFF] hover:bg-[#1A2ECC] px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#AEAEB2]">
          <p>© 2025 KnowFlow. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            {["Privacidade", "Termos", "Cookies"].map((l) => (
              <a key={l} href="#" className="hover:text-[#6E6E73] transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ───────────────────────────────────── */
export default function Landing() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="bg-[#FAFAFA] overflow-x-hidden font-sans">
      {/* Progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#233DFF] to-[#6C63FF] origin-left z-[9999]"
      />

      <Header />
      <Hero />
      <Features />
      <Plans />
      <Footer />
    </div>
  );
}
