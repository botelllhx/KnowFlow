import styled from "styled-components";

export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 24px 80px;
  position: relative;
  overflow: hidden;

  /* Ambient mesh gradients */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(35, 61, 255, 0.06) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, rgba(108, 99, 255, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 60% 80%, rgba(35, 61, 255, 0.04) 0%, transparent 45%);
    pointer-events: none;
  }
`;

export const HeroInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #233dff;
  background: rgba(35, 61, 255, 0.08);
  border: 1px solid rgba(35, 61, 255, 0.18);
  border-radius: 999px;
  padding: 5px 12px;
  margin-bottom: 24px;
  width: fit-content;

  @media (max-width: 900px) {
    margin-left: auto;
    margin-right: auto;
  }
`;

export const HeroTitle = styled.h1`
  font-family: "Source Serif 4", "Georgia", serif;
  font-size: clamp(36px, 4.5vw, 58px);
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.12;
  letter-spacing: -0.03em;
  margin-bottom: 24px;

  em {
    font-style: italic;
    color: #233dff;
    font-weight: 400;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 17px;
  color: #6e6e73;
  line-height: 1.65;
  max-width: 420px;
  margin-bottom: 36px;
  letter-spacing: -0.01em;

  @media (max-width: 900px) {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

export const HeroPrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  background: #233dff;
  color: #fff;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: -0.02em;
  transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
  box-shadow: 0 4px 16px rgba(35, 61, 255, 0.24);

  &:hover {
    background: #1a2ecc;
    box-shadow: 0 8px 24px rgba(35, 61, 255, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HeroSecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 20px;
  background: transparent;
  color: #6e6e73;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
    color: #1d1d1f;
    border-color: rgba(0, 0, 0, 0.14);
  }
`;

export const TrustBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

export const TrustAvatars = styled.div`
  display: flex;
`;

export const TrustAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: ${({ $index }) =>
    ["rgba(35,61,255,0.15)", "rgba(108,99,255,0.15)", "rgba(52,199,89,0.15)", "rgba(255,149,0,0.15)"][
      $index % 4
    ]};
  color: ${({ $index }) =>
    ["#233DFF", "#6C63FF", "#34C759", "#FF9500"][$index % 4]};
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ $index }) => ($index > 0 ? "-8px" : "0")};
`;

export const TrustText = styled.p`
  font-size: 13px;
  color: #86868b;
  letter-spacing: -0.01em;
`;

/* ── PRODUCT VISUAL ─────────────────────────── */

export const HeroVisual = styled.div`
  position: relative;

  @media (max-width: 900px) {
    max-width: 560px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const BrowserFrame = styled.div`
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  background: #fff;
`;

export const BrowserBar = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  background: #f5f5f7;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
`;

export const BrowserDots = styled.div`
  display: flex;
  gap: 5px;
  flex-shrink: 0;

  span {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.15);
    display: block;
  }

  span:nth-child(1) { background: #FF5F57; }
  span:nth-child(2) { background: #FFBD2E; }
  span:nth-child(3) { background: #28C840; }
`;

export const BrowserContent = styled.div`
  height: 320px;
  background:
    radial-gradient(ellipse at 30% 30%, rgba(35, 61, 255, 0.04) 0%, transparent 60%),
    #FAFAFA;
  position: relative;
  overflow: hidden;
`;

export const CanvasMockup = styled.div`
  position: absolute;
  inset: 0;
`;

export const MockupNode = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $w }) => $w}%;
  height: ${({ $h }) => $h}%;
  background: ${({ $primary }) =>
    $primary ? "rgba(35,61,255,0.10)" : "rgba(255,255,255,0.95)"};
  border: 1px solid ${({ $primary }) =>
    $primary ? "rgba(35,61,255,0.25)" : "rgba(0,0,0,0.08)"};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const MockupLine = styled.div`
  position: absolute;
  left: ${({ $x1 }) => $x1}%;
  top: ${({ $y1 }) => $y1}%;
  width: ${({ $x2, $x1 }) => $x2 - $x1}%;
  height: 1px;
  background: rgba(35, 61, 255, 0.20);
`;

export const FloatingCard = styled.div`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: 22%;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
  display: flex;
  flex-direction: column;
  gap: 5px;

  div {
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.07);
  }

  div:nth-child(1) { height: 8px; width: 70%; }
  div:nth-child(2) { height: 6px; width: 90%; }
  div:nth-child(3) { height: 6px; width: 55%; }
`;
