"use client";

import { useEffect, useRef } from "react";

const EASE = 0.1;
const EPSILON = 0.001;

const GREEN_REST = { x: 0.12, y: -0.1 };
const AMBER_REST = { x: 0.9, y: 0 };

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Hero band whose green blob follows the pointer on the left half and
 * whose amber blob follows on the right. Blobs travel freely in 2D and
 * stay where they are when the pointer leaves.
 */
export function MeshHero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let running = false;
    const current = {
      gx: GREEN_REST.x,
      gy: GREEN_REST.y,
      ax: AMBER_REST.x,
      ay: AMBER_REST.y,
    };
    const target = { ...current };

    const write = () => {
      el.style.setProperty("--gx", current.gx.toFixed(4));
      el.style.setProperty("--gy", current.gy.toFixed(4));
      el.style.setProperty("--ax", current.ax.toFixed(4));
      el.style.setProperty("--ay", current.ay.toFixed(4));
    };

    const tick = () => {
      current.gx += (target.gx - current.gx) * EASE;
      current.gy += (target.gy - current.gy) * EASE;
      current.ax += (target.ax - current.ax) * EASE;
      current.ay += (target.ay - current.ay) * EASE;
      write();

      const settled =
        Math.abs(target.gx - current.gx) < EPSILON &&
        Math.abs(target.gy - current.gy) < EPSILON &&
        Math.abs(target.ax - current.ax) < EPSILON &&
        Math.abs(target.ay - current.ay) < EPSILON;
      if (settled) {
        current.gx = target.gx;
        current.gy = target.gy;
        current.ax = target.ax;
        current.ay = target.ay;
        write();
        running = false;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const mx = clamp01((e.clientX - rect.left) / (rect.width || 1));
      const my = clamp01((e.clientY - rect.top) / (rect.height || 1));
      const right = smoothstep(0.32, 0.68, mx);
      const left = 1 - right;

      // Only the active side tracks the cursor; the other blob keeps its last position.
      target.gx += (mx - target.gx) * left;
      target.gy += (my - target.gy) * left;
      target.ax += (mx - target.ax) * right;
      target.ay += (my - target.ay) * right;
      start();
    };

    el.addEventListener("pointermove", onPointerMove);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="mesh-hero col-span-12">
      {children}
    </div>
  );
}
