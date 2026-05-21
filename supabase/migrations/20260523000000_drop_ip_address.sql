-- Remove IP column; visitor_id is sufficient for grouping events by user
drop index if exists public.analytics_events_ip_address_idx;

alter table public.analytics_events
  drop column if exists ip_address;
