"use client";

import { useEffect, useRef, useState } from "react";
import { IconCheckCircle } from "./icons";

const GAP = 24;
const ORIGIN = GAP / 2;
const HOLE_W = 28;
const LINE_PAD = 10;
const DESKTOP_MQ = "(min-width: 1024px)";
const POINTER_MQ = "(hover: hover) and (pointer: fine)";

const FEATURES = [
  "Copied JD",
  "Number of applicants",
  "Salary revealed",
  "Date published",
  "Job saved",
  "Job hidden",
  "ATS scored",
];

type Phase = "hole" | "open" | "up" | "hit" | "down";

type Mole = {
  id: number;
  x: number;
  y: number;
  phase: Phase;
};

type Strike = {
  id: number;
  label: string;
  x: number;
  y: number;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

function MoleSprite() {
  return (
    <svg className="footer-mole-sprite" viewBox="0 0 48 56" aria-hidden>
      <ellipse cx="24" cy="26" rx="13" ry="17" fill="#9a675f" />
      <ellipse cx="24" cy="22" rx="9" ry="11" fill="#c4887d" />
      <ellipse cx="16" cy="18" rx="2.2" ry="1.6" fill="#8a564f" />
      <ellipse cx="32" cy="18" rx="2.2" ry="1.6" fill="#8a564f" />
      <ellipse cx="24" cy="36" rx="5.2" ry="10" fill="#c9958c" />
      <ellipse cx="24" cy="43" rx="3.4" ry="5.2" fill="#e8b8ae" />
      <ellipse cx="24" cy="47.2" rx="1.5" ry="1.3" fill="#6b3530" />
      <circle cx="18.5" cy="24" r="1.15" fill="#2a1816" />
      <circle cx="29.5" cy="24" r="1.15" fill="#2a1816" />
      <g stroke="#e8c4ba" strokeWidth="1.35" strokeLinecap="round">
        <path d="M8 50h8M9.2 50l-1.6-4.2M12 50l-.2-4.6M14.8 50l1.4-4.2" />
        <path d="M32 50h8M33.2 50l-1.4-4.2M36 50l.2-4.6M38.8 50l1.6-4.2" />
      </g>
      <ellipse cx="12" cy="50.5" rx="5" ry="2.4" fill="#9a675f" />
      <ellipse cx="36" cy="50.5" rx="5" ry="2.4" fill="#9a675f" />
    </svg>
  );
}

export function FooterWhackAMole() {
  const layerRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const gen = useRef(0);
  const lastCell = useRef<string | null>(null);
  const deck = useRef(shuffle(FEATURES));
  const deckI = useRef(0);
  const timers = useRef<number[]>([]);
  const spawnRef = useRef<() => void>(() => {});
  const moleRef = useRef<Mole | null>(null);
  const [mole, setMole] = useState<Mole | null>(null);
  const [strikes, setStrikes] = useState<Strike[]>([]);

  const setMoleBoth = (next: Mole | null) => {
    moleRef.current = next;
    setMole(next);
  };

  useEffect(() => {
    const layer = layerRef.current;
    const footer = layer?.closest("footer");
    if (!layer || !footer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const desktopMq = window.matchMedia(DESKTOP_MQ);
    const pointerMq = window.matchMedia(POINTER_MQ);

    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
    };

    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const stopGame = () => {
      hovering.current = false;
      gen.current += 1;
      clearTimers();
      setMoleBoth(null);
    };

    const isDesktopPlay = () => desktopMq.matches && pointerMq.matches;

    const pickCell = () => {
      const rect = footer.getBoundingClientRect();
      const disclaimer = footer.lastElementChild as HTMLElement | null;
      const disclaimerTop = disclaimer?.offsetTop ?? rect.height;
      const colW = rect.width / 4;
      const vLines = [0, colW, colW * 2, colW * 3, rect.width];
      const hLines = [0, disclaimerTop, rect.height];
      const clearX = HOLE_W / 2 + LINE_PAD;
      const clearY = HOLE_W / 2 + LINE_PAD;
      const tooClose = (x: number, y: number) =>
        vLines.some((line) => Math.abs(x - line) < clearX) ||
        hLines.some((line) => Math.abs(y - line) < clearY);

      const cols = Math.max(3, Math.floor((rect.width - ORIGIN) / GAP));
      const rows = Math.max(3, Math.floor((rect.height - ORIGIN) / GAP));
      const minRow = Math.max(1, Math.floor(rows * 0.38));
      const maxRow = Math.max(minRow, rows - 2);

      for (let i = 0; i < 48; i += 1) {
        const col = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
        const row = minRow + Math.floor(Math.random() * (maxRow - minRow + 1));
        const x = ORIGIN + col * GAP;
        const y = ORIGIN + row * GAP;
        const key = `${col},${row}`;
        if (key === lastCell.current) continue;
        if (tooClose(x, y)) continue;
        lastCell.current = key;
        return { x, y };
      }

      return {
        x: colW * 1.5,
        y: Math.max(clearY, (disclaimerTop - clearY) * 0.7),
      };
    };

    const spawn = () => {
      if (!hovering.current || !isDesktopPlay()) return;
      const id = ++gen.current;
      const cell = pickCell();
      setMoleBoth({ id, ...cell, phase: "hole" });

      later(() => {
        if (gen.current !== id || !hovering.current) return;
        const current = moleRef.current;
        if (current?.id === id) setMoleBoth({ ...current, phase: "open" });
      }, 30);

      later(() => {
        if (gen.current !== id || !hovering.current) return;
        const current = moleRef.current;
        if (current?.id === id) setMoleBoth({ ...current, phase: "up" });
      }, 340);

      later(() => {
        if (gen.current !== id || !hovering.current) return;
        const current = moleRef.current;
        if (current?.id === id) setMoleBoth({ ...current, phase: "down" });
        later(() => {
          if (gen.current !== id) return;
          setMoleBoth(null);
          later(spawn, 420);
        }, 320);
      }, 2600);
    };

    spawnRef.current = spawn;

    const onEnter = (event: PointerEvent) => {
      if (!isDesktopPlay()) return;
      if (event.pointerType && event.pointerType !== "mouse") return;
      if (hovering.current) return;
      hovering.current = true;
      later(spawn, 380);
    };

    const onLeave = (event: PointerEvent) => {
      if (footer.contains(event.relatedTarget as Node | null)) return;
      stopGame();
    };

    const onBreakpoint = () => {
      if (!isDesktopPlay()) stopGame();
    };

    footer.addEventListener("pointerenter", onEnter);
    footer.addEventListener("pointerleave", onLeave);
    desktopMq.addEventListener("change", onBreakpoint);
    pointerMq.addEventListener("change", onBreakpoint);
    return () => {
      stopGame();
      footer.removeEventListener("pointerenter", onEnter);
      footer.removeEventListener("pointerleave", onLeave);
      desktopMq.removeEventListener("change", onBreakpoint);
      pointerMq.removeEventListener("change", onBreakpoint);
    };
  }, []);

  const whack = () => {
    const current = moleRef.current;
    if (!current || current.phase !== "up") return;

    gen.current += 1;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (deckI.current >= deck.current.length) {
      deck.current = shuffle(FEATURES);
      deckI.current = 0;
    }
    const label = deck.current[deckI.current] ?? FEATURES[0]!;
    deckI.current += 1;

    const strikeId = current.id;
    setMoleBoth({ ...current, phase: "hit" });
    setStrikes((items) => [
      ...items,
      { id: strikeId, label, x: current.x, y: current.y },
    ]);

    const fadeToast = window.setTimeout(() => {
      setStrikes((items) => items.filter((item) => item.id !== strikeId));
    }, 2200);
    timers.current.push(fadeToast);

    const hideMole = window.setTimeout(() => {
      setMoleBoth(null);
      if (!hovering.current || !window.matchMedia(DESKTOP_MQ).matches) return;
      const again = window.setTimeout(() => spawnRef.current(), 360);
      timers.current.push(again);
    }, 380);
    timers.current.push(hideMole);
  };

  return (
    <div ref={layerRef} className="footer-mole-layer">
      {mole ? (
        <div
          className={`footer-mole is-${mole.phase}`}
          style={{ left: mole.x, top: mole.y }}
        >
          <div className="footer-mole-hole" />
          <div className="footer-mole-clip">
            <MoleSprite />
          </div>
          <button
            type="button"
            className="footer-mole-hit"
            aria-label="Whack the mole"
            disabled={mole.phase !== "up"}
            onClick={whack}
          />
        </div>
      ) : null}
      {strikes.map((strike) => (
        <p
          key={strike.id}
          className="footer-strike"
          style={{ left: strike.x, top: strike.y }}
          role="status"
        >
          <span className="footer-strike-check">
            <IconCheckCircle className="h-3.5 w-3.5" />
          </span>
          {strike.label}
        </p>
      ))}
    </div>
  );
}
