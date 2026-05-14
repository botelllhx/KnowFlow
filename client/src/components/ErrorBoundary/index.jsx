import { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 24px;
  background: ${({ theme }) => theme?.colors?.background || '#0A0F1E'};
  text-align: center;
`;

const Code = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme?.colors?.primary || '#233DFF'};
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#1A1D23'};
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#94A3B8'};
  max-width: 420px;
  line-height: 1.6;
  margin: 0;
`;

const Button = styled.button`
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme?.colors?.primary || '#233DFF'};
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload() {
    window.location.href = '/feed';
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container>
          <Code>Erro inesperado</Code>
          <Title>Algo deu errado</Title>
          <Description>
            Ocorreu um erro inesperado. A equipe já foi notificada.
            Tente voltar ao feed ou recarregue a página.
          </Description>
          <Button onClick={this.handleReload}>Voltar ao Feed</Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
