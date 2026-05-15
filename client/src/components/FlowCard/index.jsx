import { GitFork, Eye, GitBranch, Ellipsis } from "lucide-react";
import LikeButton from "./Actions/LikeButton";
import CommentButton from "./Actions/CommentButton";
import SaveButton from "./Actions/SaveButton";
import ShareButton from "./Actions/ShareButton";
import OpenFlowButton from "./Actions/OpenFlowButton";

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
    <div className="group w-full bg-white border border-black/[0.07] rounded-[14px] p-5 flex flex-col gap-2.5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">

      {/* Category pill */}
      <div className="inline-flex items-center self-start text-[10.5px] font-semibold tracking-wide uppercase text-brand bg-brand-light border border-brand/[0.15] rounded-md px-2 py-0.5 leading-none">
        {flow.categoria || "Sem categoria"}
      </div>

      {/* Header: avatar + author info + options */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-light border border-brand/[0.15] text-brand font-semibold text-[11px] flex items-center justify-center">
          {getIniciais(flow.usuario?.nome)}
        </div>
        <div className="flex flex-col flex-1 min-w-0 gap-px">
          <span className="text-[#1D1D1F] font-semibold text-[13px] truncate tracking-[-0.01em]">
            {flow.usuario?.nome || "Usuário"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[11.5px] text-[#6E6E73]">
              {flow.usuario?.cargo || "Colaborador"}
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#AEAEB2] flex-shrink-0" />
            <span className="text-[11.5px] text-[#AEAEB2]">
              {getDaysAgo(flow.criado_em)}
            </span>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center bg-transparent text-[#AEAEB2] hover:bg-[#F5F5F7] hover:text-[#6E6E73] transition-colors ml-auto flex-shrink-0 cursor-pointer border-0">
          <Ellipsis size={15} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-1.5">
        {(isFork || isPublished) && (
          <div className="flex items-center gap-1">
            {isFork && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100">
                <GitFork size={10} />
                Fork
              </span>
            )}
            {isPublished && (
              <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                Publicado
              </span>
            )}
          </div>
        )}

        <h2 className="font-serif text-[17px] font-semibold text-[#1D1D1F] leading-[1.35] tracking-[-0.01em] group-hover:text-brand transition-colors duration-150">
          {flow.titulo}
        </h2>

        {flow.descricao && (
          <p className="text-[13.5px] text-[#6E6E73] leading-relaxed line-clamp-2">
            {flow.descricao}
          </p>
        )}

        {Array.isArray(flow.tags) && flow.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {flow.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-[#F5F5F7] text-[#6E6E73] border border-black/[0.06] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-0.5">
          <span className="inline-flex items-center gap-1 text-[11.5px] text-[#AEAEB2]">
            <GitBranch size={12} />
            {flow.conteudo_nos?.length || 0}
            {(flow.conteudo_nos?.length || 0) !== 1 ? " nós" : " nó"}
          </span>
          <span className="inline-flex items-center gap-1 text-[11.5px] text-[#AEAEB2]">
            <Eye size={12} />
            {flow.visualizacoes ?? 0}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black/[0.06]" />

      {/* Footer: action buttons */}
      <div className="flex items-center gap-0.5">
        <LikeButton likes={flow.stats?.likes || 0} flowId={flow.id} />
        <CommentButton comments={flow.stats?.comments || 0} />
        <SaveButton saves={flow.stats?.saves || 0} flowId={flow.id} />
        <ShareButton flowID={flow.id} />
        <OpenFlowButton flowID={flow.id} />
      </div>
    </div>
  );
}
