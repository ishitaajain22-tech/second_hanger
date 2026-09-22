import { CO2_FACTORS } from '../data/catalog';
import { EARNINGS_HISTORY } from '../data/seed';
import { FEES } from '../config';

const LEVELS = [
  { name: 'Seedling', min: 0, emoji: '🌱' },
  { name: 'Sprout', min: 10, emoji: '🌿' },
  { name: 'Sapling', min: 25, emoji: '🪴' },
  { name: 'Tree', min: 45, emoji: '🌳' },
  { name: 'Forest', min: 80, emoji: '🌲' },
];

export function impactSummary(state) {
  const events = [...state.history];
  state.orders.forEach((o) => events.push({ kind: 'bought', type: o.item.type, m: 0, saved: Math.max(0, (o.item.mrp || o.price * 3) - o.price), live: true }));
  state.sales.forEach((s) => events.push({ kind: 'sold', type: s.type, m: 0, live: true }));
  state.swaps.filter((s) => s.status === 'completed').forEach((s) => events.push({ kind: 'swapped', type: s.item.type, m: 0, saved: 900, live: true }));
  const items = events;
  let co2 = 0, water = 0, waste = 0, saved = 0;
  items.forEach((e) => {
    const f = CO2_FACTORS[e.type] || { co2: 8, water: 2500, waste: 0.3 };
    co2 += f.co2; water += f.water; waste += f.waste; saved += e.saved || 0;
  });
  const earned = earningsSummary(state).lifetime;
  const months = [0, 0, 0, 0, 0, 0];
  items.forEach((e) => { if (e.m <= 5) months[5 - e.m]++; });
  const level = [...LEVELS].reverse().find((l) => items.length >= l.min);
  const next = LEVELS[LEVELS.indexOf(level) + 1];
  const byKind = { bought: 0, sold: 0, swapped: 0 };
  items.forEach((e) => byKind[e.kind]++);
  const byType = {};
  items.forEach((e) => { byType[e.type] = (byType[e.type] || 0) + (CO2_FACTORS[e.type]?.co2 || 8); });
  return {
    count: items.length, co2: Math.round(co2), water: Math.round(water), waste: +waste.toFixed(1), saved, earned, months, level, next, byKind, byType,
    km: Math.round(co2 / 0.12), showers: Math.round(water / 65), trees: +(co2 / 21).toFixed(1),
  };
}
export { LEVELS };

export const netOf = (sale) => Math.round(sale.price * (1 - FEES.sellerPct));
export function earningsSummary(state) {
  const sum = (arr) => arr.reduce((a, s) => a + netOf(s), 0);
  const available = sum(state.sales.filter((s) => s.status === 'available'));
  const escrow = sum(state.sales.filter((s) => s.status === 'in_escrow' || s.status === 'to_ship'));
  const paid = sum(state.sales.filter((s) => s.status === 'paid_out'));
  const monthNet = 1800 + sum(state.sales.filter((s) => s.live));
  const months = [...EARNINGS_HISTORY, monthNet];
  const lifetime = months.reduce((a, b) => a + b, 0);
  return { available, escrow, paid, monthNet, months, lifetime };
}
