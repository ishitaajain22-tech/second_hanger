import { inr, pctOff } from '../lib/format';
export default function Price({ price, mrp, size = 'md' }) {
  const off = pctOff(price, mrp);
  return (
    <span className="p-price-row">
      <span className="p-price" style={size === 'lg' ? { fontSize: 26 } : undefined}>{inr(price)}</span>
      {mrp > price && <span className="p-mrp">{inr(mrp)}</span>}
      {off > 0 && <span className="p-off">{off}% off</span>}
    </span>
  );
}
