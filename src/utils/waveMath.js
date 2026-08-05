/*
Esse arquivo é o robozinho matemático. Ele fica calculando onde a cobrinha de água vai subir e onde ela vai descer para o desenho não ficar parado.
*/

import { WAVE_Y, WAVE_HARMONICS } from "../constants/theme";

export function waveY(xf, time) {
  let y = WAVE_Y;
  for (const w of WAVE_HARMONICS) {
    y += w.amp * Math.sin(xf * Math.PI * 2 * w.freq + time * w.spd + w.ph);
  }
  return y;
}
export function calculateWaveY(xf, t, baseLineY) {
  let y = baseLineY;
  for (const w of WAVE_HARMONICS) {
    y += w.amp * Math.sin(xf * Math.PI * 2 * w.freq + t * w.spd + w.ph);
  }
  return y;
}

export function generateWavePath(ctx, t, W, H, baseLineY) {
  ctx.beginPath();
  const segments = 220;
  for (let i = 0; i <= segments; i++) {
    const xf = i / segments;
    const x = xf * W;
    const y = calculateWaveY(xf, t, baseLineY) * H;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
}