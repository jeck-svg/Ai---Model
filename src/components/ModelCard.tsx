import Link from "next/link";
import { Avatar } from "./Avatar";
import { euro, minPrice, type Model } from "@/lib/models";

export function ModelCard({ model }: { model: Model }) {
  return (
    <Link
      href={`/models/${model.id}`}
      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <Avatar model={model} className="aspect-[4/5] w-full" label />
      <div className="space-y-2 p-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-neutral-900">{model.name}</h3>
          <span className="text-sm text-neutral-500">
            ★ {model.rating.toFixed(1)} ({model.reviews})
          </span>
        </div>
        <p className="text-sm text-neutral-500">
          {model.age} anni · {model.city}
        </p>
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
              {t}
            </span>
          ))}
        </div>
        <p className="pt-1 text-sm text-neutral-900">
          Licenza AI da <strong>{euro(minPrice(model))}</strong>
        </p>
      </div>
    </Link>
  );
}
