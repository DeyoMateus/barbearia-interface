// src/containers/MenuAdmin/AdminGerenciamento/styles.js
import styled from "styled-components";

export const Container = styled.div`
  max-width: 600px;
  margin: 30px auto;
  background: #1c1c1e;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  font-family: sans-serif;
`;

export const Title = styled.h3`
  color: #c9a84c;
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
`;

export const TabsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const TabButton = styled.button`
  flex: 1;
  padding: 12px;
  background: ${(props) => (props.$active ? "#c9a84c" : "#111")};
  color: ${(props) => (props.$active ? "#111" : "#fff")};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
`;

export const Message = styled.div`
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => (props.$type === "sucesso" ? "#1b4332" : "#641111")};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Input = styled.input`
  padding: 12px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
`;

export const Select = styled.select`
  padding: 12px;
  background: #111;
  color: #fff;
  border: 1px solid #444;
  border-radius: 4px;
  cursor: pointer;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  color: #fff;
  gap: 10px;
  cursor: pointer;
`;

export const SubmitButton = styled.button`
  padding: 14px;
  background: #c9a84c;
  color: #111;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;