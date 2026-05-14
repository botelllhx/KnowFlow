import React from 'react';
import { Handle, Position } from 'reactflow';
import { CheckSquare } from 'lucide-react';
import * as S from './style';

const ChecklistNode = ({ data, selected }) => {
  const items = data.items || [];
  const previewItems = items.slice(0, 3);
  const doneCount = items.filter((i) => i.done).length;

  return (
    <S.NodeContainer $selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        className={S.handleStyles}
      />
      <S.Header>
        <S.IconWrapper>
          <CheckSquare size={12} color="#fff" />
        </S.IconWrapper>
        <S.Label>Checklist</S.Label>
      </S.Header>
      <S.Content>
        {data.title && <S.Title>{data.title}</S.Title>}
        {items.length > 0 ? (
          <>
            {previewItems.map((item) => (
              <S.CheckItem key={item.id} $done={item.done}>
                <S.CheckDot $done={item.done} />
                {item.label || 'Item sem título'}
              </S.CheckItem>
            ))}
            <S.Progress>
              {doneCount}/{items.length} concluídos
            </S.Progress>
          </>
        ) : (
          <S.Placeholder>Adicione itens ao checklist</S.Placeholder>
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

export default ChecklistNode;
