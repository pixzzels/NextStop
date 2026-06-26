-- Fresh reset for initial NextStop schema.
-- Safe right now because we have not added real app data yet.

drop trigger if exists on_auth_user_created on auth.users;

drop table if exists public.trip_members cascade;
drop table if exists public.trips cascade;
drop table if exists public.profiles cascade;

drop function if exists public.handle_new_user cascade;
drop function if exists public.set_updated_at cascade;

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLES FIRST
-- =========================================================

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  destination text,
  start_date date not null,
  end_date date not null,
  description text,
  timezone text not null default 'UTC',
  invite_code text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  version integer not null default 1,

  constraint trips_title_not_empty check (char_length(trim(title)) > 0),
  constraint trips_valid_date_range check (end_date >= start_date)
);

create table public.trip_members (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint trip_members_role_valid check (role in ('owner', 'member')),
  constraint trip_members_status_valid check (status in ('invited', 'active', 'removed', 'left')),
  constraint trip_members_unique_user_per_trip unique (trip_id, user_id)
);

-- =========================================================
-- ENABLE RLS
-- =========================================================

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.trip_members enable row level security;

-- =========================================================
-- PROFILES POLICIES
-- =========================================================

create policy "Profiles are readable by shared trip members"
on public.profiles
for select
to authenticated
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.trip_members tm_self
    join public.trip_members tm_other
      on tm_self.trip_id = tm_other.trip_id
    where tm_self.user_id = auth.uid()
      and tm_self.status = 'active'
      and tm_other.user_id = profiles.user_id
      and tm_other.status = 'active'
  )
);

create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- =========================================================
-- TRIPS POLICIES
-- =========================================================

create policy "Trip members can read trips"
on public.trips
for select
to authenticated
using (
  exists (
    select 1
    from public.trip_members tm
    where tm.trip_id = trips.id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
  )
);

create policy "Users can create owned trips"
on public.trips
for insert
to authenticated
with check (owner_user_id = auth.uid());

create policy "Trip owners can update trips"
on public.trips
for update
to authenticated
using (owner_user_id = auth.uid())
with check (owner_user_id = auth.uid());

-- =========================================================
-- TRIP MEMBERS POLICIES
-- =========================================================

create policy "Members can read members of their trips"
on public.trip_members
for select
to authenticated
using (
  exists (
    select 1
    from public.trip_members tm
    where tm.trip_id = trip_members.trip_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
  )
);

create policy "Users can insert own membership"
on public.trip_members
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Trip owners can add members"
on public.trip_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.trips t
    where t.id = trip_members.trip_id
      and t.owner_user_id = auth.uid()
  )
);

create policy "Users can update own membership"
on public.trip_members
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Trip owners can update members"
on public.trip_members
for update
to authenticated
using (
  exists (
    select 1
    from public.trips t
    where t.id = trip_members.trip_id
      and t.owner_user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.trips t
    where t.id = trip_members.trip_id
      and t.owner_user_id = auth.uid()
  )
);

-- =========================================================
-- UPDATED_AT TRIGGER
-- =========================================================

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger set_trips_updated_at
before update on public.trips
for each row
execute function public.set_updated_at();

create trigger set_trip_members_updated_at
before update on public.trip_members
for each row
execute function public.set_updated_at();

-- =========================================================
-- CREATE PROFILE AFTER AUTH SIGNUP
-- =========================================================

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- =========================================================
-- INDEXES
-- =========================================================

create index profiles_user_id_idx
on public.profiles(user_id);

create index trips_owner_user_id_idx
on public.trips(owner_user_id);

create index trips_invite_code_idx
on public.trips(invite_code);

create index trip_members_trip_id_idx
on public.trip_members(trip_id);

create index trip_members_user_id_idx
on public.trip_members(user_id);