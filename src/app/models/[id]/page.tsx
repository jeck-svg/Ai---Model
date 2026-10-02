import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { euro, getModel } from "@/lib/models";

export default async function ModelPage(props: PageProps<"/models/[id]">) {
  const { id } = await props.params;
  const model = getModel(id);
  if (!model) notFound();

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <Avatar model={model} className="aspect-[4/5] w-full rounded-2xl" />
      </div>

      <div>
        <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Torna ai risultati
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900">{model.name}</h1>
        <p className="mt-1 text-neutral-600">
          {model.age} anni · {model.city} · ★ {model.rating.toFixed(1)} ({model.reviews} recensioni) ·{" "}
          {model.sales} licenze vendute
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[...model.categories, ...model.tags].map((t) => (
            <span key={t} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-5 leading-relaxed text-neutral-700">{model.bio}</p>

        <h2 className="mt-8 text-xl font-semibold text-neutral-900">Scegli la licenza AI</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {model.licenses.map((l) => (
            <div
              key={l.tier}
              className={`flex flex-col rounded-2xl border bg-white p-5 ${
                l.tier === "standard" ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">{l.name}</h3>
                {l.tier === "standard" && (
                  <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">Consigliata</span>
                )}
              </div>
              <p className="mt-2 text-2xl font-bold text-neutral-900">{euro(l.price)}</p>
              <ul className="mt-3 flex-1 space-y-1.5 text-sm text-neutral-600">
                <li>⏱ {l.durationMonths} mesi</li>
                <li>🌍 {l.territory}</li>
                <li>🖼 {l.generations}</li>
                {l.usages.map((u) => (
                  <li key={u}>✓ {u}</li>
                ))}
              </ul>
              <Link
                href={`/checkout?model=${model.id}&tier=${l.tier}`}
                className="mt-5 rounded-full bg-neutral-900 py-2.5 text-center text-sm font-medium text-white hover:bg-neutral-700"
              >
                Acquista diritti AI
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
