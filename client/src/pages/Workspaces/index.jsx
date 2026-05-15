import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Layers, Users, GitBranch, X } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

const getInitial = (nome) => (nome ? nome[0].toUpperCase() : "W");

const ROLE_LABELS = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
const ROLE_COLORS = {
  admin:  "bg-brand-light text-brand border-brand/[0.15]",
  editor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  viewer: "bg-[#F5F5F7] text-[#6E6E73] border-black/[0.08]",
};

const inputCls =
  "w-full text-[14px] text-[#1D1D1F] bg-[#F5F5F7] border border-black/[0.08] rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-[#233DFF] focus:ring-2 focus:ring-[rgba(35,61,255,0.12)] placeholder-[#AEAEB2] transition-all duration-150";

export default function Workspaces() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [saving, setSaving] = useState(false);

  const userId = localStorage.getItem("usuarioId");

  useEffect(() => {
    api
      .get("/workspace")
      .then((res) => setWorkspaces(res.data))
      .catch(() => toast.error("Erro ao carregar workspaces"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      const { data } = await api.post("/workspace", form);
      setWorkspaces((prev) => [{ ...data, membros: [], flows: [] }, ...prev]);
      setShowModal(false);
      setForm({ nome: "", descricao: "" });
      toast.success("Workspace criado!");
      navigate(`/workspace/${data.id}`);
    } catch {
      toast.error("Erro ao criar workspace");
    } finally {
      setSaving(false);
    }
  };

  const getMyRole = (workspace) => {
    if (workspace.criado_por === userId) return "admin";
    const membro = workspace.membros?.find((m) => m.usuario_id === userId);
    return membro?.role || "viewer";
  };

  if (loading) {
    return (
      <div className="flex flex-col p-7 gap-5 min-h-screen">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="w-40 h-7 rounded-md bg-[#F5F5F7] animate-pulse" />
            <div className="w-56 h-4 rounded-md bg-[#F5F5F7] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 shadow-card min-h-[160px]">
              <div className="w-11 h-11 rounded-xl bg-[#F5F5F7] animate-pulse" />
              <div className="w-3/5 h-4 rounded-md bg-[#F5F5F7] animate-pulse" />
              <div className="w-4/5 h-3 rounded-md bg-[#F5F5F7] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-7 gap-5 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-[26px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
            Workspaces
          </h1>
          <p className="text-[14px] text-[#6E6E73] tracking-[-0.01em]">
            {workspaces.length === 0
              ? "Crie um workspace para organizar o conhecimento da sua equipe"
              : `${workspaces.length} workspace${workspaces.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-[10px] text-[13.5px] font-semibold cursor-pointer tracking-[-0.01em] transition-all duration-150 shadow-brand hover:shadow-brand-hover hover:-translate-y-px active:translate-y-0 flex-shrink-0"
        >
          <Plus size={14} strokeWidth={2.5} />
          Novo Workspace
        </button>
      </div>

      {workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand flex items-center justify-center">
            <Layers size={24} />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <h2 className="text-[17px] font-semibold text-[#1D1D1F] tracking-[-0.01em]">
              Nenhum workspace ainda
            </h2>
            <p className="text-[14px] text-[#6E6E73] max-w-[340px] leading-relaxed">
              Workspaces isolam o conhecimento de equipes diferentes dentro da organização.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] text-white border-0 rounded-[10px] text-[13.5px] font-semibold cursor-pointer transition-all duration-150 shadow-brand hover:shadow-brand-hover"
          >
            <Plus size={14} strokeWidth={2.5} />
            Criar Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => {
            const role = getMyRole(ws);
            return (
              <div
                key={ws.id}
                onClick={() => navigate(`/workspace/${ws.id}`)}
                className="group bg-white border border-black/[0.07] rounded-2xl p-5 flex flex-col gap-3 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-brand-light border border-brand/[0.15] text-brand font-bold text-[17px] flex items-center justify-center">
                  {getInitial(ws.nome)}
                </div>
                <h3 className="text-[15px] font-semibold text-[#1D1D1F] tracking-[-0.01em] group-hover:text-brand transition-colors">
                  {ws.nome}
                </h3>
                {ws.descricao && (
                  <p className="text-[13px] text-[#6E6E73] leading-relaxed line-clamp-2">
                    {ws.descricao}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap mt-auto pt-1">
                  <span className="inline-flex items-center gap-1 text-[11.5px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md">
                    <Users size={11} />
                    {ws.membros?.length || 0} membros
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11.5px] text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md">
                    <GitBranch size={11} />
                    {ws.flows?.length || 0} flows
                  </span>
                  <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-md border ${ROLE_COLORS[role]}`}>
                    {ROLE_LABELS[role]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-[440px] mx-4 flex flex-col gap-5 shadow-float"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[20px] font-bold text-[#1D1D1F] tracking-[-0.02em]">
                Criar Workspace
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#6E6E73] border-0 bg-transparent cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
                  Nome *
                </label>
                <input
                  autoFocus
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  placeholder="Ex: Produto, Engenharia, RH..."
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#1D1D1F] tracking-[-0.01em]">
                  Descrição
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
                  placeholder="Para que serve este workspace?"
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 bg-[#F5F5F7] hover:bg-[#EBEBED] text-[#1D1D1F] text-[13.5px] font-medium rounded-xl border-0 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                className="px-5 py-2.5 bg-[#233DFF] hover:bg-[#1A2ECC] disabled:bg-[#AEAEB2] text-white text-[13.5px] font-semibold rounded-xl border-0 cursor-pointer transition-all duration-150 shadow-brand"
              >
                {saving ? "Criando..." : "Criar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
