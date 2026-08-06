import styled from "styled-components";

// 🌟 SOLUÇÃO: Renomeando as variáveis na importação para blindar o escopo contra falhas do compilador
import { C as themeColors, font as themeFonts } from "../../constants/theme.js";

// ─── COMPONENTES ESTILIZADOS ────────────────────────────────────────────────

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  background: ${themeColors?.bg || "#0a0a08"};
  overflow-x: hidden;
`;

export const ContainerRight = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;

  @media (min-width: 768px) {
    padding: 0 24px;
  }
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
  background: rgba(22, 22, 20, 0.4);
  border: 1px solid ${themeColors?.border || "#222"};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 40px;
  backdrop-filter: blur(10px);

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
    padding: 32px;
  }
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
    fontSize: "clamp(24px, 4vw, 32px)",
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
    fontSize: "clamp(26px, 4.5vw, 36px)",
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
    width: "100%",
    maxWidth: "100%",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "transparent",
    zIndex: 1,
  },
  heroImg: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "contain",
    filter: "contrast(1.05) brightness(0.9)",
  },
  gridServices: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
