import Image from "next/image";
import type { Model } from "@/lib/models";
import poses from "@/lib/model-poses.json";

// Same order as the prompts used to generate public/models/poses/<id>-<n>.jpg
const POSE_LABELS = ["Figura intera", "Profilo", "Tre quarti", "Seduta", "Spontanea", "Beauty"];
const TILT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-1", "rotate-1"];

const withPoses = new Set<string>(poses);

export function PolaroidGallery({ model }: { model: Model }) {
  if (!withPoses.has(model.id)) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-8">
      <div className="flex items-end justify-between border-t border-neutral-200 pt-8">
        <h2 className="text-xs tracking-wide text-neutral-500 uppercase">FIG. 03. — Pose / Polaroid</h2>
        <p className="text-[11px] tracking-wide text-neutral-400 uppercase">6 scatti · Immagini AI dimostrative</p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {POSE_LABELS.map((label, i) => (
          <figure
            key={label}
            className={`bg-white p-2.5 pb-3 shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200 transition duration-300 hover:z-10 hover:-translate-y-1 hover:scale-105 hover:rotate-0 hover:shadow-[0_16px_40px_rgba(0,0,0,0.18)] ${TILT[i]}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
              <Image
                src={`/models/poses/${model.id}-${i + 1}.jpg`}
                alt={`${model.name} — ${label}`}
                fill
                sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex justify-between text-[10px] tracking-wide text-neutral-500 uppercase">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{label}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
