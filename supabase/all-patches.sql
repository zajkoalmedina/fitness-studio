alter table public.profiles add column if not exists aktivan boolean not null default true;
alter table public.profiles add column if not exists mora_promijeniti boolean not null default false;
alter table public.profiles add column if not exists dob text not null default '18+';
alter table public.profiles add column if not exists saglasnost boolean not null default false;
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_trener() then
    new.role := old.role; new.programi := old.programi; new.pstart := old.pstart;
    new.id := old.id; new.email := old.email; new.paket := old.paket; new.aktivan := old.aktivan;
  end if;
  return new;
end $$;
drop policy if exists docs_select_shop on public.docs;
create policy docs_select_shop on public.docs for select to anon, authenticated
  using (coll = 'programi' and coalesce(data ->> 'tip', '') <> 'individualni');
drop policy if exists docs_client_update on public.docs;
create policy docs_client_update on public.docs for update to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'))
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'));
drop policy if exists docs_client_write on public.docs;
create policy docs_client_write on public.docs for insert to authenticated
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi', 'upitnici')
              and (coll <> 'chat' or data ->> 'from' = 'klijent'));
drop policy if exists docs_client_update on public.docs;
create policy docs_client_update on public.docs for update to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi', 'upitnici'))
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi', 'upitnici'));
drop policy if exists docs_client_delete on public.docs;
create policy docs_client_delete on public.docs for delete to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi', 'upitnici'));
drop policy if exists chat_pdf_read on storage.objects;
create policy chat_pdf_read on storage.objects for select to authenticated
  using (bucket_id = 'chat' and (storage.foldername(name))[1] = 'pdf');
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  inv public.docs%rowtype;
  prvi boolean;
  ima boolean;
begin
  prvi := not exists (select 1 from public.profiles);
  select * into inv from public.docs where coll = 'pozivnice' and lower(id) = lower(new.email) limit 1;
  ima := found;
  if not prvi and not ima then
    raise exception 'Registracija je moguca samo uz pozivnicu.';
  end if;
  insert into public.profiles (id, email, ime, role, paket)
  values (new.id, new.email,
          coalesce(nullif(inv.data ->> 'ime', ''), new.raw_user_meta_data ->> 'ime', ''),
          case when prvi then 'trener' else 'klijentica' end,
          nullif(inv.data ->> 'paket', ''));
  if ima then
    delete from public.docs where coll = 'pozivnice' and lower(id) = lower(new.email);
  end if;
  return new;
end $$;
create or replace function public.obrisi_klijenta(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_trener() then raise exception 'Nije dozvoljeno.'; end if;
  if exists (select 1 from public.profiles where id = p_id and role = 'trener') then raise exception 'Nije dozvoljeno.'; end if;
  delete from auth.users where id = p_id;
end $$;
grant execute on function public.obrisi_klijenta(uuid) to authenticated;
create or replace function public.postavi_lozinku(p_id uuid, p_lozinka text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_trener() then raise exception 'Nije dozvoljeno.'; end if;
  if exists (select 1 from public.profiles where id = p_id and role = 'trener') then raise exception 'Nije dozvoljeno.'; end if;
  if length(p_lozinka) < 8 then raise exception 'Lozinka je prekratka.'; end if;
  update auth.users set encrypted_password = crypt(p_lozinka, gen_salt('bf')), updated_at = now() where id = p_id;
end $$;
grant execute on function public.postavi_lozinku(uuid, text) to authenticated;
-- Video vježbi postavljen s računara: prijavljene klijentice smiju gledati fajlove iz mape vid/
drop policy if exists chat_vid_read on storage.objects;
create policy chat_vid_read on storage.objects for select to authenticated
  using (bucket_id = 'chat' and (storage.foldername(name))[1] = 'vid');
-- Programi dodijeljeni unaprijed (prije prve prijave): prenose se iz pozivnice u profil pri registraciji
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  inv public.docs%rowtype;
  prvi boolean;
  ima boolean;
  progs text[] := '{}';
  ps jsonb := '{}'::jsonb;
  x text;
begin
  prvi := not exists (select 1 from public.profiles);
  select * into inv from public.docs where coll = 'pozivnice' and lower(id) = lower(new.email) limit 1;
  ima := found;
  if not prvi and not ima then
    raise exception 'Registracija je moguca samo uz pozivnicu.';
  end if;
  if ima and jsonb_typeof(inv.data -> 'programi') = 'array' then
    for x in select jsonb_array_elements_text(inv.data -> 'programi') loop
      progs := array_append(progs, x);
      ps := ps || jsonb_build_object(x, to_char(current_date, 'YYYY-MM-DD'));
    end loop;
  end if;
  insert into public.profiles (id, email, ime, role, paket, programi, pstart)
  values (new.id, new.email,
          coalesce(nullif(inv.data ->> 'ime', ''), new.raw_user_meta_data ->> 'ime', ''),
          case when prvi then 'trener' else 'klijentica' end,
          nullif(inv.data ->> 'paket', ''), progs, ps);
  if ima then
    delete from public.docs where coll = 'pozivnice' and lower(id) = lower(new.email);
  end if;
  return new;
end $$;
