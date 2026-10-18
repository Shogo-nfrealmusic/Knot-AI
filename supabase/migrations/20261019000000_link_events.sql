-- /links tracking (Issue #26). Lives in the shared "tokyo-guide" Supabase project next to Iron & Code.
-- One row per view, side switch or click. No raw IP or user agent is stored: `visitor` is a salted
-- hash that changes every day (computed in src/app/api/links/event/route.ts), so it can count
-- daily unique visitors but cannot follow a person across days.

create table if not exists public.link_events (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  kind text not null check (kind in ('view', 'click', 'mode')),
  mode text not null check (mode in ('ai', 'fit')),
  src text not null default 'direct' check (char_length(src) <= 24),
  target text check (char_length(target) <= 64),
  place text check (char_length(place) <= 24),
  visitor text check (char_length(visitor) <= 32),
  device text check (device in ('mobile', 'desktop'))
);

create index if not exists link_events_at_idx on public.link_events (at desc);

-- RLS on with no policies: the browser keys (anon, authenticated) can neither read nor write.
-- Only the server, with the service role key, inserts and reads.
alter table public.link_events enable row level security;
revoke all on public.link_events from anon, authenticated;
