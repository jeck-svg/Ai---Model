-- Pola.AI: catalogo modelli, licenze AI, candidature e richieste di licenza.

create type public.gender as enum ('donna', 'uomo', 'non-binario');
create type public.license_tier as enum ('base', 'standard', 'premium');

-- Modelli in catalogo. `position` genera il codice catalogo mostrato nel sito (PA_0001).
create table public.models (
  id text primary key,
  position integer not null unique,
  name text not null,
  age integer not null check (age >= 18),
  gender public.gender not null,
  city text not null,
  categories text[] not null default '{}',
  tags text[] not null default '{}',
  bio text not null default '',
  rating numeric(2, 1) not null default 0 check (rating between 0 and 5),
  reviews integer not null default 0,
  sales integer not null default 0,
  palette text[] not null default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Licenze vendibili per ogni modello (prezzo in euro, IVA esclusa).
create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  model_id text not null references public.models (id) on delete cascade,
  tier public.license_tier not null,
  name text not null,
  price integer not null check (price >= 0),
  duration_months integer not null check (duration_months > 0),
  territory text not null,
  usages text[] not null default '{}',
  generations text not null,
  unique (model_id, tier)
);

-- Candidature dal form /candidati.
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  city text not null,
  age integer not null check (age >= 18),
  category text not null,
  portfolio text,
  status text not null default 'nuova' check (status in ('nuova', 'in_valutazione', 'accettata', 'rifiutata')),
  created_at timestamptz not null default now()
);

-- Richieste di acquisto licenza dal /checkout.
create table public.license_requests (
  id uuid primary key default gen_random_uuid(),
  model_id text not null references public.models (id),
  tier public.license_tier not null,
  company text not null,
  project text not null,
  price integer not null,
  fee integer not null,
  status text not null default 'in_attesa' check (status in ('in_attesa', 'approvata', 'rifiutata', 'pagata')),
  created_at timestamptz not null default now()
);

create index on public.license_requests (model_id);

-- Sicurezza: il pubblico legge solo il catalogo pubblicato e può solo inviare
-- candidature/richieste, mai leggerle (le gestisce il team con la service role).
alter table public.models enable row level security;
alter table public.licenses enable row level security;
alter table public.applications enable row level security;
alter table public.license_requests enable row level security;

create policy "Catalogo pubblico" on public.models
  for select to anon, authenticated using (published);

create policy "Licenze pubbliche" on public.licenses
  for select to anon, authenticated
  using (exists (select 1 from public.models m where m.id = model_id and m.published));

create policy "Chiunque può candidarsi" on public.applications
  for insert to anon, authenticated with check (status = 'nuova');

create policy "Chiunque può richiedere una licenza" on public.license_requests
  for insert to anon, authenticated with check (status = 'in_attesa');
