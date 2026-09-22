import { TYPES, OCCASIONS } from '../data/catalog';
import { harmony, harmonyLabel, isNeutral } from './color';
import { fitMatch } from './fit';
import { rng } from './format';

const NAMES = {
  casual: ['Sunday Slow Brunch', 'Chai & Chill', 'Coffee-Run Cool'],
  college: ['Campus Cool', 'Lecture Hall Layers', 'Canteen Chic'],
  work: ['Monday Sorted', 'Boardroom Soft Power', 'Desk-to-Dinner'],
  date: ['Golden Hour Plans', 'Café Date Energy', 'Rooftop Ready'],
  festive: ['Mehendi Ready', 'Diwali Dinner', 'Shaadi Season'],
  travel: ['Airport Aesthetic', 'Weekend in Jaipur', 'Train-Window Comfort'],
};

export const closetToItem = (w) => ({ key: 'c-' + w.id, src: 'closet', id: w.id, name: w.name, type: w.type, color: w.color, colorName: w.colorName, pattern: w.pattern, cut: w.cut || 'regular', tags: w.tags });
export const productToItem = (p) => ({ key: 'm-' + p.id, src: 'market', id: p.id, name: p.title, type: p.type, color: p.color, colorName: p.colorName, pattern: p.pattern, cut: p.cut, tags: p.tags, price: p.price, product: p });

function scoreItem(it, { occ, vibe, weather, r, meas }) {
  const tagOk = it.tags.some((t) => occ.tags.includes(t)) ? 1 : 0.35;
  let v = 0.8;
  if (vibe === 'minimal') v = isNeutral(it.color) ? 1 : 0.6;
  if (vibe === 'streetwear') v = it.tags.includes('streetwear') || it.cut === 'oversized' || it.type === 'sneakers' ? 1 : 0.55;
  if (vibe === 'ethnic') v = it.type === 'kurta' || it.tags.includes('ethnic') ? 1 : 0.35;
  if (vibe === 'classic') v = ['shirt', 'trousers', 'jacket', 'skirt'].includes(it.type) || it.tags.includes('work') ? 1 : 0.55;
  let w = 1;
  if (weather === 'hot' && ['hoodie', 'jacket'].includes(it.type)) w = 0.1;
  if (weather === 'cool' && ['hoodie', 'jacket'].includes(it.type)) w = 1.1;
  let fit = 1;
  if (it.product) {
    const f = fitMatch(it.product, meas);
    if (f) { it.fit = f.score; fit = 0.6 + 0.4 * (f.score / 100); }
  }
  return (0.45 * tagOk + 0.3 * v + 0.25) * w * fit + (it.src === 'closet' ? 0.08 : 0) + (r() - 0.5) * 0.22;
}

