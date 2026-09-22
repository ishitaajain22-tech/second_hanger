import { colorFamily } from '../lib/color';
import { measuresFor } from '../lib/fit';
import { TYPES } from './catalog';
import { rng, hashStr } from '../lib/format';

const FABRIC = {
  tee: '100% cotton jersey', shirt: 'Cotton poplin', hoodie: 'Cotton-blend fleece', jacket: 'Structured twill', jeans: 'Stretch denim',
  trousers: 'Cotton twill', dress: 'Viscose crepe', kurta: 'Breathable cotton mul', skirt: 'Georgette with lining', sneakers: 'Canvas / suede with rubber sole',
  bag: 'Vegan leather with cotton lining', sunglasses: 'Acetate frame, UV400 lenses',
};
const NOTE = {
  'New with tags': 'Brand new, tags still attached. Bought online and the fit was not for me.',
  'Like new': 'Worn once or twice. No pilling, fading or marks. Freshly washed and steamed.',
  'Gently used': 'Worn a handful of times. Minor signs of wear that are not visible from a distance. Washed and ready to go.',
  'Well loved': 'Loved and lived in. Some fading, priced to reflect it.',
};
const WHY = ['Wardrobe cleanout.', 'It does not fit me any more.', 'Colour was not quite my vibe.', 'Moving cities and downsizing.', 'Gifted, but not my style.'];

