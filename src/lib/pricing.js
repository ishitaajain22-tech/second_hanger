import { hashStr, rng } from './format';

const PREMIUM = ["Zara", "Mango", "Levi's", "Nike", "Adidas", "Puma", "Forever New", "Marks & Spencer", "FabIndia", "Superdry"];
const MID = ["H&M", "Uniqlo", "Biba", "W", "Global Desi", "AND", "Allen Solly", "Van Heusen", "Jack & Jones", "Vero Moda", "Pepe Jeans", "Lavie"];
export const BRANDS = [...PREMIUM, ...MID, 'Bewakoof', 'Snitch', 'The Souled Store', 'Vincent Chase', 'Campus', 'Other'];

const BASE_MRP = { tee: 1299, shirt: 2299, hoodie: 2999, jacket: 4499, jeans: 2999, trousers: 2599, dress: 3499, kurta: 2599, skirt: 2499, sneakers: 5499, bag: 2999, sunglasses: 1799 };
const COND = { 'New with tags': 0.62, 'Like new': 0.5, 'Gently used': 0.36, 'Well loved': 0.23 };
const DAYS = { tee: 5, shirt: 6, hoodie: 5, jacket: 7, jeans: 4, trousers: 6, dress: 5, kurta: 6, skirt: 6, sneakers: 8, bag: 7, sunglasses: 9 };

export function suggestPrice({ type = 'tee', brand = 'Other', condition = 'Gently used' }) {
  const tier = PREMIUM.includes(brand) ? 1.25 : MID.includes(brand) ? 1 : 0.72;
  const mrp = Math.round((BASE_MRP[type] || 1999) * tier / 10) * 10;
  const base = mrp * (COND[condition] ?? 0.36);
  const r = rng(hashStr(type + brand + condition));
  const suggested = Math.max(190, Math.round((base * (0.96 + r() * 0.1)) / 10) * 10);
  const low = Math.max(150, Math.round((suggested * 0.82) / 10) * 10);
  const high = Math.round((suggested * 1.18) / 10) * 10;
  const days = Math.max(2, Math.round((DAYS[type] || 6) * (brand === 'Other' ? 1.4 : 1) * (condition === 'Well loved' ? 1.3 : 1)));
  const comps = [0, 1, 2].map((i) => ({
    title: `${brand === 'Other' ? '' : brand + ' '}${type} · ${['Like new', 'Gently used', 'Like new'][i]}`,
    price: Math.round((suggested * [1.08, 0.94, 1.02][i]) / 10) * 10,
    days: [3, 6, 4][i] + (DAYS[type] > 6 ? 2 : 0),
  }));
  return { mrp, suggested, low, high, days, comps, demand: suggested > mrp * 0.45 ? 'High' : 'Steady' };
}
