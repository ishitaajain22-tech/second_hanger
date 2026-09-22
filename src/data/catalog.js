export const TYPES = {
  tee: { label: 'T-shirt', cat: 'Tops', slot: 'top' },
  shirt: { label: 'Shirt', cat: 'Tops', slot: 'top' },
  hoodie: { label: 'Hoodie', cat: 'Tops', slot: 'top' },
  kurta: { label: 'Kurta', cat: 'Ethnic', slot: 'top' },
  jacket: { label: 'Jacket', cat: 'Outerwear', slot: 'outer' },
  jeans: { label: 'Jeans', cat: 'Bottoms', slot: 'bottom' },
  trousers: { label: 'Trousers', cat: 'Bottoms', slot: 'bottom' },
  skirt: { label: 'Skirt', cat: 'Bottoms', slot: 'bottom' },
  dress: { label: 'Dress', cat: 'Dresses', slot: 'full' },
  sneakers: { label: 'Sneakers', cat: 'Footwear', slot: 'shoes' },
  bag: { label: 'Bag', cat: 'Accessories', slot: 'accessory' },
  sunglasses: { label: 'Sunglasses', cat: 'Accessories', slot: 'accessory' },
};
export const CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Ethnic', 'Outerwear', 'Footwear', 'Accessories'];
export const CAT_ICON = { Tops: 'tee', Bottoms: 'jeans', Dresses: 'dress', Ethnic: 'kurta', Outerwear: 'jacket', Footwear: 'sneakers', Accessories: 'bag' };
export const PATTERNS = ['solid', 'stripes', 'breton', 'checks', 'dots', 'floral', 'denim', 'jaal'];
export const PATTERN_LABEL = { solid: 'Solid', stripes: 'Pinstripe', breton: 'Breton', checks: 'Gingham', dots: 'Polka', floral: 'Floral', denim: 'Denim', jaal: 'Block print' };
export const FITS = ['regular', 'oversized', 'cropped', 'slim'];
export const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'One size'];
export const SIZES_BY_SLOT = {
  top: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], outer: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], full: ['XS', 'S', 'M', 'L', 'XL'],
  bottom: ['XS', 'S', 'M', 'L', '28', '30', '32', '34', '36'], shoes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'], accessory: ['One size'],
};
export const OCCASIONS = {
  casual: { label: 'Casual day out', tags: ['casual', 'brunch'] },
  college: { label: 'College / campus', tags: ['college', 'casual'] },
  work: { label: 'Work / office', tags: ['work'] },
  date: { label: 'Date night', tags: ['date', 'party'] },
  festive: { label: 'Festive / wedding', tags: ['festive', 'ethnic'] },
  travel: { label: 'Travel', tags: ['travel', 'casual'] },
};
export const CO2_FACTORS = {
  // per pre-loved item: kg CO2e avoided, litres water avoided, kg textile waste diverted (illustrative estimates)
  tee: { co2: 6.5, water: 2700, waste: 0.2 }, shirt: { co2: 9, water: 2900, waste: 0.25 }, hoodie: { co2: 15, water: 3000, waste: 0.6 },
  jacket: { co2: 25, water: 8000, waste: 0.9 }, jeans: { co2: 33, water: 7500, waste: 0.7 }, trousers: { co2: 14, water: 4000, waste: 0.5 },
  dress: { co2: 17, water: 3500, waste: 0.4 }, kurta: { co2: 9, water: 2800, waste: 0.3 }, skirt: { co2: 10, water: 3000, waste: 0.35 },
  sneakers: { co2: 14, water: 1500, waste: 0.8 }, bag: { co2: 12, water: 2000, waste: 0.6 }, sunglasses: { co2: 3, water: 200, waste: 0.05 },
};
