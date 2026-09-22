import { TYPES, PATTERN_LABEL } from '../data/catalog';
import { nearestColorName, hexToRgb, rgbToHex } from './color';
import { hashStr, rng } from './format';
import { BRANDS } from './pricing';

/** All "AI" in this demo is simulated. Swap these functions for real API calls later. */
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function runSteps(steps, onStep) {
  for (let i = 0; i < steps.length; i++) {
    onStep(i);
    await sleep(steps[i].ms ?? 700);
  }
  onStep(steps.length);
}

const KEYWORDS = {
  dress: ['dress', 'gown'], jeans: ['jean', 'denim'], tee: ['tee', 'tshirt', 't-shirt'], shirt: ['shirt'], hoodie: ['hood', 'sweat'],
  jacket: ['jacket', 'coat', 'blazer'], kurta: ['kurta', 'kurti'], skirt: ['skirt'], sneakers: ['shoe', 'sneaker', 'trainer'],
  bag: ['bag', 'tote'], sunglasses: ['glass', 'shade'], trousers: ['trouser', 'pant', 'chino'],
};

/** Reads the dominant colour of an uploaded photo (this part is real, via canvas) */
export function dominantColor(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement('canvas');
        const S = 48;
        c.width = c.height = S;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, S, S);
        const { data } = ctx.getImageData(S * 0.25, S * 0.25, S * 0.5, S * 0.5);
        let r = 0, g = 0, b = 0, n = 0;
        for (let i = 0; i < data.length; i += 4) {
          const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]);
          if (mx > 245 && mn > 235) continue; // skip white backdrop
          r += data[i]; g += data[i + 1]; b += data[i + 2]; n++;
        }
        resolve(n ? rgbToHex(r / n, g / n, b / n) : '#8A8D91');
      } catch { resolve('#8A8D91'); }
    };
    img.onerror = () => resolve('#8A8D91');
    img.src = url;
  });
}

