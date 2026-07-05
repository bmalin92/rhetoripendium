export function GoldRule({
  orientation = "horizontal",
  className = "",
}: {
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  if (orientation === "vertical") {
    return <div className={`w-px self-stretch bg-gold ${className}`} />;
  }
  return <div className={`h-px w-full bg-gold ${className}`} />;
}
