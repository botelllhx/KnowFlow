import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Share2, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import FlowCard from "../../components/FlowCard";
import { CommunityPost } from "../../components/CommunityPost";
import { useFlowStore } from "../../store/flowStore";

const TABS = [
  { id: "overview", label: "Visão Geral" },
  { id: "flows",    label: "Meus Flows" },
  { id: "forks",    label: "Forks" },
  { id: "salvos",   label: "Salvos" },
  { id: "posts",    label: "Posts" },
];

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

const inputCls =
  "w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nome: "", cargo: "", empresa: "", descricao: "" });
  const [saving, setSaving] = useState(false);

  const { flows, fetchFlows, loading: flowsLoading, savedPosts } = useFlowStore();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/usuario/me");
        setUser(data);
        setEditForm({ nome: data.nome || "", cargo: data.cargo || "", empresa: data.empresa || "", descricao: data.descricao || "" });
        await fetchFlows();
        const postsRes = await api.get("/postagemcomunidade", { params: { criado_por: data.id } });
        const userId = data.id;
        setPosts(
          postsRes.data
            .filter((p) => p.criado_por === userId)
            .map((p) => ({
              id: p.id,
              title: p.titulo || "Sem título",
              content: p.conteudo || "",
              author: { name: p.usuario?.nome || data.nome, initials: getIniciais(p.usuario?.nome || data.nome), role: data.cargo || "Membro", reputation: 0, id: userId },
              type: p.tipo || "Discussão",
              category: p.categoria || "Geral",
              tags: Array.isArray(p.tags) ? p.tags : [],
              upvotes: Number(p.upvotes) || 0,
              downvotes: Number(p.downvotes) || 0,
              comments: Array.isArray(p.comentarios) ? p.comentarios.length : 0,
              createdAt: timeAgo(p.criado_em),
              createdAtRaw: p.criado_em,
              isUpvoted: false,
              isDownvoted: false,
              isSaved: false,
            }))
            .sort((a, b) => new Date(b.createdAtRaw) - new Date(a.createdAtRaw))
        );
      } catch {
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchFlows]);

  const userFlows = useMemo(() => (user ? flows.filter((f) => f.criado_por === user.id) : []), [flows, user]);
  const userForks = useMemo(() => userFlows.filter((f) => f.fork_de), [userFlows]);
  const savedFlows = useMemo(() => flows.filter((f) => savedPosts.includes(String(f.id))), [flows, savedPosts]);
  const forksRecebidos = useMemo(() => {
    const myIds = new Set(userFlows.map((f) => String(f.id)));
    return flows.filter((f) => f.fork_de && myIds.has(String(f.fork_de))).length;
  }, [flows, userFlows]);
  const visualizacoesTotais = useMemo(() => userFlows.reduce((sum, f) => sum + (f.visualizacoes || 0), 0), [userFlows]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/usuario/me", editForm);
      setUser((prev) => ({ ...prev, ...data }));
      setIsEditing(false);
      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copiado!");
  };

  const handleVote = (postId, type) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        if (type === "up") {
          return p.isUpvoted
            ? { ...p, upvotes: p.upvotes - 1, isUpvoted: false }
            : { ...p, upvotes: p.upvotes + 1, downvotes: p.isDownvoted ? p.downvotes - 1 : p.downvotes, isUpvoted: true, isDownvoted: false };
        }
        return p.isDownvoted
          ? { ...p, downvotes: p.downvotes - 1, isDownvoted: false }
          : { ...p, downvotes: p.downvotes + 1, upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes, isDownvoted: true, isUpvoted: false };
      })
    );
  };

  const handleSavePost = (postId) => {
    const isSaved = posts.find((p) => p.id === postId)?.isSaved;
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p)));
    toast.success(isSaved ? "Post removido dos salvos!" : "Post salvo!");
  };

  if (loading || !user || flowsLoading) {
    return (
      <div className="flex flex-col p-7 gap-5 min-h-screen">
        {[220, 60, 280].map((h, i) => (
          <div key={i} style={{ minHeight: h }} className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 shadow-card">
            <div className="w-full h-5 rounded-md bg-[#F5F5F7] animate-pulse" style={{ width: "45%" }} />
            <div className="w-full h-3 rounded-md bg-[#F5F5F7] animate-pulse" style={{ width: "30%" }} />
          </div>
        ))}
      </div>
    );
  }

  const tabLabel = (tab) => {
    const counts = { flows: userFlows.length, forks: userForks.length, salvos: savedFlows.length, posts: posts.length };
    const count = counts[tab.id];
    return count !== undefined ? `${tab.label} (${count})` : tab.label;
  };

  const EmptyState = ({ text, action, actionLabel }) => (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <p className="text-[13px] text-[#AEAEB2]">{text}</p>
      {action && (
        <button onClick={action} className="text-[13px] text-brand font-medium hover:underline bg-transparent border-0 cursor-pointer p-0">
          {actionLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Profile card */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-5 shadow-card">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: "nome", label: "Nome", placeholder: "Seu nome" },
                { key: "cargo", label: "Cargo", placeholder: "Ex: Product Designer" },
                { key: "empresa", label: "Empresa", placeholder: "Ex: Acme Corp" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">{label}</label>
                  <input
                    value={editForm[key]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">Bio</label>
              <textarea
                value={editForm.descricao}
                onChange={(e) => setEditForm((f) => ({ ...f, descricao: e.target.value }))}
                placeholder="Uma breve descrição sobre você..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] disabled:bg-[#AEAEB2] text-white text-[13.5px] font-semibold rounded-xl border-0 cursor-pointer transition-all duration-150"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-[13.5px] font-medium rounded-xl border-0 cursor-pointer transition-all duration-150"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 flex-shrink-0 rounded-full bg-brand-light border-2 border-brand/[0.20] text-brand font-bold text-[20px] flex items-center justify-center">
              {getIniciais(user.nome)}
            </div>
            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <h1 className="font-serif text-[22px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
                {user.nome}
              </h1>
              {(user.cargo || user.empresa) && (
                <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
                  {[user.cargo, user.empresa].filter(Boolean).join(" · ")}
                </p>
              )}
              {user.criado_em && (
                <p className="flex items-center gap-1.5 text-[12px] text-[#AEAEB2] mt-0.5">
                  <Calendar size={12} />
                  Membro desde {memberSince(user.criado_em)}
                </p>
              )}
              {user.descricao && (
                <p className="text-[13.5px] text-[#6E6E73] leading-relaxed mt-1">
                  {user.descricao}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/[0.08] bg-white hover:bg-[#F5F5F7] text-[13px] font-medium text-[#1D1D1F] cursor-pointer transition-colors"
              >
                <Edit2 size={13} />
                Editar
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-xl border border-black/[0.08] bg-white hover:bg-[#F5F5F7] flex items-center justify-center text-[#6E6E73] cursor-pointer transition-colors"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1 border-t border-black/[0.05]">
          {[
            { value: userFlows.length, label: "Flows criados" },
            { value: visualizacoesTotais.toLocaleString("pt-BR"), label: "Visualizações" },
            { value: forksRecebidos, label: "Forks recebidos" },
            { value: savedFlows.length, label: "Flows salvos" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-0.5 flex-1">
              <span className="font-serif text-[20px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
                {value}
              </span>
              <span className="text-[11.5px] text-[#AEAEB2]">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-white border border-black/[0.07] rounded-xl p-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-x-auto [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-[13px] font-medium cursor-pointer border-0 transition-all duration-150 whitespace-nowrap tracking-[-0.01em] ${
              activeTab === t.id
                ? "bg-[#233DFF] text-white shadow-[0_2px_8px_rgba(35,61,255,0.22)]"
                : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            }`}
          >
            {tabLabel(t)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex flex-col gap-3.5">
        {activeTab === "overview" && (
          <>
            <div className="flex flex-col gap-3.5">
              <h2 className="text-[13px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase">Flows Recentes</h2>
              {userFlows.length === 0 ? (
                <EmptyState text="Nenhum flow criado ainda" action={() => navigate("/criar-flow")} actionLabel="Criar meu primeiro flow →" />
              ) : (
                userFlows.slice(0, 3).map((flow) => <FlowCard key={flow.id} flow={flow} userID={user.id} />)
              )}
            </div>
            {posts.length > 0 && (
              <div className="flex flex-col gap-3.5 mt-2">
                <h2 className="text-[13px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase">Posts Recentes</h2>
                {posts.slice(0, 2).map((post) => (
                  <CommunityPost key={post.id} post={post} onVote={handleVote} onSave={handleSavePost} currentUserId={user.id} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "flows" && (
          userFlows.length === 0 ? (
            <EmptyState text="Você ainda não criou nenhum flow" action={() => navigate("/criar-flow")} actionLabel="Criar flow →" />
          ) : (
            userFlows.map((flow) => <FlowCard key={flow.id} flow={flow} userID={user.id} />)
          )
        )}

        {activeTab === "forks" && (
          userForks.length === 0 ? (
            <EmptyState text="Você ainda não derivou nenhum flow" action={() => navigate("/feed")} actionLabel="Explorar flows →" />
          ) : (
            userForks.map((flow) => <FlowCard key={flow.id} flow={flow} userID={user.id} />)
          )
        )}

        {activeTab === "salvos" && (
          savedFlows.length === 0 ? (
            <EmptyState text="Nenhum flow salvo ainda" action={() => navigate("/feed")} actionLabel="Explorar flows →" />
          ) : (
            savedFlows.map((flow) => <FlowCard key={flow.id} flow={flow} userID={user.id} />)
          )
        )}

        {activeTab === "posts" && (
          posts.length === 0 ? (
            <EmptyState text="Nenhum post criado ainda" action={() => navigate("/comunidade")} actionLabel="Ir para comunidade →" />
          ) : (
            posts.map((post) => (
              <CommunityPost key={post.id} post={post} onVote={handleVote} onSave={handleSavePost} currentUserId={user.id} />
            ))
          )
        )}
      </div>
    </div>
  );
}
