// src/containers/Servico/styles.js
import styled from "styled-components";

export const CardBlock = styled.div`
  background: rgba(10, 9, 7, 0.72);
  border: 1px solid rgba(201, 168, 76, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 52px 48px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s;
  direction: ltr;

  &:hover {
    border-color: rgba(201, 168, 76, 0.28);
  }

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
      rgba(201, 168, 76, 0.35),
      transparent
    );
    opacity: 0;
    transition: opacity 0.4s;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 700px) {
    padding: 36px 28px;
  }
`;

export const BlockNum = styled.span`
  font-family: "Playfair Display", serif;
  font-size: 80px;
  font-weight: 700;
  font-style: italic;
  color: rgba(201, 168, 76, 0.07);
  position: absolute;
  top: -10px;
  right: 24px;
  line-height: 1;
  pointer-events: none;
  transition: color 0.4s;

  ${CardBlock}:hover & {
    color: rgba(201, 168, 76, 0.13);
  }
`;

export const BlockIcon = styled.span`
  font-size: 28px;
  margin-bottom: 18px;
  display: block;
  filter: drop-shadow(0 0 12px rgba(201, 168, 76, 0.4));
`;

export const BlockLabel = styled.p`
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(201, 168, 76, 0.55);
  margin-bottom: 12px;
`;

export const BlockTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: clamp(22px, 2.8vw, 30px);
  font-weight: 700;
  color: #f0dfa0;
  line-height: 1.2;
  margin-bottom: 18px;

  em {
    font-style: italic;
    color: #c9a84c;
  }
`;

export const BlockBody = styled.p`
  font-family: "Cormorant Garamond", serif;
  font-size: clamp(15px, 1.5vw, 18px);
  font-weight: 300;
  color: rgba(240, 223, 160, 0.5);
  line-height: 1.85;

  strong {
    color: rgba(240, 223, 160, 0.8);
    font-weight: 400;
  }
`;

export const PageContainer = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 140px 20px 60px;
  color: #fff;
  min-height: 100vh;
`;

export const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

export const MainTitle = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: clamp(32px, 4vw, 46px);
  color: #c9a84c;
  margin-bottom: 10px;
`;

export const Subtitle = styled.p`
  color: rgba(240, 223, 160, 0.6);
  font-family: sans-serif;
  font-size: 14px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
`;

export const StatusTag = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 11px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 10px;
  background: ${(props) =>
    props.status === "scheduled"
      ? "rgba(201, 168, 76, 0.12)"
      : props.status === "completed"
        ? "rgba(25, 118, 210, 0.15)"
        : "rgba(211, 47, 47, 0.12)"};
  color: ${(props) =>
    props.status === "scheduled"
      ? "#c9a84c"
      : props.status === "completed"
        ? "#90caf9"
        : "#e57373"};
  border: 1px solid
    ${(props) =>
      props.status === "scheduled"
        ? "rgba(201, 168, 76, 0.25)"
        : props.status === "completed"
          ? "rgba(25, 118, 210, 0.3)"
          : "rgba(211, 47, 47, 0.25)"};
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  background: ${(props) =>
    props.$active ? "rgba(201, 168, 76, 0.25)" : "rgba(10, 9, 7, 0.6)"};
  color: ${(props) => (props.$active ? "#f0dfa0" : "rgba(240, 223, 160, 0.5)")};
  border: 1px solid
    ${(props) => (props.$active ? "#c9a84c" : "rgba(201, 168, 76, 0.15)")};
  padding: 10px 22px;
  border-radius: 4px;
  font-family: "Playfair Display", serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    border-color: #c9a84c;
    color: #f0dfa0;
    background: rgba(201, 168, 76, 0.15);
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: #ef9a9a;
  border: 1px solid rgba(211, 47, 47, 0.3);
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 15px;
  display: block;
  width: fit-content;
  transition: all 0.3s;

  &:hover {
    background: rgba(211, 47, 47, 0.15);
    border-color: #e57373;
    color: #ffebee;
  }
`;

export const StatusText = styled.p`
  color: ${(props) =>
    props.$variant === "loading" ? "#c9a84c" : "rgba(240, 223, 160, 0.4)"};
  text-align: center;
`;

/* --- Popup de confirmação de cancelamento (dentro do toast) --- */

export const ConfirmToastText = styled.p`
  margin: 0 0 12px 0;
  color: #fff;
  font-weight: 500;
  line-height: 1.4;
  font-family: sans-serif;
  font-size: 13px;
`;

export const ConfirmToastActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ConfirmToastButton = styled.button`
  background: ${(props) =>
    props.$variant === "danger" ? "#d32f2f" : "rgba(255,255,255,0.08)"};
  color: ${(props) => (props.$variant === "danger" ? "#fff" : "#ccc")};
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
`;
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  color: #f0dfa0;
  font-family: "Playfair Display", serif;
`;

export const PageButton = styled.button`
  background: rgba(201, 168, 76, 0.15);
  color: #f0dfa0;
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(201, 168, 76, 0.3);
    border-color: #c9a84c;
  }
`;
// Adicione estes dois componentes ao final do arquivo src/containers/Servico/styles.js

export const LocationButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(201, 168, 76, 0.12);
  color: #f0dfa0;
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 10px 20px;
  border-radius: 25px;
  font-family: "Playfair Display", serif;
  font-size: 20px;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(201, 168, 76, 0.25);
    border-color: #c9a84c;
    color: #fff;
    transform: translateY(-2px);
  }
`;

export const LocationContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
