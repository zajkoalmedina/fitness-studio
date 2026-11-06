/* Poruke klijentica: pregled svih razgovora za trenericu (nepročitane na vrhu, značka u donjoj navigaciji). */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, icon, toast, $ } = FS;
  const V = (FS.views = FS.views || {});
  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const timeOf = (ts) => { const d = new Date(ts), n = new Date(); const t = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); return d.toDateString() === n.toDateString() ? t : d.getDate() + '.' + (d.getMonth() + 1) + '. ' + t; };
  FS.porukeNovo = () => (jeT() && FS.chat ? FS.chat.unread('trener') : 0);

  V.poruke = (el, p, q) => {
    if (!jeT()) { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    const msgs = Store.db.chat || [], by = {};
    msgs.forEach((m) => { (by[m.userId] = by[m.userId] || []).push(m); });
    const rows = Object.keys(by).map((id) => { const u = Store.user(id); if (!u) return null; const ms = by[id].slice().sort((a, b) => a.ts - b.ts), last = ms[ms.length - 1];
      return { u, last, n: ms.filter((m) => m.from !== 'trener' && !m.read).length }; }).filter(Boolean).sort((a, b) => (b.n > 0) - (a.n > 0) || b.last.ts - a.last.ts);
    const sel = q.k && Store.user(q.k);
    const snip = (m) => (m.tekst ? m.tekst.slice(0, 60) : m.media ? (m.media.kind === 'video' ? 'Video' : 'Glasovna poruka') : '');
    const ukupno = rows.reduce((s, r) => s + r.n, 0);
    el.innerHTML = h`<div class="eyebrow">Klijentice</div><h1>Poruke${ukupno ? h` <span class="badge" style="background:var(--rose-2);color:#fff">${ukupno}</span>` : ''}</h1>
      ${sel ? h`<a href="#/poruke" class="small">← Svi razgovori</a><div class="user-chip mb mt-s"><div class="avatar">${FS.initials(sel.ime)}</div><div class="grow"><b>${sel.ime}</b><div class="small"><a href="#/trener/klijentica/${sel.id}">Otvori profil klijentice</a></div></div></div><div id="chatbox"></div>` : h`
        ${rows.length ? rows.map((r) => h`<a class="ex" href="#/poruke?k=${r.u.id}" style="${r.n ? 'border-color:var(--rose-2)' : ''}"><div class="ph">${icon('chat')}</div><div class="grow"><b>${r.u.ime}</b><div class="small">${r.last.from === 'trener' ? 'Ti: ' : ''}${snip(r.last)}</div></div><div class="small" style="text-align:right">${timeOf(r.last.ts)}${r.n ? h`<br><b style="background:var(--rose-2);color:#fff;border-radius:99px;padding:1px 8px">${r.n}</b>` : ''}</div></a>`) : h`<div class="card flat center"><p class="muted">Još nema poruka.</p></div>`}
        <div class="card mt"><label class="field"><span>Nova poruka klijentici</span><select data-act="nova"><option value="">Izaberi klijenticu…</option>${Store.klijentice().map((k) => h`<option value="${k.id}">${k.ime}</option>`)}</select></label></div>`}`;
    if (sel) FS.chatThread($('#chatbox', el), { userId: sel.id, me: 'trener', title: '' }); if (FS.refreshNav) FS.refreshNav();
    const ns = $('[data-act=nova]', el); if (ns) ns.addEventListener('change', () => { if (ns.value) location.hash = '#/poruke?k=' + ns.value; });
    const onDocs = (e) => { if (!e.detail || !e.detail.colls.includes('chat') || sel) return; window.removeEventListener('fs:docs', onDocs); if (FS.currentRoute === 'poruke') FS.rerender(); };
    window.addEventListener('fs:docs', onDocs); FS.onLeave && FS.onLeave(() => window.removeEventListener('fs:docs', onDocs));
  };

  /* obavijest čim stigne nova poruka (bilo gdje u aplikaciji) */
  let last = null;
  window.addEventListener('fs:docs', (e) => {
    if (!jeT() || !e.detail || !e.detail.colls.includes('chat')) return;
    const n = FS.porukeNovo();
    if (last !== null && n > last && FS.currentRoute !== 'poruke') toast('Nova poruka od klijentice.');
    last = n; if (FS.refreshNav) FS.refreshNav();
  });
  setTimeout(() => { last = FS.porukeNovo(); if (FS.refreshNav) FS.refreshNav(); }, 2500);
})();
