import styled from 'styled-components';

export const NodeContainer = styled.div`
  padding: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: #fff;
  border: 2px solid ${({ $selected }) => ($selected ? '#EF4444' : '#E2E8F0')};
  min-width: 240px;
  max-width: 300px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: ${({ $selected }) => ($selected ? 'scale(1.05)' : 'scale(1)')};
  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#EF4444' : '#CBD5E1')};
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const handleStyles = 'width: 12px; height: 12px; background: #EF4444; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
  background: #EF4444;
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

export const Thumbnail = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  height: 120px;
  margin-bottom: 6px;
  position: relative;
  background: #F1F5F9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
`;

export const VideoPlaceholder = styled.div`
  width: 100%;
  height: 80px;
  border-radius: 4px;
  background: #F1F5F9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
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
