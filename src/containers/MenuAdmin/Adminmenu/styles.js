import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 16px auto;
  background: #1c1c1e;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  font-family: sans-serif;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 20px;
    margin: 24px auto;
  }

  @media (min-width: 768px) {
    padding: 25px;
    margin: 30px auto;
  }
`;

export const Title = styled.h3`
  color: #c9a84c;
  margin-top: 0;
  margin-bottom: 16px;
  text-align: center;
  font-size: clamp(18px, 4vw, 22px);

  @media (min-width: 480px) {
    margin-bottom: 20px;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;

  @media (min-width: 480px) {
    gap: 10px;
  }
`;

export const TabButton = styled.button`
  flex: 1 1 100%;
  padding: 12px 8px;
  background: ${(props) => (props.$active ? "#c9a84c" : "#111")};
  color: ${(props) => (props.$active ? "#111" : "#fff")};
  border: 1px solid ${(props) => (props.$active ? "#c9a84c" : "#333")};
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#d4aa50" : "#222")};
  }

  @media (min-width: 480px) {
    flex: 1 1 140px;
    padding: 12px;
  }
`;

export const Message = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #fff;
  background-color: ${(props) =>
    props.$type === "sucesso" ? "#1b4332" : "#641111"};
  border: 1px solid
    ${(props) => (props.$type === "sucesso" ? "#2d6a4f" : "#8b0000")};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  box-sizing: border-box;
  /* 16px no mobile impede o zoom automático do iOS ao focar no campo */
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #c9a84c;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #c9a84c;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 0;
  user-select: none;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #c9a84c;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #c9a84c;
  color: #111;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #d4aa50;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
