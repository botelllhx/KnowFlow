export const theme = {
  colors: {
    // Core brand
    primary: "#233DFF",
    primaryHover: "#1A2ECC",
    primaryLight: "rgba(35, 61, 255, 0.09)",
    primaryGlow: "rgba(35, 61, 255, 0.18)",

    secondary: "#6C63FF",
    secondaryLight: "rgba(108, 99, 255, 0.09)",

    // Apple-style light surfaces
    background: "#F5F5F7",
    backgroundSecondary: "#EBEBED",
    surface: "rgba(255, 255, 255, 0.90)",
    surfaceHover: "rgba(255, 255, 255, 1)",
    surfaceElevated: "rgba(255, 255, 255, 0.95)",

    // Frosted glass — Apple visionOS / macOS style
    glass: "rgba(255, 255, 255, 0.70)",
    glassStrong: "rgba(255, 255, 255, 0.85)",

    // Sidebar — Apple Finder / Settings frosted panel
    sidebar: "rgba(248, 248, 250, 0.82)",
    sidebarBorder: "rgba(0, 0, 0, 0.07)",

    // Text hierarchy — Apple SF Pro values
    text: "#1D1D1F",
    textSecondary: "#6E6E73",
    textLight: "#86868B",
    textMuted: "#AEAEB2",

    // Borders — ultra-subtle Apple style
    border: "rgba(0, 0, 0, 0.07)",
    borderStrong: "rgba(0, 0, 0, 0.12)",
    borderPrimary: "rgba(35, 61, 255, 0.22)",

    // Semantic — Apple HIG colors
    white: "#FFFFFF",
    error: "#FF3B30",
    errorLight: "rgba(255, 59, 48, 0.09)",
    success: "#34C759",
    successLight: "rgba(52, 199, 89, 0.09)",
    warning: "#FF9500",
    warningLight: "rgba(255, 149, 0, 0.09)",

    // Accent tints
    backgroundblue: "rgba(35, 61, 255, 0.06)",
    backgroundBlue: "rgba(35, 61, 255, 0.06)",
    backgroundPurple: "rgba(108, 99, 255, 0.06)",

    // Overlay
    overlay: "rgba(0, 0, 0, 0.28)",
    overlayLight: "rgba(0, 0, 0, 0.10)",
  },

  gradients: {
    primary: "linear-gradient(135deg, #233DFF 0%, #6C63FF 100%)",
    primarySubtle: "linear-gradient(135deg, rgba(35,61,255,0.07) 0%, rgba(108,99,255,0.04) 100%)",
    glass: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 100%)",
    surface: "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.92) 100%)",
    glow: "radial-gradient(circle at 50% -10%, rgba(35,61,255,0.07) 0%, transparent 65%)",
    // Ambient atmosphere for background
    ambient: "radial-gradient(ellipse at 30% 20%, rgba(35,61,255,0.04) 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, rgba(108,99,255,0.03) 0%, transparent 55%)",
  },

  borderRadius: {
    xs: "4px",
    small: "6px",
    medium: "12px",
    large: "16px",
    xl: "20px",
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

  // Apple-style soft multi-layer shadows
  shadows: {
    xs: "0 1px 2px rgba(0, 0, 0, 0.04)",
    small: "0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)",
    medium: "0 4px 16px rgba(0, 0, 0, 0.07), 0 2px 6px rgba(0, 0, 0, 0.04)",
    large: "0 8px 28px rgba(0, 0, 0, 0.09), 0 3px 8px rgba(0, 0, 0, 0.04)",
    xl: "0 16px 48px rgba(0, 0, 0, 0.11), 0 6px 16px rgba(0, 0, 0, 0.05)",
    primary: "0 4px 20px rgba(35, 61, 255, 0.24), 0 2px 8px rgba(35, 61, 255, 0.12)",
    primaryHover: "0 8px 28px rgba(35, 61, 255, 0.32), 0 4px 12px rgba(35, 61, 255, 0.16)",
    // Apple glass shadow — subtle inset highlight + drop
    glass: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(0,0,0,0.04)",
    // Card hover lift
    hover: "0 12px 36px rgba(0, 0, 0, 0.10), 0 4px 10px rgba(0, 0, 0, 0.04)",
  },

  blur: {
    sm: "blur(8px)",
    md: "blur(16px)",
    lg: "blur(24px)",
    xl: "blur(40px)",
    // Apple-style saturated blur
    apple: "blur(20px) saturate(180%)",
    appleStrong: "blur(32px) saturate(200%)",
  },

  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif",
    headingFamily: "'Source Serif 4', 'Georgia', 'Times New Roman', serif",
    fontSizes: {
      xs: "11px",
      sm: "13px",
      base: "14px",
      md: "15px",
      lg: "17px",
      xl: "19px",
      "2xl": "22px",
      "3xl": "28px",
      "4xl": "34px",
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: "-0.03em",
      normal: "0em",
      wide: "0.015em",
      wider: "0.04em",
    },
  },

  transitions: {
    fast: "all 0.12s cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "all 0.20s cubic-bezier(0.4, 0, 0.2, 1)",
    smooth: "all 0.30s cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "all 0.40s cubic-bezier(0.34, 1.56, 0.64, 1)",
    spring: "all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
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
