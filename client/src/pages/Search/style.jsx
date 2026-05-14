import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  padding: 32px 40px;
  background: #0a0a0f;
  color: #fff;
`;

export const SearchHeader = styled.div`
  margin-bottom: 32px;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 16px;
  outline: none;
  backdrop-filter: blur(16px);
  box-sizing: border-box;

  &:focus {
    border-color: #233DFF;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

export const ResultCount = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 12px;
`;

export const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`;

export const ResultCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(35, 61, 255, 0.3);
    transform: translateY(-2px);
  }
`;

export const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
`;

export const CardDesc = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardMeta = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.07);
  font-size: 11px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 0;
  color: rgba(255, 255, 255, 0.3);
`;

export const Loading = styled.div`
  text-align: center;
  padding: 40px 0;
  color: rgba(255, 255, 255, 0.3);
`;
