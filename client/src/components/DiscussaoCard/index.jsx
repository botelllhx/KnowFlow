import { useNavigate } from "react-router-dom";
import { MessageSquare, ChevronRight } from "lucide-react";

import {
  CardWrapper,
  CardHeader,
  CardMeta,
  AuthorName,
  Dot,
  TimeAgo,
  NoBadge,
  CardBody,
  CardTitle,
  CardExcerpt,
  CardFooter,
  CategoryTag,
  OpenLink,
} from "./style";

const getDaysAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 60000);
  if (diff < 1) return "Agora mesmo";
  if (diff < 60) return `${diff}min atrás`;
  const h = Math.floor(diff / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Há 1 dia";
  if (d < 7) return `${d} dias atrás`;
  if (d < 30) return `${Math.floor(d / 7)}sem atrás`;
  return `${Math.floor(d / 30)}m atrás`;
};

export default function DiscussaoCard({ post }) {
  const navigate = useNavigate();

  return (
    <CardWrapper onClick={() => navigate(`/post/${post.id}`)}>
      <CardHeader>
        <CardMeta>
          <AuthorName>{post.usuario?.nome || "Colaborador"}</AuthorName>
          <Dot />
          <TimeAgo>{getDaysAgo(post.criado_em)}</TimeAgo>
        </CardMeta>
        <NoBadge>
          <MessageSquare size={11} />
          Sem resposta
        </NoBadge>
      </CardHeader>

      <CardBody>
        <CardTitle>{post.titulo}</CardTitle>
        {post.conteudo && <CardExcerpt>{post.conteudo}</CardExcerpt>}
      </CardBody>

      <CardFooter>
        {post.categoria && <CategoryTag>{post.categoria}</CategoryTag>}
        <OpenLink>
          Ver discussão <ChevronRight size={13} />
        </OpenLink>
      </CardFooter>
    </CardWrapper>
  );
}
