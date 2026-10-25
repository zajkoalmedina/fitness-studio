-- FITNESS STUDIO: registracija samo uz pozivnicu (prvi račun je trenerica). Sigurno je pokrenuti više puta.
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

-- brisanje računa klijenta (potpuno, uključujući prijavu)
create or replace function public.obrisi_klijenta(p_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_trener() then raise exception 'Nije dozvoljeno.'; end if;
  if exists (select 1 from public.profiles where id = p_id and role = 'trener') then raise exception 'Nije dozvoljeno.'; end if;
  delete from auth.users where id = p_id;
end $$;
grant execute on function public.obrisi_klijenta(uuid) to authenticated;

-- trenerica postavlja novu privremenu lozinku klijentu
create or replace function public.postavi_lozinku(p_id uuid, p_lozinka text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_trener() then raise exception 'Nije dozvoljeno.'; end if;
  if exists (select 1 from public.profiles where id = p_id and role = 'trener') then raise exception 'Nije dozvoljeno.'; end if;
  if length(p_lozinka) < 8 then raise exception 'Lozinka je prekratka.'; end if;
  update auth.users set encrypted_password = crypt(p_lozinka, gen_salt('bf')), updated_at = now() where id = p_id;
end $$;
grant execute on function public.postavi_lozinku(uuid, text) to authenticated;
