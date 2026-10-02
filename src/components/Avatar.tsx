import Image from "next/image";
import type { Model } from "@/lib/models";
import photos from "@/lib/model-photos.json";

const withPhoto = new Set<string>(photos);

// Demo portrait: an AI-generated photo when available (scripts/generate-model-photos.mjs),
// otherwise a gradient with initials. Real models will upload their own photos.
export function Avatar({
  model,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  label = false,
}: {
  model: Model;
  className?: string;
  sizes?: string;
  label?: boolean;
}) {
  const [from, to] = model.palette;

  if (withPhoto.has(model.id)) {
    return (
      <div className={`relative overflow-hidden bg-neutral-200 ${className}`}>
        <Image
          src={`/models/${model.id}.jpg`}
          alt={`Ritratto di ${model.name}`}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {label && (
          <span className="absolute bottom-2 left-2 bg-black/60 px-1.5 py-0.5 text-[9px] tracking-wide text-white uppercase">
            Immagine AI dimostrativa
          </span>
        )}
      </div>
    );
  }

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
