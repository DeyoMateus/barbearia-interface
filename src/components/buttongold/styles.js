import styled from "styled-components";
import { C, font } from "../../constants/theme.js";

export const StyledGoldBtn = styled.button`
  background: ${(props) =>
    props.$outline
      ? "transparent"
      : props.disabled
        ? "rgba(201,168,76,0.15)"
        : `linear-gradient(135deg,#b8900c,${C.gold} 50%,${C.goldL})`};
  border: ${(props) => (props.$outline ? `1px solid ${C.border}` : "none")};
  border-radius: 10px;
  color: ${(props) =>
    props.$outline ? C.muted : props.disabled ? C.muted : "#1a0e00"};
  font-family: ${font.display};
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  padding: 13px 24px;
  transition:
    opacity 0.2s,
    border-color 0.2s;

  &:hover {
    ${(props) => !props.disabled && !props.$outline && "opacity: .88;"}
    ${(props) => props.$outline && `border-color: ${C.gold};`}
  }
`;
