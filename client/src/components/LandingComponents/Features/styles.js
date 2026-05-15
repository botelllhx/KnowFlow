import styled from "styled-components";

export const FeaturesSection = styled.section`
  padding: 100px 24px;
  background: #fff;
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

export const FeaturesInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  width: 100%;
`;

export const FeaturesHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

export const FeaturesEyebrow = styled.div`
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #233dff;
  margin-bottom: 16px;
`;

export const FeaturesTitle = styled.h2`
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

export const FeaturesSubtitle = styled.p`
  font-size: 16px;
  color: #6e6e73;
  line-height: 1.65;
  letter-spacing: -0.01em;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  background: #fafafa;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 16px;
  padding: 28px;
  cursor: default;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
    border-color: rgba(0, 0, 0, 0.10);
    background: #fff;
  }
`;

export const FeatureIconBox = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

export const FeatureCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
  line-height: 1.3;
`;

export const FeatureCardDesc = styled.p`
  font-size: 14px;
  color: #6e6e73;
  line-height: 1.65;
  letter-spacing: -0.01em;
`;
