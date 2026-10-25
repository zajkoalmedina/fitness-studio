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
