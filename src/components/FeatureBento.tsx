import type { ReactNode } from "react";
import { AtsScoreMock } from "./AtsScoreMock";
import { CardStack } from "./CardStack";
import { IconEyeOff, IconSaveTrackOrbit } from "./icons";
import { JobFlowSankey } from "./JobFlowSankey";

const ATS_DIMENSIONS = [
  { label: "Keywords", score: 75, color: "#3B82F6", shape: "circle" as const },
  {
    label: "Experience",
    score: 70,
    color: "#EF4444",
    shape: "square" as const,
  },
  { label: "Skills", score: 78, color: "#F97316", shape: "diamond" as const },
  {
    label: "Formatting",
    score: 65,
    color: "#22C55E",
    shape: "triangle" as const,
  },
  {
    label: "Qualifications",
    score: 80,
    color: "#C4A574",
    shape: "oval" as const,
  },
  { label: "Role fit", score: 68, color: "#8B5CF6", shape: "pennant" as const },
];

function ProPill() {
  return (
    <span className="rounded-[4px] bg-black px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#20FC8F]">
      Pro
    </span>
  );
}

function Tile({
  title,
  body,
  titleIcon,
  pro,
  className = "",
  wellClassName = "h-full overflow-hidden rounded-[4px] bg-[#f4f6f8] p-3",
  decorative = true,
  children,
}: {
  title: string;
  body: string;
  titleIcon?: ReactNode;
  pro?: boolean;
  className?: string;
  wellClassName?: string;
  decorative?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={`flex h-full min-h-0 flex-col overflow-hidden rounded-[4px] border border-[var(--line)] bg-white ${className}`}
    >
      <div className="px-5 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2">
            {titleIcon ? (
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-black">
                {titleIcon}
              </span>
            ) : null}
            <h3 className="font-medium">{title}</h3>
          </div>
          {pro ? <ProPill /> : null}
        </div>
        <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
          {body}
        </p>
      </div>
      <div
        className="mt-4 min-h-0 flex-1 px-5 pb-5"
        {...(decorative ? { "aria-hidden": true as const } : {})}
      >
        <div className={wellClassName}>{children}</div>
      </div>
    </article>
  );
}

function Chip({
  tone,
  children,
}: {
  tone: "date" | "interest" | "salary" | "muted";
  children: ReactNode;
}) {
  const tones = {
    date: "bg-black text-[#20FC8F]",
    interest: "bg-[#FDB833]/25 text-black",
    salary: "bg-[#20FC8F]/30 text-black",
    muted: "border border-[var(--line)] bg-white text-[var(--muted)]",
  };
  return (
    <span
      className={`rounded-[4px] px-2 py-1 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function ListingCard({
  title,
  meta,
  chips,
  faded,
  action,
}: {
  title: string;
  meta: string;
  chips?: ReactNode;
  faded?: boolean;
  action?: ReactNode;
}) {
  return (
    <div
      className={`rounded-[4px] border border-[var(--line)] bg-white px-3 py-3 ${
        faded ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="mt-0.5 text-[11px] text-[var(--muted)]">{meta}</p>
        </div>
        {action}
      </div>
      {chips ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">{chips}</div>
      ) : null}
    </div>
  );
}

function HideMock() {
  return (
    <div className="space-y-2">
      <ListingCard
        title="Data Engineer"
        meta="Indeed · Sydney"
        chips={<Chip tone="date">4d ago</Chip>}
        action={
          <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] bg-black px-2 py-1 text-[11px] text-white">
            <IconEyeOff className="h-3 w-3" />
            Hide
          </span>
        }
      />
      <ListingCard
        title="Product Manager"
        meta="Seek · Melbourne"
        faded
        chips={<Chip tone="muted">Hidden</Chip>}
      />
    </div>
  );
}

export function FeatureBento() {
  return (
    <div className="grid gap-3 md:grid-cols-12">
      <Tile
        className="min-h-[460px] md:col-span-8 md:row-span-2"
        wellClassName="h-full overflow-hidden"
        title="Save and track"
        titleIcon={<IconSaveTrackOrbit className="h-5 w-5" />}
        body="Save a role and move it Saved → Applied → Interview. Stored in your browser, not our servers."
      >
        <JobFlowSankey />
      </Tile>

      <Tile
        className="min-h-[220px] md:col-span-4"
        pro
        title="Hide jobs"
        body="Clear cards you do not want. They stay gone until you unhide."
      >
        <HideMock />
      </Tile>

      <Tile
        className="min-h-[220px] md:col-span-4"
        pro
        title="ATS scoring"
        body="Score a locally stored resume against the JD. On-device Gemini."
      >
        <div className="rounded-[4px] border border-[var(--line)] bg-white p-3">
          <AtsScoreMock compact score={72} dimensions={ATS_DIMENSIONS} />
        </div>
      </Tile>

      <Tile
        className="min-h-[220px] md:col-span-4"
        title="Salary reveal"
        body="Uncover pay on Indeed and Seek cards when the listing hides it."
        decorative={false}
      >
        <CardStack label="Example salary listings">
          <ListingCard
            title="Frontend Engineer"
            meta="Seek · Melbourne"
            chips={
              <>
                <span className="text-[11px] text-[var(--muted)] line-through">
                  Salary not listed
                </span>
                <Chip tone="salary">$128k–$145k</Chip>
              </>
            }
          />
          <ListingCard
            title="Data Engineer"
            meta="Indeed · Sydney"
            chips={<Chip tone="salary">$110k–$130k</Chip>}
          />
          <ListingCard
            title="Product Manager"
            meta="Seek · Auckland"
            chips={<Chip tone="salary">$140k–$165k</Chip>}
          />
        </CardStack>
      </Tile>

      <Tile
        className="min-h-[220px] md:col-span-4"
        title="Applicants"
        body="See how many people are already interested before you apply."
        decorative={false}
      >
        <CardStack label="Example applicant counts">
          <ListingCard
            title="Frontend Engineer"
            meta="Indeed · Brisbane"
            chips={<Chip tone="interest">12 interested</Chip>}
          />
          <ListingCard
            title="Data Engineer"
            meta="Seek · Sydney"
            chips={<Chip tone="interest">7 interested</Chip>}
          />
          <ListingCard
            title="Product Manager"
            meta="Indeed · Melbourne"
            chips={<Chip tone="interest">19 interested</Chip>}
          />
        </CardStack>
      </Tile>

      <Tile
        className="min-h-[220px] md:col-span-4"
        title="Date published"
        body="Know if a role is two days old or two weeks old."
        decorative={false}
      >
        <CardStack label="Example published dates">
          <ListingCard
            title="Frontend Engineer"
            meta="Indeed · Auckland"
            chips={<Chip tone="date">2d ago</Chip>}
          />
          <ListingCard
            title="Data Engineer"
            meta="Seek · Wellington"
            chips={<Chip tone="date">4d ago</Chip>}
          />
          <ListingCard
            title="Product Manager"
            meta="Indeed · Perth"
            chips={<Chip tone="date">1w ago</Chip>}
          />
        </CardStack>
      </Tile>
    </div>
  );
}
