export const theme = {
  colors: {
    // Core brand (preservado + expandido)
    primary: "#233DFF",
    primaryHover: "#1A2ECC",
    primaryLight: "rgba(35, 61, 255, 0.12)",
    primaryGlow: "rgba(35, 61, 255, 0.25)",

    secondary: "#6C63FF",
    secondaryLight: "rgba(108, 99, 255, 0.12)",

    // Surfaces — Liquid Glass
    background: "#F7F8FC",
    backgroundSecondary: "#EFF1F8",
    surface: "rgba(255, 255, 255, 0.85)",
    surfaceHover: "rgba(255, 255, 255, 0.95)",
    surfaceElevated: "rgba(255, 255, 255, 0.92)",
    glass: "rgba(255, 255, 255, 0.60)",
    glassStrong: "rgba(255, 255, 255, 0.80)",

    // Sidebar
    sidebar: "rgba(255, 255, 255, 0.92)",
    sidebarBorder: "rgba(35, 61, 255, 0.08)",

    // Text hierarchy
    text: "#1A1D23",
    textSecondary: "#4A5168",
    textLight: "#8B92A5",
    textMuted: "#B4BAC8",

    // Borders
    border: "rgba(0, 0, 0, 0.07)",
    borderStrong: "rgba(0, 0, 0, 0.12)",
    borderPrimary: "rgba(35, 61, 255, 0.20)",

    // Semantic
    white: "#FFFFFF",
    error: "#FF3B6B",
    errorLight: "rgba(255, 59, 107, 0.10)",
    success: "#00C98D",
    successLight: "rgba(0, 201, 141, 0.10)",
    warning: "#FFB020",
    warningLight: "rgba(255, 176, 32, 0.10)",

    // Accent tints (compatibilidade + novos)
    backgroundblue: "rgba(35, 61, 255, 0.08)",
    backgroundBlue: "rgba(35, 61, 255, 0.08)",
    backgroundPurple: "rgba(108, 99, 255, 0.08)",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.40)",
    overlayLight: "rgba(0, 0, 0, 0.15)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #233DFF 0%, #6C63FF 100%)",
    primarySubtle: "linear-gradient(135deg, rgba(35,61,255,0.08) 0%, rgba(108,99,255,0.08) 100%)",
    glass: "linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.60) 100%)",
    surface: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(247,248,252,0.90) 100%)",
    glow: "radial-gradient(circle at 50% 0%, rgba(35,61,255,0.12) 0%, transparent 70%)",
  },

  borderRadius: {
    xs: "4px",
    small: "6px",
    medium: "12px",
    large: "16px",
    xl: "24px",
    pill: "999px",
    circle: "50%",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
    xxxl: "64px",
  },

  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
    small: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
    large: "0 8px 32px rgba(0, 0, 0, 0.10), 0 4px 8px rgba(0, 0, 0, 0.05)",
    xl: "0 16px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06)",
    primary: "0 4px 24px rgba(35, 61, 255, 0.25), 0 2px 8px rgba(35, 61, 255, 0.15)",
    primaryHover: "0 8px 32px rgba(35, 61, 255, 0.35), 0 4px 12px rgba(35, 61, 255, 0.20)",
    glass: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
  },

  blur: {
    sm: "blur(8px)",
    md: "blur(16px)",
    lg: "blur(24px)",
    xl: "blur(40px)",
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSizes: {
      xs: "11px",
      sm: "13px",
      base: "14px",
      md: "15px",
      lg: "16px",
      xl: "18px",
      "2xl": "20px",
      "3xl": "24px",
      "4xl": "30px",
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
    },
  },

  transitions: {
    fast: "all 0.12s ease",
    normal: "all 0.2s ease",
    smooth: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  zIndex: {
    base: 0,
    raised: 10,
    dropdown: 100,
    sticky: 200,
    overlay: 300,
    modal: 400,
    toast: 500,
  },
};
