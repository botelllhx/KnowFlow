import styled from 'styled-components';

export const NodeContainer = styled.div`
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  border: 2px solid ${({ $selected }) => ($selected ? '#10B981' : '#E2E8F0')};
  min-width: 240px;
  max-width: 300px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: ${({ $selected }) => ($selected ? 'scale(1.05)' : 'scale(1)')};
  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#10B981' : '#CBD5E1')};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const handleStyles = 'width: 12px; height: 12px; background: #10B981; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: #10B981;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #4B5563;
`;

export const Content = styled.div`
  font-size: 12px;
  color: #6B7280;
  line-height: 1.5;
`;

export const Title = styled.div`
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 6px;
  font-size: 14px;
`;

export const CheckItem = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 12px;
  color: ${({ $done }) => ($done ? '#94A3B8' : '#374151')};
  text-decoration: ${({ $done }) => ($done ? 'line-through' : 'none')};
  margin-bottom: 4px;
`;

export const CheckDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${({ $done }) => ($done ? '#10B981' : '#CBD5E1')};
  background: ${({ $done }) => ($done ? '#10B981' : 'transparent')};
  flex-shrink: 0;
`;

export const Progress = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  padding: 2px 8px;
  background: #D1FAE5;
  color: #065F46;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
`;

export const Placeholder = styled.div`
  color: #94A3B8;
  font-size: 11px;
  text-align: center;
  padding: 12px 0;
`;
