import styled, { keyframes, css } from "styled-components";

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

/* ── PAGE CONTAINER ─────────────────────────── */
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 28px 32px;
  gap: 20px;
`;

/* ── HEADER ─────────────────────────────────── */
export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 24px 28px;
  gap: 18px;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.headingFamily};
  font-size: 26px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.02em;
  line-height: 1.2;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  letter-spacing: -0.01em;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(35, 61, 255, 0.20);

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
    box-shadow: ${({ theme }) => theme.shadows.primary};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

export const SearchArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/* ── LAYOUT ──────────────────────────────────── */
export const PageMain = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

export const FeedColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const SidebarColumn = styled.aside`
  width: 276px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 28px;

  @media (max-width: 900px) {
    display: none;
  }
`;

/* ── SECTION TABS ─────────────────────────────── */
export const SectionTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  box-shadow: ${({ theme }) => theme.shadows.xs};

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SectionTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  letter-spacing: -0.01em;

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.primary};
          color: #fff;
          box-shadow: 0 2px 8px ${theme.colors.primaryGlow};
        `
      : css`
          background: transparent;
          color: ${theme.colors.textSecondary};

          &:hover {
            background: ${theme.colors.backgroundSecondary};
            color: ${theme.colors.text};
          }
        `}
`;

export const SectionCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  transition: background 0.15s ease, color 0.15s ease;

  ${({ $active, theme }) =>
    $active
      ? css`
          background: rgba(255, 255, 255, 0.22);
          color: #fff;
        `
      : css`
          background: ${theme.colors.backgroundSecondary};
          color: ${theme.colors.textMuted};
        `}
`;

export const SectionLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0 2px;
`;

/* ── PERIOD FILTER ────────────────────────────── */
export const PeriodFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`;

export const PeriodChip = styled.button`
  padding: 4px 11px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderPrimary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* ── FLOW LIST ──────────────────────────────────── */
export const FlowList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

/* ── LOAD MORE ───────────────────────────────────── */
export const LoadMoreButton = styled.button`
  width: 100%;
  padding: 11px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderPrimary};
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

/* ── SKELETON ─────────────────────────────────────── */
export const SkeletonCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

export const SkeletonLine = styled.div`
  height: ${({ $h }) => $h || "14px"};
  width: ${({ $w }) => $w || "100%"};
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.backgroundSecondary} 25%,
    rgba(0, 0, 0, 0.05) 50%,
    ${({ theme }) => theme.colors.backgroundSecondary} 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.6s infinite linear;
`;
