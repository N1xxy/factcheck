export function SupportMeter({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`Позиция ${value} от 5`}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={
            index < value
              ? "h-2.5 w-6 rounded-full bg-cyan-500"
              : "h-2.5 w-6 rounded-full bg-slate-200"
          }
        />
      ))}
    </div>
  );
}
