/*
  🌟 CENTRAL DE DIRETRIZES ESTÉTICAS - BARBEARIA PREMIUM
  Este arquivo concentra todas as constantes matemáticas, paletas de cores,
  regras de estilo CSS-in-JS e dados estáticos da aplicação.
*/

// ==========================================
// 🌊 1. PARÂMETROS DE FÍSICA E CANVAS (ONDA)
// ==========================================

export const WAVE_Y = 0.78;

// Configuração unificada das frequências matemáticas do movimento fluido da água
export const WAVE_HARMONICS = [
  { amp: 0.019, freq: 1.3, spd: 0.55, ph: 0 },
  { amp: 0.012, freq: 2.8, spd: 0.9, ph: 1.2 },
  { amp: 0.008, freq: 5.2, spd: 1.35, ph: 0.7 },
  { amp: 0.005, freq: 8.5, spd: 2.1, ph: 2.1 },
  { amp: 0.003, freq: 13, spd: 3.2, ph: 0.4 },
];

// ==========================================
// 🎨 2. DESIGN SYSTEM (CORES E FONTES)
// ==========================================

// Paleta centralizada de ouro premium utilizada no Canvas
export const GOLD_COLORS = [
  { h: 42, s: 75, l: 42 },
  { h: 38, s: 65, l: 35 },
  { h: 45, s: 80, l: 50 },
  { h: 40, s: 70, l: 38 },
  { h: 44, s: 72, l: 46 },
];

// Alias para manter compatibilidade caso algum componente busque por GOLD_PALETTE
export const GOLD_PALETTE = GOLD_COLORS;

// Paleta de cores hexadecimais/rgba para a interface (Cards, Bordas, Textos)
export const C = {
  bg: "#0a0a08",
  surface: "#111110",
  card: "#161614",
  border: "rgba(201,168,76,0.15)",
  borderH: "rgba(201,168,76,0.4)",
  gold: "#c9a84c",
  goldL: "#e8c86a",
  goldD: "#8a6e25",
  text: "#f0dfa0",
  muted: "rgba(240,223,160,0.45)",
};

export const font = {
  display: "'Playfair Display', serif",
  body: "'DM Sans', sans-serif",
};

// Utilitário para conversão HSL dinâmico
export const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

// ==========================================
// 🏛️ 3. REGRAS DE ESTILO (CSS-in-JS)
// ==========================================

export const styles = {
  root: { position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#080808", fontFamily: "'Cormorant Garamond', serif" },
  canvas: { position: "absolute", inset: 0, width: "100%", height: "100%" },
  overlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "rgba(8,8,8,0.75)", border: "1px solid rgba(184,144,56,0.38)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", padding: "44px 48px 40px", width: 360, position: "relative", boxShadow: "0 0 60px rgba(180,130,20,0.12), inset 0 0 40px rgba(0,0,0,0.4)" },
  cardTopBorder: { position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,#d4aa50,transparent)" },
  cardBottomBorder: { position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(180,130,20,0.4),transparent)" },
  brand: { textAlign: "center", marginBottom: 30 },
  brandSymbol: { fontSize: 13, color: "#c9a84c", letterSpacing: 8, display: "block", marginBottom: 8 },
  brandTitle: { fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 700, color: "#f0dfa0", letterSpacing: 5, textTransform: "uppercase", margin: 0 },
  brandSub: { fontSize: 10, color: "rgba(184,144,56,0.6)", letterSpacing: 4, textTransform: "uppercase", margin: "6px 0 0" },
  divider: { width: 50, height: 1, background: "linear-gradient(90deg,transparent,#c9a84c,transparent)", margin: "0 auto 28px" },
  fieldWrap: { marginBottom: 18 },
  label: { display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "rgba(184,144,56,0.75)", marginBottom: 7 },
  input: { width: "100%", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(184,144,56,0.22)", color: "#f0dfa0", fontFamily: "'Cormorant Garamond', serif", fontSize: 15, padding: "11px 15px", outline: "none", boxSizing: "border-box" },
  btn: { width: "100%", marginTop: 26, padding: "13px", background: "linear-gradient(135deg,#b8900c 0%,#c9a84c 40%,#e8c86a 70%,#c9a84c 100%)", border: "none", color: "#1a0e00", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", cursor: "pointer", position: "relative", overflow: "hidden" },
  forgot: { textAlign: "center", marginTop: 16, fontSize: 12, color: "rgba(184,144,56,0.45)", letterSpacing: 1.5, cursor: "pointer" },
};

// ==========================================
// 📦 4. METADADOS E ESTRUTURAS DE CONTEÚDO
// ==========================================

export const CATEGORY_META = {
  cortes:       { label: "Cortes",       icon: "✂" },
  barba:        { label: "Barba",        icon: "⚔" },
  sobrancelha:  { label: "Sobrancelha", icon: "◠" },
  coloracao:    { label: "Coloração",   icon: "◈" },
  pigmentacao:  { label: "Pigmentação", icon: "⬡" },
  tratamento:   { label: "Tratamento",   icon: "✦" },
};

export const CATEGORY_ORDER = Object.keys(CATEGORY_META);

