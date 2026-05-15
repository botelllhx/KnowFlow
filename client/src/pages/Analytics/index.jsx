import React, { useState, useEffect, useMemo } from "react";
import { BarChart2, Eye, GitBranch, Play, TrendingUp } from "lucide-react";
import api from "../../services/api";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flowAnalytics, setFlowAnalytics] = useState(null);

  useEffect(() => {
    api
      .get("/analytics/usuario")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSelectFlow = async (flow) => {
    if (selectedFlow?.id === flow.id) {
      setSelectedFlow(null);
      setFlowAnalytics(null);
      return;
    }
    setSelectedFlow(flow);
    try {
      const { data } = await api.get(`/analytics/flow/${flow.id}`);
      setFlowAnalytics(data);
    } catch (_) {}
  };

  const maxViews = useMemo(() => {
    if (!stats?.top_flows?.length) return 1;
    return Math.max(...stats.top_flows.map((f) => f.visualizacoes || 0), 1);
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[14px] text-[#AEAEB2]">Carregando analytics...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em] flex items-center gap-2.5">
          <BarChart2 size={24} className="text-brand" />
          Analytics
        </h1>
        <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
          Métricas dos seus flows e conhecimento compartilhado
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          { icon: Eye,       value: stats?.total_visualizacoes ?? 0, label: "Visualizações totais" },
          { icon: TrendingUp, value: stats?.total_flows ?? 0,         label: "Flows criados" },
          { icon: GitBranch,  value: stats?.forks_recebidos ?? 0,     label: "Forks recebidos" },
          { icon: Play,       value: stats?.execucoes_concluidas ?? 0, label: "Execuções concluídas" },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-2 shadow-card">
            <span className="font-serif text-[28px] font-bold text-[#1D1D1F] tracking-[-0.02em] leading-none">
              {value}
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] text-[#6E6E73]">
              <Icon size={12} />
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Flows section */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 shadow-card">
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
          <TrendingUp size={16} className="text-brand" />
          Seus Flows
        </h2>

        {!stats?.top_flows?.length ? (
          <p className="text-[13px] text-[#AEAEB2] py-6 text-center">Nenhum flow criado ainda.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {stats.top_flows.map((flow) => (
              <React.Fragment key={flow.id}>
                <div
                  onClick={() => handleSelectFlow(flow)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-[#F5F5F7] cursor-pointer transition-colors"
                >
                  <span className="text-[13px] font-medium text-[#1D1D1F] flex-shrink-0 w-[180px] truncate">
                    {flow.titulo}
                  </span>
                  <div className="flex-1 h-1.5 bg-[#F5F5F7] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${Math.round((flow.visualizacoes / maxViews) * 100)}%` }}
                    />
                  </div>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6E6E73] flex-shrink-0 w-[70px]">
                    <Eye size={11} />
                    {flow.visualizacoes}
                  </span>
                  <span
                    className={`text-[12px] font-medium flex-shrink-0 ${
                      selectedFlow?.id === flow.id ? "text-brand" : "text-[#AEAEB2]"
                    }`}
                  >
                    {selectedFlow?.id === flow.id ? "▲ fechar" : "▼ detalhes"}
                  </span>
                </div>

                {selectedFlow?.id === flow.id && flowAnalytics && (
                  <div className="mx-4 mb-2 p-4 bg-brand-light border border-brand/[0.15] rounded-xl flex flex-col gap-3">
                    <p className="text-[12px] text-[#6E6E73]">
                      {flowAnalytics.total_views} cliques registrados nos nós
                    </p>
                    {flowAnalytics.node_views?.length ? (
                      <div className="flex flex-col gap-2">
                        {flowAnalytics.node_views.slice(0, 8).map((nv) => (
                          <div key={nv.no_id} className="flex items-center gap-3">
                            <span className="text-[12px] text-[#6E6E73] w-[120px] truncate flex-shrink-0">
                              Nó {nv.no_id?.slice(0, 8)}...
                            </span>
                            <div className="flex-1 h-1.5 bg-white/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full"
                                style={{
                                  width: `${Math.round((nv.count / (flowAnalytics.node_views[0]?.count || 1)) * 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-[12px] font-semibold text-brand flex-shrink-0 w-8 text-right">
                              {nv.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#AEAEB2]">Nenhum clique registrado ainda.</p>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
