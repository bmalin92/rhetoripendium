export function LaurelSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`h-4 w-4 ${className}`}
      aria-hidden="true"
    >
      <path d="M12 21V5" />
      <path d="M12 7c-2-2-5-2-6 0 1 2 4 2 6 0" />
      <path d="M12 10c-2-2-5-2-6 0 1 2 4 2 6 0" />
      <path d="M12 13c-2-2-5-2-6 0 1 2 4 2 6 0" />
      <path d="M12 7c2-2 5-2 6 0-1 2-4 2-6 0" />
      <path d="M12 10c2-2 5-2 6 0-1 2-4 2-6 0" />
      <path d="M12 13c2-2 5-2 6 0-1 2-4 2-6 0" />
    </svg>
  );
}
