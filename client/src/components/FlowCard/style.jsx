import styled from "styled-components";
import { Ellipsis, GitBranch, Eye, Heart, MessageCircle, Bookmark } from "lucide-react";

/* ─────────────────────────────────────────────
   FLOW CARD — Apple-style premium light glass
───────────────────────────────────────────── */

export const FlowCardContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const FlowWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  padding: 20px 20px 16px;
  position: relative;
  gap: 10px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.25s ease,
              transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.hover};
    border-color: rgba(0, 0, 0, 0.10);
  }
`;

/* Category pill — inline at top of card */
export const FlowHat = styled.div`
  display: inline-flex;
  align-items: center;
  self-align: flex-start;
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1px solid ${({ theme }) => theme.colors.borderPrimary};
  border-radius: 6px;
  padding: 3px 8px;
  width: fit-content;
`;

export const FlowHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  border: 1.5px solid ${({ theme }) => theme.colors.borderPrimary};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.02em;
`;

export const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
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
  letter-spacing: -0.01em;
`;

export const FlowDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const AuthorRole = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Dot = styled.span`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0;
`;

export const DaysPublished = styled.span`
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-left: auto;
  flex-shrink: 0;
  transition: background 0.12s ease, color 0.12s ease;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const ActionIcon = styled(Ellipsis)`
  width: 15px;
  height: 15px;
`;

export const FlowPreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const MetaBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

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
  padding: 2px 7px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.backgroundPurple};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.secondary}28;
  letter-spacing: 0.01em;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.successLight};
  color: ${({ theme }) => theme.colors.success};
  border: 1px solid ${({ theme }) => theme.colors.success}28;
  letter-spacing: 0.01em;
`;

export const FlowTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.headingFamily};
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.35;
  letter-spacing: -0.01em;
  transition: color 0.15s ease;

  ${FlowWrapper}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const FlowDescription = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const FlowTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  &:empty {
    display: none;
  }
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 500;
  letter-spacing: -0.005em;
`;

export const FlowMacro = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const FlowNodes = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11.5px;
`;

export const NodeIcon = styled(GitBranch)`
  width: 12px;
  height: 12px;
  margin-right: 4px;
`;

export const FlowViews = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11.5px;
`;

export const ViewIcon = styled(Eye)`
  width: 12px;
  height: 12px;
  margin-right: 4px;
`;

export const FlowFooter = styled.footer`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
`;

export const FlowCategory = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 600;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  background: transparent;
  border: none;
  border-radius: 7px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12.5px;
  font-weight: 500;
  transition: background 0.12s ease, color 0.12s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const LikeIcon = styled(Heart)`
  width: 14px;
  height: 14px;
`;

export const CommentIcon = styled(MessageCircle)`
  width: 14px;
  height: 14px;
`;

export const SaveIcon = styled(Bookmark)`
  width: 14px;
  height: 14px;
`;
