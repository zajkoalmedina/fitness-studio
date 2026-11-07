/* Obavijesti za trenericu: klijent završi trening, upiše mjerenje, pošalje poruku ili početni pregled.
   Prikazuju se na vrhu Panela i kao broj na dugmetu Panel dok ih ne označi kao viđene. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, toast, fmtDate } = FS;
  const V = (FS.views = FS.views || {});
  const tsOf = (o) => o.ts || (o.datum ? new Date(o.datum + 'T12:00:00').getTime() : 0);
  const ime = (id) => { const u = Store.user(id); return u ? u.ime : null; };
  const seen = () => (Store.db.postavke && Store.db.postavke.obavSeen) || 0;

  FS.obavijesti = () => {
    const out = [], db = Store.db;
    (db.logs || []).forEach((l) => { const n = ime(l.userId); if (n) out.push({ ts: tsOf(l), userId: l.userId, ikona: '✓', txt: n + ' je završila trening' + (l.dan ? ': ' + l.dan : '') + (l.rpe ? ' (RPE ' + l.rpe + ')' : '') }); });
    (db.mjere || []).forEach((m) => { const n = ime(m.userId); if (n && m.biljeska !== 'Iz BMI kalkulatora') out.push({ ts: tsOf(m), userId: m.userId, ikona: '📏', txt: n + ' je upisala mjerenje' + (m.tezina ? ' (' + m.tezina + ' kg)' : '') }); });
    (db.chat || []).forEach((m) => { const n = ime(m.userId); if (n && m.from !== 'trener') out.push({ ts: m.ts, userId: m.userId, ikona: '💬', txt: n + ' ti je poslala poruku' }); });
    (db.pregled || []).forEach((x) => { const n = ime(x.userId); if (n) out.push({ ts: tsOf(x), userId: x.userId, ikona: '▶', txt: n + ' je poslala početni pregled' }); });
    return out.filter((e) => e.ts).sort((a, b) => b.ts - a.ts);
  };
  FS.obavNovo = () => FS.obavijesti().filter((e) => e.ts > seen()).length;
  const vr = (ts) => { const d = new Date(ts); return d.getDate() + '.' + (d.getMonth() + 1) + '. ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  const t0 = V.trener;
  V.trener = (el, p, q) => {
    const r = t0(el, p, q);
    if (q && q.tab && q.tab !== 'pregled') return r;
    const all = FS.obavijesti(), nov = all.filter((e) => e.ts > seen()), card = h`<div class="card"><div class="row between"><h3 style="margin:0">Obavijesti${nov.length ? ' (' + nov.length + ' novo)' : ''}</h3>${nov.length ? h`<button class="btn sm" data-obav="1">Označi viđeno</button>` : ''}</div>
      ${all.length ? all.slice(0, 12).map((e) => h`<a class="ex" href="#/trener/klijentica/${e.userId}" style="${e.ts > seen() ? '' : 'opacity:.6'}"><div class="ph" style="font-size:20px">${e.ikona}</div><div class="grow"><b>${e.txt}</b><div class="small">${vr(e.ts)}</div></div></a>`) : h`<p class="muted" style="margin:8px 0 0">Još nema aktivnosti klijenata.</p>`}</div>`;
    const tiles = FS.panelAlati ? FS.panelAlati().s : '', first = el.querySelector('.stats');
    if (first) first.insertAdjacentHTML('beforebegin', tiles + card.s); else el.insertAdjacentHTML('afterbegin', tiles + card.s);
    return r;
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-obav]'); if (!b) return;
    Store.db.postavke = Object.assign({}, Store.db.postavke, { obavSeen: Date.now() }); Store.save(); toast('Označeno kao viđeno.'); if (FS.rerender) FS.rerender(); if (FS.refreshNav) FS.refreshNav();
  });
})();
