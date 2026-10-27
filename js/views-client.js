/* Ekrani za klijenticu: moj prostor, evidencija treninga, napredak, poruke */
(function () {
  const FS = (window.FS = window.FS || {});
  FS.views = FS.views || {};
  const V = FS.views;
  const { h, icon, bind, formData, opts, toast, openSheet, closeSheet, confirmSheet, Store, Auth, config, num, r1, fmtDate, today, uid, $, addDays, weekStart } = FS;
  const go = (hash) => { location.hash = hash; };

  const subnav = (tab) => h`<div class="seg">${[['pregled', 'Pregled'], ['trening', 'Treninzi'], ['napredak', 'Napredak'], ['poruke', 'Poruke']].map(([k, l]) => h`<a href="#/moj?tab=${k}" class="${tab === k ? 'on' : ''}">${l}</a>`)}</div>`;

  function passSheet(u, forced) {
    openSheet(h`<h2>${forced ? 'Postavi svoju lozinku' : 'Promjena lozinke'}</h2>${forced ? h`<p class="muted">Račun ti je napravila trenerica s privremenom lozinkom. Postavi svoju.</p>` : ''}
      <form data-act="pw" novalidate><label class="field"><span>Nova lozinka (min. 8 znakova, slovo i broj)</span><input type="password" name="p" autocomplete="new-password"></label>
      <p class="err" id="perr" hidden></p><button class="btn primary block" type="submit">Sačuvaj</button>${forced ? '' : h`<button class="btn block mt-s" type="button" data-act="x">Odustani</button>`}</form>`,
    (s) => bind(s, {
      'click:x': () => closeSheet(),
      'submit:pw': async (f) => {
        try { await Auth.setPassword(u.id, formData(f).p); u.mora_promijeniti = false; Store.save(); closeSheet(); toast('Lozinka je promijenjena.'); } catch (e) { const er = $('#perr', s); er.textContent = e.message; er.hidden = false; }
      }
    }));
  }

  /* ================= MOJ PROSTOR ================= */
  V.moj = (el, p, q) => {
    const u = Auth.user();
    const tab = ['pregled', 'trening', 'napredak', 'poruke'].includes(q.tab) ? q.tab : 'pregled';
    const logs = Store.logsOf(u.id), mj = Store.mjereOf(u.id);
    const first = u.ime.split(' ')[0];
    let body = '';

    if (tab === 'pregled') {
      const ciljN = u.paket ? config.ciljPoPaketu[u.paket] : 0, wc = Store.weekCount(u.id), mon = today().slice(0, 7);
      const progs = Store.userPrograms(u);
      const last = mj[mj.length - 1];
      body = h`
        ${FS.upitnikBanner ? FS.upitnikBanner(u) : ''}
        ${u.mora_promijeniti ? h`<div class="card note"><b>Postavi svoju lozinku.</b><button class="btn sm mt-s" data-act="pw">Promijeni lozinku</button></div>` : ''}
        <div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Tvoj paket</div>
          ${u.paket ? h`<div class="row between"><h2 style="margin:0">${u.paket}</h2><span class="small">${ciljN} treninga sedmično</span></div>
            <div class="progress mt-s" role="progressbar" aria-valuenow="${wc}" aria-valuemax="${ciljN}"><i style="width:${Math.min(100, (wc / ciljN) * 100)}%"></i></div>
            <div class="small mt-s">Ove sedmice: <b>${wc}</b> od ${ciljN}</div>` : h`<p class="muted" style="margin:0 0 8px">Trenutno nemaš aktivan coaching paket.</p><a class="btn dark sm" href="#/paketi">Pogledaj pakete</a>`}</div>
        ${FS.rasporedCard ? FS.rasporedCard(u) : ''}
        <a class="btn primary block mb" href="#/trening/novi">${icon('plus')} Započni trening</a>
        <div class="stats"><div class="stat"><b>${logs.length}</b><span>ukupno treninga</span></div><div class="stat"><b>${logs.filter((l) => l.datum.startsWith(mon)).length}</b><span>ovaj mjesec</span></div><div class="stat"><b>${last && last.tezina ? last.tezina : '–'}</b><span>zadnja težina (kg)</span></div></div>
        <h3>Moji programi</h3>
        ${progs.length ? progs.map((pr) => h`<a class="ex" href="#/program/${pr.id}"><div class="ph">${icon('clipboard')}</div><div class="grow"><b>${pr.naziv}</b><div class="small">${FS.accessLabel(pr, u)} · ${pr.dani.length} dana</div></div></a>`) : h`<div class="card flat center"><p class="muted">Još nemaš programa.</p><a class="btn sm" href="#/programi">Pogledaj programe</a></div>`}
        <a class="ex" href="#/kondicija"><div class="ph">${icon('flame')}</div><div class="grow"><b>Kondicija: EMOM, HIIT, AMRAP</b><div class="small">Intenzivni treninzi s tajmerom</div></div></a>
        <a class="ex" href="#/ishrana"><div class="ph">${icon('flame')}</div><div class="grow"><b>Vodič za ishranu</b><div class="small">Principi, recepti, primjer dana</div></div></a>
        <a class="ex" href="#/dijastaza"><div class="ph">${icon('heart')}</div><div class="grow"><b>Kućni program za dijastazu</b><div class="small">Besplatno · 4 faze</div></div></a>
        <div class="row mt"><button class="btn sm grow" data-act="pw">Promijeni lozinku</button><button class="btn sm grow danger" data-act="out">Odjava</button></div>`;
    }

    if (tab === 'trening') {
      body = h`<a class="btn primary block mb" href="#/trening/novi">${icon('plus')} Novi trening</a>
        ${logs.length ? logs.map((l) => { const pr = l.programId === 'dijastaza' ? { naziv: 'Dijastaza' } : Store.program(l.programId); return h`<details class="card"><summary style="cursor:pointer"><div class="row between"><b>${fmtDate(l.datum)}</b><span class="small">${l.trajanje || '–'} min · RPE ${l.rpe || '–'}</span></div><div class="small">${l.dan || 'Slobodan trening'}${pr ? ' · ' + pr.naziv : ''}</div></summary>
          <div class="mt-s">${l.vjezbe.map((v) => { const e = Store.ex(v.id); return h`<div class="kv"><span>${e ? e.naziv : v.id}</span><b>${v.serije.map((s) => (s.kg ? s.kg + '×' : '') + s.rep).join(' · ')}</b></div>`; })}${l.kond ? h`<div class="kv"><span>Rezultat</span><b>${l.kond}</b></div>` : ''}</div>
          ${l.biljeska ? h`<p class="small mt-s">${l.biljeska}</p>` : ''}<button class="btn sm danger mt-s" data-act="dellog" data-id="${l.id}">Obriši</button></details>`; }) : h`<div class="empty">Još nema zabilježenih treninga.</div>`}`;
    }

    if (tab === 'napredak') {
      const wpts = mj.filter((m) => m.tezina).map((m) => ({ x: m.datum, y: m.tezina }));
      const spts = mj.filter((m) => m.struk).map((m) => ({ x: m.datum, y: m.struk }));
      const mon = weekStart(today()), wk = [], lb = [];
      for (let i = 7; i >= 0; i--) { const w = addDays(mon, -7 * i); wk.push(Store.weekCount(u.id, w)); const d = FS.parse(w); lb.push(`${d.getDate()}.${d.getMonth() + 1}.`); }
      const best = Store.best(u.id), bl = Object.entries(best).filter(([, b]) => b.kg > 0).sort((a, b) => b[1].kg - a[1].kg).slice(0, 8);
      const diff = (a) => (a.length > 1 ? r1(a[a.length - 1].y - a[0].y) : null);
      const dw = diff(wpts);
      body = h`<div class="stats"><div class="stat"><b>${wpts.length ? wpts[wpts.length - 1].y : '–'}</b><span>težina (kg)</span></div><div class="stat"><b>${dw == null ? '–' : (dw > 0 ? '+' : '') + dw}</b><span>promjena (kg)</span></div><div class="stat"><b>${spts.length ? spts[spts.length - 1].y : '–'}</b><span>struk (cm)</span></div></div>
        <div class="card"><h3>Težina (kg)</h3>${FS.lineChart(wpts, { label: 'Težina kroz vrijeme' })}</div>
        <div class="card"><h3>Obim struka (cm)</h3>${FS.lineChart(spts, { label: 'Struk kroz vrijeme' })}</div>
        <div class="card"><h3>Treninga po sedmici</h3>${FS.barChart(wk, lb, { label: 'Treninga po sedmici' })}</div>
        <div class="card"><h3>Lični rekordi</h3>${bl.length ? bl.map(([id, b]) => h`<div class="kv"><span>${(Store.ex(id) || { naziv: id }).naziv}</span><b>${b.kg} kg × ${b.rep}</b></div>`) : h`<p class="muted">Rekordi se pojavljuju kad upišeš treninge s tegovima.</p>`}</div>
        ${FS.mjTable(mj)}
        <div class="card"><h3>Novo mjerenje</h3>${FS.mjForm()}</div>
        <h3>Historija mjerenja</h3>
        ${FS.mjHistory(mj, true)}`;
    }

    if (tab === 'poruke') {
      const ms = Store.db.poruke.filter((m) => m.userId === u.id).sort((a, b) => (a.datum < b.datum ? 1 : -1));
      body = h`<div id="chatbox"></div>
        <details class="card mt"><summary style="cursor:pointer"><b>Raniji upiti</b> <span class="small">(${ms.length})</span></summary>
        ${ms.length ? ms.map((m) => h`<div class="card flat"><div class="small">${fmtDate(m.datum)} · ${m.status === 'obradjeno' ? 'odgovoreno' : 'čeka odgovor'}</div><p style="margin:6px 0">${m.tekst}</p>${m.odgovor ? h`<div class="card cream" style="margin:0"><b>Odgovor trenerice:</b><br>${m.odgovor}</div>` : ''}</div>`) : h`<div class="empty">Nema ranijih upita.</div>`}</details>`;
    }

    el.innerHTML = h`<div class="user-chip mb"><div class="avatar">${FS.initials(u.ime)}</div><div><h1 style="margin:0;font-size:26px">Zdravo, ${first}</h1><div class="small">${FS.longDate()}</div></div></div>${subnav(tab)}${body}`;
    if (u.mora_promijeniti && tab === 'pregled') setTimeout(() => { if (location.hash.startsWith('#/moj')) passSheet(u, true); }, 300);

    const rerender = () => FS.rerender();
    if (tab === 'poruke') FS.chatThread($('#chatbox', el), { userId: u.id, me: 'klijent', title: 'Razgovor s trenericom' });
    bind(el, {
      'click:pw': () => passSheet(u, false),
      'click:out': () => { Auth.logout(); FS.refreshNav(); toast('Odjava uspješna.'); go('#/'); },
      'click:dellog': async (b) => { if (await confirmSheet({ title: 'Obrisati trening?', text: 'Ova radnja se ne može poništiti.', ok: 'Obriši', danger: true })) { Store.db.logs = Store.db.logs.filter((l) => l.id !== b.dataset.id); Store.save(); rerender(); } },
      'click:delmj': async (b) => { if (await confirmSheet({ title: 'Obrisati mjerenje?', text: 'Ova radnja se ne može poništiti.', ok: 'Obriši', danger: true })) { Store.db.mjere = Store.db.mjere.filter((m) => m.id !== b.dataset.id); Store.save(); rerender(); } },
      'submit:mj': (f) => { if (FS.mjSubmit(f, u.id, el)) rerender(); },
      'submit:msg': (f) => {
        const t = String(formData(f).t || '').trim(), er = $('#merr', el);
        if (t.length < 3) { er.textContent = 'Napiši poruku.'; er.hidden = false; return; }
        Store.db.poruke.push({ id: uid(), userId: u.id, tip: 'upit', tekst: t.slice(0, 1200), datum: today(), status: 'novo', odgovor: '' });
        Store.save(); toast('Poruka poslana.'); rerender();
      }
    });
  };

  /* ================= EVIDENCIJA TRENINGA (novi trening) ================= */
  function sourceDay(pid, d, f, w) {
    if (pid === 'dijastaza') { const fz = FS.DIJASTAZA.faze[+f]; const dd = fz && (fz.dani[+d || 0] || fz.dani[0]); return fz ? { naziv: fz.naziv + (fz.dani.length > 1 ? ' · ' + dd.naziv : ''), vj: dd.vj } : null; }
    const pr = Store.program(pid); if (!pr || !pr.dani[+d]) return null;
    const wk = Math.min(pr.sedmica || 1, Math.max(1, parseInt(w, 10) || 1)); return FS.weekDays(pr, wk)[+d];
  }
  const srcSig = (src) => src ? src.vj.map((x) => [x.id, x.s, x.r, x.pct, x.p, x.fix, x.ss].join(':')).join('|') : '';
  function buildDraft(u, q) {
    const d = { uid: u.id, start: Date.now(), programId: null, dan: '', vjezbe: [], rpe: '', biljeska: '' };
    const src = q.p ? sourceDay(q.p, q.d, q.f, q.w || FS.currentWeek(u, Store.program(q.p))) : null;
    if (src) {
      d.programId = q.p; d.dan = src.naziv; d.sig = srcSig(src); d.q = { p: q.p, d: q.d, f: q.f, w: q.w || FS.currentWeek(u, Store.program(q.p)) };
      src.vj.forEach((x) => {
        const last = Store.lastSets(u.id, x.id), n = x.s || 3, base = x.pct ? Store.baseKg(u.id, x.id) : 0;
        const sug = base ? Math.round((base * x.pct / 100) / (base >= 20 ? 2.5 : 1)) * (base >= 20 ? 2.5 : 1) : 0;
        d.vjezbe.push({ id: x.id, pauza: FS.pauza ? FS.pauza(x) : 0, cilj: x.r + (x.pct ? ' · ≈ ' + x.pct + ' % težine iz 1. sedmice' + (sug ? ' (prijedlog ' + sug + ' kg)' : '') : ''), serije: Array.from({ length: n }, (_, i) => ({ kg: sug ? String(sug) : (last && last[i] && last[i].kg ? String(last[i].kg) : ''), rep: String(parseInt(x.r, 10) || ''), ok: false })) });
      });
    }
    return d;
  }

  V.trening_novi = (el, p, q) => {
    const u = Auth.user();
    let d = Store.draft.get();
    const clean = () => { try { history.replaceState(null, '', '#/trening/novi'); } catch (e) { /* ignoriši */ } };
    const start = () => { d = buildDraft(u, q); Store.draft.set(d); clean(); draw(); };
    const hasWork = d && d.uid === u.id && d.vjezbe.some((v) => v.serije.some((s) => s.ok));
    const mine = d && d.uid === u.id;

    function draw() {
      const prs = Store.userPrograms(u).filter((pr) => FS.access(u, pr).on);
      if (!d || d.uid !== u.id || (!d.vjezbe.length && !d.programId && !d.free)) {
        el.innerHTML = h`<h1>Novi trening</h1><p class="muted">Izaberi šta danas treniraš.</p>
          ${prs.map((pr) => h`<div class="card"><h3>${pr.naziv}</h3><div class="row wrap">${pr.dani.map((dn, i) => h`<a class="btn sm" href="#/trening/novi?p=${pr.id}&d=${i}&w=${FS.currentWeek(u, pr)}">${dn.naziv}</a>`)}</div></div>`)}
          <div class="card"><h3>Dijastaza – kućni program</h3><div class="row wrap">${FS.DIJASTAZA.faze.map((f, i) => f.dani.map((dd, di) => h`<a class="btn sm" href="#/trening/novi?p=dijastaza&f=${i}&d=${di}">Faza ${i + 1} ${dd.naziv.replace('Trening ', '')}</a>`))}</div></div>
          <button class="btn block" data-act="free">Slobodan trening (sama biram vježbe)</button>`;
        return;
      }
      el.innerHTML = h`<div class="eyebrow">${d.dan || 'Slobodan trening'}</div><h1>Trening</h1><p class="small" id="timer">Upiši kilažu i ponavljanja, pa označi ✓ svaku završenu seriju.</p><div class="restbar" id="rest" hidden><span id="resttxt"></span><button type="button" data-act="restoff">Preskoči</button></div>
        ${d.vjezbe.map((v, vi) => { const e = Store.ex(v.id) || { naziv: v.id }; const last = Store.lastSets(u.id, v.id);
          return h`<div class="card" data-vi="${vi}"><div class="row between"><div class="grow"><a href="#/vjezba/${v.id}"><b style="color:var(--cream);font-size:17px">${e.naziv}</b></a>${v.cilj ? h`<div class="small">Cilj: ${v.cilj}</div>` : ''}${v.pauza ? h`<div class="small rest">Pauza između serija: ${v.pauza >= 60 && v.pauza % 60 === 0 ? v.pauza / 60 + ' min' : v.pauza + ' s'}</div>` : (v.pauza === 0 ? h`<div class="small rest">Bez pauze: odmah sljedeća vježba</div>` : '')}${last ? h`<div class="small">Zadnji put: ${last.map((s) => (s.kg ? s.kg + '×' : '') + s.rep).join(' · ')}</div>` : ''}</div><button class="icon-btn" data-act="rmex" data-vi="${vi}" aria-label="Ukloni vježbu">${icon('trash')}</button></div>
            <div class="setrow small mt-s" style="margin-bottom:4px"><span></span><span class="center">kg</span><span class="center">ponavljanja</span><span></span></div>
            ${v.serije.map((s, si) => h`<div class="setrow"><span class="n">${si + 1}</span><input inputmode="decimal" data-act="kg" data-vi="${vi}" data-si="${si}" value="${s.kg}" placeholder="0" aria-label="Kilogrami"><input inputmode="numeric" data-act="rep" data-vi="${vi}" data-si="${si}" value="${s.rep}" placeholder="0" aria-label="Ponavljanja"><button class="ok ${s.ok ? 'on' : ''}" data-act="ok" data-vi="${vi}" data-si="${si}" aria-label="Završeno">✓</button></div>`)}
            <button class="btn sm" data-act="addset" data-vi="${vi}">+ serija</button></div>`; })}
        <button class="btn block mb" data-act="addex">${icon('plus')} Dodaj vježbu</button>
        <div class="card"><h3>Završetak</h3><form data-act="fin" novalidate>
          <div class="grid2"><label class="field"><span>Trajanje (min)</span><input name="tr" inputmode="numeric" value="${Math.max(1, Math.round((Date.now() - d.start) / 60000))}"></label>
          <label class="field"><span>Napor (RPE 1–10)</span><select name="rpe">${opts([['', '–'], ...Array.from({ length: 10 }, (_, i) => String(i + 1))], d.rpe)}</select></label></div>
          <label class="field"><span>Bilješka</span><textarea name="b" maxlength="500">${d.biljeska}</textarea></label>
          <p class="err" id="ferr" hidden></p><button class="btn primary block" type="submit">Sačuvaj trening</button></form>
          <button class="btn sm danger block mt-s" data-act="cancel">Odbaci trening</button></div>`;
    }

    const save = () => Store.draft.set(d);
    const run = () => {
      if (!q.p && mine && d.q && d.q.p) { const c = sourceDay(d.q.p, d.q.d, d.q.f, d.q.w); if (c && c.naziv === d.dan) q = d.q; } // nastavak: provjeri je li trenerica promijenila dan
      const src = q.p ? sourceDay(q.p, q.d, q.f, q.w || FS.currentWeek(u, Store.program(q.p))) : null;
      if (q.p && mine && d.programId === q.p && src && d.dan === src.naziv) {
        const cur = d.sig || d.vjezbe.filter((v) => !v.extra).map((v) => v.id).join('|');
        const want = d.sig ? srcSig(src) : src.vj.map((x) => x.id).join('|');
        if (cur !== want) { // trenerica je u međuvremenu promijenila ovaj dan: osvježi vježbe, sačuvaj već upisano
          const old = d.vjezbe, nd = buildDraft(u, q), used = new Set();
          nd.vjezbe.forEach((v) => { const i = old.findIndex((o, k) => !o.extra && !used.has(k) && o.id === v.id); if (i >= 0) { used.add(i); const o = old[i]; v.serije.forEach((s2, si) => { if (o.serije[si]) { s2.kg = o.serije[si].kg; s2.rep = o.serije[si].rep; s2.ok = o.serije[si].ok; } }); } });
          old.forEach((o) => { if (o.extra) nd.vjezbe.push(o); });
          nd.start = d.start; nd.rpe = d.rpe; nd.biljeska = d.biljeska; d = nd; Store.draft.set(d); toast('Trening je ažuriran: trenerica je promijenila vježbe.');
        }
        clean(); draw();
      } // isti trening: nastavi gdje je stala
      else if (q.p && mine && hasWork) {
        confirmSheet({ title: 'Imaš nezavršen trening', text: 'Započeti novi i odbaciti nezavršeni?', ok: 'Novi trening', cancel: 'Nastavi stari' }).then((ok) => { if (ok) start(); else { clean(); draw(); } });
      } else if (q.p) start();
      else draw();
    };
    run();

    let restT = 0;
    const stopRest = () => { clearInterval(restT); const b = $('#rest', el); if (b) b.hidden = true; };
    const startRest = (sec) => {
      clearInterval(restT); const b = $('#rest', el), tx = $('#resttxt', el); if (!b || !tx) return;
      let left = sec; b.hidden = false; tx.textContent = 'Pauza: ' + left + ' s';
      restT = setInterval(() => { left--; if (left <= 0) { stopRest(); try { navigator.vibrate && navigator.vibrate(200); } catch (e) { /* ignoriši */ } toast('Pauza gotova, sljedeća serija!'); } else tx.textContent = 'Pauza: ' + left + ' s'; }, 1000);
    };
    FS.onLeave(() => clearInterval(restT));
    const tick = setInterval(() => { const t = $('#timer', el); if (!t || !d) return; const m = Math.floor((Date.now() - d.start) / 60000); t.textContent = `Traje ${m} min · označi ✓ svaku završenu seriju.`; }, 15000);
    FS.onLeave(() => clearInterval(tick));

    bind(el, {
      'click:free': () => { d = { uid: u.id, start: Date.now(), programId: null, dan: '', vjezbe: [], rpe: '', biljeska: '', free: true }; save(); draw(); },
      'input:kg': (t) => { d.vjezbe[t.dataset.vi].serije[t.dataset.si].kg = t.value; save(); },
      'input:rep': (t) => { d.vjezbe[t.dataset.vi].serije[t.dataset.si].rep = t.value; save(); },
      'click:ok': (t) => { const v = d.vjezbe[t.dataset.vi], s = v.serije[t.dataset.si]; s.ok = !s.ok; t.classList.toggle('on', s.ok); save(); if (s.ok && v.pauza > 0) startRest(v.pauza); },
      'click:restoff': () => stopRest(),
      'click:addset': (t) => { const v = d.vjezbe[t.dataset.vi], l = v.serije[v.serije.length - 1] || { kg: '', rep: '' }; v.serije.push({ kg: l.kg, rep: l.rep, ok: false }); save(); draw(); },
      'click:rmex': (t) => { d.vjezbe.splice(+t.dataset.vi, 1); save(); draw(); },
      'click:addex': () => {
        const draw2 = (qs) => { const r = (FS.allowedExercises ? FS.allowedExercises(u) : Store.exercises()).filter((e) => !qs || e.naziv.toLowerCase().includes(qs.toLowerCase())); return h`${r.map((e) => h`<button class="ex" style="width:100%;text-align:left;font:inherit" data-act="pick" data-id="${e.id}"><div class="grow"><b>${e.naziv}</b><div class="small">${e.grupa} · ${e.nivo}</div></div></button>`)}`.s; };
        openSheet(h`<h2>Dodaj vježbu</h2><label class="field"><input type="search" data-act="sq" placeholder="Pretraži…"></label><div id="pl">${FS.raw(draw2(''))}</div>`, (s) => bind(s, {
          'input:sq': (i) => { $('#pl', s).innerHTML = draw2(i.value); },
          'click:pick': (b) => { const last = Store.lastSets(u.id, b.dataset.id); d.vjezbe.push({ id: b.dataset.id, extra: true, cilj: '', serije: Array.from({ length: 3 }, (_, i) => ({ kg: last && last[i] && last[i].kg ? String(last[i].kg) : '', rep: last && last[i] ? String(last[i].rep) : '10', ok: false })) }); save(); closeSheet(); draw(); }
        }));
      },
      'click:cancel': async () => { if (await confirmSheet({ title: 'Odbaciti trening?', text: 'Uneseni podaci će biti izgubljeni.', ok: 'Odbaci', danger: true })) { Store.draft.clear(); d = null; go('#/moj'); } },
      'submit:fin': (f) => {
        const x = formData(f), er = $('#ferr', el);
        const vj = d.vjezbe.map((v) => {
          const ser = v.serije.filter((s) => s.ok);
          return { id: v.id, serije: ser.map((s) => ({ kg: num(s.kg) || 0, rep: num(s.rep) || 0, ok: true })).filter((s) => s.rep > 0) };
        }).filter((v) => v.serije.length);
        if (!vj.length) { er.textContent = 'Označi barem jednu završenu seriju (✓) s brojem ponavljanja.'; er.hidden = false; return; }
        const before = Store.best(u.id);
        const log = { id: uid(), userId: u.id, datum: today(), programId: d.programId, dan: d.dan, trajanje: Math.min(600, Math.max(1, num(x.tr) || 1)), rpe: num(x.rpe) || null, biljeska: String(x.b || '').slice(0, 500), vjezbe: vj };
        Store.db.logs.push(log); Store.save(); Store.draft.clear(); d = null;
        const after = Store.best(u.id), pr = Object.keys(after).filter((k) => before[k] && after[k].kg > before[k].kg);
        toast(pr.length ? `Trening sačuvan. Novi lični rekord: ${(Store.ex(pr[0]) || { naziv: pr[0] }).naziv}!` : 'Trening sačuvan. Bravo!');
        go('#/moj?tab=trening');
      }
    });
  };
})();
