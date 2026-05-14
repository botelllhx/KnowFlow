import styled from "styled-components";
import { Heart } from "lucide-react";

export const Button = styled.button`
  display: flex;
  gap: 3px;
  align-items: center;
  padding: 12px 12px;
  border-radius: 5px;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : "#fff"};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.primaryLight : "#f5f5f5"};
    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

export const LikeIcon = styled(Heart)`
  width: 16px;
  height: 16px;
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : "#565656")};
  fill: ${({ $active, theme }) => ($active ? theme.colors.primary : "none")};
  transition: color 0.2s ease, fill 0.2s ease;
`;
