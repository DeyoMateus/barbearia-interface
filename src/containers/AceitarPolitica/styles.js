// src/containers/AceitarPolitica/styles.js
import styled from "styled-components";
import { C, font } from "../../constants/theme.js";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${C.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

export const Box = styled.div`
  background: ${C.card};
  border: 1px solid ${C.border};
  border-radius: 12px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
`;

export const Title = styled.h2`
  font-family: ${font.display};
  color: ${C.gold};
  font-size: 22px;
  margin-bottom: 12px;
`;

export const Text = styled.p`
  font-family: ${font.body};
  color: ${C.text};
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
`;

export const PolicyLink = styled.a`
  color: ${C.gold};
  text-decoration: underline;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

export const AcceptButton = styled.button`
  flex: 1;
  padding: 13px;
  background: ${C.gold};
  color: #1a0e00;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LogoutButton = styled.button`
  padding: 13px 18px;
  background: transparent;
  color: ${C.muted};
  border: 1px solid ${C.border};
  border-radius: 8px;
  cursor: pointer;
`;
