"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

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

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -48px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function ScoreRing({
  score,
  compact,
  active,
}: {
  score: number;
  compact?: boolean;
  active: boolean;
}) {
  const r = 62;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(score);
      return;
    }

    let raf = 0;
    let start = 0;
    const duration = 1150;
    const delay = 150;

    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(Math.max((now - start - delay) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(Math.round(eased * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, score]);

  return (
    <div className={compact ? "" : "flex flex-col items-center sm:items-start"}>
      <svg
        viewBox="0 0 160 160"
        className={compact ? "h-[88px] w-[88px]" : "h-[132px] w-[132px] md:h-[148px] md:w-[148px]"}
        aria-hidden="true"
      >
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
          y="80"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#0b0f14"
          fontSize="38"
          fontWeight="700"
          fontFamily="Roboto, system-ui, sans-serif"
        >
          {display}
        </text>
      </svg>
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
  compact = false,
}: {
  score: number;
  dimensions: AtsDimension[];
  compact?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const scopeClass = inView ? "ats-scope is-in-view" : "ats-scope";

  const summary = (
    <p className="sr-only">
      ATS score {score} out of 100.
      {dimensions.map((d) => ` ${d.label} ${d.score}.`).join("")}
    </p>
  );

  if (compact) {
    const rows = dimensions.slice(0, 4);
    return (
      <div ref={ref} className={scopeClass}>
        {summary}
        <div className="flex items-center gap-3">
          <ScoreRing score={score} compact active={inView} />
          <ul className="min-w-0 flex-1 space-y-1.5">
            {rows.map((d, i) => (
              <li
                key={d.label}
                className="ats-row flex items-center gap-2 text-xs"
                style={{ "--row-i": i } as CSSProperties}
              >
                <ShapeIcon shape={d.shape} color={d.color} />
                <span className="truncate">{d.label}</span>
                <span className="ml-auto tabular-nums text-[var(--muted)]">{d.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={scopeClass}>
      {summary}
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
        <div>
          <ScoreRing score={score} active={inView} />
          <h3 className="mt-5 text-sm font-medium">Overall score breakdown</h3>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {dimensions.map((d, i) => (
              <li
                key={d.label}
                className="ats-row flex items-center gap-2 text-sm"
                style={{ "--row-i": i } as CSSProperties}
              >
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
