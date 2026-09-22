import { shade } from '../lib/color';
import { initials } from '../lib/format';
export default function Avatar({ name, hue = 200, size = 36, className = '' }) {
  const c1 = `hsl(${hue} 40% 46%)`, c2 = `hsl(${hue + 30} 45% 34%)`;
  return (
    <div className={`avatar ${className}`} style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
      {initials(name || '?')}
    </div>
  );
}
