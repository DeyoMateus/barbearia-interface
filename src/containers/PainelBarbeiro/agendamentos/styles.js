import styled from "styled-components";
import {
  C as themeColors,
  font as themeFonts,
} from "../../../constants/theme.js";

export const Wrapper = styled.div`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: #fff;
  padding: 12px 16px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 16px 20px;
  }

  @media (min-width: 768px) {
    padding: 20px;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  opacity: ${(props) => (props.$loading ? 0.6 : 1)};
  transition: opacity 0.2s ease-in-out;
  box-sizing: border-box;
`;

/* ── Tabela de disponibilidade ───────────────────────── */

export const AvailabilitySection = styled.div`
  margin-top: 20px;
  margin-bottom: 32px;

  @media (min-width: 480px) {
    margin-top: 30px;
    margin-bottom: 50px;
  }
`;

export const SectionTitle = styled.h3`
  margin-bottom: 12px;
  font-size: clamp(18px, 4vw, 20px);
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
`;

export const EmptyHint = styled.p`
  color: #aaa;
  font-style: italic;
  font-size: 13px;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  border: 1px solid ${themeColors?.border || "#2d2d2d"};

  scrollbar-width: thin;
  scrollbar-color: ${`${themeColors?.gold || "#c9a84c"} ${themeColors?.card || "#1c1c1e"}`};

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${themeColors?.gold || "#c9a84c"};
    border-radius: 4px;
  }
`;

export const Table = styled.table`
  width: 100%;
  min-width: 500px;
  border-collapse: collapse;
  text-align: left;
  background: ${themeColors?.card || "#1c1c1e"};
`;

export const TableHeadRow = styled.tr`
  border-bottom: 2px solid ${themeColors?.border || "#2d2d2d"};
  background: #111;
`;

export const Th = styled.th`
  padding: 10px 12px;
  color: ${themeColors?.gold || "#c9a84c"};
  font-weight: bold;
  font-size: 13px;
  white-space: nowrap;

  @media (min-width: 480px) {
    padding: 12px 15px;
    font-size: 14px;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${themeColors?.border || "#2d2d2d"};
`;

export const Td = styled.td`
  padding: 10px 12px;
  font-size: 13px;
  white-space: nowrap;

  @media (min-width: 480px) {
    padding: 12px 15px;
    font-size: 14px;
  }
`;

export const TdBold = styled(Td)`
  font-weight: bold;
`;

export const TdGreen = styled(Td)`
  color: #44ff44;
`;

export const TdRed = styled(Td)`
  color: #ff4444;
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: ${themeColors?.border || "#2d2d2d"};
  margin-bottom: 24px;

  @media (min-width: 480px) {
    margin-bottom: 40px;
  }
`;

/* ── Lista de compromissos ───────────────────────── */

export const AppointmentsHeader = styled.h3`
  margin-bottom: 12px;
  font-size: clamp(18px, 4vw, 22px);
  font-family: ${themeFonts?.display || "serif"};
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 10px;
    margin-bottom: 25px;
  }
`;

export const FilterButton = styled.button`
  background: ${(props) =>
    props.$active ? themeColors?.gold || "#ff9900" : "#1c1c1e"};
  color: ${(props) => (props.$active ? "#000" : "#fff")};
  border: 1px solid
    ${(props) => (props.$active ? themeColors?.gold || "#c9a84c" : "#333")};
  padding: 8px 14px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    opacity: 0.9;
  }

  @media (min-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export const EmptyBox = styled.div`
  background: #151515;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px dashed #333;
`;

export const EmptyBoxText = styled.p`
  color: #aaa;
  margin: 0;
  font-style: italic;
  font-size: 13px;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;

  @media (min-width: 480px) {
    gap: 20px;
  }
`;

export const Card = styled.div`
  background: ${themeColors?.card || "#1c1c1e"};
  padding: 16px;
  border-radius: 12px;
  border-left: 5px solid ${(props) => props.$accentColor};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 20px;
  }
`;

export const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const CardDate = styled.span`
  color: ${(props) => props.$color};
  font-size: 15px;
  font-weight: bold;

  @media (min-width: 480px) {
    font-size: 16px;
  }
`;

export const CardTime = styled.span`
  color: #fff;
  font-size: 15px;
  font-weight: bold;

  @media (min-width: 480px) {
    font-size: 16px;
  }
`;

export const CardLabel = styled.p`
  color: #aaa;
  font-size: 12px;
  margin: 0 0 4px 0;
`;

export const CardClientName = styled.p`
  color: #fff;
  font-size: 15px;
  margin: 0 0 12px 0;
  font-weight: 600;
  word-break: break-word;

  @media (min-width: 480px) {
    font-size: 16px;
    margin-bottom: 14px;
  }
`;

export const CardServiceName = styled.p`
  color: ${themeColors?.gold || "#ff9900"};
  font-size: 13px;
  margin: 0 0 12px 0;
  font-weight: bold;

  @media (min-width: 480px) {
    font-size: 14px;
    margin-bottom: 15px;
  }
`;

export const CardBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const StatusBadge = styled.span`
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: bold;
  white-space: nowrap;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 6px;
`;

export const ActionButtonComplete = styled.button`
  background: #52c41a;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

export const ActionButtonCancel = styled.button`
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

/* ── Paginação ───────────────────────── */

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 15px;
    margin-top: 30px;
  }
`;

export const PaginationButton = styled.button`
  background: ${themeColors?.card || "#1c1c1e"};
  color: ${themeColors?.gold || "#c9a84c"};
  border: 1px solid ${themeColors?.border || "#333"};
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  @media (min-width: 480px) {
    padding: 8px 16px;
    font-size: 14px;
  }

  &:hover:not(:disabled) {
    background: ${themeColors?.gold || "#c9a84c"};
    color: #000;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  color: #aaa;
  font-size: 13px;
  font-weight: 500;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;
