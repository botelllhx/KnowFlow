import React from 'react';
import { Handle, Position } from 'reactflow';
import { Video, Play } from 'lucide-react';
import * as S from './style';

const getYouTubeId = (url) => {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

const VideoNode = ({ data, selected }) => {
  const ytId = getYouTubeId(data.videoUrl);
  const hasThumbnail = !!ytId;

  return (
    <S.NodeContainer $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        className={S.handleStyles}
      />
      <S.Header>
        <S.IconWrapper>
          <Video size={12} color="#fff" />
        </S.IconWrapper>
        <S.Label>Vídeo</S.Label>
      </S.Header>
      <S.Content>
        {data.title && <S.Title>{data.title}</S.Title>}
        {data.videoUrl ? (
          hasThumbnail ? (
            <S.Thumbnail>
              <img
                src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
                alt={data.title || 'Thumbnail do vídeo'}
              />
              <S.PlayOverlay>
                <Play size={24} color="#fff" fill="#fff" />
              </S.PlayOverlay>
            </S.Thumbnail>
          ) : (
            <S.VideoPlaceholder>
              <Play size={20} color="#EF4444" />
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Vídeo externo</span>
            </S.VideoPlaceholder>
          )
        ) : (
          <S.Placeholder>Adicione um vídeo</S.Placeholder>
        )}
        {data.description && <S.Description>{data.description}</S.Description>}
      </S.Content>
      <Handle
        type="source"
        position={Position.Right}
        className={S.handleStyles}
      />
    </S.NodeContainer>
  );
};

export default VideoNode;
