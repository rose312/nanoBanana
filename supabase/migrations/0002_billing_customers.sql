-- Map Creem customer IDs to Supabase users for reliable webhook processing.

create table if not exists public.billing_customers (
  creem_customer_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_customers_user_id_idx on public.billing_customers (user_id);

alter table public.billing_customers enable row level security;

create policy "billing_customers_select_own"
on public.billing_customers
for select
to authenticated
using (auth.uid() = user_id);

