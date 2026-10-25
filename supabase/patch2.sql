-- FITNESS STUDIO: dopuna 2 (dodatna polja profila i pravila za program u prodaji)
-- Supabase: SQL Editor -> New query -> zalijepi -> Run

alter table public.profiles add column if not exists aktivan boolean not null default true;
alter table public.profiles add column if not exists mora_promijeniti boolean not null default false;
alter table public.profiles add column if not exists dob text not null default '18+';
alter table public.profiles add column if not exists saglasnost boolean not null default false;

-- klijentica ne može mijenjati ulogu, programe, paket ni status računa
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_trener() then
    new.role := old.role; new.programi := old.programi; new.pstart := old.pstart;
    new.id := old.id; new.email := old.email; new.paket := old.paket; new.aktivan := old.aktivan;
  end if;
  return new;
end $$;

-- gotovi programi iz prodaje vidljivi su svima (bez individualnih)
drop policy if exists docs_select_shop on public.docs;
create policy docs_select_shop on public.docs for select to anon, authenticated
  using (coll = 'programi' and coalesce(data ->> 'tip', '') <> 'individualni');

-- klijentica može označiti poruke trenerice kao pročitane
drop policy if exists docs_client_update on public.docs;
create policy docs_client_update on public.docs for update to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'))
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'));
