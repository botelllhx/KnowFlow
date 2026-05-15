import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import api from "../../../services/api";

const BENEFITS = [
  "30 dias grátis, sem cartão de crédito",
  "Fluxos ilimitados desde o primeiro dia",
  "Colaboração com toda a equipe inclusa",
  "Cancele a qualquer momento, sem burocracia",
];

export default function Register() {
  const [nome, setNome]           = useState("");
  const [email, setEmail]         = useState("");
  const [senha, setSenha]         = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/usuario/cadastro", { nome, email, senha });
      toast.success(data.mensagem || "Conta criada com sucesso!");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── LEFT: brand panel ── */}
      <motion.div
        className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0A0E2A 0%, #1a1f5e 50%, #233DFF 100%)" }}
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(108,99,255,0.15)] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(35,61,255,0.10)] rounded-full blur-[80px] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <img src="/KnowFlow-Logo.png" alt="KnowFlow" className="w-8 h-8 object-contain brightness-[2]" />
          <span className="text-[16px] font-bold text-white tracking-tight">KnowFlow</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/50 mb-4">
              Comece grátis hoje
            </p>
            <h2 className="font-serif text-[38px] font-bold text-white leading-[1.12] tracking-[-0.03em]">
              Transforme o<br />
              conhecimento da<br />
              <em className="font-normal italic text-[rgba(108,140,255,1)]">sua organização</em>
            </h2>
          </div>

          <ul className="space-y-3.5">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
                  <Check size={11} strokeWidth={2.5} className="text-white" />
                </div>
                <span className="text-[14px] text-white/70 tracking-[-0.01em]">{benefit}</span>
              </li>
            ))}
          </ul>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {[
              { value: "500+", label: "Empresas" },
              { value: "10k+", label: "Fluxos criados" },
              { value: "98%", label: "Satisfação" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-[24px] font-bold text-white tracking-[-0.03em]">{value}</div>
                <div className="text-[11px] text-white/45 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 text-[12px] text-white/30">
          © 2025 KnowFlow
        </div>
      </motion.div>

      {/* ── RIGHT: form panel ── */}
      <motion.div
        className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
      >
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
          <img src="/KnowFlow-Logo.png" alt="KnowFlow" className="w-7 h-7 object-contain" />
          <span className="text-[15px] font-bold text-[#1D1D1F] tracking-tight">KnowFlow</span>
        </Link>

        <div className="w-full max-w-[380px]">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-serif text-[28px] font-bold text-[#1D1D1F] tracking-[-0.03em] leading-tight mb-2">
              Criar conta grátis
            </h1>
            <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
              Já tem conta?{" "}
              <Link to="/login" className="text-[#233DFF] font-medium hover:underline">
                Fazer login
              </Link>
            </p>
          </div>

          {/* Google signup */}
          <button
            type="button"
            onClick={() => toast.info("Cadastro com Google em breve.")}
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border border-black/[0.10] rounded-xl text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-black/[0.15] transition-all duration-150 mb-5"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-[12px] text-[#AEAEB2]">ou preencha abaixo</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5 tracking-[-0.01em]">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
                className="w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5 tracking-[-0.01em]">
                E-mail corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@empresa.com"
                autoComplete="email"
                className="w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5 tracking-[-0.01em]">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 pr-11 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#AEAEB2] hover:text-[#6E6E73] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#233DFF] hover:bg-[#1A2ECC] disabled:bg-[#AEAEB2] text-white text-[14px] font-semibold rounded-xl shadow-brand hover:shadow-brand-hover transition-all duration-150 hover:-translate-y-px active:translate-y-0 mt-2 tracking-[-0.01em]"
            >
              {loading ? "Criando conta…" : "Criar conta grátis"}
              {!loading && <ArrowRight size={15} strokeWidth={2.5} />}
            </button>
          </form>

          <p className="mt-6 text-center text-[12px] text-[#AEAEB2] leading-[1.6]">
            Ao criar conta, você concorda com os{" "}
            <a href="#" className="underline hover:text-[#6E6E73]">Termos de Uso</a>{" "}
            e{" "}
            <a href="#" className="underline hover:text-[#6E6E73]">Política de Privacidade</a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}
