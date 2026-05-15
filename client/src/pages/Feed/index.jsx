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
        return [...periodFiltered].sort((a, b) => engagementScore(b) - engagementScore(a));
      case "recentes":
        return [...periodFiltered].sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
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
    <div className="flex flex-col min-h-screen p-7 gap-5">

      {/* Header panel */}
      <header className="flex flex-col bg-white border border-black/[0.07] rounded-2xl p-6 gap-4 shadow-card">
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em] leading-tight">
              Flow Network
            </h1>
            <p className="text-[14px] text-[#6E6E73] leading-normal tracking-[-0.01em]">
              Conhecimento operacional vivo — explore, reutilize e contribua
            </p>
          </div>
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={() => navigate("/criar-flow")}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-[10px] text-[13.5px] font-semibold cursor-pointer tracking-[-0.01em] transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-px active:translate-y-0"
            >
              <Plus size={15} strokeWidth={2.5} />
              Criar Flow
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <SearchBar />
          <Categories filtros={filtros.categorias} />
          {!isDiscussoes && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {PERIODS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPeriod(id)}
                  className={`px-3 py-1 rounded-full text-[12px] cursor-pointer transition-all duration-150 border ${
                    period === id
                      ? "border-[#233DFF] bg-brand-light text-brand font-semibold"
                      : "border-black/[0.08] bg-transparent text-[#6E6E73] font-normal hover:border-brand/[0.4] hover:text-brand hover:bg-brand-light"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex gap-5 items-start">

        {/* Feed column */}
        <div className="flex-1 min-w-0 flex flex-col gap-3.5">

          {/* Section tabs */}
          <div className="flex items-center gap-0.5 bg-white border border-black/[0.07] rounded-xl p-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 border-0 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-150 whitespace-nowrap tracking-[-0.01em] ${
                  activeSection === id
                    ? "bg-[#233DFF] text-white shadow-[0_2px_8px_rgba(35,61,255,0.22)]"
                    : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
                }`}
              >
                <Icon size={14} />
                {label}
                {sectionCounts[id] > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full text-[10px] font-bold ${
                      activeSection === id
                        ? "bg-white/20 text-white"
                        : "bg-[#F5F5F7] text-[#AEAEB2]"
                    }`}
                  >
                    {sectionCounts[id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Section label */}
          <p className="text-[11px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase px-0.5">
            {SECTIONS.find((s) => s.id === activeSection)?.label}
            {activeSection === "discussoes"
              ? " — dúvidas operacionais sem resposta"
              : activeSection === "equipe"
              ? " — o que seu time está criando"
              : activeSection === "forks" && sectionFlows.length === 0 && !loading
              ? " — nenhum flow derivado ainda"
              : ""}
          </p>

          {/* Flow list */}
          <div className="flex flex-col gap-3.5">
            {loading && !isDiscussoes ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-black/[0.07] rounded-[14px] p-5 flex flex-col gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                >
                  {[
                    { w: "40%", h: "12px" },
                    { w: "70%", h: "18px" },
                    { w: "90%", h: "13px" },
                    { w: "55%", h: "13px" },
                  ].map((line, j) => (
                    <div
                      key={j}
                      style={{ width: line.w, height: line.h }}
                      className="rounded-md bg-[#F5F5F7] animate-pulse"
                    />
                  ))}
                </div>
              ))
            ) : displayItems.length > 0 ? (
              <>
                {isDiscussoes
                  ? displayItems.map((post) => <DiscussaoCard post={post} key={post.id} />)
                  : displayItems.map((flow) => <FlowCard flow={flow} key={flow.id} />)}
                {hasMore && (
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="w-full py-2.5 border border-dashed border-black/[0.10] rounded-[10px] bg-transparent text-[#6E6E73] text-[13px] font-medium cursor-pointer hover:border-[#233DFF]/40 hover:text-[#233DFF] hover:bg-brand-light transition-all duration-150 tracking-[-0.01em]"
                  >
                    Carregar mais
                  </button>
                )}
              </>
            ) : (
              <FlowsNotFound />
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[276px] flex-shrink-0 hidden lg:flex flex-col gap-3.5 sticky top-7">
          <TrendingBoard />
          <StatisticsBoard />
        </aside>
      </div>
    </div>
  );
}
