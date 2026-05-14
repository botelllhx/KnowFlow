import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 24px;
  background: ${({ theme }) => theme.colors.background};
  text-align: center;
`;

const Code = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 400px;
  line-height: 1.6;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const ButtonPrimary = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const ButtonOutline = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border || 'rgba(255,255,255,0.1)'};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Code>404 — Página não encontrada</Code>
      <Title>Esta página não existe</Title>
      <Description>
        O endereço que você acessou não existe ou foi removido.
        Verifique o link ou volte ao feed.
      </Description>
      <Actions>
        <ButtonPrimary onClick={() => navigate('/feed')}>
          Ir para o Feed
        </ButtonPrimary>
        <ButtonOutline onClick={() => navigate(-1)}>
          Voltar
        </ButtonOutline>
      </Actions>
    </Container>
  );
};

export default NotFound;
