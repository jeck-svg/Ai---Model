import type { Model } from "@/lib/models";

// Placeholder portrait until real photos are uploaded by the models.
export function Avatar({ model, className = "" }: { model: Model; className?: string }) {
  const [from, to] = model.palette;
  const initials = model.name
    .split(" ")
    .map((p) => p[0])
    .join("");
  return (
    <div
      className={`flex items-center justify-center text-white font-semibold ${className}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      aria-hidden
    >
      <span className="text-4xl tracking-wide opacity-90">{initials}</span>
    </div>
  );
}
