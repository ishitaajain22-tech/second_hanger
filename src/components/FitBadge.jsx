import { fitMatch } from '../lib/fit';
const COLOR = { great: '#1F7A4D', good: '#4F8A2B', ok: '#B58A1B', bad: '#B5573A' };
export default function FitBadge({ product, measurements }) {
  const f = fitMatch(product, measurements);
  if (!f) return null;
  return <span className="pill" style={{ background: `${COLOR[f.tone]}18`, color: COLOR[f.tone] }}>✓ {f.label} · {f.score}%</span>;
}
