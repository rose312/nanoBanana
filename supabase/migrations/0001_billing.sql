-- Billing schema for Creem checkout + subscription status.
-- Apply this in Supabase SQL editor (or migrations) before enabling webhooks.

create table if not exists public.billing_checkouts (
  request_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_key text not null,
  creem_product_id text,
  creem_checkout_id text,
  status text not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_checkouts_user_id_idx on public.billing_checkouts (user_id);

alter table public.billing_checkouts enable row level security;

create policy "billing_checkouts_select_own"
on public.billing_checkouts
for select
to authenticated
using (auth.uid() = user_id);

create policy "billing_checkouts_insert_own"
on public.billing_checkouts
for insert
to authenticated
with check (auth.uid() = user_id);

create table if not exists public.billing_subscriptions (
  creem_subscription_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_key text not null,
  status text not null,
  creem_customer_id text,
  creem_product_id text,
  current_period_start_date timestamptz,
  current_period_end_date timestamptz,
  canceled_at timestamptz,
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists billing_subscriptions_user_id_idx on public.billing_subscriptions (user_id);
create index if not exists billing_subscriptions_status_idx on public.billing_subscriptions (status);

alter table public.billing_subscriptions enable row level security;

create policy "billing_subscriptions_select_own"
on public.billing_subscriptions
for select
to authenticated
using (auth.uid() = user_id);

