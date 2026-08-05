import styled from "styled-components";
import { Link as ReactLink } from "react-router-dom";

// Para Textos e Formulários font-family: 'Montserrat', sans-serif;
// Para Títulos font-family: 'Cinzel', sans-serif;

export const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh; /* Mudamos de height para min-height para aceitar telas dinâmicas */
  
  /* Retiramos o overflow: hidden para permitir rolagem se o celular for muito pequeno */
  overflow-y: auto; 
  
  background: #080808;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  padding: 20px; /* Margem de segurança para o cartão nunca encostar nas bordas do celular */
  box-sizing: border-box;
`;

export const CanvasBackground = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const RightContainer = styled.div`
  background: rgba(8, 8, 8, 0.75);
  border: 1px solid rgba(184, 144, 56, 0.35);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); 
  
  /* Padding responsivo: diminui um pouco em telas menores para economizar espaço */
  padding: 40px 30px; 
  width: 100%;
  max-width: 340px; 
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 60px rgba(180, 130, 20, 0.15), inset 0 0 40px rgba(0, 0, 0, 0.6);
  z-index: 2;
  border-radius: 12px;
  text-align: center;

  /* Media Query: Se o dispositivo for um celular, fazemos micro-ajustes para caber tudo na tela */
  @media (max-width: 480px) {
    padding: 30px 20px;
    
    /* Faz a logo encolher proporcionalmente apenas em celulares */
    img {
      max-width: 160px; 
    }
    
    /* Reduz um pouco os espaços vazios */
    margin-bottom: 15px;
  }
  
`;

export const BrandArea = styled.div`
  text-align: center;
  margin-bottom: 10px;
  

  span {
    font-size: 14px;
    color: #c9a84c;
    letter-spacing: 6px;
    display: block;
    margin-bottom: 12px;
  }

  img {
    /* Força o logo a crescer e ocupar um espaço elegante */
    width: 100%;
    max-width: 320px; 
    height: auto;
  }

  p {
    font-family: 'Cinzel', sans-serif;
    font-size: 12px;
    color: rgba(184, 144, 56, 0.6);
    letter-spacing: 5px;
    text-transform: uppercase;
  }
`;

export const Divider = styled.div`
  width: 100px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  margin: 0 auto 32px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 4px; /* Deixamos o controle do espaçamento para as margens dos containers */
  width: 100%;
`;

export const InputContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;

  label {
    display: block;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(184, 144, 56, 0.8);
    margin-bottom: 8px;
    text-align: left;
  }

  input {
    width: 100%;
    background: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(255, 255, 255, 0.12); 
    border-radius: 6px;
    color: #f0dfa0;
    font-size: 14px;
    padding: 14px;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.25s ease, background-color 0.25s ease; 

    &::placeholder {
      color: rgba(184, 144, 56, 0.3);
    }

    &:hover {
      border-color: rgba(184, 144, 56, 0.3);
      background: rgba(255, 255, 255, 0.07);
    }

    &:focus {
      border-color: rgba(201, 168, 76, 0.6);
      background: rgba(255, 255, 255, 0.08);
    }
  }

  p {
    color: #ff4d4d;
    font-size: 11px;
    margin-top: 5px;
    text-align: left;
  }
`;

export const CardTopBorder = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  /* Corrigido a sintaxe que estava separada por espaços */
  background: linear-gradient(90deg, transparent, #d4aa50, transparent);
`;

export const CardBottomBorder = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(180, 130, 20, 0.4), transparent);
`;

export const FooterText = styled.div`
  margin-top: 25px;
  font-size: 12px;
  color: rgba(184, 144, 56, 0.5);
  letter-spacing: 1px;
  text-align: center;
`;

export const Link = styled(ReactLink)`
  color: #c9a84c;
  text-decoration: none;
  font-weight: 600;
  margin-left: 5px;
  transition: color 0.2s;

  &:hover {
    color: #f0dfa0;
    text-decoration: underline;
  }

`