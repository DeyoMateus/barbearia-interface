import styled from "styled-components";
import { Link as ReactLink } from "react-router-dom";

// Para Textos e Formulários font-family: 'Montserrat', sans-serif;
// Para Títulos font-family: 'Cinzel', sans-serif;

export const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: auto;
  background: #080808;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Montserrat", sans-serif;
  padding: 16px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 24px;
  }
`;

export const CanvasBackground = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const RightContainer = styled.div`
  background: rgba(8, 8, 8, 0.75);
  border: 1px solid rgba(184, 144, 56, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 28px 18px;
  width: 100%;
  max-width: 360px;
  box-sizing: border-box;
  position: relative;
  box-shadow:
    0 0 60px rgba(180, 130, 20, 0.15),
    inset 0 0 40px rgba(0, 0, 0, 0.6);
  z-index: 2;
  border-radius: 12px;
  text-align: center;

  @media (min-width: 480px) {
    padding: 36px 28px;
  }

  @media (min-width: 768px) {
    padding: 40px 30px;
    max-width: 380px;
  }
`;

export const BrandArea = styled.div`
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: clamp(12px, 3.5vw, 14px);
    color: #c9a84c;
    letter-spacing: clamp(3px, 1.2vw, 6px);
    display: block;
    margin-bottom: 10px;
  }

  img {
    width: 100%;
    max-width: 140px;
    height: auto;
    margin-bottom: 10px;

    @media (min-width: 480px) {
      max-width: 180px;
    }

    @media (min-width: 768px) {
      max-width: 220px;
    }
  }

  p {
    font-family: "Cinzel", sans-serif;
    font-size: clamp(10px, 2.5vw, 12px);
    color: rgba(184, 144, 56, 0.6);
    letter-spacing: clamp(3px, 1vw, 5px);
    text-transform: uppercase;
  }
`;

export const Divider = styled.div`
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  margin: 0 auto 24px;

  @media (min-width: 480px) {
    width: 100px;
    margin-bottom: 32px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const InputContainer = styled.div`
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 480px) {
    margin-bottom: 20px;
  }

  label {
    display: block;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(184, 144, 56, 0.8);
    margin-bottom: 6px;
    text-align: left;

    @media (min-width: 480px) {
      letter-spacing: 3px;
      margin-bottom: 8px;
    }
  }

  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 6px;
    color: #f0dfa0;
    /* 16px no mobile previne zoom automatico do iOS ao focar no campo */
    font-size: 16px;
    padding: 12px 14px;
    outline: none;
    box-sizing: border-box;
    transition:
      border-color 0.25s ease,
      background-color 0.25s ease;

    @media (min-width: 768px) {
      font-size: 14px;
      padding: 14px;
    }

    &::placeholder {
      color: rgba(184, 144, 56, 0.3);
    }

    &:hover {
      border-color: rgba(184, 144, 56, 0.3);
      background: rgba(255, 255, 255, 0.07);
    }

    &:focus {
      border-color: rgba(201, 168, 76, 0.6);
      background: rgba(255, 255, 255, 0.08);
    }
  }

  p {
    color: #ff4d4d;
    font-size: 11px;
    margin-top: 5px;
    text-align: left;
  }
`;

export const CardTopBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #d4aa50, transparent);
`;

export const CardBottomBorder = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(180, 130, 20, 0.4),
    transparent
  );
`;

export const FooterText = styled.div`
  margin-top: 20px;
  font-size: 12px;
  color: rgba(184, 144, 56, 0.5);
  letter-spacing: 1px;
  text-align: center;

  @media (min-width: 480px) {
    margin-top: 25px;
  }
`;

export const Link = styled(ReactLink)`
  color: #c9a84c;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.2s;

  &:hover {
    color: #f0dfa0;
    text-decoration: underline;
  }
`;
