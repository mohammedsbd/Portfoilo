/**
 * The plotter working behind the cover.
 *
 * Construction geometry — circles, arcs, dimension lines, crosshairs — drawn
 * over the blueprint grid the way a pen plotter lays a sheet down: each shape
 * traces itself in, holds, then traces back out, and they run on staggered
 * clocks so something is always mid-stroke.
 *
 * Every shape carries `pathLength="1"`, which normalises its length whatever
 * its real geometry is, so one dash animation drives a circle, a line and an
 * arc alike and nothing needs measuring. It is CSS the whole way down: no
 * state, no rAF, nothing to keep in sync.
 */

/** Trace delays, spread so the sheet never empties or fills all at once. */
const DELAYS = [0, 1.6, 3.1, 4.4, 5.9, 7.2, 8.6, 9.8, 11.3, 12.7];

const d = (i: number) => ({ animationDelay: `${DELAYS[i % DELAYS.length]}s` });

export default function BlueprintPlotter() {
  return (
    <div className="plot" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <g className="plot__ink">
          {/* setting-out circles, top left */}
          <circle className="plot__d" style={d(0)} cx="250" cy="215" r="132" pathLength="1" />
          <circle className="plot__d" style={d(1)} cx="250" cy="215" r="68" pathLength="1" />
          <line className="plot__d" style={d(2)} x1="80" y1="215" x2="420" y2="215" pathLength="1" />
          <line className="plot__d" style={d(2)} x1="250" y1="45" x2="250" y2="385" pathLength="1" />

          {/* dimension line with end ticks */}
          <line className="plot__d" style={d(3)} x1="560" y1="150" x2="1080" y2="150" pathLength="1" />
          <line className="plot__d" style={d(3)} x1="560" y1="130" x2="560" y2="170" pathLength="1" />
          <line className="plot__d" style={d(3)} x1="1080" y1="130" x2="1080" y2="170" pathLength="1" />

          {/* swept arc, right */}
          <path
            className="plot__d"
            style={d(4)}
            d="M 1180 760 A 340 340 0 0 1 1520 420"
            pathLength="1"
          />
          <path
            className="plot__d"
            style={d(5)}
            d="M 1250 760 A 270 270 0 0 1 1520 490"
            pathLength="1"
          />

          {/* rotated square, set on its corner */}
          <rect
            className="plot__d"
            style={d(6)}
            x="1290"
            y="130"
            width="180"
            height="180"
            transform="rotate(45 1380 220)"
            pathLength="1"
          />

          {/* a route, plotted point to point */}
          <polyline
            className="plot__d"
            style={d(7)}
            points="120,700 330,560 520,640 760,470 980,545"
            pathLength="1"
          />

          {/* long construction diagonal */}
          <line className="plot__d" style={d(8)} x1="60" y1="880" x2="1540" y2="120" pathLength="1" />

          {/* small target, bottom right */}
          <circle className="plot__d" style={d(9)} cx="1090" cy="770" r="46" pathLength="1" />
          <line className="plot__d" style={d(9)} x1="1020" y1="770" x2="1160" y2="770" pathLength="1" />
          <line className="plot__d" style={d(9)} x1="1090" y1="700" x2="1090" y2="840" pathLength="1" />

          {/* the head, travelling across the sheet */}
          <line className="plot__scan" x1="0" y1="0" x2="0" y2="900" />
        </g>
      </svg>
    </div>
  );
}
