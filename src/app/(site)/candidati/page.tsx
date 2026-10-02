import Link from "next/link";
import { redirect } from "next/navigation";
import { CATEGORIES } from "@/lib/models";

// Prototype: the application is not stored anywhere yet (no database). The form posts to a
// server action so personal data never ends up in the URL.
async function apply() {
  "use server";
  redirect("/candidati?inviata=1");
}

export default async function CandidatiPage(props: PageProps<"/candidati">) {
  const sp = await props.searchParams;
  const sent = sp.inviata === "1";

  if (sent) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-5xl">✨</div>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-neutral-900">Candidatura inviata</h1>
        <p className="mt-3 text-neutral-600">
          Grazie! Il nostro team valuterà il tuo profilo e ti contatterà per il servizio fotografico e la firma del
          contratto.
        </p>
        <Link href="/" className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-white">
          Torna alla home
        </Link>
      </div>
    );
  }

  const input = "mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3";

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-rose-600 uppercase">Per i modelli</p>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl text-neutral-900">
          Guadagna con il tuo volto, anche nell&apos;era dell&apos;AI
        </h1>
        <ul className="mt-6 space-y-3 text-neutral-700">
          <li>✦ Decidi tu i prezzi e gli utilizzi consentiti</li>
          <li>✦ Approvi ogni licenza prima che venga attivata</li>
          <li>✦ Mai contenuti politici, diffamatori o per adulti</li>
          <li>✦ Ricevi un compenso per ogni licenza venduta</li>
        </ul>
      </div>

      <form action={apply} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-neutral-900">Candidati come modello</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-neutral-700">Nome e cognome</span>
            <input name="name" required autoComplete="name" className={input} />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-700">Email</span>
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-700">Città</span>
            <input name="city" required className={input} />
          </label>
          <label className="block text-sm">
            <span className="text-neutral-700">Età</span>
            <input name="age" type="number" min={18} required className={input} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-neutral-700">Categoria principale</span>
          <select name="category" className={input}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">Instagram o portfolio (facoltativo)</span>
          <input name="portfolio" placeholder="@nome oppure link" className={input} />
        </label>
        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input type="checkbox" required className="mt-1" />
          Ho almeno 18 anni e accetto di essere ricontattato per valutare la candidatura.
        </label>
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Prototipo: la candidatura non viene ancora salvata né inviata.
        </p>
        <button className="w-full rounded-full bg-rose-600 py-3 font-medium text-white hover:bg-rose-700">
          Invia candidatura
        </button>
      </form>
    </div>
  );
}
