import { useEffect, useState } from "react";
import { TrendingUp, GitFork, AlertTriangle, BarChart3, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

import {
  PageContainer,
  PageHeader,
  HeaderTitle,
  PageTitle,
  PageSubtitle,
  StatsGrid,
  StatCard,
  StatLabel,
  StatValue,
  StatDelta,
  PulseGrid,
  TwoColGrid,
  PulseCard,
  CardHeader,
  CardIcon,
  CardTitle,
  RankList,
  RankItem,
  RankHeader,
  RankNumber,
  RankInfo,
  RankName,
  RankMeta,
  RankValue,
  RankBar,
  RankBarFill,
  CategoryList,
  CategoryItem,
  CategoryHeader,
  CategoryName,
  CategoryCount,
  CategoryBar,
  CategoryBarFill,
  RiskList,
  RiskItem,
  RiskInfo,
  RiskName,
  RiskMeta,
  RiskAge,
  ForkList,
  ForkItem,
  ForkName,
  ForkCount,
  EmptyState,
  SkeletonCard,
  SkeletonLine,
} from "./style";

const daysSince = (date) =>
  Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));

const formatAge = (days) => {
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}m`;
  return `${Math.floor(days / 365)}a`;
};

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
      <PageContainer>
        <PageHeader>
          <HeaderTitle>
            <PageTitle>Pulse</PageTitle>
            <PageSubtitle>Radar operacional da organização</PageSubtitle>
          </HeaderTitle>
        </PageHeader>
        <StatsGrid>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonLine $w="40%" $h="11px" />
              <SkeletonLine $w="50%" $h="32px" />
              <SkeletonLine $w="70%" $h="11px" />
            </SkeletonCard>
          ))}
        </StatsGrid>
        <TwoColGrid $ratio="3fr 2fr">
          <SkeletonCard $tall>
            <SkeletonLine $w="45%" $h="14px" />
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine key={i} $w={`${80 - i * 8}%`} $h="12px" />
            ))}
          </SkeletonCard>
          <SkeletonCard $tall>
            <SkeletonLine $w="55%" $h="14px" />
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLine key={i} $w="100%" $h="11px" />
            ))}
          </SkeletonCard>
        </TwoColGrid>
      </PageContainer>
    );
  }

  if (!data) return null;

  const {
    crescimento,
    flows_em_alta,
    categorias_ativas,
    gargalos,
    flows_em_risco,
    reutilizacao,
  } = data;

  const maxViews = Math.max(...flows_em_alta.map((f) => f.visualizacoes), 1);
  const maxCat = Math.max(...categorias_ativas.map((c) => Number(c.total)), 1);

  return (
    <PageContainer>
      <PageHeader>
        <HeaderTitle>
          <PageTitle>Pulse</PageTitle>
          <PageSubtitle>
            Radar operacional — o comportamento vivo da organização
          </PageSubtitle>
        </HeaderTitle>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatLabel>Flows Publicados</StatLabel>
          <StatValue>{crescimento.total_publicados}</StatValue>
          <StatDelta $positive={crescimento.ultimos_7_dias > 0}>
            {crescimento.ultimos_7_dias} novos nos últimos 7 dias
          </StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Novos (30 dias)</StatLabel>
          <StatValue>{crescimento.ultimos_30_dias}</StatValue>
          <StatDelta $positive={crescimento.ultimos_7_dias > 0}>
            {crescimento.ultimos_7_dias} na última semana
          </StatDelta>
        </StatCard>
        <StatCard>
          <StatLabel>Taxa de Reutilização</StatLabel>
          <StatValue>{crescimento.taxa_reutilizacao}%</StatValue>
          <StatDelta>{reutilizacao.total_forks} forks no total</StatDelta>
        </StatCard>
      </StatsGrid>

      <PulseGrid>
        <TwoColGrid $ratio="3fr 2fr">
          <PulseCard>
            <CardHeader>
              <CardIcon>
                <TrendingUp size={15} />
              </CardIcon>
              <CardTitle>Flows em Alta</CardTitle>
            </CardHeader>
            {flows_em_alta.length === 0 ? (
              <EmptyState>Nenhum flow publicado ainda</EmptyState>
            ) : (
              <RankList>
                {flows_em_alta.map((flow, i) => (
                  <RankItem key={flow.id}>
                    <RankHeader>
                      <RankNumber>{i + 1}</RankNumber>
                      <RankInfo>
                        <RankName>{flow.titulo}</RankName>
                        {flow.categoria && (
                          <RankMeta>{flow.categoria}</RankMeta>
                        )}
                      </RankInfo>
                      <RankValue>
                        {(flow.visualizacoes || 0).toLocaleString("pt-BR")}{" "}
                        views
                      </RankValue>
                    </RankHeader>
                    <RankBar>
                      <RankBarFill
                        $width={Math.round(
                          (flow.visualizacoes / maxViews) * 100
                        )}
                      />
                    </RankBar>
                  </RankItem>
                ))}
              </RankList>
            )}
          </PulseCard>

          <PulseCard>
            <CardHeader>
              <CardIcon>
                <BarChart3 size={15} />
              </CardIcon>
              <CardTitle>Categorias Ativas</CardTitle>
            </CardHeader>
            {categorias_ativas.length === 0 ? (
              <EmptyState>Nenhuma categoria ativa</EmptyState>
            ) : (
              <CategoryList>
                {categorias_ativas.map((cat, i) => (
                  <CategoryItem key={cat.categoria}>
                    <CategoryHeader>
                      <CategoryName>{cat.categoria}</CategoryName>
                      <CategoryCount>{cat.total}</CategoryCount>
                    </CategoryHeader>
                    <CategoryBar>
                      <CategoryBarFill
                        $width={Math.round(
                          (Number(cat.total) / maxCat) * 100
                        )}
                        $index={i}
                      />
                    </CategoryBar>
                  </CategoryItem>
                ))}
              </CategoryList>
            )}
          </PulseCard>
        </TwoColGrid>

        <TwoColGrid>
          <PulseCard>
            <CardHeader>
              <CardIcon $warning>
                <MessageCircle size={15} />
              </CardIcon>
              <CardTitle>Possíveis Gargalos</CardTitle>
            </CardHeader>
            {gargalos.length === 0 ? (
              <EmptyState>Nenhum gargalo identificado</EmptyState>
            ) : (
              <RankList>
                {gargalos.map((flow, i) => (
                  <RankItem key={flow.id}>
                    <RankHeader>
                      <RankNumber>{i + 1}</RankNumber>
                      <RankInfo>
                        <RankName>{flow.titulo}</RankName>
                        {flow.categoria && (
                          <RankMeta>{flow.categoria}</RankMeta>
                        )}
                      </RankInfo>
                      <RankValue $warning>
                        {flow.total_comentarios}{" "}
                        {flow.total_comentarios === 1
                          ? "comentário"
                          : "comentários"}
                      </RankValue>
                    </RankHeader>
                  </RankItem>
                ))}
              </RankList>
            )}
          </PulseCard>

          <PulseCard>
            <CardHeader>
              <CardIcon $danger>
                <AlertTriangle size={15} />
              </CardIcon>
              <CardTitle>Flows em Risco</CardTitle>
            </CardHeader>
            {flows_em_risco.length === 0 ? (
              <EmptyState>Todos os flows estão atualizados</EmptyState>
            ) : (
              <RiskList>
                {flows_em_risco.map((flow) => {
                  const dias = daysSince(flow.criado_em);
                  return (
                    <RiskItem key={flow.id}>
                      <RiskInfo>
                        <RiskName>{flow.titulo}</RiskName>
                        {flow.categoria && (
                          <RiskMeta>{flow.categoria}</RiskMeta>
                        )}
                      </RiskInfo>
                      <RiskAge $days={dias}>
                        {formatAge(dias)} sem atualização
                      </RiskAge>
                    </RiskItem>
                  );
                })}
              </RiskList>
            )}
          </PulseCard>
        </TwoColGrid>

        <PulseCard>
          <CardHeader>
            <CardIcon>
              <GitFork size={15} />
            </CardIcon>
            <CardTitle>Conhecimento Sendo Derivado</CardTitle>
          </CardHeader>
          {reutilizacao.mais_derivados.length === 0 ? (
            <EmptyState>Nenhum flow foi derivado ainda</EmptyState>
          ) : (
            <ForkList>
              {reutilizacao.mais_derivados.map((flow) => (
                <ForkItem key={flow.id}>
                  <ForkName>{flow.titulo}</ForkName>
                  <ForkCount>
                    <GitFork size={12} />
                    {flow.total_forks}{" "}
                    {flow.total_forks === 1 ? "derivação" : "derivações"}
                  </ForkCount>
                </ForkItem>
              ))}
            </ForkList>
          )}
        </PulseCard>
      </PulseGrid>
    </PageContainer>
  );
}
