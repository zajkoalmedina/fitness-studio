/* Automatski jelovnik: iz dnevnog cilja (kcal) slaže doručak, ručak, užinu i večeru iz recepata */
(function () {
  const FS = (window.FS = window.FS || {});
  const POR = [0.75, 1, 1.25, 1.5, 2];
  const SPLIT4 = { dorucak: 0.25, rucak: 0.35, uzina: 0.15, vecera: 0.25 }, SPLIT5 = { dorucak: 0.22, rucak: 0.31, uzina: 0.13, vecera: 0.24, d1: 0.10 };
  const GRP = { dorucak: ['Doručak'], rucak: ['Ručak'], uzina: ['Užina', 'Voće'], vecera: ['Večera', 'Ručak'], d1: ['Užina', 'Voće'] };
  const hash = (s) => { let x = 7; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; };
  const rnd = (seed) => { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return (x % 10000) / 10000; }; };

  /* namirnice koje klijentica bira (voli / ne jede) */
  FS.NAMIRNICE = [
    ['piletina', 'Piletina', /pile|pileć/], ['curetina', 'Ćuretina', /ćuret|pureć/], ['junetina', 'Junetina', /junet|govedin/],
    ['riba', 'Riba i tuna', /rib[aeu]|tun[aeiou]|pastrmk|losos/], ['jaja', 'Jaja', /jaj|omlet|kajgan/],
    ['mlijecno', 'Mliječni proizvodi', /jogurt|mlijek|\bsir|skyr|kefir|feta|mozzarell|parmezan/], ['grah', 'Grah, leća, grašak', /grah|leć|grašak|mahun/],
    ['riza', 'Riža', /riž/], ['tjestenina', 'Tjestenina', /tjestenin/], ['heljda', 'Heljda i zob', /heljd|zob|pahulj/], ['krompir', 'Krompir', /krompir|pire/],
    ['povrce', 'Tikvice, paprika, patlidžan', /tikvic|paprik|patlidžan|bamij/], ['spinat', 'Špinat', /špinat/], ['gljive', 'Gljive', /šampinjon|gljiv/],
    ['orasi', 'Orašasti plodovi', /orah|badem|kikiriki|lješnj/], ['voce', 'Voće', null]
  ];
  const tagCache = {};
  FS.recTags = (r) => {
    if (tagCache[r.id]) return tagCache[r.id];
    const txt = (r.naziv + ' ' + (r.sast || []).join(' ')).toLowerCase(), out = [];
    FS.NAMIRNICE.forEach(([k, , re]) => { if (k === 'voce' ? r.obrok === 'Voće' || /jabuk|banan|jagod|malin|borovnic/.test(txt) : re.test(txt)) out.push(k); });
    return (tagCache[r.id] = out);
  };

  /* ciljni makroi: ako nisu zadati, 25 % proteina, 25 % masti, ostalo UH */
  const macros = (T, M) => (M && M.p > 0 ? M : { p: (T * 0.25) / 4, m: (T * 0.25) / 9, uh: (T * 0.5) / 4 });

  /* jedan dan: kombinira obroke tako da se poklope i kalorije i makroi; vraća { dorucak: {id, por}, ... } */
  FS.autoDay = (target, seed, used, M, left, pref) => {
    const R = FS.RECEPTI_V || [], rand = rnd(hash(String(seed))), G = macros(target, M), SPLIT = target >= 2000 ? SPLIT5 : SPLIT4, slots = Object.keys(SPLIT), NC = slots.length > 4 ? 9 : 14;
    const cand = {};
    slots.forEach((slot) => {
      const goal = target * SPLIT[slot], list = [];
      const ne = (pref && pref.ne) || [], voli = (pref && pref.voli) || [];
      let pool = R.filter((r) => GRP[slot].includes(r.obrok) && r.kcal > 0);
      const bezNe = pool.filter((r) => !FS.recTags(r).some((t) => ne.includes(t)));
      if (bezNe.length >= 3) pool = bezNe; // ako bi ostalo premalo jela, ne isključuj sve
      pool.forEach((r) => POR.forEach((f) => {
        const lik = FS.recTags(r).filter((t) => voli.includes(t)).length;
        const sc = Math.abs(r.kcal * f - goal) / goal + 0.05 * Math.abs(f - 1) + (used && used.has(r.id) ? 0.35 : 0) + rand() * 0.15 - Math.min(2, lik) * 0.18;
        list.push({ r, f, sc });
      }));
      cand[slot] = list.sort((a, b) => a.sc - b.sc).slice(0, NC);
    });
    let best = null;
    const pick = [];
    const rec = (i, k, p, u, m, sc) => {
      if (i === slots.length) {
        const e = Math.abs(k - target) / target + 0.5 * (Math.abs(p - G.p) / G.p + Math.abs(u - G.uh) / G.uh + Math.abs(m - G.m) / G.m) / 3 + sc * 0.15;
        if (!best || e < best.e) best = { e, pick: pick.slice() };
        return;
      }
      let list = cand[slots[i]];
      if (left && slots[i] === 'vecera') { const rr = pick[1].r; list = POR.map((f) => ({ r: rr, f, sc: 0.05 * Math.abs(f - 1) - 0.2, ostatak: true })); } // večera = ostatak ručka
      list.forEach((c) => { pick[i] = c; rec(i + 1, k + c.r.kcal * c.f, p + c.r.p * c.f, u + c.r.uh * c.f, m + c.r.m * c.f, sc + c.sc); });
    };
    rec(0, 0, 0, 0, 0, 0);
    const day = {};
    if (best) slots.forEach((slot, i) => { day[slot] = { id: best.pick[i].r.id, por: best.pick[i].f }; if (best.pick[i].ostatak) day[slot].ostatak = true; if (used) used.add(best.pick[i].r.id); });
    return day;
  };

  /* više dana odjednom; ne ponavlja iste recepte uzastopno */
  FS.autoMenu = (u, target, startIso, days, M) => {
    const J = (u.jelovnik = u.jelovnik || { cilj: target, dani: {} });
    J.cilj = Math.round(target); if (M) J.makro = M;
    let used = new Set(), prev = new Set();
    for (let i = 0; i < days; i++) {
      const iso = FS.addDays(startIso, i);
      const d = FS.autoDay(target, iso + ':' + (J.autoSeed = (J.autoSeed || 0)), prev, M || J.makro, J.ostaci === 'svaki' || (J.ostaci !== 'ne' && [0, 2, 4].includes(i % 7)), { voli: J.voli || [], ne: J.ne || [] });
      J.dani[iso] = d; prev = new Set(Object.values(d).map((x) => x.id));
      used = new Set([...used, ...prev]);
    }
    FS.Store.save();
  };
})();
