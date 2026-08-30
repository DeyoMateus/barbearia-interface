import styled from "styled-components";
import { C as themeColors, font as themeFonts } from "../../constants/theme.js";

// ─── COMPONENTES ESTILIZADOS ────────────────────────────────────────────────

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  background: transparent;
  overflow-x: hidden;
`;

export const ContainerRight = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 12px 80px;

  @media (min-width: 640px) {
    padding: 24px 20px 100px;
  }

  @media (min-width: 1024px) {
    padding: 32px 24px 140px;
  }
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: center;
  background: rgba(22, 22, 20, 0.65);
  border: 1px solid ${themeColors?.border || "#222"};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 360px) {
    padding: 12px;
    border-radius: 12px;
    gap: 14px;
  }

  @media (min-width: 640px) {
    padding: 24px;
    gap: 28px;
    border-radius: 20px;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
    padding: 32px;
    margin-bottom: 32px;
  }
`;

/* Carrossel de Categorias */
export const ContainerCategory = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  margin-bottom: 24px;
  padding: 4px 2px 12px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > button {
    scroll-snap-align: start;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    gap: 12px;
    margin-bottom: 32px;
  }
`;

export const ContainerServices = styled.div`
  width: 100%;
`;

export const CarouselWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 20px;

  @media (min-width: 480px) {
    padding: 0 30px;
  }

  @media (min-width: 768px) {
    padding: 0 38px;
  }
`;

export const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$direction === "left" ? "left: -4px;" : "right: -4px;")}
  z-index: 5;

  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(8, 8, 8, 0.75);
  border: 1px solid rgba(201, 168, 76, 0.35);
  color: #c9a84c;
  font-size: 12px;
  line-height: 1;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  opacity: ${(props) => (props.$visible ? 1 : 0)};
  pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
  transform: translateY(-50%) scale(${(props) => (props.$visible ? 1 : 0.85)});

  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    bottom: -8px;
    left: -8px;
    right: -8px;
  }

  &:hover {
    background: rgba(201, 168, 76, 0.2);
    border-color: rgba(201, 168, 76, 0.7);
  }
  &:active {
    transform: translateY(-50%) scale(0.9);
  }

  @media (min-width: 640px) {
    ${(props) => (props.$direction === "left" ? "left: 0;" : "right: 0;")}
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  @media (min-width: 1024px) {
    width: 36px;
    height: 36px;
    font-size: 15px;
  }
`;

/* Trilho horizontal para os cards de serviço da categoria selecionada */
export const ServicesScroll = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 4px 2px 16px;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex: 0 0 85%;
    max-width: 320px;
    scroll-snap-align: center;
    scroll-snap-stop: always;
  }

  @media (min-width: 540px) {
    gap: 16px;
    & > * {
      flex: 0 0 260px;
      max-width: none;
      scroll-snap-align: start;
    }
  }

  @media (min-width: 768px) {
    gap: 20px;
    & > * {
      flex: 0 0 280px;
    }
  }

  @media (min-width: 1200px) {
    & > * {
      flex: 0 0 300px;
    }
  }
`;

// ─── OBJETOS DE ESTILO PARA ELEMENTOS INTERNOS ───────────────────────────────

export const styles = {
  headerBar: {
    marginBottom: 24,
  },
  brandSub: {
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 10,
    color: themeColors?.gold || "#c9a84c",
    letterSpacing: "clamp(2px, 0.8vw, 4px)",
    textTransform: "uppercase",
    margin: 0,
  },
  brandTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: "clamp(20px, 3.5vw, 32px)",
    color: themeColors?.text || "#fff",
    margin: "4px 0 0",
    fontWeight: 700,
    marginBottom: "12px",
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
    fontSize: "clamp(22px, 4vw, 36px)",
    color: themeColors?.text || "#fff",
    margin: "0 0 12px",
    lineHeight: 1.25,
  },
  heroSubtitle: {
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: "clamp(13px, 1.8vw, 15px)",
    color: themeColors?.muted || "#888",
    margin: "0 0 20px",
    lineHeight: 1.6,
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
    maxHeight: "clamp(200px, 35vh, 320px)",
    display: "block",
    objectFit: "cover",
    borderRadius: "12px",
    filter: "contrast(1.05) brightness(0.9)",
  },
  categoryTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: "clamp(20px, 3vw, 24px)",
    color: themeColors?.text || "#fff",
    margin: "0 0 16px",
    fontStyle: "italic",
  },
  tabButton: (isActive) => ({
    background: isActive
      ? `linear-gradient(135deg, #b8900c, ${themeColors?.gold || "#c9a84c"})`
      : "rgba(22, 22, 20, 0.8)",
    border: `1px solid ${isActive ? "transparent" : themeColors?.border || "#333"}`,
    borderRadius: 30,
    padding: "8px 16px",
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 13,
    color: isActive ? "#1a0e00" : themeColors?.muted || "#ccc",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    transition: "all .2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: 6,
    whiteSpace: "nowrap",
    backdropFilter: "blur(8px)",
  }),
  tabBadge: (isActive) => ({
    background: isActive ? "rgba(0,0,0,0.25)" : themeColors?.gold || "#c9a84c",
    color: isActive ? "#fff" : "#1a0e00",
    borderRadius: 10,
    padding: "1px 6px",
    fontSize: 11,
    fontWeight: 700,
  }),
};
