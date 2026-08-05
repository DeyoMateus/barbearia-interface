import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  padding: 100px 20px;
`;

export const LoadingContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c9a84c;
  font-family: sans-serif;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 1px;
`;

export const AccessDeniedContainer = styled.div`
  min-height: 100vh;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 20px;
  text-align: center;
`;

export const AccessDeniedTitle = styled.p`
  font-family: sans-serif;
  color: #e74c3c;
  font-size: 18px;
  margin-bottom: 10px;
`;

export const AccessDeniedSub = styled.span`
  color: #888;
  font-size: 14px;
`;

export const FilterCard = styled.div`
  max-width: 700px;
  margin: 0 auto 30px;
  background: #1c1c1e;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #2d2d2d;
`;

export const FilterLabel = styled.label`
  color: #c9a84c;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
  font-family: sans-serif;
`;

export const SelectInput = styled.select`
  width: 100%;
  padding: 10px;
  background: #111;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
  font-weight: bold;
  outline: none;
  cursor: pointer;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin: 40px auto;
  max-width: 700px;
`;
