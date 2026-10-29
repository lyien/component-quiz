import { COPY, RESULTS } from './data.js';

// Matches the Figma "Image Template" frame: 1080 × 1350 (4:5).
const W = 1080;
const H = 1350;
const S = 1080 / 700; // template is the 700px result card scaled up
const FONT = "'Comic Relief', 'Comic Sans MS', cursive";
const INK = '#232323';
const INK_2 = '#3d3d3d';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function setSpacing(ctx, px) {
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${px}px`;
}

export function quizLink() {
  const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  return `${location.host}${path}`;
}

export async function renderShareCard(key) {
  const r = RESULTS[key];
  await Promise.all([
    document.fonts.load(`700 56px ${FONT}`),
    document.fonts.load(`400 31px ${FONT}`),
  ]);
  const art = await loadImage(`assets/illustrations/${r.art.file}`);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';

  // Background + faint grid
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#efefef';
  ctx.lineWidth = 1.5;
  const cell = 46 * S;
  for (let x = cell; x < W; x += cell) {
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 0);
    ctx.lineTo(Math.round(x) + 0.5, H);
    ctx.stroke();
  }
  for (let y = cell; y < H; y += cell) {
    ctx.beginPath();
    ctx.moveTo(0, Math.round(y) + 0.5);
    ctx.lineTo(W, Math.round(y) + 0.5);
    ctx.stroke();
  }

  // Outer border
  const bw = 2 * S;
  ctx.strokeStyle = INK;
  ctx.lineWidth = bw;
  ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);

  const padX = 64 * S; // 98.7
  const contentW = W - padX * 2; // 883
  let y = 32 * S + 64 * S; // top padding + profile padding

  // Headline
  ctx.fillStyle = INK;
  ctx.textAlign = 'center';
  ctx.font = `700 ${36 * S}px ${FONT}`;
  setSpacing(ctx, -0.36 * S);
  const headLines = wrap(ctx, COPY.cardHeadline(r.name), contentW);
  const headLH = 44 * S;
  headLines.forEach((line, i) => ctx.fillText(line, W / 2, y + headLH * (i + 0.78)));
  y += headLH * headLines.length + 24 * S;

  // Illustration box
  const boxH = 324 * S;
  ctx.fillStyle = '#fff8ec';
  ctx.fillRect(padX, y, contentW, boxH);
  ctx.strokeStyle = INK;
  ctx.lineWidth = bw;
  ctx.strokeRect(padX + bw / 2, y + bw / 2, contentW - bw, boxH - bw);

  // Caption (tagline), sits near the bottom of the box
  ctx.font = `400 ${20 * S}px ${FONT}`;
  setSpacing(ctx, 0);
  const capLH = 30 * S;
  const capLines = wrap(ctx, `“${r.tagline}”`, contentW - 96 * S);
  const capBottom = y + boxH - 44 * S;
  const capTop = capBottom - capLH * capLines.length;
  ctx.fillStyle = INK;
  capLines.forEach((line, i) => ctx.fillText(line, W / 2, capTop + capLH * (i + 0.75)));

  // Art: Figma scale where it fits, bottom-aligned above the caption
  const artBottom = capTop - 32 * S;
  const maxArtW = contentW - 48 * S * 2;
  const maxArtH = artBottom - (y + 24 * S);
  const scale = Math.min(S, maxArtW / r.art.w, maxArtH / r.art.h);
  const aw = r.art.w * scale;
  const ah = r.art.h * scale;
  const areaTop = y + 24 * S;
  const ay = Math.min(artBottom - ah, areaTop + (artBottom - areaTop - ah) / 2 + 20 * S);
  ctx.drawImage(art, (W - aw) / 2, ay, aw, ah);

  y += boxH + 24 * S;

  // Details
  ctx.textAlign = 'left';
  const groups = [
    [COPY.strengths, r.strengths],
    [COPY.bugs, r.bug],
    [COPY.pairing, r.pairing],
  ];
  for (const [label, value] of groups) {
    ctx.font = `400 ${16 * S}px ${FONT}`;
    setSpacing(ctx, 1.28 * S);
    ctx.fillStyle = INK_2;
    ctx.fillText(label.toUpperCase(), padX, y + 20 * S * 0.8);
    y += 20 * S + 4 * S;

    ctx.font = `400 ${20 * S}px ${FONT}`;
    setSpacing(ctx, 0);
    ctx.fillStyle = INK;
    const lines = wrap(ctx, value, contentW);
    lines.forEach((line, i) => ctx.fillText(line, padX, y + capLH * (i + 0.75)));
    y += capLH * lines.length + 24 * S;
  }

  // Footer with quiz link
  ctx.textAlign = 'center';
  ctx.font = `400 ${14 * S}px ${FONT}`;
  ctx.fillStyle = INK_2;
  ctx.fillText(COPY.cardFooter(quizLink()), W / 2, H - 32 * S - 40 * S + 8 * S);

  return canvas;
}

export async function downloadShareCard(key) {
  const canvas = await renderShareCard(key);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `i-am-the-${key}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
