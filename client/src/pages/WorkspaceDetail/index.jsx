import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Users,
  GitBranch,
  Eye,
  Pencil,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import { useFlowStore } from "../../store/flowStore";

import {
  PageContainer,
  HeaderCard,
  HeaderLeft,
  WorkspaceLogo,
  HeaderInfo,
  WorkspaceName,
  WorkspaceDesc,
  HeaderMeta,
  MetaChip,
  HeaderActions,
  ActionBtn,
  PrimaryBtn,
  BackBtn,
  TabNav,
  TabItem,
  TabContent,
  SectionHeader,
  SectionTitle,
  FlowList,
  FlowItem,
  StatusDot,
  FlowInfo,
  FlowTitle,
  FlowMeta,
  FlowItemActions,
  SmallBtn,
  MemberList,
  MemberItem,
  MemberAvatar,
  MemberInfo,
  MemberName,
  MemberRole,
  RoleBadge,
  RemoveBtn,
  EmptyState,
  EmptyText,
  ModalOverlay,
  ModalBox,
  ModalTitle,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  ModalActions,
  SecondaryBtn,
  FlowSelectList,
  FlowSelectItem,
  FlowSelectTitle,
  SkeletonCard,
  SkeletonLine,
} from "./style";

const getInitial = (nome) => (nome ? nome[0].toUpperCase() : "W");
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

const ROLE_LABELS = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
const STATUS_LABELS = { publicado: "Publicado", rascunho: "Rascunho", arquivado: "Arquivado" };

