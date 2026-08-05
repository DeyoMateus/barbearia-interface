import styled from "styled-components";
import { C, font } from "../../constants/theme.js";

export const CardContainer = styled.div`
  background: ${C?.card || "#161614"};
  border: 1px solid
    ${(props) =>
      props.$inCart ? C?.gold || "#c9a84c" : C?.border || "#262624"};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
  backdrop-filter: blur(5px);

  &:hover {
    transform: translateY(-2px);
    border-color: ${C?.gold || "#c9a84c"};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

export const ServiceName = styled.h4`
  font-family: ${font?.display || "serif"};
  font-size: 18px;
  color: ${C?.text || "#ffffff"};
  margin: 0;
  font-weight: 600;
`;

export const ServicePrice = styled.span`
  font-family: ${font?.body || "sans-serif"};
  font-size: 16px;
  color: ${C?.gold || "#c9a84c"};
  font-weight: 700;
  white-space: nowrap;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  font-family: ${font?.body || "sans-serif"};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Estilização dinâmica baseada se o item está ou não no carrinho */
  background: ${(props) =>
    props.$inCart ? "rgba(219, 68, 68, 0.1)" : "transparent"};
  color: ${(props) => (props.$inCart ? "#db4444" : C?.text || "#ffffff")};
  border: 1px solid
    ${(props) => (props.$inCart ? "#db4444" : C?.border || "#262624")};

  &:hover {
    background: ${(props) =>
      props.$inCart ? "#db4444" : C?.gold || "#c9a84c"};
    color: ${(props) => (props.$inCart ? "#ffffff" : "#1a0e00")};
    border-color: transparent;
  }
`;
