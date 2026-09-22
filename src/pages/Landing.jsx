import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import Garment from '../components/Garment.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { ArrowRight, Sparkles, Wand2, Camera, Repeat, ShieldCheck, Leaf, Star } from '../components/icons.jsx';
import { useStore } from '../store.jsx';
import { BRAND } from '../config';

const FLOATERS = [
  { type: 'dress', color: '#E7B7C2', pattern: 'floral', top: '4%', left: '2%', rot: -8, w: 128 },
  { type: 'sneakers', color: '#F4F3EF', pattern: 'solid', top: '54%', left: '0%', rot: 6, w: 118, delay: '1.4s' },
  { type: 'jacket', color: '#7BA3C7', pattern: 'denim', top: '2%', left: '56%', rot: 7, w: 130, delay: '.6s' },
  { type: 'kurta', color: '#A9BFA0', pattern: 'jaal', top: '58%', left: '62%', rot: -6, w: 122, delay: '2s' },
];

const STEPS = [
  { icon: Camera, title: 'Snap or select', text: 'Photograph an item or scan your wardrobe. Our AI reads type, colour and fabric.' },
  { icon: Sparkles, title: 'AI does the boring part', text: 'Background removed, title drafted, price suggested from real comps.' },
  { icon: Wand2, title: 'List, swap or style', text: 'Sell it, swap it, or let the Stylist build outfits with pieces you already own.' },
];
const DIFFS = [
  { icon: Wand2, title: 'AI Wardrobe Visualizer', text: 'Scan your closet once. See every piece as a clean digital card, searchable by colour, type and occasion.' },
  { icon: Sparkles, title: 'AI Wardrobe Changer', text: 'Recolour or restyle any piece and preview it instantly before you decide to sell or keep it.' },
  { icon: Star, title: 'AI Outfit Stylist', text: 'Full outfits from your closet plus marketplace picks that fill the gaps, matched to your fit.' },
  { icon: Camera, title: 'AI Listing Assistant', text: 'Upload a photo and get a clean cutout, a title, a description and a data-backed price in seconds.' },
  { icon: ShieldCheck, title: 'Smart Fit Match', text: 'Every listing is checked against your saved measurements so surprises at delivery become rare.' },
  { icon: Repeat, title: 'Clothing Swap', text: 'Trade instead of spending. Propose a swap, negotiate, and grow your wardrobe for free.' },
];

export default function Landing() {
  const { products } = useStore();
  const trending = useMemo(() => products.filter((p) => !p.sold).sort((a, b) => b.likes - a.likes).slice(0, 4), [products]);
  return (
    <div>
      <section className="hero">
        <div className="container hero-grid">
          <div className="fade-in">
            <div className="eyebrow">India's AI-first pre-loved marketplace</div>
            <h1>Give your <span className="accent">wardrobe</span> a second life.</h1>
            <p style={{ fontSize: 18, color: 'var(--ink-soft)', maxWidth: 480, marginTop: 18, lineHeight: 1.55 }}>
              Buy, sell and swap pre-loved fashion with an AI stylist, a digital closet, and a fit-match that actually works.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Link to="/browse" className="btn btn-primary btn-lg">Start browsing <ArrowRight size={17} /></Link>
              <Link to="/sell" className="btn btn-outline btn-lg">Sell an item</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat"><b>48,000+</b><span>ITEMS RE-WORN</span></div>
              <div className="hero-stat"><b>₹2.1 Cr</b><span>PAID TO SELLERS</span></div>
              <div className="hero-stat"><b>310 t</b><span>CO₂e AVOIDED</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="float-card" style={{ top: '18%', left: '20%', width: 200, animationDelay: '.3s' }}>
              <Garment type="dress" color="#E7B7C2" pattern="floral" hanger />
              <div style={{ padding: '8px 4px 2px', fontSize: 12.5, fontWeight: 700 }}>Floral Midi Dress</div>
              <div style={{ padding: '0 4px', fontSize: 11.5, color: 'var(--ink-soft)' }}>₹1,290 · Riya K.</div>
            </div>
            {FLOATERS.map((f, i) => (
              <div key={i} className="float-card" style={{ top: f.top, left: f.left, width: f.w, transform: `rotate(${f.rot}deg)`, animationDelay: f.delay }}>
                <Garment type={f.type} color={f.color} pattern={f.pattern} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>How it works</div>
          <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Selling used to be a chore.<br />Now it's three taps.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><s.icon size={20} color="var(--lime-ink)" /></div>
                <h4 style={{ fontSize: 20, marginBottom: 8 }}>{i + 1}. {s.title}</h4>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.55 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--ink)', color: 'var(--cream)', borderRadius: 32, marginLeft: 24, marginRight: 24 }}>
        <div className="container">
          <div className="eyebrow" style={{ color: 'var(--lime)' }}>What makes {BRAND.name} different</div>
          <h2 style={{ color: '#fff', marginBottom: 40, maxWidth: 560 }}>Fashion resale, but genuinely intelligent.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.12)' }}>
            {DIFFS.map((d, i) => (
              <div key={i} style={{ background: 'var(--ink)', padding: 26 }}>
                <d.icon size={22} color="var(--lime)" />
                <h4 style={{ color: '#fff', fontSize: 18, margin: '14px 0 8px' }}>{d.title}</h4>
                <p style={{ opacity: .68, fontSize: 13.5, lineHeight: 1.55 }}>{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Trending now</div><h2>Loved by the community</h2></div>
            <Link to="/browse" className="btn btn-ghost">See all <ArrowRight size={15} /></Link>
          </div>
          <div className="grid-products">{trending.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', background: '#F1ECDD', borderRadius: 32, padding: 48 }}>
          <div>
            <div className="eyebrow"><Leaf size={13} /> Sustainability dashboard</div>
            <h2 style={{ marginBottom: 14 }}>See the impact of every pre-loved buy.</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>Every purchase, sale and swap on {BRAND.name} rolls up into a personal impact score: CO₂e avoided, water saved, and textile waste diverted from landfills.</p>
            <Link to="/impact" className="btn btn-primary">View your impact <ArrowRight size={16} /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[['6.2 t', 'CO₂e avoided'], ['18,400 L', 'Water saved'], ['₹31,200', 'Earned reselling'], ['62', 'Items re-worn']].map(([v, l]) => (
              <div key={l} className="card" style={{ padding: 20 }}><div style={{ fontFamily: 'var(--serif)', fontSize: 30 }}>{v}</div><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
