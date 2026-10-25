/* Slike jela u receptima: trenerica učita fotografiju, klijentice je vide */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, toast, Store } = FS;
  const cache = new Map();
  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const path = (id) => ((Store.db && Store.db.recFoto) || {})[id] || '';

  FS.recFoto = (id) => {
    const p = path(id);
    return h`${p ? h`<div class="recimg" style="margin:10px 0;border-radius:14px;overflow:hidden;background:rgba(255,255,255,.05);aspect-ratio:16/10"><img data-recimg="${p}" alt="" style="width:100%;height:100%;object-fit:cover;display:block"></div>` : ''}
      ${jeT() ? h`<label class="btn sm" style="display:inline-block;margin:6px 0;cursor:pointer">${p ? 'Zamijeni sliku' : 'Dodaj sliku jela'}<input type="file" accept="image/*" data-recup="${id}" style="display:none"></label>${p ? h` <button class="btn sm danger" data-recrm="${id}">Ukloni sliku</button>` : ''}` : ''}`;
  };
  FS.recFotoLoad = (el) => el.querySelectorAll('img[data-recimg]').forEach(async (im) => {
    const p = im.dataset.recimg; let u = cache.get(p);
    if (!u) { const b = await FS.fileStore.get(p); if (!b) return; u = URL.createObjectURL(b); cache.set(p, u); }
    im.src = u;
  });

  const shrink = (file) => new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const r = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob((b) => (b ? res(b) : rej(new Error('x'))), 'image/jpeg', 0.82); };
    im.onerror = () => rej(new Error('x')); im.src = url;
  });
  document.addEventListener('change', async (e) => {
    const t = e.target; if (!t || !t.matches || !t.matches('[data-recup]')) return;
    const f = t.files && t.files[0], id = t.dataset.recup; t.value = ''; if (!f || !jeT()) return;
    if (!/^image\//.test(f.type)) { toast('Izaberi sliku (JPG ili PNG).'); return; }
    toast('Šaljem sliku…');
    try {
      const blob = await shrink(f), p = 'img/rec_' + id + '_' + Date.now() + '.jpg';
      await FS.fileStore.put(p, blob);
      const old = path(id); Store.db.recFoto = Store.db.recFoto || {}; Store.db.recFoto[id] = p; if (old) FS.fileStore.del(old);
      Store.save(); toast('Slika je dodata.'); FS.rerender();
    } catch (er) { toast('Slika nije poslana. Provjeri internet i pokušaj opet.'); }
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-recrm]'); if (!b || !jeT()) return;
    const id = b.dataset.recrm, old = path(id); if (old) FS.fileStore.del(old); if (Store.db.recFoto) delete Store.db.recFoto[id]; Store.save(); FS.rerender();
  });
})();
