import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import api from '../../services/api';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    Eye,
    Play,
    X,
    Send,
    Copy,
    Image as ImageIcon,
    Users,
    Edit,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    History,
    Zap,
    Video,
    CheckSquare,
    Music,
} from 'lucide-react';
import TextNode from '../../components/TextNode';
import DecisionNode from '../../components/DecisionNode';
import MediaNode from '../../components/MediaNode';
import VideoNode from '../../components/VideoNode';
import ChecklistNode from '../../components/ChecklistNode';
import AudioNode from '../../components/AudioNode';
import renderMarkdown from '../../utils/renderMarkdown';
import RelatedFlows from '../../components/RelatedFlows';
import * as S from './style';

// Função para avatar iniciais
const getIniciais = (nome) => {
    if (!nome) return '??';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
};

const InitialsAvatar = ({ children }) => (
    <div
        style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#64748B',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
        }}
    >
        {children}
    </div>
);

const HotspotMarker = ({ hotspot, index }) => {
    const [showTooltip, setShowTooltip] = React.useState(false);
    return (
        <div
            style={{ position: 'absolute', left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#233DFF', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
                {index + 1}
            </div>
            {showTooltip && (hotspot.label || hotspot.description) && (
                <div style={{ position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)', background: '#1a1a2e', color: '#fff', borderRadius: 8, padding: '8px 12px', minWidth: 140, maxWidth: 220, boxShadow: '0 4px 16px rgba(0,0,0,0.3)', fontSize: 13, zIndex: 20, pointerEvents: 'none' }}>
                    {hotspot.label && <div style={{ fontWeight: 600, marginBottom: 2 }}>{hotspot.label}</div>}
                    {hotspot.description && <div style={{ opacity: 0.75, fontSize: 12 }}>{hotspot.description}</div>}
                </div>
            )}
        </div>
    );
};

const FlowViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flow, setFlow] = useState(null);
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(true);
    const [stats, setStats] = useState({ likes: 0, comments: 0, saves: 0, views: 0 });
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const usuarioId = localStorage.getItem('usuarioId');

    // Checklist local state for interactive modal
    const [checklistState, setChecklistState] = useState([]);

    // Execution mode state
    const [execMode, setExecMode] = useState(false);
    const [execucao, setExecucao] = useState(null);
    const [etapas, setEtapas] = useState({});
    const [execNodeDialog, setExecNodeDialog] = useState(null);
    const [etapaObs, setEtapaObs] = useState('');
    const [execLoading, setExecLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    const nodeTypes = useMemo(
        () => ({
            textNode: TextNode,
            decisionNode: DecisionNode,
            mediaNode: MediaNode,
            videoNode: VideoNode,
            checklistNode: ChecklistNode,
            audioNode: AudioNode,
        }),
        []
    );

    const displayNodes = useMemo(() => {
        if (!execMode) return nodes;
        return nodes.map((node) => {
            const done = etapas[node.id]?.status === 'concluido';
            return {
                ...node,
                style: {
                    ...node.style,
                    outline: done ? '2.5px solid #00c98d' : '2.5px solid rgba(156,163,175,0.5)',
                    borderRadius: '12px',
                    boxShadow: done ? '0 0 12px rgba(0,201,141,0.3)' : 'none',
                },
            };
        });
    }, [execMode, nodes, etapas]);

    const execProgress = useMemo(() => {
        const total = nodes.length;
        if (!total) return 0;
        const done = Object.values(etapas).filter((e) => e.status === 'concluido').length;
        return Math.round((done / total) * 100);
    }, [nodes, etapas]);

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const flowResponse = await api.get(
                    `/flow/${id}`
                );
                const flowData = flowResponse.data;
                const mappedFlow = {
                    ...flowData,
                    createdAt: flowData.criado_em,
                    autor: {
                        ...flowData.usuario,
                        empresa: flowData?.usuario?.empresa || 'Sem empresa',
                        cargo: flowData?.usuario?.cargo || 'Sem cargo',
                        avatar: flowData?.usuario?.avatar || null,
                        verificado: flowData?.usuario?.verificado || false,
                        username: flowData?.usuario?.username || flowData?.usuario?.email?.split('@')[0] || 'usuário',
                        seguidores: flowData?.usuario?.seguidores || [],
                    },
                };
                setFlow(mappedFlow);
                setNodes(flowData.conteudo_nos || []);
                setEdges(flowData.conteudo_conexoes || []);

                const mappedComments = flowData.comentarios?.map((comment) => ({
                    id: comment.id,
                    author: comment?.usuario?.nome || 'Usuário desconhecido',
                    username: comment?.usuario?.email?.split('@')[0] || 'usuário',
                    avatar: comment?.usuario?.avatar || null,
                    role: comment?.usuario?.cargo || 'Usuário',
                    company: comment?.usuario?.empresa || '',
                    verified: comment?.usuario?.verificado || false,
                    content: comment.mensagem,
                    createdAt: comment.criado_em || new Date().toISOString(),
                    likes: comment.likes || 0,
                    replies: comment.replies || 0,
                    isLiked: comment.isLiked || false,
                    isHelpful: comment.isHelpful || false,
                    usuario_id: comment.usuario_id,
                })) || [];
                setComments(mappedComments);

                setStats({
                    likes: flowData.stats?.likes || 0,
                    comments: flowData.comentarios?.length || 0,
                    saves: flowData.stats?.saves || 0,
                    views: flowData.stats?.views || 0,
                });

                // Buscar curtidas
                try {
                    const curtidasResponse = await api.get('/curtidas');
                    const userLiked = curtidasResponse.data.some(
                        (curtida) => String(curtida?.usuario_id) === String(usuarioId) && String(curtida?.flow_id) === String(id)
                    );
                    const likeCount = curtidasResponse.data.filter((curtida) => String(curtida?.flow_id) === String(id)).length;
                    setIsLiked(userLiked);
                    setStats((prev) => ({ ...prev, likes: likeCount }));
                } catch (curtidasError) {
                    console.error('Erro ao buscar curtidas:', curtidasError);
                    toast.error('Erro ao carregar curtidas.');
                }

                // Buscar Flows salvos
                try {
                    const salvosResponse = await api.get(`/flowsalvos?usuario_id=${usuarioId}`);
                    const userSaved = salvosResponse.data.some(
                        (salvo) => String(salvo?.usuario_id) === String(usuarioId) && String(salvo?.flow_id) === String(id)
                    );
                    const saveCount = salvosResponse.data.filter((salvo) => String(salvo?.flow_id) === String(id)).length;
                    setIsSaved(userSaved);
                    setStats((prev) => ({ ...prev, saves: saveCount }));
                } catch (salvosError) {
                    console.error('Erro ao buscar Flows salvos:', salvosError);
                    toast.error('Erro ao carregar Flows salvos.');
                }
            } catch (flowError) {
                console.error('Erro ao buscar Flow:', flowError);
                toast.error('Erro ao carregar o Flow.');
            }
        };
        fetchFlow();
    }, [id, usuarioId, setNodes, setEdges]);

    const getYouTubeId = (url) => {
        const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const onNodeClick = useCallback((event, node) => {
        if (execMode) {
            setExecNodeDialog(node);
            setEtapaObs(etapas[node.id]?.observacao || '');
            return;
        }
        setSelectedNode(node);
        if (node.type === 'checklistNode') {
            setChecklistState((node.data.items || []).map((item) => ({ ...item })));
        }
        setIsNodeModalOpen(true);
        // fire-and-forget — não bloqueia UX
        api.post('/analytics/evento', { flow_id: id, no_id: node.id }).catch(() => {});
    }, [execMode, etapas, id]);

    const handleStartExec = async () => {
        if (!usuarioId) {
            toast.error('Faça login para executar este Flow.');
            return;
        }
        try {
            setExecLoading(true);
            const { data } = await api.post('/execucao', { flow_id: id });
            setExecucao(data);
            setEtapas({});
            setExecMode(true);
            toast.success('Execução iniciada!');
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Erro ao iniciar execução.');
        } finally {
            setExecLoading(false);
        }
    };

    const handleExitExec = () => {
        setExecMode(false);
        setExecucao(null);
        setEtapas({});
        setExecNodeDialog(null);
    };

    const handleConcluirEtapa = async () => {
        if (!execucao || !execNodeDialog) return;
        try {
            setExecLoading(true);
            const { data } = await api.patch(
                `/execucao/${execucao.id}/etapas/${execNodeDialog.id}`,
                { observacao: etapaObs }
            );
            setEtapas((prev) => ({ ...prev, [execNodeDialog.id]: data }));
            setExecNodeDialog(null);
            setEtapaObs('');
            toast.success('Etapa concluída!');
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Erro ao concluir etapa.');
        } finally {
            setExecLoading(false);
        }
    };

    const handleConcluirExecucao = async () => {
        if (!execucao) return;
        try {
            setExecLoading(true);
            await api.patch(`/execucao/${execucao.id}/concluir`);
            toast.success('Execução concluída!');
            handleExitExec();
        } catch (error) {
            toast.error(error.response?.data?.erro || 'Erro ao concluir execução.');
        } finally {
            setExecLoading(false);
        }
    };

    const handleCancelarExecucao = async () => {
        if (!execucao) return;
        try {
            await api.patch(`/execucao/${execucao.id}/cancelar`);
        } catch (_) {}
        handleExitExec();
    };

    const fetchHistory = async () => {
        try {
            const { data } = await api.get(`/execucao?flow_id=${id}`);
            setHistory(data);
            setShowHistory(true);
        } catch (error) {
            toast.error('Erro ao carregar histórico.');
        }
    };

    const handleLike = async () => {
        if (!usuarioId) {
            toast.error('Faça login para curtir o Flow.');
            return;
        }
        try {
            if (isLiked) {
                try {
                    await api.delete(`/curtidas/${usuarioId}/${id}`);
                    setIsLiked(false);
                    setStats((prev) => ({ ...prev, likes: prev?.likes - 1 }));
                    toast.success('Curtida removida!');
                } catch (error) {
                    console.error('Erro ao remover curtida:', error.response?.data || error);
                    toast.error(error.response?.data?.erro || 'Erro ao remover a curtida.');
                }
            } else {
                await api.post('/curtidas', {
                    flow_id: id,
                });
                setIsLiked(true);
                setStats((prev) => ({ ...prev, likes: prev?.likes + 1 }));
                toast.success('Flow curtido!');
            }
        } catch (error) {
            console.error('Erro ao processar curtida:', error.response?.data || error);
            toast.error(error.response?.data?.erro || 'Erro ao curtir o Flow.');
        }
    };

    const handleSave = async () => {
        if (!usuarioId) {
            toast.error('Faça login para salvar o Flow.');
            return;
        }
        try {
            if (isSaved) {
                try {
                    await api.delete(`/flowsalvos/${usuarioId}/${id}`);
                    setIsSaved(false);
                    setStats((prev) => ({ ...prev, saves: prev?.saves - 1 }));
                    toast.success('Removido dos salvos!');
                } catch (error) {
                    console.error('Erro ao remover Flow salvo:', error.response?.data || error);
                    toast.error(error.response?.data?.erro || 'Erro ao remover o Flow salvo.');
                }
            } else {
                await api.post('/flowsalvos', {
                    usuarioId,
                    flowId: id,
                });
                setIsSaved(true);
                setStats((prev) => ({ ...prev, saves: prev?.saves + 1 }));
                toast.success('Flow salvo!');
            }
        } catch (error) {
            console.error('Erro ao processar Flow salvo:', error.response?.data || error);
            toast.error(error.response?.data?.erro || 'Erro ao salvar o Flow.');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado!');
    };

    const handleDeleteFlow = async () => {
        try {
            await api.delete(`/flow/${id}`);
            toast.success('Flow deletado com sucesso!');
            setIsDeleteModalOpen(false);
            navigate('/feed');
        } catch (error) {
            console.error('Erro ao deletar Flow:', error);
            toast.error(error.response?.data?.erro || 'Erro ao deletar o Flow.');
            setIsDeleteModalOpen(false);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) {
            toast.error('O comentário não pode estar vazio.');
            return;
        }
        try {
            const response = await api.post(
                '/comentario',
                {
                    mensagem: newComment,
                    flow_id: id,
                }
            );
            const newCommentData = response.data;
            const mappedComment = {
                id: newCommentData.id,
                author: newCommentData?.usuario?.nome || 'Você',
                username: newCommentData?.usuario?.email?.split('@')[0] || 'usuario.atual',
                avatar: newCommentData?.usuario?.avatar || null,
                role: newCommentData?.usuario?.cargo || 'Usuário',
                company: newCommentData?.usuario?.empresa || '',
                verified: newCommentData?.usuario?.verificado || false,
                content: newCommentData?.mensagem,
                createdAt: newCommentData?.criado_em || new Date().toISOString(),
                likes: 0,
                replies: 0,
                isLiked: false,
                isHelpful: false,
                usuario_id: newCommentData?.usuario_id,
            };
            setComments([mappedComment, ...comments]);
            setNewComment('');
            setStats((prev) => ({ ...prev, comments: prev.comments + 1 }));
            toast.success('Comentário adicionado!');
        } catch (error) {
            console.error('Erro ao adicionar comentário:', error);
            toast.error(error.response?.data?.erro || 'Erro ao adicionar comentário.');
        }
    };

    const handleStartEdit = (comment) => {
        setEditingCommentId(comment.id);
        setEditedComment(comment.content);
    };

    const handleEditComment = async (commentId) => {
        if (!editedComment.trim()) {
            toast.error('O comentário não pode estar vazio.');
            return;
        }
        try {
            await api.put(
                `/comentario/${commentId}`,
                {
                    mensagem: editedComment,
                }
            );
            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === commentId ? { ...comment, content: editedComment } : comment
                )
            );
            setEditingCommentId(null);
            setEditedComment('');
            toast.success('Comentário atualizado!');
        } catch (error) {
            console.error('Erro ao editar comentário:', error);
            toast.error(error.response?.data?.erro || 'Erro ao editar comentário.');
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditedComment('');
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(
                `/comentario/${commentId}`
            );
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
            setStats((prev) => ({ ...prev, comments: prev.comments - 1 }));
            toast.success('Comentário deletado!');
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            toast.error(error.response?.data?.erro || 'Erro ao deletar comentário.');
        }
    };

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Data inválida';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data inválida';
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        if (diffInHours < 1) return 'Agora';
        if (diffInHours < 24) return `${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    if (!flow) return <S.Loading>Carregando...</S.Loading>;

    return (
        <S.Container>
            <S.Header>
                <S.HeaderContent>
                    <S.BackButton onClick={() => navigate('/feed')}>
                        <ArrowLeft size={16} />
                        Voltar ao Feed
                    </S.BackButton>
                    <S.TitleWrapper>
                        <S.Title>{flow.titulo}</S.Title>
                        <S.Subtitle>
                            por {flow.autor?.nome || 'Autor desconhecido'} • {flow.autor?.empresa} •{' '}
                            {formatTimeAgo(flow.createdAt)}
                        </S.Subtitle>
                    </S.TitleWrapper>
                    <S.HeaderActions>
                        <S.ActionButton $active={isLiked} onClick={handleLike} $variant="like">
                            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                            {formatNumber(stats.likes)}
                        </S.ActionButton>
                        <S.ActionButton onClick={() => setShowComments(!showComments)} $variant="comment">
                            <MessageCircle size={16} />
                            {formatNumber(stats.comments)}
                        </S.ActionButton>
                        <S.ActionButton $active={isSaved} onClick={handleSave} $variant="save">
                            <Bookmark size={16} className={isSaved ? 'fill-current' : ''} />
                            {isSaved ? 'Salvo' : 'Salvar'} ({formatNumber(stats.saves)})
                        </S.ActionButton>
                        <S.ActionButton onClick={handleShare} $variant="share">
                            <Share2 size={16} />
                            Compartilhar
                        </S.ActionButton>
                    </S.HeaderActions>
                </S.HeaderContent>
            </S.Header>
            <S.Main>
                <S.FlowSection>
                    <S.Card>
                        <S.CardHeader>
                            <S.CardTitle>
                                <Play size={20} color="#233DFF" />
                                Flow Interativo
                            </S.CardTitle>
                            <S.CardDescription>
                                Clique nos nós para explorar o conteúdo • Use os controles para navegar
                            </S.CardDescription>
                        </S.CardHeader>
                        <S.CardContent>
                            <S.Canvas style={execMode ? { paddingTop: '44px', paddingRight: '320px' } : {}}>
                                <ReactFlow
                                    nodes={displayNodes}
                                    edges={edges}
                                    onNodeClick={onNodeClick}
                                    nodeTypes={nodeTypes}
                                    fitView
                                    nodesDraggable={false}
                                    nodesConnectable={false}
                                    elementsSelectable
                                    minZoom={0.3}
                                    maxZoom={1.5}
                                    defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
                                >
                                    <Controls />
                                    <MiniMap nodeColor="#233DFF" />
                                    <Background variant="dots" gap={24} size={1} />
                                </ReactFlow>
                            </S.Canvas>
                        </S.CardContent>
                    </S.Card>
                    {showComments && (
                        <S.Card id="comments">
                            <S.CardHeader>
                                <S.CardTitle>
                                    <MessageCircle size={20} color="#6366F1" />
                                    Comentários ({stats.comments})
                                </S.CardTitle>
                            </S.CardHeader>
                            <S.CardContent>
                                <S.CommentForm>
                                    <S.Textarea
                                        placeholder="Compartilhe sua experiência, dúvidas ou sugestões..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={3}
                                    />
                                    <S.CommentActions>
                                        <S.CommentHint>
                                            Seja construtivo e respeitoso. Sua contribuição ajuda a comunidade!
                                        </S.CommentHint>
                                        <S.SubmitButton onClick={handleAddComment} disabled={!newComment.trim()}>
                                            <Send size={16} />
                                            Comentar
                                        </S.SubmitButton>
                                    </S.CommentActions>
                                </S.CommentForm>
                                <S.CommentList>
                                    {comments.map((comment) => (
                                        <S.Comment key={comment.id}>
                                            <S.Avatar>
                                                {comment.avatar ? (
                                                    <img src={comment.avatar} alt={comment.author} />
                                                ) : (
                                                    <InitialsAvatar>{getIniciais(comment.author)}</InitialsAvatar>
                                                )}
                                                {comment.verified && <S.VerifiedBadge>✓</S.VerifiedBadge>}
                                            </S.Avatar>
                                            <S.CommentContent>
                                                <S.CommentHeader>
                                                    <S.CommentAuthor>{comment.author}</S.CommentAuthor>
                                                    <S.CommentMeta>
                                                        {comment.role} {comment.company && `• ${comment.company}`}
                                                    </S.CommentMeta>
                                                    <S.CommentTime>{formatTimeAgo(comment.createdAt)}</S.CommentTime>
                                                </S.CommentHeader>
                                                {editingCommentId === comment.id ? (
                                                    <div>
                                                        <S.Textarea
                                                            value={editedComment}
                                                            onChange={(e) => setEditedComment(e.target.value)}
                                                            rows={3}
                                                        />
                                                        <S.CommentsActions>
                                                            <S.Button
                                                                onClick={() => handleEditComment(comment.id)}
                                                                disabled={!editedComment.trim()}
                                                            >
                                                                Salvar
                                                            </S.Button>
                                                            <S.Button $variant="outline" onClick={handleCancelEdit}>
                                                                Cancelar
                                                            </S.Button>
                                                        </S.CommentsActions>
                                                    </div>
                                                ) : (
                                                    <S.CommentText>{comment.content}</S.CommentText>
                                                )}
                                                <S.CommentsActions>
                                                    {String(comment?.usuario_id) === String(usuarioId) && (
                                                        <>
                                                            <S.ActionButton
                                                                $variant="commentEdit"
                                                                onClick={() => handleStartEdit(comment)}
                                                                $compact
                                                            >
                                                                <Edit size={14} />
                                                            </S.ActionButton>
                                                            <S.ActionButton
                                                                $variant="commentDelete"
                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                $compact
                                                            >
                                                                <Trash2 size={14} />
                                                            </S.ActionButton>
                                                        </>
                                                    )}
                                                </S.CommentsActions>
                                            </S.CommentContent>
                                        </S.Comment>
                                    ))}
                                </S.CommentList>
                            </S.CardContent>
                        </S.Card>
                    )}
                </S.FlowSection>
                <S.Sidebar>
                    <S.Card>
                        <S.CardHeader>
                            <S.CardTitle>
                                <Eye size={20} color="#8B5CF6" />
                                Sobre este Flow
                            </S.CardTitle>
                        </S.CardHeader>
                        <S.CardContent>
                            <S.Description>{flow.descricao}</S.Description>
                            <S.InfoList>
                                <S.InfoItem>
                                </S.InfoItem>
                            </S.InfoList>
                            <S.Tags>
                                <S.Tag isCategory>{flow.categoria}</S.Tag>
                                {flow.tags?.map((tag) => (
                                    <S.Tag key={tag}>#{tag}</S.Tag>
                                ))}
                            </S.Tags>
                        </S.CardContent>
                    </S.Card>
                    <S.Card>
                        <S.CardHeader>
                            <S.CardTitle>
                                <Users size={20} color="#10B981" />
                                Autor
                            </S.CardTitle>
                        </S.CardHeader>
                        <S.CardContent>
                            <S.AuthorCard>
                                <S.Avatar>
                                    {flow.autor?.avatar ? (
                                        <img src={flow.autor.avatar} alt={flow.autor?.nome || 'Autor'} />
                                    ) : (
                                        <InitialsAvatar>{getIniciais(flow.autor?.nome)}</InitialsAvatar>
                                    )}
                                    {flow.autor?.verificado && <S.VerifiedBadge>✓</S.VerifiedBadge>}
                                </S.Avatar>
                                <S.AuthorInfo>
                                    <S.AuthorName>{flow.autor?.nome || 'Autor desconhecido'}</S.AuthorName>
                                    <S.AuthorRole>{flow.autor?.cargo}</S.AuthorRole>
                                    <S.AuthorCompany>{flow.autor?.empresa}</S.AuthorCompany>
                                    <S.AuthorFollowers>
                                    </S.AuthorFollowers>
                                </S.AuthorInfo>
                            </S.AuthorCard>
                        </S.CardContent>
                    </S.Card>
                    <S.Card>
                        <S.CardHeader>
                            <S.CardTitle>
                                <Zap size={20} color="#233DFF" />
                                Executar Flow
                            </S.CardTitle>
                        </S.CardHeader>
                        <S.CardContent>
                            <S.Button
                                onClick={handleStartExec}
                                disabled={execLoading}
                                style={{ background: 'linear-gradient(135deg, #233dff, #7c3aed)', color: '#fff', border: 'none' }}
                            >
                                <Play size={16} style={{ marginRight: '8px' }} />
                                {execLoading ? 'Iniciando...' : 'Iniciar Execução'}
                            </S.Button>
                            <S.Button onClick={fetchHistory} style={{ marginTop: '10px' }}>
                                <History size={16} style={{ marginRight: '8px' }} />
                                Ver Histórico
                            </S.Button>
                        </S.CardContent>
                    </S.Card>
                    <S.Card>
                        <S.CardHeader>
                            <S.CardTitle>
                                <Copy size={20} color="#4B5563" />
                                Ações Rápidas
                            </S.CardTitle>
                        </S.CardHeader>
                        <S.CardContent>
                            <S.Button onClick={() => toast.info('Duplicando Flow...')}>
                                <Copy size={16} style={{ marginRight: '8px' }} />
                                Duplicar Flow
                            </S.Button>
                            {String(flow.criado_por) === String(usuarioId) && (
                                <>
                                    <S.Button onClick={() => navigate(`/editar-flow/${id}`)} style={{ marginTop: '12px' }}>
                                        <Edit size={16} style={{ marginRight: '8px' }} />
                                        Editar Flow
                                    </S.Button>
                                    <S.Button
                                        onClick={() => setIsDeleteModalOpen(true)}
                                        $variant="delete"
                                        style={{ marginTop: '12px' }}
                                    >
                                        <Trash2 size={16} style={{ marginRight: '8px' }} />
                                        Deletar Flow
                                    </S.Button>
                                </>
                            )}
                            <S.Button onClick={() => toast.info('Exportando Flow...')} style={{ marginTop: '12px' }}>
                                <Download size={16} style={{ marginRight: '8px' }} />
                                Exportar Flow
                            </S.Button>
                        </S.CardContent>
                    </S.Card>
                    <RelatedFlows flowId={id} />
                </S.Sidebar>
            </S.Main>
            {isNodeModalOpen && (
                <S.Modal>
                    <S.ModalContent>
                        <S.ModalHeader>
                            <S.ModalTitle>
                                {selectedNode?.data?.title ||
                                    (selectedNode?.type === 'textNode'
                                        ? 'Conteúdo'
                                        : selectedNode?.type === 'decisionNode'
                                            ? 'Decisão'
                                            : selectedNode?.type === 'mediaNode'
                                                ? 'Imagem'
                                                : selectedNode?.type === 'videoNode'
                                                    ? 'Vídeo'
                                                    : selectedNode?.type === 'checklistNode'
                                                        ? 'Checklist'
                                                        : selectedNode?.type === 'audioNode'
                                                            ? 'Áudio'
                                                            : 'Nó Desconhecido')}
                            </S.ModalTitle>
                            <S.ModalDescription>
                                {selectedNode?.type === 'textNode' && 'Visualize o conteúdo do nó de texto'}
                                {selectedNode?.type === 'decisionNode' && 'Explore as opções de decisão'}
                                {selectedNode?.type === 'mediaNode' && 'Visualize a imagem associada'}
                                {selectedNode?.type === 'videoNode' && 'Assista ao vídeo associado'}
                                {selectedNode?.type === 'checklistNode' && 'Acompanhe e marque os itens do checklist'}
                                {selectedNode?.type === 'audioNode' && 'Ouça o áudio associado'}
                                {!selectedNode?.type && 'Tipo de nó não identificado'}
                            </S.ModalDescription>
                            <S.CloseButton onClick={() => setIsNodeModalOpen(false)}>
                                <X size={16} />
                            </S.CloseButton>
                        </S.ModalHeader>
                        <S.ModalBody key={selectedNode?.id}>
                            {!selectedNode?.data && (
                                <S.TextContent>Nenhum dado disponível para este nó.</S.TextContent>
                            )}
                            {selectedNode?.type === 'textNode' && (
                                <S.TextContent data-testid="text-node-content">
                                    {selectedNode.data?.content ? renderMarkdown(selectedNode.data.content) : 'Conteúdo não disponível.'}
                                </S.TextContent>
                            )}
                            {selectedNode?.type === 'decisionNode' && (
                                <S.DecisionContent data-testid="decision-node-content">
                                    <S.DecisionQuestion>
                                        {selectedNode.data?.question || 'Pergunta não disponível.'}
                                    </S.DecisionQuestion>
                                    <S.OptionList>
                                        {selectedNode?.data?.options?.length ? (
                                            selectedNode.data.options.map((option, index) => (
                                                <S.OptionButton key={option} onClick={() => setIsNodeModalOpen(false)}>
                                                    <S.OptionNumber>{index + 1}</S.OptionNumber>
                                                    {option}
                                                </S.OptionButton>
                                            ))
                                        ) : (
                                            <S.TextContent>Sem opções disponíveis.</S.TextContent>
                                        )}
                                    </S.OptionList>
                                </S.DecisionContent>
                            )}
                            {selectedNode?.type === 'mediaNode' && (
                                <S.MediaContent data-testid="media-node-content">
                                    <S.MediaHeader>
                                        <S.MediaIcon>
                                            <ImageIcon size={24} color="#ffffff" />
                                        </S.MediaIcon>
                                        <div>
                                            <S.MediaTitle>
                                                {selectedNode.data?.title || 'Imagem sem título'}
                                            </S.MediaTitle>
                                        </div>
                                    </S.MediaHeader>
                                    {selectedNode.data?.mediaUrl ? (
                                        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                            <img
                                                src={selectedNode.data.mediaUrl}
                                                alt={selectedNode.data.title || 'Imagem'}
                                                style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }}
                                            />
                                            {(selectedNode.data.hotspots || []).map((hs, i) => (
                                                <HotspotMarker key={hs.id} hotspot={hs} index={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <S.TextContent>Imagem não disponível.</S.TextContent>
                                    )}
                                    <S.MediaActions>
                                        <S.Button>Download Imagem</S.Button>
                                        <S.Button $variant="outline">Abrir</S.Button>
                                    </S.MediaActions>
                                </S.MediaContent>
                            )}
                            {selectedNode?.type === 'videoNode' && (() => {
                                const ytId = getYouTubeId(selectedNode.data?.videoUrl);
                                return (
                                    <S.MediaContent>
                                        <S.MediaHeader>
                                            <S.MediaIcon style={{ background: '#EF4444' }}>
                                                <Video size={24} color="#ffffff" />
                                            </S.MediaIcon>
                                            <div>
                                                <S.MediaTitle>
                                                    {selectedNode.data?.title || 'Vídeo sem título'}
                                                </S.MediaTitle>
                                            </div>
                                        </S.MediaHeader>
                                        {selectedNode.data?.videoUrl ? (
                                            ytId ? (
                                                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${ytId}`}
                                                        title={selectedNode.data?.title || 'Vídeo'}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                                    />
                                                </div>
                                            ) : (
                                                <video
                                                    controls
                                                    src={selectedNode.data.videoUrl}
                                                    style={{ width: '100%', borderRadius: '8px' }}
                                                />
                                            )
                                        ) : (
                                            <S.TextContent>URL de vídeo não disponível.</S.TextContent>
                                        )}
                                        {selectedNode.data?.description && (
                                            <S.TextContent style={{ marginTop: '12px' }}>
                                                {selectedNode.data.description}
                                            </S.TextContent>
                                        )}
                                    </S.MediaContent>
                                );
                            })()}
                            {selectedNode?.type === 'checklistNode' && (() => {
                                const doneCount = checklistState.filter((i) => i.done).length;
                                return (
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                            <CheckSquare size={18} color="#10B981" />
                                            <span style={{ fontWeight: 600, fontSize: 15, color: '#1E293B' }}>
                                                {selectedNode.data?.title || 'Checklist'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', background: '#D1FAE5', color: '#065F46', borderRadius: 10, fontSize: 12, fontWeight: 500, marginBottom: 14 }}>
                                            {doneCount}/{checklistState.length} concluídos
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {checklistState.length > 0 ? checklistState.map((item) => (
                                                <label
                                                    key={item.id}
                                                    style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: item.done ? '#94A3B8' : '#374151', textDecoration: item.done ? 'line-through' : 'none' }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.done}
                                                        onChange={() => setChecklistState((prev) =>
                                                            prev.map((i) => i.id === item.id ? { ...i, done: !i.done } : i)
                                                        )}
                                                        style={{ accentColor: '#10B981', width: 16, height: 16 }}
                                                    />
                                                    {item.label || 'Item sem título'}
                                                </label>
                                            )) : (
                                                <S.TextContent>Nenhum item no checklist.</S.TextContent>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}
                            {selectedNode?.type === 'audioNode' && (
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                        <Music size={18} color="#8B5CF6" />
                                        <span style={{ fontWeight: 600, fontSize: 15, color: '#1E293B' }}>{selectedNode.data?.title || 'Áudio'}</span>
                                    </div>
                                    {selectedNode.data?.audioUrl ? (
                                        <audio controls src={selectedNode.data.audioUrl} style={{ width: '100%', marginBottom: 10 }} />
                                    ) : (
                                        <S.TextContent>URL de áudio não disponível.</S.TextContent>
                                    )}
                                    {selectedNode.data?.description && (
                                        <S.TextContent style={{ marginTop: 8 }}>{selectedNode.data.description}</S.TextContent>
                                    )}
                                </div>
                            )}
                            {selectedNode?.type && !['textNode', 'decisionNode', 'mediaNode', 'videoNode', 'checklistNode', 'audioNode'].includes(selectedNode?.type) && (
                                <S.TextContent>Tipo de nó desconhecido: {selectedNode.type}</S.TextContent>
                            )}
                        </S.ModalBody>
                    </S.ModalContent>
                </S.Modal>
            )}
            {execMode && (
                <>
                    <S.ExecBanner>
                        <S.ExecBannerLeft>
                            <Play size={16} />
                            Modo Execução — {flow.titulo}
                        </S.ExecBannerLeft>
                        <S.ExecBannerRight>
                            <S.ExecBannerBtn onClick={handleConcluirExecucao} disabled={execLoading}>
                                <CheckCircle2 size={14} style={{ marginRight: 6 }} />
                                Concluir
                            </S.ExecBannerBtn>
                            <S.ExecBannerBtn className="danger" onClick={handleCancelarExecucao}>
                                <X size={14} style={{ marginRight: 6 }} />
                                Cancelar
                            </S.ExecBannerBtn>
                        </S.ExecBannerRight>
                    </S.ExecBanner>
                    <S.ExecPanel>
                        <S.ExecPanelHeader>
                            <S.ExecTitle>Progresso</S.ExecTitle>
                            <S.ExecProgressBar>
                                <S.ExecProgressFill $pct={execProgress} />
                            </S.ExecProgressBar>
                            <S.ExecProgressLabel>
                                {Object.values(etapas).filter((e) => e.status === 'concluido').length} de {nodes.length} etapas concluídas
                            </S.ExecProgressLabel>
                        </S.ExecPanelHeader>
                        <S.ExecNodeList>
                            {nodes.map((node) => {
                                const done = etapas[node.id]?.status === 'concluido';
                                const label = node.data?.title || node.data?.label || node.data?.question || 'Etapa';
                                return (
                                    <S.ExecNodeItem key={node.id} $done={done} onClick={() => { setExecNodeDialog(node); setEtapaObs(etapas[node.id]?.observacao || ''); }}>
                                        <S.ExecNodeDot $done={done} />
                                        <S.ExecNodeLabel $done={done}>{label}</S.ExecNodeLabel>
                                        {done && <CheckCircle2 size={14} color="#00c98d" />}
                                        {!done && <Clock size={14} color="rgba(255,255,255,0.3)" />}
                                    </S.ExecNodeItem>
                                );
                            })}
                        </S.ExecNodeList>
                        <S.ExecPanelFooter>
                            <S.ExecFinishBtn onClick={handleConcluirExecucao} disabled={execLoading}>
                                Concluir Execução
                            </S.ExecFinishBtn>
                        </S.ExecPanelFooter>
                    </S.ExecPanel>
                </>
            )}
            {execNodeDialog && (
                <S.ExecDialog>
                    <S.ExecDialogBox>
                        <S.ExecDialogTitle>
                            {etapas[execNodeDialog.id]?.status === 'concluido' ? '✓ ' : ''}
                            {execNodeDialog.data?.title || execNodeDialog.data?.question || 'Etapa'}
                        </S.ExecDialogTitle>
                        {execNodeDialog.data?.content && (
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>
                                {execNodeDialog.data.content}
                            </p>
                        )}
                        <div>
                            <S.ExecDialogLabel>Observação (opcional)</S.ExecDialogLabel>
                            <S.ExecDialogTextarea
                                value={etapaObs}
                                onChange={(e) => setEtapaObs(e.target.value)}
                                placeholder="Adicione uma nota sobre a conclusão desta etapa..."
                                rows={3}
                            />
                        </div>
                        <S.ExecDialogActions>
                            <S.ExecDialogBtn className="secondary" onClick={() => setExecNodeDialog(null)}>
                                Fechar
                            </S.ExecDialogBtn>
                            {etapas[execNodeDialog.id]?.status !== 'concluido' && (
                                <S.ExecDialogBtn className="primary" onClick={handleConcluirEtapa} disabled={execLoading}>
                                    {execLoading ? 'Salvando...' : 'Concluir Etapa'}
                                </S.ExecDialogBtn>
                            )}
                        </S.ExecDialogActions>
                    </S.ExecDialogBox>
                </S.ExecDialog>
            )}
            {showHistory && (
                <S.Modal>
                    <S.ModalContent>
                        <S.ModalHeader>
                            <S.ModalTitle>Histórico de Execuções</S.ModalTitle>
                            <S.CloseButton onClick={() => setShowHistory(false)}>
                                <X size={16} />
                            </S.CloseButton>
                        </S.ModalHeader>
                        <S.ModalBody>
                            {history.length === 0 ? (
                                <p style={{ color: '#6b7280', textAlign: 'center', padding: '24px 0' }}>
                                    Nenhuma execução registrada ainda.
                                </p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {history.map((exec) => (
                                        <S.ExecHistoryItem key={exec.id}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <S.ExecHistoryStatus $status={exec.status}>
                                                    {exec.status === 'concluida' ? 'Concluída' : exec.status === 'cancelada' ? 'Cancelada' : 'Em progresso'}
                                                </S.ExecHistoryStatus>
                                                <S.ExecHistoryMeta>
                                                    {exec.etapas?.length || 0} etapas registradas
                                                </S.ExecHistoryMeta>
                                            </div>
                                            <S.ExecHistoryMeta>
                                                Iniciado em {new Date(exec.iniciado_em).toLocaleString('pt-BR')}
                                                {exec.concluido_em && ` • Concluído em ${new Date(exec.concluido_em).toLocaleString('pt-BR')}`}
                                            </S.ExecHistoryMeta>
                                        </S.ExecHistoryItem>
                                    ))}
                                </div>
                            )}
                        </S.ModalBody>
                    </S.ModalContent>
                </S.Modal>
            )}
            {isDeleteModalOpen && (
                <S.Modal>
                    <S.ModalContent>
                        <S.ModalHeader>
                            <S.ModalTitle>Deletar Flow</S.ModalTitle>
                            <S.CloseButton onClick={() => setIsDeleteModalOpen(false)}>
                                <X size={16} />
                            </S.CloseButton>
                        </S.ModalHeader>
                        <S.ModalBody>
                            <p>Tem certeza que deseja deletar o Flow "{flow.titulo}"? Esta ação não pode ser desfeita.</p>
                        </S.ModalBody>
                        <S.ModalFooter>
                            <S.Button $variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancelar
                            </S.Button>
                            <S.Button $variant="delete" onClick={handleDeleteFlow}>
                                Deletar
                            </S.Button>
                        </S.ModalFooter>
                    </S.ModalContent>
                </S.Modal>
            )}
        </S.Container>
    );
};

export default FlowViewer;