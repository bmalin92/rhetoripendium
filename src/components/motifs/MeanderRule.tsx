"use client";

import { useId } from "react";

export function MeanderRule({ className = "" }: { className?: string }) {
  const patternId = useId();
  return (
    <svg
      viewBox="0 0 80 10"
      preserveAspectRatio="none"
      className={`h-3 w-full text-gold ${className}`}
      aria-hidden="true"
    >
      <pattern id={patternId} width="20" height="10" patternUnits="userSpaceOnUse">
        <path d="M0 9H6V3H14V7H20" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </pattern>
      <rect width="80" height="10" fill={`url(#${patternId})`} />
    </svg>
  );
}
