/*
Esse aqui é o nosso estojo de desenho super mágico! Ele tem superpoderes para desenhar tesouras voadoras,
 navalhas e piscar luzes brilhantes na água, tudo usando comandos secretos de pintura.
*/

import { GOLD_COLORS, hsl, WAVE_Y } from "../constants/theme";
import { waveY } from "./waveMath";

// 🌟 Cria a lista de ferramentas (tesouras e navalhas) que flutuam na tela
export function createTools(count = 42) {
  return Array.from({ length: count }, () => {
    const isScissor = Math.random() > 0.42;
    return {
      type: isScissor ? "scissor" : "razor",
      x: Math.random(),
      y: Math.random() * 0.82,
      size: 14 + Math.random() * 26,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (0.002 + Math.random() * 0.006) * (Math.random() > 0.5 ? 1 : -1),
      dx: (Math.random() - 0.5) * 0.00028,
      dy: (Math.random() - 0.5) * 0.00018,
      openPhase: Math.random() * Math.PI * 2,
      openSpeed: 0.035 + Math.random() * 0.07,
      colorIdx: Math.floor(Math.random() * GOLD_COLORS.length),
      alpha: 0.14 + Math.random() * 0.28,
      layer: Math.random(),
    };
  });
}

// 🌟 Desenha a lâmina base da tesoura (Unificado)
export function drawBlade(ctx, len, hl, w, dark) {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len, -w * 0.4);
  ctx.lineTo(len, w * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-hl, 0, w * 1.3, 0, Math.PI * 2);
  ctx.fill();

  const previousStyle = ctx.fillStyle;
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(-hl, 0, w * 0.65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = previousStyle;
  ctx.beginPath();
  ctx.moveTo(-hl + w * 1.3, 0);
  ctx.lineTo(0, 0);
  ctx.lineWidth = w * 0.8;
  ctx.stroke();
}

// 🌟 Desenha o movimento completo da Tesoura
export function drawScissor(ctx, cx, cy, sz, ang, open, darkFill = "rgba(8,8,8,0.8)") {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ang);
  const a = open * 0.45;
  const w = sz * 0.075;
  const hLen = sz * 0.55;

  ctx.save();
  ctx.rotate(-a);
  drawBlade(ctx, sz, hLen, w, darkFill);
  ctx.restore();

  ctx.save();
  ctx.rotate(a);
  ctx.scale(1, -1);
  drawBlade(ctx, sz, hLen, w, darkFill);
  ctx.restore();

  ctx.restore();
}

// 🌟 Desenha a Navalha com tratamento de segurança para navegadores antigos (roundRect)
export function drawRazor(ctx, cx, cy, sz, ang) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(ang);
  const w = sz * 0.22;
  const h = sz;

  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(-w * 0.4, -h * 0.15, w * 0.8, h * 0.9, w * 0.15);
  } else {
    ctx.rect(-w * 0.4, -h * 0.15, w * 0.8, h * 0.9);
  }
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w * 0.3, -h * 0.15);
  ctx.lineTo(w * 1.35, -h * 0.52);
  ctx.lineTo(w * 1.35, h * 0.22);
  ctx.lineTo(w * 0.3, h * 0.76);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// 🌟 Monta os cálculos matemáticos das ondas d'água douradas
export function buildWavePath(ctx, time, W, H, STEPS = 200) {
  ctx.beginPath();
  for (let i = 0; i <= STEPS; i++) {
    const xf = i / STEPS;
    const x = xf * W;
    const y = waveY(xf, time) * H;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
}

// 🌟 Executa o loop principal de animação redesenhando o quadro do Canvas
export function renderFrame(ctx, tools, W, H, t) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, W, H);
  const sorted = [...tools].sort((a, b) => a.layer - b.layer);

  for (const tool of sorted) {
    tool.x += tool.dx;
    tool.y += tool.dy;
    tool.angle += tool.angleSpeed * 0.016;

    if (tool.x < -0.08) tool.x = 1.08;
    if (tool.x > 1.08) tool.x = -0.08;
    if (tool.y < -0.08) tool.y = WAVE_Y - 0.02;
    if (tool.y > WAVE_Y - 0.015) tool.y = 0.02;

    const px = tool.x * W;
    const py = tool.y * H;
    const c = GOLD_COLORS[tool.colorIdx];
    
    ctx.save();
    ctx.globalAlpha = tool.alpha * (0.7 + tool.layer * 0.5);
    ctx.fillStyle = hsl(c.h, c.s, c.l);
    ctx.strokeStyle = hsl(c.h, c.s, c.l);
    ctx.lineWidth = 0.8;

    if (tool.type === "scissor") {
      const open = (Math.sin(t * tool.openSpeed * 3 + tool.openPhase) + 1) / 2;
      drawScissor(ctx, px, py, tool.size, tool.angle, open, "rgba(8,8,8,0.8)");
    } else {
      drawRazor(ctx, px, py, tool.size, tool.angle);
    }
    ctx.restore();
  }

  buildWavePath(ctx, t, W, H);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  
  const wTop = waveY(0, t) * H;
  const grd = ctx.createLinearGradient(0, wTop, 0, H);
  grd.addColorStop(0, "hsla(44,92%,70%,.96)");
  grd.addColorStop(0.05, "hsla(41,87%,55%,.98)");
  grd.addColorStop(0.15, "hsla(39,82%,44%,1)");
  grd.addColorStop(0.35, "hsla(36,76%,33%,1)");
  grd.addColorStop(0.6, "hsla(33,70%,22%,1)");
  grd.addColorStop(1, "hsla(30,58%,10%,1)");
  ctx.fillStyle = grd;
  ctx.fill();

  for (let i = 0; i < 8; i++) {
    const xOff = ((i / 8) + t * 0.038) % 1;
    const br = 0.06 + 0.1 * Math.sin(t * 1.1 + i * 1.4);
    const x = xOff * W;
    const wy = waveY(xOff, t) * H;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, wy + 3);
    ctx.lineTo(x + 55, H);
    ctx.lineWidth = 10 + 7 * Math.sin(t * 0.8 + i);
    ctx.strokeStyle = `rgba(255,225,110,${br})`;
    ctx.stroke();
    ctx.restore();
  }

  buildWavePath(ctx, t, W, H);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "rgba(255,210,60,.14)";
  ctx.stroke();
  
  buildWavePath(ctx, t, W, H);
  ctx.lineWidth = 2.5;
  const lg = ctx.createLinearGradient(0, 0, W, 0);
  lg.addColorStop(0, "rgba(255,240,130,.4)");
  lg.addColorStop(0.2, "rgba(255,245,160,.95)");
  lg.addColorStop(0.5, "rgba(255,232,100,1)");
  lg.addColorStop(0.8, "rgba(255,242,155,.9)");
  lg.addColorStop(1, "rgba(255,235,120,.45)");
  ctx.strokeStyle = lg;
  ctx.stroke();

  for (let r = 1; r <= 4; r++) {
    buildWavePath(ctx, t + r * 0.28, W, H);
    const al = 0.07 / r;
    const ry = ctx.createLinearGradient(0, 0, W, 0);
    ry.addColorStop(0, `rgba(255,220,80,0)`);
    ry.addColorStop(0.5, `rgba(255,220,80,${al})`);
    ry.addColorStop(1, `rgba(255,220,80,0)`);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = ry;
    ctx.stroke();
  }
}

// 🌟 COMPATIBILIDADE DE SEGURANÇA: Exporta o apelido no plural para evitar quebras na interface antiga
export { drawScissor as drawScissors };