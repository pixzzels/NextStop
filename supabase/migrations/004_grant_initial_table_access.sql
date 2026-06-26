-- =========================================================
-- GRANT API ACCESS FOR INITIAL TABLES
-- =========================================================

grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.trips to authenticated;
grant select, insert, update on public.trip_members to authenticated;

grant usage, select on all sequences in schema public to authenticated;