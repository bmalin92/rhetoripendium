export function LessonStatusSeal({ completed }: { completed: boolean }) {
  return (
    <div
      role="img"
      aria-label={completed ? "Lesson completed" : "Lesson not started"}
      title={completed ? "Completed" : "Not started"}
      className={`absolute -right-3 -top-3 z-10 flex h-10 w-10 shrink-0 rotate-6 items-center justify-center rounded-full shadow-md transition-transform duration-200 ease-out group-hover:rotate-0 group-hover:scale-105 group-hover:border-trevi ${
        completed
          ? "border-2 border-trevi bg-trevi text-background"
          : "border-2 border-dashed border-border bg-surface text-muted"
      }`}
    >
      {completed ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M4 12.5 9.5 18 20 6" />
        </svg>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-trevi" aria-hidden="true" />
      )}
    </div>
  );
}
