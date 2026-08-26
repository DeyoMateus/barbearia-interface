import styled from "styled-components";
import { C as themeColors, font as themeFonts } from "../../constants/theme.js";

// ─── COMPONENTES ESTILIZADOS ────────────────────────────────────────────────

export const Container = styled.div`
  position: relative;
  min-height: 100vh;
  /* Fundo transparente para permitir que o AnimatedBg apareça */
  background: transparent;
  overflow-x: hidden;
`;

export const ContainerRight = styled.div`
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 120px;

  @media (min-width: 768px) {
    padding: 32px 24px 140px;
  }
`;

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: center;
  background: rgba(22, 22, 20, 0.65);
  border: 1px solid ${themeColors?.border || "#222"};
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 32px;
  backdrop-filter: blur(12px);

  @media (max-width: 380px) {
    padding: 16px;
    border-radius: 14px;
    gap: 16px;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
    padding: 32px;
  }
`;

/* Carrossel de Categorias */
export const ContainerCategory = styled.div`
  display: flex;
  width: 100%; /* ADICIONE ESTA LINHA */
  gap: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  margin-bottom: 32px;
  padding: 4px 2px 12px;
  -webkit-overflow-scrolling: touch;

  /* Oculta barra de rolagem mantendo a funcionalidade */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > button {
    scroll-snap-align: start;
    flex-shrink: 0;
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
  padding: 0 34px;

  @media (max-width: 640px) {
    padding: 0 30px;
  }
  @media (max-width: 380px) {
    padding: 0 26px;
  }
`;

export const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.$direction === "left" ? "left: 0;" : "right: 0;")}
  z-index: 5;

  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(8, 8, 8, 0.55);
  border: 1px solid rgba(201, 168, 76, 0.35);
  color: #c9a84c;
  font-size: 14px;
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

  &:hover {
    background: rgba(201, 168, 76, 0.14);
    border-color: rgba(201, 168, 76, 0.7);
  }
  &:active {
    transform: translateY(-50%) scale(0.9);
  }

  @media (max-width: 640px) {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }
  @media (max-width: 380px) {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
`;

/* Trilho horizontal para os cards de serviço da categoria selecionada */
export const ServicesScroll = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  padding: 4px 2px 16px;
  -webkit-overflow-scrolling: touch;

  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  & > * {
    flex: 0 0 100%; /* ocupa 100% da largura do trilho */
    max-width: 340px; /* mas não fica gigante em telas largas */
    scroll-snap-align: center;
    scroll-snap-stop: always; /* impede "pular" mais de um card no swipe rápido */
  }

  @media (min-width: 640px) {
    & > * {
      flex: 0 0 auto; /* em telas maiores volta ao tamanho fixo normal */
      width: 280px;
      max-width: none;
    }
  }
`;

// ─── OBJETOS DE ESTILO PARA ELEMENTOS INTERNOS ───────────────────────────────

export const styles = {
  headerBar: {
    marginBottom: 32,
  },
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
    marginBottom: "13px",
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
    maxHeight: "320px",
    display: "block",
    objectFit: "cover",
    borderRadius: "12px",
    filter: "contrast(1.05) brightness(0.9)",
  },
  categoryTitle: {
    fontFamily: themeFonts?.display || "serif",
    fontSize: 24,
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
    padding: "10px 22px",
    fontFamily: themeFonts?.body || "sans-serif",
    fontSize: 13,
    color: isActive ? "#1a0e00" : themeColors?.muted || "#ccc",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    transition: "all .2s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: 8,
    backdropFilter: "blur(8px)",
  }),
  tabBadge: (isActive) => ({
    background: isActive ? "rgba(0,0,0,0.25)" : themeColors?.gold || "#c9a84c",
    color: isActive ? "#fff" : "#1a0e00",
    borderRadius: 10,
    padding: "1px 7px",
    fontSize: 11,
    fontWeight: 700,
  }),
};
