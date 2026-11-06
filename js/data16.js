/* Sortiranje biblioteke: teretana i kućni treninzi, po kategorijama (donji dio, gluteus, full body, kardio, gornji dio) i nivoima. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || !FS._kuca) return;
  const G = (id) => FS.GOTOVI.find((g) => g.id === id);
  const P = G('sab_pocetni'), S = G('sab_srednji'), N = G('sab_napredni'), HI = G('sab_hiit'), KU = G('sab_kuca');
  if (!P || !S || !N) return;
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const NIV = [['početni', 'Početni'], ['srednji', 'Srednji'], ['napredni', 'Napredni']];
  const gym = { početni: P, srednji: S, napredni: N };
  const X = (id, s, r, p, n) => ({ id, s, r, fix: true, p, n: n || '' });

  FS.KAT = [['donji', 'Donji dio tijela'], ['gluteus', 'Gluteus'], ['full', 'Full body'], ['kardio', 'Kardio / HIIT'], ['gornji', 'Gornji dio tijela']];
  FS.MJESTA = [['teretana', 'Teretana'], ['kuca', 'Kućni treninzi']];

  /* ---------- teretana ---------- */
  const gymSpec = {
    donji: (n) => [clone(gym[n].dani[0])],
    gluteus: (n) => [clone(gym[n].dani[2])],
    full: () => [],
    kardio: () => [],
    gornji: (n) => [clone(gym[n].dani[1]), clone(gym[n].dani[3])]
  };

  /* ---------- kućni ---------- */
  const LV = { početni: 0, srednji: 4, napredni: 8 }; // sedmica 1, 5, 9 ljestvice
  const pick = (lads, nivo, core) => FS._kuca.set(lads, core).map((it) => { const k = it.kw[LV[nivo]]; return { ...k }; });
  const homeSpec = {
    donji: (n) => [{ naziv: 'Donji dio tijela · Kućni', vj: [].concat(pick(['SQ2', 'HG2', 'LUN2', 'BR2'], n), pick(['ABD2', 'CLAM', 'CALF'], n)) }],
    gluteus: (n) => [{ naziv: 'Gluteus · Kućni', vj: [].concat(pick(['BR', 'HG', 'ABD', 'CLAM'], n), pick(['BR2', 'ABD2', 'LUN'], n)) }],
    full: (n) => [{ naziv: 'Full body · Kućni', vj: [].concat(pick(['SQ', 'BR', 'ABD', 'CLAM'], n), pick(['PUSH', 'ROW', 'SH'], n), pick(['UP', 'LOW', 'LAT', 'ROT'], n, true)) }],
    kardio: (n) => [clone(FS._hiit[{ 'početni': 'pocetni', srednji: 'srednji', napredni: 'napredni' }[n]])].concat(n === 'srednji' && HI ? clone(HI.dani) : []),
    gornji: (n) => n === 'početni' && KU ? clone(KU.dani) : [{ naziv: 'Gornji dio tijela · Kućni', vj: [].concat(pick(['PUSH2', 'ROW', 'REAR', 'ARM'], n)) }]
  };

  const out = [];
  const kratko = (n) => String(n).replace(/^Trening \d+ · /, '').replace(/ · (Kućni|Teretana)$/, '').replace(/^Kućni · /, '');
  [['teretana', gymSpec], ['kuca', homeSpec]].forEach(([mj, spec]) => {
    FS.KAT.forEach(([kat, katNaziv]) => {
      NIV.forEach(([nivo, nivoNaziv]) => {
        spec[kat](nivo).forEach((dan, di) => {
          const mjNaziv = mj === 'teretana' ? 'Teretana' : 'Kućni';
          const ime = kratko(dan.naziv);
          dan.naziv = ime;
          out.push({
            id: 'k_' + mj + '_' + kat + '_' + nivo + '_' + di, naziv: mjNaziv + ' · ' + katNaziv + (['Full body', 'Glutes', 'Gluteus', 'Donji dio tijela', 'Gornji dio tijela', 'HIIT'].includes(ime) ? '' : ' · ' + ime) + ' · ' + nivoNaziv,
            opis: 'Jedan trening: ' + ime + ' (' + (mj === 'teretana' ? 'teretana' : 'kod kuće') + ', ' + nivo + ' nivo). Dodijeli ga klijentici ili kopiraj u njen program.',
            nivo, mj, kat, sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
            bilj: ['Pojedinačni trening iz biblioteke. Drop set možeš uključiti uz svaku vježbu u uređivanju.'], dani: [dan]
          });
        });
      });
    });
  });
  const keep = FS.GOTOVI.filter((g) => !/^sab_/.test(g.id));
  FS.GOTOVI.splice(0, FS.GOTOVI.length, ...keep, ...out);
})();
