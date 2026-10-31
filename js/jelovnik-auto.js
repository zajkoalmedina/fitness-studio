/* Automatski jelovnik: iz dnevnog cilja (kcal) slaže doručak, ručak, užinu i večeru iz recepata */
(function () {
  const FS = (window.FS = window.FS || {});
  const POR = [0.75, 1, 1.25, 1.5];
  const SPLIT = { dorucak: 0.25, rucak: 0.35, uzina: 0.15, vecera: 0.25 };
  const GRP = { dorucak: ['Doručak'], rucak: ['Ručak'], uzina: ['Užina', 'Voće'], vecera: ['Večera', 'Ručak'] };
  const hash = (s) => { let x = 7; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; };
  const rnd = (seed) => { let x = seed || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return (x % 10000) / 10000; }; };

  /* jedan dan: vraća { dorucak: {id, por}, ... } */
  FS.autoDay = (target, seed, used) => {
    const R = FS.RECEPTI_V || [], rand = rnd(hash(String(seed))), day = {}, picked = {};
    Object.keys(SPLIT).forEach((slot) => {
      const goal = target * SPLIT[slot];
      let best = null;
      R.filter((r) => GRP[slot].includes(r.obrok) && r.kcal > 0).forEach((r) => {
        POR.forEach((f) => {
          const err = Math.abs(r.kcal * f - goal) / goal;
          const protDens = (r.p * 4) / r.kcal;
          let sc = err + 0.06 * Math.abs(f - 1) - 0.35 * protDens + rand() * 0.12;
          if (used && used.has(r.id)) sc += 0.35;
          if (slot === 'uzina' && r.obrok === 'Voće' && r.kcal * f < goal * 0.5) sc += 0.2;
          if (!best || sc < best.sc) best = { sc, id: r.id, por: f };
        });
      });
      if (best) { day[slot] = { id: best.id, por: best.por }; picked[slot] = best; }
    });
    // fino podešavanje: pomjeri porcije tako da ukupno bude blizu cilja
    const kc = (slot) => { const r = R.find((x) => x.id === day[slot].id); return r.kcal * day[slot].por; };
    const total = () => Object.keys(day).reduce((a, s) => a + kc(s), 0);
    for (let it = 0; it < 3; it++) {
      Object.keys(day).forEach((slot) => {
        let bestF = day[slot].por, bestE = Math.abs(total() - target);
        POR.forEach((f) => { const old = day[slot].por; day[slot].por = f; const e = Math.abs(total() - target); if (e < bestE - 1) { bestE = e; bestF = f; } day[slot].por = old; });
        day[slot].por = bestF;
      });
    }
    if (used) Object.keys(day).forEach((s) => used.add(day[s].id));
    return day;
  };

  /* više dana odjednom; ne ponavlja iste recepte uzastopno */
  FS.autoMenu = (u, target, startIso, days) => {
    const J = (u.jelovnik = u.jelovnik || { cilj: target, dani: {} });
    J.cilj = Math.round(target);
    let used = new Set(), prev = new Set();
    for (let i = 0; i < days; i++) {
      const iso = FS.addDays(startIso, i);
      const d = FS.autoDay(target, iso + ':' + (J.autoSeed = (J.autoSeed || 0)), prev);
      J.dani[iso] = d; prev = new Set(Object.values(d).map((x) => x.id));
      used = new Set([...used, ...prev]);
    }
    FS.Store.save();
  };
})();
