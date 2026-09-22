import { FAMILIES } from './color';

const TYPE_WORDS = {
  dress: 'dress', dresses: 'dress', jeans: 'jeans', denim: 'jeans', kurta: 'kurta', kurtas: 'kurta', kurti: 'kurta', sneakers: 'sneakers', shoes: 'sneakers', trainers: 'sneakers',
  hoodie: 'hoodie', hoodies: 'hoodie', jacket: 'jacket', jackets: 'jacket', tee: 'tee', tees: 'tee', 'tshirt': 'tee', 't-shirt': 'tee', shirt: 'shirt', shirts: 'shirt',
  skirt: 'skirt', skirts: 'skirt', bag: 'bag', bags: 'bag', tote: 'bag', sunglasses: 'sunglasses', shades: 'sunglasses', trousers: 'trousers', pants: 'trousers',
};
const OCC_WORDS = { brunch: 'brunch', college: 'college', campus: 'college', office: 'work', work: 'work', date: 'date', party: 'party', festive: 'festive', wedding: 'festive', travel: 'travel', gym: 'gym', streetwear: 'streetwear' };

/** Tiny natural-language query parser: "black jeans under 1000 size 28 for women" */
export function parseQuery(q) {
  const out = { maxPrice: null, families: [], types: [], size: null, dept: null, tag: null, rest: '', chips: [] };
  if (!q) return out;
  let s = ' ' + q.toLowerCase() + ' ';
  const m = s.match(/\b(?:under|below|less than|<)\s*₹?\s*(\d{2,5})/);
  if (m) { out.maxPrice = +m[1]; out.chips.push(`Under ₹${m[1]}`); s = s.replace(m[0], ' '); }
  const sz = s.match(/\bsize\s+(xxl|xl|xs|s|m|l|\d{2})\b/);
  if (sz) { out.size = sz[1].toUpperCase(); out.chips.push(`Size ${out.size}`); s = s.replace(sz[0], ' '); }
  if (/\b(women|womens|woman|ladies|girls)\b/.test(s)) { out.dept = 'Women'; out.chips.push('Women'); s = s.replace(/\b(women|womens|woman|ladies|girls)\b/, ' '); }
  else if (/\b(men|mens|man|guys|boys)\b/.test(s)) { out.dept = 'Men'; out.chips.push('Men'); s = s.replace(/\b(men|mens|man|guys|boys)\b/, ' '); }
  for (const fam of Object.keys(FAMILIES)) {
    const re = new RegExp(`\\b${fam.toLowerCase()}\\b`);
    if (re.test(s)) { out.families.push(fam); out.chips.push(fam); s = s.replace(re, ' '); }
  }
  s.split(/\s+/).forEach((w) => {
    if (TYPE_WORDS[w] && !out.types.includes(TYPE_WORDS[w])) { out.types.push(TYPE_WORDS[w]); out.chips.push(TYPE_WORDS[w]); s = s.replace(w, ' '); }
    else if (OCC_WORDS[w] && !out.tag) { out.tag = OCC_WORDS[w]; out.chips.push(`For ${w}`); s = s.replace(w, ' '); }
  });
  out.rest = s.replace(/\b(for|a|the|in|with|and|outfit|some)\b/g, ' ').replace(/\s+/g, ' ').trim();
  return out;
}
