import styled from "styled-components";

import { C as themeColors, font as themeFonts } from "../../constants/theme.js";

// ─── COMPONENTES ESTILIZADOS ────────────────────────────────────────────────

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${themeColors?.bg ||
  "#0a0a08"}; /* Coloquei um fallback caso venha undefined */
  overflow-x: hidden;
`;

export const ContainerRight = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  align-items: center;
  background: rgba(22, 22, 20, 0.4);
  border: 1px solid ${themeColors?.border || "#222"};
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);
`;

export const ContainerCategory = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

export const ContainerServices = styled.div`
  /* Container que envelopa o grid dinâmico */
`;

// ─── OBJETOS DE ESTILO PARA ELEMENTOS INTERNOS ───────────────────────────────

export const styles = {
  brandSub: {
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 10,
    color: themeColors?.gold || "#c9a84c",
    letterSpacing: 4,
    textTransform: "uppercase",
    margin: 0,
  },
  brandTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: 32,
    color: themeColors?.text || "#fff",
    margin: "4px 0 0",
    fontWeight: 700,
  },
  clientBadge: {
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 11,
    color: themeColors?.muted || "#888",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: 36,
    color: themeColors?.text || "#fff",
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  heroSubtitle: {
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 14,
    color: themeColors?.muted || "#888",
    margin: "0 0 24px",
    lineHeight: 1.7,
  },
  heroDivider: {
    height: 1,
    background: `linear-gradient(90deg, ${themeColors?.gold || "#c9a84c"}, transparent)`,
  },
  heroImageWrapper: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    height: 220,
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(10,10,8,0.7), transparent)",
    zIndex: 1,
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "contrast(1.1) brightness(0.75)",
  },
  gridServices: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
    gap: 20,
    paddingBottom: 140,
  },
  categoryTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: 24,
    color: themeColors?.text || "#fff",
    margin: 0,
    fontStyle: "italic",
    gridColumn: "1 / -1",
  },
  tabButton: (isActive) => ({
    background: isActive
      ? `linear-gradient(135deg, #b8900c, ${themeColors?.gold || "#c9a84c"})`
      : themeColors?.card || "#161614",
    border: `1px solid ${isActive ? "transparent" : themeColors?.border || "#222"}`,
    borderRadius: 30,
    padding: "10px 22px",
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 13,
    color: isActive ? "#1a0e00" : themeColors?.muted || "#888",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    transition: "all .2s",
    display: "flex",
    alignItems: "center",
    gap: 8,
  }),
  tabBadge: (isActive) => ({
    background: isActive ? "rgba(0,0,0,0.2)" : themeColors?.gold || "#c9a84c",
    color: "#1a0e00",
    borderRadius: 10,
    padding: "1px 7px",
    fontSize: 11,
    fontWeight: 700,
  }),
};

export const EmptyContainer = styled.div`
  background: ${themeColors?.bg || "#0a0a08"};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${themeColors?.text || "#fff"};
`;

export const EmptyTitle = styled.h3`
  font-family: ${themeFonts?.display || "serif"};
  margin-bottom: 20px;
`;

export const AgendamentoContainer = styled.div`
  background: ${themeColors?.bg || "#0a0a08"};
  min-height: 100vh;
  color: ${themeColors?.white || "#fff"};
  padding: 120px 20px 40px;
`;

export const ContentWrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

export const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${themeColors?.muted || "#aaa"};
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  transition: color 0.2s;

  &:hover {
    color: ${themeColors?.gold || "#c9a84c"};
  }
`;

export const Title = styled.h2`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
  text-align: center;
  font-size: 28px;
  margin-bottom: 5px;
`;

export const Subtitle = styled.p`
  text-align: center;
  color: ${themeColors?.muted || "#aaa"};
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 14px;
  margin-bottom: 40px;
`;

export const SectionTitle = styled.h3`
  font-family: ${themeFonts?.display || "serif"};
  font-size: 18px;
  color: ${(props) => props.color || themeColors?.text || "#fff"};
  margin-bottom: ${(props) => props.$mb || "15px"};
  letter-spacing: ${(props) => props.$ls || "normal"};
`;

export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

export const StyledSelect = styled.select`
  background: ${themeColors?.card || "#161614"};
  color: ${themeColors?.text || "#fff"};
  border: 1px solid ${themeColors?.border || "#222"};
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  font-size: 16px;
  outline: none;
  font-family: ${themeFonts?.body || "sans-serif"};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const StyledInput = styled.input`
  background: ${themeColors?.card || "#161614"};
  color: ${themeColors?.text || "#fff"};
  border: 1px solid ${themeColors?.border || "#222"};
  padding: 16px;
  border-radius: 12px;
  width: 100%;
  font-size: 16px;
  outline: none;
  font-family: ${themeFonts?.body || "sans-serif"};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

export const AdminPanel = styled.div`
  background: rgba(201, 168, 76, 0.03);
  border: 1px dashed ${themeColors?.gold || "#c9a84c"}88;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 35px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

export const AdminTextWrapper = styled.div`
  flex: 1;
`;

export const AdminTitle = styled.h4`
  font-family: ${themeFonts?.display || "serif"};
  color: ${themeColors?.gold || "#c9a84c"};
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const AdminDescription = styled.p`
  color: ${themeColors?.muted || "#aaa"};
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
`;

export const StyledCheckbox = styled.input`
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: ${themeColors?.gold || "#c9a84c"};
  border-radius: 6px;
  border: 1px solid ${themeColors?.border || "#222"};
`;

export const StatusText = styled.p`
  color: ${themeColors?.muted || "#aaa"};
  font-family: ${themeFonts?.body || "sans-serif"};
`;

export const HoursGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
`;

export const HourButton = styled.button`
  padding: 14px;
  border-radius: 10px;
  background: ${(props) =>
    props.$active
      ? themeColors?.gold || "#c9a84c"
      : props.$isavailable
        ? "rgba(255,255,255,0.03)"
        : "#222"};
  color: ${(props) =>
    props.$active
      ? "#1a0e00"
      : props.$isavailable
        ? themeColors?.text || "#fff"
        : "#555"};
  border: 1px solid
    ${(props) =>
      props.$active
        ? themeColors?.gold || "#c9a84c"
        : props.$isavailable
          ? themeColors?.border || "#222"
          : "#333"};
  font-family: ${themeFonts?.body || "sans-serif"};
  font-size: 15px;
  font-weight: ${(props) =>
    props.$active || !props.$isavailable ? "700" : "400"};
  cursor: ${(props) => (props.$isavailable ? "pointer" : "not-allowed")};
  transition: all 0.2s ease;
  text-align: center;
  opacity: ${(props) => (props.$isavailable ? 1 : 0.4)};
  transform: ${(props) => (props.$active ? "scale(1.03)" : "none")};
  box-shadow: ${(props) =>
    props.$active ? `0 4px 12px ${themeColors?.gold || "#c9a84c"}33` : "none"};
`;

export const FooterActions = styled.div`
  margin-top: 20px;
`;
