import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { ModelCard } from "@/components/ModelCard";
import { CATEGORIES, MODELS } from "@/lib/models";

const TIERS = [
  ["Base", "6 mesi · Italia", "Social media organici e contenuti web, fino a 50 immagini AI."],
  ["Standard", "12 mesi · Europa", "Social e ads, e-commerce e newsletter, fino a 500 immagini e 10 video."],
  ["Premium", "24 mesi · Mondo", "Campagne ADV, TV, cinema e out of home, generazioni illimitate."],
];

export default function Home() {
  const featured = [...MODELS].sort((a, b) => b.sales - a.sales).slice(0, 8);
  return (
    <>
      <Hero />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <div className="flex flex-wrap justify-center gap-2">
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
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-neutral-900">I più richiesti</h2>
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

        <section id="come-funziona" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-12">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-neutral-900">Come funziona</h2>
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

        <section id="licenze" className="mx-auto max-w-6xl scroll-mt-8 px-4 pb-16">
          <h2 className="mb-6 font-[family-name:var(--font-display)] text-3xl text-neutral-900">Le licenze AI</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {TIERS.map(([name, scope, text]) => (
              <div key={name} className="rounded-2xl border border-neutral-200 bg-white p-6">
                <h3 className="font-semibold text-neutral-900">{name}</h3>
                <p className="mt-1 text-sm font-medium text-rose-600">{scope}</p>
                <p className="mt-2 text-sm text-neutral-600">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
