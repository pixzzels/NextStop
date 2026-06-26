-- =========================================================
-- FIX RLS RECURSION FOR TRIPS / TRIP_MEMBERS / PROFILES
-- =========================================================

-- Remove recursive policies.
drop policy if exists "Profiles are readable by shared trip members"
on public.profiles;

drop policy if exists "Trip members can read trips"
on public.trips;

drop policy if exists "Trip owners can update trips"
on public.trips;

drop policy if exists "Members can read members of their trips"
on public.trip_members;

drop policy if exists "Users can insert own membership"
on public.trip_members;

drop policy if exists "Trip owners can add members"
on public.trip_members;

drop policy if exists "Users can update own membership"
on public.trip_members;

drop policy if exists "Trip owners can update members"
on public.trip_members;


-- =========================================================
-- SECURITY DEFINER HELPERS
-- These avoid direct recursive RLS checks inside policies.
-- =========================================================

create or replace function public.is_active_trip_member(
  target_trip_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trip_members tm
    where tm.trip_id = target_trip_id
      and tm.user_id = target_user_id
      and tm.status = 'active'
  );
$$;

create or replace function public.is_trip_owner(
  target_trip_id uuid,
  target_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.trips t
    where t.id = target_trip_id
      and t.owner_user_id = target_user_id
      and t.deleted_at is null
  );
$$;

create or replace function public.shares_active_trip_with_user(
  target_profile_user_id uuid,
  current_user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    target_profile_user_id = current_user_id
    or exists (
      select 1
      from public.trip_members current_member
      join public.trip_members target_member
        on current_member.trip_id = target_member.trip_id
      where current_member.user_id = current_user_id
        and current_member.status = 'active'
        and target_member.user_id = target_profile_user_id
        and target_member.status = 'active'
    );
$$;

grant execute on function public.is_active_trip_member(uuid, uuid)
to authenticated;

grant execute on function public.is_trip_owner(uuid, uuid)
to authenticated;

grant execute on function public.shares_active_trip_with_user(uuid, uuid)
to authenticated;


-- =========================================================
-- RECREATE NON-RECURSIVE POLICIES
-- =========================================================

create policy "Profiles are readable by shared trip members"
on public.profiles
for select
to authenticated
using (
  public.shares_active_trip_with_user(profiles.user_id, auth.uid())
);

create policy "Trip members can read trips"
on public.trips
for select
to authenticated
using (
  public.is_active_trip_member(trips.id, auth.uid())
);

create policy "Trip owners can update trips"
on public.trips
for update
to authenticated
using (
  public.is_trip_owner(trips.id, auth.uid())
)
with check (
  public.is_trip_owner(trips.id, auth.uid())
);

create policy "Members can read members of their trips"
on public.trip_members
for select
to authenticated
using (
  public.is_active_trip_member(trip_members.trip_id, auth.uid())
);

create policy "Trip owners can add members"
on public.trip_members
for insert
to authenticated
with check (
  public.is_trip_owner(trip_members.trip_id, auth.uid())
);

create policy "Users can update own membership"
on public.trip_members
for update
to authenticated
using (
  trip_members.user_id = auth.uid()
)
with check (
  trip_members.user_id = auth.uid()
);

create policy "Trip owners can update members"
on public.trip_members
for update
to authenticated
using (
  public.is_trip_owner(trip_members.trip_id, auth.uid())
)
with check (
  public.is_trip_owner(trip_members.trip_id, auth.uid())
);