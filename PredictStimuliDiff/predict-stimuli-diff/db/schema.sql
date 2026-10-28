-- One row per submission of the graph-choice page (see app/record.ts).
-- Apply with `npm run db:setup`; safe to re-run.

create table if not exists public.responses (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  display_order text[] not null, -- image srcs in the order they were shown
  selected text not null -- src of the image the participant chose
);

-- RLS on with no policies: Supabase's public API (anon/authenticated keys)
-- can't touch this table. The app writes through DATABASE_URL as the table
-- owner, which bypasses RLS.
alter table public.responses enable row level security;
