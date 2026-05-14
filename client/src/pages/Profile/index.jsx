import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Share2, Calendar } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";
import FlowCard from "../../components/FlowCard";
import { CommunityPost } from "../../components/CommunityPost";
import { useFlowStore } from "../../store/flowStore";

import {
  PageContainer,
  ProfileCard,
  ProfileTop,
  AvatarWrap,
  AvatarCircle,
  UserInfo,
  UserName,
  UserRole,
  UserMeta,
  MetaItem,
  UserBio,
  ButtonRow,
  EditButton,
  ShareButton,
  StatsRow,
  StatChip,
  StatChipValue,
  StatChipLabel,
  EditForm,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormTextarea,
  FormActions,
  SaveBtn,
  CancelBtn,
  TabNav,
  TabItem,
  TabContent,
  Section,
  SectionTitle,
  EmptyState,
  EmptyText,
  EmptyAction,
  SkeletonCard,
  SkeletonLine,
} from "./style";

const TABS = [
  { id: "overview", label: "Visão Geral" },
  { id: "flows", label: "Meus Flows" },
  { id: "forks", label: "Forks" },
  { id: "salvos", label: "Salvos" },
  { id: "posts", label: "Posts" },
];

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

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nome: "",
    cargo: "",
    empresa: "",
    descricao: "",
  });
  const [saving, setSaving] = useState(false);

  const { flows, fetchFlows, loading: flowsLoading, savedPosts } = useFlowStore();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/usuario/me");
        setUser(data);
        setEditForm({
          nome: data.nome || "",
          cargo: data.cargo || "",
          empresa: data.empresa || "",
          descricao: data.descricao || "",
        });
        await fetchFlows();
        const postsRes = await api.get("/postagemcomunidade", {
          params: { criado_por: data.id },
        });
        const userId = data.id;
        setPosts(
          postsRes.data
            .filter((p) => p.criado_por === userId)
            .map((p) => ({
              id: p.id,
              title: p.titulo || "Sem título",
              content: p.conteudo || "",
              author: {
                name: p.usuario?.nome || data.nome,
                initials: getIniciais(p.usuario?.nome || data.nome),
                role: data.cargo || "Membro",
                reputation: 0,
                id: userId,
              },
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

  const userFlows = useMemo(
    () => (user ? flows.filter((f) => f.criado_por === user.id) : []),
    [flows, user]
  );

  const userForks = useMemo(
    () => userFlows.filter((f) => f.fork_de),
    [userFlows]
  );

  const savedFlows = useMemo(
    () => flows.filter((f) => savedPosts.includes(String(f.id))),
    [flows, savedPosts]
  );

  const forksRecebidos = useMemo(() => {
    const myIds = new Set(userFlows.map((f) => String(f.id)));
    return flows.filter((f) => f.fork_de && myIds.has(String(f.fork_de))).length;
  }, [flows, userFlows]);

  const visualizacoesTotais = useMemo(
    () => userFlows.reduce((sum, f) => sum + (f.visualizacoes || 0), 0),
    [userFlows]
  );

  const handleEdit = () => {
    setEditForm({
      nome: user.nome || "",
      cargo: user.cargo || "",
      empresa: user.empresa || "",
      descricao: user.descricao || "",
    });
    setIsEditing(true);
  };

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
            : {
                ...p,
                upvotes: p.upvotes + 1,
                downvotes: p.isDownvoted ? p.downvotes - 1 : p.downvotes,
                isUpvoted: true,
                isDownvoted: false,
              };
        }
        return p.isDownvoted
          ? { ...p, downvotes: p.downvotes - 1, isDownvoted: false }
          : {
              ...p,
              downvotes: p.downvotes + 1,
              upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes,
              isDownvoted: true,
              isUpvoted: false,
            };
      })
    );
  };

  const handleSavePost = (postId) => {
    const isSaved = posts.find((p) => p.id === postId)?.isSaved;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
    toast.success(isSaved ? "Post removido dos salvos!" : "Post salvo!");
  };

  if (loading || !user || flowsLoading) {
    return (
      <PageContainer>
        <SkeletonCard $h="220px">
          <SkeletonLine $w="72px" $h="72px" $radius="50%" />
          <SkeletonLine $w="200px" $h="20px" />
          <SkeletonLine $w="140px" $h="13px" />
          <SkeletonLine $w="300px" $h="12px" />
        </SkeletonCard>
        <SkeletonCard $h="60px" />
        <SkeletonCard $h="280px" />
      </PageContainer>
    );
  }

  const tabLabel = (tab) => {
    const counts = {
      flows: userFlows.length,
      forks: userForks.length,
      salvos: savedFlows.length,
      posts: posts.length,
    };
    const count = counts[tab.id];
    return count !== undefined ? `${tab.label} (${count})` : tab.label;
  };

  return (
    <PageContainer>
      <ProfileCard>
        {isEditing ? (
          <EditForm>
            <FormGrid>
              <FormField>
                <FormLabel>Nome</FormLabel>
                <FormInput
                  value={editForm.nome}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, nome: e.target.value }))
                  }
                  placeholder="Seu nome"
                />
              </FormField>
              <FormField>
                <FormLabel>Cargo</FormLabel>
                <FormInput
                  value={editForm.cargo}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, cargo: e.target.value }))
                  }
                  placeholder="Ex: Product Designer"
                />
              </FormField>
              <FormField>
                <FormLabel>Empresa</FormLabel>
                <FormInput
                  value={editForm.empresa}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, empresa: e.target.value }))
                  }
                  placeholder="Ex: Acme Corp"
                />
              </FormField>
            </FormGrid>
            <FormField>
              <FormLabel>Bio</FormLabel>
              <FormTextarea
                value={editForm.descricao}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, descricao: e.target.value }))
                }
                placeholder="Uma breve descrição sobre você..."
                rows={3}
              />
            </FormField>
            <FormActions>
              <SaveBtn onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </SaveBtn>
              <CancelBtn onClick={() => setIsEditing(false)}>Cancelar</CancelBtn>
            </FormActions>
          </EditForm>
        ) : (
          <ProfileTop>
            <AvatarWrap>
              <AvatarCircle>{getIniciais(user.nome)}</AvatarCircle>
            </AvatarWrap>
            <UserInfo>
              <UserName>{user.nome}</UserName>
              {(user.cargo || user.empresa) && (
                <UserRole>
                  {[user.cargo, user.empresa].filter(Boolean).join(" · ")}
                </UserRole>
              )}
              {user.criado_em && (
                <UserMeta>
                  <MetaItem>
                    <Calendar size={12} />
                    Membro desde {memberSince(user.criado_em)}
                  </MetaItem>
                </UserMeta>
              )}
              {user.descricao && <UserBio>{user.descricao}</UserBio>}
            </UserInfo>
            <ButtonRow>
              <EditButton onClick={handleEdit}>
                <Edit2 size={13} />
                Editar
              </EditButton>
              <ShareButton onClick={handleShare}>
                <Share2 size={14} />
              </ShareButton>
            </ButtonRow>
          </ProfileTop>
        )}

        <StatsRow>
          <StatChip>
            <StatChipValue>{userFlows.length}</StatChipValue>
            <StatChipLabel>Flows criados</StatChipLabel>
          </StatChip>
          <StatChip>
            <StatChipValue>
              {visualizacoesTotais.toLocaleString("pt-BR")}
            </StatChipValue>
            <StatChipLabel>Visualizações</StatChipLabel>
          </StatChip>
          <StatChip>
            <StatChipValue>{forksRecebidos}</StatChipValue>
            <StatChipLabel>Forks recebidos</StatChipLabel>
          </StatChip>
          <StatChip>
            <StatChipValue>{savedFlows.length}</StatChipValue>
            <StatChipLabel>Flows salvos</StatChipLabel>
          </StatChip>
        </StatsRow>
      </ProfileCard>

      <TabNav>
        {TABS.map((t) => (
          <TabItem
            key={t.id}
            $active={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
          >
            {tabLabel(t)}
          </TabItem>
        ))}
      </TabNav>

      <TabContent>
        {activeTab === "overview" && (
          <>
            <Section>
              <SectionTitle>Flows Recentes</SectionTitle>
              {userFlows.length === 0 ? (
                <EmptyState>
                  <EmptyText>Nenhum flow criado ainda</EmptyText>
                  <EmptyAction onClick={() => navigate("/criar-flow")}>
                    Criar meu primeiro flow →
                  </EmptyAction>
                </EmptyState>
              ) : (
                userFlows
                  .slice(0, 3)
                  .map((flow) => (
                    <FlowCard key={flow.id} flow={flow} userID={user.id} />
                  ))
              )}
            </Section>
            {posts.length > 0 && (
              <Section>
                <SectionTitle>Posts Recentes</SectionTitle>
                {posts.slice(0, 2).map((post) => (
                  <CommunityPost
                    key={post.id}
                    post={post}
                    onVote={handleVote}
                    onSave={handleSavePost}
                    currentUserId={user.id}
                  />
                ))}
              </Section>
            )}
          </>
        )}

        {activeTab === "flows" && (
          <Section>
            {userFlows.length === 0 ? (
              <EmptyState>
                <EmptyText>Você ainda não criou nenhum flow</EmptyText>
                <EmptyAction onClick={() => navigate("/criar-flow")}>
                  Criar flow →
                </EmptyAction>
              </EmptyState>
            ) : (
              userFlows.map((flow) => (
                <FlowCard key={flow.id} flow={flow} userID={user.id} />
              ))
            )}
          </Section>
        )}

        {activeTab === "forks" && (
          <Section>
            {userForks.length === 0 ? (
              <EmptyState>
                <EmptyText>Você ainda não derivou nenhum flow</EmptyText>
                <EmptyAction onClick={() => navigate("/feed")}>
                  Explorar flows →
                </EmptyAction>
              </EmptyState>
            ) : (
              userForks.map((flow) => (
                <FlowCard key={flow.id} flow={flow} userID={user.id} />
              ))
            )}
          </Section>
        )}

        {activeTab === "salvos" && (
          <Section>
            {savedFlows.length === 0 ? (
              <EmptyState>
                <EmptyText>Nenhum flow salvo ainda</EmptyText>
                <EmptyAction onClick={() => navigate("/feed")}>
                  Explorar flows →
                </EmptyAction>
              </EmptyState>
            ) : (
              savedFlows.map((flow) => (
                <FlowCard key={flow.id} flow={flow} userID={user.id} />
              ))
            )}
          </Section>
        )}

        {activeTab === "posts" && (
          <Section>
            {posts.length === 0 ? (
              <EmptyState>
                <EmptyText>Nenhum post criado ainda</EmptyText>
                <EmptyAction onClick={() => navigate("/comunidade")}>
                  Ir para comunidade →
                </EmptyAction>
              </EmptyState>
            ) : (
              posts.map((post) => (
                <CommunityPost
                  key={post.id}
                  post={post}
                  onVote={handleVote}
                  onSave={handleSavePost}
                  currentUserId={user.id}
                />
              ))
            )}
          </Section>
        )}
      </TabContent>
    </PageContainer>
  );
}
