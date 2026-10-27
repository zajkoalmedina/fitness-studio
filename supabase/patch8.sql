-- Klijentica može učitati program koji joj je dodijeljen (i individualni), čak i ako nema oznaku vlasnika
drop policy if exists docs_select_assigned on public.docs;
create policy docs_select_assigned on public.docs for select to authenticated
  using (coll = 'programi' and id = any (coalesce((select programi from public.profiles where id = auth.uid()), '{}'::text[])));
