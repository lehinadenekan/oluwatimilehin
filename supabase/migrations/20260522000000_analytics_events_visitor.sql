-- Add visitor_id for deduplicating users in analytics_events
alter table public.analytics_events
  add column if not exists visitor_id text;

comment on column public.analytics_events.visitor_id is
  'Anonymous browser ID (localStorage UUID). Same value = same device/browser across sessions until cleared.';

create index if not exists analytics_events_visitor_id_idx
  on public.analytics_events (visitor_id);
