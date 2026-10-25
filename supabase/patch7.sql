-- Slike jela u receptima: prijavljene klijentice smiju gledati fajlove iz mape img/
drop policy if exists chat_img_read on storage.objects;
create policy chat_img_read on storage.objects for select to authenticated
  using (bucket_id = 'chat' and (storage.foldername(name))[1] = 'img');
