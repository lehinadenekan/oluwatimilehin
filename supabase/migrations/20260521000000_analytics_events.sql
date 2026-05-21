-- First-party analytics events (portfolio site)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  event_category text not null,
  label text,
  page_path text,
  referrer text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events (created_at desc);

create index if not exists analytics_events_event_name_idx
  on public.analytics_events (event_name);

create index if not exists analytics_events_event_category_idx
  on public.analytics_events (event_category);

alter table public.analytics_events enable row level security;

-- No public policies: inserts go through the API using the service role key only.
