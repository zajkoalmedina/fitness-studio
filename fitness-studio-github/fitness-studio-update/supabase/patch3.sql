-- FITNESS STUDIO: dopuna 3 (upitnik i PDF vodič). Sigurno je pokrenuti više puta.
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
