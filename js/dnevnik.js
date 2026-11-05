/* Podsjetnici, voda i koraci, fotografije napretka (sve se čuva u profilu klijentice) */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, toast, Store, Auth, today, addDays, fmtDate } = FS;
  const J = (u) => (u.jelovnik = u.jelovnik || { cilj: 1800, dani: {} });
  const D = (u) => { const j = J(u); j.dnevno = j.dnevno || {}; return j; };
  const cache = new Map();

  /* ---------- podsjetnici ---------- */
  FS.podsjetnikCard = (u) => {
    const t = today(), L = [];
    const rasp = (Store.db.raspored || []).find((e) => e.userId === u.id && e.datum === t && e.tip === 'dan');
    const radila = Store.db.logs.some((l) => l.userId === u.id && l.datum === t);
    const pr = rasp && Store.program(rasp.programId);
    if (rasp && pr && !radila && FS.access(u, pr).on) { const dn = pr.dani[rasp.dan]; L.push(h`<div class="row between" style="padding:6px 0"><span>🏋️ Danas je trening: <b>${dn ? dn.naziv : pr.naziv}</b></span><a class="btn sm primary" href="#/trening/novi?p=${pr.id}&d=${rasp.dan}&w=${FS.currentWeek(u, pr)}">Započni</a></div>`); }
    const mj = (Store.db.mjere || []).filter((m) => m.userId === u.id && m.tezina).sort((a, b) => (a.datum < b.datum ? 1 : -1))[0];
    if (mj && mj.datum <= addDays(t, -7)) L.push(h`<div class="row between" style="padding:6px 0"><span>⚖️ Zadnje vaganje: ${fmtDate(mj.datum)}</span><a class="btn sm" href="#/moj?tab=napredak">Upiši</a></div>`);
    const dow = (new Date().getDay() + 6) % 7;
    if (dow >= 3 && Store.weekCount(u.id) === 0 && !rasp) L.push(h`<div class="row between" style="padding:6px 0"><span>📅 Ove sedmice još nisi trenirala</span><a class="btn sm" href="#/trening/novi">Novi trening</a></div>`);
    if (!L.length) return '';
    return h`<div class="card"><div class="eyebrow">Podsjetnik</div>${L}</div>`;
  };

  /* ---------- voda i koraci ---------- */
  FS.vodaCard = (u) => {
    const t = today(), d = D(u).dnevno[t] || { c: 0, k: 0 }, CILJ = 8;
    const days = Array.from({ length: 7 }, (_, i) => addDays(t, i - 6)), rec = (x) => D(u).dnevno[x] || { c: 0, k: 0 };
    const bar = (v, max) => h`<i style="display:block;width:100%;height:${Math.min(100, Math.round((v / max) * 100))}%;background:var(--beige);border-radius:4px"></i>`;
    return h`<div class="card"><h3 style="margin-top:0">Voda i koraci danas</h3>
      <div class="row between"><div><b style="font-size:26px">${d.c}</b> <span class="small">/ ${CILJ} čaša (≈ ${(CILJ * 0.25).toFixed(1).replace('.', ',')} l)</span></div>
        <div class="row"><button class="btn sm" data-voda="-1" aria-label="Manje vode">−</button><button class="btn sm primary" data-voda="1">+ čaša</button></div></div>
      <div class="progress mt-s"><i style="width:${Math.min(100, (d.c / CILJ) * 100)}%"></i></div>
      <label class="field mt-s"><span>Koraci danas</span><input data-koraci inputmode="numeric" value="${d.k || ''}" placeholder="npr. 8000"></label>
      <div class="row" style="align-items:flex-end;height:60px;gap:6px;margin-top:8px">${days.map((x) => h`<div style="flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center"><div style="width:100%;height:42px;display:flex;align-items:flex-end">${bar(rec(x).c, CILJ)}</div><span class="small" style="font-size:10px">${x.slice(8)}.</span></div>`)}</div>
      <p class="small muted" style="margin:4px 0 0">Zadnjih 7 dana (čaše vode). Potrebe za tečnošću zavise od tebe, vrućine i treninga.</p></div>`;
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-voda]'); if (!b) return;
    const u = Auth.user(); if (!u || u.role !== 'klijentica') return;
    const t = today(), dn = D(u).dnevno; dn[t] = dn[t] || { c: 0, k: 0 }; dn[t].c = Math.max(0, Math.min(30, dn[t].c + +b.dataset.voda));
    Store.save(); FS.rerender();
  });
  document.addEventListener('change', (e) => {
    const i = e.target; if (!i || !i.matches || !i.matches('[data-koraci]')) return;
    const u = Auth.user(); if (!u || u.role !== 'klijentica') return;
    const v = Math.round(FS.num(i.value)) || 0, t = today(), dn = D(u).dnevno; dn[t] = dn[t] || { c: 0, k: 0 };
    if (v < 0 || v > 100000) { toast('Unesi koraka između 0 i 100000.'); return; }
    dn[t].k = v; Store.save(); toast('Koraci sačuvani.');
  });

  /* ---------- fotografije napretka ---------- */
  const shrink = (file) => new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const r = Math.min(1, 1000 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * r); c.height = Math.round(im.height * r); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob((b) => (b ? res(b) : rej(new Error('x'))), 'image/jpeg', 0.82); };
    im.onerror = () => rej(new Error('x')); im.src = url;
  });
  const POZE = [['sprijeda', 'Sprijeda'], ['bok', 'Sa boka'], ['ledja', 'Odostraga']];
  const jeT = () => { const x = Auth.user(); return !!x && x.role === 'trener'; };
  const primjer = (k) => ((Store.db.fotoPrimjer || {})[k]) || '';
  FS.fotoCard = (u, ro) => {
    const list = ((u.jelovnik || {}).foto || []).slice().sort((a, b) => (a.d < b.d ? 1 : -1));
    const poz = (k) => POZE.find((x) => x[0] === k);
    const vodic = (!ro || jeT()) ? h`<div class="card flat"><b>Kako se slikati</b>
      <div class="grid3 mt-s" style="gap:8px">${POZE.map(([k, l]) => h`<div class="center"><div style="border-radius:12px;overflow:hidden;background:rgba(217,79,107,.1);aspect-ratio:3/4;display:grid;place-items:center">${primjer(k) ? h`<img data-fotoimg="${primjer(k)}" alt="Primjer: ${l}" style="width:100%;height:100%;object-fit:cover;display:block">` : h`<span class="small muted">primjer uskoro</span>`}</div>
        <div class="small"><b>${l}</b></div>${jeT() ? h`<label class="btn sm" style="display:block;margin-top:4px;cursor:pointer">${primjer(k) ? 'Zamijeni' : 'Dodaj primjer'}<input type="file" accept="image/*" data-fotoprimjer="${k}" style="display:none"></label>` : ''}</div>`)}</div>
      <ul class="clean small mt-s"><li><span class="tick">✓</span><span><b>Ista svjetlost:</b> isto mjesto, isto doba dana, svjetlo ispred tebe, a ne iza.</span></li>
        <li><span class="tick">✓</span><span><b>Ista odjeća:</b> svaki put isti sportski top i tajice (ili veš).</span></li>
        <li><span class="tick">✓</span><span>Telefon na visini struka, oko 2 metra od tebe, cijelo tijelo u kadru.</span></li>
        <li><span class="tick">✓</span><span>Opušteno stoj, ruke uz tijelo, bez uvlačenja stomaka. Kosa skupljena.</span></li></ul></div>` : '';
    return h`<div class="card"><h3 style="margin-top:0">Fotografije napretka</h3>
      <p class="small muted">${ro ? 'Vidi ih samo klijent(ica) i ti.' : 'Vidiš ih samo ti i trenerica. Svaki put po tri fotografije: sprijeda, sa boka i odostraga.'}</p>
      ${vodic}
      ${ro ? '' : h`<div class="row wrap" style="gap:8px">${POZE.map(([k, l]) => h`<label class="btn sm primary" style="cursor:pointer">+ ${l}<input type="file" accept="image/*" data-fotoup="${u.id}" data-pos="${k}" style="display:none"></label>`)}</div>`}
      <div class="grid2 mt-s">${list.map((f) => h`<div><div style="border-radius:12px;overflow:hidden;background:rgba(255,255,255,.05);aspect-ratio:3/4"><img data-fotoimg="${f.p}" alt="Napredak ${fmtDate(f.d)}" style="width:100%;height:100%;object-fit:cover;display:block"></div>
        <div class="row between small" style="margin-top:4px"><span>${fmtDate(f.d)}${f.pos && poz(f.pos) ? ' · ' + poz(f.pos)[1] : ''}</span>${ro ? '' : h`<button class="icon-btn" data-fotorm="${f.p}" aria-label="Obriši fotografiju">✕</button>`}</div></div>`)}</div>
      ${list.length ? '' : h`<p class="muted small">Još nema fotografija.</p>`}</div>`;
  };
  FS.fotoLoad = (el) => el.querySelectorAll('img[data-fotoimg]').forEach(async (im) => {
    const p = im.dataset.fotoimg; let u = cache.get(p);
    if (!u) { try { const b = await FS.fileStore.get(p); if (!b) return; u = URL.createObjectURL(b); cache.set(p, u); } catch (e) { return; } }
    im.src = u;
  });
  document.addEventListener('change', async (e) => {
    const t = e.target; if (!t || !t.matches || !t.matches('[data-fotoup]')) return;
    const u = Auth.user(), f = t.files && t.files[0]; t.value = ''; if (!u || !f || u.id !== t.dataset.fotoup) return;
    if (!/^image\//.test(f.type)) { toast('Izaberi sliku (JPG ili PNG).'); return; }
    toast('Šaljem fotografiju…');
    try {
      const blob = await shrink(f), p = u.id + '/napredak/' + Date.now() + '.jpg';
      await FS.fileStore.put(p, blob);
      const j = D(u); j.foto = j.foto || []; j.foto.push({ d: today(), p, pos: t.dataset.pos || '' }); Store.save(); toast('Fotografija je dodata.'); FS.rerender();
    } catch (er) { toast('Fotografija nije poslana. Provjeri internet i pokušaj opet.'); }
  });
  document.addEventListener('change', async (e) => {
    const t = e.target; if (!t || !t.matches || !t.matches('[data-fotoprimjer]')) return;
    const f = t.files && t.files[0], k = t.dataset.fotoprimjer; t.value = ''; if (!f || !jeT()) return;
    if (!/^image\//.test(f.type)) { toast('Izaberi sliku (JPG ili PNG).'); return; }
    toast('Šaljem sliku…');
    try {
      const blob = await shrink(f), p = 'img/foto_primjer_' + k + '_' + Date.now() + '.jpg';
      await FS.fileStore.put(p, blob);
      const old = primjer(k); Store.db.fotoPrimjer = Store.db.fotoPrimjer || {}; Store.db.fotoPrimjer[k] = p; if (old) FS.fileStore.del(old);
      Store.save(); toast('Primjer je dodat.'); FS.rerender();
    } catch (er) { toast('Slika nije poslana. Provjeri internet i pokušaj opet.'); }
  });
  document.addEventListener('click', async (e) => {
    const b = e.target.closest && e.target.closest('[data-fotorm]'); if (!b) return;
    const u = Auth.user(); if (!u) return;
    if (!(await FS.confirmSheet({ title: 'Obrisati fotografiju?', text: 'Ova radnja se ne može poništiti.', ok: 'Obriši', danger: true }))) return;
    const j = D(u); j.foto = (j.foto || []).filter((f) => f.p !== b.dataset.fotorm); FS.fileStore.del(b.dataset.fotorm); Store.save(); FS.rerender();
  });
  new MutationObserver(() => { const app = document.getElementById('app') || document.body; if (app.querySelector && app.querySelector('img[data-fotoimg]:not([src])')) FS.fotoLoad(app); }).observe(document.body, { childList: true, subtree: true });
})();
