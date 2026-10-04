# Pola.AI

Marketplace dove le aziende cercano modelli reali e acquistano la licenza per usare il loro volto con l'AI (licenze Base, Standard e Premium).

Online: https://pola-ai.vercel.app — ogni push su `main` viene pubblicato automaticamente da Vercel.

## Sviluppo

```bash
npm install
npm run dev
```

Apri http://localhost:3000.

## Struttura

- `src/app/page.tsx` — home con barra di ricerca e categorie
- `src/app/search/page.tsx` — risultati con filtri
- `src/app/models/[id]/page.tsx` — profilo del modello e licenze AI
- `src/app/checkout/page.tsx` — richiesta di acquisto della licenza
- `src/lib/models.ts` — dati dei modelli (per ora finti) e logica di ricerca
- `supabase/` — schema del database (`migrations/`) e dati iniziali (`seed.sql`)

## Database (Supabase)

Progetto Supabase **Pola.AI** (`sxodhfzogahynzkhhajn`, regione eu-central-1). Copia `.env.example` in `.env.local` per le chiavi pubbliche.

| Tabella | Contenuto | Accesso pubblico |
| --- | --- | --- |
| `models` | catalogo modelli | lettura (solo `published`) |
| `licenses` | licenze Base/Standard/Premium per modello | lettura |
| `applications` | candidature da /candidati | solo invio |
| `license_requests` | richieste di licenza dal checkout | solo invio |

Candidature e richieste si leggono dalla dashboard Supabase (o lato server con la service role key, mai nel browser).

## Stato

Prototipo: il database Supabase è pronto e popolato, ma il sito usa ancora i dati in `src/lib/models.ts`. Prossimi passi: collegare il sito a Supabase (catalogo, candidature, richieste), account e foto, poi Stripe.
