-- FITNESS STUDIO: tabele, sigurnosna pravila i prostor za snimke
-- Pokreni jednom u Supabase: SQL Editor -> New query -> zalijepi -> Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  ime text not null default '',
  telefon text not null default '',
  role text not null default 'klijentica' check (role in ('trener', 'klijentica')),
  programi text[] not null default '{}',
  pstart jsonb not null default '{}'::jsonb,
  paket text,
  jelovnik jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.docs (
  coll text not null,
  id text not null,
  user_id uuid references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (coll, id)
);
create index if not exists docs_user_idx on public.docs (user_id);
create index if not exists docs_coll_idx on public.docs (coll);

create or replace function public.is_trener() returns boolean
language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'trener')
$$;

-- novi račun: prvi koji se registruje postaje trenerica, ostali su klijentice
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, ime, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'ime', ''),
          case when exists (select 1 from public.profiles) then 'klijentica' else 'trener' end);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- klijentica ne može sama sebi promijeniti ulogu, programe ni početak programa
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_trener() then
    new.role := old.role; new.programi := old.programi; new.pstart := old.pstart; new.id := old.id; new.email := old.email;
  end if;
  return new;
end $$;
drop trigger if exists guard_profile_trg on public.profiles;
create trigger guard_profile_trg before update on public.profiles for each row execute function public.guard_profile();

alter table public.profiles enable row level security;
alter table public.docs enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (id = auth.uid() or public.is_trener());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated using (id = auth.uid() or public.is_trener()) with check (id = auth.uid() or public.is_trener());
drop policy if exists profiles_delete on public.profiles;
create policy profiles_delete on public.profiles for delete to authenticated using (public.is_trener());

-- docs: trenerica sve; klijentica samo svoje; 'config' (cijene, nazivi) vide svi
drop policy if exists docs_trener on public.docs;
create policy docs_trener on public.docs for all to authenticated using (public.is_trener()) with check (public.is_trener());
drop policy if exists docs_select_own on public.docs;
create policy docs_select_own on public.docs for select to authenticated using (user_id = auth.uid());
drop policy if exists docs_select_config on public.docs;
create policy docs_select_config on public.docs for select to anon, authenticated using (coll = 'config');
drop policy if exists docs_client_write on public.docs;
create policy docs_client_write on public.docs for insert to authenticated
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi')
              and (coll <> 'chat' or data ->> 'from' = 'klijent'));
drop policy if exists docs_client_update on public.docs;
create policy docs_client_update on public.docs for update to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'))
  with check (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi')
              and (coll <> 'chat' or data ->> 'from' = 'klijent'));
drop policy if exists docs_client_delete on public.docs;
create policy docs_client_delete on public.docs for delete to authenticated
  using (user_id = auth.uid() and coll in ('logs', 'mjere', 'poruke', 'chat', 'zahtjevi'));
-- upiti s početne stranice može poslati i neprijavljena osoba
drop policy if exists docs_prijava_anon on public.docs;
create policy docs_prijava_anon on public.docs for insert to anon, authenticated
  with check (coll = 'prijave' and user_id is null);

-- snimci iz razgovora (glasovne i video poruke)
insert into storage.buckets (id, name, public, file_size_limit)
values ('chat', 'chat', false, 52428800) on conflict (id) do nothing;
drop policy if exists chat_files on storage.objects;
create policy chat_files on storage.objects for all to authenticated
  using (bucket_id = 'chat' and (public.is_trener() or (storage.foldername(name))[1] = auth.uid()::text))
  with check (bucket_id = 'chat' and (public.is_trener() or (storage.foldername(name))[1] = auth.uid()::text));

-- poruke stižu odmah, bez osvježavanja
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when others then null; end $$;
