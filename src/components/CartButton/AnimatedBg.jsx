import { useEffect, useRef } from "react";

const WAVE_Y = 0.82;
const HARMONICS = [
    { amp: 0.014, freq: 1.3, spd: 0.5, ph: 0 },
    { amp: 0.009, freq: 2.8, spd: 0.85, ph: 1.2 },
    { amp: 0.005, freq: 5.2, spd: 1.3, ph: 0.7 },
    { amp: 0.003, freq: 8.5, spd: 2.0, ph: 2.1 },
];

function wY(xf, t) {
    let y = WAVE_Y;
    for (const w of HARMONICS) y += w.amp * Math.sin(xf * Math.PI * 2 * w.freq + t * w.spd + w.ph);
    return y;
}

function createTools(n) {
    return Array.from({ length: n }, () => ({
        type: Math.random() > 0.45 ? "scissor" : "razor",
        x: Math.random(), y: Math.random() * 0.78,
        size: 12 + Math.random() * 22,
        angle: Math.random() * Math.PI * 2,
        aSpeed: (0.002 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
        dx: (Math.random() - 0.5) * 0.00022,
        dy: (Math.random() - 0.5) * 0.00015,
        op: Math.random() * Math.PI * 2,
        os: 0.03 + Math.random() * 0.065,
        ci: Math.floor(Math.random() * 5),
        alpha: 0.1 + Math.random() * 0.22,
        layer: Math.random(),
    }));
}

const GOLDS = [[42, 75, 42], [38, 65, 35], [45, 80, 50], [40, 70, 38], [44, 72, 46]].map(([h, s, l]) => `hsla(${h},${s}%,${l}%,1)`);

function drawBlade(ctx, len, hl, w, dark) {
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(len, -w * .4); ctx.lineTo(len, w * .4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(-hl, 0, w * 1.3, 0, Math.PI * 2); ctx.fill();
    const p = ctx.fillStyle; ctx.fillStyle = dark;
    ctx.beginPath(); ctx.arc(-hl, 0, w * .65, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = p;
    ctx.beginPath(); ctx.moveTo(-hl + w * 1.3, 0); ctx.lineTo(0, 0); ctx.lineWidth = w * .8; ctx.stroke();
}

function drawScissor(ctx, cx, cy, sz, ang, open, dark) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    const a = open * .45, w = sz * .075;
    ctx.save(); ctx.rotate(-a); drawBlade(ctx, sz, sz * .55, w, dark); ctx.restore();
    ctx.save(); ctx.rotate(a); ctx.scale(1, -1); drawBlade(ctx, sz, sz * .55, w, dark); ctx.restore();
    ctx.restore();
}

function drawRazor(ctx, cx, cy, sz, ang) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
    const w = sz * .22, h = sz;
    ctx.beginPath(); ctx.roundRect(-w * .4, -h * .15, w * .8, h * .9, w * .15); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w * .3, -h * .15); ctx.lineTo(w * 1.35, -h * .52); ctx.lineTo(w * 1.35, h * .22); ctx.lineTo(w * .3, h * .76); ctx.closePath(); ctx.fill();
    ctx.restore();
}

function buildPath(ctx, t, W, H) {
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
        const xf = i / 200, x = xf * W, y = wY(xf, t) * H;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
}

function renderBg(ctx, tools, W, H, t) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0a08"; ctx.fillRect(0, 0, W, H);
    const sorted = [...tools].sort((a, b) => a.layer - b.layer);
    for (const tool of sorted) {
        tool.x += tool.dx; tool.y += tool.dy; tool.angle += tool.aSpeed * .016;
        if (tool.x < -.08) tool.x = 1.08; if (tool.x > 1.08) tool.x = -.08;
        if (tool.y < -.08) tool.y = WAVE_Y - .02; if (tool.y > WAVE_Y - .015) tool.y = .02;
        ctx.save();
        ctx.globalAlpha = tool.alpha * (0.6 + tool.layer * .55);
        ctx.fillStyle = GOLDS[tool.ci]; ctx.strokeStyle = GOLDS[tool.ci]; ctx.lineWidth = .8;
        if (tool.type === "scissor") {
            const o = (Math.sin(t * tool.os * 3 + tool.op) + 1) / 2;
            drawScissor(ctx, tool.x * W, tool.y * H, tool.size, tool.angle, o, "rgba(10,10,8,0.8)");
        } else drawRazor(ctx, tool.x * W, tool.y * H, tool.size, tool.angle);
        ctx.restore();
    }
    buildPath(ctx, t, W, H); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    const grd = ctx.createLinearGradient(0, wY(0, t) * H, 0, H);
    grd.addColorStop(0, "hsla(44,92%,68%,.95)"); grd.addColorStop(.06, "hsla(41,87%,54%,.98)");
    grd.addColorStop(.18, "hsla(39,82%,43%,1)"); grd.addColorStop(.4, "hsla(36,76%,32%,1)");
    grd.addColorStop(.7, "hsla(33,70%,20%,1)"); grd.addColorStop(1, "hsla(30,58%,10%,1)");
    ctx.fillStyle = grd; ctx.fill();
}

export function AnimatedBg({ style }) {
    const canvasRef = useRef(null);
    const rootRef = useRef(null);
    const toolsRef = useRef(createTools(32));

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let W, H, raf;

        const resize = () => {
            if (!rootRef.current) return;

            const r = rootRef.current.getBoundingClientRect();
            W = canvas.width = r.width;
            H = canvas.height = r.height;
        };
        resize();
        const ro = new ResizeObserver(resize);
        if (rootRef.current) ro.observe(rootRef.current);
        function loop(ts) { renderBg(ctx, toolsRef.current, W, H, ts * .001); raf = requestAnimationFrame(loop); }
        raf = requestAnimationFrame(loop);
        return () => { cancelAnimationFrame(raf); ro.disconnect(); };
    }, []);

    return (
        <div ref={rootRef} style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", ...style }}>
            <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
    );
}