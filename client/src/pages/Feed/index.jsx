import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flame, Clock, GitFork, LayoutGrid, Users, MessageSquare } from "lucide-react";

import SearchBar from "../../components/SearchBar";
import Categories from "../../components/FilterOptions/Categories";
import FlowCard from "../../components/FlowCard";
import DiscussaoCard from "../../components/DiscussaoCard";
import FlowsNotFound from "../../components/SystemResponses/FlowsNotFound";
import TrendingBoard from "../../components/TrendingBoard";
import StatisticsBoard from "../../components/StatisticsBoard";
import { useFlowStore } from "../../store/flowStore";
import api from "../../services/api";

import {
  PageContainer,
  PageHeader,
  HeaderTop,
  HeaderTitle,
  PageTitle,
  PageSubtitle,
  HeaderActions,
  CreateButton,
  SearchArea,
  PageMain,
  FeedColumn,
  SidebarColumn,
  SectionTabs,
  SectionTab,
  FlowList,
  SectionLabel,
  SectionCount,
  SkeletonCard,
  SkeletonLine,
  PeriodFilter,
  PeriodChip,
  LoadMoreButton,
} from "./style";

const PAGE_SIZE = 5;

const SECTIONS = [
  { id: "todos",      label: "Todos",      icon: LayoutGrid },
  { id: "alta",       label: "Em Alta",    icon: Flame },
  { id: "recentes",   label: "Recentes",   icon: Clock },
  { id: "equipe",     label: "Equipe",     icon: Users },
  { id: "forks",      label: "Forks",      icon: GitFork },
  { id: "discussoes", label: "Discussões", icon: MessageSquare },
];

const PERIODS = [
  { id: "todos",  label: "Sempre" },
  { id: "30dias", label: "30 dias" },
  { id: "7dias",  label: "7 dias" },
  { id: "hoje",   label: "Hoje" },
];

const engagementScore = (flow) =>
  (flow.stats?.likes || 0) * 0.5 +
  (flow.stats?.comments || 0) * 1 +
  (flow.stats?.saves || 0) * 1.5 +
  (flow.visualizacoes || 0) * 0.1;

const getPeriodCutoff = (period) => {
  const ms = { hoje: 864e5, "7dias": 6048e5, "30dias": 2592e6 };
  return ms[period] ? new Date(Date.now() - ms[period]) : null;
};

export default function Feed() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("todos");
  const [period, setPeriod] = useState("todos");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtros, setFiltros] = useState({ categorias: [] });
  const [discussoes, setDiscussoes] = useState([]);

  const flows      = useFlowStore((state) => state.flows);
  const loading    = useFlowStore((state) => state.loading);
  const category   = useFlowStore((state) => state.category);
  const searchTerm = useFlowStore((state) => state.searchTerm);
  const fetchFlows = useFlowStore((state) => state.fetchFlows);

  useEffect(() => {
    fetchFlows({ category, searchTerm });
  }, [category, searchTerm]);

  useEffect(() => {
    api.get("/filtros").then((res) => setFiltros(res.data)).catch(() => {});
    api
      .get("/postagemcomunidade")
      .then((res) => {
        const semResposta = (res.data || []).filter(
          (p) => (p.comentarios?.length || 0) === 0
        );
        setDiscussoes(semResposta);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeSection, period]);

  const userId = localStorage.getItem("usuarioId");

  const periodFiltered = useMemo(() => {
    const cutoff = getPeriodCutoff(period);
    if (!cutoff) return flows;
    return flows.filter((f) => new Date(f.criado_em) >= cutoff);
  }, [flows, period]);

  const sectionFlows = useMemo(() => {
    if (activeSection === "discussoes") return [];
    switch (activeSection) {
      case "alta":
        return [...periodFiltered].sort(
          (a, b) => engagementScore(b) - engagementScore(a)
        );
      case "recentes":
        return [...periodFiltered].sort(
          (a, b) => new Date(b.criado_em) - new Date(a.criado_em)
        );
      case "equipe":
        return [...periodFiltered]
          .filter((f) => f.criado_por !== userId)
          .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
      case "forks":
        return periodFiltered.filter((f) => !!f.fork_de);
      default:
        return periodFiltered;
    }
  }, [periodFiltered, activeSection, userId]);

  const sectionCounts = useMemo(
    () => ({
      todos:      periodFiltered.length,
      alta:       periodFiltered.length,
      recentes:   periodFiltered.length,
      equipe:     periodFiltered.filter((f) => f.criado_por !== userId).length,
      forks:      periodFiltered.filter((f) => !!f.fork_de).length,
      discussoes: discussoes.length,
    }),
    [periodFiltered, discussoes, userId]
  );

  const isDiscussoes = activeSection === "discussoes";
  const allItems = isDiscussoes ? discussoes : sectionFlows;
  const displayItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  return (
    <PageContainer>
      <PageHeader>
        <HeaderTop>
          <HeaderTitle>
            <PageTitle>Flow Network</PageTitle>
            <PageSubtitle>
              Conhecimento operacional vivo — explore, reutilize e contribua
            </PageSubtitle>
          </HeaderTitle>
          <HeaderActions>
            <CreateButton onClick={() => navigate("/criar-flow")}>
              <Plus size={15} strokeWidth={2.5} />
              Criar Flow
            </CreateButton>
          </HeaderActions>
        </HeaderTop>

        <SearchArea>
          <SearchBar />
          <Categories filtros={filtros.categorias} />
          {!isDiscussoes && (
            <PeriodFilter>
              {PERIODS.map(({ id, label }) => (
                <PeriodChip
                  key={id}
                  $active={period === id}
                  onClick={() => setPeriod(id)}
                >
                  {label}
                </PeriodChip>
              ))}
            </PeriodFilter>
          )}
        </SearchArea>
      </PageHeader>

      <PageMain>
        <FeedColumn>
          <SectionTabs>
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <SectionTab
                key={id}
                $active={activeSection === id}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={14} />
                {label}
                {sectionCounts[id] > 0 && (
                  <SectionCount $active={activeSection === id}>
                    {sectionCounts[id]}
                  </SectionCount>
                )}
              </SectionTab>
            ))}
          </SectionTabs>

          <SectionLabel>
            {SECTIONS.find((s) => s.id === activeSection)?.label}
            {activeSection === "discussoes"
              ? " — dúvidas operacionais sem resposta"
              : activeSection === "equipe"
              ? " — o que seu time está criando"
              : activeSection === "forks" && sectionFlows.length === 0 && !loading
              ? " — nenhum flow derivado ainda"
              : ""}
          </SectionLabel>

          <FlowList>
            {loading && !isDiscussoes ? (
              Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonLine $w="40%" $h="12px" />
                  <SkeletonLine $w="70%" $h="18px" />
                  <SkeletonLine $w="90%" $h="13px" />
                  <SkeletonLine $w="55%" $h="13px" />
                </SkeletonCard>
              ))
            ) : displayItems.length > 0 ? (
              <>
                {isDiscussoes
                  ? displayItems.map((post) => (
                      <DiscussaoCard post={post} key={post.id} />
                    ))
                  : displayItems.map((flow) => (
                      <FlowCard flow={flow} key={flow.id} />
                    ))}
                {hasMore && (
                  <LoadMoreButton
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    Carregar mais
                  </LoadMoreButton>
                )}
              </>
            ) : (
              <FlowsNotFound />
            )}
          </FlowList>
        </FeedColumn>

        <SidebarColumn>
          <TrendingBoard />
          <StatisticsBoard />
        </SidebarColumn>
      </PageMain>
    </PageContainer>
  );
}
