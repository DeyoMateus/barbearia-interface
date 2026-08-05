// src/containers/PainelBarbeiro/ConfigurarAgenda/styles.js
import styled from "styled-components";
import {
  C as themeColors,
  font as themeFonts,
} from "../../../constants/theme.js";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 500px;
  margin: 20px auto;
`;

export const Card = styled.div`
  background: ${themeColors?.card || "#161614"};
  padding: 24px;
  border-radius: 12px;
  border: 1px solid ${themeColors?.border || "#333"};
  color: ${themeColors?.text || "#fff"};
`;

export const CardTitle = styled.h3`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
  margin-bottom: 20px;
  font-size: 22px;
`;

export const CardSubtitle = styled.h3`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
  margin-bottom: 10px;
  font-size: 20px;
`;

export const HelperText = styled.p`
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 20px;

  strong {
    color: inherit;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 14px;
`;

export const SmallFieldLabel = styled(FieldLabel)`
  font-size: 13px;
`;

export const Select = styled.select`
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid ${themeColors?.border || "#333"};
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  font-size: 15px;
  outline: none;
  font-family: ${themeFonts?.body || "sans-serif"};
  cursor: pointer;
  color-scheme: dark;
`;

export const Option = styled.option`
  background: ${themeColors?.card || "#121212"};
  color: #fff;
  padding: 12px;
  font-family: ${themeFonts?.body || "sans-serif"};
`;

export const TimeInput = styled.input`
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid ${themeColors?.border || "#333"};
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  font-size: 15px;
  outline: none;
  font-family: ${themeFonts?.body || "sans-serif"};
  cursor: pointer;
  color-scheme: dark;
`;

export const TwoColumnsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const ActionsColumn = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const DeleteButton = styled.button`
  background: rgba(230, 76, 76, 0.15);
  color: #e64c4c;
  border: 1px solid rgba(230, 76, 76, 0.4);
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  font-size: 15px;
  font-family: ${themeFonts?.body || "sans-serif"};
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
  font-weight: bold;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Divider = styled.hr`
  border: 0;
  border-top: 1px solid ${themeColors?.border || "#333"};
  margin: 20px 0;
`;

export const BlockedListTitle = styled.h4`
  font-family: ${themeFonts?.display || "serif"};
  font-size: 16px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.932);
`;

export const EmptyBlockedText = styled.p`
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  padding: 10px 0;
`;

export const BlockedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

export const BlockedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const BlockedItemText = styled.div`
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 14px;
`;

export const BlockedItemHighlight = styled.span`
  color: ${themeColors?.gold || "#c9a84c"};
  font-weight: bold;
`;

export const ReleaseButton = styled.button`
  background: transparent;
  color: #e64c4c;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-family: ${themeFonts?.body || "sans-serif"};
  font-weight: bold;
`;

/* Toast de confirmação de exclusão de agenda */

export const ConfirmToastText = styled.div`
  font-family: ${themeFonts?.body || "sans-serif"};
  color: #fff;
`;

export const ConfirmToastMessage = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
`;

export const ConfirmToastActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const ConfirmToastNoButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
`;

export const ConfirmToastYesButton = styled.button`
  background: #e64c4c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
`;
