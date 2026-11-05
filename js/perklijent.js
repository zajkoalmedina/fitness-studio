/* Trenerica bira periodizaciju (linearna, blok, valovita...) i deload posebno za svaku klijenticu i program. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, toast, Store, opts } = FS;
  const V = (FS.views = FS.views || {});
  const POD = [['', 'Kao u programu']].concat(FS.PER_TIPOVI);
  const DOD = [['', 'Kao u programu']].concat(FS.DELOAD_OPC);

  /* kad trenerica otvori program iz profila klijentice (?k=id), prikaz koristi periodizaciju te klijentice */
  const v0 = V.program;
  V.program = (el, p, q) => {
    FS.perKlijent = q && q.k ? Store.user(q.k) : null;
    return v0(el, p, q);
  };

  FS.perKlijentCard = (u, programi) => {
    const rows = programi.filter((x) => x.tip !== 'vodic' && x.sedmica).map((x) => {
      const o = (u.perOver || {})[x.id] || {};
      return h`<div class="mb"><a href="#/program/${x.id}?k=${u.id}" class="small"><b>${x.naziv}</b></a>
        <div class="grid2"><label class="field" style="margin:4px 0"><span>Periodizacija</span><select data-pov="${x.id}|tip">${opts(POD, o.tip || '')}</select></label>
        <label class="field" style="margin:4px 0"><span>Deload</span><select data-pov="${x.id}|deload">${opts(DOD, o.tip != null && o.deload != null ? String(o.deload) : '')}</select></label></div></div>`;
    });
    return rows.length ? h`<div class="card"><h3>Periodizacija za ovu klijenticu</h3><p class="small muted">Biraš samo za nju: linearna, blok ili valovita, i koliko često je deload. Ostale klijentice se ne mijenjaju.</p>${rows}</div>` : '';
  };

  document.addEventListener('change', (e) => {
    const t = e.target.closest && e.target.closest('[data-pov]'); if (!t) return;
    const m = location.hash.match(/trener\/klijentica\/([^/?]+)/), u = m && Store.user(m[1]); if (!u) return;
    const [pid, f] = t.dataset.pov.split('|');
    const card = t.closest('.mb'), tip = card.querySelector('[data-pov$="|tip"]').value, dl = card.querySelector('[data-pov$="|deload"]').value;
    u.perOver = u.perOver || {};
    if (!tip) delete u.perOver[pid];
    else u.perOver[pid] = { tip, deload: dl === '' ? (FS.perOf({ id: pid, per: null }).deload || 4) : parseInt(dl, 10) };
    Store.save(); toast('Sačuvano za ovu klijenticu.'); if (FS.rerender) FS.rerender();
  });
})();
