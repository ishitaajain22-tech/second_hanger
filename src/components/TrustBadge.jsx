import { trustScore } from '../lib/trust';
import { ShieldCheck } from './icons.jsx';
export default function TrustBadge({ seller, size = 'md' }) {
  const t = trustScore(seller);
  return (
    <span className="pill" style={{ background: `${t.color}1A`, color: t.color, fontSize: size === 'sm' ? 11.5 : 12.5 }}>
      <ShieldCheck size={size === 'sm' ? 12 : 13} /> {t.total}/100 · {t.label}
    </span>
  );
}