export default function WorkspaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("flows");

  // Add member modal
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ email: "", role: "viewer" });
  const [addingMember, setAddingMember] = useState(false);

  // Add flow modal
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [addingFlow, setAddingFlow] = useState(false);

  const userId = localStorage.getItem("usuarioId");
  const { flows, fetchFlows } = useFlowStore();

  useEffect(() => {
    Promise.all([
      api.get(`/workspace/${id}`),
      fetchFlows(),
    ])
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

  // User's flows not yet in this workspace
  const availableFlows = useMemo(
    () =>
      flows.filter(
        (f) =>
          f.criado_por === userId &&
          (!f.workspace_id || f.workspace_id !== id)
      ),
    [flows, userId, id]
  );

  const handleAddMember = async () => {
    if (!memberForm.email.trim()) {
      toast.error("Email é obrigatório");
      return;
    }
    setAddingMember(true);
    try {
      const { data } = await api.post(`/workspace/${id}/membros`, memberForm);
      setWorkspace((prev) => ({
        ...prev,
        membros: [...(prev.membros || []), data],
      }));
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
      setWorkspace((prev) => ({
        ...prev,
        membros: prev.membros.filter((m) => m.usuario_id !== memberId),
      }));
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
      setWorkspace((prev) => ({
        ...prev,
        flows: [
          ...(prev.flows || []),
          { ...flow, workspace_id: id },
        ],
      }));
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
      setWorkspace((prev) => ({
        ...prev,
        flows: prev.flows.filter((f) => f.id !== flowId),
      }));
      toast.success("Flow removido do workspace");
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao remover flow");
    }
  };

  if (loading || !workspace) {
    return (
      <PageContainer>
        <SkeletonCard $h="120px">
          <SkeletonLine $w="52px" $h="52px" $radius="12px" />
          <SkeletonLine $w="200px" $h="18px" />
          <SkeletonLine $w="140px" $h="13px" />
        </SkeletonCard>
        <SkeletonCard $h="300px" />
      </PageContainer>
    );
  }

  const workspaceFlows = workspace.flows || [];
  const membros = workspace.membros || [];

  return (
    <PageContainer>
      <BackBtn onClick={() => navigate("/workspaces")}>
        <ArrowLeft size={14} />
        Workspaces
      </BackBtn>

      <HeaderCard>
        <HeaderLeft>
          <WorkspaceLogo>{getInitial(workspace.nome)}</WorkspaceLogo>
          <HeaderInfo>
            <WorkspaceName>{workspace.nome}</WorkspaceName>
            {workspace.descricao && (
              <WorkspaceDesc>{workspace.descricao}</WorkspaceDesc>
            )}
            <HeaderMeta>
              <MetaChip>
                <Users size={11} />
                {membros.length} membros
              </MetaChip>
              <MetaChip>
                <GitBranch size={11} />
                {workspaceFlows.length} flows
              </MetaChip>
            </HeaderMeta>
          </HeaderInfo>
        </HeaderLeft>

        <HeaderActions>
          {isAdmin && (
            <ActionBtn onClick={() => setShowAddMember(true)}>
              <UserPlus size={13} />
              Convidar
            </ActionBtn>
          )}
          <PrimaryBtn onClick={() => setShowAddFlow(true)}>
            <Plus size={13} strokeWidth={2.5} />
            Adicionar Flow
          </PrimaryBtn>
        </HeaderActions>
      </HeaderCard>

      <TabNav>
        <TabItem
          $active={activeTab === "flows"}
          onClick={() => setActiveTab("flows")}
        >
          Flows ({workspaceFlows.length})
        </TabItem>
        <TabItem
          $active={activeTab === "membros"}
          onClick={() => setActiveTab("membros")}
        >
          Membros ({membros.length})
        </TabItem>
      </TabNav>

      <TabContent>
        {activeTab === "flows" && (
          <>
            <SectionHeader>
              <SectionTitle>Flows do Workspace</SectionTitle>
            </SectionHeader>

            {workspaceFlows.length === 0 ? (
              <EmptyState>
                <EmptyText>Nenhum flow neste workspace ainda</EmptyText>
              </EmptyState>
            ) : (
              <FlowList>
                {workspaceFlows.map((flow) => (
                  <FlowItem key={flow.id}>
                    <StatusDot
                      $status={flow.status}
                      title={STATUS_LABELS[flow.status]}
                    />
                    <FlowInfo>
                      <FlowTitle>{flow.titulo}</FlowTitle>
                      <FlowMeta>
                        {[flow.categoria, timeAgo(flow.criado_em)]
                          .filter(Boolean)
                          .join(" · ")}
                      </FlowMeta>
                    </FlowInfo>
                    <FlowItemActions>
                      <SmallBtn onClick={() => navigate(`/flow/${flow.id}`)}>
                        <Eye size={10} style={{ marginRight: 3 }} />
                        Ver
                      </SmallBtn>
                      {flow.criado_por === userId && (
                        <SmallBtn
                          onClick={() => navigate(`/editar-flow/${flow.id}`)}
                        >
                          <Pencil size={10} style={{ marginRight: 3 }} />
                          Editar
                        </SmallBtn>
                      )}
                      {(isAdmin || flow.criado_por === userId) && (
                        <SmallBtn
                          className="danger"
                          onClick={() => handleRemoveFlow(flow.id)}
                        >
                          <X size={10} />
                        </SmallBtn>
                      )}
                    </FlowItemActions>
                  </FlowItem>
                ))}
              </FlowList>
            )}
          </>
        )}

        {activeTab === "membros" && (
          <>
            <SectionHeader>
              <SectionTitle>Membros</SectionTitle>
            </SectionHeader>

            <MemberList>
              {membros.map((membro) => {
                const u = membro.usuario;
                if (!u) return null;
                const isSelf = u.id === userId;
                const isCreator = u.id === workspace.criado_por;
                return (
                  <MemberItem key={membro.id || u.id}>
                    <MemberAvatar>{getIniciais(u.nome)}</MemberAvatar>
                    <MemberInfo>
                      <MemberName>
                        {u.nome}
                        {isSelf && " (você)"}
                      </MemberName>
                      {u.cargo && <MemberRole>{u.cargo}</MemberRole>}
                    </MemberInfo>
                    <RoleBadge $role={isCreator ? "admin" : membro.role}>
                      {ROLE_LABELS[isCreator ? "admin" : membro.role]}
                    </RoleBadge>
                    {isAdmin && !isSelf && !isCreator && (
                      <RemoveBtn
                        title="Remover membro"
                        onClick={() => handleRemoveMember(u.id)}
                      >
                        <Trash2 size={12} />
                      </RemoveBtn>
                    )}
                  </MemberItem>
                );
              })}
            </MemberList>
          </>
        )}
      </TabContent>

      {/* Modal: Adicionar Membro */}
      {showAddMember && (
        <ModalOverlay onClick={() => setShowAddMember(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Convidar Membro</ModalTitle>
            <FormField>
              <FormLabel>Email do usuário *</FormLabel>
              <FormInput
                autoFocus
                type="email"
                value={memberForm.email}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="usuario@exemplo.com"
              />
            </FormField>
            <FormField>
              <FormLabel>Permissão</FormLabel>
              <FormSelect
                value={memberForm.role}
                onChange={(e) =>
                  setMemberForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="viewer">Viewer — somente leitura</option>
                <option value="editor">Editor — pode editar flows</option>
                <option value="admin">Admin — controle total</option>
              </FormSelect>
            </FormField>
            <ModalActions>
              <SecondaryBtn onClick={() => setShowAddMember(false)}>
                Cancelar
              </SecondaryBtn>
              <PrimaryBtn onClick={handleAddMember} disabled={addingMember}>
                {addingMember ? "Adicionando..." : "Convidar"}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* Modal: Adicionar Flow */}
      {showAddFlow && (
        <ModalOverlay onClick={() => setShowAddFlow(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Adicionar Flow ao Workspace</ModalTitle>
            {availableFlows.length === 0 ? (
              <EmptyText style={{ padding: "20px 0", textAlign: "center" }}>
                Nenhum flow disponível para adicionar.
                <br />
                Todos os seus flows já estão neste workspace ou você não tem
                flows criados.
              </EmptyText>
            ) : (
              <FlowSelectList>
                {availableFlows.map((flow) => (
                  <FlowSelectItem
                    key={flow.id}
                    $selected={selectedFlowId === flow.id}
                    onClick={() =>
                      setSelectedFlowId(
                        selectedFlowId === flow.id ? null : flow.id
                      )
                    }
                  >
                    <StatusDot $status={flow.status} />
                    <FlowSelectTitle>{flow.titulo}</FlowSelectTitle>
                  </FlowSelectItem>
                ))}
              </FlowSelectList>
            )}
            <ModalActions>
              <SecondaryBtn onClick={() => setShowAddFlow(false)}>
                Cancelar
              </SecondaryBtn>
              <PrimaryBtn
                onClick={handleAddFlow}
                disabled={!selectedFlowId || addingFlow}
              >
                {addingFlow ? "Adicionando..." : "Adicionar"}
              </PrimaryBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
