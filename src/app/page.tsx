import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";
import { ModelCard } from "@/components/ModelCard";
import { CATEGORIES, MODELS } from "@/lib/models";

export default function Home() {
  const featured = [...MODELS].sort((a, b) => b.sales - a.sales).slice(0, 8);
  return (
    <>
      <section className="bg-gradient-to-b from-rose-50 to-neutral-50">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
            Il volto giusto per i tuoi contenuti AI
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Cerca tra modelli reali e acquista la licenza per usare la loro immagine con l&apos;intelligenza
            artificiale. Legale, tracciata e approvata dal modello.
          </p>
          <div className="mt-8">
            <SearchBar large />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                href={`/search?category=${encodeURIComponent(c)}`}
                className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-sm text-neutral-700 hover:border-neutral-900"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900">I più richiesti</h2>
          <Link href="/search" className="text-sm text-neutral-600 hover:text-neutral-900">
            Vedi tutti →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-semibold text-neutral-900">Come funziona</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["1. Cerca", "Descrivi il modello che ti serve: look, età, città, categoria."],
            ["2. Scegli la licenza", "Base, Standard o Premium in base a utilizzi, durata e territorio."],
            ["3. Genera", "Ricevi il pacchetto di training e il contratto firmato per usare il volto con l'AI."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
