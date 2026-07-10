"use client";

const WIDTH = 560;
const HEIGHT = 140;
const PADDING = 8;

export function PnLChart({ history, startingCash }: { history: number[]; startingCash: number }) {
  if (history.length < 2) {
    return (
      <div className="flex h-full items-center justify-center rounded border border-term-border bg-term-panel text-sm text-term-muted">
        Collecting equity history…
      </div>
    );
  }

  const min = Math.min(...history, startingCash);
  const max = Math.max(...history, startingCash);
  const range = max - min || 1;

  const points = history.map((value, i) => {
    const x = PADDING + (i / (history.length - 1)) * (WIDTH - PADDING * 2);
    const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2);
    return [x, y] as const;
  });

  const baselineY = HEIGHT - PADDING - ((startingCash - min) / range) * (HEIGHT - PADDING * 2);
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1][0].toFixed(1)},${HEIGHT - PADDING} L${points[0][0].toFixed(1)},${HEIGHT - PADDING} Z`;

  const last = history[history.length - 1];
  const up = last >= startingCash;

  return (
    <div className="h-full rounded border border-term-border bg-term-panel p-2">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" preserveAspectRatio="none">
        <line
          x1={PADDING}
          x2={WIDTH - PADDING}
          y1={baselineY}
          y2={baselineY}
          stroke="#1f2933"
          strokeDasharray="4 4"
        />
        <path d={areaPath} fill={up ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)"} stroke="none" />
        <path d={path} fill="none" stroke={up ? "#22c55e" : "#ef4444"} strokeWidth={1.5} />
      </svg>
    </div>
  );
}
