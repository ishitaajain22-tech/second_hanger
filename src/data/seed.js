const H = 3600000, D = 86400000;
const now = Date.now();

export const DEFAULT_MEASUREMENTS = { height: 165, chest: 90, waist: 74, hips: 98, shoulder: 38, foot: 24.6, fitPref: 'regular' };

const w = (id, name, type, color, colorName, pattern, brand, size, tags, worn, extra = {}) => ({
  id, name, type, color, colorName, pattern, brand, size, tags: tags.split(','), worn, swapReady: false, cut: 'regular', source: 'scan', ...extra,
});

export const SEED_WARDROBE = [
  w('w1', 'White Oversized Tee', 'tee', '#F4F1EA', 'Off white', 'solid', 'Uniqlo', 'M', 'casual,college,travel', 14, { cut: 'oversized' }),
  w('w2', 'Black Basic Tee', 'tee', '#1B1B1F', 'Black', 'solid', 'H&M', 'S', 'casual,college,date', 11),
  w('w3', 'Sage Embroidered Kurta', 'kurta', '#A9BFA0', 'Sage', 'jaal', 'FabIndia', 'M', 'festive,work,ethnic', 6),
  w('w4', 'Light-Wash Denim Jacket', 'jacket', '#7BA3C7', 'Denim blue', 'denim', "Levi's", 'M', 'casual,college,travel', 9, { swapReady: true }),
  w('w5', 'Blue Straight Jeans', 'jeans', '#3E5C86', 'Indigo', 'denim', 'Pepe Jeans', '28', 'casual,college,work', 22),
  w('w6', 'Black Skinny Jeans', 'jeans', '#1F1F24', 'Black', 'denim', 'Only', '28', 'casual,date,party', 17),
  w('w7', 'Beige Linen Shirt', 'shirt', '#D8C8A8', 'Beige', 'solid', 'Mango', 'S', 'work,brunch,travel', 8),
  w('w8', 'Mustard Hoodie', 'hoodie', '#D9A23B', 'Mustard', 'solid', 'The Souled Store', 'M', 'casual,college,travel', 5, { swapReady: true, cut: 'oversized' }),
  w('w9', 'Floral Midi Dress', 'dress', '#E8B4B8', 'Blush', 'floral', 'AND', 'S', 'date,festive,brunch', 2, { swapReady: true }),
  w('w10', 'White Sneakers', 'sneakers', '#F5F5F5', 'White', 'solid', 'Adidas', 'UK 6', 'casual,college,work,travel,date', 30),
  w('w11', 'Black Everyday Tote', 'bag', '#1B1B1F', 'Black', 'solid', 'Lavie', 'One size', 'work,college,travel', 26),
  w('w12', 'Rust Pleated Skirt', 'skirt', '#B5573A', 'Rust', 'solid', 'Mango', 'S', 'work,date,brunch', 3),
  w('w13', 'Navy Pinstripe Shirt', 'shirt', '#243B6B', 'Navy', 'stripes', 'Van Heusen', 'M', 'work,college', 1, { swapReady: true }),
  w('w14', 'Tortoise Sunglasses', 'sunglasses', '#5A3A28', 'Tortoise', 'solid', 'Vincent Chase', 'One size', 'date,travel,brunch,casual', 12),
  w('w15', 'Maroon Festive Kurta', 'kurta', '#7A1F2B', 'Maroon', 'jaal', 'Biba', 'M', 'festive,ethnic,party', 2),
  w('w16', 'Olive Cargo Trousers', 'trousers', '#6B6B3A', 'Olive', 'solid', 'Snitch', 'S', 'casual,college,streetwear', 4, { cut: 'relaxed' }),
];

