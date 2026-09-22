import { TYPES } from '../data/catalog';

const SIZE_IDX = { XS: 0, S: 1, M: 2, L: 3, XL: 4, XXL: 5 };
const CHEST = [88, 94, 100, 106, 112, 118];
const STYLE_ADJ = { slim: -4, regular: 0, relaxed: 6, oversized: 14 };
const round = Math.round;

/** Typical garment measurements (cm, circumference) from type + size + cut */
export function measuresFor(type, size, style = 'regular') {
  const slot = TYPES[type]?.slot;
  const i = SIZE_IDX[size];
  const adj = STYLE_ADJ[style] ?? 0;
  if (slot === 'top' || slot === 'outer') {
    const idx = i ?? 2;
    const len = { tee: 68, shirt: 73, hoodie: 67, kurta: 98, jacket: 65 }[type] || 68;
    return { chest: CHEST[idx] + adj, shoulder: round(40 + idx * 1.5 + (style === 'oversized' ? 5 : style === 'relaxed' ? 2 : 0)), length: round(len + idx * 1.2) };
  }
  if (slot === 'full') {
    const idx = i ?? 1;
    return { chest: round(CHEST[idx] - 4 + adj / 2), waist: round(CHEST[idx] - 18 + adj / 2), length: round(104 + idx * 1.5) };
  }
  if (slot === 'bottom') {
    const waist = /^\d+$/.test(size) ? round(+size * 2.54) : [66, 70, 75, 81, 87, 93][i ?? 2];
    const w = waist + (style === 'oversized' ? 4 : style === 'relaxed' ? 2 : style === 'slim' ? -1 : 0);
    return { waist: w, hips: w + (type === 'skirt' ? 18 : 20) + (style === 'oversized' ? 10 : style === 'relaxed' ? 6 : 0), length: type === 'skirt' ? 60 : 100 };
  }
  if (slot === 'shoes') {
    const uk = +String(size).replace(/\D/g, '') || 7;
    return { foot: +(23.8 + (uk - 5) * 0.83).toFixed(1) };
  }
  return {};
}

const EASE = {
  chest: { slim: [2, 9], regular: [6, 17], relaxed: [12, 28] },
  waist: { slim: [-2, 2], regular: [-1, 5], relaxed: [2, 10] },
  hips: { slim: [2, 8], regular: [4, 12], relaxed: [8, 20] },
};

function dim(name, itemV, youV, lo, hi, penalty) {
  const delta = +(itemV - youV).toFixed(1);
  let s = 100, verdict = 'perfect';
  if (delta < lo) { s = 100 - (lo - delta) * penalty; verdict = delta < lo - 4 ? 'tight' : 'snug'; }
  else if (delta > hi) { s = 100 - (delta - hi) * penalty; verdict = delta > hi + 8 ? 'loose' : 'roomy'; }
  return { name, item: itemV, you: youV, delta, score: Math.max(0, round(s)), verdict, range: [lo, hi] };
}

const NOTE = { perfect: 'right in your comfort zone', snug: 'a touch snug', tight: 'likely too tight', roomy: 'a bit roomy', loose: 'very loose' };

/** Smart Fit Match: compares item measurements against saved body measurements */
export function fitMatch(item, me) {
  if (!item || !me) return null;
  const m = item.measures || {};
  const slot = TYPES[item.type]?.slot;
  const pref = me.fitPref || 'regular';
  let rows = [], weights = [];
  if (slot === 'top' || slot === 'outer') {
    rows = [dim('Chest', m.chest, me.chest, ...EASE.chest[pref], 5), dim('Shoulder', m.shoulder, me.shoulder, -1, pref === 'relaxed' ? 6 : 3, 12)];
    weights = [0.65, 0.35];
  } else if (slot === 'full') {
    rows = [dim('Bust', m.chest, me.chest, 2, 12, 5), dim('Waist', m.waist, me.waist, 0, 14, 5)];
    weights = [0.5, 0.5];
  } else if (slot === 'bottom') {
    rows = [dim('Waist', m.waist, me.waist, ...EASE.waist[pref], 6), dim('Hips', m.hips, me.hips, ...EASE.hips[pref], 5)];
    weights = [0.55, 0.45];
  } else if (slot === 'shoes') {
    rows = [dim('Foot length', m.foot, me.foot, 0.3, 1.5, 28)];
    weights = [1];
  } else return null;
  const score = round(rows.reduce((a, r, i) => a + r.score * weights[i], 0));
  const worst = [...rows].sort((a, b) => a.score - b.score)[0];
  rows.forEach((r) => (r.note = NOTE[r.verdict]));
  const label = score >= 88 ? 'Perfect fit' : score >= 75 ? 'Good fit' : score >= 60 ? 'Wearable' : 'Likely off';
  const tip = worst.verdict === 'perfect'
    ? 'Every measurement lands in your comfort zone.'
    : `${worst.name} is ${NOTE[worst.verdict]} (${worst.delta > 0 ? '+' : ''}${worst.delta} cm vs your body).`;
  return { score, label, rows, tip, tone: score >= 88 ? 'great' : score >= 75 ? 'good' : score >= 60 ? 'ok' : 'bad' };
}
