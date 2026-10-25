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