// Items the "AI scan" can discover in a wardrobe photo
export const SCAN_POOL = [
  { name: 'Charcoal Zip Hoodie', type: 'hoodie', color: '#3A3D42', colorName: 'Charcoal', pattern: 'solid', brand: 'Nike', size: 'M', tags: 'casual,college,travel', conf: 97 },
  { name: 'Cream Wide-Leg Trousers', type: 'trousers', color: '#E9DFC9', colorName: 'Cream', pattern: 'solid', brand: 'Zara', size: 'S', tags: 'work,brunch,travel', conf: 94 },
  { name: 'Pink Block-Print Kurta', type: 'kurta', color: '#E1899B', colorName: 'Pink', pattern: 'jaal', brand: 'W', size: 'M', tags: 'festive,ethnic,work', conf: 92 },
  { name: 'Black Leather Sneakers', type: 'sneakers', color: '#1D1D20', colorName: 'Black', pattern: 'solid', brand: 'Puma', size: 'UK 6', tags: 'casual,date,college', conf: 96 },
  { name: 'Blue Gingham Shirt', type: 'shirt', color: '#6E97C9', colorName: 'Blue', pattern: 'checks', brand: 'H&M', size: 'S', tags: 'casual,brunch,college', conf: 91 },
  { name: 'Yellow Sundress', type: 'dress', color: '#EBCB5A', colorName: 'Yellow', pattern: 'solid', brand: 'Mango', size: 'S', tags: 'brunch,casual,date', conf: 89 },
];

export const SEED_ORDERS = [
  {
    id: 'DBR-88214', item: { title: 'Zara Wide-Leg Trousers', type: 'trousers', color: '#D9CDB6', pattern: 'solid', brand: 'Zara', mrp: 3990 },
    price: 1190, shipping: 79, fee: 24, total: 1293, sellerId: 's1', status: 'shipped', placedAt: now - 3 * D,
    timeline: [{ s: 'paid', ts: now - 3 * D }, { s: 'shipped', ts: now - 2 * D }],
  },
  {
    id: 'DBR-87102', item: { title: 'Nike Zip-Up Jacket', type: 'jacket', color: '#2D3A55', pattern: 'solid', brand: 'Nike', mrp: 4995 },
    price: 1650, shipping: 79, fee: 33, total: 1762, sellerId: 's5', status: 'completed', placedAt: now - 24 * D,
    timeline: [{ s: 'paid', ts: now - 24 * D }, { s: 'shipped', ts: now - 23 * D }, { s: 'delivered', ts: now - 20 * D }, { s: 'completed', ts: now - 19 * D }],
  },
  {
    id: 'DBR-85560', item: { title: 'Biba Cotton Kurta', type: 'kurta', color: '#C08A3E', pattern: 'jaal', brand: 'Biba', mrp: 2490 },
    price: 850, shipping: 79, fee: 17, total: 946, sellerId: 's3', status: 'completed', placedAt: now - 52 * D,
    timeline: [{ s: 'paid', ts: now - 52 * D }, { s: 'shipped', ts: now - 51 * D }, { s: 'delivered', ts: now - 48 * D }, { s: 'completed', ts: now - 47 * D }],
  },
];

// Sales made by Aanya. status: to_ship | in_escrow | available | paid_out
export const SEED_SALES = [
  { id: 'SL-2041', title: 'Zara Linen Blazer', type: 'jacket', color: '#C9B79A', pattern: 'solid', price: 1850, buyer: 'Sana Sheikh', date: now - 1 * D, status: 'to_ship' },
  { id: 'SL-2036', title: 'H&M Striped Shirt', type: 'shirt', color: '#5B7FA8', pattern: 'stripes', price: 590, buyer: 'Nikhil Rao', date: now - 4 * D, status: 'in_escrow' },
  { id: 'SL-2029', title: 'Mango Satin Skirt', type: 'skirt', color: '#B98A9B', pattern: 'solid', price: 1290, buyer: 'Priya Menon', date: now - 9 * D, status: 'available' },
  { id: 'SL-2017', title: 'Levi\u2019s 501 Jeans', type: 'jeans', color: '#4B6E9B', pattern: 'denim', price: 2100, buyer: 'Aditi R.', date: now - 22 * D, status: 'paid_out' },
  { id: 'SL-2009', title: 'Biba Printed Kurta', type: 'kurta', color: '#C4663F', pattern: 'jaal', price: 740, buyer: 'Pooja T.', date: now - 41 * D, status: 'paid_out' },
];
export const EARNINGS_HISTORY = [2100, 3400, 2650, 4100, 3520]; // previous months, current month is computed

