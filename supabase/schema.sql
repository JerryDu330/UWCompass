-- ─── UWCompass database schema ───────────────────────────────────────────────
-- Run this in your Supabase project's SQL editor (Dashboard → SQL Editor)

-- ── 1. Planner state ─────────────────────────────────────────────────────────
-- One row per user per program. Stores which career path they chose
-- and the array of completed course codes.
create table public.user_planners (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  program_id  text not null,           -- 'cs' | 'se' | 'math' | 'stat' | 'ece'
  path_id     text,                    -- career path within the program
  completed   text[] default '{}',     -- e.g. ['CS135', 'MATH137', ...]
  updated_at  timestamptz default now(),
  unique (user_id, program_id)
);

create index user_planners_user_idx on public.user_planners (user_id);

-- ── 2. Course history ─────────────────────────────────────────────────────────
-- Browsed and starred courses, synced from the History page.
create table public.user_history (
  user_id         uuid primary key references auth.users(id) on delete cascade,
  recent_courses  text[] default '{}',   -- ordered, newest first
  starred_courses text[] default '{}',
  updated_at      timestamptz default now()
);

-- ── 3. Row Level Security ─────────────────────────────────────────────────────
-- Users can only read and write their own rows.
alter table public.user_planners enable row level security;
alter table public.user_history  enable row level security;

create policy "planners: own rows only" on public.user_planners
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "history: own rows only" on public.user_history
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 4. Auto-update timestamp trigger ─────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_planners_updated_at
  before update on public.user_planners
  for each row execute function public.set_updated_at();

create trigger user_history_updated_at
  before update on public.user_history
  for each row execute function public.set_updated_at();
