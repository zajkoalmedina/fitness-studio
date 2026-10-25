-- Video vježbi postavljen s računara: prijavljene klijentice smiju gledati fajlove iz mape vid/
drop policy if exists chat_vid_read on storage.objects;
create policy chat_vid_read on storage.objects for select to authenticated
  using (bucket_id = 'chat' and (storage.foldername(name))[1] = 'vid');
