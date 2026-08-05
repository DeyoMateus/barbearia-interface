import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background-color: #09090b;
  color: #f4f4f5;
  padding: 2rem;
  font-family: sans-serif;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.025em;
  }
`;

export const LogoutButton = styled.button`
  background-color: #dc2626;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ef4444;
  }
`;

export const GridSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Card = styled.section`
  background-color: #18181b;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #27272a;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #f4f4f5;
    margin-bottom: 1rem;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    margin-bottom: 0;
  }

  button {
    font-size: 0.75rem;
    background-color: #27272a;
    color: #a1a1aa;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;

    &:hover {
      background-color: #3f3f46;
      color: #ffffff;
    }
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Input = styled.input`
  background-color: #27272a;
  border: 1px solid #3f3f46;
  padding: 0.75rem;
  border-radius: 0.375rem;
  color: #ffffff;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;

  &::placeholder {
    color: #71717a;
  }

  &:focus {
    border-color: #d4af37;
  }
`;

export const Select = styled.select`
  background-color: #27272a;
  border: 1px solid #3f3f46;
  padding: 0.75rem;
  border-radius: 0.375rem;
  color: #ffffff;
  font-size: 0.875rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #d4af37;
  }

  option {
    background-color: #18181b;
    color: #ffffff;
  }
`;

export const SubmitButton = styled.button`
  background-color: ${(props) => (props.$isEditing ? "#d4af37" : "#2563eb")};
  color: ${(props) => (props.$isEditing ? "#000000" : "#ffffff")};
  font-weight: 700;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.$isEditing ? "#b59226" : "#1d4ed8")};
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;

  th {
    padding: 0.75rem;
    border-bottom: 1px solid #27272a;
    color: #a1a1aa;
    font-size: 0.875rem;
    font-weight: 600;
  }

  td {
    padding: 0.75rem;
    border-bottom: 1px solid #27272a;
    font-size: 0.875rem;
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.2s ease;

    &:hover {
      background-color: rgba(39, 39, 42, 0.5);
    }
  }
`;

export const LogoImage = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  object-fit: cover;
  border: 1px solid #3f3f46;
`;

export const LogoPlaceholder = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background-color: #27272a;
  border: 1px solid #3f3f46;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  color: #71717a;
`;

export const ShopName = styled.div`
  font-weight: 700;
  color: #ffffff;
`;

export const ShopSlug = styled.div`
  font-size: 0.75rem;
  color: #d4af37;
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;

  background-color: ${(props) =>
    props.$active ? "rgba(20, 83, 45, 0.5)" : "rgba(127, 29, 29, 0.5)"};
  color: ${(props) => (props.$active ? "#4ade80" : "#f87171")};
`;

export const ActionButton = styled.button`
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  background-color: ${(props) =>
    props.$variant === "danger"
      ? "#dc2626"
      : props.$variant === "success"
        ? "#16a34a"
        : props.$variant === "amber"
          ? "#d4af37"
          : "#27272a"};

  color: ${(props) => (props.$variant === "amber" ? "#000000" : "#ffffff")};

  &:hover {
    background-color: ${(props) =>
      props.$variant === "danger"
        ? "#b91c1c"
        : props.$variant === "success"
          ? "#15803d"
          : props.$variant === "amber"
            ? "#b59226"
            : "#3f3f46"};
  }
`;
