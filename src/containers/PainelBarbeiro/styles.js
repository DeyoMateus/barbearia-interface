import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: #0a0a0a;
  padding: 60px 16px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 80px 20px;
  }

  @media (min-width: 768px) {
    padding: 100px 20px;
  }
`;

export const LoadingContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c9a84c;
  font-family: sans-serif;
  font-size: clamp(14px, 4vw, 16px);
  font-weight: bold;
  letter-spacing: 1px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
`;

export const AccessDeniedContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;
`;

export const AccessDeniedTitle = styled.p`
  font-family: sans-serif;
  color: #e74c3c;
  font-size: clamp(16px, 4vw, 18px);
  font-weight: bold;
  margin: 0 0 10px 0;
`;

export const AccessDeniedSub = styled.span`
  color: #888;
  font-size: clamp(13px, 3.5vw, 14px);
`;

export const FilterCard = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto 20px;
  background: #1c1c1e;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 20px;
    margin-bottom: 30px;
  }
`;

export const FilterLabel = styled.label`
  color: #c9a84c;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  font-family: sans-serif;
  font-size: 13px;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

export const SelectInput = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
  /* 16px no mobile impede o zoom automático indesejado no iOS / Safari */
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #c9a84c;
  }

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 24px auto;
  width: 100%;
  max-width: 700px;

  @media (min-width: 480px) {
    margin: 40px auto;
  }
`;
