import styled from "styled-components";

export const PlansSection = styled.section`
  padding: 100px 24px;
  background: #FAFAFA;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.07) 20%,
      rgba(0, 0, 0, 0.07) 80%,
      transparent
    );
  }
`;

export const PlansInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
`;

export const PlansHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const PlansEyebrow = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #233dff;
  margin-bottom: 16px;
`;

export const PlansTitle = styled.h2`
  font-family: "Source Serif 4", "Georgia", serif;
  font-size: clamp(28px, 3.5vw, 42px);
  font-weight: 700;
  color: #1d1d1f;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 16px;

  em {
    font-style: italic;
    color: #233dff;
    font-weight: 400;
  }
`;

export const PlansSubtitle = styled.p`
  font-size: 16px;
  color: #6e6e73;
  line-height: 1.65;
  letter-spacing: -0.01em;
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    max-width: 420px;
    margin: 0 auto;
  }
`;

export const PlanCard = styled.div`
  background: ${({ $highlight }) => ($highlight ? "#233DFF" : "#fff")};
  border: 1px solid
    ${({ $highlight }) =>
      $highlight ? "transparent" : "rgba(0,0,0,0.07)"};
  border-radius: 20px;
  padding: 32px;
  position: relative;
  box-shadow: ${({ $highlight }) =>
    $highlight
      ? "0 16px 48px rgba(35,61,255,0.25), 0 4px 12px rgba(35,61,255,0.15)"
      : "0 2px 8px rgba(0,0,0,0.05)"};
  transform: ${({ $highlight }) => ($highlight ? "scale(1.04)" : "scale(1)")};
  transition: box-shadow 0.25s ease, transform 0.25s ease;

  &:hover {
    box-shadow: ${({ $highlight }) =>
      $highlight
        ? "0 20px 56px rgba(35,61,255,0.32), 0 6px 16px rgba(35,61,255,0.18)"
        : "0 8px 28px rgba(0,0,0,0.09)"};
    transform: ${({ $highlight }) =>
      $highlight ? "scale(1.05) translateY(-2px)" : "translateY(-2px)"};
  }
`;

export const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  color: #233dff;
  background: rgba(35, 61, 255, 0.12);
  border: 1px solid rgba(35, 61, 255, 0.20);
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 16px;
  letter-spacing: 0.02em;
`;

export const PlanName = styled.div`
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ $highlight }) => ($highlight ? "rgba(255,255,255,0.65)" : "#86868B")};
  margin-bottom: 12px;
`;

export const PlanPrice = styled.div`
  font-family: "Source Serif 4", "Georgia", serif;
  font-size: 36px;
  font-weight: 700;
  color: ${({ $highlight }) => ($highlight ? "#fff" : "#1D1D1F")};
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;
`;

export const PlanPriceUnit = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0;
`;

export const PlanDesc = styled.p`
  font-size: 13.5px;
  color: ${({ $highlight }) => ($highlight ? "rgba(255,255,255,0.70)" : "#6E6E73")};
  line-height: 1.6;
  letter-spacing: -0.01em;
  margin-bottom: 24px;
`;

export const PlanDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => "rgba(0,0,0,0.07)"};
  margin-bottom: 24px;
`;

export const PlanFeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const PlanFeature = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13.5px;
  color: ${({ $highlight }) => ($highlight ? "rgba(255,255,255,0.85)" : "#4A4A4A")};
  line-height: 1.5;
  letter-spacing: -0.01em;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: ${({ $highlight }) => ($highlight ? "rgba(255,255,255,0.85)" : "#34C759")};
  }
`;

export const PlanCTA = styled.a`
  display: block;
  width: 100%;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $highlight }) =>
    $highlight
      ? `
    background: rgba(255,255,255,0.95);
    color: #233DFF;
    &:hover {
      background: #fff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      transform: translateY(-1px);
    }
  `
      : `
    background: #233DFF;
    color: #fff;
    box-shadow: 0 2px 8px rgba(35,61,255,0.20);
    &:hover {
      background: #1A2ECC;
      box-shadow: 0 6px 20px rgba(35,61,255,0.30);
      transform: translateY(-1px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;
