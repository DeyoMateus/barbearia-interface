// src/containers/PainelBarbeiro/MeusAgendamentos/styles.js
import styled from "styled-components";
import {
  C as themeColors,
  font as themeFonts,
} from "../../../constants/theme.js";

export const Wrapper = styled.div`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: #fff;
  padding: 10px;
`;

export const Content = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  /* Dá um efeito suave de carregamento se estiver buscando dados da nova página */
  opacity: ${(props) => (props.$loading ? 0.6 : 1)};
  transition: opacity 0.2s ease-in-out;
`;

/* ── Tabela de disponibilidade ───────────────────────── */

export const AvailabilitySection = styled.div`
  margin-top: 30px;
  margin-bottom: 50px;
`;

export const SectionTitle = styled.h3`
  margin-bottom: 15px;
  font-size: 20px;
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
`;

export const EmptyHint = styled.p`
  color: #aaa;
  font-style: italic;
  font-size: 14px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid ${themeColors?.border || "#2d2d2d"};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  background: ${themeColors?.card || "#1c1c1e"};
`;

export const TableHeadRow = styled.tr`
  border-bottom: 2px solid ${themeColors?.border || "#2d2d2d"};
  background: #111;
`;

export const Th = styled.th`
  padding: 12px 15px;
  color: ${themeColors?.gold || "#c9a84c"};
  font-weight: bold;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${themeColors?.border || "#2d2d2d"};
`;

export const Td = styled.td`
  padding: 12px 15px;
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
  margin-bottom: 40px;
`;

/* ── Lista de compromissos ───────────────────────── */

export const AppointmentsHeader = styled.h3`
  margin-bottom: 10px;
  font-size: 22px;
  font-family: ${themeFonts?.display || "serif"};
`;

export const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  background: ${(props) =>
    props.$active ? themeColors?.gold || "#ff9900" : "#1c1c1e"};
  color: ${(props) => (props.$active ? "#000" : "#fff")};
  border: 1px solid
    ${(props) => (props.$active ? themeColors?.gold || "#c9a84c" : "#333")};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
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
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
`;

export const Card = styled.div`
  background: ${themeColors?.card || "#1c1c1e"};
  padding: 20px;
  border-radius: 12px;
  border-left: 5px solid ${(props) => props.$accentColor};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const CardTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

export const CardDate = styled.span`
  color: ${(props) => props.$color};
  font-size: 16px;
  font-weight: bold;
`;

export const CardTime = styled.span`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const CardLabel = styled.p`
  color: #aaa;
  font-size: 12px;
  margin: 0 0 4px 0;
`;

export const CardClientName = styled.p`
  color: #fff;
  font-size: 16px;
  margin: 0 0 14px 0;
  font-weight: 600;
`;

export const CardServiceName = styled.p`
  color: ${themeColors?.gold || "#ff9900"};
  font-size: 14px;
  margin: 0 0 15px 0;
  font-weight: bold;
`;

export const CardBottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

export const StatusBadge = styled.span`
  background: ${(props) => props.$bg};
  color: ${(props) => props.$color};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: bold;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 6px;
`;

export const ActionButtonComplete = styled.button`
  background: #52c41a;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
`;

export const ActionButtonCancel = styled.button`
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
`;

/* ── Paginação ───────────────────────── */

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

export const PaginationButton = styled.button`
  background: ${themeColors?.card || "#1c1c1e"};
  color: ${themeColors?.gold || "#c9a84c"};
  border: 1px solid ${themeColors?.border || "#333"};
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

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
  font-size: 14px;
  font-weight: 500;
`;
