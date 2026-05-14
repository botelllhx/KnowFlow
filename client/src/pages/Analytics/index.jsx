import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, Eye, GitBranch, Play, TrendingUp } from 'lucide-react';
import api from '../../services/api';
import * as S from './style';

const Analytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [flowAnalytics, setFlowAnalytics] = useState(null);

  useEffect(() => {
    api.get('/analytics/usuario')
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

  if (loading) return <S.Loading>Carregando analytics...</S.Loading>;

  return (
    <S.Container>
      <S.PageHeader>
        <S.PageTitle>
          <BarChart2 size={28} style={{ marginRight: 10, verticalAlign: 'middle' }} />
          Analytics
        </S.PageTitle>
        <S.PageSubtitle>Métricas dos seus flows e conhecimento compartilhado</S.PageSubtitle>
      </S.PageHeader>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatValue>{stats?.total_visualizacoes ?? 0}</S.StatValue>
          <S.StatLabel>
            <Eye size={12} style={{ marginRight: 4 }} />
            Visualizações totais
          </S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{stats?.total_flows ?? 0}</S.StatValue>
          <S.StatLabel>
            <TrendingUp size={12} style={{ marginRight: 4 }} />
            Flows criados
          </S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{stats?.forks_recebidos ?? 0}</S.StatValue>
          <S.StatLabel>
            <GitBranch size={12} style={{ marginRight: 4 }} />
            Forks recebidos
          </S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatValue>{stats?.execucoes_concluidas ?? 0}</S.StatValue>
          <S.StatLabel>
            <Play size={12} style={{ marginRight: 4 }} />
            Execuções concluídas
          </S.StatLabel>
        </S.StatCard>
      </S.StatsGrid>

      <S.Section>
        <S.SectionTitle>
          <TrendingUp size={18} color="#233DFF" />
          Seus Flows
        </S.SectionTitle>
        {!stats?.top_flows?.length ? (
          <S.EmptyState>Nenhum flow criado ainda.</S.EmptyState>
        ) : (
          <S.FlowList>
            {stats.top_flows.map((flow) => (
              <React.Fragment key={flow.id}>
                <S.FlowRow onClick={() => handleSelectFlow(flow)}>
                  <S.FlowTitle>{flow.titulo}</S.FlowTitle>
                  <S.BarWrapper>
                    <S.BarFill $pct={Math.round((flow.visualizacoes / maxViews) * 100)} />
                  </S.BarWrapper>
                  <S.Chip>
                    <Eye size={11} style={{ marginRight: 3 }} />
                    {flow.visualizacoes}
                  </S.Chip>
                  <S.FlowMeta
                    style={{
                      cursor: 'pointer',
                      color: selectedFlow?.id === flow.id ? '#233DFF' : undefined,
                    }}
                  >
                    {selectedFlow?.id === flow.id ? '▲ fechar' : '▼ detalhes'}
                  </S.FlowMeta>
                </S.FlowRow>
                {selectedFlow?.id === flow.id && flowAnalytics && (
                  <div
                    style={{
                      background: 'rgba(35,61,255,0.05)',
                      border: '1px solid rgba(35,61,255,0.15)',
                      borderRadius: 10,
                      padding: '16px 20px',
                      marginTop: -4,
                    }}
                  >
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10 }}>
                      {flowAnalytics.total_views} cliques registrados nos nós
                    </div>
                    {flowAnalytics.node_views?.length ? (
                      <S.NodeViewList>
                        {flowAnalytics.node_views.slice(0, 8).map((nv) => (
                          <S.NodeViewRow key={nv.no_id}>
                            <span
                              style={{
                                minWidth: 140,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Nó {nv.no_id?.slice(0, 8)}...
                            </span>
                            <S.BarWrapper style={{ flex: 1 }}>
                              <S.BarFill
                                $pct={Math.round(
                                  (nv.count / (flowAnalytics.node_views[0]?.count || 1)) * 100
                                )}
                              />
                            </S.BarWrapper>
                            <S.Chip>{nv.count}</S.Chip>
                          </S.NodeViewRow>
                        ))}
                      </S.NodeViewList>
                    ) : (
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                        Nenhum clique registrado ainda.
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </S.FlowList>
        )}
      </S.Section>
    </S.Container>
  );
};

export default Analytics;
