/* Periodizacija i deload: sedmični plan opterećenja za program */
(function () {
  const FS = (window.FS = window.FS || {});

  FS.PER_TIPOVI = [
    ['nema', 'Bez periodizacije (stalno isto)'],
    ['linearna', 'Linearna – intenzitet raste, volumen pada'],
    ['blok', 'Blok – akumulacija pa intenzifikacija'],
    ['valovita', 'Valovita – teški, srednji i lagani dani']
  ];
  FS.PER_OPIS = {
    nema: 'Isti broj serija i ponavljanja svake sedmice. Napredak ide povećanjem težine kad ti postane lako.',
    linearna: 'Kroz sedmice postepeno raste težina, a ponavljanja i serije lagano padaju. Pogodno za pripremu snage.',
    blok: 'Prvi blok (akumulacija): volumen postepeno raste uz istu težinu. Drugi blok (intenzifikacija): težina raste, volumen pada.',
    valovita: 'Unutar sedmice se smjenjuju teški dan (manje ponavljanja, veća težina), srednji dan i lagani dan (više ponavljanja, manja težina).'
  };
  FS.DELOAD_OPC = [['0', 'Bez deloada'], ['3', 'Svake 3. sedmice'], ['4', 'Svake 4. sedmice'], ['5', 'Svake 5. sedmice'], ['6', 'Svake 6. sedmice']];
  FS.DELOAD_OPIS = 'Deload je lakša sedmica: serije se prepolove, težina ostaje blizu (oko 90 %), a ponavljanja ostaju lagana s rezervom od najmanje 4. Cilj je oporavak, a ne napredak.';

  const NOLOAD = new Set(['sklekzid', 'sklek', 'sidelift', 'cucanj', 'frogpump', 'bridge']);
  const SKIP_GR = new Set(['Core', 'Disanje', 'Mobilnost', 'Kardio']);
  const isLoaded = (id) => {
    if (NOLOAD.has(id)) return false;
    const e = FS.Store && FS.Store.ex ? FS.Store.ex(id) : (FS.EXERCISES || []).find((x) => x.id === id);
    return !(e && SKIP_GR.has(e.grupa));
  };
  const hasTimeUnit = (r) => /\bs\b|min|×|x\s?\d/.test(String(r));

  FS.perOf = (p) => ({ tip: (p && p.per && p.per.tip) || 'nema', deload: parseInt(p && p.per && p.per.deload, 10) || 0 });

  /* informacije o sedmici (1..sedmica) */
  FS.weekInfo = (p, week) => {
    const per = FS.perOf(p), N = Math.max(1, parseInt(p.sedmica, 10) || 1), w = Math.min(Math.max(1, week | 0), N), D = per.deload;
    const isDeload = D > 0 && w % D === 0;
    let T = 0, t = 0;
    for (let i = 1; i <= N; i++) { if (!(D > 0 && i % D === 0)) { T++; if (i <= w) t++; } }
    const x = T > 1 ? Math.max(0, (t - 1) / (T - 1)) : 0;
    const info = { w, N, tip: per.tip, deload: isDeload, t, T, setsAdj: 0, loadPct: 100, repShift: 0, faza: '', rir: '2–3', ciklus: per.tip === 'valovita' };
    if (isDeload) return { ...info, faza: 'Deload', setsMult: 0.5, loadPct: 90, repShift: 0, rir: '4 ili više', opis: 'Lakša sedmica za oporavak.', deload: true };
    if (per.tip === 'linearna') {
      Object.assign(info, { faza: 'Linearna', loadPct: Math.round(100 + 10 * x), repShift: -Math.round(2 * x), setsAdj: -Math.round(1 * x), rir: x > 0.66 ? '1–2' : '2–3' });
    } else if (per.tip === 'blok') {
      const A = Math.max(1, Math.ceil(T * 0.6));
      if (t <= A) Object.assign(info, { faza: 'Akumulacija', setsAdj: Math.floor((2 * (t - 1)) / A), loadPct: 100, repShift: 0, rir: '2–3' });
      else { const I = Math.max(1, T - A), j = t - A; Object.assign(info, { faza: 'Intenzifikacija', setsAdj: j > Math.ceil(I / 2) ? -1 : 0, loadPct: Math.round(105 + (I > 1 ? (5 * (j - 1)) / (I - 1) : 0)), repShift: -2, rir: '1–2' }); }
    } else if (per.tip === 'valovita') {
      Object.assign(info, { faza: 'Valovita', loadPct: 100 + Math.min(10, 2 * (t - 1)), rir: '1–3' });
    } else Object.assign(info, { faza: 'Standardno', loadPct: 100 });
    return info;
  };

  /* mjenjuje brojeve u tekstu ponavljanja (npr. "8–10" ili "10 po nozi") */
  const shiftReps = (r, d, min) => String(r).replace(/\d+/g, (m) => String(Math.max(min, parseInt(m, 10) + d))).replace(/^(\d+)[–-]\1\b/, '$1');

  /* primjenjuje sedmicu i dan na jednu vježbu iz programa; vraća {s, r, n, pct} */
  FS.applyWeek = (p, week, dayIdx, x) => {
    const wi = FS.weekInfo(p, week), loaded = isLoaded(x.id);
    let s = x.s, r = x.r, pct = null, tag = '';
    if (wi.deload) {
      s = Math.max(1, Math.ceil(x.s * (wi.setsMult || 0.5)));
      if (loaded) pct = wi.loadPct;
    } else if (wi.tip === 'valovita') {
      const k = dayIdx % 3;
      const mode = [{ n: 'teški', shift: -3, pct: 8 }, { n: 'srednji', shift: 0, pct: 0 }, { n: 'lagani', shift: 3, pct: -8 }][k];
      tag = mode.n;
      if (loaded && !hasTimeUnit(r)) { r = shiftReps(r, mode.shift, 4); pct = wi.loadPct + mode.pct; }
      else if (loaded) pct = wi.loadPct + mode.pct;
    } else {
      s = Math.max(2, x.s + wi.setsAdj);
      if (x.s <= 2) s = x.s;
      if (loaded) { if (!hasTimeUnit(r) && wi.repShift) r = shiftReps(r, wi.repShift, 5); pct = wi.loadPct; }
    }
    return { s, r, pct: pct && pct !== 100 ? pct : null, tag };
  };

  FS.weekDays = (p, week) => (p.dani || []).map((d, di) => ({ naziv: d.naziv, vj: d.vj.map((x) => ({ ...x, ...FS.applyWeek(p, week, di, x) })) }));

  /* ukupno direktnih serija po mišićnoj grupi u sedmici */
  FS.weekVolume = (p, week) => {
    const vol = {}; FS.MISICI.forEach((m) => { vol[m] = 0; });
    FS.weekDays(p, week || 1).forEach((d) => d.vj.forEach((x) => { const m = FS.primMisic(x.id); if (m && vol[m] != null) vol[m] += x.s; }));
    return vol;
  };

  /* trenutna sedmica klijentice u programu (počinje od prvog otvaranja/dodjele) */
  FS.currentWeek = (u, p) => {
    if (!u || !p) return 1;
    u.pstart = u.pstart || {};
    if (!u.pstart[p.id]) { u.pstart[p.id] = FS.today(); try { FS.Store.save(); } catch (e) { /* ignoriši */ } }
    const a = FS.parse(u.pstart[p.id]), b = FS.parse(FS.today());
    const days = Math.max(0, Math.round((b - a) / 86400000));
    return Math.min(parseInt(p.sedmica, 10) || 1, Math.floor(days / 7) + 1);
  };
})();
