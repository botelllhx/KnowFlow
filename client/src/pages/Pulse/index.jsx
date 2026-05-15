import { useEffect, useState } from "react";
import { TrendingUp, GitFork, AlertTriangle, BarChart3, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const daysSince = (date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

const formatAge = (days) => {
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}m`;
  return `${Math.floor(days / 365)}a`;
};

const BAR_COLORS = [
  "bg-brand",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-400",
  "bg-rose-400",
];

function PulseCard({ icon: Icon, title, iconVariant, children }) {
  const iconCls = {
    default: "bg-brand-light text-brand",
    warning: "bg-amber-50 text-amber-500",
    danger:  "bg-rose-50 text-rose-500",
  }[iconVariant || "default"];

  return (
    <div className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-4 shadow-card">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconCls}`}>
          <Icon size={15} />
        </div>
        <h3 className="text-[14px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ children }) {
  return <p className="text-[13px] text-[#AEAEB2] py-4 text-center">{children}</p>;
}

export default function Pulse() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/pulse")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Erro ao carregar dados do Pulse"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col p-7 gap-5 min-h-screen">
        <div className="flex flex-col gap-1">
          <div className="w-24 h-7 rounded-md bg-[#F5F5F7] animate-pulse" />
          <div className="w-64 h-4 rounded-md bg-[#F5F5F7] animate-pulse mt-1" />
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 shadow-card">
              <div className="w-24 h-3 rounded-md bg-[#F5F5F7] animate-pulse" />
              <div className="w-20 h-8 rounded-md bg-[#F5F5F7] animate-pulse" />
              <div className="w-32 h-3 rounded-md bg-[#F5F5F7] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 shadow-card min-h-[240px]">
              <div className="w-32 h-4 rounded-md bg-[#F5F5F7] animate-pulse" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="w-full h-3 rounded-md bg-[#F5F5F7] animate-pulse" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { crescimento, flows_em_alta, categorias_ativas, gargalos, flows_em_risco, reutilizacao } = data;

  const maxViews = Math.max(...flows_em_alta.map((f) => f.visualizacoes), 1);
  const maxCat   = Math.max(...categorias_ativas.map((c) => Number(c.total)), 1);

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em]">Pulse</h1>
        <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
          Radar operacional — o comportamento vivo da organização
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {[
          { label: "Flows Publicados", value: crescimento.total_publicados, delta: `${crescimento.ultimos_7_dias} novos nos últimos 7 dias`, positive: crescimento.ultimos_7_dias > 0 },
          { label: "Novos (30 dias)", value: crescimento.ultimos_30_dias, delta: `${crescimento.ultimos_7_dias} na última semana`, positive: crescimento.ultimos_7_dias > 0 },
          { label: "Taxa de Reutilização", value: `${crescimento.taxa_reutilizacao}%`, delta: `${reutilizacao.total_forks} forks no total`, positive: reutilizacao.total_forks > 0 },
        ].map(({ label, value, delta, positive }) => (
          <div key={label} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-1.5 shadow-card">
            <span className="text-[11px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase">{label}</span>
            <span className="font-serif text-[32px] font-bold text-[#1D1D1F] tracking-[-0.02em] leading-none">
              {value}
            </span>
            <span className={`text-[11.5px] font-medium ${positive ? "text-emerald-600" : "text-[#AEAEB2]"}`}>
              {delta}
            </span>
          </div>
        ))}
      </div>

      {/* Row 1: Flows em Alta + Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-5">
        <PulseCard icon={TrendingUp} title="Flows em Alta">
          {flows_em_alta.length === 0 ? (
            <EmptyState>Nenhum flow publicado ainda</EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {flows_em_alta.map((flow, i) => (
                <div key={flow.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#F5F5F7] text-[#AEAEB2] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-[#1D1D1F] truncate">{flow.titulo}</span>
                      {flow.categoria && <span className="text-[11px] text-[#AEAEB2]">{flow.categoria}</span>}
                    </div>
                    <span className="text-[12px] text-[#6E6E73] flex-shrink-0">
                      {(flow.visualizacoes || 0).toLocaleString("pt-BR")} views
                    </span>
                  </div>
                  <div className="h-1 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.round((flow.visualizacoes / maxViews) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </PulseCard>

        <PulseCard icon={BarChart3} title="Categorias Ativas">
          {categorias_ativas.length === 0 ? (
            <EmptyState>Nenhuma categoria ativa</EmptyState>
          ) : (
            <div className="flex flex-col gap-3">
              {categorias_ativas.map((cat, i) => (
                <div key={cat.categoria} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#1D1D1F]">{cat.categoria}</span>
                    <span className="text-[12px] text-[#6E6E73] font-semibold">{cat.total}</span>
                  </div>
                  <div className="h-1 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                      style={{ width: `${Math.round((Number(cat.total) / maxCat) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </PulseCard>
      </div>

      {/* Row 2: Gargalos + Flows em Risco */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PulseCard icon={MessageCircle} title="Possíveis Gargalos" iconVariant="warning">
          {gargalos.length === 0 ? (
            <EmptyState>Nenhum gargalo identificado</EmptyState>
          ) : (
            <div className="flex flex-col gap-2">
              {gargalos.map((flow, i) => (
                <div key={flow.id} className="flex items-center gap-2 py-2 border-b border-black/[0.05] last:border-0">
                  <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[13px] font-medium text-[#1D1D1F] truncate">{flow.titulo}</span>
                    {flow.categoria && <span className="text-[11px] text-[#AEAEB2]">{flow.categoria}</span>}
                  </div>
                  <span className="text-[12px] text-amber-500 font-semibold flex-shrink-0">
                    {flow.total_comentarios} {flow.total_comentarios === 1 ? "comentário" : "comentários"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PulseCard>

        <PulseCard icon={AlertTriangle} title="Flows em Risco" iconVariant="danger">
          {flows_em_risco.length === 0 ? (
            <EmptyState>Todos os flows estão atualizados</EmptyState>
          ) : (
            <div className="flex flex-col gap-2">
              {flows_em_risco.map((flow) => {
                const dias = daysSince(flow.criado_em);
                const isOld = dias > 180;
                return (
                  <div key={flow.id} className="flex items-center gap-2 py-2 border-b border-black/[0.05] last:border-0">
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[13px] font-medium text-[#1D1D1F] truncate">{flow.titulo}</span>
                      {flow.categoria && <span className="text-[11px] text-[#AEAEB2]">{flow.categoria}</span>}
                    </div>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md flex-shrink-0 ${
                        isOld ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"
                      }`}
                    >
                      {formatAge(dias)} sem atualização
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </PulseCard>
      </div>

      {/* Row 3: Forks */}
      <PulseCard icon={GitFork} title="Conhecimento Sendo Derivado">
        {reutilizacao.mais_derivados.length === 0 ? (
          <EmptyState>Nenhum flow foi derivado ainda</EmptyState>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reutilizacao.mais_derivados.map((flow) => (
              <div key={flow.id} className="flex items-center justify-between gap-2 p-3 bg-[#F5F5F7] rounded-xl">
                <span className="text-[13px] font-medium text-[#1D1D1F] truncate flex-1 min-w-0">
                  {flow.titulo}
                </span>
                <span className="inline-flex items-center gap-1 text-[11.5px] text-brand font-semibold flex-shrink-0">
                  <GitFork size={12} />
                  {flow.total_forks}
                </span>
              </div>
            ))}
          </div>
        )}
      </PulseCard>
    </div>
  );
}
