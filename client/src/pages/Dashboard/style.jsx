import styled, { keyframes, css } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

/* ── PAGE ───────────────────────────────────────── */

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 24px 28px;
  gap: 20px;
  background: ${({ theme }) => theme.colors.background};
`;

/* ── GREETING CARD ──────────────────────────────── */

export const GreetingCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const GreetingLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Avatar = styled.div`
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.primary};
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: -0.5px;
`;

export const GreetingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const GreetingTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
`;

export const GreetingMeta = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const GreetingSince = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

/* ── STATS ──────────────────────────────────────── */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(35, 61, 255, 0.08);
    transform: translateY(-1px);
  }
`;

export const StatIconWrap = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $color, theme }) => {
    const map = {
      primary: theme.colors.primaryLight,
      success: theme.colors.successLight,
      warning: theme.colors.warningLight,
      secondary: theme.colors.secondaryLight,
    };
    return map[$color] || theme.colors.primaryLight;
  }};
  color: ${({ $color, theme }) => {
    const map = {
      primary: theme.colors.primary,
      success: theme.colors.success,
      warning: theme.colors.warning,
      secondary: theme.colors.secondary,
    };
    return map[$color] || theme.colors.primary;
  }};
`;

export const StatValue = styled.span`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -1px;
  line-height: 1;
`;

export const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* ── MAIN GRID ──────────────────────────────────── */

export const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 20px;
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ── SECTION CARD ───────────────────────────────── */

export const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
`;

export const SectionLink = styled.button`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

/* ── FLOW ITEMS ─────────────────────────────────── */

export const FlowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FlowItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s ease;
  cursor: default;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

export const FlowItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const FlowItemTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FlowItemMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ $status, theme }) => {
    if ($status === "publicado") return theme.colors.success;
    if ($status === "arquivado") return theme.colors.warning;
    return theme.colors.textMuted;
  }};
`;

export const FlowActions = styled.div`
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${FlowItem}:hover & {
    opacity: 1;
  }
`;

export const ActionBtn = styled.button`
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderPrimary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* ── ACTIVITY ITEMS ─────────────────────────────── */

export const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ActivityItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
`;

export const ActivityIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;

  ${({ $tipo, theme }) =>
    $tipo === "fork"
      ? css`
          background: ${theme.colors.backgroundPurple};
          color: ${theme.colors.secondary};
        `
      : css`
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `}
`;

export const ActivityBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const ActivityText = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.45;

  strong {
    font-weight: 600;
  }
`;

export const ActivityFlow = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export const ActivityTime = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/* ── EMPTY STATE ────────────────────────────────── */

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 0;
  text-align: center;
`;

export const EmptyText = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const EmptyAction = styled.button`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

/* ── SKELETON ───────────────────────────────────── */

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: ${({ $h }) => $h || "auto"};
`;

export const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || "14px"};
  width: ${({ $w }) => $w || "100%"};
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.backgroundSecondary} 25%,
    ${({ theme }) => theme.colors.border} 50%,
    ${({ theme }) => theme.colors.backgroundSecondary} 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;
