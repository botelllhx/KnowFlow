import styled from "styled-components";
import { Ellipsis, GitBranch, Eye, Heart, MessageCircle, Bookmark } from "lucide-react";

export const FlowCardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FlowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 20px;
  position: relative;
  gap: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  border-top-left-radius: 0px;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  transition: box-shadow 0.2s ${({ theme }) => theme.transitions?.smooth || 'ease'}, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(35, 61, 255, 0.08);
    border-color: ${({ theme }) => theme.colors.borderPrimary};
  }

  &:hover h2 {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FlowHat = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 20px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.04em;
  text-transform: capitalize;
  background: ${({ theme }) => theme.gradients?.primary || 'linear-gradient(135deg, #6c63ff, #233dff)'};
  position: absolute;
  top: -30px;
  left: -1px;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 0;
`;

export const FlowHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;

export const Avatar = styled.div`
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.borderPrimary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const FlowAuthor = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FlowDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const AuthorRole = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

export const DaysPublished = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
  flex-shrink: 0;
  transition: background 0.15s ease, color 0.15s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ActionIcon = styled(Ellipsis)`
  width: 16px;
  height: 16px;
`;

export const FlowPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;

export const MetaBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 0;

  &:empty {
    display: none;
  }
`;

export const ForkBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.backgroundPurple};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary}33;
  letter-spacing: 0.02em;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.success}33;
  letter-spacing: 0.02em;
`;

export const FlowTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
  transition: color 0.15s ease;
`;

export const FlowDescription = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const FlowTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;

  &:empty {
    display: none;
  }
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;
`;

export const FlowMacro = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 2px;
`;

export const FlowNodes = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const NodeIcon = styled(GitBranch)`
  width: 13px;
  height: 13px;
  margin-right: 5px;
`;

export const FlowViews = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
`;

export const ViewIcon = styled(Eye)`
  width: 13px;
  height: 13px;
  margin-right: 5px;
`;

export const FlowFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 4px;
`;

export const FlowCategory = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

/* Legado — mantido para compatibilidade com botões de ação */
export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const LikeIcon = styled(Heart)`
  width: 15px;
  height: 15px;
`;

export const CommentIcon = styled(MessageCircle)`
  width: 15px;
  height: 15px;
`;

export const SaveIcon = styled(Bookmark)`
  width: 15px;
  height: 15px;
`;
