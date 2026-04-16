import { formatDate } from './formatStats';

const S = 2;
const SHADOW_PAD = 60;
const BORDER = 12;
const RADIUS_INNER = 40;
const RADIUS_OUTER = 52;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function renderAwardToCanvas(award) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const CARD_W   = 390;
  const CARD_H   = 420; // fixed height — award card is square-ish

  canvas.width  = (CARD_W + BORDER * 2 + SHADOW_PAD * 2) * S;
  canvas.height = (CARD_H + BORDER * 2 + SHADOW_PAD * 2) * S;
  ctx.scale(S, S);

  const bx = SHADOW_PAD;
  const by = SHADOW_PAD;
  const cx = bx + BORDER;
  const cy = by + BORDER;

  // ── Drop shadow ───────────────────────────────────────────────
  ctx.save();
  ctx.shadowColor   = 'rgba(0,0,0,0.26)';
  ctx.shadowBlur    = 32;
  ctx.shadowOffsetX = -8;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, bx, by, CARD_W + BORDER * 2, CARD_H + BORDER * 2, RADIUS_OUTER);
  ctx.fill();
  ctx.restore();

  // ── White border ──────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  roundRect(ctx, bx, by, CARD_W + BORDER * 2, CARD_H + BORDER * 2, RADIUS_OUTER);
  ctx.fill();

  // ── Dark card background ──────────────────────────────────────
  ctx.fillStyle = '#1C1C1E';
  roundRect(ctx, cx, cy, CARD_W, CARD_H, RADIUS_INNER);
  ctx.fill();

  // Clip to card
  ctx.save();
  roundRect(ctx, cx, cy, CARD_W, CARD_H, RADIUS_INNER);
  ctx.clip();

  // ── Emoji circle ──────────────────────────────────────────────
  const circleR  = 56;
  const circleCX = cx + CARD_W / 2;
  const circleCY = cy + 80;

  ctx.fillStyle = '#2C2C2E';
  ctx.beginPath();
  ctx.arc(circleCX, circleCY, circleR, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(award.emoji, circleCX, circleCY + 2);

  // ── Award title ───────────────────────────────────────────────
  ctx.fillStyle = award.color || '#ffffff';
  ctx.font = '700 30px -apple-system, "SF Pro Display", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(award.title, cx + CARD_W / 2, circleCY + circleR + 24);

  // ── Description ───────────────────────────────────────────────
  if (award.description) {
    ctx.fillStyle = '#AEAEB2';
    ctx.font = '400 14px -apple-system, "SF Pro Text", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Simple word-wrap at ~300px
    const maxW = 300;
    const words = award.description.split(' ');
    let line = '';
    let lineY = circleCY + circleR + 68;
    const lineH = 20;

    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, cx + CARD_W / 2, lineY);
        line = word;
        lineY += lineH;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, cx + CARD_W / 2, lineY);
  }

  // ── Footer ────────────────────────────────────────────────────
  const footerY = cy + CARD_H - 46;
  ctx.strokeStyle = '#3A3A3C';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + 20, footerY);
  ctx.lineTo(cx + CARD_W - 20, footerY);
  ctx.stroke();

  const H_PAD = 20;
  const contentY = footerY + 14;

  ctx.fillStyle = '#AEAEB2';
  ctx.font = '400 10px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SWEATCARD', cx + H_PAD, contentY);

  ctx.fillStyle = '#636366';
  ctx.font = '400 12px -apple-system, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(formatDate(award.earnedDate), cx + CARD_W - H_PAD, contentY);

  ctx.restore();
  return canvas;
}
