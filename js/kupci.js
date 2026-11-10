/* Vrste klijenata (online, personalni, kupci programa), automatski raspored kupljenog programa,
   istek pristupa kupcima nakon 2 mjeseca, gratis plan ishrane za prvih 10 i vodič za mjerenje. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, Auth, today, addDays, fmtDate, uid, toast, config, opts } = FS;
  const V = (FS.views = FS.views || {});
  const DANA = () => (config && config.pristupDana) || 60;
  const LIMIT = () => ((config && config.akcija) || {}).gratisIshrana || 10;
  const recs = () => (Store.db.pristup = Store.db.pristup || []);
  const dayDiff = (a, b) => Math.round((FS.parse(b) - FS.parse(a)) / 86400000);

  /* ---------- evidencija pristupa (jedan zapis po klijentu: vrsta, istek, gratis) ---------- */
  FS.pristupRec = (id) => recs().find((x) => x.id === id) || null;
  FS.setPristup = (id, patch) => { let r = FS.pristupRec(id); if (!r) { r = { id, userId: id }; recs().push(r); } Object.assign(r, patch); Store.save(); return r; };
  FS.VRSTE = [['online', 'Online coaching'], ['personalni', 'Personalni treninzi'], ['program', 'Kupac programa (pristup ističe)'], ['trcanje', 'Samo trčanje (pristup do kraja plana)']];
  FS.jeTrcanje = (u) => !!u && u.role !== 'trener' && FS.vrsta(u) === 'trcanje';
  FS.vrsta = (u) => { const r = FS.pristupRec(u.id); return (r && r.vrsta) || (u.paket ? 'online' : null); };
  FS.jeKupac = (u) => !!u && u.role !== 'trener' && FS.vrsta(u) === 'program';
  FS.accountExpired = (u) => { if (!u || u.role === 'trener') return false; const r = FS.pristupRec(u.id); return !!(r && (r.vrsta === 'program' || r.vrsta === 'trcanje') && r.istice && today() > r.istice); };
  FS.danaDoIsteka = (u) => { const r = FS.pristupRec(u.id); return r && r.istice ? dayDiff(today(), r.istice) : null; };
  FS.vrstaTag = (u) => {
    const v = FS.vrsta(u), r = FS.pristupRec(u.id) || {};
    if (v === 'trcanje') { const d = FS.danaDoIsteka(u); return 'Samo trčanje' + (d == null ? '' : d < 0 ? ' · istekao' : ' · još ' + (d + 1) + ' d'); }
    if (v === 'program') { const d = FS.danaDoIsteka(u); return 'Kupac programa' + (d == null ? '' : d < 0 ? ' · istekao' : ' · još ' + (d + 1) + ' d'); }
    return (v === 'online' ? 'Online' + (u.paket ? ' ' + u.paket : '') : v === 'personalni' ? 'Personalni' : 'nerazvrstan/a') + (r.gratis ? ' · gratis ishrana' : '');
  };

  /* ---------- raspored kupljenog programa po danima ---------- */
  const PAT = { 1: [2], 2: [1, 4], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6] };
  const wd = (iso) => (FS.parse(iso).getDay() + 6) % 7;
  FS.rasporedZaProgram = (u, pr, from) => {
    const N = parseInt(pr.sedmica, 10) || 0, nd = (pr.dani || []).length; if (!N || !nd) return null;
    const per = Math.max(1, Math.min(7, parseInt(pr.dana, 10) || nd)), pat = PAT[per];
    let start = from || today();
    for (let i = 0; i < 8; i++) { const d = addDays(start, i); if (pat.includes(wd(d))) { start = d; break; } }
    const faze = nd > per ? Math.max(1, Math.round(nd / per)) : 1;
    Store.db.raspored = (Store.db.raspored || []).filter((e) => !(e.userId === u.id && e.programId === pr.id && e.datum >= start));
    let last = start, n = 0;
    for (let w = 0; w < N; w++) {
      let slot = 0;
      for (let i = 0; i < 7 && slot < per; i++) {
        const d = addDays(start, w * 7 + i); if (!pat.includes(wd(d))) continue;
        const idx = nd > per ? Math.min(faze - 1, Math.floor(w / (N / faze))) * per + slot : slot % nd;
        Store.db.raspored = Store.db.raspored.filter((e) => !(e.userId === u.id && e.datum === d));
        Store.db.raspored.push({ id: uid(), userId: u.id, datum: d, tip: 'dan', programId: pr.id, dan: idx, nota: '', ts: Date.now() });
        last = d; n++; slot++;
      }
    }
    u.pstart = u.pstart || {}; u.pstart[pr.id] = start;
    Store.save();
    return { start, end: last, n };
  };

  /* poziva se kad je kupovina potvrđena (uplata stigla ili demo kupovina) */
  FS.poKupovini = (cu, prog) => {
    if (!cu || !prog || cu.role === 'trener') return;
    const r = FS.pristupRec(cu.id) || {};
    let end = today();
    if (prog.tip !== 'vodic' && (prog.dani || []).length && prog.sedmica) {
      const mine = (Store.db.raspored || []).filter((e) => e.userId === cu.id && e.datum >= today()).map((e) => e.datum).sort();
      const res = FS.rasporedZaProgram(cu, prog, mine.length ? addDays(mine[mine.length - 1], 1) : today());
      if (res) end = res.end;
    }
    if (!r.vrsta && !cu.paket) FS.setPristup(cu.id, { vrsta: 'program', istice: addDays(end > addDays(today(), DANA() - 3) ? end : today(), end > addDays(today(), DANA() - 3) ? 3 : DANA()) });
    else if (r.vrsta === 'program') { const a = addDays(today(), DANA()), b = addDays(end, 3); FS.setPristup(cu.id, { istice: [r.istice || '', a, b].sort().pop() }); }
  };

  /* ---------- gratis plan ishrane (akcija za prvih 10) ---------- */
  FS.gratisBroj = () => recs().filter((r) => r.gratis).length;
  const syncGratis = () => { Store.db.postavke = Object.assign({}, Store.db.postavke, { gratisIshrana: { limit: LIMIT(), dodijeljeno: FS.gratisBroj() } }); };
  FS.gratisPreostalo = () => { const g = (Store.db.postavke || {}).gratisIshrana; return g ? Math.max(0, (g.limit || LIMIT()) - (g.dodijeljeno || 0)) : null; };
  FS.gratisBanner = () => {
    const p = FS.gratisPreostalo(); if (p === 0) return '';
    return h`<div class="card note small"><b>Akcija:</b> prvih ${LIMIT()} klijentica dobija plan ishrane gratis${p != null ? ' (još ' + p + ' mjesta)' : ''}. Javi mi se na Instagramu.</div>`;
  };

  /* ---------- istek pristupa: kupac se sam odjavljuje kad pristup istekne ---------- */
  const chk = () => {
    try {
      const s = Auth.session && Auth.session(); if (!s || !Store.db) return;
      const u = Store.user(s.uid);
      if (u && FS.accountExpired(u)) { Auth.logout(); toast('Tvoj pristup je istekao. Javi mi se ako želiš produžiti.'); location.hash = '#/prijava'; if (FS.rerender) FS.rerender(); }
    } catch (e) { /* ignoriši */ }
  };
  setInterval(chk, 60000);
  document.addEventListener('visibilitychange', chk);
  window.addEventListener('hashchange', chk);

  /* ---------- kartica za kupca ---------- */
  FS.kupacCard = (u) => {
    const d = FS.danaDoIsteka(u), r = FS.pristupRec(u.id) || {};
    return h`<div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Tvoj program</div>
      <p style="margin:0 0 6px">Plan treninga je raspoređen po danima u rasporedu ispod. Pristup traje do <b>${r.istice ? fmtDate(r.istice) : '–'}</b>${d != null && d >= 0 ? ' (još ' + (d + 1) + ' dana)' : ''}.</p>
      <p class="small muted" style="margin:0">Alati i praćenje napretka ostaju ti otvoreni. Ako želiš produžiti ili trebaš pomoć, javi mi se na Instagramu.</p></div>`;
  };

  /* ---------- trenerica: vrsta klijenta, istek, gratis ishrana, raspored ---------- */
  FS.pristupCard = (u) => {
    const r = FS.pristupRec(u.id) || {}, d = FS.danaDoIsteka(u), progs = Store.userPrograms(u).filter((p) => p.tip !== 'vodic' && p.sedmica);
    return h`<div class="card"><h3 style="margin-top:0">Vrsta klijenta i pristup</h3>
      <label class="field"><span>Vrsta</span><select data-pk="vrsta" data-uid="${u.id}">${opts([['', 'Nije određeno'], ...FS.VRSTE], FS.vrsta(u) || '')}</select></label>
      ${FS.vrsta(u) === 'program' || FS.vrsta(u) === 'trcanje' ? h`<div class="grid2"><label class="field" style="margin:0"><span>Pristup do</span><input type="date" data-pk="istice" data-uid="${u.id}" value="${r.istice || ''}"></label>
        <div style="display:flex;align-items:flex-end"><button class="btn sm block" data-pk-click="prod" data-uid="${u.id}">Produži 30 dana</button></div></div>
        <p class="small ${d != null && d < 0 ? 'err' : 'muted'} mt-s">${d == null ? 'Nema datuma isteka.' : d < 0 ? 'Pristup je istekao, klijent se ne može prijaviti.' : 'Ističe za ' + (d + 1) + ' dana, a zatim se klijent više ne može prijaviti.'}</p>` : ''}
      <label class="check mt-s" style="display:flex;gap:10px"><input type="checkbox" data-pk="gratis" data-uid="${u.id}" ${r.gratis ? 'checked' : ''}><span>Gratis plan ishrane (akcija prvih ${LIMIT()}; dodijeljeno ${FS.gratisBroj()}/${LIMIT()})</span></label>
      ${progs.length ? h`<div class="row mt-s"><select data-pk="rasp-p" data-uid="${u.id}" style="flex:1">${progs.map((p) => h`<option value="${p.id}">${p.naziv}</option>`)}</select><button class="btn sm" data-pk-click="rasp" data-uid="${u.id}">Rasporedi po danima</button></div>
        <p class="small muted mt-s">Rasporedi po danima upisuje sve treninge programa u kalendar klijenta (npr. 3 dana sedmično: pon, sri, pet).</p>` : ''}</div>`;
  };
  document.addEventListener('change', (e) => {
    const t = e.target, k = t.dataset && t.dataset.pk; if (!k || k === 'rasp-p') return;
    const id = t.dataset.uid, u = Store.user(id); if (!u) return;
    if (k === 'vrsta') {
      const patch = { vrsta: t.value || null };
      if (t.value === 'program') { const r = FS.pristupRec(id) || {}; if (!r.istice) patch.istice = addDays(today(), DANA()); }
      else if (t.value === 'trcanje') { const pl = FS.trkPlanOf && FS.trkPlanOf(u); patch.istice = addDays(today(), (pl ? pl.tjedni.length : 10) * 7 + 3); }
      else patch.istice = null;
      FS.setPristup(id, patch);
    } else if (k === 'istice') FS.setPristup(id, { istice: t.value || null });
    else if (k === 'gratis') {
      if (t.checked && FS.gratisBroj() >= LIMIT() && !confirm('Već je dodijeljeno ' + LIMIT() + ' gratis planova. Dodijeliti svejedno?')) { t.checked = false; return; }
      u.programi = u.programi || [];
      if (t.checked) { if (!u.programi.includes('vodic-ishrana')) u.programi.push('vodic-ishrana'); }
      else if (!Store.db.kupovine.some((x) => x.userId === id && x.programId === 'vodic-ishrana')) u.programi = u.programi.filter((x) => x !== 'vodic-ishrana');
      FS.setPristup(id, { gratis: !!t.checked }); syncGratis(); Store.save();
      toast(t.checked ? 'Plan ishrane je otključan (gratis).' : 'Gratis plan ishrane je uklonjen.');
    }
    if (FS.rerender) FS.rerender();
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-pk-click]'); if (!b) return;
    const id = b.dataset.uid, u = Store.user(id); if (!u) return;
    if (b.dataset.pkClick === 'prod') { const r = FS.pristupRec(id) || {}; FS.setPristup(id, { istice: addDays(r.istice && r.istice > today() ? r.istice : today(), 30) }); toast('Pristup je produžen 30 dana.'); }
    if (b.dataset.pkClick === 'rasp') {
      const sel = document.querySelector('[data-pk=rasp-p][data-uid="' + id + '"]'), pr = sel && Store.program(sel.value); if (!pr) return;
      const res = FS.rasporedZaProgram(u, pr, today()); toast(res ? 'Raspored napravljen: ' + res.n + ' treninga do ' + fmtDate(res.end) + '.' : 'Program nema sedmice ili dane.');
    }
    if (FS.rerender) FS.rerender();
  });

  /* ---------- lista klijenata po vrstama ---------- */
  FS.vrstaChips = (kl, cur) => {
    const F = [['online', 'Online', (u) => FS.vrsta(u) === 'online'], ['personalni', 'Personalni', (u) => FS.vrsta(u) === 'personalni'], ['trcanje', 'Samo trčanje', (u) => FS.vrsta(u) === 'trcanje' && !FS.accountExpired(u)], ['sve', 'Svi', () => true],
      ['program', 'Kupci programa', (u) => FS.vrsta(u) === 'program' && !FS.accountExpired(u)], ['istekli', 'Istekli', (u) => FS.accountExpired(u)], ['nerazv', 'Nerazvrstani', (u) => !FS.vrsta(u)]];
    return { chips: h`<div class="chips mb">${F.map(([k, l, fn]) => h`<a class="chip ${cur === k ? 'on' : ''}" href="#/trener?tab=klijentice&v=${k}">${l} (${kl.filter(fn).length})</a>`)}</div>`, filter: (F.find((x) => x[0] === cur) || F[0])[2] };
  };

  /* ---------- kako se mjeriti ---------- */
  V.mjerenje = (el) => {
    const S = (t, items) => h`<div class="card"><h3 style="margin-top:0">${t}</h3><ul class="dots">${items.map((x) => h`<li>${x}</li>`)}</ul></div>`;
    el.innerHTML = h`<div class="eyebrow">Alati</div><h1>Kako se mjeriti</h1>
      <p class="muted">Mjeri se isto svaki put: isto doba dana, isti uslovi, ista traka i ista vaga. Samo tako brojevi pokazuju stvarnu promjenu.</p>
      ${S('Vaganje', ['Ujutro, poslije toaleta, a prije jela i pića.', 'Ista vaga, na ravnoj tvrdoj podlozi, sa što manje odjeće.', 'Važi se 2 do 3 puta sedmično (npr. pon, sri, pet) ili svaki dan, pa gledaj prosjek sedmice. Jedan broj ne znači ništa.', 'Težina se mijenja i do 1 do 2 kg u toku dana (voda, so, ciklus). Kod žena je težina često veća pred i tokom menstruacije, zato poredi iste dane ciklusa.', 'Ako te vaganje stresira ili imaš iskustvo poremećaja ishrane, preskoči ga i prati obime i osjećaj, uz savjet stručnjaka.'])}
      ${S('Obim struka i stomaka', ['Izmjeri ujutro, opuštena, poslije laganog izdaha (ne uvlači stomak).', 'Struk: najuži dio između rebara i kukova. Stomak: u visini pupka.', 'Traka vodoravno oko tijela, priljubljena, ali ne stisnuta. Stoj uspravno, stopala skupljena.'])}
      ${S('Kukovi, natkoljenica, nadlaktica, list', ['Kukovi: najširi dio gluteusa, stopala skupljena.', 'Natkoljenica: na istoj tački svaki put, npr. 15 cm iznad koljena ili ispod nabora gluteusa. Mjeri svaku nogu posebno.', 'Nadlaktica: sredina opuštene ruke, između ramena i lakta. List: najširi dio.', 'Mjeri svaki obim 2 do 3 puta pa uzmi prosjek.'])}
      ${S('Koliko često', ['Obime mjeri svake 4 sedmice (točke praćenja 0, 4, 8, 12).', 'Fotografije svake 4 sedmice: isto svjetlo, isto mjesto, ista odjeća, sprijeda, sa strane i otpozadi.', 'Ne radi odluke na osnovu jednog mjerenja. Gledaj trend kroz nekoliko sedmica, uz snagu, izvedbu, energiju i osjećaj.'])}
      <a class="btn primary block" href="#/moj?tab=napredak">Unesi mjerenje u svoj napredak</a>
      <a class="btn block mt-s" href="#/alati">BMI i kalorije</a>
      <p class="small center muted mt">Ovo je opšta edukacija i ne zamjenjuje savjet ljekara.</p>`;
  };
})();
