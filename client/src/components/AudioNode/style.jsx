import styled from 'styled-components';

export const NodeContainer = styled.div`
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  border: 2px solid ${({ $selected }) => ($selected ? '#8B5CF6' : '#E2E8F0')};
  min-width: 240px;
  max-width: 300px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: ${({ $selected }) => ($selected ? 'scale(1.05)' : 'scale(1)')};
  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#8B5CF6' : '#CBD5E1')};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const handleStyles = 'width: 12px; height: 12px; background: #8B5CF6; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: #8B5CF6;
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
  margin-bottom: 4px;
  font-size: 14px;
`;

export const Waveform = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 48px;
  padding: 4px 0;
  margin-bottom: 6px;
`;

export const WaveBar = styled.div`
  width: 6px;
  border-radius: 3px 3px 0 0;
  background: #8B5CF6;
  opacity: 0.7;
  height: ${({ $height }) => $height}%;
`;

export const Placeholder = styled.div`
  color: #94A3B8;
  font-size: 11px;
  text-align: center;
  padding: 12px 0;
`;

export const Description = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 12px;
  color: #6B7280;
  line-height: 1.4;
`;
