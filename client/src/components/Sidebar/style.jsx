import styled from "styled-components";
import { Link } from "react-router-dom";

export const SidebarContainer = styled.aside`
  width: 60px;
  background: ${(props) => props.theme.colors.glassStrong};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-right: 1px solid ${(props) => props.theme.colors.sidebarBorder};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => props.theme.spacing.md} 0;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: ${(props) => props.theme.zIndex?.sticky || 200};
  box-shadow: 2px 0 16px rgba(0, 0, 0, 0.04);
`;

export const Logo = styled.div`
  width: 32px;
  height: 32px;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const NavItem = styled(Link)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.active ? props.theme.colors.primary : props.theme.colors.textLight};
  margin-bottom: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  text-decoration: none;
  background-color: ${(props) =>
    props.active ? props.theme.colors.primaryLight : "transparent"};
  transition: ${(props) => props.theme.transitions?.normal || "all 0.2s ease"};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: -8px;
    width: 3px;
    height: ${(props) => props.active ? '20px' : '0'};
    background: ${(props) => props.theme.colors.primary};
    border-radius: 0 3px 3px 0;
    transition: height 0.2s ease;
  }

  &:hover {
    background-color: ${(props) => props.theme.colors.backgroundBlue};
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const LogoutButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textLight};
  margin-top: auto;
  margin-bottom: ${(props) => props.theme.spacing.sm};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: ${(props) => props.theme.transitions?.normal || "all 0.2s ease"};

  &:hover {
    background-color: ${(props) => props.theme.colors.errorLight};
    color: ${(props) => props.theme.colors.error};
  }
`;

export const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: ${(props) => props.theme.colors.overlay};
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${(props) => props.theme.zIndex?.modal || 400};
`;

export const ModalContent = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: ${(props) => props.theme.borderRadius.large};
  max-width: 480px;
  width: 90%;
  box-shadow: ${(props) => props.theme.shadows.xl};
  border: 1px solid ${(props) => props.theme.colors.border};
`;

export const ModalHeader = styled.div`
  padding: 20px 24px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  letter-spacing: -0.02em;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  color: ${(props) => props.theme.colors.textLight};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background: ${(props) => props.theme.colors.backgroundSecondary};
    color: ${(props) => props.theme.colors.text};
  }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
  line-height: 1.6;
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid ${(props) => props.theme.colors.border};
`;

export const ModalButton = styled.button`
  padding: 8px 18px;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  border: ${({ variant, theme }) =>
    variant === "outline" ? `1px solid ${theme.colors.border}` : "none"};
  background: ${({ variant, theme }) =>
    variant === "outline" ? "transparent" : theme.colors.primary};
  color: ${({ variant, theme }) =>
    variant === "outline" ? theme.colors.text : "#fff"};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ variant, theme }) =>
      variant === "outline" ? theme.colors.backgroundSecondary : theme.colors.primaryHover};
    box-shadow: ${({ variant, theme }) =>
      variant === "outline" ? "none" : theme.shadows.primary};
  }
`;
