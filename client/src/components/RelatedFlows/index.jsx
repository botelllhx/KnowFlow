import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../../services/api';
import * as S from './style';

const RelatedFlows = ({ flowId }) => {
  const navigate = useNavigate();
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!flowId) return;
    api.get(`/flow/${flowId}/relacionados`)
      .then(({ data }) => setFlows(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [flowId]);

  if (loading || !flows.length) return null;

  return (
    <S.Container>
      <S.Title><Sparkles size={14} />Flows Relacionados</S.Title>
      {flows.map((flow) => (
        <S.FlowItem key={flow.id} onClick={() => navigate(`/flow/${flow.id}`)}>
          <S.FlowTitle>{flow.titulo}</S.FlowTitle>
          <S.FlowMeta>{flow.categoria} • {flow.visualizacoes} views</S.FlowMeta>
        </S.FlowItem>
      ))}
    </S.Container>
  );
};

export default RelatedFlows;
