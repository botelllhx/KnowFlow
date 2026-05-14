import ComponentDivider from "../ComponentDivider/Index";
import LikeButton from "./Actions/LikeButton";
import CommentButton from "./Actions/CommentButton";
import SaveButton from "./Actions/SaveButton";
import ShareButton from "./Actions/ShareButton";
import OpenFlowButton from "./Actions/OpenFlowButton";
import { GitFork } from "lucide-react";

import {
  FlowCardContainer,
  FlowWrapper,
  FlowHat,
  FlowHeader,
  Avatar,
  FlowAuthor,
  AuthorRole,
  DaysPublished,
  ActionButton,
  ActionIcon,
  FlowPreviewWrapper,
  FlowFooter,
  AuthorInfo,
  FlowDetails,
  Dot,
  FlowDescription,
  FlowTitle,
  FlowTags,
  Tag,
  FlowNodes,
  NodeIcon,
  FlowViews,
  FlowMacro,
  ViewIcon,
  ForkBadge,
  StatusBadge,
  MetaBadges,
} from "./style";

export default function FlowCard({ flow }) {
  const getIniciais = (nome) => {
    if (!nome) return "?";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0][0].toUpperCase();
    return partes[0][0].toUpperCase() + partes[partes.length - 1][0].toUpperCase();
  };

  const getDaysAgo = (publishDate) => {
    if (!publishDate) return "";
    const now = new Date();
    const date = new Date(publishDate);
    const diffMs = Math.abs(now - date);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Agora mesmo";
    if (diffMinutes < 60) return `${diffMinutes}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Há 1 dia";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m atrás`;
    return `${Math.floor(diffDays / 365)}a atrás`;
  };

  const isFork = !!flow.fork_de;
  const isPublished = flow.status === "publicado";

  return (
    <FlowCardContainer>
      <FlowWrapper>
        <FlowHat>{flow.categoria || "Sem categoria"}</FlowHat>
        <FlowHeader>
          <Avatar>{getIniciais(flow.usuario?.nome)}</Avatar>
          <AuthorInfo>
            <FlowAuthor>{flow.usuario?.nome || "Usuário"}</FlowAuthor>
            <FlowDetails>
              <AuthorRole>{flow.usuario?.cargo || "Colaborador"}</AuthorRole>
              <Dot />
              <DaysPublished>{getDaysAgo(flow.criado_em)}</DaysPublished>
            </FlowDetails>
          </AuthorInfo>
          <ActionButton aria-label="Opções">
            <ActionIcon />
          </ActionButton>
        </FlowHeader>

        <FlowPreviewWrapper>
          <MetaBadges>
            {isFork && (
              <ForkBadge title="Derivado de outro flow">
                <GitFork size={11} />
                Fork
              </ForkBadge>
            )}
            {isPublished && <StatusBadge>Publicado</StatusBadge>}
          </MetaBadges>

          <FlowTitle>{flow.titulo}</FlowTitle>
          {flow.descricao && (
            <FlowDescription>{flow.descricao}</FlowDescription>
          )}
          <FlowTags>
            {Array.isArray(flow.tags) &&
              flow.tags.length > 0 &&
              flow.tags.map((tag, index) => <Tag key={index}>#{tag}</Tag>)}
          </FlowTags>

          <FlowMacro>
            <FlowNodes>
              <NodeIcon />
              {flow.conteudo_nos?.length || 0}
              {(flow.conteudo_nos?.length || 0) !== 1 ? " nós" : " nó"}
            </FlowNodes>
            <FlowViews>
              <ViewIcon />
              {flow.visualizacoes ?? 0}
            </FlowViews>
          </FlowMacro>
        </FlowPreviewWrapper>

        <ComponentDivider />

        <FlowFooter>
          <LikeButton likes={flow.stats?.likes || 0} flowId={flow.id} />
          <CommentButton comments={flow.stats?.comments || 0} />
          <SaveButton saves={flow.stats?.saves || 0} flowId={flow.id} />
          <ShareButton flowID={flow.id} />
          <OpenFlowButton flowID={flow.id} />
        </FlowFooter>
      </FlowWrapper>
    </FlowCardContainer>
  );
}
