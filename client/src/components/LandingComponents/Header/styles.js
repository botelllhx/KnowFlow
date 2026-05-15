import styled from "styled-components";
import { Link } from "react-router-dom";

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1080px;
  z-index: 900;
  border-radius: 14px;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  background: ${({ $scrolled }) =>
    $scrolled ? "rgba(255,255,255,0.88)" : "rgba(250,250,250,0.65)"};
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid
    ${({ $scrolled }) =>
      $scrolled ? "rgba(0,0,0,0.09)" : "rgba(0,0,0,0.06)"};
  box-shadow: ${({ $scrolled }) =>
    $scrolled
      ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)"
      : "0 2px 12px rgba(0,0,0,0.04)"};
`;

export const HeaderInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  gap: 16px;
`;

export const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
  flex-shrink: 0;
`;

export const LogoImg = styled.img`
  width: 28px;
  height: 28px;
  object-fit: contain;
`;

export const LogoName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
  letter-spacing: -0.4px;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 640px) {
    display: none;
  }
`;

export const NavLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #6e6e73;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    color: #1d1d1f;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

export const LoginLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: #6e6e73;
  padding: 7px 14px;
  border-radius: 9px;
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
  letter-spacing: -0.01em;

  &:hover {
    color: #1d1d1f;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const SignUpLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #233dff;
  padding: 7px 16px;
  border-radius: 9px;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: background 0.15s ease, box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: #1a2ecc;
    box-shadow: 0 4px 16px rgba(35, 61, 255, 0.28);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
