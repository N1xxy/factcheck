import { Party } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PartyMark({
  party,
  size = "md",
}: {
  party: Party;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-bold text-white shadow-sm",
        party.gradientClass,
        size === "sm" && "h-10 w-10 text-sm",
        size === "md" && "h-14 w-14 text-lg",
        size === "lg" && "h-20 w-20 text-2xl",
      )}
      aria-label={`Лого: ${party.name}`}
    >
      {party.logoMark}
    </span>
  );
}
