import styled from "styled-components";
import { Power } from "lucide-react";

export const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1100;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.06);
  padding: 24px;
  gap: 0;
  width: 360px;
  max-width: 90vw;
`;

export const ModalHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`;

export const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 600;
  color: #1D1D1F;
  letter-spacing: -0.025em;
`;

export const ModalBody = styled.div`
  font-size: 14px;
  color: #6E6E73;
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export const ModalButton = styled.button`
  padding: 8px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  border: ${({ variant }) =>
    variant === "outline" ? "1px solid rgba(0,0,0,0.12)" : "none"};
  background: ${({ variant }) =>
    variant === "outline" ? "transparent" : "#FF3B30"};
  color: ${({ variant }) =>
    variant === "outline" ? "#1D1D1F" : "#fff"};
  letter-spacing: -0.01em;

  &:hover {
    background: ${({ variant }) =>
      variant === "outline" ? "rgba(0,0,0,0.04)" : "#D62C22"};
    box-shadow: ${({ variant }) =>
      variant === "outline" ? "none" : "0 4px 12px rgba(255,59,48,0.30)"};
  }
`;

export const CloseButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: #86868B;
  margin-left: auto;
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
    color: #1D1D1F;
  }
`;

export const LogOutIcon = styled(Power)`
  stroke: #233DFF;
  width: 20px;
  height: 20px;
`;
