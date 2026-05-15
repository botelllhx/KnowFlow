import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,300;1,8..60,400&display=swap');

  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif;
    --font-serif: 'Source Serif 4', 'Georgia', 'Times New Roman', serif;
    --color-primary: #233DFF;
    --color-primary-light: rgba(35, 61, 255, 0.09);
    --color-bg: #F5F5F7;
    --color-surface: rgba(255, 255, 255, 0.90);
    --color-text: #1D1D1F;
    --color-text-secondary: #6E6E73;
    --color-border: rgba(0, 0, 0, 0.07);
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.07);
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition: all 0.20s cubic-bezier(0.4, 0, 0.2, 1);
    --sidebar-collapsed: 64px;
    --sidebar-expanded: 240px;
  }

  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-sans);
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Subtle ambient depth — Apple-style */
    background-image:
      radial-gradient(ellipse at 25% 15%, rgba(35, 61, 255, 0.035) 0%, transparent 55%),
      radial-gradient(ellipse at 75% 85%, rgba(108, 99, 255, 0.025) 0%, transparent 55%);
    background-attachment: fixed;
  }

  .app-container {
    display: flex;
    height: 100dvh;
    width: 100%;
    overflow: hidden;
  }

  .content-area {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  /* Apple-style subtle scrollbar */
  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.14);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.24);
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: 6px;
  }

  button {
    cursor: pointer;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  input, textarea, select {
    font-family: var(--font-sans);
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default GlobalStyle;