export function generateOutfits({ closet, market, occasion = 'casual', vibe = 'any', weather = 'pleasant', budget = 3000, anchor = null, meas, useMarket = true, seed = 1 }) {
  const r = rng(seed * 2654435761);
  const occ = OCCASIONS[occasion];
  const pool = [...closet.map(closetToItem), ...(useMarket ? market.filter((p) => !p.sold && p.sellerId !== 'me').map(productToItem) : [])];
  if (anchor && !pool.find((p) => p.key === anchor.key)) pool.push(anchor);
  pool.forEach((it) => (it.s = scoreItem(it, { occ, vibe, weather, r, meas })));
  const ok = pool.filter((it) => !it.product || (it.fit ?? 100) >= 60);
  const bySlot = (slot) => ok.filter((it) => TYPES[it.type].slot === slot).sort((a, b) => b.s - a.s);
  let tops = bySlot('top'), bottoms = bySlot('bottom'), fulls = bySlot('full'), outers = bySlot('outer'), shoes = bySlot('shoes'), accs = bySlot('accessory');
  if (anchor) {
    const sl = TYPES[anchor.type].slot;
    if (sl === 'top') { tops = [anchor]; fulls = []; }
    if (sl === 'bottom') { bottoms = [anchor]; fulls = []; }
    if (sl === 'full') { fulls = [anchor]; tops = []; bottoms = []; }
    if (sl === 'outer') outers = [anchor];
    if (sl === 'shoes') shoes = [anchor];
    if (sl === 'accessory') accs = [anchor];
  }
  const bases = [];
  tops.slice(0, 7).forEach((t) => bottoms.slice(0, 7).forEach((b) => bases.push([t, b])));
  fulls.slice(0, 5).forEach((f) => bases.push([f]));
  const best = (list, base) => {
    if (list.length === 1 && anchor && list[0].key === anchor.key) return list[0];
    let pick = null, ps = -1;
    list.slice(0, 6).forEach((c) => {
      const h = base.reduce((a, b) => a + harmony(c.color, b.color), 0) / base.length;
      const sc = c.s * 0.55 + h * 0.6;
      if (sc > ps) { ps = sc; pick = c; }
    });
    return pick;
  };
  const combos = [];
  for (const base of bases) {
    const items = [...base];
    const outer = weather === 'hot' ? (anchor && TYPES[anchor.type].slot === 'outer' ? anchor : null) : best(outers, base);
    if (outer && (weather === 'cool' || (anchor && outer.key === anchor.key) || outer.s > 0.7)) items.push(outer);
    const sh = best(shoes, base); if (sh) items.push(sh);
    const ac = best(accs, base); if (ac) items.push(ac);
    const cost = items.filter((i) => i.src === 'market').reduce((a, i) => a + i.price, 0);
    if (cost > budget) continue;
    const hs = [];
    items.slice(1).forEach((i) => hs.push(harmony(items[0].color, i.color)));
    if (base[1]) hs.push(harmony(base[0].color, base[1].color));
    const h = hs.length ? hs.reduce((a, b) => a + b, 0) / hs.length : 0.85;
    const avgI = Math.min(1, items.reduce((a, i) => a + i.s, 0) / items.length / 1.05);
    const share = items.filter((i) => i.src === 'closet').length / items.length;
    const comp = (sh ? 0.5 : 0) + (ac ? 0.5 : 0);
    const raw = 100 * (0.34 * h + 0.34 * avgI + 0.2 * share + 0.12 * comp);
    combos.push({ items, cost, h, raw, base });
  }
  combos.sort((a, b) => b.raw - a.raw);
  const chosen = [];
  const used = new Set();
  for (const c of combos) {
    const ids = c.base.map((b) => b.key).filter((k) => !anchor || k !== anchor.key);
    if (ids.some((k) => used.has(k))) continue;
    chosen.push(c); ids.forEach((k) => used.add(k));
    if (chosen.length === 3) break;
  }
  for (const c of combos) { if (chosen.length >= 3) break; if (!chosen.includes(c)) chosen.push(c); }
  const names = NAMES[occasion] || NAMES.casual;
  return chosen.map((c, i) => {
    const base = c.base;
    const pair = base[1] ? [base[0], base[1]] : [base[0], c.items[1] || base[0]];
    const mk = c.items.filter((x) => x.src === 'market');
    const reasons = [];
    if (pair[1] && pair[1] !== pair[0]) reasons.push(`${pair[0].colorName} + ${pair[1].colorName}: ${harmonyLabel(pair[0].color, pair[1].color)}`);
    reasons.push(mk.length ? `${c.items.length - mk.length} of ${c.items.length} pieces are already in your closet, ${mk.length} marketplace ${mk.length > 1 ? 'picks fill' : 'pick fills'} the gap` : `All ${c.items.length} pieces are already in your closet. Zero spend.`);
    reasons.push(`Suits "${occ.label}"${vibe !== 'any' ? ` with a ${vibe} vibe` : ''}`);
    const fitted = mk.filter((m) => m.fit).sort((a, b) => b.fit - a.fit)[0];
    if (fitted) reasons.push(`Smart Fit ${fitted.fit}% on the marketplace ${TYPES[fitted.type].label.toLowerCase()}`);
    return { id: `o${seed}-${i}`, name: names[(i + seed) % names.length], score: Math.min(98, Math.round(56 + c.raw * 0.44)), items: c.items, cost: c.cost, reasons, occasion };
  });
}

/** "Complete the look" for a product page */
export function completeTheLook(product, market, meas) {
  const slot = TYPES[product.type].slot;
  const want = { top: ['bottom', 'shoes', 'accessory', 'outer'], bottom: ['top', 'shoes', 'accessory', 'outer'], full: ['shoes', 'accessory', 'outer'], outer: ['top', 'bottom', 'shoes'], shoes: ['top', 'bottom', 'accessory'], accessory: ['top', 'bottom', 'shoes'] }[slot];
  const out = [];
  for (const s of want) {
    const c = market.filter((p) => !p.sold && p.id !== product.id && p.sellerId !== 'me' && TYPES[p.type].slot === s)
      .map((p) => ({ p, sc: harmony(product.color, p.color) * 0.6 + (p.tags.some((t) => product.tags.includes(t)) ? 0.35 : 0) + ((fitMatch(p, meas)?.score ?? 80) / 100) * 0.2 }))
      .sort((a, b) => b.sc - a.sc)[0];
    if (c) out.push(c.p);
  }
  return out.slice(0, 4);
}
