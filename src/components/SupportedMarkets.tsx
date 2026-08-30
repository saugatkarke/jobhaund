import { TRUST_LINE } from "@/lib/copy";

type CountryCode = "AU" | "NZ" | "UK" | "CA" | "US";

const COUNTRIES: Record<
  CountryCode,
  { name: string; cut: "canton" | "center" | "fly" }
> = {
  AU: { name: "Australia", cut: "fly" },
  NZ: { name: "New Zealand", cut: "fly" },
  UK: { name: "United Kingdom", cut: "center" },
  CA: { name: "Canada", cut: "center" },
  US: { name: "United States", cut: "canton" },
};

const INDEED_MARKETS: CountryCode[] = ["AU", "NZ", "UK", "CA", "US"];
const SEEK_MARKETS: CountryCode[] = ["AU", "NZ"];

function starPoints(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  points: number
) {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    pts.push(
      `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
    );
  }
  return pts.join(" ");
}

function UnionJack() {
  return (
    <g>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  );
}

function FlagSvg({ country }: { country: CountryCode }) {
  if (country === "UK") {
    return (
      <svg viewBox="0 0 60 30" aria-hidden>
        <UnionJack />
      </svg>
    );
  }

  if (country === "AU") {
    return (
      <svg viewBox="0 0 60 30" aria-hidden>
        <rect width="60" height="30" fill="#012169" />
        <g transform="scale(0.5)">
          <UnionJack />
        </g>
        <polygon
          fill="#fff"
          points={starPoints(15, 22.2, 3.4, 1.35, 7)}
        />
        <polygon fill="#fff" points={starPoints(45, 6.6, 2.15, 0.85, 7)} />
        <polygon fill="#fff" points={starPoints(40, 12.2, 2.15, 0.85, 7)} />
        <polygon fill="#fff" points={starPoints(50.4, 11.4, 2.15, 0.85, 7)} />
        <polygon fill="#fff" points={starPoints(45, 17.6, 2.4, 0.95, 7)} />
        <polygon fill="#fff" points={starPoints(47.4, 13.6, 1.15, 0.45, 7)} />
      </svg>
    );
  }

  if (country === "NZ") {
    return (
      <svg viewBox="0 0 60 30" aria-hidden>
        <rect width="60" height="30" fill="#012169" />
        <g transform="scale(0.5)">
          <UnionJack />
        </g>
        <polygon fill="#fff" points={starPoints(45, 6.4, 2.55, 1.05, 5)} />
        <polygon fill="#C8102E" points={starPoints(45, 6.4, 1.85, 0.75, 5)} />
        <polygon fill="#fff" points={starPoints(39.2, 12.4, 2.35, 0.95, 5)} />
        <polygon fill="#C8102E" points={starPoints(39.2, 12.4, 1.7, 0.7, 5)} />
        <polygon fill="#fff" points={starPoints(51.2, 11.6, 2.35, 0.95, 5)} />
        <polygon fill="#C8102E" points={starPoints(51.2, 11.6, 1.7, 0.7, 5)} />
        <polygon fill="#fff" points={starPoints(45, 18.4, 2.7, 1.1, 5)} />
        <polygon fill="#C8102E" points={starPoints(45, 18.4, 2, 0.8, 5)} />
      </svg>
    );
  }

  if (country === "CA") {
    return (
      <svg viewBox="0 0 60 30" aria-hidden>
        <rect width="60" height="30" fill="#fff" />
        <rect width="15" height="30" fill="#FF0000" />
        <rect x="45" width="15" height="30" fill="#FF0000" />
        <path
          fill="#FF0000"
          d="M30.2 7.1l.9 2.6 2.7-.4-1.5 2.3 2.3 1.6-2.7.6.1 2.7-2.2-1.6-.8 2.6-.7-1.6v2.8h-1.2v-2.8l-.7 1.6-.8-2.6-2.2 1.6.1-2.7-2.7-.6 2.3-1.6-1.5-2.3 2.7.4.9-2.6.8 2.2z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 57 30" aria-hidden>
      <rect width="57" height="30" fill="#B22234" />
      <path
        stroke="#fff"
        strokeWidth="2.31"
        d="M0 4.62h57M0 9.23h57M0 13.85h57M0 18.46h57M0 23.08h57M0 27.69h57"
      />
      <rect width="22.8" height="16.15" fill="#3C3B6E" />
      {Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, col) => {
          const cx = row % 2 === 0 ? 1.9 + col * 3.8 : 3.8 + col * 3.8;
          const cy = 1.35 + row * 1.68;
          return (
            <polygon
              key={`${row}-${col}`}
              fill="#fff"
              points={starPoints(cx, cy, 0.72, 0.28, 5)}
            />
          );
        })
      )}
    </svg>
  );
}

function CountryChip({
  country,
  board,
}: {
  country: CountryCode;
  board: "Indeed" | "Seek";
}) {
  const meta = COUNTRIES[country];
  return (
    <span
      className={`trust-chip flag-cut-${meta.cut}`}
      data-country={country.toLowerCase()}
      title={`${meta.name} on ${board}`}
      tabIndex={0}
    >
      <span className="flag-cut" aria-hidden>
        <FlagSvg country={country} />
      </span>
      <span className="trust-chip-code">{country}</span>
    </span>
  );
}

export function SupportedMarkets() {
  return (
    <div className="trust-markets">
      <p className="sr-only">{TRUST_LINE}</p>
      <span>Works on</span>
      <span className="trust-board">Indeed</span>
      {INDEED_MARKETS.map((country) => (
        <CountryChip
          key={`indeed-${country}`}
          country={country}
          board="Indeed"
        />
      ))}
      <span className="trust-and">and</span>
      <span className="trust-board">Seek</span>
      {SEEK_MARKETS.map((country) => (
        <CountryChip key={`seek-${country}`} country={country} board="Seek" />
      ))}
    </div>
  );
}
