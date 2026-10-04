import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { getModel } from "@/lib/catalog";
import { euro, modelCode } from "@/lib/models";
import { supabase } from "@/lib/supabase";

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

const serviceFee = (price: number) => Math.round(price * 0.1);

// Saves the license request in Supabase. Price and fee come from the database, never from
// the form. Posting to a server action keeps the company and project details out of the URL.
async function sendRequest(formData: FormData) {
  "use server";
  const modelId = String(formData.get("model"));
  const tier = String(formData.get("tier"));
  const license = (await getModel(modelId))?.licenses.find((l) => l.tier === tier);
  if (!license) notFound();
  const { error } = await supabase.from("license_requests").insert({
    model_id: modelId,
    tier,
    company: String(formData.get("company") ?? "").trim(),
    project: String(formData.get("project") ?? "").trim(),
    price: license.price,
    fee: serviceFee(license.price),
  });
  const params = new URLSearchParams({ model: modelId, tier, ...(error ? { errore: "1" } : { done: "1" }) });
  redirect(`/checkout?${params}`);
}

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const sp = await props.searchParams;
  const model = await getModel(one(sp.model));
  const license = model?.licenses.find((l) => l.tier === one(sp.tier));
  if (!model || !license) notFound();
  const done = one(sp.done) === "1";
  const failed = one(sp.errore) === "1";

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">Status: Richiesta_inviata</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900">
          Richiesta inviata
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          {model.name} riceverà la tua richiesta di licenza {license.name}. Dopo l&apos;approvazione riceverai contratto
          e pacchetto di training AI.
        </p>
        <Link
          href="/search"
          className="mt-8 inline-block bg-neutral-900 px-6 py-3 text-xs tracking-wide text-white uppercase hover:bg-neutral-700"
        >
          Cerca altri modelli ↗
        </Link>
      </div>
    );
  }

  const fee = serviceFee(license.price);
  const label = "block text-xs tracking-wide text-neutral-500 uppercase";
  const input = "mt-2 h-11 w-full border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
      <p className="text-xs tracking-wide text-neutral-500 uppercase">Checkout.Licenza_AI</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl font-medium tracking-tight text-neutral-900 sm:text-6xl">
        Acquista la licenza
      </h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <form action={sendRequest} className="space-y-6">
          <input type="hidden" name="model" value={model.id} />
          <input type="hidden" name="tier" value={license.tier} />
          <label className={label}>
            Azienda / Brand
            <input name="company" required className={input} />
          </label>
          <label className={label}>
            Descrivi il progetto
            <textarea
              name="project"
              required
              rows={4}
              placeholder="Es. campagna social per nuova linea skincare, 20 immagini generate…"
              className="mt-2 w-full border border-neutral-300 bg-white p-3 text-sm normal-case outline-none focus:border-neutral-900"
            />
          </label>
          <label className="flex items-start gap-3 text-xs leading-relaxed text-neutral-600">
            <input type="checkbox" required className="mt-0.5 accent-neutral-900" />
            Accetto che il volto venga usato solo per gli utilizzi previsti dalla licenza e mai per contenuti
            diffamatori, politici o per adulti.
          </label>
          {failed && (
            <p role="alert" className="border border-red-600 p-3 text-[11px] tracking-wide text-red-700 uppercase">
              Invio non riuscito, riprova tra poco.
            </p>
          )}
          <p className="border border-neutral-300 p-3 text-[11px] tracking-wide text-neutral-500 uppercase">
            Il pagamento non è ancora attivo: invii una richiesta, nessun addebito verrà effettuato.
          </p>
          <button className="w-full bg-neutral-900 py-4 text-xs font-medium tracking-wide text-white uppercase hover:bg-neutral-700">
            Invia richiesta · {euro(license.price + fee)}
          </button>
        </form>

        <aside className="h-fit border border-neutral-900 p-6">
          <div className="flex items-center gap-4">
            <Avatar model={model} className="h-20 w-16 shrink-0 [&_span]:text-lg" sizes="64px" />
            <div>
              <p className="text-[11px] tracking-wide text-neutral-500 uppercase">{modelCode(model)}</p>
              <p className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight">{model.name}</p>
              <p className="text-xs text-neutral-500 uppercase">Licenza {license.name}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-xs">
            {[
              ["Durata", `${license.durationMonths} mesi`],
              ["Territorio", license.territory],
              ["Generazioni", license.generations],
              ["Utilizzi", license.usages.join(", ")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-neutral-500 uppercase">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 space-y-2 border-t border-neutral-200 pt-4 text-xs uppercase">
            <div className="flex justify-between">
              <span>Licenza</span>
              <span>{euro(license.price)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Commissione servizio (10%)</span>
              <span>{euro(fee)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-medium">
              <span>Totale</span>
              <span>{euro(license.price + fee)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