// Impact history: (kind, type, monthsAgo). Sales from the past that are not itemised above.
const hist = (kind, type, m, saved = 0) => ({ kind, type, m, saved });
export const SEED_HISTORY = [
  hist('bought', 'jacket', 5, 3345), hist('bought', 'kurta', 4, 1640), hist('bought', 'jeans', 4, 1800), hist('bought', 'dress', 3, 2100),
  hist('bought', 'sneakers', 3, 3800), hist('bought', 'hoodie', 2, 1500), hist('bought', 'shirt', 2, 1200), hist('bought', 'tee', 1, 500),
  hist('sold', 'jeans', 5), hist('sold', 'tee', 5), hist('sold', 'dress', 4), hist('sold', 'skirt', 4), hist('sold', 'shirt', 3), hist('sold', 'jacket', 3),
  hist('sold', 'kurta', 3), hist('sold', 'bag', 2), hist('sold', 'trousers', 2), hist('sold', 'hoodie', 2), hist('sold', 'tee', 1), hist('sold', 'sunglasses', 1),
  hist('swapped', 'dress', 4, 900), hist('swapped', 'jacket', 2, 1400), hist('swapped', 'sneakers', 1, 1100),
];

export const SEED_OFFERS = [
  { id: 'o1', dir: 'in', productId: 'm2', party: 'b1', amount: 600, status: 'pending', ts: now - 2 * H, note: 'Would you take \u20b9600? I can pay right away.' },
  { id: 'o2', dir: 'in', productId: 'm3', party: 'b3', amount: 900, status: 'pending', ts: now - 6 * H, note: 'Love the colour! Can you do \u20b9900?' },
  { id: 'o3', dir: 'out', productId: 'p6', party: 's9', amount: 800, counter: 900, status: 'countered', ts: now - 5 * H, note: '' },
];
export const SEED_SWAPS = [
  {
    id: 'w1', dir: 'in', productId: 'm1', party: 'b2', status: 'pending', ts: now - 8 * H, topUp: 0,
    item: { name: 'Grey Puma Hoodie', type: 'hoodie', color: '#8F949A', pattern: 'solid', value: 900 },
    note: 'Swap my hoodie (worn twice) for your shirt?',
  },
];
export const SEED_THREADS = [
  {
    id: 't1', party: { type: 'seller', id: 's1' }, productId: 'p1', unread: 1, messages: [
      { id: 'a', from: 'me', text: 'Hi Riya! Is the midi dress lined? And is the waist stretchy?', ts: now - 5 * H },
      { id: 'b', from: 'them', text: 'Hey Aanya! Yes, it is fully lined and the ribbed waist has a lot of give. Measurements are in the listing \u2728', ts: now - 4.5 * H },
    ],
  },
  {
    id: 't2', party: { type: 'buyer', id: 'b1' }, productId: 'm2', unread: 1, messages: [
      { id: 'a', from: 'them', text: 'Hi! Would you take \u20b9600 for the mom-fit jeans? I can pay right away.', ts: now - 2 * H },
    ],
  },
  {
    id: 't3', party: { type: 'seller', id: 's5' }, productId: 'p13', unread: 0, messages: [
      { id: 'a', from: 'them', text: 'Thanks for buying the Nike jacket! Shipped it with tracking. Enjoy!', ts: now - 23 * D },
      { id: 'b', from: 'me', text: 'Got it today, it is perfect. Leaving you 5 stars!', ts: now - 20 * D },
    ],
  },
];
