import { SearchBar } from "@/components/SearchBar";
import { ModelCard } from "@/components/ModelCard";
import { CATEGORIES, searchModels } from "@/lib/models";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const q = one(sp.q);
  const category = one(sp.category);
  const gender = one(sp.gender);
  const maxPrice = one(sp.maxPrice);
  const sort = one(sp.sort);
  const results = searchModels({ q, category, gender, maxPrice: maxPrice ? Number(maxPrice) : undefined, sort });

  const select = "h-10 border border-neutral-300 bg-white px-3 text-xs uppercase";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-xs tracking-wide text-neutral-500 uppercase">Inventory.Loc_S01</p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900 sm:text-6xl">
            Esplora
          </h1>
        </div>
        <p className="text-xs tracking-wide text-neutral-500 uppercase">
          {results.length} {results.length === 1 ? "risultato" : "risultati"}
          {q && <> · &ldquo;{q}&rdquo;</>}
        </p>
      </div>

      <div className="mt-8">
        <SearchBar defaultValue={q} />
      </div>

      <form action="/search" className="mt-3 flex flex-wrap items-center gap-2">
        {q && <input type="hidden" name="q" value={q} />}
        <select name="category" defaultValue={category ?? ""} className={select}>
          <option value="">Tutte le categorie</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select name="gender" defaultValue={gender ?? ""} className={select}>
          <option value="">Qualsiasi genere</option>
          <option value="donna">Donna</option>
          <option value="uomo">Uomo</option>
          <option value="non-binario">Non-binario</option>
        </select>
        <select name="maxPrice" defaultValue={maxPrice ?? ""} className={select}>
          <option value="">Qualsiasi prezzo</option>
          <option value="120">Fino a 120 €</option>
          <option value="150">Fino a 150 €</option>
          <option value="200">Fino a 200 €</option>
        </select>
        <select name="sort" defaultValue={sort ?? ""} className={select}>
          <option value="">Più venduti</option>
          <option value="rating">Migliori recensioni</option>
          <option value="prezzo">Prezzo più basso</option>
        </select>
        <button className="link-u h-10 px-2 text-xs tracking-wide uppercase">Applica filtri</button>
      </form>

      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {results.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-dashed border-neutral-300 p-10 text-center text-sm text-neutral-600">
          Nessun modello corrisponde. Prova con meno parole o rimuovi qualche filtro.
        </div>
      )}
    </div>
  );
}
