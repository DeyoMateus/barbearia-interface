import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background-color: #09090b;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f4f4f5;
  padding: 1rem;
  font-family: sans-serif;
`;

export const FormCard = styled.form`
  background-color: #18181b;
  padding: 2rem;
  border-radius: 0.5rem;
  border: 1px solid #27272a;
  width: 100%;
  max-width: 28rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.5),
    0 4px 6px -4px rgba(0, 0, 0, 0.5);
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #d4af37;
`;

export const FormGroup = styled.div`
  margin-bottom: ${(props) => (props.$mb ? props.$mb : "1rem")};
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  padding: 0.75rem;
  border-radius: 0.375rem;
  color: #ffffff;
  font-size: 0.875rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #71717a;
  }

  &:focus {
    border-color: #d4af37;
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  background-color: #d4af37;
  color: #000000;
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #b59226;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
