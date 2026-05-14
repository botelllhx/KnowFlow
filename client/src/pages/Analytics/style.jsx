import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  padding: 32px 40px;
  background: #0a0a0f;
  color: #fff;
`;

export const PageHeader = styled.div`
  margin-bottom: 32px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  margin: 0;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
  margin-bottom: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(16px);
`;

export const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #233dff;
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6px;
  display: flex;
  align-items: center;
`;

export const Section = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FlowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FlowRow = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
  }
`;

export const FlowTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  flex: 1;
`;

export const FlowMeta = styled.span`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
`;

export const BarWrapper = styled.div`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 99px;
  overflow: hidden;
  min-width: 80px;
  max-width: 160px;
`;

export const BarFill = styled.div`
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #233dff, #7c3aed);
  width: ${({ $pct }) => $pct}%;
  transition: width 0.4s ease;
`;

export const Chip = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 99px;
  background: rgba(35, 61, 255, 0.15);
  color: #233dff;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 0;
  color: rgba(255, 255, 255, 0.3);
  font-size: 15px;
`;

export const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: rgba(255, 255, 255, 0.4);
  background: #0a0a0f;
`;

export const NodeViewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NodeViewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
`;
