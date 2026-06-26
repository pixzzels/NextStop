-- =========================================================
-- ENABLE PGCRYPTO AND FIX INVITE CODE GENERATION PROPERLY
-- =========================================================

create schema if not exists extensions;

create extension if not exists "pgcrypto" with schema extensions;

create or replace function public.create_trip_with_owner(
  trip_title text,
  trip_destination text,
  trip_start_date date,
  trip_end_date date,
  trip_description text default null,
  trip_timezone text default 'UTC'
)
returns public.trips
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  new_trip public.trips;
  generated_invite_code text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if trip_title is null or char_length(trim(trip_title)) = 0 then
    raise exception 'Trip title is required';
  end if;

  if trip_start_date is null then
    raise exception 'Trip start date is required';
  end if;

  if trip_end_date is null then
    raise exception 'Trip end date is required';
  end if;

  if trip_end_date < trip_start_date then
    raise exception 'Trip end date cannot be before start date';
  end if;

  loop
    generated_invite_code := upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10));

    exit when not exists (
      select 1
      from public.trips
      where invite_code = generated_invite_code
    );
  end loop;

  insert into public.trips (
    owner_user_id,
    title,
    destination,
    start_date,
    end_date,
    description,
    timezone,
    invite_code
  )
  values (
    auth.uid(),
    trim(trip_title),
    nullif(trim(coalesce(trip_destination, '')), ''),
    trip_start_date,
    trip_end_date,
    nullif(trim(coalesce(trip_description, '')), ''),
    coalesce(nullif(trim(trip_timezone), ''), 'UTC'),
    generated_invite_code
  )
  returning * into new_trip;

  insert into public.trip_members (
    trip_id,
    user_id,
    role,
    status,
    joined_at
  )
  values (
    new_trip.id,
    auth.uid(),
    'owner',
    'active',
    now()
  );

  return new_trip;
end;
$$;

grant execute on function public.create_trip_with_owner(
  text,
  text,
  date,
  date,
  text,
  text
) to authenticated;