import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.div`
  background-color: #0a0a08;
  width: 100%;
  height: 72px;
  position: relative;
  z-index: 2;
  padding: 0 56px;
  box-sizing: border-box; /* Garante que o padding não estoure os 100% de largura */

  /* 📱 RESPONSIVIDADE: No mobile o header cresce para acomodar as colunas */
  @media (max-width: 768px) {
    height: auto; /* Deixa a altura livre para expandir conforme os elementos se empilham */
    padding: 16px;
  }
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  /* 📱 RESPONSIVIDADE: Muda de linha para coluna no celular */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px; /* Espaçamento entre o bloco de navegação e o bloco de opções */
    align-items: center;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 72px;

  @media (max-width: 768px) {
    height: auto;
    width: 100%;
  }

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    hr {
      height: 24px;
      border: 1px solid #c9a84c;
      margin: 0;
    }

    /* 📱 RESPONSIVIDADE: Permite que os links quebrem linha se faltar espaço na tela do celular */
    @media (max-width: 768px) {
      flex-wrap: wrap;
      gap: 12px;

      hr {
        display: none; /* Remove as linhas verticais no mobile para não poluir o layout em bloco */
      }
    }
  }
`;

export const HeaderLink = styled(Link)`
  color: ${(props) => (props.$isActive ? "#c9a84c" : " #fff")};
  border-bottom: ${(props) => (props.$isActive ? "1px solid #c9a84c" : "none")};
  padding: 5px;
  text-decoration: none;
  font-size: 14px;
  transition: color 200ms;

  &:hover {
    color: #da6a03;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 6px 12px;
    background: rgba(
      255,
      255,
      255,
      0.03
    ); /* Cria uma espécie de 'botão' discreto no mobile */
    border-radius: 4px;
    border-bottom: ${(props) =>
      props.$isActive ? "1px solid #c9a84c" : "none"};
  }
`;

export const Options = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;

  /* 📱 RESPONSIVIDADE: Alinha Perfil e Agendamento lado a lado de forma harmônica ou empilha se for muito pequeno */
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-around;
    gap: 16px;
    border-top: 1px solid rgba(201, 168, 76, 0.2); /* Linha divisória sutil superior no mobile */
    padding-top: 12px;
  }

  @media (max-width: 400px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 12px;

  p {
    color: #f0eeeb;
    line-height: 90%;
    font-weight: 300;
    margin: 0;

    span {
      font-weight: 700;
      color: #da6a03;
    }
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const Logout = styled.button`
  color: #c9a84c;
  text-decoration: none;
  font-weight: 700;
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;
