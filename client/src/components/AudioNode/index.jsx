import React from 'react';
import { Handle, Position } from 'reactflow';
import { Music } from 'lucide-react';
import * as S from './style';

const AudioNode = ({ data, selected }) => {
  return (
    <S.NodeContainer $selected={selected}>
      <Handle type="target" position={Position.Left} className={S.handleStyles} />
      <S.Header>
        <S.IconWrapper><Music size={12} color="#fff" /></S.IconWrapper>
        <S.Label>Áudio</S.Label>
      </S.Header>
      <S.Content>
        {data.title && <S.Title>{data.title}</S.Title>}
        {data.audioUrl ? (
          <S.Waveform>
            {Array.from({ length: 20 }).map((_, i) => (
              <S.WaveBar key={i} $height={Math.abs(Math.sin(i * 0.8 + 1)) * 60 + 20} />
            ))}
          </S.Waveform>
        ) : (
          <S.Placeholder>Adicione um áudio</S.Placeholder>
        )}
        {data.description && <S.Description>{data.description}</S.Description>}
      </S.Content>
      <Handle type="source" position={Position.Right} className={S.handleStyles} />
    </S.NodeContainer>
  );
};

export default AudioNode;
