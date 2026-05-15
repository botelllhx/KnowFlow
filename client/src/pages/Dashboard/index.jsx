import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Heart,
  GitFork,
  GitBranch,
  MessageCircle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Bom dia";
  if (h >= 12 && h < 18) return "Boa tarde";
  return "Boa noite";
};

const getIniciais = (nome) => {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const memberSince = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "Agora mesmo";
  if (diff < 60) return `${diff}min atrás`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Há 1 dia";
  if (d < 7) return `${d} dias atrás`;
  return `${Math.floor(d / 7)}sem atrás`;
};

const STATUS_LABELS = { publicado: "Publicado", rascunho: "Rascunho", arquivado: "Arquivado" };

const STATUS_DOT = {
  publicado: "bg-emerald-500",
  rascunho: "bg-amber-400",
  arquivado: "bg-[#AEAEB2]",
};

const STAT_ICON_COLORS = {
  primary:   "bg-brand-light text-brand",
  secondary: "bg-purple-50 text-purple-600",
  success:   "bg-emerald-50 text-emerald-600",
  warning:   "bg-amber-50 text-amber-500",
};

const ACTIVITY_ICON_COLORS = {
  fork:       "bg-purple-50 text-purple-600",
  comentario: "bg-brand-light text-brand",
};

function SkeletonLine({ w = "100%", h = "14px", radius = "6px" }) {
  return (
    <div
      style={{ width: w, height: h, borderRadius: radius }}
      className="bg-[#F5F5F7] animate-pulse"
    />
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Erro ao carregar o Dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col p-7 gap-5 min-h-screen">
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-3 shadow-card">
          <SkeletonLine w="40%" h="20px" />
          <SkeletonLine w="25%" h="13px" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 shadow-card">
              <SkeletonLine w="32px" h="32px" radius="8px" />
              <SkeletonLine w="50%" h="28px" />
              <SkeletonLine w="70%" h="12px" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-3 shadow-card min-h-[320px]">
              <SkeletonLine w="45%" h="14px" />
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonLine key={j} h="13px" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { usuario, stats, flows_recentes, atividade_recente } = data;

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Greeting card */}
      <div className="flex items-center justify-between gap-4 bg-white border border-black/[0.07] rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-brand-light border border-brand/[0.15] text-brand font-bold text-[16px] flex items-center justify-center">
            {getIniciais(usuario.nome)}
          </div>
          <div className="flex flex-col gap-0.5">
            <h1 className="font-serif text-[22px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
              {getGreeting()}, {usuario.nome?.split(" ")[0]}
            </h1>
            {(usuario.cargo || usuario.empresa) && (
              <p className="text-[13px] text-[#6E6E73] tracking-[-0.01em]">
                {[usuario.cargo, usuario.empresa].filter(Boolean).join(" · ")}
              </p>
            )}
            {usuario.criado_em && (
              <p className="text-[12px] text-[#AEAEB2]">
                Membro desde {memberSince(usuario.criado_em)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate("/criar-flow")}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-[10px] text-[13.5px] font-semibold cursor-pointer tracking-[-0.01em] transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-px active:translate-y-0 flex-shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          Criar Flow
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { icon: GitBranch, value: stats.flows_criados, label: "Flows criados", color: "primary" },
          { icon: Eye, value: stats.visualizacoes_totais.toLocaleString("pt-BR"), label: "Visualizações totais", color: "secondary" },
          { icon: Heart, value: stats.curtidas_recebidas, label: "Curtidas recebidas", color: "success" },
          { icon: GitFork, value: stats.forks_recebidos, label: "Forks recebidos", color: "warning" },
        ].map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-2 shadow-card">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${STAT_ICON_COLORS[color]}`}>
              <Icon size={16} />
            </div>
            <span className="font-serif text-[28px] font-bold text-[#1D1D1F] leading-none tracking-[-0.02em]">
              {value}
            </span>
            <span className="text-[12.5px] text-[#6E6E73] tracking-[-0.01em]">{label}</span>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent flows */}
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
              Meus Flows Recentes
            </h2>
            {stats.flows_criados > 5 && (
              <button
                onClick={() => navigate("/perfil")}
                className="text-[12px] text-brand font-medium hover:underline bg-transparent border-0 cursor-pointer p-0"
              >
                Ver todos
              </button>
            )}
          </div>

          {flows_recentes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-[13px] text-[#AEAEB2]">Você ainda não criou nenhum flow</p>
              <button
                onClick={() => navigate("/criar-flow")}
                className="text-[13px] text-brand font-medium hover:underline bg-transparent border-0 cursor-pointer p-0"
              >
                Criar meu primeiro flow →
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-black/[0.05]">
              {flows_recentes.map((flow) => (
                <div key={flow.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[flow.status] || "bg-[#AEAEB2]"}`}
                    title={STATUS_LABELS[flow.status]}
                  />
                  <div className="flex flex-col flex-1 min-w-0 gap-px">
                    <span className="text-[13px] font-medium text-[#1D1D1F] truncate tracking-[-0.01em]">
                      {flow.titulo}
                    </span>
                    <span className="text-[11.5px] text-[#AEAEB2]">
                      {[flow.categoria, timeAgo(flow.criado_em)].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/editar-flow/${flow.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#EBEBED] border-0 cursor-pointer transition-colors"
                    >
                      <Pencil size={11} />
                      Editar
                    </button>
                    <button
                      onClick={() => navigate(`/flow/${flow.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#EBEBED] border-0 cursor-pointer transition-colors"
                    >
                      <Eye size={11} />
                      Ver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 shadow-card">
          <h2 className="text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
            Atividade Recente
          </h2>

          {atividade_recente.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-[13px] text-[#AEAEB2]">
                {stats.flows_criados === 0
                  ? "Crie flows para receber atividade"
                  : "Nenhuma atividade recente"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {atividade_recente.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      ACTIVITY_ICON_COLORS[item.tipo] || "bg-[#F5F5F7] text-[#6E6E73]"
                    }`}
                  >
                    {item.tipo === "fork" ? (
                      <GitFork size={14} />
                    ) : (
                      <MessageCircle size={14} />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <p className="text-[13px] text-[#1D1D1F] leading-[1.5]">
                      <strong className="font-semibold">{item.usuario_nome}</strong>{" "}
                      {item.tipo === "fork" ? "derivou" : "comentou em"}{" "}
                      <button
                        onClick={() => navigate(`/flow/${item.flow_id}`)}
                        className="text-brand font-medium hover:underline bg-transparent border-0 cursor-pointer p-0 text-[13px]"
                      >
                        {item.flow_titulo}
                      </button>
                      {item.tipo === "comentario" && item.mensagem && (
                        <span className="text-[#6E6E73] font-normal"> · "{item.mensagem}"</span>
                      )}
                    </p>
                    <span className="text-[11.5px] text-[#AEAEB2]">
                      {timeAgo(item.criado_em)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
