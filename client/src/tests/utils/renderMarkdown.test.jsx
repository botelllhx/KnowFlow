import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import renderMarkdown from '../../utils/renderMarkdown';

describe('renderMarkdown', () => {
  it('retorna null para texto vazio', () => {
    expect(renderMarkdown('')).toBeNull();
    expect(renderMarkdown(null)).toBeNull();
    expect(renderMarkdown(undefined)).toBeNull();
  });

  it('renderiza parágrafo simples', () => {
    const elements = renderMarkdown('Olá mundo');
    const { container } = render(<>{elements}</>);
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.textContent).toBe('Olá mundo');
  });

  it('renderiza texto em negrito com **', () => {
    const elements = renderMarkdown('texto **negrito** aqui');
    const { container } = render(<>{elements}</>);
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong.textContent).toBe('negrito');
  });

  it('renderiza texto em itálico com *', () => {
    const elements = renderMarkdown('texto *itálico* aqui');
    const { container } = render(<>{elements}</>);
    const em = container.querySelector('em');
    expect(em).toBeInTheDocument();
    expect(em.textContent).toBe('itálico');
  });

  it('renderiza código inline com `backticks`', () => {
    const elements = renderMarkdown('use `npm install` para instalar');
    const { container } = render(<>{elements}</>);
    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code.textContent).toBe('npm install');
  });

  it('renderiza lista não-ordenada com -', () => {
    const elements = renderMarkdown('- item um\n- item dois\n- item três');
    const { container } = render(<>{elements}</>);
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    const items = ul.querySelectorAll('li');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toBe('item um');
  });

  it('renderiza lista ordenada com 1.', () => {
    const elements = renderMarkdown('1. primeiro\n2. segundo');
    const { container } = render(<>{elements}</>);
    const ol = container.querySelector('ol');
    expect(ol).toBeInTheDocument();
    const items = ol.querySelectorAll('li');
    expect(items).toHaveLength(2);
  });

  it('renderiza múltiplos parágrafos separados por linha em branco', () => {
    const elements = renderMarkdown('parágrafo um\n\nparágrafo dois');
    const { container } = render(<>{elements}</>);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
  });

  it('insere <br> em linhas em branco', () => {
    const elements = renderMarkdown('linha\n\noutro');
    const { container } = render(<>{elements}</>);
    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('retorna array de elementos React', () => {
    const elements = renderMarkdown('texto');
    expect(Array.isArray(elements)).toBe(true);
    expect(elements.length).toBeGreaterThan(0);
  });
});
