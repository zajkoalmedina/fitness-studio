/* Trenerski panel: pregled, klijentice, programi, narudžbe, upiti, vježbe */
(function () {
  const FS = (window.FS = window.FS || {});
  FS.views = FS.views || {};
  const V = FS.views;
  const { h, raw, icon, bind, formData, opts, toast, openSheet, closeSheet, confirmSheet, Store, Auth, config, num, r1, fmtDate, today, uid, $, $$, weekStart } = FS;
  const go = (hash) => { location.hash = hash; };
  const TABS = [['pregled', 'Pregled'], ['klijentice', 'Klijenti'], ['programi', 'Programi'], ['uplate', 'Uplate'], ['narudzbe', 'Narudžbe'], ['upiti', 'Upiti'], ['vjezbe', 'Vježbe']];
  const nav = (tab) => h`<div class="chips">${TABS.map(([k, l]) => h`<a class="chip ${tab === k ? 'on' : ''}" href="#/trener?tab=${k}">${l}</a>`)}</div>`;
  const nameOf = (id) => { const u = Store.user(id); return u ? u.ime : '(izbrisan račun)'; };
  const isUrl = (s) => !s || /^https:\/\/[^\s]+$/i.test(s);
  const newCount = () => FS.chat.unread('trener') + (Store.db.upitnici || []).filter((x) => !x.tip && !x.vid).length + (Store.db.zahtjevi || []).filter((z) => z.status === 'novo').length + Store.db.poruke.filter((m) => m.status === 'novo').length + Store.db.prijave.filter((m) => m.status === 'novo').length;

  /* ================= PANEL ================= */
  V.trener = (el, p, q) => {
    const tab = TABS.some(([k]) => k === q.tab) ? q.tab : 'pregled';
    const kl = Store.klijentice();
    let body = '';

    if (tab === 'pregled') {
      const wk = weekStart(today()), wkEnd = FS.addDays(wk, 6);
      const week = Store.db.logs.filter((l) => l.datum >= wk && l.datum <= wkEnd).length;
      const monthly = kl.filter((u) => u.aktivan !== false && u.paket).reduce((s, u) => s + (FS.paketi().find((x) => x.id === u.paket) || { cijena: 0 }).cijena, 0);
      const sales = Store.db.kupovine.reduce((s, k) => s + (k.iznos || 0), 0);
      const recent = Store.db.logs.slice().sort((a, b) => (a.datum < b.datum ? 1 : -1)).slice(0, 8);
      body = h`<div class="stats"><div class="stat"><b>${kl.filter((u) => u.aktivan !== false).length}</b><span>aktivnih klijenata</span></div><div class="stat"><b>${week}</b><span>treninga ove sedmice</span></div><div class="stat"><b>${newCount()}</b><span>novih upita</span></div></div>
        ${config.demo ? h`<div class="demo-bar">Iznosi su procjena iz demo podataka, bez stvarnih uplata</div>` : ''}
        <div class="grid2"><div class="card"><div class="small">Coaching mjesečno</div><div class="big" style="font-size:30px">${monthly} ${config.valuta}</div></div><div class="card"><div class="small">Prodaja programa</div><div class="big" style="font-size:30px">${sales} ${config.valuta}</div></div></div>
        <h3>Nedavna aktivnost</h3>
        ${recent.length ? recent.map((l) => h`<a class="ex" href="#/trener/klijentica/${l.userId}"><div class="ph">${icon('dumbbell')}</div><div class="grow"><b>${nameOf(l.userId)}</b><div class="small">${fmtDate(l.datum)} · ${l.dan || 'Slobodan trening'} · ${l.trajanje || '–'} min</div></div></a>`) : h`<div class="empty">Još nema treninga.</div>`}`;
    }

    if (tab === 'klijentice') {
      body = h`<button class="btn primary block mb" data-act="newc">${icon('plus')} ${FS.cloud ? 'Pozovi klijenta / klijenticu' : 'Novi klijent / klijentica'}</button>
        ${FS.cloud && FS.pozivnicePending ? FS.pozivnicePending() : ''}
        ${kl.length ? kl.map((u) => { const last = Store.logsOf(u.id)[0], target = u.paket ? config.ciljPoPaketu[u.paket] : null;
          return h`<a class="ex" href="#/trener/klijentica/${u.id}"><div class="avatar" style="width:46px;height:46px">${FS.initials(u.ime)}</div><div class="grow"><b>${u.ime}</b><div class="small">${u.paket || 'bez paketa'}${FS.payTag(u)}${u.aktivan === false ? ' · neaktivan/na' : ''} · ${last ? 'zadnji trening ' + fmtDate(last.datum) : 'nema treninga'}</div></div>${target ? h`<span class="badge">${Store.weekCount(u.id)}/${target}</span>` : ''}</a>`; }) : h`<div class="empty">Još nema klijentica.</div>`}`;
    }

    if (tab === 'uplate') body = FS.uplateTab();

    if (tab === 'programi') {
      body = h`${FS.pdfCard()}${FS.postavkeCard()}<div class="card"><h3>Cjenovnik paketa (mjesečno, ${config.valuta})</h3><form data-act="cijene" novalidate><div class="grid3">${FS.paketi().map((x) => h`<label class="field" style="margin:0"><span>${x.id}</span><input name="${x.id}" inputmode="decimal" value="${x.cijena}"></label>`)}</div><p class="small mt-s">Naziv i cijenu svakog gotovog programa mijenjaš ispod, u uređivanju programa.</p><button class="btn sm primary" type="submit">Sačuvaj cijene</button></form></div>
        <a class="btn primary block mb" href="#/trener/program/novi">${icon('plus')} Novi program</a>
        ${Store.allPrograms().map((pr) => h`<a class="ex" href="#/trener/program/${pr.id}"><div class="ph">${icon('clipboard')}</div><div class="grow"><b>${pr.naziv}</b><div class="small">${pr.tip === 'individualni' ? 'individualni' : 'gotov'} · ${pr.dani.length} dana${pr.uShopu ? ' · u prodaji ' + pr.cijena + ' ' + config.valuta : ''}</div></div></a>`)}`;
    }

    if (tab === 'narudzbe') {
      const zq = (Store.db.zahtjevi || []).filter((z) => z.status === 'novo').sort((a, b) => b.ts - a.ts);
      const zh = FS.cloud ? h`<h3>Zahtjevi za kupovinu</h3>${zq.length ? zq.map((z) => { const pr = Store.program(z.programId); return h`<div class="card flat"><div class="row between"><b>${nameOf(z.userId)}</b><span class="badge warn">čeka uplatu</span></div><div class="small">${fmtDate(z.datum)} · ${pr ? pr.naziv : z.programId} · ${z.iznos} ${config.valuta}</div><div class="row mt-s"><button class="btn sm primary grow" data-act="zok" data-id="${z.id}">Uplata stigla – otključaj</button><button class="btn sm danger" data-act="zno" data-id="${z.id}" aria-label="Odbij">${icon('trash')}</button></div></div>`; }) : h`<div class="empty">Nema novih zahtjeva.</div>`}` : '';
      body = h`${FS.pwRequests ? FS.pwRequests() : ''}${zh}<h3 class="mt">Kupovine programa</h3>${config.demo ? h`<div class="demo-bar">Demo kupovine – bez stvarnih uplata</div>` : ''}
        ${Store.db.kupovine.length ? Store.db.kupovine.slice().reverse().map((k) => { const pr = Store.program(k.programId); return h`<div class="kv"><span>${fmtDate(k.datum)} · ${nameOf(k.userId)}<br><span class="small">${pr ? pr.naziv : k.programId}</span></span><b>${k.iznos} ${config.valuta}</b></div>`; }) : h`<div class="empty">Nema kupovina.</div>`}
        <h3 class="mt">Prijave na pakete</h3>
        ${Store.db.prijave.filter((r) => r.tip !== 'lozinka').length ? Store.db.prijave.filter((r) => r.tip !== 'lozinka').slice().reverse().map((r) => h`<div class="card flat"><div class="row between"><b>${r.ime}</b><span class="badge ${r.status === 'novo' ? 'warn' : 'ok'}">${r.status === 'novo' ? 'novo' : 'obrađeno'}</span></div><div class="small">${fmtDate(r.datum)} · ${r.paket || 'bez paketa'}</div><div>${r.kontakt}</div>${r.tekst ? h`<p class="muted mt-s" style="margin-bottom:8px">${r.tekst}</p>` : ''}
          <div class="row mt-s">${r.status === 'novo' ? h`<button class="btn sm grow" data-act="lead-done" data-id="${r.id}">Označi obrađeno</button>` : ''}<button class="btn sm danger" data-act="lead-del" data-id="${r.id}" aria-label="Obriši">${icon('trash')}</button></div></div>`) : h`<div class="empty">Nema prijava.</div>`}`;
    }

    if (tab === 'upiti') {
      const th = {}; (Store.db.chat || []).forEach((m) => { (th[m.userId] = th[m.userId] || []).push(m); });
      const chatRows = Object.entries(th).map(([id, a]) => { a.sort((x, y) => y.ts - x.ts); return { id, last: a[0], n: a.filter((m) => m.from === 'klijent' && !m.read).length }; }).sort((x, y) => y.last.ts - x.last.ts);
      var chatHtml = chatRows.length ? h`<h3>Razgovori</h3>${chatRows.map((r) => h`<a class="card row between" href="#/trener/klijentica/${r.id}"><span><b>${nameOf(r.id)}</b><br><span class="small">${r.last.media ? (r.last.media.kind === 'video' ? 'Video' : 'Glasovna poruka') : r.last.tekst.slice(0, 60)}</span></span>${r.n ? h`<span class="badge warn">${r.n} nova</span>` : ''}</a>`)}<h3 class="mt">Upiti</h3>` : '';
      const ms = Store.db.poruke.slice().sort((a, b) => (a.status === b.status ? (a.datum < b.datum ? 1 : -1) : a.status === 'novo' ? -1 : 1));
      body = h`${chatHtml}${ms.length ? ms.map((m) => h`<details class="card" ${m.status === 'novo' ? 'open' : ''}><summary style="cursor:pointer"><div class="row between"><b>${nameOf(m.userId)}</b><span class="badge ${m.status === 'novo' ? 'warn' : 'ok'}">${m.status === 'novo' ? 'novo' : 'odgovoreno'}</span></div><div class="small">${fmtDate(m.datum)} · ${m.tip === 'dijastaza' ? 'dijastaza – prilagodba' : 'upit'}</div></summary>
        <p class="mt-s">${m.tekst}</p>${m.odgovor ? h`<div class="card cream"><b>Tvoj odgovor:</b><br>${m.odgovor}</div>` : ''}
        <form data-act="reply" data-id="${m.id}" novalidate><label class="field"><span>${m.odgovor ? 'Izmijeni odgovor' : 'Odgovor'}</span><textarea name="t" maxlength="1500"></textarea></label><button class="btn primary sm" type="submit">Pošalji odgovor</button> <a class="btn sm" href="#/trener/klijentica/${m.userId}">Profil klijentice</a></form></details>`) : h`<div class="empty">Nema upita.</div>`}`;
    }

    if (tab === 'vjezbe') {
      body = h`<button class="btn primary block mb" data-act="newex">${icon('plus')} Nova vježba</button>
        <p class="small">Klikni vježbu pa učitaj video s računara (MP4, MOV, WebM do 50 MB) ili zalijepi link.</p>
        ${Store.exercises().map((e) => h`<button class="ex" style="width:100%;text-align:left;font:inherit" data-act="editex" data-id="${e.id}"><div class="ph">${icon(e.video ? 'play' : 'dumbbell')}</div><div class="grow"><b>${e.naziv}</b><div class="small">${e.grupa} · ${e.video ? 'video dodan' : 'bez videa'}</div></div>${icon('edit')}</button>`)}`;
    }

    el.innerHTML = h`<div class="eyebrow">Trenerski panel</div><h1>Zdravo, ${Auth.user().ime.split(' ')[0]}</h1>${nav(tab)}${body}
      <div class="row mt"><button class="btn sm grow" data-act="out">Odjava</button>${config.demo ? h`<button class="btn sm grow danger" data-act="reset">Resetuj demo podatke</button>` : ''}</div>`;

    const rr = () => FS.rerender();
    bind(el, {
      'click:out': () => { Auth.logout(); FS.refreshNav(); go('#/'); },
      'click:reset': async () => { if (await confirmSheet({ title: 'Resetovati demo podatke?', text: 'Svi lokalni podaci aplikacije bit će vraćeni na početno stanje i bit ćeš odjavljena.', ok: 'Resetuj', danger: true })) { await Store.reset(); FS.refreshNav(); toast('Demo podaci vraćeni.'); go('#/'); } },
      'click:newc': () => FS.cloud ? FS.inviteSheet(rr) : openSheet(h`<h2>Novi klijent / klijentica</h2><form data-act="addc" novalidate>
          <label class="field"><span>Ime i prezime</span><input name="ime" autocomplete="off"></label><label class="field"><span>E-mail</span><input name="email" type="email" autocapitalize="off" autocomplete="off"></label>
          <label class="field"><span>Privremena lozinka</span><input name="pass" autocomplete="off"></label><label class="field"><span>Paket</span><select name="paket">${opts([['', 'Bez paketa'], 'START', 'ACTIVE', 'STRONG'])}</select></label>
          <p class="err" id="cerr" hidden></p><button class="btn primary block" type="submit">Napravi račun</button></form>`, (s) => bind(s, {
        'submit:addc': async (f) => { try { await Auth.createClient(formData(f)); closeSheet(); toast('Račun napravljen. Podijeli e-mail i privremenu lozinku s klijenticom.'); rr(); } catch (e) { const er = $('#cerr', s); er.textContent = e.message; er.hidden = false; } }
      })),
      'click:zok': (b) => { const z = Store.db.zahtjevi.find((x) => x.id === b.dataset.id), cu = Store.user(z.userId); if (cu) { if (!cu.programi.includes(z.programId)) cu.programi.push(z.programId); (cu.pstart = cu.pstart || {})[z.programId] = today(); Store.db.kupovine.push({ id: uid(), userId: z.userId, programId: z.programId, datum: today(), iznos: z.iznos }); } z.status = 'odobreno'; Store.save(); toast('Program otključan.'); rr(); },
      'click:zno': (b) => { const z = Store.db.zahtjevi.find((x) => x.id === b.dataset.id); z.status = 'odbijeno'; Store.save(); rr(); },
      'click:lead-done': (b) => { Store.db.prijave.find((x) => x.id === b.dataset.id).status = 'obradjeno'; Store.save(); rr(); },
      'click:lead-del': async (b) => { if (await confirmSheet({ title: 'Obrisati prijavu?', text: 'Ne može se vratiti.', ok: 'Obriši', danger: true })) { Store.db.prijave = Store.db.prijave.filter((x) => x.id !== b.dataset.id); Store.save(); rr(); } },
      'submit:reply': (f) => {
        const t = String(formData(f).t || '').trim(); if (t.length < 2) { toast('Napiši odgovor.'); return; }
        const m = Store.db.poruke.find((x) => x.id === f.dataset.id); m.odgovor = t.slice(0, 1500); m.status = 'obradjeno'; Store.save(); toast('Odgovor poslan.'); rr();
      },
      'click:newex': () => exSheet(null, rr),
      'submit:cijene': (f) => { const d = formData(f); const o = {}; for (const x of FS.PAKETI) { const v = num(d[x.id]); if (isNaN(v) || v < 0 || v > 5000) { toast('Unesi ispravne cijene.'); return; } o[x.id] = v; } Store.db.cijene = o; Store.save(); toast('Cijene su sačuvane.'); rr(); },
      'click:editex': (b) => exSheet(Store.ex(b.dataset.id), rr)
    });
  };

  function exSheet(e, done) {
    const custom = !e || (Store.db.vjezbeNove || []).some((x) => x.id === e.id);
    openSheet(h`<h2>${e ? 'Uredi vježbu' : 'Nova vježba'}</h2><form data-act="sx" novalidate>
      ${custom ? h`<label class="field"><span>Naziv</span><input name="naziv" value="${e ? e.naziv : ''}"></label>
        <div class="grid2"><label class="field"><span>Grupa</span><select name="grupa">${opts(FS.GRUPE, e ? e.grupa : 'Noge')}</select></label><label class="field"><span>Nivo</span><select name="nivo">${opts(FS.NIVOI, e ? e.nivo : 'početni')}</select></label></div>
        <label class="field"><span>Oprema</span><input name="oprema" value="${e ? e.oprema : 'Bez opreme'}"></label>
        <label class="field"><span>Dijastaza</span><select name="dij">${opts([['da', FS.DIJ_LABEL.da], ['kasnije', FS.DIJ_LABEL.kasnije], ['ne', FS.DIJ_LABEL.ne]], e ? e.dij : 'kasnije')}</select></label>
        <label class="field"><span>Koraci (jedan po redu)</span><textarea name="koraci">${e ? e.koraci.join('\n') : ''}</textarea></label>
        <label class="field"><span>Savjeti (jedan po redu)</span><textarea name="savjeti">${e ? e.savjeti.join('\n') : ''}</textarea></label>` : h`<p class="muted">${e.naziv}</p>`}
      <div class="card flat"><b>Video s računara</b>${e && /^fs:/.test(e.video || '') ? h`<div class="small mt-s">Video je već postavljen.</div><label class="check"><input type="checkbox" name="rmvid" value="1"><span>Ukloni video</span></label>` : ''}
        <p class="small muted mt-s">Izaberi snimak (MP4, MOV ili WebM, najviše 50 MB). Za duže snimke prvo ih smanji.</p><input type="file" name="vfile" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"></div>
      <label class="field"><span>Ili video link (https://…)</span><input name="video" inputmode="url" autocapitalize="off" value="${e && !/^fs:/.test(e.video || '') ? e.video || '' : ''}" placeholder="https://www.youtube.com/watch?v=…"></label>
      <p class="err" id="xerr" hidden></p><button class="btn primary block" type="submit">Sačuvaj</button>
      ${e && custom ? h`<button class="btn danger block mt-s" type="button" data-act="dx">Obriši vježbu</button>` : ''}</form>`, (s) => bind(s, {
      'click:dx': async () => { if (await confirmSheet({ title: 'Obrisati vježbu?', text: 'Vježba će nestati iz biblioteke.', ok: 'Obriši', danger: true })) { Store.db.vjezbeNove = Store.db.vjezbeNove.filter((x) => x.id !== e.id); Store.save(); closeSheet(); done(); } },
      'submit:sx': async (f) => {
        const d = formData(f), er = $('#xerr', s), bad = (m) => { er.textContent = m; er.hidden = false; };
        let video = String(d.video || '').trim();
        if (!isUrl(video)) return bad('Link mora počinjati s https://');
        const file = f.querySelector('input[name=vfile]') && f.querySelector('input[name=vfile]').files[0];
        const oldFs = e && /^fs:/.test(e.video || '') ? e.video : '';
        if (file) {
          if (!/^video\//.test(file.type) && !/\.(mp4|mov|webm)$/i.test(file.name)) return bad('Izaberi video fajl (MP4, MOV ili WebM).');
          if (file.size > 50 * 1048576) return bad('Video je prevelik (najviše 50 MB). Smanji ga pa pokušaj opet.');
          const btn = f.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Šaljem video…';
          const ext = (file.name.match(/\.(mp4|mov|webm)$/i) || ['', 'mp4'])[1] ? '.' + (file.name.match(/\.(mp4|mov|webm)$/i) || ['', 'mp4'])[1].toLowerCase() : '.mp4';
          const pth = 'vid/' + (e ? e.id : 'n' + Date.now()) + '_' + Date.now() + ext;
          try { await FS.fileStore.put(pth, file); } catch (x) { btn.disabled = false; btn.textContent = 'Sačuvaj'; return bad('Video nije poslan. Provjeri internet.'); }
          video = 'fs:' + pth;
        } else if (!video && oldFs && !d.rmvid) video = oldFs;
        if (oldFs && video !== oldFs) FS.fileStore.del(oldFs.slice(3));
        if (custom) {
          if (String(d.naziv).trim().length < 2) return bad('Unesi naziv vježbe.');
          const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean);
          const koraci = lines(d.koraci); if (!koraci.length) return bad('Dodaj barem jedan korak.');
          const obj = { id: e ? e.id : 'c_' + uid(), naziv: d.naziv.trim().slice(0, 80), grupa: d.grupa, nivo: d.nivo, oprema: String(d.oprema || '').slice(0, 60), dij: d.dij, koraci, savjeti: lines(d.savjeti), greske: e ? e.greske || [] : [], video };
          Store.db.vjezbeNove = Store.db.vjezbeNove || [];
          const i = Store.db.vjezbeNove.findIndex((x) => x.id === obj.id);
          if (i >= 0) Store.db.vjezbeNove[i] = obj; else Store.db.vjezbeNove.push(obj);
        } else { Store.db.vjezbeMod = Store.db.vjezbeMod || {}; Store.db.vjezbeMod[e.id] = { video }; }
        Store.save(); closeSheet(); toast('Vježba sačuvana.'); done();
      }
    }));
  }

  /* ================= PROFIL KLIJENTICE ================= */
  V.trener_klijentica = (el, p) => {
    const u = Store.user(p.id);
    if (!u || u.role !== 'klijentica') { el.innerHTML = h`<div class="empty">Klijentica nije pronađena.</div><a class="btn block" href="#/trener?tab=klijentice">Nazad</a>`; return; }
    const logs = Store.logsOf(u.id), mj = Store.mjereOf(u.id), msgs = Store.db.poruke.filter((m) => m.userId === u.id).sort((a, b) => (a.datum < b.datum ? 1 : -1));
    const assignable = Store.allPrograms().filter((x) => !(u.programi || []).includes(x.id));
    const wpts = mj.filter((m) => m.tezina).map((m) => ({ x: m.datum, y: m.tezina }));
    el.innerHTML = h`<a href="#/trener?tab=klijentice" class="small">← Sve klijentice</a>
      <div class="user-chip mb mt-s"><div class="avatar">${FS.initials(u.ime)}</div><div class="grow"><h1 style="margin:0;font-size:26px">${u.ime}</h1><div class="small">${u.email} · od ${fmtDate(u.kreirano)}${u.dob === '16-17' ? ' · 16–17 god. (saglasnost: ' + (u.saglasnost ? 'da' : 'ne') + ')' : ''}</div></div></div>
      <div class="card"><div class="grid2"><label class="field" style="margin:0"><span>Paket</span><select data-act="paket">${opts([['', 'Bez paketa'], 'START', 'ACTIVE', 'STRONG'], u.paket || '')}</select></label>
        <label class="field" style="margin:0"><span>Status računa</span><select data-act="status">${opts([['1', 'Aktivna'], ['0', 'Neaktivna (bez prijave)']], u.aktivan === false ? '0' : '1')}</select></label></div></div>
      <div class="stats"><div class="stat"><b>${logs.length}</b><span>treninga</span></div><div class="stat"><b>${Store.weekCount(u.id)}</b><span>ove sedmice</span></div><div class="stat"><b>${wpts.length ? wpts[wpts.length - 1].y : '–'}</b><span>težina (kg)</span></div></div>
      <div class="card"><h3>Programi klijenta / klijentice</h3>
        ${Store.userPrograms(u).map((x) => h`<div class="row between" style="padding:6px 0"><a href="#/program/${x.id}" class="grow"><b style="color:var(--cream)">${x.naziv}</b><div class="small">${FS.accessLabel(x, u)}</div></a>${FS.access(u, x).trajno ? '' : h`<button class="btn sm" data-act="renew" data-id="${x.id}">Produži</button>`}<button class="icon-btn" data-act="unassign" data-id="${x.id}" aria-label="Ukloni">${icon('trash')}</button></div>`)}
        ${(u.programi || []).length ? '' : h`<p class="muted">Nema dodijeljenih programa.</p>`}
        <div class="row mt-s"><select data-act="assignsel" class="grow"><option value="">Dodijeli program…</option>${assignable.map((x) => h`<option value="${x.id}">${x.naziv}</option>`)}</select><button class="btn sm" data-act="assign">Dodaj</button></div>
        <a class="btn sm block mt-s" href="#/trener/program/novi?za=${u.id}">+ Napravi individualni program</a></div>
      ${FS.planCard(u)}
      <div class="card"><h3>Težina</h3>${FS.lineChart(wpts, { label: 'Težina' })}</div>
      ${FS.mjTable(mj)}
      <div class="card"><h3>Upiši mjerenja klijenta / klijentice</h3>${FS.mjForm('mjt', u.id)}</div>
      <details class="card"><summary style="cursor:pointer"><b>Historija mjerenja</b></summary><div class="mt-s">${FS.mjHistory(mj, false)}</div></details>
      ${FS.upitnikCard(u)}
      <div class="card"><h3>Privatna bilješka</h3><textarea data-act="note" placeholder="Samo ti vidiš ovu bilješku…" maxlength="1500">${u.biljeska || ''}</textarea><button class="btn sm mt-s" data-act="savenote">Sačuvaj bilješku</button></div>
      <h3>Šta je radila i s koliko kg</h3>
      ${(() => {
        const cnt = {}; logs.forEach((l) => l.vjezbe.forEach((v) => { if (v.serije.some((x) => +x.kg > 0)) cnt[v.id] = (cnt[v.id] || 0) + 1; }));
        const top = Object.entries(cnt).sort((x, y) => y[1] - x[1]).slice(0, 4);
        const best = Store.best(u.id), bl = Object.entries(best).filter(([, b]) => b.kg > 0).sort((x, y) => y[1].kg - x[1].kg).slice(0, 6);
        return h`${bl.length ? h`<div class="card"><h3>Lični rekordi</h3>${bl.map(([id, b]) => h`<div class="kv"><span>${(Store.ex(id) || { naziv: id }).naziv}</span><b>${b.kg} kg × ${b.rep}</b></div>`)}</div>` : ''}
          ${top.map(([id]) => { const pts = logs.slice().reverse().map((l) => { const v = l.vjezbe.find((x) => x.id === id); const m = v ? Math.max(0, ...v.serije.map((x) => +x.kg || 0)) : 0; return m > 0 ? { x: l.datum, y: m } : null; }).filter(Boolean); return h`<div class="card"><h3>${(Store.ex(id) || { naziv: id }).naziv} – najteža serija (kg)</h3>${FS.lineChart(pts, { label: 'Kilaža kroz vrijeme' })}</div>`; })}`;
      })()}
      <h3 class="mt">Zadnji treninzi</h3>
      ${logs.slice(0, 10).map((l) => { const pr = l.programId === 'dijastaza' ? { naziv: 'Dijastaza' } : Store.program(l.programId); return h`<details class="card"><summary style="cursor:pointer"><div class="row between"><span>${fmtDate(l.datum)} · ${l.dan || 'slobodan'}${pr ? ' · ' + pr.naziv : ''}</span><b>${l.vjezbe.length} vježbi · ${l.trajanje || '–'} min</b></div></summary>
        <div class="mt-s">${l.vjezbe.map((v) => { const e = Store.ex(v.id) || { naziv: v.id }; const sets = v.serije.filter((x) => +x.rep > 0 || +x.kg > 0); return h`<div class="kv"><span>${e.naziv}</span><b>${sets.length ? sets.map((x) => (+x.kg > 0 ? x.kg + ' kg × ' : '') + (x.rep || '–')).join(' · ') : 'bez unosa'}</b></div>`; })}
          ${l.rpe ? h`<div class="small mt-s">Napor (RPE): ${l.rpe}/10</div>` : ''}${l.biljeska ? h`<div class="small">Bilješka: ${l.biljeska}</div>` : ''}${l.kond ? h`<div class="small">Kondicija: ${l.kond}</div>` : ''}</div></details>`; })}${logs.length ? '' : h`<p class="muted">Nema treninga.</p>`}
      <h3 class="mt">Razgovor</h3><div id="chatbox"></div>
      <h3 class="mt">Raniji upiti</h3>
      ${msgs.map((m) => h`<div class="card flat"><div class="small">${fmtDate(m.datum)} · ${m.tip === 'dijastaza' ? 'dijastaza' : 'upit'} · ${m.status === 'novo' ? 'čeka odgovor' : 'odgovoreno'}</div><p style="margin:6px 0">${m.tekst}</p>${m.odgovor ? h`<div class="card cream" style="margin:0 0 8px">${m.odgovor}</div>` : ''}
        <form data-act="reply" data-id="${m.id}" novalidate><textarea name="t" placeholder="Odgovor…" maxlength="1500"></textarea><button class="btn sm primary mt-s" type="submit">Pošalji odgovor</button></form></div>`)}${msgs.length ? '' : h`<p class="muted">Nema poruka.</p>`}
      <div class="divider"></div>
      <button class="btn sm block mb" data-act="resetpw">Postavi novu privremenu lozinku</button>
      <button class="btn sm danger block" data-act="deluser">Obriši račun i sve podatke</button>`;
    const rr = () => FS.rerender();
    FS.chatThread($('#chatbox', el), { userId: u.id, me: 'trener', title: '' });
    bind(el, {
      'change:paket': (s) => { u.paket = s.value || null; Store.save(); toast('Paket ažuriran.'); },
      'change:status': (s) => { u.aktivan = s.value === '1'; Store.save(); toast(u.aktivan ? 'Račun je aktivan.' : 'Račun je deaktiviran.'); },
      'click:renew': (b) => { (u.pstart = u.pstart || {})[b.dataset.id] = today(); Store.save(); toast('Pristup produžen: počinje od danas.'); rr(); },
      'click:assign': () => { const v = $('[data-act=assignsel]', el).value; if (!v) return; u.programi.push(v); (u.pstart = u.pstart || {})[v] = today(); Store.save(); toast('Program dodijeljen.'); rr(); },
      'click:unassign': (b) => { u.programi = u.programi.filter((x) => x !== b.dataset.id); Store.save(); rr(); },
      'click:savenote': () => { u.biljeska = $('[data-act=note]', el).value.slice(0, 1500); Store.save(); toast('Bilješka sačuvana.'); },
      'submit:reply': (f) => { const t = String(formData(f).t || '').trim(); if (t.length < 2) { toast('Napiši odgovor.'); return; } const m = Store.db.poruke.find((x) => x.id === f.dataset.id); m.odgovor = t.slice(0, 1500); m.status = 'obradjeno'; Store.save(); toast('Odgovor poslan.'); rr(); },
      'click:resetpw': () => openSheet(h`<h2>Nova privremena lozinka</h2><form data-act="rp" novalidate><label class="field"><span>Lozinka (min. 8 znakova, slovo i broj)</span><input name="p" autocomplete="off"></label><p class="err" id="rerr" hidden></p><button class="btn primary block" type="submit">Postavi</button></form>`, (s) => bind(s, {
        'submit:rp': async (f) => { try { await Auth.setPassword(u.id, formData(f).p); u.mora_promijeniti = true; Store.save(); closeSheet(); toast('Lozinka postavljena. Klijentica će je promijeniti pri prvoj prijavi.'); } catch (e) { const er = $('#rerr', s); er.textContent = e.message; er.hidden = false; } }
      })),
      'click:deluser': async () => {
        if (!await confirmSheet({ title: 'Obrisati račun?', text: `Račun ${u.ime} i svi njeni treninzi, mjerenja i poruke bit će trajno obrisani.`, ok: 'Obriši sve', danger: true })) return;
        const id = u.id; const D = Store.db;
        D.users = D.users.filter((x) => x.id !== id); D.logs = D.logs.filter((x) => x.userId !== id); D.mjere = D.mjere.filter((x) => x.userId !== id); D.poruke = D.poruke.filter((x) => x.userId !== id); D.kupovine = D.kupovine.filter((x) => x.userId !== id);
        Store.save(); toast('Račun obrisan.'); go('#/trener?tab=klijentice');
      }
    });
  };

  /* ================= UREĐIVAČ PROGRAMA ================= */
  V.trener_program = (el, p, q) => {
    const isNew = p.id === 'novi';
    const src = isNew ? null : Store.program(p.id);
    if (!isNew && !src) { el.innerHTML = h`<div class="empty">Program nije pronađen.</div><a class="btn block" href="#/trener?tab=programi">Nazad</a>`; return; }
    const builtin = !!src && FS.GOTOVI.some((x) => x.id === src.id);
    const za = q.za && Store.user(q.za) ? q.za : null;
    const P = src ? JSON.parse(JSON.stringify(src)) : { id: 'p_' + uid(), naziv: za ? 'Individualni program – ' + Store.user(za).ime : '', opis: '', nivo: 'početni', sedmica: 4, dana: 3, cijena: 0, tip: za ? 'individualni' : 'gotov', uShopu: false, per: { tip: 'nema', deload: 4 }, dani: [{ naziv: 'Dan 1', vj: [] }] };
    const exOpts = () => Store.exercises().map((e) => [e.id, `${e.grupa} · ${e.nivo} · ${e.naziv}`]);

    const draw = () => {
      el.innerHTML = h`<a href="#/trener?tab=programi" class="small">← Programi</a><h1 class="mt-s">${isNew ? 'Novi program' : 'Uredi program'}</h1>
        <div class="card"><label class="field"><span>Naziv</span><input data-act="f" data-k="naziv" value="${P.naziv}" maxlength="90"></label>
          <label class="field"><span>Opis</span><textarea data-act="f" data-k="opis" maxlength="400">${P.opis}</textarea></label>
          <div class="grid3"><label class="field"><span>Nivo</span><select data-act="f" data-k="nivo">${opts(FS.NIVOI, P.nivo)}</select></label><label class="field"><span>Sedmica</span><input data-act="f" data-k="sedmica" inputmode="numeric" value="${P.sedmica}"></label><label class="field"><span>Dana/sed.</span><input data-act="f" data-k="dana" inputmode="numeric" value="${P.dana}"></label></div>
          <div class="grid2"><label class="field"><span>Vrsta</span><select data-act="f" data-k="tip" ${builtin ? 'disabled' : ''}>${opts([['gotov', 'Gotov program (prodaja)'], ['individualni', 'Individualni']], P.tip)}</select></label><label class="field"><span>Cijena (${config.valuta})</span><input data-act="f" data-k="cijena" inputmode="decimal" value="${P.cijena}"></label></div>
          <label class="check"><input type="checkbox" data-act="shop" ${P.uShopu ? 'checked' : ''}><span>Prikaži u prodaji (Programi)</span></label>
          <div class="divider"></div><h3>Periodizacija i deload</h3>
          <div class="grid2"><label class="field"><span>Periodizacija</span><select data-act="pt">${opts(FS.PER_TIPOVI, FS.perOf(P).tip)}</select></label><label class="field"><span>Deload</span><select data-act="pd">${opts(FS.DELOAD_OPC, String(FS.perOf(P).deload))}</select></label></div>
          <p class="small">${FS.PER_OPIS[FS.perOf(P).tip]}${FS.perOf(P).deload ? ' ' + FS.DELOAD_OPIS : ''}</p>
          <div class="row wrap">${Array.from({ length: parseInt(P.sedmica, 10) || 1 }, (_, i) => { const x = FS.weekInfo(P, i + 1); return h`<span class="pill" title="${x.faza}">${i + 1}. ${x.deload ? 'deload' : x.faza.toLowerCase()}</span>`; })}</div></div>
        <div class="card"><div class="eyebrow">Direktnih serija sedmično (sedmica 1)</div><div class="row wrap mt-s">${FS.MISICI.map((m) => [m, FS.weekVolume(P, 1)[m]]).filter((x) => x[1] > 0).map(([m, v]) => h`<span class="pill">${m} <b>${v}</b></span>`)}</div><p class="small mt-s">Pregledni okvir: oko 10 do 20 serija po mišićnoj grupi sedmično za rast, početnicama dovoljno 6 do 10.</p></div>
        ${P.dani.map((d, di) => h`<div class="card"><div class="row"><input data-act="dn" data-di="${di}" value="${d.naziv}" maxlength="60" class="grow"><button class="icon-btn" data-act="rmday" data-di="${di}" aria-label="Ukloni dan">${icon('trash')}</button></div>
          ${d.vj.map((x, xi) => h`<div class="card flat" style="margin:10px 0 0;padding:10px;${x.p === 0 ? 'border-left:4px solid var(--beige)' : (xi > 0 && d.vj[xi - 1].p === 0 ? 'border-left:4px solid var(--beige)' : '')}">
            ${x.p === 0 ? h`<div class="small" style="color:var(--beige);margin-bottom:6px"><b>Superserija</b> · odmah poslije ove ide sljedeća vježba</div>` : (xi > 0 && d.vj[xi - 1].p === 0 ? h`<div class="small" style="color:var(--beige);margin-bottom:6px"><b>Superserija</b> · par prethodne vježbe</div>` : '')}
            <div class="row"><select data-act="xe" data-di="${di}" data-xi="${xi}" class="grow">${opts(exOpts(), x.id)}</select><button class="icon-btn" data-act="xup" data-di="${di}" data-xi="${xi}" aria-label="Pomjeri gore">↑</button><button class="icon-btn" data-act="xdn" data-di="${di}" data-xi="${xi}" aria-label="Pomjeri dolje">↓</button><button class="icon-btn" data-act="rmex" data-di="${di}" data-xi="${xi}" aria-label="Ukloni">${icon('trash')}</button></div>
            <div class="grid3 mt-s"><label class="field" style="margin:0"><span>Serije</span><input data-act="xs" data-di="${di}" data-xi="${xi}" inputmode="numeric" value="${x.s}"></label><label class="field" style="margin:0;grid-column:span 2"><span>Ponavljanja</span><input data-act="xr" data-di="${di}" data-xi="${xi}" value="${x.r}" maxlength="30"></label></div>
            <div class="grid2 mt-s"><label class="field" style="margin:0"><span>Pauza između serija (s)</span><input data-act="xp" data-di="${di}" data-xi="${xi}" inputmode="numeric" placeholder="auto ${FS.pauza ? FS.pauza({ ...x, fix: false, p: x.p === 0 ? undefined : x.p }) : ''}" value="${x.fix && x.p != null && x.p !== 0 ? x.p : ''}" ${x.p === 0 ? 'disabled' : ''}></label>
              <label class="check" style="margin:0;align-self:end"><input type="checkbox" data-act="xss" data-di="${di}" data-xi="${xi}" ${x.p === 0 ? 'checked' : ''} ${xi === d.vj.length - 1 ? 'disabled' : ''}><span>Superserija sa sljedećom</span></label></div>
            <input class="mt-s" data-act="xn" data-di="${di}" data-xi="${xi}" value="${x.n || ''}" placeholder="Napomena (nije obavezno)" maxlength="120"></div>`)}
          <div class="row mt-s"><button class="btn sm grow" data-act="addex" data-di="${di}">+ Vježba</button><button class="btn sm grow" data-act="newex" data-di="${di}">+ Nova vježba</button></div></div>`)}
        <button class="btn block mb" data-act="addday">+ Dodaj dan</button>
        <div class="card flat"><div class="small">Kopiraj trening iz postojećeg programa</div><div class="row mt-s"><select data-act="cpsel" class="grow"><option value="">Izaberi trening…</option>${Store.allPrograms().filter((x) => x.id !== P.id).flatMap((x) => x.dani.map((d, di) => h`<option value="${x.id}|${di}">${x.naziv} · ${d.naziv}</option>`))}</select><button class="btn sm" data-act="cpday">Dodaj</button></div></div>
        <p class="err" id="perr" hidden></p><button class="btn primary block" data-act="save">Sačuvaj program</button>
        ${!isNew ? h`<div class="divider"></div>${builtin && (Store.db.programMod || {})[P.id] ? h`<button class="btn sm block mb" data-act="revert">Vrati originalni program</button>` : ''}${builtin ? '' : h`<button class="btn sm danger block" data-act="del">Obriši program</button>`}` : ''}`;
    };
    draw();
    const bad = (m) => { const e = $('#perr', el); e.textContent = m; e.hidden = false; e.scrollIntoView({ block: 'center' }); };
    bind(el, {
      'input:f': (t) => { P[t.dataset.k] = t.value; },
      'change:f': (t) => { P[t.dataset.k] = t.value; },
      'change:shop': (t) => { P.uShopu = t.checked; },
      'change:pt': (t) => { P.per = { tip: t.value, deload: FS.perOf(P).deload }; draw(); },
      'change:pd': (t) => { P.per = { tip: FS.perOf(P).tip, deload: parseInt(t.value, 10) || 0 }; draw(); },
      'input:dn': (t) => { P.dani[t.dataset.di].naziv = t.value; },
      'change:xe': (t) => { P.dani[t.dataset.di].vj[t.dataset.xi].id = t.value; },
      'input:xs': (t) => { P.dani[t.dataset.di].vj[t.dataset.xi].s = parseInt(t.value, 10) || 0; },
      'input:xr': (t) => { P.dani[t.dataset.di].vj[t.dataset.xi].r = t.value; },
      'input:xn': (t) => { P.dani[t.dataset.di].vj[t.dataset.xi].n = t.value; },
      'input:xp': (t) => { const x = P.dani[t.dataset.di].vj[t.dataset.xi], v = parseInt(t.value, 10); if (t.value.trim() !== '' && v >= 0 && v <= 900) { x.fix = true; x.p = v; } else { delete x.fix; delete x.p; } },
      'change:xss': (t) => { const x = P.dani[t.dataset.di].vj[t.dataset.xi]; if (t.checked) { x.p = 0; x.ss = true; delete x.fix; } else { delete x.p; delete x.ss; } draw(); },
      'click:xup': (t) => { const a = P.dani[t.dataset.di].vj, i = +t.dataset.xi; if (i > 0) { [a[i - 1], a[i]] = [a[i], a[i - 1]]; draw(); } },
      'click:xdn': (t) => { const a = P.dani[t.dataset.di].vj, i = +t.dataset.xi; if (i < a.length - 1) { [a[i + 1], a[i]] = [a[i], a[i + 1]]; draw(); } },
      'click:newex': (t) => { const di = +t.dataset.di; exSheet(null, () => { const l = (Store.db.vjezbeNove || []).slice(-1)[0]; if (l) { P.dani[di].vj.push({ id: l.id, s: 3, r: '10', n: '' }); } draw(); }); },
      'click:addex': (t) => {
        const di = +t.dataset.di; let g = 'Sve', qs = '';
        const list = () => Store.exercises().filter((e) => (g === 'Sve' || e.grupa === g) && (!qs || (e.naziv + ' ' + e.grupa).toLowerCase().includes(qs.toLowerCase())));
        const rows = () => h`${list().map((e) => h`<button class="ex" style="width:100%;text-align:left;font:inherit" data-act="pickex" data-id="${e.id}"><div class="grow"><b>${e.naziv}</b><div class="small">${e.grupa} · ${e.nivo}${FS.zona && FS.zona(e.id) ? ' · zona ' + FS.zona(e.id) : ''}</div></div></button>`)}`.s;
        openSheet(h`<h2>Dodaj vježbu</h2><label class="field"><input type="search" data-act="pq" placeholder="Pretraži…"></label>
          <div class="chips mb">${['Sve', ...FS.GRUPE].map((x) => h`<button class="chip ${x === 'Sve' ? 'on' : ''}" data-act="pg" data-v="${x}">${x}</button>`)}</div><div id="pl">${FS.raw(rows())}</div>`, (sh) => bind(sh, {
          'input:pq': (i) => { qs = i.value; $('#pl', sh).innerHTML = rows(); },
          'click:pg': (b) => { g = b.dataset.v; sh.querySelectorAll('[data-act=pg]').forEach((c) => c.classList.toggle('on', c === b)); $('#pl', sh).innerHTML = rows(); },
          'click:pickex': (b) => { P.dani[di].vj.push({ id: b.dataset.id, s: 3, r: '10', n: '' }); closeSheet(); draw(); }
        }));
      },
      'click:rmex': (t) => { P.dani[t.dataset.di].vj.splice(+t.dataset.xi, 1); draw(); },
      'click:cpday': () => { const v = $('[data-act=cpsel]', el).value; if (!v) { toast('Izaberi trening.'); return; } const [pid, di] = v.split('|'); const sp = Store.program(pid); const d = sp && sp.dani[+di]; if (!d) return; P.dani.push({ naziv: d.naziv, vj: JSON.parse(JSON.stringify(d.vj)) }); toast('Trening je dodan, možeš ga urediti.'); draw(); },
      'click:addday': () => { P.dani.push({ naziv: 'Dan ' + (P.dani.length + 1), vj: [] }); draw(); },
      'click:rmday': (t) => { P.dani.splice(+t.dataset.di, 1); draw(); },
      'click:save': () => {
        P.naziv = String(P.naziv).trim();
        if (P.naziv.length < 3) return bad('Unesi naziv programa.');
        if (!P.dani.length || P.dani.some((d) => !d.vj.length)) return bad('Svaki dan mora imati barem jednu vježbu.');
        if (P.dani.some((d) => d.vj.some((x) => !(x.s > 0) || !String(x.r).trim()))) return bad('Unesi serije i ponavljanja za sve vježbe.');
        P.cijena = num(P.cijena); if (isNaN(P.cijena) || P.cijena < 0) return bad('Cijena mora biti 0 ili veća.');
        P.sedmica = parseInt(P.sedmica, 10) || 1; P.dana = parseInt(P.dana, 10) || P.dani.length;
        if (builtin) { Store.db.programMod = Store.db.programMod || {}; Store.db.programMod[P.id] = { naziv: P.naziv, opis: P.opis, nivo: P.nivo, sedmica: P.sedmica, dana: P.dana, cijena: P.cijena, uShopu: P.uShopu, dani: P.dani, per: FS.perOf(P) }; }
        else { const i = Store.db.programi.findIndex((x) => x.id === P.id); if (i >= 0) Store.db.programi[i] = P; else Store.db.programi.push(P); }
        if (za && !Store.user(za).programi.includes(P.id)) Store.user(za).programi.push(P.id);
        if (za && P.tip === 'individualni' && !P.vlasnik) P.vlasnik = za;
        Store.save(); toast('Program sačuvan.'); go(za ? '#/trener/klijentica/' + za : '#/trener?tab=programi');
      },
      'click:revert': async () => { if (await confirmSheet({ title: 'Vratiti original?', text: 'Tvoje izmjene ovog programa bit će odbačene.', ok: 'Vrati' })) { delete Store.db.programMod[P.id]; Store.save(); toast('Vraćen originalni program.'); go('#/trener?tab=programi'); } },
      'click:del': async () => { if (await confirmSheet({ title: 'Obrisati program?', text: 'Bit će uklonjen i svim klijenticama kojima je dodijeljen.', ok: 'Obriši', danger: true })) { Store.db.programi = Store.db.programi.filter((x) => x.id !== P.id); Store.db.users.forEach((u) => { u.programi = (u.programi || []).filter((x) => x !== P.id); }); Store.save(); toast('Program obrisan.'); go('#/trener?tab=programi'); } }
    });
  };
})();
