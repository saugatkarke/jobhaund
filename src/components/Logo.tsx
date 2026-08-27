export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="10" fill="#000" />
      <path d="M8 21V11h3.2v10H8zm13.4-10c2.8 0 4.6 1.8 4.6 4.5S24.2 20 21.4 20H16.8V11h4.6zm0 6.6c1.2 0 1.9-.8 1.9-2.1s-.7-2.1-1.9-2.1h-1.5v4.2h1.5z" fill="#20FC8F" />
    </svg>
  );
}
