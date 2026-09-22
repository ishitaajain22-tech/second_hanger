import { useId } from 'react';
import { shade, luminance } from '../lib/color';

const autoAccent = (c) => (luminance(c) > 0.55 ? shade(c, -0.4) : shade(c, 0.55));

/* Each shape returns { bodies: [path d], details: JSX, dy? }. Canvas is 200 x 240. */
const SHAPES = {
  tee: (c, a, ln) => ({
    bodies: ['M62 32 L84 22 Q100 42 116 22 L138 32 L180 62 L160 94 L140 80 L140 214 L60 214 L60 80 L40 94 L20 62 Z'],
    details: (<>
      <path d="M84 22 Q100 42 116 22" fill="none" stroke={ln} strokeWidth="4.5" strokeLinecap="round" />
      <path d="M62 32 L60 80 M138 32 L140 80 M60 203 H140" stroke={ln} strokeWidth="1.2" opacity=".5" fill="none" />
    </>),
  }),
  shirt: (c, a, ln) => ({
    bodies: ['M60 34 L84 24 L100 46 L116 24 L140 34 L186 78 L176 158 L154 154 L146 92 L146 216 L54 216 L54 92 L46 154 L24 158 L14 78 Z'],
    details: (<>
      <path d="M84 24 L100 46 L88 56 L70 36 Z M116 24 L100 46 L112 56 L130 36 Z" fill={shade(c, 0.18)} stroke={ln} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M100 46 V216" stroke={ln} strokeWidth="1.3" />
      {[72, 102, 132, 162, 192].map((y) => <circle key={y} cx="100" cy={y} r="1.9" fill={shade(c, -0.4)} />)}
      <path d="M24 158 L46 154 M176 158 L154 154" stroke={ln} strokeWidth="2" />
      <rect x="108" y="88" width="20" height="22" rx="2" fill="none" stroke={ln} strokeWidth="1.1" opacity=".7" />
    </>),
  }),
  hoodie: (c, a, ln) => ({
    bodies: [
      'M64 46 L86 36 L114 36 L136 46 L182 84 L176 194 L152 192 L144 104 L148 214 L52 214 L56 104 L48 192 L24 194 L18 84 Z',
      'M78 40 Q100 -2 122 40 Q100 64 78 40 Z',
    ],
    details: (<>
      <path d="M84 40 Q100 56 116 40 Q100 24 84 40 Z" fill={shade(c, -0.4)} />
      <path d="M93 54 V98 M107 54 V98" stroke={shade(c, 0.6)} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M68 150 L132 150 L140 192 L60 192 Z" fill="none" stroke={ln} strokeWidth="1.3" />
      <path d="M52 203 H148 M24 186 L50 188 M176 186 L150 188" stroke={ln} strokeWidth="1.4" />
    </>),
  }),
  jacket: (c, a, ln) => ({
    bodies: ['M58 38 L84 28 L100 44 L116 28 L142 38 L188 80 L178 182 L152 178 L146 104 L148 212 L52 212 L54 104 L48 178 L22 182 L12 80 Z'],
    details: (<>
      <path d="M84 28 L100 44 L100 62 L78 42 Z M116 28 L100 44 L100 62 L122 42 Z" fill={shade(c, 0.16)} stroke={ln} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M100 44 V212" stroke={ln} strokeWidth="1.6" />
      <rect x="64" y="118" width="26" height="24" rx="2" fill="none" stroke={ln} strokeWidth="1.2" />
      <rect x="110" y="118" width="26" height="24" rx="2" fill="none" stroke={ln} strokeWidth="1.2" />
      <path d="M64 126 H90 M110 126 H136 M52 200 H148 M22 172 L48 170 M178 172 L152 170" stroke={ln} strokeWidth="1.2" opacity=".7" />
      {[70, 95].map((y) => <circle key={y} cx="100" cy={y} r="2.1" fill={shade(c, -0.4)} />)}
    </>),
  }),
  jeans: (c, a, ln) => ({
    bodies: ['M56 16 H144 L152 50 L160 226 H112 L100 96 L88 226 H40 L48 50 Z'],
    details: (<>
      <path d="M54 30 H146" stroke={ln} strokeWidth="1.3" />
      <path d="M100 30 V88" stroke={ln} strokeWidth="1.2" />
      <path d="M58 30 Q62 58 86 62 M142 30 Q138 58 114 62" fill="none" stroke={ln} strokeWidth="1.3" strokeDasharray="2.5 2" />
      {[64, 96, 130].map((x) => <rect key={x} x={x} y="14" width="5" height="14" rx="1.5" fill={shade(c, -0.12)} stroke={ln} strokeWidth=".8" />)}
      <circle cx="100" cy="23" r="2.3" fill="#C9A24B" />
      <path d="M41 214 H89 M111 214 H159" stroke={ln} strokeWidth="1.2" strokeDasharray="2.5 2" />
    </>),
  }),
  trousers: (c, a, ln) => ({
    bodies: ['M56 16 H144 L156 60 L164 226 H108 L100 100 L92 226 H36 L44 60 Z'],
    details: (<>
      <path d="M52 30 H148" stroke={ln} strokeWidth="1.3" />
      <path d="M78 30 V56 M122 30 V56" stroke={ln} strokeWidth="1.1" opacity=".6" />
      <path d="M68 62 L58 222 M132 62 L142 222" stroke={ln} strokeWidth="1.1" opacity=".35" />
      {[62, 100, 136].map((x) => <rect key={x} x={x} y="14" width="5" height="14" rx="1.5" fill={shade(c, -0.1)} stroke={ln} strokeWidth=".8" />)}
      <circle cx="100" cy="23" r="2.3" fill="#B9A06A" />
      <path d="M100 30 V90" stroke={ln} strokeWidth="1" />
    </>),
  }),
  dress: (c, a, ln) => ({
    bodies: ['M76 14 L86 14 L100 46 L114 14 L124 14 L128 66 L136 104 L180 228 Q100 242 20 228 L64 104 L72 66 Z'],
    details: (<>
      <path d="M86 14 L100 46 L114 14" fill="none" stroke={ln} strokeWidth="1.4" />
      <path d="M64 104 Q100 118 136 104" fill="none" stroke={ln} strokeWidth="1.4" />
      <path d="M84 116 L62 226 M100 120 V236 M116 116 L138 226" stroke={ln} strokeWidth="1.1" opacity=".3" />
    </>),
  }),
  kurta: (c, a, ln) => ({
    bodies: ['M70 24 L92 18 Q100 32 108 18 L130 24 L178 58 L168 130 L146 120 L150 226 L50 226 L54 120 L32 130 L22 58 Z'],
    details: (<>
      <path d="M92 18 Q100 32 108 18" fill="none" stroke={ln} strokeWidth="4" strokeLinecap="round" />
      <path d="M100 30 V116" stroke={ln} strokeWidth="1.2" />
      {[44, 64, 84, 104].map((y) => <circle key={y} cx="100" cy={y} r="1.8" fill={a} />)}
      <path d="M76 32 Q100 66 124 32" fill="none" stroke={a} strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M50 214 H150" stroke={a} strokeWidth="3" opacity=".65" />
      <path d="M54 176 V226 M146 176 V226" stroke={ln} strokeWidth="1.1" opacity=".5" />
      <path d="M32 130 L54 120 M168 130 L146 120" stroke={a} strokeWidth="2" opacity=".7" />
    </>),
  }),
  skirt: (c, a, ln) => ({
    bodies: ['M64 40 H136 L182 204 Q100 224 18 204 Z'],
    details: (<>
      <rect x="64" y="40" width="72" height="14" fill={shade(c, -0.1)} stroke={ln} strokeWidth="1.2" />
      {[-3, -2, -1, 0, 1, 2, 3].map((i) => <path key={i} d={`M${100 + i * 11} 54 L${100 + i * 26} ${214 - Math.abs(i) * 1.5}`} stroke={ln} strokeWidth="1.1" opacity=".38" />)}
    </>),
  }),
  sneakers: (c, a, ln) => {
    const sole = luminance(c) > 0.7 ? '#E5E1D6' : '#F4F1EA';
    return {
      dy: 14,
      bodies: ['M24 120 Q24 106 40 104 L64 104 Q70 122 92 126 L118 112 Q126 120 140 130 L178 142 Q192 148 192 164 V178 H24 Z'],
      details: (<>
        <rect x="20" y="174" width="176" height="16" rx="8" fill={sole} stroke={shade(sole, -0.25)} strokeWidth="1.3" />
        <path d="M56 140 Q90 152 126 146 L134 160 Q90 170 52 158 Z" fill={a} opacity=".55" />
        <path d="M70 112 L80 104 M84 118 L96 108 M98 122 L110 113 M112 127 L124 119" stroke={ln} strokeWidth="2" strokeLinecap="round" />
        <path d="M152 138 Q160 160 154 174" fill="none" stroke={ln} strokeWidth="1.3" />
        <rect x="24" y="118" width="10" height="34" rx="4" fill={shade(c, -0.12)} />
      </>),
    };
  },
  bag: (c, a, ln) => ({
    bodies: ['M38 96 H162 L172 212 Q172 220 164 220 H36 Q28 220 28 212 Z'],
    details: (<>
      <path d="M68 96 V70 Q68 40 100 40 Q132 40 132 70 V96" fill="none" stroke={shade(c, -0.3)} strokeWidth="6" strokeLinecap="round" />
      <path d="M38 110 H162" stroke={ln} strokeWidth="1.2" />
      <rect x="60" y="136" width="80" height="50" rx="3" fill="none" stroke={ln} strokeWidth="1.2" opacity=".8" />
      <rect x="93" y="104" width="14" height="10" rx="2" fill="#C9A24B" />
    </>),
  }),
  sunglasses: (c, a, ln) => ({
    dy: 8,
    bodies: [
      'M22 100 Q22 90 34 90 H80 Q92 90 92 102 Q92 132 62 134 Q28 134 22 100 Z',
      'M178 100 Q178 90 166 90 H120 Q108 90 108 102 Q108 132 138 134 Q172 134 178 100 Z',
    ],
    details: (<>
      <path d="M34 98 Q34 96 38 96 H76 Q84 96 84 104 Q84 124 62 126 Q38 126 34 98 Z" fill="#20242b" opacity=".88" />
      <path d="M166 98 Q166 96 162 96 H124 Q116 96 116 104 Q116 124 138 126 Q162 126 166 98 Z" fill="#20242b" opacity=".88" />
      <path d="M92 100 Q100 93 108 100" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />
      <path d="M22 98 L6 92 M178 98 L194 92" stroke={c} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 102 L58 100 M132 102 L146 100" stroke="#fff" strokeWidth="2" opacity=".5" strokeLinecap="round" />
    </>),
  }),
};

