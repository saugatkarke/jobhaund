type IconProps = { className?: string };

function strokeProps(className?: string) {
  return {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  };
}

export function IconMetrics({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M4 19V11M10 19V7M16 19v-5M22 19H2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <rect x="8" y="8" width="12" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M16 8V5.5A2.5 2.5 0 0 0 13.5 3h-7A2.5 2.5 0 0 0 4 5.5v10A2.5 2.5 0 0 0 6.5 18H8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconKanban({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <rect x="3" y="4" width="5.5" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="9.25" y="4" width="5.5" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="15.5" y="4" width="5.5" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconEyeOff({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M3 3l18 18M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-4.4M9.9 5.2A10.5 10.5 0 0 1 12 5c5.2 0 9.1 4 10.5 7-.5 1-1.2 2-2.1 2.9M6.1 6.1C4.4 7.3 3 8.9 1.5 12c1.4 3 5.3 7 10.5 7 1.4 0 2.7-.3 3.9-.8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconScan({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M8 4H6a2 2 0 0 0-2 2v2M16 4h2a2 2 0 0 1 2 2v2M8 20H6a2 2 0 0 1-2-2v-2M16 20h2a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M12 4v11M8 11l4 4 4-4M5 19h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUser({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 19a7 7 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconChevronUp({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M6 14.5 12 8.5l6 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevronDown({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M6 9.5 12 15.5l6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconExternal({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M14 5h5v5M19 5l-8 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 6H7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconStar({
  className,
  gradient,
}: IconProps & { gradient?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={gradient ? "url(#theme-star-gradient)" : "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {gradient ? (
        <defs>
          <linearGradient
            id="theme-star-gradient"
            x1="4"
            y1="2"
            x2="20"
            y2="22"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--mint)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
      ) : null}
      <path d="M12 2.5 14.6 8.4l6.4.9-4.7 4.5 1.1 6.4L12 17.3 6.6 20.2l1.1-6.4-4.7-4.5 6.4-.9L12 2.5Z" />
    </svg>
  );
}

export function IconShield({ className }: IconProps) {
  return (
    <svg {...strokeProps(className)}>
      <path
        d="M12 3.5 19 7v5.2c0 4.2-2.8 7.2-7 8.3-4.2-1.1-7-4.1-7-8.3V7l7-3.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.2 11 14l3.8-4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
