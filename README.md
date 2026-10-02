# Pola.AI

Marketplace dove le aziende cercano modelli reali e acquistano la licenza per usare il loro volto con l'AI (licenze Base, Standard e Premium).

Online: https://velvet-mode.vercel.app — ogni push su `main` viene pubblicato automaticamente da Vercel.

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

## Stato

Prototipo: dati finti, nessun database né pagamento. Prossimi passi: Supabase (account, foto, prezzi) e Stripe.
