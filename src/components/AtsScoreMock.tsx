import type { CSSProperties } from "react";

export type AtsShape = "circle" | "square" | "diamond" | "triangle" | "oval" | "pennant";

export type AtsDimension = {
  label: string;
  score: number;
  color: string;
  shape: AtsShape;
};

const CX = 180;
const CY = 140;
const MAX_R = 82;

function polar(r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function hexPoints(r: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const p = polar(r, -90 + i * (360 / count));
    return `${p.x},${p.y}`;
  }).join(" ");
}

function ShapeIcon({ shape, color }: { shape: AtsShape; color: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 18 18",
    "aria-hidden": true as const,
  };
  if (shape === "circle") {
    return (
      <svg {...common}>
        <circle cx="9" cy="9" r="7" fill={color} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="12" height="12" rx="2.5" fill={color} />
      </svg>
    );
  }
  if (shape === "diamond") {
    return (
      <svg {...common}>
        <path d="M9 2.2 15.8 9 9 15.8 2.2 9Z" fill={color} />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg {...common}>
        <path d="M9 2.4 16.2 15.2H1.8Z" fill={color} />
      </svg>
    );
  }
  if (shape === "oval") {
    return (
      <svg {...common}>
        <ellipse cx="9" cy="9" rx="7.2" ry="5.2" fill={color} />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M9 16.2 2.4 3.6h13.2Z" fill={color} />
    </svg>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 62;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  return (
    <div className="flex flex-col items-center sm:items-start">
      <svg viewBox="0 0 160 160" className="h-[132px] w-[132px] md:h-[148px] md:w-[148px]" aria-hidden="true">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#eceff3" strokeWidth="11" />
        <circle
          className="ats-ring"
          cx="80"
          cy="80"
          r={r}
          fill="none"
          stroke="#20FC8F"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform="rotate(-90 80 80)"
          style={
            {
              "--ring-circ": String(circ),
              "--ring-offset": String(offset),
            } as CSSProperties
          }
        />
        <text
          x="80"
          y="76"
          textAnchor="middle"
          fill="#0b0f14"
          fontSize="38"
          fontWeight="700"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          {score}
        </text>
        <text
          x="80"
          y="100"
          textAnchor="middle"
          fill="#5b6470"
          fontSize="12"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          ATS Score
        </text>
      </svg>
      <p className="mt-0.5 text-xs text-[var(--muted)]">On-device Gemini</p>
    </div>
  );
}

function RadarChart({ dimensions }: { dimensions: AtsDimension[] }) {
  const step = 360 / dimensions.length;
  const dataPoints = dimensions.map((d, i) => polar((d.score / 100) * MAX_R, -90 + i * step));
  const dataPoly = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const labelR = MAX_R + 22;

  return (
    <svg viewBox="0 0 360 280" className="mx-auto h-auto w-full max-w-[300px]" aria-hidden="true">
      {[0.28, 0.52, 0.76, 1].map((scale) => (
        <polygon
          key={scale}
          points={hexPoints(MAX_R * scale, dimensions.length)}
          fill="none"
          stroke="#e4e8ee"
          strokeWidth="1"
        />
      ))}
      {dimensions.map((_, i) => {
        const end = polar(MAX_R, -90 + i * step);
        return (
          <line key={i} x1={CX} y1={CY} x2={end.x} y2={end.y} stroke="#e4e8ee" strokeWidth="1" />
        );
      })}
      <polygon
        className="ats-radar"
        points={dataPoly}
        fill="rgba(32, 252, 143, 0.22)"
        stroke="#20FC8F"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={dimensions[i].label} cx={p.x} cy={p.y} r="3.4" fill={dimensions[i].color} />
      ))}
      {dimensions.map((d, i) => {
        const p = polar(labelR, -90 + i * step);
        const anchor = i === 0 || i === 3 ? "middle" : i === 1 || i === 2 ? "start" : "end";
        return (
          <text
            key={d.label}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill="#3d4652"
            fontSize="11"
            fontFamily="Roboto, system-ui, sans-serif"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export function AtsScoreMock({
  score,
  dimensions,
}: {
  score: number;
  dimensions: AtsDimension[];
}) {
  return (
    <div>
      <p className="sr-only">
        ATS score {score} out of 100.
        {dimensions.map((d) => ` ${d.label} ${d.score}.`).join("")}
      </p>
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
        <div>
          <ScoreRing score={score} />
          <h3 className="mt-5 text-sm font-medium">Overall score breakdown</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {dimensions.map((d) => (
              <li key={d.label} className="flex items-center gap-2 text-sm">
                <ShapeIcon shape={d.shape} color={d.color} />
                <span>{d.label}</span>
                <span className="ml-auto tabular-nums text-[var(--muted)]">{d.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <RadarChart dimensions={dimensions} />
      </div>
    </div>
  );
}
