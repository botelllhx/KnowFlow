import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Users, GitBranch, Eye, Pencil, Trash2, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { useFlowStore } from "../../store/flowStore";

const getInitial  = (nome) => (nome ? nome[0].toUpperCase() : "W");
const getIniciais = (nome) => {
  if (!nome) return "?";
  const parts = nome.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "Agora mesmo";
  if (diff < 60) return `${diff}min atrás`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d atrás`;
  return `${Math.floor(d / 7)}sem atrás`;
};

const ROLE_LABELS  = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
const ROLE_COLORS  = { admin: "bg-brand-light text-brand border-brand/[0.15]", editor: "bg-emerald-50 text-emerald-600 border-emerald-200", viewer: "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]" };
const STATUS_DOT   = { publicado: "bg-emerald-500", rascunho: "bg-amber-400", arquivado: "bg-[#AEAEB2]" };
const STATUS_LABELS = { publicado: "Publicado", rascunho: "Rascunho", arquivado: "Arquivado" };

const inputCls = "w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150";
const selectCls = "w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] transition-all duration-150 cursor-pointer";

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-[440px] mx-4 flex flex-col gap-5 shadow-float" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[20px] font-bold text-[#1D1D1F] tracking-[-0.02em]">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#6E6E73] border-0 bg-transparent cursor-pointer transition-colors">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("flows");

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ email: "", role: "viewer" });
  const [addingMember, setAddingMember] = useState(false);

  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [addingFlow, setAddingFlow] = useState(false);

  const userId = localStorage.getItem("usuarioId");
  const { flows, fetchFlows } = useFlowStore();

  useEffect(() => {
    Promise.all([api.get(`/workspace/${id}`), fetchFlows()])
      .then(([res]) => setWorkspace(res.data))
      .catch(() => toast.error("Erro ao carregar workspace"))
      .finally(() => setLoading(false));
  }, [id, fetchFlows]);

  const myRole = useMemo(() => {
    if (!workspace) return "viewer";
    if (workspace.criado_por === userId) return "admin";
    const m = workspace.membros?.find((m) => m.usuario_id === userId);
    return m?.role || "viewer";
  }, [workspace, userId]);

  const isAdmin = myRole === "admin";

  const availableFlows = useMemo(
    () => flows.filter((f) => f.criado_por === userId && (!f.workspace_id || f.workspace_id !== id)),
    [flows, userId, id]
  );

  const handleAddMember = async () => {
    if (!memberForm.email.trim()) { toast.error("Email é obrigatório"); return; }
    setAddingMember(true);
    try {
      const { data } = await api.post(`/workspace/${id}/membros`, memberForm);
      setWorkspace((prev) => ({ ...prev, membros: [...(prev.membros || []), data] }));
      setShowAddMember(false);
      setMemberForm({ email: "", role: "viewer" });
      toast.success("Membro adicionado!");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao adicionar membro");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.delete(`/workspace/${id}/membros/${memberId}`);
      setWorkspace((prev) => ({ ...prev, membros: prev.membros.filter((m) => m.usuario_id !== memberId) }));
      toast.success("Membro removido");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao remover membro");
    }
  };

  const handleAddFlow = async () => {
    if (!selectedFlowId) return;
    setAddingFlow(true);
    try {
      await api.post(`/workspace/${id}/flows/${selectedFlowId}`);
      const flow = flows.find((f) => f.id === selectedFlowId);
      setWorkspace((prev) => ({ ...prev, flows: [...(prev.flows || []), { ...flow, workspace_id: id }] }));
      setShowAddFlow(false);
      setSelectedFlowId(null);
      toast.success("Flow adicionado ao workspace!");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao adicionar flow");
    } finally {
      setAddingFlow(false);
    }
  };

  const handleRemoveFlow = async (flowId) => {
    try {
      await api.delete(`/workspace/${id}/flows/${flowId}`);
      setWorkspace((prev) => ({ ...prev, flows: prev.flows.filter((f) => f.id !== flowId) }));
      toast.success("Flow removido do workspace");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao remover flow");
    }
  };

  if (loading || !workspace) {
    return (
      <div className="flex flex-col p-7 gap-5 min-h-screen">
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col gap-4 shadow-card min-h-[120px]">
          <div className="w-14 h-14 rounded-xl bg-[#F5F5F7] animate-pulse" />
          <div className="w-48 h-5 rounded-md bg-[#F5F5F7] animate-pulse" />
          <div className="w-36 h-3 rounded-md bg-[#F5F5F7] animate-pulse" />
        </div>
        <div className="bg-white border border-black/[0.07] rounded-2xl p-6 shadow-card min-h-[300px]" />
      </div>
    );
  }

  const workspaceFlows = workspace.flows || [];
  const membros = workspace.membros || [];

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Back button */}
      <button
        onClick={() => navigate("/workspaces")}
        className="inline-flex items-center gap-1.5 text-[13px] text-[#6E6E73] hover:text-[#1D1D1F] bg-transparent border-0 cursor-pointer p-0 self-start transition-colors"
      >
        <ArrowLeft size={14} />
        Workspaces
      </button>

      {/* Header card */}
      <div className="bg-white border border-black/[0.07] rounded-2xl p-6 flex items-start justify-between gap-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 flex-shrink-0 rounded-xl bg-brand-light border border-brand/[0.15] text-brand font-bold text-[20px] flex items-center justify-center">
            {getInitial(workspace.nome)}
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-serif text-[22px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
              {workspace.nome}
            </h1>
            {workspace.descricao && (
              <p className="text-[13.5px] text-[#6E6E73]">{workspace.descricao}</p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-1 text-[11.5px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md">
                <Users size={11} />{membros.length} membros
              </span>
              <span className="inline-flex items-center gap-1 text-[11.5px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md">
                <GitBranch size={11} />{workspaceFlows.length} flows
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-black/[0.08] bg-white hover:bg-[#F5F5F7] text-[13px] font-medium text-[#1D1D1F] cursor-pointer transition-colors"
            >
              <UserPlus size={13} />
              Convidar
            </button>
          )}
          <button
            onClick={() => setShowAddFlow(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-[10px] text-[13.5px] font-semibold cursor-pointer transition-all duration-150 shadow-brand hover:shadow-brand-hover"
          >
            <Plus size={13} strokeWidth={2.5} />
            Adicionar Flow
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 bg-white border border-black/[0.07] rounded-xl p-1 shadow-[0_1px_4px_rgba(0,0,0,0.04)] self-start">
        {[
          { id: "flows",   label: `Flows (${workspaceFlows.length})` },
          { id: "membros", label: `Membros (${membros.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-[13px] font-medium cursor-pointer border-0 transition-all duration-150 tracking-[-0.01em] ${
              activeTab === tab.id
                ? "bg-[#233DFF] text-white shadow-[0_2px_8px_rgba(35,61,255,0.22)]"
                : "bg-transparent text-[#6E6E73] hover:bg-[#F5F5F7] hover:text-[#1D1D1F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "flows" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase">
            Flows do Workspace
          </h2>
          {workspaceFlows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <p className="text-[14px] font-medium text-[#6E6E73]">Nenhum flow neste workspace ainda</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-black/[0.05] bg-white border border-black/[0.07] rounded-2xl overflow-hidden shadow-card">
              {workspaceFlows.map((flow) => (
                <div key={flow.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[flow.status] || "bg-[#AEAEB2]"}`} title={STATUS_LABELS[flow.status]} />
                  <div className="flex flex-col flex-1 min-w-0 gap-px">
                    <span className="text-[13px] font-medium text-[#1D1D1F] truncate">{flow.titulo}</span>
                    <span className="text-[11.5px] text-[#AEAEB2]">
                      {[flow.categoria, timeAgo(flow.criado_em)].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => navigate(`/flow/${flow.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#EBEBED] border-0 cursor-pointer transition-colors">
                      <Eye size={11} />Ver
                    </button>
                    {flow.criado_por === userId && (
                      <button onClick={() => navigate(`/editar-flow/${flow.id}`)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium text-[#6E6E73] bg-[#F5F5F7] hover:bg-[#EBEBED] border-0 cursor-pointer transition-colors">
                        <Pencil size={11} />Editar
                      </button>
                    )}
                    {(isAdmin || flow.criado_por === userId) && (
                      <button onClick={() => handleRemoveFlow(flow.id)} className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#AEAEB2] bg-[#F5F5F7] hover:bg-rose-50 hover:text-rose-500 border-0 cursor-pointer transition-colors">
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "membros" && (
        <div className="flex flex-col gap-3">
          <h2 className="text-[13px] font-semibold text-[#AEAEB2] tracking-[0.06em] uppercase">Membros</h2>
          <div className="flex flex-col divide-y divide-black/[0.05] bg-white border border-black/[0.07] rounded-2xl overflow-hidden shadow-card">
            {membros.map((membro) => {
              const u = membro.usuario;
              if (!u) return null;
              const isSelf = u.id === userId;
              const isCreator = u.id === workspace.criado_por;
              const role = isCreator ? "admin" : membro.role;
              return (
                <div key={membro.id || u.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-full bg-brand-light border border-brand/[0.15] text-brand font-semibold text-[12px] flex items-center justify-center flex-shrink-0">
                    {getIniciais(u.nome)}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 gap-px">
                    <span className="text-[13px] font-medium text-[#1D1D1F]">
                      {u.nome}{isSelf && " (você)"}
                    </span>
                    {u.cargo && <span className="text-[11.5px] text-[#AEAEB2]">{u.cargo}</span>}
                  </div>
                  <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${ROLE_COLORS[role]}`}>
                    {ROLE_LABELS[role]}
                  </span>
                  {isAdmin && !isSelf && !isCreator && (
                    <button onClick={() => handleRemoveMember(u.id)} title="Remover membro" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#AEAEB2] hover:bg-rose-50 hover:text-rose-500 bg-transparent border-0 cursor-pointer transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Add Member */}
      {showAddMember && (
        <Modal title="Convidar Membro" onClose={() => setShowAddMember(false)}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">Email do usuário *</label>
              <input autoFocus type="email" value={memberForm.email} onChange={(e) => setMemberForm((f) => ({ ...f, email: e.target.value }))} placeholder="usuario@exemplo.com" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">Permissão</label>
              <select value={memberForm.role} onChange={(e) => setMemberForm((f) => ({ ...f, role: e.target.value }))} className={selectCls}>
                <option value="viewer">Viewer — somente leitura</option>
                <option value="editor">Editor — pode editar flows</option>
                <option value="admin">Admin — controle total</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setShowAddMember(false)} className="px-4 py-2.5 bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-[13.5px] font-medium rounded-xl border-0 cursor-pointer transition-colors">Cancelar</button>
            <button onClick={handleAddMember} disabled={addingMember} className="px-5 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] disabled:bg-[#AEAEB2] text-white text-[13.5px] font-semibold rounded-xl border-0 cursor-pointer transition-all shadow-brand">
              {addingMember ? "Adicionando..." : "Convidar"}
            </button>
          </div>
        </Modal>
      )}

      {/* Modal: Add Flow */}
      {showAddFlow && (
        <Modal title="Adicionar Flow ao Workspace" onClose={() => setShowAddFlow(false)}>
          {availableFlows.length === 0 ? (
            <p className="text-[13px] text-[#AEAEB2] text-center py-4 leading-relaxed">
              Nenhum flow disponível para adicionar.<br />
              Todos os seus flows já estão neste workspace ou você não tem flows criados.
            </p>
          ) : (
            <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto">
              {availableFlows.map((flow) => (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlowId(selectedFlowId === flow.id ? null : flow.id)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl cursor-pointer border transition-all duration-150 ${
                    selectedFlowId === flow.id
                      ? "border-brand bg-brand-light"
                      : "border-black/[0.07] bg-[#F5F5F7] hover:bg-[#EBEBED]"
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[flow.status] || "bg-[#AEAEB2]"}`} />
                  <span className={`text-[13px] font-medium truncate ${selectedFlowId === flow.id ? "text-brand" : "text-[#1D1D1F]"}`}>
                    {flow.titulo}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setShowAddFlow(false)} className="px-4 py-2.5 bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-[13.5px] font-medium rounded-xl border-0 cursor-pointer transition-colors">Cancelar</button>
            <button onClick={handleAddFlow} disabled={!selectedFlowId || addingFlow} className="px-5 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] disabled:bg-[#AEAEB2] text-white text-[13.5px] font-semibold rounded-xl border-0 cursor-pointer transition-all shadow-brand">
              {addingFlow ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
