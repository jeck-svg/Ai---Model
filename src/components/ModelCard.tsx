import Link from "next/link";
import { Avatar } from "./Avatar";
import { euro, minPrice, modelCode, type Model } from "@/lib/models";

export function ModelCard({ model }: { model: Model }) {
  return (
    <Link href={`/models/${model.id}`} className="group block bg-white">
      <div className="overflow-hidden bg-neutral-100">
        <Avatar
          model={model}
          className="aspect-[4/5] w-full grayscale transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
          label
        />
      </div>
      <div className="space-y-2 border-b border-neutral-200 py-3">
        <div className="flex items-baseline justify-between text-[11px] tracking-wide text-neutral-500 uppercase">
          <span>{modelCode(model)}</span>
          <span>
            ★ {model.rating.toFixed(1)} ({model.reviews})
          </span>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-xl font-medium tracking-tight text-neutral-900">
          {model.name}
        </h3>
        <p className="text-xs text-neutral-500 uppercase">
          {model.age} anni · {model.city}
        </p>
        <p className="text-xs text-neutral-500">{model.tags.slice(0, 3).join(" / ")}</p>
        <p className="flex items-baseline justify-between pt-1 text-xs uppercase">
          <span className="text-neutral-500">Licenza AI da</span>
          <span className="font-medium text-neutral-900">{euro(minPrice(model))}</span>
        </p>
      </div>
    </Link>
  );
}
