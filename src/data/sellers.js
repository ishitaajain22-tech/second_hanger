export const ME = {
  id: 'me', name: 'Aanya Sharma', handle: '@aanya.rewears', city: 'Bengaluru', joined: 'Jan 2024', hue: 155,
  bio: 'Closet-cleanout queen. Mostly Zara, Mango and Indian labels. Everything steamed and shipped in 48h.',
  verified: { id: true, phone: true, email: true }, rating: 4.8, reviews: 23, sales: 19, respHrs: 1.5, disputes: 0,
};

export const SELLERS = [
  { id: 's1', name: 'Riya Kapoor', handle: '@riyakapoor', city: 'Mumbai', joined: 'Mar 2023', hue: 340, bio: 'Seasonal closet cleanouts. Mostly Zara, Mango and Indian designer labels. Every piece steamed and shipped within 24 hours.', verified: { id: true, phone: true, email: true }, rating: 4.9, reviews: 212, sales: 186, respHrs: 0.8, disputes: 0 },
  { id: 's2', name: 'Kabir Malhotra', handle: '@kabir.kicks', city: 'New Delhi', joined: 'Jun 2023', hue: 215, bio: 'Sneakerhead and denim nerd. Authentic pieces only, with honest photos of every scuff.', verified: { id: true, phone: true, email: true }, rating: 4.7, reviews: 96, sales: 88, respHrs: 2.5, disputes: 1 },
  { id: 's3', name: 'Meera Iyer', handle: '@meera.threads', city: 'Chennai', joined: 'Aug 2022', hue: 30, bio: 'Handloom, cotton kurtas and easy-breezy work wear. Sustainable fashion is my love language.', verified: { id: true, phone: true, email: true }, rating: 4.8, reviews: 141, sales: 120, respHrs: 1.5, disputes: 0 },
  { id: 's4', name: 'Arjun Nair', handle: '@arjun.vintage', city: 'Bengaluru', joined: 'Jan 2024', hue: 180, bio: 'Thrift-flip guy. Flannels, tees and weird finds from my Commercial Street hauls.', verified: { id: false, phone: true, email: true }, rating: 4.5, reviews: 38, sales: 31, respHrs: 5, disputes: 1 },
  { id: 's5', name: 'Simran Kaur', handle: '@simran.closet', city: 'Chandigarh', joined: 'Nov 2022', hue: 285, bio: 'Top-rated seller. Athleisure, bags and party wear in mint condition. Fast replies, always.', verified: { id: true, phone: true, email: true }, rating: 4.9, reviews: 305, sales: 271, respHrs: 0.5, disputes: 0 },
  { id: 's6', name: 'Dev Patel', handle: '@dev.drops', city: 'Ahmedabad', joined: 'Sep 2024', hue: 95, bio: 'New here! Selling my streetwear collection as I move abroad.', verified: { id: false, phone: true, email: true }, rating: 4.3, reviews: 22, sales: 19, respHrs: 9, disputes: 1 },
  { id: 's7', name: 'Ishita Sen', handle: '@ishita.edits', city: 'Kolkata', joined: 'Feb 2023', hue: 15, bio: 'Linen, cotton and quiet luxury. Minimal wardrobe, maximum care.', verified: { id: true, phone: true, email: true }, rating: 4.8, reviews: 77, sales: 64, respHrs: 3, disputes: 0 },
  { id: 's8', name: 'Rohan Deshmukh', handle: '@rohan.wears', city: 'Pune', joined: 'May 2023', hue: 240, bio: 'Office wear, denim and everyday basics. Clean, honest listings.', verified: { id: true, phone: true, email: true }, rating: 4.6, reviews: 58, sales: 52, respHrs: 4, disputes: 0 },
  { id: 's9', name: 'Tanvi Reddy', handle: '@tanvi.loops', city: 'Hyderabad', joined: 'Dec 2022', hue: 325, bio: 'Date-night dresses, denim and skirts. If it does not spark joy, it goes to you.', verified: { id: true, phone: true, email: true }, rating: 4.9, reviews: 164, sales: 150, respHrs: 1.2, disputes: 0 },
  { id: 's10', name: 'Zoya Khan', handle: '@zoya.festive', city: 'Jaipur', joined: 'Apr 2023', hue: 5, bio: 'Festive kurtas, block prints and wedding-season finds from Jaipur.', verified: { id: true, phone: true, email: true }, rating: 4.7, reviews: 89, sales: 81, respHrs: 2, disputes: 0 },
];

export const BUYERS = [
  { id: 'b1', name: 'Priya Menon', city: 'Kochi', hue: 200 },
  { id: 'b2', name: 'Nikhil Rao', city: 'Hyderabad', hue: 260 },
  { id: 'b3', name: 'Sana Sheikh', city: 'Mumbai', hue: 20 },
];

const REVIEWERS = ['Ananya P.', 'Vikram S.', 'Neha G.', 'Harsh J.', 'Aditi R.', 'Karan M.', 'Pooja T.', 'Sameer K.', 'Diya B.', 'Rahul N.', 'Mihika D.', 'Aarav C.'];
const R5 = [
  'Exactly as described. Packed beautifully with a handwritten note!',
  'Super responsive and shipped the same day. Would buy again.',
  'Even prettier in person. The fit matched the measurements shared.',
  'Smooth swap experience. Everything arrived within 3 days.',
  'Honest photos, honest description. Total pleasure to deal with.',
  'Loved the transparent measurements. Smart Fit was spot on.',
];
const R4 = ['Good condition overall. Slight fading that was not visible in photos, but the seller refunded ₹100 without fuss.', 'Nice seller, negotiated fairly on price. Delivery took a day longer.'];
const R3 = ['Took a while to ship but the item itself was fine. Communication could be better.'];
import { rng, hashStr } from '../lib/format';
export function reviewsFor(seller) {
  const r = rng(hashStr(seller.id));
  const out = [];
  for (let i = 0; i < 4; i++) {
    let stars = 5, text = R5[Math.floor(r() * R5.length)];
    if (seller.rating < 4.8 && i === 2) { stars = 4; text = R4[Math.floor(r() * R4.length)]; }
    if (seller.rating < 4.4 && i === 3) { stars = 3; text = R3[0]; }
    out.push({ id: `${seller.id}-r${i}`, name: REVIEWERS[Math.floor(r() * REVIEWERS.length)], stars, text, when: ['2 weeks ago', '1 month ago', '2 months ago', '3 months ago'][i] });
  }
  return out;
}
