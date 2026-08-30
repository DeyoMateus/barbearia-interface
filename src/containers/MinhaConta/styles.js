import styled from "styled-components";
import { C as themeColors, font as themeFonts } from "../../constants/theme.js";

export const Container = styled.div`
  background: ${themeColors?.bg || "#0a0a08"};
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  padding: 60px 16px 40px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 80px 20px 50px;
  }

  @media (min-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const Title = styled.h2`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
  font-size: clamp(22px, 5vw, 28px);
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: ${themeColors?.muted || "#888"};
  font-size: clamp(13px, 3.5vw, 14px);
  margin-bottom: 24px;

  @media (min-width: 480px) {
    margin-bottom: 40px;
  }
`;

export const Card = styled.div`
  background: ${themeColors?.card || "#161614"};
  border: 1px solid ${themeColors?.border || "#262624"};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 24px;
    margin-bottom: 24px;
  }
`;

export const CardTitle = styled.h3`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.text || "#fff"};
  font-size: clamp(16px, 4vw, 18px);
  margin-bottom: 8px;
`;

export const CardDescription = styled.p`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: ${themeColors?.muted || "#888"};
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 18px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${themeColors?.border || "#262624"};
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 13px;

  @media (min-width: 480px) {
    font-size: 14px;
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabel = styled.span`
  color: ${themeColors?.muted || "#888"};
`;

export const InfoValue = styled.span`
  color: ${themeColors?.text || "#fff"};
  font-weight: 600;
  text-align: right;
  word-break: break-word;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.$danger
        ? "#db4444"
        : props.$secondary
          ? "#444444"
          : themeColors?.gold || "#c9a84c"};
  background: ${(props) =>
    props.$danger
      ? "rgba(219, 68, 68, 0.08)"
      : props.$secondary
        ? "transparent"
        : "transparent"};
  color: ${(props) =>
    props.$danger
      ? "#db4444"
      : props.$secondary
        ? "#888888"
        : themeColors?.gold || "#c9a84c"};
  transition: all 0.2s ease;

  @media (min-width: 480px) {
    padding: 13px;
  }

  &:hover {
    background: ${(props) =>
      props.$danger
        ? "#db4444"
        : props.$secondary
          ? "#262624"
          : themeColors?.gold || "#c9a84c"};
    color: ${(props) =>
      props.$danger ? "#fff" : props.$secondary ? "#fff" : "#1a0e00"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrivacyLink = styled.a`
  display: inline-block;
  margin-top: 8px;
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 12px;
  color: ${themeColors?.gold || "#c9a84c"};
  text-decoration: underline;
  cursor: pointer;
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;

  @media (min-width: 480px) {
    padding: 20px;
  }
`;

export const ConfirmBox = styled.div`
  background: ${themeColors?.card || "#161614"};
  border: 1px solid #db4444;
  border-radius: 12px;
  padding: 20px;
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 28px;
  }
`;

export const ConfirmTitle = styled.h4`
  font-family: ${themeFonts?.display || "serif"};
  color: #db4444;
  font-size: clamp(16px, 4vw, 18px);
  margin-bottom: 10px;
`;

export const ConfirmText = styled.p`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: ${themeColors?.text || "#fff"};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 22px;
`;

export const ConfirmActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-family: ${themeFonts?.body || "sans-serif"};
    font-size: 13px;
    color: ${themeColors?.muted || "#888"};
  }

  input {
    background: ${themeColors?.bg || "#0a0a08"};
    border: 1px solid ${themeColors?.border || "#262624"};
    border-radius: 8px;
    padding: 12px 14px;
    color: ${themeColors?.text || "#fff"};
    /* 16px no mobile evita zoom automático indesejado no iOS / Safari ao focar */
    font-size: 16px;
    font-family: ${themeFonts?.body || "sans-serif"};
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s ease;

    @media (min-width: 768px) {
      font-size: 14px;
    }

    &:focus {
      border-color: ${themeColors?.gold || "#c9a84c"};
    }
  }
`;

export const InputError = styled.p`
  color: #ff4d4d;
  font-size: 12px;
  margin-top: 4px;
  font-family: ${themeFonts?.body || "sans-serif"};
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;
