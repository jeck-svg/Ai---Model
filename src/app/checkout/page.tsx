import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { euro, getModel } from "@/lib/models";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const sp = await props.searchParams;
  const model = getModel(one(sp.model));
  const license = model?.licenses.find((l) => l.tier === one(sp.tier));
  if (!model || !license) notFound();
  const done = one(sp.done) === "1";

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-neutral-900">Richiesta inviata!</h1>
        <p className="mt-3 text-neutral-600">
          {model.name} riceverà la tua richiesta di licenza <strong>{license.name}</strong>. Dopo l&apos;approvazione
          riceverai contratto e pacchetto di training AI.
        </p>
        <Link href="/search" className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-2.5 text-white">
          Cerca altri modelli
        </Link>
      </div>
    );
  }

  const fee = Math.round(license.price * 0.1);
  const input = "h-11 w-full rounded-lg border border-neutral-300 bg-white px-3";

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr]">
      <form action="/checkout" className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <input type="hidden" name="model" value={model.id} />
        <input type="hidden" name="tier" value={license.tier} />
        <input type="hidden" name="done" value="1" />
        <h1 className="text-2xl font-bold text-neutral-900">Acquista la licenza AI</h1>
        <label className="block text-sm">
          <span className="text-neutral-700">Azienda / Brand</span>
          <input name="company" required className={`${input} mt-1`} />
        </label>
        <label className="block text-sm">
          <span className="text-neutral-700">Descrivi il progetto</span>
          <textarea
            name="project"
            required
            rows={4}
            placeholder="Es. campagna social per nuova linea skincare, 20 immagini generate…"
            className="mt-1 w-full rounded-lg border border-neutral-300 bg-white p-3"
          />
        </label>
        <label className="flex items-start gap-2 text-sm text-neutral-600">
          <input type="checkbox" required className="mt-1" />
          Accetto che il volto venga usato solo per gli utilizzi previsti dalla licenza e mai per contenuti
          diffamatori, politici o per adulti.
        </label>
        <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
          Prototipo: il pagamento non è ancora attivo, nessun addebito verrà effettuato.
        </p>
        <button className="w-full rounded-full bg-neutral-900 py-3 font-medium text-white hover:bg-neutral-700">
          Invia richiesta · {euro(license.price + fee)}
        </button>
      </form>

      <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <Avatar model={model} className="h-16 w-16 rounded-xl [&_span]:text-lg" />
          <div>
            <p className="font-semibold text-neutral-900">{model.name}</p>
            <p className="text-sm text-neutral-500">Licenza {license.name}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-1.5 text-sm text-neutral-600">
          <li>Durata: {license.durationMonths} mesi</li>
          <li>Territorio: {license.territory}</li>
          <li>{license.generations}</li>
          <li>Utilizzi: {license.usages.join(", ")}</li>
        </ul>
        <div className="mt-5 space-y-1 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Licenza</span>
            <span>{euro(license.price)}</span>
          </div>
          <div className="flex justify-between text-neutral-500">
            <span>Commissione servizio (10%)</span>
            <span>{euro(fee)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Totale</span>
            <span>{euro(license.price + fee)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