function PatternDef({ kind, id, a }) {
  const pid = `p${id}`;
  switch (kind) {
    case 'stripes': return <pattern id={pid} width="9" height="9" patternUnits="userSpaceOnUse"><rect width="2.6" height="9" fill={a} opacity=".55" /></pattern>;
    case 'breton': return <pattern id={pid} width="200" height="13" patternUnits="userSpaceOnUse"><rect width="200" height="4.5" fill={a} opacity=".85" /></pattern>;
    case 'checks': return <pattern id={pid} width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="16" fill={a} opacity=".28" /><rect width="16" height="8" fill={a} opacity=".28" /></pattern>;
    case 'dots': return <pattern id={pid} width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="6.5" cy="6.5" r="2.2" fill={a} opacity=".75" /></pattern>;
    case 'floral': return (
      <pattern id={pid} width="34" height="34" patternUnits="userSpaceOnUse">
        <g fill={a} opacity=".8"><circle cx="9" cy="6" r="2.4" /><circle cx="9" cy="12" r="2.4" /><circle cx="6" cy="9" r="2.4" /><circle cx="12" cy="9" r="2.4" /></g>
        <circle cx="9" cy="9" r="1.5" fill="#F6D365" />
        <g fill={a} opacity=".7"><circle cx="26" cy="23" r="2" /><circle cx="26" cy="28" r="2" /><circle cx="23.5" cy="25.5" r="2" /><circle cx="28.5" cy="25.5" r="2" /></g>
        <circle cx="26" cy="25.5" r="1.2" fill="#F6D365" />
        <ellipse cx="22" cy="8" rx="3" ry="1.3" fill="#5C8A62" opacity=".6" transform="rotate(-30 22 8)" />
      </pattern>
    );
    case 'denim': return <pattern id={pid} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M-1 1 L1 -1 M0 4 L4 0 M3 5 L5 3" stroke="#fff" strokeWidth=".7" opacity=".2" /><path d="M0 0 L4 4" stroke="#000" strokeWidth=".5" opacity=".07" /></pattern>;
    case 'jaal': return <pattern id={pid} width="24" height="24" patternUnits="userSpaceOnUse"><path d="M12 3 L21 12 L12 21 L3 12 Z" fill="none" stroke={a} strokeWidth="1" opacity=".7" /><circle cx="12" cy="12" r="1.7" fill={a} opacity=".8" /></pattern>;
    default: return null;
  }
}

