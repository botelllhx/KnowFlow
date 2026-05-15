import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, BookOpen, Users, GitBranch } from "lucide-react";
import api from "../../../services/api";

const FEATURES = [
  { icon: BookOpen, text: "Fluxos de conhecimento navegáveis e vivos" },
  { icon: Users,    text: "Colaboração em tempo real entre times" },
  { icon: GitBranch, text: "Feed corporativo inteligente e segmentado" },
];

export default function Login() {
  const [email, setEmail]         = useState("");
  const [senha, setSenha]         = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);

  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/feed";

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    try {
      const { data: loginData } = await api.post("/usuario/login", { email, senha });
      localStorage.setItem("token", loginData.token);
      const { data: userData } = await api.get("/usuario/me");
      if (userData.id) localStorage.setItem("usuarioId", userData.id);
      toast.success("Login realizado!");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.mensagem ||
        err.response?.data?.erro ||
        "Credenciais inválidas. Tente novamente."
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
              Plataforma de conhecimento
            </p>
            <h2 className="font-serif text-[38px] font-bold text-white leading-[1.12] tracking-[-0.03em]">
              O conhecimento<br />
              da sua empresa,<br />
              <em className="font-normal italic text-[rgba(108,140,255,1)]">finalmente acessível</em>
            </h2>
          </div>

          <ul className="space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} strokeWidth={1.8} className="text-white/80" />
                </div>
                <span className="text-[14px] text-white/70 tracking-[-0.01em]">{text}</span>
              </li>
            ))}
          </ul>

          <blockquote className="border-l-2 border-white/20 pl-4">
            <p className="text-[14px] text-white/55 leading-[1.65] italic">
              "O KnowFlow reduziu nosso tempo de onboarding em 60% e eliminou a
              dependência de pessoas-chave para transferência de conhecimento."
            </p>
            <footer className="mt-3 text-[12px] text-white/35 font-medium">
              — Head de Operações, startup de logística
            </footer>
          </blockquote>
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
              Bem-vindo de volta
            </h1>
            <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
              Não tem conta?{" "}
              <Link to="/cadastro" className="text-[#233DFF] font-medium hover:underline">
                Criar conta grátis
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#1D1D1F] mb-1.5 tracking-[-0.01em]">
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
                  Senha
                </label>
                <Link
                  to="/recuperar-senha"
                  className="text-[12px] text-[#233DFF] hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {loading ? "Entrando…" : "Entrar"}
              {!loading && <ArrowRight size={15} strokeWidth={2.5} />}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-[12px] text-[#AEAEB2]">ou continue com</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => toast.info("Login com Google em breve.")}
            className="w-full flex items-center justify-center gap-2.5 py-3 bg-white border border-black/[0.10] rounded-xl text-[14px] font-medium text-[#1D1D1F] hover:bg-[#F5F5F7] hover:border-black/[0.15] transition-all duration-150"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            Entrar com Google
          </button>

          <p className="mt-8 text-center text-[12px] text-[#AEAEB2] leading-[1.6]">
            Ao continuar, você concorda com os{" "}
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
