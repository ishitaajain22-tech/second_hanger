export function hexToRgb(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
/** amt in -1..1. Positive mixes with white, negative mixes with black */
export function shade(hex, amt) {
  const [r, g, b] = hexToRgb(hex);
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
}
export function hexToHsl(hex) {
  let [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
export function hslToHex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
export function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export const readableOn = (hex) => (luminance(hex) > 0.6 ? '#17140F' : '#FFFFFF');

export const FAMILIES = {
  Black: '#1B1B1F', White: '#F5F3EE', Grey: '#9A9DA3', Beige: '#D8C7A6', Brown: '#7A5233', Blue: '#3F6FB5',
  Green: '#4F8A5B', Yellow: '#E6B93A', Orange: '#E2803A', Red: '#C0392B', Pink: '#E9A7B8', Purple: '#7D5FB0',
};

/** Map any hex to a shopper-friendly colour family */
export function colorFamily(hex) {
  const [h, s, l] = hexToHsl(hex);
  if (l < 0.16) return 'Black';
  if (s < 0.13) return l > 0.86 ? 'White' : 'Grey';
  if (l > 0.93) return 'White';
  if ((h < 20 || h >= 330) && l > 0.68) return 'Pink';
  if (h >= 330 || h < 12) return 'Red';
  if (h < 50 && l < 0.42) return 'Brown';
  if (h < 50 && s < 0.5 && l > 0.6) return 'Beige';
  if (h < 40) return 'Orange';
  if (h < 68) return l < 0.4 ? 'Brown' : s < 0.45 && l > 0.6 ? 'Beige' : 'Yellow';
  if (h < 165) return 'Green';
  if (h < 262) return 'Blue';
  if (h < 325) return 'Purple';
  return 'Pink';
}

export function isNeutral(hex) {
  const [, s, l] = hexToHsl(hex);
  return s < 0.16 || l < 0.13 || l > 0.9 || colorFamily(hex) === 'Beige';
}

/** 0..1 how well two colours pair */
export function harmony(a, b) {
  const na = isNeutral(a), nb = isNeutral(b);
  if (na && nb) return 0.86;
  if (na || nb) return 0.93;
  const d = Math.abs(hexToHsl(a)[0] - hexToHsl(b)[0]);
  const diff = Math.min(d, 360 - d);
  if (diff < 25) return 0.88;
  if (diff < 50) return 0.8;
  if (diff > 150) return 0.78;
  if (diff > 100) return 0.62;
  return 0.42;
}

export function harmonyLabel(a, b) {
  const na = isNeutral(a), nb = isNeutral(b);
  if (na && nb) return 'two neutrals, always safe';
  if (na || nb) return 'a neutral lets the colour do the talking';
  const d = Math.abs(hexToHsl(a)[0] - hexToHsl(b)[0]);
  const diff = Math.min(d, 360 - d);
  if (diff < 25) return 'tonal and analogous, very cohesive';
  if (diff < 50) return 'close neighbours on the colour wheel';
  if (diff > 150) return 'complementary, a confident contrast';
  return 'a bolder pairing';
}

export const COLOR_NAMES = [
  ['Black', '#1B1B1F'], ['White', '#F5F3EE'], ['Off white', '#EFE8DA'], ['Cream', '#E9DFC9'], ['Beige', '#D8C7A6'],
  ['Camel', '#B98A55'], ['Tan', '#A47148'], ['Brown', '#6B4A32'], ['Grey', '#9A9DA3'], ['Charcoal', '#3A3D42'],
  ['Navy', '#22345C'], ['Indigo', '#3E5C86'], ['Denim blue', '#6C8EB0'], ['Sky blue', '#A9C4E4'], ['Blue', '#3F6FB5'],
  ['Teal', '#2E7D7A'], ['Emerald', '#1F7A5C'], ['Green', '#4F8A5B'], ['Sage', '#A9BFA0'], ['Olive', '#6B6B3A'],
  ['Mustard', '#D9A23B'], ['Yellow', '#E6C84A'], ['Orange', '#E2803A'], ['Rust', '#B5573A'], ['Terracotta', '#C4663F'],
  ['Red', '#C0392B'], ['Maroon', '#7A1F2B'], ['Blush', '#E7B7C2'], ['Pink', '#E9A7B8'], ['Lavender', '#C7B8E6'],
  ['Purple', '#7D5FB0'], ['Coral', '#EE7B6B'],
];
export function nearestColorName(hex) {
  const [r, g, b] = hexToRgb(hex);
  let best = COLOR_NAMES[0], bd = 1e9;
  for (const c of COLOR_NAMES) {
    const [r2, g2, b2] = hexToRgb(c[1]);
    const d = 2 * (r - r2) ** 2 + 4 * (g - g2) ** 2 + 3 * (b - b2) ** 2;
    if (d < bd) { bd = d; best = c; }
  }
  return best[0];
}
