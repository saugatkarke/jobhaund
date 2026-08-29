"use client";

import { Children, useEffect, useState, type ReactNode } from "react";
import { IconChevronDown, IconChevronUp } from "./icons";

const DURATION_MS = 420;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function CardStack({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const cards = Children.toArray(children).filter(Boolean);
  const count = cards.length;
  const [index, setIndex] = useState(0);
  const [exitDir, setExitDir] = useState<"next" | "prev" | null>(null);

  const displayIndex =
    exitDir === "next"
      ? (index + 1) % count
      : exitDir === "prev"
        ? (index - 1 + count) % count
        : index;

  useEffect(() => {
    if (!exitDir) return;
    const timer = window.setTimeout(() => {
      setIndex(
        exitDir === "next" ? (index + 1) % count : (index - 1 + count) % count
      );
      setExitDir(null);
    }, DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [exitDir, index, count]);

  if (count === 0) return null;

  function go(dir: "next" | "prev") {
    if (exitDir || count < 2) return;
    if (prefersReducedMotion()) {
      setIndex((current) =>
        dir === "next" ? (current + 1) % count : (current - 1 + count) % count
      );
      return;
    }
    setExitDir(dir);
  }

  return (
    <div className="overflow-hidden pb-4 pr-3" role="group" aria-label={label}>
      <div className="flex items-center gap-2">
        <div className="relative z-[4] flex shrink-0 flex-col gap-1">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[var(--line)] bg-white text-black hover:bg-neutral-50 disabled:opacity-40"
            aria-label="Previous card"
            disabled={Boolean(exitDir)}
            onClick={() => go("prev")}
          >
            <IconChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[var(--line)] bg-white text-black hover:bg-neutral-50 disabled:opacity-40"
            aria-label="Next card"
            disabled={Boolean(exitDir)}
            onClick={() => go("next")}
          >
            <IconChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="invisible" aria-hidden="true">
            {cards[displayIndex]}
          </div>
          {cards.map((node, cardIndex) => {
            const exiting = exitDir !== null && cardIndex === index;
            const slot = (cardIndex - displayIndex + count) % count;
            const layerClass = exiting
              ? exitDir === "next"
                ? "card-stack-exit-next"
                : "card-stack-exit-prev"
              : `card-stack-slot-${Math.min(slot, 2)}`;

            return (
              <div
                key={cardIndex}
                className={`card-stack-layer ${layerClass}`}
                aria-hidden={cardIndex !== displayIndex}
              >
                {node}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