// [id, title, brand, type, hex, colourName, pattern, size, condition, price, mrp, seller, dept, cut, tags, swap, daysAgo]
const RAW = [
  ['p1', 'Ribbed Floral Midi Dress', 'Zara', 'dress', '#E7B7C2', 'Blush', 'floral', 'M', 'Like new', 1290, 3990, 's1', 'Women', 'regular', 'date,festive,brunch', 1, 2],
  ['p2', 'Vintage-Wash Denim Trucker Jacket', "Levi's", 'jacket', '#7BA3C7', 'Light wash', 'denim', 'L', 'Gently used', 2450, 6999, 's2', 'Unisex', 'relaxed', 'casual,college,travel', 1, 5],
  ['p3', 'Cloud Grey Club Fleece Hoodie', 'Nike', 'hoodie', '#A7ABB0', 'Grey', 'solid', 'M', 'Like new', 1490, 3995, 's5', 'Unisex', 'oversized', 'casual,college,travel', 0, 1],
  ['p4', 'Sage Chikankari Kurta', 'FabIndia', 'kurta', '#A9BFA0', 'Sage green', 'jaal', 'M', 'Like new', 1190, 2990, 's3', 'Women', 'regular', 'festive,work,ethnic', 1, 3],
  ['p5', 'Indigo Slim-Tapered Jeans', "Levi's", 'jeans', '#3E5C86', 'Indigo', 'denim', '32', 'Gently used', 1390, 4299, 's8', 'Men', 'regular', 'casual,college,work', 0, 4],
  ['p6', 'High-Rise Black Skinny Jeans', 'Vero Moda', 'jeans', '#1F1F24', 'Black', 'denim', '28', 'Like new', 990, 2499, 's9', 'Women', 'slim', 'casual,college,date', 0, 6],
  ['p7', 'Mustard Ribbed Baby Tee', 'Bewakoof', 'tee', '#D9A23B', 'Mustard', 'solid', 'S', 'Gently used', 290, 799, 's4', 'Women', 'slim', 'casual,college', 0, 9],
  ['p8', 'Off-White Linen Shirt', 'Marks & Spencer', 'shirt', '#F3EFE6', 'Off white', 'solid', 'L', 'Like new', 1890, 4499, 's7', 'Men', 'regular', 'work,travel,brunch', 1, 2],
  ['p9', 'Navy Breton Stripe Tee', 'Zara', 'tee', '#22345C', 'Navy', 'breton', 'S', 'Like new', 590, 1790, 's1', 'Women', 'regular', 'casual,brunch,travel', 0, 7],
  ['p10', 'Rust Pleated Midi Skirt', 'Mango', 'skirt', '#B5573A', 'Rust', 'solid', 'S', 'Gently used', 890, 3290, 's9', 'Women', 'regular', 'work,date,brunch', 1, 8],
  ['p11', 'Olive Cargo Trousers', 'Snitch', 'trousers', '#6B6B3A', 'Olive', 'solid', '30', 'Like new', 1190, 2999, 's6', 'Men', 'relaxed', 'casual,streetwear,college', 0, 3],
  ['p12', 'Classic White Court Sneakers', 'Adidas', 'sneakers', '#F4F3EF', 'White', 'solid', 'UK 7', 'Gently used', 1690, 6999, 's2', 'Unisex', 'regular', 'casual,college,work', 0, 12],
  ['p13', 'Black Structured Work Tote', 'Lavie', 'bag', '#1E1E22', 'Black', 'solid', 'One size', 'Like new', 1090, 3499, 's5', 'Women', 'regular', 'work,college,travel', 0, 4],
  ['p14', 'Ivory Cotton Kurta', 'FabIndia', 'kurta', '#EFE6D2', 'Ivory', 'solid', 'L', 'Like new', 990, 2299, 's10', 'Men', 'regular', 'festive,ethnic', 0, 6],
  ['p15', 'Tortoiseshell Cat-Eye Sunglasses', 'Vincent Chase', 'sunglasses', '#6B4A32', 'Tortoise', 'solid', 'One size', 'Gently used', 690, 1800, 's1', 'Women', 'regular', 'date,travel,brunch', 0, 5],
  ['p16', 'Olive Bomber Jacket', 'Jack & Jones', 'jacket', '#556B3A', 'Olive', 'solid', 'M', 'Gently used', 1590, 4499, 's8', 'Men', 'relaxed', 'casual,streetwear,travel', 0, 10],
  ['p17', 'Red Checked Flannel Shirt', 'Pepe Jeans', 'shirt', '#B23B3B', 'Red', 'checks', 'L', 'Gently used', 790, 2499, 's4', 'Men', 'relaxed', 'casual,college', 0, 11],
  ['p18', 'Powder Blue Oxford Shirt', 'Allen Solly', 'shirt', '#A9C4E4', 'Sky blue', 'solid', 'M', 'Like new', 690, 1899, 's7', 'Men', 'regular', 'work,college', 0, 2],
  ['p19', 'Emerald Satin Slip Dress', 'Forever New', 'dress', '#1F7A5C', 'Emerald', 'solid', 'S', 'New with tags', 1990, 5990, 's9', 'Women', 'slim', 'date,party,festive', 0, 1],
  ['p20', 'Polka Dot Wrap Dress', 'AND', 'dress', '#F0E6D6', 'Cream', 'dots', 'M', 'Gently used', 1090, 3499, 's3', 'Women', 'regular', 'work,brunch,date', 1, 9],
  ['p21', 'Wide-Leg Cream Trousers', 'Zara', 'trousers', '#E9DFC9', 'Cream', 'solid', 'M', 'Like new', 1390, 3990, 's1', 'Women', 'relaxed', 'work,brunch,travel', 0, 4],
  ['p22', 'Acid-Wash Baggy Jeans', 'Bewakoof', 'jeans', '#6C8EB0', 'Washed blue', 'denim', '30', 'Gently used', 890, 2299, 's4', 'Unisex', 'oversized', 'streetwear,casual,college', 0, 13],
  ['p23', 'Suede Classic Sneakers', 'Puma', 'sneakers', '#3A5A8C', 'Royal blue', 'solid', 'UK 8', 'Gently used', 1490, 5999, 's2', 'Men', 'regular', 'streetwear,casual', 0, 7],
  ['p24', 'Retro Runner Sneakers', 'Nike', 'sneakers', '#C9CBD1', 'Cool grey', 'solid', 'UK 6', 'Like new', 2290, 7995, 's5', 'Unisex', 'regular', 'gym,casual,travel', 1, 3],
  ['p25', 'Terracotta Block-Print Kurta', 'Global Desi', 'kurta', '#C4663F', 'Terracotta', 'jaal', 'S', 'Gently used', 690, 2199, 's3', 'Women', 'regular', 'work,ethnic,festive', 0, 5],
  ['p26', 'Mustard Oversized Hoodie', 'The Souled Store', 'hoodie', '#D9A23B', 'Mustard', 'solid', 'XL', 'Gently used', 790, 1999, 's6', 'Unisex', 'oversized', 'casual,college,streetwear', 0, 6],
  ['p27', 'Essential Black Crew Tee', 'Uniqlo', 'tee', '#17171A', 'Black', 'solid', 'M', 'New with tags', 390, 990, 's8', 'Unisex', 'regular', 'casual,college,travel', 0, 2],
  ['p28', 'Lavender Cropped Hoodie', 'H&M', 'hoodie', '#B9A6DE', 'Lavender', 'solid', 'S', 'Like new', 990, 2990, 's7', 'Women', 'slim', 'casual,college', 0, 8],
  ['p29', 'Camel Utility Jacket', 'Mango', 'jacket', '#B98A55', 'Camel', 'solid', 'M', 'Like new', 2590, 7990, 's1', 'Women', 'relaxed', 'work,travel,brunch', 1, 3],
  ['p30', 'Denim Button-Front Mini Skirt', "Levi's", 'skirt', '#4B6E9B', 'Mid blue', 'denim', 'S', 'Gently used', 690, 2499, 's9', 'Women', 'regular', 'casual,college,date', 0, 6],
  ['p31', 'Tan Leather Sling Bag', 'Other', 'bag', '#7A4B2A', 'Tan', 'solid', 'One size', 'Gently used', 1290, 3999, 's2', 'Unisex', 'regular', 'casual,travel,streetwear', 0, 9],
  ['p32', 'Ecru Canvas Tote', 'Other', 'bag', '#E4DCC8', 'Ecru', 'solid', 'One size', 'Like new', 290, 799, 's7', 'Unisex', 'regular', 'college,casual,brunch', 0, 4],
  ['p33', 'Black Aviator Sunglasses', 'Other', 'sunglasses', '#202024', 'Black', 'solid', 'One size', 'Gently used', 590, 1500, 's8', 'Unisex', 'regular', 'casual,travel,streetwear', 0, 10],
  ['p34', 'Blue Pinstripe Linen Shirt', 'Van Heusen', 'shirt', '#4B7BA6', 'Blue', 'stripes', 'L', 'Gently used', 890, 2290, 's10', 'Men', 'relaxed', 'travel,brunch,work', 0, 8],
  ['p35', 'Lilac Georgette Kurta', 'Biba', 'kurta', '#C7B8E6', 'Lilac', 'jaal', 'M', 'New with tags', 1490, 3990, 's5', 'Women', 'regular', 'festive,ethnic,party', 0, 2],
  ['p36', 'Pink Gingham Shirt Dress', 'H&M', 'dress', '#E9A7B8', 'Pink', 'checks', 'M', 'Gently used', 790, 2299, 's3', 'Women', 'regular', 'casual,brunch,college', 0, 11],
  ['p37', 'Chunky White Trainers', 'Campus', 'sneakers', '#F7F7F5', 'White', 'solid', 'UK 6', 'Gently used', 1290, 3299, 's9', 'Women', 'regular', 'casual,college,streetwear', 1, 5],
  ['p38', 'Charcoal Formal Trousers', 'Van Heusen', 'trousers', '#3A3D42', 'Charcoal', 'solid', '32', 'Like new', 890, 2199, 's8', 'Men', 'regular', 'work', 0, 6],
  ['p39', 'Forest Corduroy Overshirt', 'Uniqlo', 'jacket', '#3E6B4C', 'Forest green', 'solid', 'L', 'Gently used', 1290, 3490, 's4', 'Men', 'relaxed', 'casual,travel', 0, 12],
  // Aanya's own listings
  ['m1', 'Ivory Poplin Shirt', 'Zara', 'shirt', '#F1ECE0', 'Ivory', 'solid', 'S', 'Like new', 890, 2790, 'me', 'Women', 'regular', 'work,brunch', 1, 6],
  ['m2', 'Mom-Fit Blue Jeans', 'H&M', 'jeans', '#5B7FA8', 'Mid blue', 'denim', '28', 'Gently used', 790, 2299, 'me', 'Women', 'relaxed', 'casual,college', 0, 9],
  ['m3', 'Coral Wrap Dress', 'Mango', 'dress', '#EE7B6B', 'Coral', 'solid', 'S', 'Like new', 1090, 3490, 'me', 'Women', 'regular', 'date,brunch,party', 1, 4],
  ['m4', 'Black Belt Bag', 'Other', 'bag', '#18181B', 'Black', 'solid', 'One size', 'Gently used', 590, 1799, 'me', 'Women', 'regular', 'casual,travel,college', 0, 12],
];

export function buildProduct(t, i = 0) {
  const [id, title, brand, type, hex, colorName, pattern, size, condition, price, mrp, seller, dept, cut, tags, swap, days] = t;
  const r = rng(hashStr(id));
  const measures = measuresFor(type, size, cut);
  const brandTxt = brand === 'Other' ? '' : `${brand} `;
  return {
    id, title, brand, type, color: hex, colorName, family: colorFamily(hex), pattern, size, condition, price, mrp,
    sellerId: seller, dept, cut, tags: tags.split(','), swap: !!swap, listedAt: Date.now() - days * 86400000,
    category: TYPES[type].cat, measures, fabric: FABRIC[type],
    description: `${brandTxt}${title.toLowerCase().includes(type) ? title : title + ' ' + TYPES[type].label.toLowerCase()} in ${colorName.toLowerCase()}. ${NOTE[condition]} Made of ${FABRIC[type].toLowerCase()}, ${cut} cut. Reason for selling: ${WHY[Math.floor(r() * WHY.length)]}`,
    views: 40 + Math.floor(r() * 300), likes: 3 + Math.floor(r() * 40), order: i,
  };
}
export const PRODUCTS = RAW.map(buildProduct);
