import styled from "styled-components";
import { C, font } from "../../constants/theme.js";

export const CardWrapper = styled.div`
  background: ${(props) => (props.$inCart ? "rgba(201,168,76,0.08)" : C.card)};
  border: 1px solid
    ${(props) => (props.$inCart ? C.gold : props.$hover ? C.borderH : C.border)};
  border-radius: 12px;
  padding: 20px 22px;
  cursor: pointer;
  transition: all 0.22s;
  transform: ${(props) => (props.$hover ? "translateY(-2px)" : "none")};
  position: relative;
  overflow: hidden;
`;

export const CheckBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${C.gold};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #1a0e00;
  font-weight: 700;
`;

export const ServiceName = styled.p`
  font-family: ${font.display};
  font-size: 16px;
  color: ${C.text};
  margin: 0 0 4px;
`;

export const ServiceDescription = styled.p`
  font-family: ${font.body};
  font-size: 12px;
  color: ${C.muted};
  margin: 0 0 14px;
  line-height: 1.5;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const ServicePrice = styled.span`
  font-family: ${font.display};
  font-size: 20px;
  color: ${C.gold};
  font-weight: 700;
`;

export const ServiceDuration = styled.span`
  font-family: ${font.body};
  font-size: 11px;
  color: ${C.muted};
  letter-spacing: 1px;
`;
