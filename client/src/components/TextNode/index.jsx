import React from 'react';
import { Handle, Position } from 'reactflow';
import { Type, Info, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';
import * as S from './style';
import renderMarkdown from '../../utils/renderMarkdown';

const calloutIconMap = {
  info: Info,
  warning: AlertTriangle,
  danger: AlertCircle,
  tip: Lightbulb,
};

// Componente TextNode: representa um nó de conteúdo textual
const TextNode = ({ data, selected }) => {
    const CalloutIcon = data.callout ? calloutIconMap[data.callout] : null;

    return (
        <S.NodeContainer $selected={selected}>
            <Handle
                type="target"
                position={Position.Left}
                className={S.handleStyles}
            />
            <S.Header>
                <S.IconWrapper>
                    <Type size={12} color="#fff" />
                </S.IconWrapper>
                <S.Label>Conteúdo</S.Label>
            </S.Header>
            <S.Content>
                {data.title && <S.Title>{data.title}</S.Title>}
                {data.callout ? (
                    <S.CalloutWrapper $calloutType={data.callout}>
                        {CalloutIcon && (
                            <S.CalloutIcon $calloutType={data.callout}>
                                <CalloutIcon size={12} />
                            </S.CalloutIcon>
                        )}
                        <S.Text>{data.content ? renderMarkdown(data.content) : 'Clique para adicionar conteúdo...'}</S.Text>
                    </S.CalloutWrapper>
                ) : (
                    <S.Text>{data.content ? renderMarkdown(data.content) : 'Clique para adicionar conteúdo...'}</S.Text>
                )}
            </S.Content>
            <Handle
                type="source"
                position={Position.Right}
                className={S.handleStyles}
            />
        </S.NodeContainer>
    );
};

export default TextNode;