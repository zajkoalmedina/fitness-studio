/* Automatski jelovnik: iz dnevnog cilja (kcal) slaže doručak, ručak, užinu i večeru iz recepata */
(function () {
  const FS = (window.FS = window.FS || {});
  const POR = [0.75, 1, 1.25, 1.5, 2];
  const SPLIT4 = { dorucak: 0.25, rucak: 0.35, uzina: 0.15, vecera: 0.25 }, SPLIT5 = { dorucak: 0.22, rucak: 0.31, uzina: 0.13, vecera: 0.24, d1: 0.10 };
  const GRP = { dorucak: ['Doručak'], rucak: ['Ručak'], uzina: ['Užina', 'Voće'], vecera: ['Večera', 'Ručak'], d1: ['Užina', 'Voće'] };
  const hash = (s) => { let x = 7; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; };
  const rnd = (seed) => { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return (x % 10000) / 10000; }; };

  /* ciljni makroi: ako nisu zadati, 25 % proteina, 25 % masti, ostalo UH */
  const macros = (T, M) => (M && M.p > 0 ? M : { p: (T * 0.25) / 4, m: (T * 0.25) / 9, uh: (T * 0.5) / 4 });

  /* jedan dan: kombinira obroke tako da se poklope i kalorije i makroi; vraća { dorucak: {id, por}, ... } */
  FS.autoDay = (target, seed, used, M) => {
    const R = FS.RECEPTI_V || [], rand = rnd(hash(String(seed))), G = macros(target, M), SPLIT = target >= 2000 ? SPLIT5 : SPLIT4, slots = Object.keys(SPLIT), NC = slots.length > 4 ? 9 : 14;
    const cand = {};
    slots.forEach((slot) => {
      const goal = target * SPLIT[slot], list = [];
      R.filter((r) => GRP[slot].includes(r.obrok) && r.kcal > 0).forEach((r) => POR.forEach((f) => {
        const sc = Math.abs(r.kcal * f - goal) / goal + 0.05 * Math.abs(f - 1) + (used && used.has(r.id) ? 0.35 : 0) + rand() * 0.15;
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
      cand[slots[i]].forEach((c) => { pick[i] = c; rec(i + 1, k + c.r.kcal * c.f, p + c.r.p * c.f, u + c.r.uh * c.f, m + c.r.m * c.f, sc + c.sc); });
    };
    rec(0, 0, 0, 0, 0, 0);
    const day = {};
    if (best) slots.forEach((slot, i) => { day[slot] = { id: best.pick[i].r.id, por: best.pick[i].f }; if (used) used.add(best.pick[i].r.id); });
    return day;
  };

  /* više dana odjednom; ne ponavlja iste recepte uzastopno */
  FS.autoMenu = (u, target, startIso, days, M) => {
    const J = (u.jelovnik = u.jelovnik || { cilj: target, dani: {} });
    J.cilj = Math.round(target); if (M) J.makro = M;
    let used = new Set(), prev = new Set();
    for (let i = 0; i < days; i++) {
      const iso = FS.addDays(startIso, i);
      const d = FS.autoDay(target, iso + ':' + (J.autoSeed = (J.autoSeed || 0)), prev, M || J.makro);
      J.dani[iso] = d; prev = new Set(Object.values(d).map((x) => x.id));
      used = new Set([...used, ...prev]);
    }
    FS.Store.save();
  };
})();
