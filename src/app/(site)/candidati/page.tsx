import Link from "next/link";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/models";
import { supabase } from "@/lib/supabase";

const field = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();

// Saves the application in Supabase (insert-only for the public, the team reads it from the
// dashboard). Posting to a server action keeps personal data out of the URL.
async function apply(formData: FormData) {
  "use server";
  const { error } = await supabase.from("applications").insert({
    name: field(formData, "name"),
    email: field(formData, "email"),
    city: field(formData, "city"),
    age: Number(field(formData, "age")),
    category: field(formData, "category"),
    portfolio: field(formData, "portfolio") || null,
  });
  redirect(error ? "/candidati?errore=1" : "/candidati?inviata=1");
}

export default async function CandidatiPage(props: PageProps<"/candidati">) {
  const sp = await props.searchParams;
  const sent = sp.inviata === "1";
  const failed = sp.errore === "1";

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">Status: Candidatura_inviata</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900">
          Candidatura inviata
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          Grazie! Il nostro team valuterà il tuo profilo e ti contatterà per il servizio fotografico e la firma del
          contratto.
        </p>
        <Link href="/" className="mt-8 inline-block bg-neutral-900 px-6 py-3 text-xs tracking-wide text-white uppercase hover:bg-neutral-700">
          Torna alla home ↗
        </Link>
      </div>
    );
  }

  const input = "mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm normal-case outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-8 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-xs tracking-wide text-neutral-500 uppercase">Casting.Open_Call</p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900 sm:text-6xl">
          Guadagna con il tuo volto, anche nell&apos;era dell&apos;AI
        </h1>
        <ul className="mt-8 border-t border-neutral-200 text-xs tracking-wide text-neutral-700 uppercase">
          <li className="flex gap-6 border-b border-neutral-200 py-3"><span className="text-neutral-400">01</span>Decidi tu i prezzi e gli utilizzi consentiti</li>
          <li className="flex gap-6 border-b border-neutral-200 py-3"><span className="text-neutral-400">02</span>Approvi ogni licenza prima che venga attivata</li>
          <li className="flex gap-6 border-b border-neutral-200 py-3"><span className="text-neutral-400">03</span>Mai contenuti politici, diffamatori o per adulti</li>
          <li className="flex gap-6 border-b border-neutral-200 py-3"><span className="text-neutral-400">04</span>Ricevi un compenso per ogni licenza venduta</li>
        </ul>
      </div>

      <form action={apply} className="space-y-5 border border-neutral-900 p-6">
        <h2 className="text-xs tracking-wide text-neutral-500 uppercase">FIG. 04. — Candidati come modello</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-xs tracking-wide uppercase">
            <span className="text-neutral-500">Nome e cognome</span>
            <input name="name" required autoComplete="name" className={input} />
          </label>
          <label className="block text-xs tracking-wide uppercase">
            <span className="text-neutral-500">Email</span>
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <label className="block text-xs tracking-wide uppercase">
            <span className="text-neutral-500">Città</span>
            <input name="city" required className={input} />
          </label>
          <label className="block text-xs tracking-wide uppercase">
            <span className="text-neutral-500">Età</span>
            <input name="age" type="number" min={18} required className={input} />
          </label>
        </div>
        <label className="block text-xs tracking-wide uppercase">
          <span className="text-neutral-500">Categoria principale</span>
          <select name="category" className={input}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs tracking-wide uppercase">
          <span className="text-neutral-500">Instagram o portfolio (facoltativo)</span>
          <input name="portfolio" placeholder="@nome oppure link" className={input} />
        </label>
        <label className="flex items-start gap-3 text-xs leading-relaxed text-neutral-600">
          <input type="checkbox" required className="mt-0.5 accent-neutral-900" />
          Ho almeno 18 anni e accetto di essere ricontattato per valutare la candidatura.
        </label>
        {failed && (
          <p role="alert" className="border border-red-600 p-3 text-[11px] tracking-wide text-red-700 uppercase">
            Invio non riuscito: controlla i dati (età minima 18 anni) e riprova.
          </p>
        )}
        <button className="w-full bg-neutral-900 py-4 text-xs font-medium tracking-wide text-white uppercase hover:bg-neutral-700">
          Invia candidatura ↗
        </button>
      </form>
    </div>
  );
}
