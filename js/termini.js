/* Termini: sedmični planer (po satima) za trenericu + prikaz termina personalnim klijenticama.
   Personalni termin: userId = klijentica (ona ga vidi, bez naziva treninga). Online rad: userId = trenerica, kid = klijentica (klijentica ga ne vidi). */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, today, addDays, uid, toast, icon } = FS;
  const V = (FS.views = FS.views || {});
  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const rasp = () => (Store.db.raspored = Store.db.raspored || []);
  const H0 = 7, H1 = 21, PX = 40, DAN = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
  const wk = (s) => { const d = FS.parse(s), n = (d.getDay() + 6) % 7; return addDays(s, -n); };
  const fmt = (x) => { const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); };
  const dm = (s) => { const d = FS.parse(s); return d.getDate() + '.' + (d.getMonth() + 1) + '.'; };
  const ime = (id) => { const u = Store.user(id); return u ? u.ime : '?'; };
  const kid = (e) => e.kid || e.userId;
  FS.fmtSat = fmt;

  /* termini jedne klijentice za personalnu početnu (od danas, sljedećih 21 dan) */
  FS.terminiKlijentice = (u, dana) => rasp().filter((e) => e.tip === 'termin' && e.vrsta === 'p' && e.userId === u.id && e.datum >= today() && e.datum <= addDays(today(), dana || 21))
    .sort((a, b) => (a.datum + String(a.od).padStart(5, '0') < b.datum + String(b.od).padStart(5, '0') ? -1 : 1));

  const opt = (sel) => { let o = ''; for (let x = H0; x <= H1; x += 0.5) o += `<option value="${x}" ${x === sel ? 'selected' : ''}>${fmt(x)}</option>`; return o; };

  const form = (x, week) => {
    const ed = !!x.id, kl = Store.klijentice().filter((u) => u.aktivan !== false);
    x = Object.assign({ vrsta: 'p', od: 10, do: 11, nota: '', datum: today() }, x);
    const sel = ed ? kid(x) : (kl[0] && kl[0].id);
    FS.openSheet(h`<h2>${ed ? 'Uredi termin' : 'Novi termin'}</h2>
      <form id="tf" novalidate>
        <label class="field"><span>Dan</span><select name="datum">${Array.from({ length: 7 }, (_, i) => addDays(week, i)).map((d, i) => h`<option value="${d}" ${d === x.datum ? 'selected' : ''}>${DAN[i]} ${dm(d)}</option>`)}</select></label>
        <div class="grid2"><label class="field"><span>Od</span><select name="od">${FS.raw(opt(x.od))}</select></label><label class="field"><span>Do</span><select name="do">${FS.raw(opt(x.do))}</select></label></div>
        <label class="field"><span>Vrsta</span><select name="vrsta"><option value="p" ${x.vrsta === 'p' ? 'selected' : ''}>Personalni trening</option><option value="o" ${x.vrsta === 'o' ? 'selected' : ''}>Online: rad na planu</option></select></label>
        <label class="field"><span>Klijentica</span><select name="k">${kl.map((u) => h`<option value="${u.id}" ${u.id === sel ? 'selected' : ''}>${u.ime}</option>`)}</select></label>
        <label class="field"><span>Bilješka (nije obavezno)</span><input name="n" maxlength="80" value="${x.nota || ''}" placeholder="npr. korekcija plana"></label>
        ${ed ? '' : h`<label class="field"><span>Ponovi</span><select name="rep"><option value="0">Ne ponavljaj</option><option value="3">Još 3 sedmice</option><option value="7">Još 7 sedmica</option><option value="11">Još 11 sedmica</option></select></label>`}
        <button class="btn primary block" type="submit">Sačuvaj</button>
        ${ed ? h`<button class="btn danger block mt-s" type="button" data-del="1">Obriši termin</button>${x.grupa ? h`<button class="btn danger block mt-s" type="button" data-del="2">Obriši i sve sljedeće u nizu</button>` : ''}` : ''}</form>`, (s) => {
      const f = s.querySelector('#tf');
      f.addEventListener('submit', (e) => {
        e.preventDefault(); const fd = new FormData(f), od = +fd.get('od'), dok = +fd.get('do');
        if (dok <= od) { toast('Kraj mora biti poslije početka.'); return; }
        const vr = fd.get('vrsta'), kl0 = fd.get('k'), datum = fd.get('datum'), nota = String(fd.get('n') || '').trim();
        const mk = (d, grupa) => ({ id: uid(), tip: 'termin', vrsta: vr, userId: vr === 'p' ? kl0 : FS.Auth.user().id, kid: kl0, datum: d, od, do: dok, nota, grupa, ts: Date.now() });
        if (ed) { const i = rasp().findIndex((y) => y.id === x.id); const o = mk(datum, x.grupa); o.id = x.id; rasp().splice(i, 1, o); }
        else { const reps = +fd.get('rep') || 0, g = reps ? uid() : undefined; for (let w = 0; w <= reps; w++) rasp().push(mk(addDays(datum, w * 7), g)); }
        Store.save(); FS.closeSheet(); toast('Sačuvano.'); FS.rerender();
      });
      s.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        Store.db.raspored = rasp().filter((y) => b.dataset.del === '2' && x.grupa ? !(y.grupa === x.grupa && y.datum >= x.datum) : y.id !== x.id);
        Store.save(); FS.closeSheet(); toast('Obrisano.'); FS.rerender();
      }));
    });
  };

  V.planer = (el, p, q) => {
    if (!jeT()) { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    const dnas = today(), vik = (FS.parse(dnas).getDay() + 6) % 7 >= 5, w0 = wk(q.w || (vik ? addDays(dnas, 7) : dnas)), dani = Array.from({ length: 7 }, (_, i) => addDays(w0, i));
    const all = rasp().filter((e) => e.tip === 'termin' && e.datum >= w0 && e.datum <= dani[6]);
    const sat = (v) => all.filter((e) => e.vrsta === v).reduce((s, e) => s + (e.do - e.od), 0);
    const hrs = []; for (let x = H0; x < H1; x++) hrs.push(x);
    const col = (d) => h`<div class="tcol" data-d="${d}" style="height:${(H1 - H0) * PX}px">${all.filter((e) => e.datum === d).map((e) => h`<button class="tblk ${e.vrsta}" data-id="${e.id}" style="top:${(e.od - H0) * PX + 1}px;height:${(e.do - e.od) * PX - 3}px">${ime(kid(e)).split(' ')[0]}<small>${fmt(e.od)}–${fmt(e.do)}</small></button>`)}</div>`;
    el.innerHTML = h`<div class="eyebrow">Moj raspored</div><h1>Planer</h1>
      <div class="row between mb"><a class="btn sm" href="#/planer?w=${addDays(w0, -7)}" aria-label="Prošla sedmica">${icon('back') || '←'}</a><b>${dm(w0)} – ${dm(dani[6])}</b><a class="btn sm" href="#/planer?w=${addDays(w0, 7)}" aria-label="Sljedeća sedmica" style="transform:scaleX(-1)">${icon('back') || '→'}</a></div>
      <div class="small mb" style="display:flex;gap:14px;flex-wrap:wrap"><span><i class="tdot p"></i> Personalni trening</span><span><i class="tdot o"></i> Online: rad na planu</span></div>
      <div class="tscroll"><div class="tgrid"><div class="tgh"></div>${dani.map((d, i) => h`<div class="tgh ${d === today() ? 'today' : ''}">${DAN[i]} ${(+d.slice(8))}</div>`)}
        <div>${hrs.map((x) => h`<div class="thc">${x}:00</div>`)}</div>${dani.map(col)}</div></div>
      <div class="stats mt"><div class="stat"><b>${sat('p')} h</b><span>personalni</span></div><div class="stat"><b>${sat('o')} h</b><span>online rad</span></div></div>
      <button class="btn primary block mt" data-act="tnew">${icon('plus')} Dodaj termin</button>
      <p class="small muted">Dodirni prazno polje u rasporedu da dodaš termin, a termin da ga urediš ili obrišeš. Personalna klijentica vidi samo svoje termine, bez naziva treninga.</p>`;
    el.querySelector('[data-act=tnew]').addEventListener('click', () => form({ datum: dani.includes(today()) ? today() : dani[0] }, w0));
    el.querySelectorAll('.tcol').forEach((c) => c.addEventListener('click', (e) => { if (e.target.closest('.tblk')) return; const y = e.clientY - c.getBoundingClientRect().top; form({ datum: c.dataset.d, od: Math.floor((y / PX) * 2) / 2 + H0, do: Math.floor((y / PX) * 2) / 2 + H0 + 1 }, w0); }));
    el.querySelectorAll('.tblk').forEach((b) => b.addEventListener('click', () => form(rasp().find((x) => x.id === b.dataset.id), w0)));
  };

  /* ---------- personalna klijentica: samo termini i trening za rad bez trenerice ---------- */
  FS.personalHome = (u) => {
    const ts = FS.terminiKlijentice(u, 21), next = ts[0], progs = Store.userPrograms(u).filter((x) => x.tip !== 'vodic');
    const dl = (d) => { const x = FS.parse(d); return ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'][x.getDay()] + ', ' + dm(d); };
    return h`${u.mora_promijeniti ? h`<div class="card note"><b>Postavi svoju lozinku.</b><button class="btn sm mt-s" data-act="pw">Promijeni lozinku</button></div>` : ''}
      <div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Sljedeći trening s trenericom</div>
        ${next ? h`<h2 style="margin:4px 0">${next.datum === today() ? 'Danas' : dl(next.datum)}, ${fmt(next.od)}</h2><div class="small">Extreme Sport, Stup</div>` : h`<p class="muted" style="margin:6px 0 0">Još nema dogovorenih termina.</p>`}</div>
      ${ts.length ? h`<div class="card"><div class="eyebrow">Tvoji termini</div>${ts.map((e) => h`<div class="row between" style="padding:8px 0;border-bottom:1px solid var(--line)"><div><b>${dl(e.datum)}</b><div class="small muted">${fmt(e.od)}–${fmt(e.do)}${e.nota ? ' · ' + e.nota : ''}</div></div><span class="badge">termin</span></div>`)}
        <a class="btn sm block mt-s" href="#/moj?tab=poruke">Ne mogu doći, javi trenerici</a></div>` : ''}
      ${progs.length ? h`<div class="card"><div class="eyebrow">Tvoj trening kad si sama</div><p class="small muted" style="margin:4px 0 8px">Postavila ti ga je trenerica za dane kad nismo zajedno.</p>${progs.map((pr) => h`<a class="ex" href="#/program/${pr.id}"><div class="ph">${icon('dumbbell')}</div><div class="grow"><b>Trening za samostalan rad</b><div class="small">${pr.dani.length} ${pr.dani.length === 1 ? 'dan' : 'dana'}</div></div></a>`)}</div>` : ''}
      ${FS.igCard ? FS.igCard('Treba ti pomoć ili promjena?', 'Piši mi direktno na Instagramu.') : ''}
      <div class="row mt"><button class="btn sm grow" data-act="pw">Promijeni lozinku</button><button class="btn sm grow danger" data-act="out">Odjava</button></div>`;
  };
})();
