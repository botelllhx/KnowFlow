import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { toast } from 'sonner';
import {
  Save,
  ArrowLeft,
  Type,
  GitBranch,
  ImageIcon,
  ChevronRight,
  ChevronLeft,
  Play,
  X,
  Plus,
  Minus,
  Upload,
  Sparkles,
  Zap,
  Target,
  CheckCircle,
  Video,
  CheckSquare,
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Music,
} from 'lucide-react';
import api from '../../services/api';
import { uploadMidia } from '../../services/upload';
import TextNode from '../../components/TextNode';
import DecisionNode from '../../components/DecisionNode';
import MediaNode from '../../components/MediaNode';
import VideoNode from '../../components/VideoNode';
import ChecklistNode from '../../components/ChecklistNode';
import AudioNode from '../../components/AudioNode';
import * as S from './style';

const nodeTypes = {
  textNode: TextNode,
  decisionNode: DecisionNode,
  mediaNode: MediaNode,
  videoNode: VideoNode,
  checklistNode: ChecklistNode,
  audioNode: AudioNode,
};

const initialNodes = [];
const initialEdges = [];

const editorSteps = [
  { id: 1, title: 'Configuração', description: 'Defina título e metadados', icon: Target },
  { id: 2, title: 'Construção', description: 'Crie o flow visual', icon: Zap },
  { id: 3, title: 'Publicação', description: 'Revise e salve', icon: CheckCircle },
];

const FlowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [flowData, setFlowData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  const [nodeData, setNodeData] = useState({
    title: '',
    content: '',
    question: '',
    options: ['Opção 1', 'Opção 2'],
    mediaFile: null,
    mediaUrl: '',
    videoUrl: '',
    audioUrl: '',
    description: '',
    items: [{ id: '1', label: 'Item 1', done: false }],
    callout: null,
    hotspots: [],
  });
  const [isPublic, setIsPublic] = useState(true);
  const reactFlowWrapper = useRef(null);
  const fileInputRef = useRef(null);
  const isEditing = !!id;

  // Carrega dados do flow para edição
  useEffect(() => {
    if (isEditing) {
      const fetchFlow = async () => {
        try {
          const response = await api.get(`/flow/${id}`);
          const flow = response.data;
          setFlowData({
            title: flow.titulo || '',
            description: flow.descricao || '',
            category: flow.categoria || '',
            tags: flow.tags?.join(', ') || '',
          });
          setNodes(flow.conteudo_nos || []);
          setEdges(flow.conteudo_conexoes || []);
          setIsPublic(flow.status === 'publicado');
        } catch (error) {
          console.error('Erro ao carregar flow:', error);
          toast.error('Erro ao carregar o flow para edição.');
        }
      };
      fetchFlow();
    }
  }, [id, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((eds) => {
        const newEdges = eds.filter((e) => e.id !== oldEdge.id);
        return addEdge({ ...newConnection, animated: true }, newEdges);
      }),
    [setEdges]
  );

  const addNode = useCallback(
    (type) => {
      const positions = [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 500, y: 100 },
        { x: 100, y: 300 },
        { x: 300, y: 300 },
        { x: 500, y: 300 },
      ];
      const position = positions[nodes.length % positions.length] || { x: 100, y: 100 };
      const newNode = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
        type,
        position,
        data: {
          title: '',
          content: type === 'textNode' ? '' : undefined,
          question: type === 'decisionNode' ? '' : undefined,
          options: type === 'decisionNode' ? ['Opção 1', 'Opção 2'] : undefined,
          mediaUrl: type === 'mediaNode' ? '' : undefined,
          hotspots: type === 'mediaNode' ? [] : undefined,
          videoUrl: type === 'videoNode' ? '' : undefined,
          audioUrl: type === 'audioNode' ? '' : undefined,
          description: (type === 'videoNode' || type === 'audioNode') ? '' : undefined,
          items: type === 'checklistNode' ? [{ id: '1', label: 'Item 1', done: false }] : undefined,
        },
      };
      setNodes((nds) => nds.concat([newNode]));
    },
    [nodes.length, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNodeData({
      title: node.data.title || '',
      content: node.data.content || '',
      question: node.data.question || '',
      options: node.data.options?.filter((opt) => opt.trim()) || ['Opção 1', 'Opção 2'],
      mediaFile: null,
      mediaUrl: node.data.mediaUrl || '',
      videoUrl: node.data.videoUrl || '',
      audioUrl: node.data.audioUrl || '',
      description: node.data.description || '',
      items: node.data.items || [{ id: '1', label: 'Item 1', done: false }],
      callout: node.data.callout || null,
      hotspots: node.data.hotspots || [],
    });
    setIsNodeModalOpen(true);
  }, []);

  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast.error('Arquivo inválido. Selecione uma imagem (PNG, JPG, SVG).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 10MB.');
      return;
    }

    const toastId = toast.loading('Enviando imagem...');
    try {
      const url = await uploadMidia(file);
      setNodeData((prev) => ({ ...prev, mediaFile: file, mediaUrl: url }));
      toast.success('Imagem enviada!', { id: toastId });
    } catch {
      toast.error('Falha ao enviar imagem.', { id: toastId });
    }
  }, []);

  const saveNodeData = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? {
            ...node,
            data: {
              title: nodeData.title,
              content: nodeData.content || undefined,
              question: nodeData.question || undefined,
              options: nodeData.options?.filter((opt) => opt.trim()).slice(0, 3) || undefined,
              mediaUrl: nodeData.mediaUrl || undefined,
              videoUrl: nodeData.videoUrl || undefined,
              audioUrl: nodeData.audioUrl || undefined,
              description: nodeData.description || undefined,
              items: nodeData.items || undefined,
              callout: nodeData.callout || undefined,
              hotspots: nodeData.hotspots?.length ? nodeData.hotspots : undefined,
            },
          }
          : node
      )
    );
    setIsNodeModalOpen(false);
    toast.success('Nó salvo com sucesso!');
  }, [selectedNode, nodeData, setNodes]);

  const deleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id)
    );
    setIsNodeModalOpen(false);
    toast.success('Nó excluído com sucesso!');
  }, [selectedNode, setNodes, setEdges]);

  const addChecklistItem = useCallback(() => {
    setNodeData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { id: Date.now().toString(), label: '', done: false }],
    }));
  }, []);

  const removeChecklistItem = useCallback((itemId) => {
    setNodeData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }));
  }, []);

  const updateChecklistItem = useCallback((itemId, label) => {
    setNodeData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, label } : i)),
    }));
  }, []);

  const saveFlow = useCallback(
    async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Você precisa estar autenticado.');
          return;
        }

        if (!flowData.title || !flowData.description || !flowData.category) {
          toast.error('Título, descrição e categoria são obrigatórios.');
          return;
        }

        const tagsArray = flowData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag);

        const payload = {
          titulo: flowData.title,
          descricao: flowData.description,
          conteudo_nos: nodes,
          conteudo_conexoes: edges,
          categoria: flowData.category,
          tags: tagsArray,
          status: isPublic ? 'publicado' : 'rascunho',
        };

        let response;
        let flowId;
        if (isEditing) {
          response = await api.put(`/flow/${id}`, payload);
          flowId = id;
        } else {
          response = await api.post('/flow', payload);
          flowId = response.data.flow_id;
        }

        if (!flowId) {
          console.error('ID do flow não encontrado na resposta:', response.data);
          toast.error('Erro: ID do flow não retornado pelo servidor.');
          return;
        }

        toast.success(isEditing ? 'Flow atualizado com sucesso!' : 'Flow criado com sucesso!');
        navigate('/feed');
      } catch (error) {
        toast.error(error.response?.data?.erro || 'Erro ao salvar flow.');
      }
    },
    [flowData, nodes, edges, isEditing, id, navigate, isPublic]
  );

  const nextStep = useCallback(() => {
    if (currentStep === 1 && (!flowData.title || !flowData.description || !flowData.category)) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, flowData]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const progress = (currentStep / 3) * 100;

  const addChecklistItem = () => {
    setNodeData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { id: Date.now().toString(), label: '', done: false }],
    }));
  };

  const removeChecklistItem = (itemId) => {
    setNodeData((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== itemId) }));
  };

  const updateChecklistItem = (itemId, label) => {
    setNodeData((prev) => ({
      ...prev,
      items: prev.items.map((i) => (i.id === itemId ? { ...i, label } : i)),
    }));
  };

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.LeftSection>
            <S.BackButton onClick={() => navigate('/feed')}>
              <ArrowLeft size={16} />
              Voltar
            </S.BackButton>
          </S.LeftSection>
          <S.TitleWrapper>
            <S.Title>{isEditing ? `Editando ${flowData.title || 'Flow'}` : 'Novo Flow'}</S.Title>
            <S.Subtitle>Etapa {currentStep}: {editorSteps[currentStep - 1].description}</S.Subtitle>
          </S.TitleWrapper>
          <S.StepsWrapper>
            {editorSteps.map((step, index) => (
              <S.Step key={step.id}>
                <S.StepIcon $active={currentStep >= step.id}>
                  <step.icon size={16} />
                </S.StepIcon>
                <S.StepTitle $active={currentStep >= step.id}>{step.title}</S.StepTitle>
                {index < editorSteps.length - 1 && (
                  <S.StepConnector $active={currentStep > step.id} />
                )}
              </S.Step>
            ))}
          </S.StepsWrapper>
          <S.HeaderActions>
            <S.ProgressWrapper>
              <S.ProgressBar value={progress} max={100} />
              <S.ProgressText>{Math.round(progress)}%</S.ProgressText>
            </S.ProgressWrapper>
            <S.SaveButton disabled title="Funcionalidade de rascunho indisponível">
              <Save size={16} />
              Salvar Rascunho
            </S.SaveButton>
          </S.HeaderActions>
        </S.HeaderContent>
      </S.Header>
      <S.Content>
        {currentStep === 1 && (
          <S.ConfigSection>
            <S.Card>
              <S.CardHeader>
                <S.CardTitle>
                  <Target size={20} color="#233DFF" />
                  Configuração do Flow
                </S.CardTitle>
                <S.CardDescription>Configure os detalhes básicos do flow</S.CardDescription>
              </S.CardHeader>
              <S.CardContent>
                <S.FormGroup>
                  <S.Label>Título do Flow *</S.Label>
                  <S.Input
                    value={flowData.title}
                    onChange={(e) => setFlowData({ ...flowData, title: e.target.value })}
                    placeholder="Ex: Sistema de Design Completo"
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>Descrição *</S.Label>
                  <S.Textarea
                    value={flowData.description}
                    onChange={(e) => setFlowData({ ...flowData, description: e.target.value })}
                    placeholder="Descreva o objetivo e conteúdo do flow..."
                    rows={3}
                  />
                </S.FormGroup>
                <S.FormRow>
                  <S.FormGroup>
                    <S.Label>Categoria *</S.Label>
                    <S.Select
                      value={flowData.category}
                      onChange={(e) => setFlowData({ ...flowData, category: e.target.value })}
                    >
                      <option value="">Selecione</option>
                      <option value="desenvolvimento">Desenvolvimento</option>
                      <option value="design">Design</option>
                      <option value="marketing">Marketing</option>
                      <option value="vendas">Vendas</option>
                      <option value="produto">Produto</option>
                    </S.Select>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Tags</S.Label>
                    <S.Input
                      value={flowData.tags}
                      onChange={(e) => setFlowData({ ...flowData, tags: e.target.value })}
                      placeholder="Exemplo: design, figma, development"
                    />
                  </S.FormGroup>
                </S.FormRow>
                <S.ButtonWrapper>
                  <S.NextButton onClick={nextStep}>
                    Próxima Etapa
                    <ChevronRight size={16} />
                  </S.NextButton>
                </S.ButtonWrapper>
              </S.CardContent>
            </S.Card>
          </S.ConfigSection>
        )}
        {currentStep === 2 && (
          <S.EditorSection>
            <S.Sidebar>
              <S.SidebarSection>
                <S.SidebarTitle>
                  <Sparkles size={16} color="#233DFF" />
                  Adicionar Nós
                </S.SidebarTitle>
                <S.NodeButton onClick={() => addNode('textNode')}>
                  <S.NodeIcon color="#233DFF">
                    <Type size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Conteúdo</S.NodeTitle>
                    <S.NodeDescription>Texto</S.NodeDescription>
                  </div>
                </S.NodeButton>
                <S.NodeButton onClick={() => addNode('decisionNode')}>
                  <S.NodeIcon color="#6366F1">
                    <GitBranch size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Decisão</S.NodeTitle>
                    <S.NodeDescription>Ramificações</S.NodeDescription>
                  </div>
                </S.NodeButton>
                <S.NodeButton onClick={() => addNode('mediaNode')}>
                  <S.NodeIcon color="#8B5CF6">
                    <ImageIcon size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Imagem</S.NodeTitle>
                    <S.NodeDescription>Imagens PNG/JPG/SVG</S.NodeDescription>
                  </div>
                </S.NodeButton>
                <S.NodeButton onClick={() => addNode('videoNode')}>
                  <S.NodeIcon color="#EF4444">
                    <Video size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Vídeo</S.NodeTitle>
                    <S.NodeDescription>YouTube ou direto</S.NodeDescription>
                  </div>
                </S.NodeButton>
                <S.NodeButton onClick={() => addNode('checklistNode')}>
                  <S.NodeIcon color="#10B981">
                    <CheckSquare size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Checklist</S.NodeTitle>
                    <S.NodeDescription>Lista de tarefas</S.NodeDescription>
                  </div>
                </S.NodeButton>
                <S.NodeButton onClick={() => addNode('audioNode')}>
                  <S.NodeIcon color="#8B5CF6">
                    <Music size={16} color="#fff" />
                  </S.NodeIcon>
                  <div>
                    <S.NodeTitle>Áudio</S.NodeTitle>
                    <S.NodeDescription>Player de áudio</S.NodeDescription>
                  </div>
                </S.NodeButton>
              </S.SidebarSection>
              <S.SidebarSection>
                <S.SidebarTitle>Estatísticas</S.SidebarTitle>
                <S.StatsCard>
                  <S.Stat>
                    <S.StatValue color="#233DFF">{nodes.length}</S.StatValue>
                    <S.StatLabel>Nós</S.StatLabel>
                  </S.Stat>
                  <S.Stat>
                    <S.StatValue color="#6366F1">{edges.length}</S.StatValue>
                    <S.StatLabel>Conexões</S.StatLabel>
                  </S.Stat>
                </S.StatsCard>
              </S.SidebarSection>
            </S.Sidebar>
            <S.Canvas ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeUpdate={onEdgeUpdate}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="top-right"
                edgesUpdatable
              >
                <MiniMap nodeColor="#233DFF" zoomable pannable />
                <Controls />
                <Background variant="dots" gap={12} size={1} />
              </ReactFlow>
            </S.Canvas>
          </S.EditorSection>
        )}
        {currentStep === 3 && (
          <S.PublishSection>
            <S.Card>
              <S.CardHeader>
                <S.CardTitle>
                  <CheckCircle size={20} color="#233DFF" />
                  Revisão e Salvamento
                </S.CardTitle>
                <S.CardDescription>Revise seu flow e salve como rascunho</S.CardDescription>
              </S.CardHeader>
              <S.CardContent>
                <S.SummaryCard>
                  <S.SummaryTitle>Resumo do Flow</S.SummaryTitle>
                  <S.SummaryGrid>
                    <div>
                      <S.SummaryLabel>Título:</S.SummaryLabel>
                      <S.SummaryValue>{flowData.title || 'Não definido'}</S.SummaryValue>
                    </div>
                    <div>
                      <S.SummaryLabel>Categoria:</S.SummaryLabel>
                      <S.SummaryValue>{flowData.category || 'Não definida'}</S.SummaryValue>
                    </div>
                    <div>
                      <S.SummaryLabel>Nós criados:</S.SummaryLabel>
                      <S.SummaryValue>{nodes.length}</S.SummaryValue>
                    </div>
                    <div>
                      <S.SummaryLabel>Conexões:</S.SummaryLabel>
                      <S.SummaryValue>{edges.length}</S.SummaryValue>
                    </div>
                  </S.SummaryGrid>
                </S.SummaryCard>
                <S.PublishOptions>
                  <S.PublishTitle>Configurações de Publicação</S.PublishTitle>
                  <S.CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <div>
                      <S.CheckboxTitle>Tornar público</S.CheckboxTitle>
                      <S.CheckboxDescription>Visível para todos os usuários da plataforma</S.CheckboxDescription>
                    </div>
                  </S.CheckboxLabel>
                  <S.CheckboxLabel>
                    <input type="checkbox" defaultChecked disabled />
                    <div>
                      <S.CheckboxTitle>Permitir comentários (indisponível)</S.CheckboxTitle>
                      <S.CheckboxDescription>Funcionalidade será liberada em breve</S.CheckboxDescription>
                    </div>
                  </S.CheckboxLabel>
                </S.PublishOptions>
                <S.ButtonWrapper>
                  <S.PrevButton onClick={prevStep}>
                    <ChevronLeft size={16} />
                    Voltar
                  </S.PrevButton>
                  <S.ButtonGroup>
                    <S.DraftButton disabled title="Funcionalidade de rascunho indisponível">
                      Salvar Rascunho
                    </S.DraftButton>
                    <S.PublishButton onClick={saveFlow}>
                      <Play size={16} />
                      {isEditing ? 'Atualizar Flow' : 'Publicar Flow'}
                    </S.PublishButton>
                  </S.ButtonGroup>
                </S.ButtonWrapper>
              </S.CardContent>
            </S.Card>
          </S.PublishSection>
        )}
      </S.Content>
      {currentStep === 2 && (
        <S.Footer>
          <S.PrevButton onClick={prevStep}>
            <ChevronLeft size={16} />
            Configuração
          </S.PrevButton>
          <S.NextButton onClick={nextStep}>
            Revisar e Salvar
            <ChevronRight size={16} />
          </S.NextButton>
        </S.Footer>
      )}
      {isNodeModalOpen && (
        <S.Modal>
          <S.ModalContent>
            <S.ModalHeader>
              <S.ModalTitle>
                {selectedNode?.type === 'textNode' && <Type size={20} color="#233DFF" />}
                {selectedNode?.type === 'decisionNode' && <GitBranch size={20} color="#6366F1" />}
                {selectedNode?.type === 'mediaNode' && <ImageIcon size={20} color="#8B5CF6" />}
                {selectedNode?.type === 'videoNode' && <Video size={20} color="#EF4444" />}
                {selectedNode?.type === 'checklistNode' && <CheckSquare size={20} color="#10B981" />}
                {selectedNode?.type === 'audioNode' && <Music size={20} color="#8B5CF6" />}
                Editar{' '}
                {selectedNode?.type === 'textNode'
                  ? 'Nó de Conteúdo'
                  : selectedNode?.type === 'decisionNode'
                    ? 'Nó de Decisão'
                    : selectedNode?.type === 'mediaNode'
                      ? 'Nó de Imagem'
                      : selectedNode?.type === 'videoNode'
                        ? 'Nó de Vídeo'
                        : selectedNode?.type === 'checklistNode'
                          ? 'Nó de Checklist'
                          : selectedNode?.type === 'audioNode'
                            ? 'Nó de Áudio'
                            : 'Nó'}
              </S.ModalTitle>
              <S.ModalDescription>Configure o conteúdo e comportamento do nó</S.ModalDescription>
            </S.ModalHeader>
            <S.ModalBody>
              {selectedNode?.type === 'textNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Título do Conteúdo</S.Label>
                    <S.Input
                      value={nodeData.title}
                      onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })}
                      placeholder="Ex: Introdução ao Design System"
                    />
                    <S.FormHint>Um título claro e descritivo para este conteúdo</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Conteúdo</S.Label>
                    <S.Textarea
                      value={nodeData.content}
                      onChange={(e) => setNodeData({ ...nodeData, content: e.target.value })}
                      placeholder="Digite o conteúdo que será exibido neste nó..."
                      rows={8}
                    />
                    <S.FormHint>Suporte a markdown básico: **negrito**, *itálico*, `código`</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Tipo de Callout</S.Label>
                    <S.Select
                      value={nodeData.callout || ''}
                      onChange={(e) => setNodeData({ ...nodeData, callout: e.target.value || null })}
                    >
                      <option value="">Nenhum</option>
                      <option value="info">Info</option>
                      <option value="warning">Aviso</option>
                      <option value="danger">Perigo</option>
                      <option value="tip">Dica</option>
                    </S.Select>
                    <S.FormHint>Destaque o conteúdo com uma barra colorida</S.FormHint>
                  </S.FormGroup>
                </>
              )}
              {selectedNode?.type === 'decisionNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Pergunta ou Decisão</S.Label>
                    <S.Input
                      value={nodeData.question}
                      onChange={(e) => setNodeData({ ...nodeData, question: e.target.value })}
                      placeholder="Ex: Qual é seu nível de experiência com DS?"
                    />
                    <S.FormHint>Formule uma pergunta clara que levará a diferentes caminhos</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Opções de Resposta (máximo 3)</S.Label>
                    {nodeData.options.map((option, index) => (
                      <S.OptionRow key={index}>
                        <S.OptionNumber>{index + 1}</S.OptionNumber>
                        <S.Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...nodeData.options];
                            newOptions[index] = e.target.value;
                            setNodeData({ ...nodeData, options: newOptions });
                          }}
                          placeholder={`Opção ${index + 1}`}
                        />
                        {nodeData.options.length > 1 && (
                          <S.RemoveOptionButton
                            onClick={() => {
                              const newOptions = nodeData.options.filter((_, i) => i !== index);
                              setNodeData({ ...nodeData, options: newOptions });
                            }}
                          >
                            <X size={16} />
                          </S.RemoveOptionButton>
                        )}
                      </S.OptionRow>
                    ))}
                    {nodeData.options.length < 3 && (
                      <S.AddOptionButton
                        onClick={() => setNodeData({ ...nodeData, options: [...nodeData.options, ''] })}
                      >
                        <Plus size={16} />
                        Adicionar Nova Opção
                      </S.AddOptionButton>
                    )}
                    <S.FormHint>Cada opção criará um caminho diferente. Mínimo 1, máximo 3.</S.FormHint>
                  </S.FormGroup>
                </>
              )}
              {selectedNode?.type === 'mediaNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Título da Imagem</S.Label>
                    <S.Input
                      value={nodeData.title}
                      onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })}
                      placeholder="Ex: Diagrama do Sistema"
                    />
                    <S.FormHint>Nome descritivo para a imagem</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Selecionar Imagem</S.Label>
                    <S.UploadArea>
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*"
                      />
                      {nodeData.mediaUrl ? (
                        <S.UploadContent>
                          <S.FileIcon>
                            <img
                              src={nodeData.mediaUrl}
                              alt="Preview"
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                            />
                          </S.FileIcon>
                          <div>
                            <S.FileName>{nodeData.mediaFile?.name || 'Imagem selecionada'}</S.FileName>
                            {nodeData.mediaFile && (
                              <S.FileSize>
                                {(nodeData.mediaFile.size / 1024 / 1024).toFixed(2)} MB
                              </S.FileSize>
                            )}
                          </div>
                          <S.UploadButtons>
                            <S.UploadButton onClick={() => fileInputRef.current?.click()}>
                              <Upload size={16} />
                              Trocar Imagem
                            </S.UploadButton>
                            <S.RemoveFileButton
                              onClick={() => setNodeData((prev) => ({ ...prev, mediaFile: null, mediaUrl: '', hotspots: [] }))}
                            >
                              <X size={16} />
                              Remover
                            </S.RemoveFileButton>
                          </S.UploadButtons>
                        </S.UploadContent>
                      ) : (
                        <S.UploadContent>
                          <S.UploadIcon>
                            <Upload size={16} color="#666666" />
                          </S.UploadIcon>
                          <div>
                            <S.UploadText>Clique para selecionar uma imagem</S.UploadText>
                            <S.UploadHint>PNG, JPG, até 10MB</S.UploadHint>
                          </div>
                          <S.UploadButton onClick={() => fileInputRef.current?.click()}>
                            <Upload size={16} />
                            Selecionar
                          </S.UploadButton>
                        </S.UploadContent>
                      )}
                    </S.UploadArea>
                  </S.FormGroup>
                  {nodeData.mediaUrl && (
                    <S.FormGroup>
                      <S.Label>Hotspots — clique na imagem para adicionar</S.Label>
                      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                        <img
                          src={nodeData.mediaUrl}
                          alt="Adicionar hotspot"
                          style={{ width: '100%', borderRadius: 8, cursor: 'crosshair', display: 'block' }}
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = parseFloat(((e.clientX - rect.left) / rect.width * 100).toFixed(1));
                            const y = parseFloat(((e.clientY - rect.top) / rect.height * 100).toFixed(1));
                            setNodeData((prev) => ({
                              ...prev,
                              hotspots: [...(prev.hotspots || []), { id: Date.now().toString(), x, y, label: '', description: '' }],
                            }));
                          }}
                        />
                        {(nodeData.hotspots || []).map((hs, i) => (
                          <div
                            key={hs.id}
                            style={{
                              position: 'absolute',
                              left: `${hs.x}%`,
                              top: `${hs.y}%`,
                              transform: 'translate(-50%, -50%)',
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              background: '#233DFF',
                              color: '#fff',
                              fontSize: 11,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #fff',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                              pointerEvents: 'none',
                            }}
                          >
                            {i + 1}
                          </div>
                        ))}
                      </div>
                      {(nodeData.hotspots || []).length > 0 && (
                        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {nodeData.hotspots.map((hs, i) => (
                            <div key={hs.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                              <span style={{ minWidth: 22, height: 22, borderRadius: '50%', background: '#233DFF', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <S.Input
                                  value={hs.label}
                                  onChange={(e) => setNodeData((prev) => ({
                                    ...prev,
                                    hotspots: prev.hotspots.map((h) => h.id === hs.id ? { ...h, label: e.target.value } : h),
                                  }))}
                                  placeholder="Título do hotspot"
                                />
                                <S.Input
                                  value={hs.description}
                                  onChange={(e) => setNodeData((prev) => ({
                                    ...prev,
                                    hotspots: prev.hotspots.map((h) => h.id === hs.id ? { ...h, description: e.target.value } : h),
                                  }))}
                                  placeholder="Descrição (opcional)"
                                />
                              </div>
                              <button
                                onClick={() => setNodeData((prev) => ({ ...prev, hotspots: prev.hotspots.filter((h) => h.id !== hs.id) }))}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '2px 4px' }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {(nodeData.hotspots || []).length === 0 && (
                        <S.FormHint>Clique em qualquer ponto da imagem para marcar</S.FormHint>
                      )}
                    </S.FormGroup>
                  )}
                </>
              )}
              {selectedNode?.type === 'videoNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Título do Vídeo</S.Label>
                    <S.Input
                      value={nodeData.title}
                      onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })}
                      placeholder="Ex: Introdução ao Sistema"
                    />
                    <S.FormHint>Um título descritivo para o vídeo</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>URL do Vídeo (YouTube ou direto)</S.Label>
                    <S.Input
                      value={nodeData.videoUrl}
                      onChange={(e) => setNodeData({ ...nodeData, videoUrl: e.target.value })}
                      placeholder="Ex: https://youtube.com/watch?v=..."
                    />
                    <S.FormHint>Aceita links do YouTube ou URL direta de vídeo</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Descrição (opcional)</S.Label>
                    <S.Textarea
                      value={nodeData.description || ''}
                      onChange={(e) => setNodeData({ ...nodeData, description: e.target.value })}
                      placeholder="Descreva o conteúdo do vídeo..."
                      rows={3}
                    />
                  </S.FormGroup>
                </>
              )}
              {selectedNode?.type === 'checklistNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Título do Checklist</S.Label>
                    <S.Input
                      value={nodeData.title}
                      onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })}
                      placeholder="Ex: Validação de Deploy"
                    />
                    <S.FormHint>Nome do checklist</S.FormHint>
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Itens</S.Label>
                    {(nodeData.items || []).map((item) => (
                      <S.OptionRow key={item.id}>
                        <S.Input
                          value={item.label}
                          onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                          placeholder="Descrição do item"
                        />
                        {nodeData.items.length > 1 && (
                          <S.RemoveOptionButton onClick={() => removeChecklistItem(item.id)}>
                            <X size={16} />
                          </S.RemoveOptionButton>
                        )}
                      </S.OptionRow>
                    ))}
                    <S.AddOptionButton onClick={addChecklistItem}>
                      <Plus size={16} />
                      Adicionar Item
                    </S.AddOptionButton>
                    <S.FormHint>Cada item representa uma tarefa a ser concluída</S.FormHint>
                  </S.FormGroup>
                </>
              )}
              {selectedNode?.type === 'audioNode' && (
                <>
                  <S.FormGroup>
                    <S.Label>Título do Áudio</S.Label>
                    <S.Input value={nodeData.title} onChange={(e) => setNodeData({ ...nodeData, title: e.target.value })} placeholder="Ex: Introdução ao módulo" />
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Arquivo de Áudio</S.Label>
                    <S.FileInputWrapper>
                      <S.FileInputLabel htmlFor="audio-upload">
                        {nodeData.audioUrl ? '✓ Áudio enviado — clique para trocar' : 'Clique para enviar um arquivo de áudio'}
                      </S.FileInputLabel>
                      <input
                        id="audio-upload"
                        type="file"
                        accept="audio/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 20 * 1024 * 1024) { toast.error('Áudio deve ter no máximo 20MB.'); return; }
                          const toastId = toast.loading('Enviando áudio...');
                          try {
                            const url = await uploadMidia(file);
                            setNodeData((prev) => ({ ...prev, audioUrl: url }));
                            toast.success('Áudio enviado!', { id: toastId });
                          } catch { toast.error('Falha ao enviar áudio.', { id: toastId }); }
                        }}
                      />
                    </S.FileInputWrapper>
                    <S.FormHint>Ou cole um link direto abaixo</S.FormHint>
                    <S.Input value={nodeData.audioUrl} onChange={(e) => setNodeData({ ...nodeData, audioUrl: e.target.value })} placeholder="https://... (opcional)" style={{ marginTop: 6 }} />
                  </S.FormGroup>
                  <S.FormGroup>
                    <S.Label>Descrição (opcional)</S.Label>
                    <S.Textarea value={nodeData.description || ''} onChange={(e) => setNodeData({ ...nodeData, description: e.target.value })} rows={3} placeholder="Descreva o conteúdo do áudio..." />
                  </S.FormGroup>
                </>
              )}
            </S.ModalBody>
            <S.ModalFooter>
              <S.DeleteButton onClick={deleteNode}>
                <X size={16} />
                Excluir Nó
              </S.DeleteButton>
              <S.ButtonGroup>
                <S.CancelButton onClick={() => setIsNodeModalOpen(false)}>Cancelar</S.CancelButton>
                <S.ModalSaveButton onClick={saveNodeData}>
                  <CheckCircle size={16} />
                  Salvar
                </S.ModalSaveButton>
              </S.ButtonGroup>
            </S.ModalFooter>
          </S.ModalContent>
        </S.Modal>
      )}
    </S.Container>
  );
};

export default FlowEditor;