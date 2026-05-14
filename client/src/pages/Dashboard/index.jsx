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

import {
  PageContainer,
  GreetingCard,
  GreetingLeft,
  Avatar,
  GreetingText,
  GreetingTitle,
  GreetingMeta,
  GreetingSince,
  CreateButton,
  StatsGrid,
  StatCard,
  StatIconWrap,
  StatValue,
  StatLabel,
  MainGrid,
  SectionCard,
  SectionHeader,
  SectionTitle,
  SectionLink,
  FlowList,
  FlowItem,
  FlowItemInfo,
  FlowItemTitle,
  FlowItemMeta,
  StatusDot,
  FlowActions,
  ActionBtn,
  ActivityList,
  ActivityItem,
  ActivityIcon,
  ActivityBody,
  ActivityText,
  ActivityFlow,
  ActivityTime,
  EmptyState,
  EmptyText,
  EmptyAction,
  SkeletonCard,
  SkeletonLine,
} from "./style";

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
  return new Date(date).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
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

const STATUS_LABELS = {
  publicado: "Publicado",
  rascunho: "Rascunho",
  arquivado: "Arquivado",
};

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
      <PageContainer>
        <SkeletonCard>
          <SkeletonLine $w="40%" $h="20px" />
          <SkeletonLine $w="25%" $h="13px" />
        </SkeletonCard>
        <StatsGrid>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonLine $w="32px" $h="32px" />
              <SkeletonLine $w="50%" $h="28px" />
              <SkeletonLine $w="70%" $h="12px" />
            </SkeletonCard>
          ))}
        </StatsGrid>
        <MainGrid>
          <SkeletonCard $h="320px">
            <SkeletonLine $w="45%" $h="14px" />
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLine key={i} $w="100%" $h="13px" />
            ))}
          </SkeletonCard>
          <SkeletonCard $h="320px">
            <SkeletonLine $w="55%" $h="14px" />
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonLine key={i} $w="100%" $h="12px" />
            ))}
          </SkeletonCard>
        </MainGrid>
      </PageContainer>
    );
  }

  if (!data) return null;

  const { usuario, stats, flows_recentes, atividade_recente } = data;

  return (
    <PageContainer>
      {/* SAUDAÇÃO */}
      <GreetingCard>
        <GreetingLeft>
          <Avatar>{getIniciais(usuario.nome)}</Avatar>
          <GreetingText>
            <GreetingTitle>
              {getGreeting()}, {usuario.nome?.split(" ")[0]}
            </GreetingTitle>
            {(usuario.cargo || usuario.empresa) && (
              <GreetingMeta>
                {[usuario.cargo, usuario.empresa].filter(Boolean).join(" · ")}
              </GreetingMeta>
            )}
            {usuario.criado_em && (
              <GreetingSince>
                Membro desde {memberSince(usuario.criado_em)}
              </GreetingSince>
            )}
          </GreetingText>
        </GreetingLeft>
        <CreateButton onClick={() => navigate("/criar-flow")}>
          <Plus size={14} strokeWidth={2.5} />
          Criar Flow
        </CreateButton>
      </GreetingCard>

      {/* STATS */}
      <StatsGrid>
        <StatCard>
          <StatIconWrap $color="primary">
            <GitBranch size={16} />
          </StatIconWrap>
          <StatValue>{stats.flows_criados}</StatValue>
          <StatLabel>Flows criados</StatLabel>
        </StatCard>
        <StatCard>
          <StatIconWrap $color="secondary">
            <Eye size={16} />
          </StatIconWrap>
          <StatValue>{stats.visualizacoes_totais.toLocaleString("pt-BR")}</StatValue>
          <StatLabel>Visualizações totais</StatLabel>
        </StatCard>
        <StatCard>
          <StatIconWrap $color="success">
            <Heart size={16} />
          </StatIconWrap>
          <StatValue>{stats.curtidas_recebidas}</StatValue>
          <StatLabel>Curtidas recebidas</StatLabel>
        </StatCard>
        <StatCard>
          <StatIconWrap $color="warning">
            <GitFork size={16} />
          </StatIconWrap>
          <StatValue>{stats.forks_recebidos}</StatValue>
          <StatLabel>Forks recebidos</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* MAIN GRID */}
      <MainGrid>
        {/* FLOWS RECENTES */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Meus Flows Recentes</SectionTitle>
            {stats.flows_criados > 5 && (
              <SectionLink onClick={() => navigate("/perfil")}>
                Ver todos
              </SectionLink>
            )}
          </SectionHeader>

          {flows_recentes.length === 0 ? (
            <EmptyState>
              <EmptyText>Você ainda não criou nenhum flow</EmptyText>
              <EmptyAction onClick={() => navigate("/criar-flow")}>
                Criar meu primeiro flow →
              </EmptyAction>
            </EmptyState>
          ) : (
            <FlowList>
              {flows_recentes.map((flow) => (
                <FlowItem key={flow.id}>
                  <StatusDot $status={flow.status} title={STATUS_LABELS[flow.status]} />
                  <FlowItemInfo>
                    <FlowItemTitle>{flow.titulo}</FlowItemTitle>
                    <FlowItemMeta>
                      {[flow.categoria, timeAgo(flow.criado_em)]
                        .filter(Boolean)
                        .join(" · ")}
                    </FlowItemMeta>
                  </FlowItemInfo>
                  <FlowActions>
                    <ActionBtn onClick={() => navigate(`/editar-flow/${flow.id}`)}>
                      <Pencil size={11} style={{ marginRight: 3 }} />
                      Editar
                    </ActionBtn>
                    <ActionBtn onClick={() => navigate(`/flow/${flow.id}`)}>
                      <Eye size={11} style={{ marginRight: 3 }} />
                      Ver
                    </ActionBtn>
                  </FlowActions>
                </FlowItem>
              ))}
            </FlowList>
          )}
        </SectionCard>

        {/* ATIVIDADE RECENTE */}
        <SectionCard>
          <SectionHeader>
            <SectionTitle>Atividade Recente</SectionTitle>
          </SectionHeader>

          {atividade_recente.length === 0 ? (
            <EmptyState>
              <EmptyText>
                {stats.flows_criados === 0
                  ? "Crie flows para receber atividade"
                  : "Nenhuma atividade recente"}
              </EmptyText>
            </EmptyState>
          ) : (
            <ActivityList>
              {atividade_recente.map((item, i) => (
                <ActivityItem key={i}>
                  <ActivityIcon $tipo={item.tipo}>
                    {item.tipo === "fork" ? (
                      <GitFork size={14} />
                    ) : (
                      <MessageCircle size={14} />
                    )}
                  </ActivityIcon>
                  <ActivityBody>
                    <ActivityText>
                      <strong>{item.usuario_nome}</strong>{" "}
                      {item.tipo === "fork" ? "derivou" : "comentou em"}{" "}
                      <ActivityFlow
                        onClick={() => navigate(`/flow/${item.flow_id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        {item.flow_titulo}
                      </ActivityFlow>
                      {item.tipo === "comentario" && item.mensagem && (
                        <>
                          {" "}
                          <span
                            style={{ fontWeight: 400, color: "inherit", opacity: 0.7 }}
                          >
                            · "{item.mensagem}"
                          </span>
                        </>
                      )}
                    </ActivityText>
                    <ActivityTime>{timeAgo(item.criado_em)}</ActivityTime>
                  </ActivityBody>
                </ActivityItem>
              ))}
            </ActivityList>
          )}
        </SectionCard>
      </MainGrid>
    </PageContainer>
  );
}
