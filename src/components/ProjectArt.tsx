import type { ProjectArt as ArtKind } from '@/data/projects';

interface Props {
  kind: ArtKind;
  palette: [string, string];
  seed: string;
}

/**
 * Procedural cover art for each project card. Beats screenshots for a
 * portfolio where the work is mostly backend, and keeps the page free of
 * image assets.
 *
 * Deliberately static. Eight of these are mounted at once, and per-element
 * SMIL timelines (especially animated `d` and `animateMotion`) run on the
 * main thread whether or not the card is on screen. The card supplies the
 * motion instead, via a CSS transform and sheen on hover.
 */
export default function ProjectArt({ kind, palette, seed }: Props) {
  const [hi, lo] = palette;
  const id = `art-${seed}`;

  return (
    <svg viewBox="0 0 600 380" preserveAspectRatio="xMidYMid slice" role="presentation">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={lo} stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0d0d0d" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stopColor={hi} stopOpacity="0.42" />
          <stop offset="100%" stopColor={hi} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={hi} stopOpacity="0" />
          <stop offset="50%" stopColor={hi} stopOpacity="1" />
          <stop offset="100%" stopColor={hi} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="600" height="380" fill={`url(#${id}-bg)`} />
      <circle cx="300" cy="190" r="190" fill={`url(#${id}-glow)`} />

      {kind === 'orbit' && <Orbit hi={hi} id={id} />}
      {kind === 'grid' && <Grid hi={hi} id={id} />}
      {kind === 'wave' && <Wave hi={hi} id={id} />}
      {kind === 'nodes' && <Nodes hi={hi} />}
      {kind === 'stack' && <Stack hi={hi} />}
      {kind === 'pulse' && <Pulse hi={hi} id={id} />}

      <g opacity="0.05">
        {Array.from({ length: 38 }, (_, i) => (
          <rect key={i} x="0" y={i * 10} width="600" height="1" fill="#e1e0cc" />
        ))}
      </g>
    </svg>
  );
}

function Orbit({ hi, id }: { hi: string; id: string }) {
  return (
    <g>
      <g fill="none" stroke={hi} opacity="0.4">
        <ellipse cx="300" cy="190" rx="215" ry="78" strokeWidth="1" />
        <ellipse cx="300" cy="190" rx="215" ry="78" strokeWidth="1" transform="rotate(60 300 190)" />
        <ellipse cx="300" cy="190" rx="215" ry="78" strokeWidth="1" transform="rotate(-60 300 190)" />
      </g>
      <circle cx="300" cy="190" r="34" fill={hi} opacity="0.9" />
      <circle cx="300" cy="190" r="52" fill="none" stroke={hi} strokeWidth="1" opacity="0.5" />

      {/* satellites parked at rest positions on each ring */}
      <circle cx="515" cy="190" r="7" fill="#e1e0cc" />
      <circle cx="192" cy="283" r="6" fill="#e1e0cc" opacity="0.85" />
      <circle cx="408" cy="97" r="5" fill="#e1e0cc" opacity="0.7" />

      <path d="M60 190 H540" stroke={`url(#${id}-line)`} strokeWidth="1" opacity="0.35" />
    </g>
  );
}

function Grid({ hi, id }: { hi: string; id: string }) {
  const cells = Array.from({ length: 96 }, (_, i) => i);
  return (
    <g>
      <g opacity="0.55">
        {cells.map((i) => {
          const col = i % 16;
          const row = Math.floor(i / 16);
          const on = (col * 7 + row * 13) % 5 === 0;
          return (
            <rect
              key={i}
              x={60 + col * 30}
              y={70 + row * 40}
              width="22"
              height="30"
              rx="2"
              fill={on ? hi : 'transparent'}
              stroke={hi}
              strokeWidth="0.75"
              // staggered opacity reads as a lit pattern without animating
              opacity={on ? 0.4 + ((col + row) % 4) * 0.15 : 0.18}
            />
          );
        })}
      </g>
      <path d="M0 190 H600" stroke={`url(#${id}-line)`} strokeWidth="1.5" opacity="0.5" />
    </g>
  );
}

function Wave({ hi, id }: { hi: string; id: string }) {
  const rows = [0, 1, 2, 3, 4, 5, 6];
  return (
    <g fill="none" stroke={hi}>
      {rows.map((r) => (
        <path
          key={r}
          d={`M -20 ${120 + r * 26} Q 110 ${70 + r * 26} 250 ${125 + r * 26} T 620 ${110 + r * 26}`}
          strokeWidth={r === 3 ? 2 : 1}
          opacity={r === 3 ? 0.9 : 0.3}
        />
      ))}
      <path d="M0 30 H600" stroke={`url(#${id}-line)`} strokeWidth="1" opacity="0.4" />
    </g>
  );
}

function Nodes({ hi }: { hi: string }) {
  const pts = [
    [110, 90],
    [240, 60],
    [380, 110],
    [500, 80],
    [80, 220],
    [210, 190],
    [330, 240],
    [470, 200],
    [160, 320],
    [300, 330],
    [440, 300],
    [540, 260],
  ] as const;

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 4],
    [1, 5],
    [2, 6],
    [3, 7],
    [4, 5],
    [5, 6],
    [6, 7],
    [4, 8],
    [6, 9],
    [7, 10],
    [8, 9],
    [9, 10],
    [10, 11],
  ] as const;

  return (
    <g>
      <g stroke={hi} strokeWidth="1" opacity="0.35">
        {edges.map(([a, b], i) => (
          <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />
        ))}
      </g>
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.5" fill={hi} />
          {/* halos frozen at varied radii instead of pulsing */}
          <circle
            cx={x}
            cy={y}
            r={6 + (i % 4) * 3.5}
            fill="none"
            stroke={hi}
            strokeWidth="1"
            opacity={0.4 - (i % 4) * 0.08}
          />
        </g>
      ))}
    </g>
  );
}

function Stack({ hi }: { hi: string }) {
  const layers = [0, 1, 2, 3, 4];
  return (
    <g>
      {layers.map((l) => (
        <g key={l} opacity={1 - l * 0.15}>
          <path
            d={`M 300 ${88 + l * 46} L 470 ${132 + l * 46} L 300 ${176 + l * 46} L 130 ${132 + l * 46} Z`}
            fill={l === 0 ? hi : 'transparent'}
            stroke={hi}
            strokeWidth="1.25"
            fillOpacity="0.22"
          />
        </g>
      ))}
      <circle cx="300" cy="200" r="6" fill="#e1e0cc" opacity="0.9" />
    </g>
  );
}

function Pulse({ hi, id }: { hi: string; id: string }) {
  return (
    <g>
      <g stroke={hi} strokeWidth="0.5" opacity="0.18">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="380" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="0" y1={i * 50} x2="600" y2={i * 50} />
        ))}
      </g>
      <path
        d="M -10 190 H 150 l 22 -74 l 30 148 l 26 -110 l 24 52 h 60 l 20 -40 l 26 78 l 24 -64 h 200"
        fill="none"
        stroke={hi}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M0 340 H600" stroke={`url(#${id}-line)`} strokeWidth="1" opacity="0.5" />
    </g>
  );
}
