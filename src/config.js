// ─── Change the brand here and the whole app updates ───
export const BRAND = {
  name: 'Dobara',
  tagline: 'Give your wardrobe a second life.',
  domain: 'dobara.in',
};

export const FEES = { sellerPct: 0.05, buyerProtectionPct: 0.02, shipping: 79 };

export const CONDITIONS = [
  { id: 'New with tags', short: 'NWT', bg: '#D6F26B', fg: '#1F3D2B', desc: 'Never worn, tags still attached' },
  { id: 'Like new', short: 'Like new', bg: '#DDEFD3', fg: '#23472F', desc: 'Worn once or twice, no visible wear' },
  { id: 'Gently used', short: 'Gently used', bg: '#F1EADC', fg: '#5A4A2C', desc: 'Light wear, fully wearable' },
  { id: 'Well loved', short: 'Well loved', bg: '#F9DFD3', fg: '#7A3A20', desc: 'Visible wear, priced accordingly' },
];
export const conditionMeta = (c) => CONDITIONS.find((x) => x.id === c) || CONDITIONS[2];
