import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { LicenseOptions } from "@/components/LicenseOptions";
import { PolaroidGallery } from "@/components/PolaroidGallery";
import { getModel, modelCode } from "@/lib/models";

export default async function ModelPage(props: PageProps<"/models/[id]">) {
  const { id } = await props.params;
  const model = getModel(id);
  if (!model) notFound();

  const facts = [
    ["Età", `${model.age} anni`],
    ["Città", model.city],
    ["Rating", `★ ${model.rating.toFixed(1)} (${model.reviews})`],
    ["Licenze vendute", String(model.sales)],
  ];

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Avatar
            model={model}
            className="aspect-[4/5] w-full"
            sizes="(min-width: 1024px) 40vw, 100vw"
            label
          />
          <p className="mt-2 flex justify-between text-[11px] tracking-wide text-neutral-500 uppercase">
            <span>{modelCode(model)}</span>
            <span>{model.categories.join(" / ")}</span>
          </p>
        </div>

        <div>
          <Link
            href="/search"
            className="link-u text-xs tracking-wide uppercase"
          >
            ← Torna ai risultati
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900 sm:text-7xl">
            {model.name}
          </h1>

          <dl className="mt-6 grid grid-cols-2 border-t border-neutral-200 text-xs uppercase sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="border-b border-neutral-200 py-3 pr-3">
                <dt className="text-neutral-500">{k}</dt>
                <dd className="mt-1 text-neutral-900">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-neutral-700">
            {model.bio}
          </p>
          <p className="mt-4 text-xs text-neutral-500">
            {model.tags.join(" / ")}
          </p>

          <h2 className="mt-10 text-xs tracking-wide text-neutral-500 uppercase">
            FIG. 02. — Scegli la licenza AI
          </h2>
          <LicenseOptions modelId={model.id} licenses={model.licenses} />
        </div>
      </div>
      <PolaroidGallery model={model} />
    </>
  );
}
