import { getStats, formatDate, formatTimeRange } from './formatStats';

const S = 2;           // retina scale — renders at 2x
const SHADOW_PAD = 60; // room around card for the drop shadow
const BORDER = 12;     // white border thickness (matches CSS outline)
const RADIUS_INNER = 40; // card border-radius
const RADIUS_OUTER = 52; // RADIUS_INNER + BORDER

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

export async function renderCardToCanvas(workout) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const stats = getStats(workout);
  const numRows = Math.ceil(stats.length / 2);

  // ── Layout constants (logical px) ──────────────────────────
  const CARD_W    = 390;
  const H_PAD     = 20;
  const V_PAD_T   = 20;
  const V_PAD_B   = 18;
  const HEADER_H  = 64;   // icon circle is 52px, title group fits inside
  const HEADER_MB = 18;
  const SECTION_H = 28;   // "Workout Details" label + margin
  const ROW_H     = 58;   // each stat row inside the container
  const FOOTER_H  = 60;   // margin-top + border + padding + content

  const CARD_H =
    V_PAD_T + HEADER_H + HEADER_MB + SECTION_H +
    numRows * ROW_H + FOOTER_H + V_PAD_B;

  // Canvas includes border + shadow padding on all sides
  canvas.width  = (CARD_W + BORDER * 2 + SHADOW_PAD * 2) * S;
  canvas.height = (CARD_H + BORDER * 2 + SHADOW_PAD * 2) * S;
  ctx.scale(S, S);

  // Card top-left origin (inside shadow padding, outside border)
  const bx = SHADOW_PAD;          // border x
  const by = SHADOW_PAD;          // border y
  const cx = bx + BORDER;         // card x
  const cy = by + BORDER;         // card y

  // ── Drop shadow (matches SVG filter: dx=-8 dy=10 blur=16 opacity=0.26) ──
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

  // Clip all content to card shape
  ctx.save();
  roundRect(ctx, cx, cy, CARD_W, CARD_H, RADIUS_INNER);
  ctx.clip();

  let y = cy + V_PAD_T;

  // ── Header ───────────────────────────────────────────────────
  const ICON_R  = 26; // circle radius
  const iconCX  = cx + H_PAD + ICON_R;
  const iconCY  = y + ICON_R;

  // Emoji icon (no circle bg — blends with card)
  const emojiMap = { strength: '🏋️', cycling_indoor: '🚴', running: '🏃', walking: '🚶' };
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emojiMap[workout.workoutTypeKey] || '🏋️', iconCX, iconCY + 1);

  // Workout title
  const textX = cx + H_PAD + ICON_R * 2 + 14;
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 17px -apple-system, "SF Pro Display", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(workout.workoutType, textX, y + 2);

  // Time range
  const timeRange = formatTimeRange(workout.startDate, workout.endDate);
  ctx.fillStyle = '#AEAEB2';
  ctx.font = '400 13px -apple-system, "SF Pro Text", sans-serif';
  ctx.fillText(timeRange, textX, y + 24);


  y += HEADER_H + HEADER_MB;

  // ── Section label ────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 15px -apple-system, "SF Pro Display", sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Workout Details', cx + H_PAD, y);
  y += SECTION_H;

  // ── Stat container ───────────────────────────────────────────
  const containerW = CARD_W - H_PAD * 2;
  const containerH = numRows * ROW_H;

  // Stat container blends with card bg — no separate fill, just dividers

  const colW    = containerW / 2;
  const CELL_PT = 14; // cell padding top

  for (let i = 0; i < stats.length; i++) {
    const row  = Math.floor(i / 2);
    const col  = i % 2;
    const cellX = cx + H_PAD + col * colW + 16;
    const cellY = y + row * ROW_H;

    // Row divider
    if (row > 0 && col === 0) {
      ctx.strokeStyle = '#3A3A3C';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + H_PAD, cellY);
      ctx.lineTo(cx + H_PAD + containerW, cellY);
      ctx.stroke();
    }

    // Col divider
    if (col === 0) {
      ctx.strokeStyle = '#3A3A3C';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + H_PAD + colW, cellY);
      ctx.lineTo(cx + H_PAD + colW, cellY + ROW_H);
      ctx.stroke();
    }

    // Stat label (above value)
    ctx.fillStyle = '#AEAEB2';
    ctx.font = '400 11px -apple-system, "SF Pro Text", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(stats[i].label, cellX, cellY + CELL_PT);

    // Stat value (colored, large)
    const valueY = cellY + CELL_PT + 16;
    ctx.fillStyle = stats[i].color;
    ctx.font = '700 24px -apple-system, "SF Pro Display", sans-serif';
    ctx.textBaseline = 'top';
    const valueStr = String(stats[i].value);
    ctx.fillText(valueStr, cellX, valueY);

    // Inline unit (smaller, same color)
    if (stats[i].unit) {
      const valueW = ctx.measureText(valueStr).width;
      ctx.font = '600 13px -apple-system, "SF Pro Text", sans-serif';
      ctx.fillText(stats[i].unit, cellX + valueW + 1, valueY + 4);
    }
  }

  y += containerH;

  // ── Footer ───────────────────────────────────────────────────
  const footerBorderY = y + 14;
  ctx.strokeStyle = '#3A3A3C';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx + H_PAD, footerBorderY);
  ctx.lineTo(cx + CARD_W - H_PAD, footerBorderY);
  ctx.stroke();

  const footerContentY = footerBorderY + 16;

  // SWEATCARD wordmark
  ctx.fillStyle = '#AEAEB2';
  ctx.font = '400 10px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SWEATCARD', cx + H_PAD, footerContentY);

  ctx.restore();
  return canvas;
}
