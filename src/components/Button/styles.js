import styled from "styled-components";

export const ContainerButton = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  background: rgba(15, 15, 15, 0.6);
  border: 1px solid rgba(184, 144, 56, 0.35);
  border-radius: 6px;

  color: #f0dfa0;
  font-family: "Montserrat", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 5px;
  text-transform: uppercase;

  cursor: pointer;
  user-select: none;

  transform: scale(1);
  will-change: transform;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  /* Efeito luminoso ao passar o mouse */
  &:hover {
    background: rgba(184, 144, 56, 0.1);
    border-color: rgba(201, 168, 76, 0.8);
    color: #ffffff;
    box-shadow: 0 0 20px rgba(201, 168, 76, 0.15);
  }

  /* Feedback físico de clique */
  &:active {
    transform: scale(0.98);
    background: rgba(184, 144, 56, 0.15);
  }

  &:focus-visible {
    outline: 2px solid #c9a84c;
    outline-offset: 3px;
  }
`;