export const FIT_TRANSFORM = {
  regular: { s: [1, 1], o: '100px 120px' },
  oversized: { s: [1.14, 1.02], o: '100px 120px' },
  slim: { s: [0.9, 1], o: '100px 120px' },
  cropped: { s: [1, 0.8], o: '100px 26px' },
};

export default function Garment({ type = 'tee', color = '#888888', pattern = 'solid', accent, fit = 'regular', hanger = false, tilt = 0, className = '', title, ...svgProps }) {
  const id = useId().replace(/:/g, '');
  const shape = (SHAPES[type] || SHAPES.tee);
  const a = accent || autoAccent(color);
  const stroke = shade(color, -0.3);
  const ln = shade(color, -0.24);
  const s = shape(color, a, ln);
  const canFit = ['tee', 'shirt', 'hoodie', 'jacket', 'kurta', 'dress', 'skirt', 'jeans', 'trousers'].includes(type);
  const ft = canFit ? (FIT_TRANSFORM[fit] || FIT_TRANSFORM.regular) : FIT_TRANSFORM.regular;
  const hang = hanger && ['tee', 'shirt', 'hoodie', 'jacket', 'kurta', 'dress'].includes(type);
  const hasPat = pattern && pattern !== 'solid';
  return (
    <svg viewBox="0 0 200 240" className={`garment ${className}`} role="img" aria-label={title || type} {...svgProps}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".24" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".17" />
        </linearGradient>
        {hasPat && <PatternDef kind={pattern} id={id} a={a} />}
      </defs>
      {!hang && <ellipse cx="100" cy="234" rx="60" ry="4.5" fill="#000" opacity=".1" />}
      <g transform={`rotate(${tilt} 100 120)`}>
        {hang && (
          <g fill="none" stroke="#8b7d6b" strokeWidth="2.2" strokeLinecap="round">
            <path d="M100 22 V15 Q100 6 108 6 Q117 6 117 13" />
            <path d="M100 22 L46 46 Q40 49 46 51 H154 Q160 49 154 46 Z" />
          </g>
        )}
        <g transform={hang ? 'translate(9 22) scale(.91)' : `translate(0 ${s.dy || 0})`}>
          <g style={{ transformOrigin: ft.o, transform: `scale(${ft.s[0]}, ${ft.s[1]})`, transition: 'transform .5s cubic-bezier(.2,.8,.2,1)' }}>
            {s.bodies.map((d, i) => <path key={'b' + i} d={d} fill={color} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />)}
            {hasPat && s.bodies.map((d, i) => <path key={'p' + i} d={d} fill={`url(#p${id})`} />)}
            {s.bodies.map((d, i) => <path key={'g' + i} d={d} fill={`url(#g${id})`} />)}
            {s.details}
          </g>
        </g>
      </g>
    </svg>
  );
}
