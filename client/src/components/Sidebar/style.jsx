import styled from "styled-components";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   SIDEBAR CONTAINER
   Collapsed: 64px | Expanded on hover: 240px
   Overlay mode — content does not shift
───────────────────────────────────────────── */
export const SidebarContainer = styled.aside`
  width: 64px;
  background: ${({ theme }) => theme.colors.sidebar};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid ${({ theme }) => theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: ${({ theme }) => theme.zIndex?.sticky || 200};
  /* Apple spring transition */
  transition: width 0.30s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.30s ease;
  overflow: hidden;
  box-shadow: 1px 0 0 ${({ theme }) => theme.colors.sidebarBorder};

  &:hover {
    width: 240px;
    box-shadow:
      4px 0 24px rgba(0, 0, 0, 0.07),
      1px 0 0 ${({ theme }) => theme.colors.sidebarBorder};
  }
`;

/* ── LOGO AREA ─────────────────────────────── */
export const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 13px 6px 14px;
  margin-bottom: 20px;
  flex-shrink: 0;
  overflow: hidden;
  min-height: 44px;
`;

export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const LogoWordmark = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.5px;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.18s ease 0.10s, transform 0.20s ease 0.10s;

  ${SidebarContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* ── NAVIGATION ────────────────────────────── */
export const NavSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 8px;
  flex: 1;
`;

export const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 9px;
  height: 38px;
  border-radius: 10px;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "transparent"};
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primaryLight : "rgba(0,0,0,0.04)"};
    color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.text};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const NavIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: inherit;
`;

export const NavLabel = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.18s ease 0.08s, transform 0.20s ease 0.08s;
  color: inherit;

  ${SidebarContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* ── DIVIDER ───────────────────────────────── */
export const SidebarDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: 6px 12px;
  flex-shrink: 0;
`;

/* ── BOTTOM SECTION ────────────────────────── */
export const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 8px;
  flex-shrink: 0;
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 9px;
  height: 38px;
  width: 100%;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  overflow: hidden;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.errorLight};
    color: ${({ theme }) => theme.colors.error};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const LogoutIconWrapper = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoutLabel = styled.span`
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.18s ease 0.08s, transform 0.20s ease 0.08s;

  ${SidebarContainer}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

/* ─────────────────────────────────────────────
   MODAL STYLES (kept for LogoutModal compat.)
───────────────────────────────────────────── */
export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.colors.overlay};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex?.modal || 400};
`;

export const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  max-width: 480px;
  width: 90%;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalHeader = styled.div`
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const ModalButton = styled.button`
  padding: 8px 18px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: ${({ variant, theme }) =>
    variant === "outline" ? `1px solid ${theme.colors.border}` : "none"};
  background: ${({ variant, theme }) =>
    variant === "outline" ? "transparent" : theme.colors.primary};
  color: ${({ variant, theme }) =>
    variant === "outline" ? theme.colors.text : "#fff"};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ variant, theme }) =>
      variant === "outline"
        ? theme.colors.backgroundSecondary
        : theme.colors.primaryHover};
    box-shadow: ${({ variant, theme }) =>
      variant === "outline" ? "none" : theme.shadows.primary};
  }
`;