export function detectFromFile(file, hex) {
  const name = (file?.name || '').toLowerCase();
  let type = null;
  for (const [t, keys] of Object.entries(KEYWORDS)) if (keys.some((k) => name.includes(k))) { type = t; break; }
  const h = hashStr(name + (file?.size || 0));
  if (!type) type = ['tee', 'shirt', 'dress', 'jeans', 'hoodie', 'kurta', 'jacket', 'skirt'][h % 8];
  const brand = BRANDS[(h >> 3) % (BRANDS.length - 1)];
  return { type, brand, color: hex, colorName: nearestColorName(hex), pattern: 'solid', size: 'M', cut: 'regular', confidence: 91 + (h % 8) };
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export function titleVariants(d) {
  const tl = TYPES[d.type]?.label || 'Piece';
  const pat = d.pattern && d.pattern !== 'solid' ? ` ${PATTERN_LABEL[d.pattern]}` : '';
  const br = d.brand && d.brand !== 'Other' ? d.brand : '';
  const cutW = { oversized: 'Oversized', relaxed: 'Relaxed', slim: 'Slim-fit', regular: '' }[d.cut] || '';
  return [
    `${br} ${cap(d.colorName.toLowerCase())}${pat} ${tl}`.trim().replace(/\s+/g, ' '),
    `${cap(d.colorName.toLowerCase())} ${tl}${br ? ' by ' + br : ''}`,
    `${cutW} ${cap(d.colorName.toLowerCase())}${pat} ${tl}${br ? ' (' + br + ')' : ''}`.trim().replace(/\s+/g, ' '),
    `Pre-loved ${br ? br + ' ' : ''}${tl} in ${d.colorName.toLowerCase()}`,
  ];
}

export function descriptionFor(d, tone = 'Casual') {
  const tl = (TYPES[d.type]?.label || 'piece').toLowerCase();
  const br = d.brand && d.brand !== 'Other' ? d.brand + ' ' : '';
  const col = d.colorName.toLowerCase();
  const cond = (d.condition || 'Gently used').toLowerCase();
  const fab = { tee: 'soft cotton jersey', shirt: 'crisp cotton', hoodie: 'cosy fleece', jacket: 'sturdy twill', jeans: 'stretch denim', trousers: 'drapey twill', dress: 'flowy viscose', kurta: 'breathable cotton', skirt: 'lined georgette', sneakers: 'canvas and rubber', bag: 'vegan leather', sunglasses: 'acetate' }[d.type] || 'quality fabric';
  if (tone === 'Premium') return `A refined ${br}${col} ${tl} crafted from ${fab}. In ${cond} condition, professionally steamed and ready to wear. A considered addition to a capsule wardrobe, offered at a fraction of retail. Measurements provided for a confident fit.`;
  if (tone === 'Gen-Z') return `main character ${col} ${tl} alert. ${br}${tl}, ${cond}, made from ${fab}. goes with literally everything in your closet. selling because I'm doing a wardrobe reset, so it can be your new fave now. measurements below, no fit surprises.`;
  return `${cap(br)}${col} ${tl} in ${cond} condition. Made from ${fab} and washed, steamed and ready to ship. Measurements are listed below so you can check the fit. Happy to answer questions or consider offers!`;
}

const LOOKS = [
  { name: 'Sage Minimal', color: '#A9BFA0', pattern: 'solid', fit: 'regular', why: 'Earthy sage pairs with almost everything in your closet.' },
  { name: 'Noir Edit', color: '#1B1B1F', pattern: 'solid', fit: 'oversized', why: 'All-black with a relaxed cut is the easiest way to look put-together.' },
  { name: 'Retro Stripe', color: '#22345C', pattern: 'breton', fit: 'regular', why: 'Breton stripes are trending on campus this season.' },
  { name: 'Sunset Pop', color: '#E2803A', pattern: 'solid', fit: 'regular', why: 'A warm orange for a confident, high-energy look.' },
  { name: 'Lilac Dream', color: '#C7B8E6', pattern: 'solid', fit: 'cropped', why: 'Soft lilac in a cropped cut. Peak Gen-Z pastel.' },
  { name: 'Gingham Picnic', color: '#E9A7B8', pattern: 'checks', fit: 'regular', why: 'Gingham gives an instant weekend-brunch mood.' },
  { name: 'Block Print Bazaar', color: '#C4663F', pattern: 'jaal', fit: 'regular', why: 'Terracotta block print: heritage meets streetwear.' },
  { name: 'Washed Denim', color: '#6C8EB0', pattern: 'denim', fit: 'oversized', why: 'Faded denim tones are having a big moment.' },
  { name: 'Garden Party', color: '#E7B7C2', pattern: 'floral', fit: 'regular', why: 'Soft blush florals for date-night daylight.' },
  { name: 'Polka Cream', color: '#F0E6D6', pattern: 'dots', fit: 'regular', why: 'Classic polka on cream. Vintage but current.' },
  { name: 'Mustard Mood', color: '#D9A23B', pattern: 'solid', fit: 'regular', why: 'Mustard adds warmth and photographs beautifully.' },
  { name: 'Forest Deep', color: '#1F5C46', pattern: 'solid', fit: 'regular', why: 'Deep green reads premium and works year-round.' },
];
export function generateLooks(item, seed = 1) {
  const r = rng(hashStr(item.id || item.type) + seed * 7919);
  const plain = ['sneakers', 'bag', 'sunglasses'].includes(item.type);
  let pool = LOOKS.filter((l) => l.color.toLowerCase() !== (item.color || '').toLowerCase());
  if (plain) pool = pool.filter((l) => l.pattern === 'solid');
  if (item.type === 'jeans') pool = pool.filter((l) => ['solid', 'denim'].includes(l.pattern));
  if (item.type === 'kurta') pool = pool.filter((l) => ['solid', 'jaal', 'floral'].includes(l.pattern));
  const shuffled = [...pool].sort(() => r() - 0.5).slice(0, 4);
  return shuffled.map((l, i) => ({ ...l, id: `look-${seed}-${i}`, fit: plain ? 'regular' : l.fit }));
}

export const SWATCHES = [
  '#1B1B1F', '#F4F1EA', '#E9DFC9', '#B98A55', '#7A4B2A', '#9A9DA3', '#22345C', '#3E5C86', '#6C8EB0', '#A9C4E4', '#1F7A5C', '#A9BFA0',
  '#6B6B3A', '#D9A23B', '#E2803A', '#B5573A', '#C0392B', '#7A1F2B', '#E7B7C2', '#E9A7B8', '#C7B8E6', '#7D5FB0',
];

export function shiftHex(hex, dr) { const [r, g, b] = hexToRgb(hex); return rgbToHex(r + dr, g + dr, b + dr); }
