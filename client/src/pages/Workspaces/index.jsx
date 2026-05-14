import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Layers, Users, GitBranch } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  CreateBtn,
  WorkspaceGrid,
  WorkspaceCard,
  WorkspaceLogoPlaceholder,
  WorkspaceName,
  WorkspaceDesc,
  WorkspaceMeta,
  MetaChip,
  RoleBadge,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyText,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  ModalActions,
  PrimaryBtn,
  SecondaryBtn,
  SkeletonCard,
  SkeletonLine,
} from "./style";

const getInitial = (nome) => (nome ? nome[0].toUpperCase() : "W");

const ROLE_LABELS = { admin: "Admin", editor: "Editor", viewer: "Viewer" };

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
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
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
      <PageContainer>
        <PageHeader>
          <div>
            <SkeletonLine $w="160px" $h="22px" />
            <SkeletonLine $w="220px" $h="13px" style={{ marginTop: 6 }} />
          </div>
        </PageHeader>
        <WorkspaceGrid>
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonLine $w="44px" $h="44px" $radius="10px" />
              <SkeletonLine $w="60%" $h="16px" />
              <SkeletonLine $w="90%" $h="12px" />
              <SkeletonLine $w="70%" $h="12px" />
            </SkeletonCard>
          ))}
        </WorkspaceGrid>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <div>
          <PageTitle>Workspaces</PageTitle>
          <PageSubtitle>
            {workspaces.length === 0
              ? "Crie um workspace para organizar o conhecimento da sua equipe"
              : `${workspaces.length} workspace${workspaces.length !== 1 ? "s" : ""}`}
          </PageSubtitle>
        </div>
        <CreateBtn onClick={() => setShowModal(true)}>
          <Plus size={14} strokeWidth={2.5} />
          Novo Workspace
        </CreateBtn>
      </PageHeader>

      {workspaces.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Layers size={24} />
          </EmptyIcon>
          <EmptyTitle>Nenhum workspace ainda</EmptyTitle>
          <EmptyText>
            Workspaces isolam o conhecimento de equipes diferentes dentro da
            organização.
          </EmptyText>
          <CreateBtn onClick={() => setShowModal(true)}>
            <Plus size={14} strokeWidth={2.5} />
            Criar Workspace
          </CreateBtn>
        </EmptyState>
      ) : (
        <WorkspaceGrid>
          {workspaces.map((ws) => {
            const role = getMyRole(ws);
            return (
              <WorkspaceCard key={ws.id} onClick={() => navigate(`/workspace/${ws.id}`)}>
                <WorkspaceLogoPlaceholder>
                  {getInitial(ws.nome)}
                </WorkspaceLogoPlaceholder>
                <WorkspaceName>{ws.nome}</WorkspaceName>
                {ws.descricao && (
                  <WorkspaceDesc>{ws.descricao}</WorkspaceDesc>
                )}
                <WorkspaceMeta>
                  <MetaChip>
                    <Users size={11} />
                    {ws.membros?.length || 0} membros
                  </MetaChip>
                  <MetaChip>
                    <GitBranch size={11} />
                    {ws.flows?.length || 0} flows
                  </MetaChip>
                  <RoleBadge $role={role}>{ROLE_LABELS[role]}</RoleBadge>
                </WorkspaceMeta>
              </WorkspaceCard>
            );
          })}
        </WorkspaceGrid>
      )}

      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Criar Workspace</ModalTitle>
            <FormField>
              <FormLabel>Nome *</FormLabel>
              <FormInput
                autoFocus
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                placeholder="Ex: Produto, Engenharia, RH..."
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </FormField>
            <FormField>
              <FormLabel>Descrição</FormLabel>
              <FormTextarea
                value={form.descricao}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descricao: e.target.value }))
                }
                placeholder="Para que serve este workspace?"
                rows={3}
              />
            </FormField>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowModal(false)}>
                Cancelar
              </SecondaryBtn>
              <PrimaryBtn onClick={handleCreate} disabled={saving}>
                {saving ? "Criando..." : "Criar"}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
