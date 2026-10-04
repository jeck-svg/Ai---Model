import Image from "next/image";
import Link from "next/link";
import { getModels } from "@/lib/catalog";
import { modelCode, type Model } from "@/lib/models";
import { MatchingSearchForm } from "./MatchingSearchForm";
import { NavPill } from "./NavPill";

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
    <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Esplora" },
  { href: "#come-funziona", label: "Come funziona" },
  { href: "#licenze", label: "Licenze" },
];

// Side cards fan out around the featured face, tilted towards the centre like the reference.
const SIDE_CARDS = [
  { id: "sofia-l", className: "hidden xl:flex w-44 h-60 [transform:rotateY(28deg)]" },
  { id: "aisha-k", className: "hidden md:flex w-52 h-72 [transform:rotateY(22deg)]" },
  { id: "luca-m", className: "hidden md:flex w-52 h-72 [transform:rotateY(-22deg)]" },
  { id: "alex-p", className: "hidden xl:flex w-44 h-60 [transform:rotateY(-28deg)]" },
];

// Polaroid-style card: white frame with a wider bottom strip carrying the caption.
function SideCard({ model, className }: { model: Model; className: string }) {
  return (
    <Link
      href={`/models/${model.id}`}
      className={`group relative shrink-0 flex-col bg-white p-2 pb-0 shadow-[0_10px_30px_rgba(0,0,0,0.14)] ring-1 ring-neutral-200 transition duration-500 hover:[transform:rotateY(0deg)_scale(1.04)] ${className}`}
    >
      <div className="relative flex-1 overflow-hidden bg-neutral-100">
        <Image src={`/models/${model.id}.jpg`} alt={`Ritratto di ${model.name}`} fill sizes="220px" className="object-cover" />
      </div>
      <span className="flex h-9 items-center justify-between text-[10px] tracking-wide text-neutral-500 uppercase">
        <span>{model.name}</span>
        <span>{modelCode(model)}</span>
      </span>
    </Link>
  );
}

export async function Hero() {
  const models = await getModels();
  const byId = (id: string) => models.find((m) => m.id === id);
  // Fall back to the first model if the featured one is removed from the catalogue.
  const featured = byId("giulia-r") ?? models[0];
  const side = SIDE_CARDS.flatMap((c) => {
    const model = byId(c.id);
    return model ? [{ ...c, model }] : [];
  });

  return (
    <section className="corner-marks relative isolate overflow-hidden bg-white text-neutral-900">
      {/* Giant faded wordmark behind the cards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-6 -z-10 select-none text-center font-[family-name:var(--font-display)] text-[25vw] leading-[0.82] font-medium tracking-tighter text-neutral-100"
      >
        <p>POLA</p>
        <p>.AI</p>
      </div>

      <header className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 pt-14 text-xs tracking-wide uppercase sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="font-medium whitespace-nowrap">
          Pola_AI.S01
        </Link>
        <div className="hidden justify-center md:flex">
          <NavPill items={NAV} activeIndex={0} />
        </div>
        <div className="flex items-center justify-end gap-6">
          <span className="hidden text-neutral-500 lg:inline">ID. {String(models.length).padStart(4, "0")}.X</span>
          <Link
            href="/candidati"
            className="flex items-center gap-2 border border-neutral-900 px-4 py-2 whitespace-nowrap transition hover:bg-neutral-900 hover:text-white"
          >
            Candidati
            <ArrowIcon />
          </Link>
        </div>
      </header>

      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-center gap-5 px-4 [perspective:1200px] sm:mt-16">
        {side.slice(0, 2).map((c) => (
          <SideCard key={c.id} model={c.model} className={c.className} />
        ))}

        <Link
          href={`/models/${featured.id}`}
          className="relative flex h-[480px] w-[300px] shrink-0 flex-col bg-white p-3 pb-0 shadow-[0_20px_50px_rgba(0,0,0,0.2)] ring-1 ring-neutral-200 sm:h-[540px] sm:w-[340px]"
        >
          <div className="relative flex-1 overflow-hidden bg-neutral-100 text-white">
            <Image
              src={`/models/${featured.id}.jpg`}
              alt={`Ritratto di ${featured.name}`}
              fill
              priority
              sizes="340px"
              className="object-cover"
            />
            {/* Story-style progress bars */}
            <div className="absolute inset-x-4 top-4 flex gap-1.5">
              <span className="h-0.5 flex-1 rounded bg-white" />
              <span className="h-0.5 flex-1 rounded bg-white/50" />
              <span className="h-0.5 flex-1 rounded bg-white/50" />
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pt-24 pb-5 font-[family-name:var(--font-display)]">
              <div className="mb-4 flex items-center gap-2 text-white/90">
                <span className="h-px flex-1 bg-white/80" />
                <span className="text-xs">✦</span>
                <span className="h-px flex-1 bg-white/80" />
              </div>
              <p className="text-2xl leading-tight font-medium uppercase sm:text-3xl">
                Il volto giusto
                <br />
                per la tua AI
              </p>
            </div>
          </div>
          <span className="flex h-12 items-center justify-between text-[11px] tracking-wide text-neutral-500 uppercase">
            <span>
              {featured.name} · {featured.city}
            </span>
            <span>Immagine AI demo</span>
          </span>
        </Link>

        {side.slice(2).map((c) => (
          <SideCard key={c.id} model={c.model} className={c.className} />
        ))}
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pt-10 text-center">
        <p className="max-w-xl text-sm leading-relaxed text-neutral-600">
          Volti reali, licenziati per l&apos;intelligenza artificiale. Scegli il modello, acquista i diritti AI e
          genera contenuti legali, tracciati e approvati.
        </p>

        {/* Search bar with a white LED light running around its border */}
        <div className="relative mt-8 w-full rounded-full bg-neutral-800 p-[2px] shadow-2xl shadow-neutral-900/25">
          <span aria-hidden className="led-ring absolute inset-0 rounded-full" />
          <span aria-hidden className="led-ring absolute -inset-1 rounded-full opacity-60 blur-md" />
          <MatchingSearchForm className="relative flex h-16 items-center rounded-full bg-neutral-950 p-2 pl-7 sm:h-[72px]">
            <span aria-hidden className="mr-3 text-xs tracking-wide text-white/50 uppercase">
              Query_
            </span>
            <input
              name="q"
              aria-label="Cerca un modello"
              placeholder="capelli rossi, fitness, Milano…"
              className="min-w-0 flex-1 bg-transparent text-base text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="flex h-full items-center gap-2 rounded-full bg-white px-6 text-xs font-medium tracking-wide text-neutral-900 uppercase transition hover:bg-neutral-300"
            >
              Cerca
              <ArrowIcon />
            </button>
          </MatchingSearchForm>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-12 pb-8 text-xs tracking-wide uppercase sm:px-8">
        <Link href="/search" className="link-u flex items-center gap-2">
          Esplora ({models.length}) <ArrowIcon />
        </Link>
        <a href="#come-funziona" className="link-u flex items-center gap-2">
          Scorri ↓
        </a>
      </div>
    </section>
  );
}
