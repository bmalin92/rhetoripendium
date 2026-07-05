export function ColumnGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`h-5 w-5 ${className}`}
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="2" />
      <rect x="5" y="19" width="14" height="2" />
      <rect x="3" y="21" width="18" height="1.5" />
      <rect x="6" y="5" width="1.6" height="13" />
      <rect x="9.5" y="5" width="1.6" height="13" />
      <rect x="13" y="5" width="1.6" height="13" />
      <rect x="16.4" y="5" width="1.6" height="13" />
    </svg>
  );
}
