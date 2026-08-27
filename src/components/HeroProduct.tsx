"use client";

import { useState } from "react";
import { AtsScoreMock, type AtsDimension } from "./AtsScoreMock";

type Column = "Saved" | "Applied" | "Interview";

type Job = {
  id: string;
  title: string;
  column: Column;
  posted: string;
  interested: string;
  score: number;
  dimensions: AtsDimension[];
};

const COLUMNS: Column[] = ["Saved", "Applied", "Interview"];

const JOBS: Job[] = [
  {
    id: "fe",
    title: "Frontend Engineer",
    column: "Saved",
    posted: "2d ago",
    interested: "12 interested",
    score: 72,
    dimensions: [
      { label: "Keywords", score: 75, color: "#3B82F6", shape: "circle" },
      { label: "Experience", score: 70, color: "#EF4444", shape: "square" },
      { label: "Skills", score: 78, color: "#F97316", shape: "diamond" },
      { label: "Formatting", score: 65, color: "#22C55E", shape: "triangle" },
      { label: "Qualifications", score: 80, color: "#C4A574", shape: "oval" },
      { label: "Role fit", score: 68, color: "#8B5CF6", shape: "pennant" },
    ],
  },
  {
    id: "de",
    title: "Data Engineer",
    column: "Saved",
    posted: "4d ago",
    interested: "7 interested",
    score: 64,
    dimensions: [
      { label: "Keywords", score: 62, color: "#3B82F6", shape: "circle" },
      { label: "Experience", score: 71, color: "#EF4444", shape: "square" },
      { label: "Skills", score: 69, color: "#F97316", shape: "diamond" },
      { label: "Formatting", score: 58, color: "#22C55E", shape: "triangle" },
      { label: "Qualifications", score: 74, color: "#C4A574", shape: "oval" },
      { label: "Role fit", score: 60, color: "#8B5CF6", shape: "pennant" },
    ],
  },
  {
    id: "pm",
    title: "Product Manager",
    column: "Applied",
    posted: "1w ago",
    interested: "19 interested",
    score: 81,
    dimensions: [
      { label: "Keywords", score: 84, color: "#3B82F6", shape: "circle" },
      { label: "Experience", score: 80, color: "#EF4444", shape: "square" },
      { label: "Skills", score: 76, color: "#F97316", shape: "diamond" },
      { label: "Formatting", score: 79, color: "#22C55E", shape: "triangle" },
      { label: "Qualifications", score: 85, color: "#C4A574", shape: "oval" },
      { label: "Role fit", score: 82, color: "#8B5CF6", shape: "pennant" },
    ],
  },
];

export function HeroProduct() {
  const [selectedId, setSelectedId] = useState(JOBS[0].id);
  const selected = JOBS.find((job) => job.id === selectedId) ?? JOBS[0];

  return (
    <div className="overflow-hidden rounded-[24px] border border-[var(--line)] bg-white/70 text-left backdrop-blur-sm">
      <div className="grid gap-8 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Kanban
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            {COLUMNS.map((col) => (
              <div key={col}>
                <p className="mb-2 font-medium">{col}</p>
                <div className="space-y-2">
                  {JOBS.filter((job) => job.column === col).map((job) => {
                    const active = job.id === selected.id;
                    return (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => setSelectedId(job.id)}
                        className={`w-full rounded-xl border px-2.5 py-2.5 text-left transition-colors ${
                          active
                            ? "border-[#20FC8F] bg-[#20FC8F]/15"
                            : "border-[var(--line)] bg-white/80 hover:border-black/20"
                        }`}
                      >
                        <span className="block font-medium leading-snug">{job.title}</span>
                        <span className="mt-1 block text-[11px] text-[var(--muted)]">
                          ATS {job.score}
                        </span>
                      </button>
                    );
                  })}
                  {JOBS.filter((job) => job.column === col).length === 0 ? (
                    <div className="h-14 rounded-xl border border-dashed border-[var(--line)] bg-white/50" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
            Indeed and Seek card chips
          </p>
          <p className="mt-4 text-sm font-medium">{selected.title}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-black px-3 py-1 text-xs text-[#20FC8F]">
              {selected.posted}
            </span>
            <span className="rounded-full bg-[#FDB833]/20 px-3 py-1 text-xs">
              {selected.interested}
            </span>
            <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs">
              ATS {selected.score}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] px-5 py-6 md:px-8 md:py-7">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
          ATS score
        </p>
        <AtsScoreMock key={selected.id} score={selected.score} dimensions={selected.dimensions} />
      </div>
    </div>
  );
}
