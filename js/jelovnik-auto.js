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
    ['piletina', 'Piletina', /pile|pileć/], ['curetina', 'Ćuretina', /ćuret|pureć/], ['junetina', 'Junetina', /junet|govedin|\bmes[oa]|šunk|pršut|slanin/],
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

  /* pravila raznolikosti: tradicionalna bosanska jela najviše 2 sedmično, grah 1, mahunarke 2, više vlastitih recepata, bez ponavljanja u sedmici */
  const BOS = new Set(['b03', 'b05', 'b06', 'b07', 'b08', 'b09', 'b11', 'b12', 'b13', 'b18', 'b19', 'b21', 'b23', 'b24', 'b30']);
  const isOwn = (r) => /^r\d/.test(r.id) || (/^b\d/.test(r.id) && +r.id.slice(1) >= 19);
  const isGrah = (r) => /grah/i.test(r.naziv + ' ' + (r.sast || []).join(' '));
  const isLeg = (r) => /grah|leć|grašak|mahun/i.test(r.naziv + ' ' + (r.sast || []).join(' '));
  const weekCounts = (J, iso) => {
    const c = { bos: 0, grah: 0, leg: 0, cheat: 0, tuna: 0, used: new Set(), prosla: new Set() };
    if (!J || !J.dani || !/^\d{4}-\d\d-\d\d$/.test(iso)) return c;
    const wd = (new Date(iso + 'T12:00:00').getDay() + 6) % 7, R = FS.RECEPTI_V || [];
    for (let i = 0; i < wd; i++) {   /* samo dani te sedmice prije ovog dana */
      const di = FS.addDays(iso, i - wd);
      const d = J.dani[di]; if (!d) continue;
      new Set(Object.values(d).map((e) => e.id)).forEach((id) => {
        const r = R.find((x) => x.id === id); if (!r) return;
        c.used.add(id); if (r.cheat) c.cheat++; if (/tun[aeiou]/i.test(r.naziv + ' ' + (r.sast || []).join(' '))) c.tuna++; if (BOS.has(id)) c.bos++; if (isGrah(r)) c.grah++; if (isLeg(r)) c.leg++;
      });
    }
    for (let i = wd + 1; i <= wd + 7; i++) { const d = J.dani[FS.addDays(iso, -i)]; if (d) Object.values(d).forEach((e) => c.prosla.add(e.id)); }
    return c;
  };

  /* ciljni makroi: ako nisu zadati, 25 % proteina, 25 % masti, ostalo UH */
  const macros = (T, M) => (M && M.p > 0 ? M : { p: (T * 0.25) / 4, m: (T * 0.25) / 9, uh: (T * 0.5) / 4 });

  /* jedan dan: kombinira obroke tako da se poklope kalorije i makroi, uvijek s JEDNOM porcijom svakog recepta (bez množenja).
     Doručak: najviše jaja. Užina: grčki jogurt s voćem, voće, crna čokolada. Večera: tuna i lagana jela. Jednom sedmično cheat obrok. Grah se ne bira.
     Dijabetes: plan se vodi prema ugljikohidratima (UH po obroku i u danu). */
  const isEgg = (r) => /jaj|omlet|kajgan/i.test(r.naziv);
  const isTuna = (r) => /tun[aeiou]/i.test(r.naziv + ' ' + (r.sast || []).join(' '));
  const isSweetB = (r) => /palačink|zobena|zobene|griz|sutlijaš|smoothie|proja/i.test(r.naziv);
  const isJog = (r) => /grčki jogurt|skyr/i.test(r.naziv);
  const isCok = (r) => /čokolad/i.test(r.naziv) && !r.cheat;
  const POOLS = {
    dorucak: (r) => r.obrok === 'Doručak' || (r.obrok === 'Večera' && isEgg(r)),
    rucak: (r) => r.obrok === 'Ručak',
    uzina: (r) => (r.obrok === 'Užina' || r.obrok === 'Voće') && !r.jogurt100 && r.kcal <= 330,
    vecera: (r) => r.obrok === 'Večera' || (r.obrok === 'Ručak' && r.kcal <= 480 && !r.cheat),
    d1: (r) => (r.obrok === 'Užina' || r.obrok === 'Voće') && !r.jogurt100 && r.kcal <= 260,
    d2: (r) => (r.obrok === 'Užina' || r.obrok === 'Voće') && !r.jogurt100 && r.kcal <= 260
  };
  const FRAC = { dorucak: 0.24, rucak: 0.32, uzina: 0.11, vecera: 0.24, d1: 0.09, d2: 0.09 };
  const CONFIGS = [['dorucak', 'uzina', 'rucak', 'vecera'], ['dorucak', 'uzina', 'rucak', 'vecera', 'd1'], ['dorucak', 'uzina', 'rucak', 'vecera', 'd1', 'd2']];
  FS.autoDay = (target, seed, used, M, left, pref) => {
    const J = pref && pref.J, dij = !!(J && J.dijabetes), rand = rnd(hash(String(seed))), G = Object.assign({}, macros(target, M));
    const iso = String(seed).split(':')[0], WK = weekCounts(J, iso), wd = /^\d{4}-\d\d-\d\d$/.test(iso) ? (new Date(iso + 'T12:00:00').getDay() + 6) % 7 : 0;
    const trening = !!(pref && pref.tr && pref.tr(iso)), pDef = (a) => Math.max(0, 1 - a / G.p);
    const cheatDan = !dij && WK.cheat === 0 && wd === 5, cheatSlot = hash(String(seed)) % 2 ? 'dorucak' : 'rucak';
    if (dij) { const c = +J.uhObrok || 45, sn = Math.round(c / 2.5); G.uh = Math.min(G.uh, 0.8 * (3 * c + 2 * sn)); }
    const R = (FS.RECEPTI_V || []).filter((r) => (!FS.uSezoni || FS.uSezoni(r, iso)) && !isGrah(r) && !(J && FS.alergMatch && FS.alergMatch(r, J).length) && (!J || !FS.dijOk || FS.dijOk(r, J)) && !(dij && r.cheat));
    const ne = (pref && pref.ne) || [], voli = (pref && pref.voli) || [];
    const rules = (r, slot) => {
      let sc = isOwn(r) ? -0.15 : 0;
      if (WK.used.has(r.id)) sc += 1.0; else if (WK.prosla.has(r.id)) sc += 0.35;
      if (used && used.has(r.id)) sc += 0.5;
      if (BOS.has(r.id)) sc += WK.bos >= 2 ? 30 : (WK.bos === 1 ? 0.35 : -0.1);
      if (isLeg(r)) sc += WK.leg >= 2 ? 30 : (WK.leg === 1 ? 0.5 : 0);
      if (r.cheat) sc += cheatDan && slot === cheatSlot ? -2 : 30;
      if (slot === 'dorucak') sc += isEgg(r) ? -0.55 : (isSweetB(r) && !r.cheat ? 0.55 : 0.25);
      if (slot === 'uzina') sc += isJog(r) ? -0.6 : isCok(r) ? 0.1 : 0;
      if (r.whey) sc += slot === 'uzina' ? 0.5 : (/poslije treninga/i.test(r.naziv) ? (trening ? -1.6 : 0.25) : -0.1);
      if (slot === 'd1' || slot === 'd2') sc += r.obrok === 'Voće' ? -0.3 : isCok(r) ? -0.35 : (isJog(r) ? -0.15 : 0.1);
      if (slot === 'vecera') sc += isTuna(r) ? (WK.tuna >= 4 ? 0.4 : -0.5) : 0;
      sc -= Math.min(2, FS.recTags(r).filter((t) => voli.includes(t)).length) * 0.18;
      return sc;
    };
    const cand = {};
    Object.keys(POOLS).forEach((slot) => {
      let pool = R.filter((r) => POOLS[slot](r) && r.kcal > 0);
      if (slot === 'dorucak') { const jaja = pool.filter((r) => isEgg(r) || (r.cheat && cheatDan && cheatSlot === 'dorucak')); if (jaja.length >= 3 && (rand() < 0.8 || (cheatDan && cheatSlot === 'dorucak'))) pool = jaja; }
      const bezNe = pool.filter((r) => !FS.recTags(r).some((t) => ne.includes(t)));
      if (bezNe.length >= 3) pool = bezNe;
      const goal = target * FRAC[slot], uhG = dij ? ((+J.uhObrok || 45) * (slot === 'uzina' || slot === 'd1' || slot === 'd2' ? 0.4 : 0.9)) : 0;
      cand[slot] = pool.map((r) => ({ r, sc: rules(r, slot) + 0.5 * Math.min(1.5, Math.abs(r.kcal - goal) / goal) + (dij ? 0.4 * Math.abs(r.uh - uhG) / Math.max(10, uhG) : 0) + rand() * 0.18 }))
        .sort((a, b) => a.sc - b.sc).slice(0, slot === 'd1' || slot === 'd2' ? 5 : slot === 'uzina' ? 6 : 7);
    });
    let best = null;
    CONFIGS.forEach((slots) => {
      if (slots.some((sl) => !cand[sl].length)) return;
      const pick = [];
      const rec = (i, k, p, u, m, sc) => {
        if (i === slots.length) {
          const ids = pick.map((c) => c.r.id), uz = pick.filter((c) => isCok(c.r)).length;
          const ids2 = pick.filter((c) => !c.ostatak).map((c) => c.r.id);
          if (new Set(ids2).size < ids2.length) return;
          const bos = WK.bos + pick.filter((c) => BOS.has(c.r.id)).length, leg = WK.leg + pick.filter((c) => isLeg(c.r)).length;
          sc += (bos > 2 ? 30 : 0) + (leg > 2 ? 30 : 0) + (uz > 1 ? 1 : 0) + (slots.length - 4) * 0.12;
          const wu = dij ? 2.2 : 1; if (p < 0.92 * G.p) sc += 8 * pDef(p);
          const e = 5 * Math.abs(k - target) / target + 0.9 * (Math.abs(p - G.p) / G.p + wu * Math.abs(u - G.uh) / G.uh + Math.abs(m - G.m) / G.m) / (2 + wu) * 3 + sc * 0.12;
          if (!best || e < best.e) best = { e, slots, pick: pick.slice() };
          return;
        }
        let list = cand[slots[i]];
        if (left && slots[i] === 'vecera') { const rr = pick[slots.indexOf('rucak')]; if (rr && !rr.r.cheat) list = [{ r: rr.r, sc: -0.2, ostatak: true }]; }
        list.forEach((c) => { pick[i] = c; rec(i + 1, k + c.r.kcal, p + c.r.p, u + c.r.uh, m + c.r.m, sc + c.sc); });
      };
      rec(0, 0, 0, 0, 0, 0);
    });
    const day = {};
    if (best) best.slots.forEach((slot, i) => { day[slot] = { id: best.pick[i].r.id, por: 1 }; if (best.pick[i].ostatak) day[slot].ostatak = true; if (used) used.add(best.pick[i].r.id); });
    return day;
  };


  /* ---------- spisak za kupovinu: sabira sastojke svih izabranih obroka (količina × porcija) ---------- */
  const UNITS = /^(g|kg|ml|l|dl|kašika|kašike|kašiku|kašičica|kašičice|kašičicu|kafena kašičica|kafene kašičice|šolja|šolje|šaka|kriška|kriške|kriški|list|lista|listova|glavica|glavice|češnja|češnja)\b\s*/i;
  const num = (x) => parseFloat(String(x).replace(',', '.'));
  FS.parseSast = (line) => {
    let m = String(line).trim().match(/^(\d+)\/(\d+)\s+(.*)$/), q, rest;
    if (m) { q = +m[1] / +m[2]; rest = m[3]; }
    else {
      m = String(line).trim().match(/^(\d+(?:[.,]\d+)?)(?:\s*[–-]\s*(\d+(?:[.,]\d+)?))?\s*(.*)$/);
      if (!m) return { text: String(line).trim() };
      q = m[2] ? (num(m[1]) + num(m[2])) / 2 : num(m[1]); rest = m[3];
    }
    let unit = '', um = rest.match(UNITS);
    if (um) { unit = um[1].toLowerCase(); rest = rest.slice(um[0].length); }
    rest = rest.replace(/\s*\(.*?\)\s*/g, ' ').replace(/,.*$/, '').trim().toLowerCase();
    return { q, unit, name: rest };
  };
  const fmtQ = (q, unit) => {
    if (unit === 'g') return q >= 1000 ? (Math.round(q / 100) / 10 + ' kg').replace('.', ',') : Math.round(q / 5) * 5 + ' g';
    if (unit === 'ml') return q >= 1000 ? (Math.round(q / 100) / 10 + ' l').replace('.', ',') : Math.round(q / 5) * 5 + ' ml';
    const r = Math.round(q * 2) / 2; return String(r).replace('.', ',') + (unit ? ' ' + unit : '');
  };
  FS.spisak = (J, startIso, days) => {
    const R = FS.RECEPTI_V || [], map = {}, extra = new Set();
    for (let i = 0; i < days; i++) {
      const d = (J.dani || {})[FS.addDays(startIso, i)]; if (!d) continue;
      Object.values(d).forEach((e) => {
        const r = R.find((x) => x.id === e.id); if (!r) return;
        (r.sast || []).forEach((line) => {
          const p = FS.parseSast(line);
          if (p.q == null) { extra.add(p.text.toLowerCase()); return; }
          if (!p.name) return;
          const key = p.unit + '|' + p.name;
          (map[key] = map[key] || { unit: p.unit, name: p.name, q: 0 }).q += p.q * (e.por || 1);
        });
      });
    }
    const items = Object.entries(map).map(([key, o]) => ({ key, text: fmtQ(o.q, o.unit) + ' ' + o.name })).sort((a, b) => a.text.replace(/^[\d, ]+(kg|g|ml|l|dl)?\s*/, '').localeCompare(b.text.replace(/^[\d, ]+(kg|g|ml|l|dl)?\s*/, ''), 'hr'));
    return { items, extra: [...extra].filter((x) => x.length < 90).sort() };
  };

  /* više dana odjednom; ne ponavlja iste recepte uzastopno */
  /* popunjava samo dane bez plana (za sedmični plan koji se sam obnavlja); vraća broj popunjenih dana */
  const trDan = (u) => (iso) => (FS.Store.db.raspored || []).some((e) => e.userId === u.id && e.datum === iso && e.tip === 'dan') || (FS.Store.db.logs || []).some((l) => l.userId === u.id && l.datum === iso);
  FS.autoFill = (u, startIso, days) => {
    const J = u.jelovnik; if (!J || !(+J.cilj >= 800)) return 0;
    let prev = new Set(), n = 0;
    for (let i = 0; i < days; i++) {
      const iso = FS.addDays(startIso, i), ex = (J.dani = J.dani || {})[iso];
      if (ex && Object.keys(ex).length) { prev = new Set(Object.values(ex).map((x) => x.id)); continue; }
      const d = FS.autoDay(+J.cilj, iso + ':' + (J.autoSeed || 0), prev, J.makro, J.ostaci === 'svaki' || (J.ostaci === 'neki' && [0, 2, 4].includes(i % 7)), { voli: J.voli || [], ne: J.ne || [], J, tr: trDan(u) });
      if (Object.keys(d).length) { J.dani[iso] = d; prev = new Set(Object.values(d).map((x) => x.id)); n++; }
    }
    if (n) FS.Store.save();
    return n;
  };

  FS.autoMenu = (u, target, startIso, days, M) => {
    const J = (u.jelovnik = u.jelovnik || { cilj: target, dani: {} });
    J.cilj = Math.round(target); if (M) J.makro = M;
    let used = new Set(), prev = new Set();
    for (let i = 0; i < days; i++) {
      const iso = FS.addDays(startIso, i);
      const d = FS.autoDay(target, iso + ':' + (J.autoSeed = (J.autoSeed || 0)), prev, M || J.makro, J.ostaci === 'svaki' || (J.ostaci === 'neki' && [0, 2, 4].includes(i % 7)), { voli: J.voli || [], ne: J.ne || [], J, tr: trDan(u) });
      J.dani[iso] = d; prev = new Set(Object.values(d).map((x) => x.id));
      used = new Set([...used, ...prev]);
    }
    FS.Store.save();
  };
})();
