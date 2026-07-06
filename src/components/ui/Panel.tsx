import type { ReactNode } from "react";

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`texture-paper rounded-xl border border-border bg-surface shadow-sm ${className}`}>
      {children}
    </div>
  );
}
