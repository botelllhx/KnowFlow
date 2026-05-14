import styled from 'styled-components';

export const Container = styled.div`
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 16px;
`;

export const Title = styled.h4`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #233DFF;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const FlowItem = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid transparent;

  &:hover {
    background: rgba(35, 61, 255, 0.08);
    border-color: rgba(35, 61, 255, 0.2);
  }
`;

export const FlowTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
`;

export const FlowMeta = styled.div`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
`;
