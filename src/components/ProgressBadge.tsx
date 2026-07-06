export function ProgressBadge({ completed }: { completed: boolean }) {
  return (
    <span
      className={`inline-flex w-28 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        completed
          ? "bg-gold/15 text-gold-hover"
          : "border border-border bg-surface text-muted"
      }`}
    >
      {completed ? "Completed" : "Not started"}
    </span>
  );
}
