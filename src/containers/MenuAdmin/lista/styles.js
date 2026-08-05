// src/containers/MenuAdmin/ListagemAdmin/styles.js
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 20px auto;
  background: #1c1c1e;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  font-family: sans-serif;
  box-sizing: border-box;
`;

export const MenuNav = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

export const NavButton = styled.button`
  padding: 10px 18px;
  background: ${(props) => (props.$active ? "#c9a84c" : "#111")};
  color: ${(props) => (props.$active ? "#111" : "#fff")};
  border: ${(props) => (props.$active ? "none" : "1px solid #444")};
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  flex: 1 1 auto;
  text-align: center;
`;

export const LoadingText = styled.p`
  color: #c9a84c;
  text-align: center;
`;

/* ── Tabelas ───────────────────────── */

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #111;
  min-width: 600px;
`;

export const Th = styled.th`
  background: #2d2d2d;
  color: #c9a84c;
  text-align: left;
  padding: 12px 15px;
  font-weight: bold;
  border-bottom: 2px solid #2d2d2d;
  white-space: nowrap;
`;

export const ThCenter = styled(Th)`
  text-align: center;
`;

export const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #2d2d2d;
  color: #fff;
  white-space: nowrap;
`;

export const TdCenter = styled(Td)`
  text-align: center;
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  transition: 0.2s;
  background: ${(props) =>
    props.$variant === "editar" ? "#2196F3" : "#f44336"};
`;

/* ── Relatório financeiro ───────────────────────── */

export const ReportForm = styled.form`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  flex-wrap: wrap;
  background: #111;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #2d2d2d;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1 1 150px;
`;

export const FieldLabel = styled.label`
  color: #aaa;
  font-size: 13px;
`;

export const DateInput = styled.input`
  padding: 10px;
  background: #1c1c1e;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
`;

export const SubmitReportButton = styled.button`
  padding: 12px 20px;
  background: #c9a84c;
  color: #111;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  height: 40px;
  flex: 1 1 100%;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

export const Card = styled.div`
  background: #111;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$highlight ? "#c9a84c" : "#2d2d2d")};
  text-align: center;
`;

export const CardTitle = styled.p`
  color: ${(props) => (props.$highlight ? "#c9a84c" : "#aaa")};
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 1px;
`;

export const CardValue = styled.h4`
  color: #c9a84c;
  font-size: ${(props) => (props.$large ? "26px" : "22px")};
  font-weight: bold;
  margin: 0;
`;

export const ExportButton = styled.button`
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: transparent;
  color: #c9a84c;
  border: 1px solid #c9a84c;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
`;

/* ── Modal de edição ───────────────────────── */

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: #1c1c1e;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
`;

export const ModalTitle = styled.h3`
  color: #c9a84c;
  margin-top: 0;
  margin-bottom: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 15px;
`;

export const InputLabel = styled.label`
  color: #aaa;
`;

export const ModalInput = styled.input`
  padding: 10px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 15px;
`;

export const ModalSelect = styled.select`
  padding: 10px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: 15px;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

export const ModalCancelButton = styled.button`
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #fff;
  background: #444;
`;

export const ModalSaveButton = styled.button`
  flex: 1;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background: #c9a84c;
  color: #111;
`;
