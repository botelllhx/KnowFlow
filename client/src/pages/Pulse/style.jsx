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

export const PageHeader = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 22px 28px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
`;

export const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.3px;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

/* ── STATS ROW ─────────────────────────────────── */

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(35, 61, 255, 0.08);
    transform: translateY(-1px);
  }
`;

export const StatLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const StatValue = styled.span`
  font-size: 36px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -1.5px;
  line-height: 1;
`;

export const StatDelta = styled.span`
  font-size: 12px;
  color: ${({ $positive, theme }) =>
    $positive ? theme.colors.success : theme.colors.textMuted};
`;

/* ── GRID LAYOUT ───────────────────────────────── */

export const PulseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TwoColGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $ratio }) => $ratio || "1fr 1fr"};
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ── PULSE CARD ────────────────────────────────── */

export const PulseCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const CardIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ $warning, $danger, theme }) => {
    if ($danger)
      return css`
        background: ${theme.colors.errorLight};
        color: ${theme.colors.error};
      `;
    if ($warning)
      return css`
        background: ${theme.colors.warningLight};
        color: ${theme.colors.warning};
      `;
    return css`
      background: ${theme.colors.primaryLight};
      color: ${theme.colors.primary};
    `;
  }}
`;

export const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.2px;
`;

/* ── RANK LIST (Flows em Alta / Gargalos) ──────── */

export const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const RankItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const RankHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

export const RankNumber = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
`;

export const RankInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const RankName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const RankMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const RankValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  color: ${({ $warning, theme }) =>
    $warning ? theme.colors.warning : theme.colors.textSecondary};
`;

export const RankBar = styled.div`
  height: 4px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
  margin-left: 28px;
`;

export const RankBarFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: 4px;
  background: ${({ theme }) => theme.gradients.primary};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ── CATEGORY LIST ─────────────────────────────── */

const CATEGORY_COLORS = [
  "#233DFF",
  "#6C63FF",
  "#00C98D",
  "#FFB020",
  "#FF6B6B",
  "#4ECDC4",
];

export const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const CategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CategoryName = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

export const CategoryCount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const CategoryBar = styled.div`
  height: 6px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 4px;
  overflow: hidden;
`;

export const CategoryBarFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: 4px;
  background: ${({ $index }) => CATEGORY_COLORS[$index % CATEGORY_COLORS.length]};
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* ── RISK LIST ─────────────────────────────────── */

export const RiskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RiskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const RiskInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RiskName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

export const RiskMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: block;
`;

export const RiskAge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
  flex-shrink: 0;

  ${({ $days, theme }) => {
    if ($days >= 365)
      return css`
        background: ${theme.colors.errorLight};
        color: ${theme.colors.error};
      `;
    if ($days >= 180)
      return css`
        background: rgba(255, 140, 0, 0.1);
        color: #ff8c00;
      `;
    return css`
      background: ${theme.colors.warningLight};
      color: ${theme.colors.warning};
    `;
  }}
`;

/* ── FORK LIST ─────────────────────────────────── */

export const ForkList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
`;

export const ForkItem = styled.div`
  padding: 14px 16px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ForkName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ForkCount = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
`;

/* ── EMPTY STATE ───────────────────────────────── */

export const EmptyState = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: 24px 0;
`;

/* ── SKELETON ──────────────────────────────────── */

export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: ${({ $tall }) => ($tall ? "220px" : "auto")};
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
