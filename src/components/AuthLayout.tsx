import type { ReactNode } from "react";
import { IconCheckCircle } from "./icons";
import { GridBand } from "./PageGrid";

export function AuthLayout({
  eyebrow,
  title,
  description,
  notes,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  notes?: string[];
  children: ReactNode;
}) {
  return (
    <GridBand
      as="section"
      className="border-b border-[var(--line)] md:h-full"
    >
      <div className="mesh-hero col-span-12 flex flex-col justify-center px-5 py-14 md:col-span-6 md:px-8 md:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--muted)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-md text-[var(--muted)]">{description}</p>
        {notes?.length ? (
          <ul className="mt-8 max-w-md space-y-3">
            {notes.map((note) => (
              <li key={note} className="flex items-start gap-2.5 text-sm">
                <IconCheckCircle className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[var(--mint)]" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <div className="col-span-12 flex flex-col justify-center border-t border-[var(--line)] bg-white px-5 py-14 md:col-span-6 md:border-l md:border-t-0 md:px-8 md:py-16">
        {children}
      </div>
    </GridBand>
  );
}
