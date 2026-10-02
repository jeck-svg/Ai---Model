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

  const select = "h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SearchBar defaultValue={q} />

      <form action="/search" className="mt-4 flex flex-wrap items-center gap-2">
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
        <button className="h-10 rounded-lg bg-neutral-900 px-4 text-sm font-medium text-white">Applica</button>
      </form>

      <p className="mt-6 text-sm text-neutral-600">
        {results.length} {results.length === 1 ? "modello trovato" : "modelli trovati"}
        {q && (
          <>
            {" "}
            per <strong>&ldquo;{q}&rdquo;</strong>
          </>
        )}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {results.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 p-10 text-center text-neutral-600">
          Nessun modello corrisponde. Prova con meno parole o rimuovi qualche filtro.
        </div>
      )}
    </div>
  );
}
