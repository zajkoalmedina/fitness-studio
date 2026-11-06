/* Full body za početnike, 3x sedmično (teretana): sedmice 1–4 i 5–8, svaki trening zasebno u biblioteci. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => /fbpoc/.test(g.id))) return;
  const X = (id, s, r, n) => ({ id, s, r, fix: true, p: 90, n: n || '' });
  // faza 1: 3 serije; faza 2: 4 serije (mrtvo dizanje 4x10, ostalo 4x12, izolacija 4x15)
  const T = (f) => {
    const a = f === 1 ? 3 : 4, m = f === 1 ? '10' : '12', iz = '15';
    return [
      { naziv: 'Trening 1', vj: [X('sklek', a, m), X('goblet', a, m, 'Bučica ili kugla.'), X('lat', a, m, 'Široki hvat ispred glave.'), X('ramena', a, m), X('legcurl', a, iz, 'Zadnja loža, fleksija na spravi sjedeći.')] },
      { naziv: 'Trening 2', vj: [X('rdl', a, f === 1 ? '10' : '10', 'Mrtvo dizanje s bučicama.'), X('kosibucice', a, m, 'Kosa klupa za grudi.'), X('iskorakhod', a, m, 'Hodanje preko sale, ponavljanja po nozi.'), X('veslanjekabl', a, m, 'Sjedeći na klupici za leđa sa sajlom.'), X('biceps', a, iz, 'Stojeći.')] },
      { naziv: 'Trening 3', vj: [X('lat', a, m, 'Uski obrnuti hvat.'), X('legpress', a, m), X('bocno', a, iz, 'Letenje za ramena sa bučicama.'), X('goodmorning', a, iz, 'Sa bučicom u rukama.'), X('tricepskabl', a, iz, 'Na spravi sa sajlom.')] }
    ];
  };
  const out = [];
  [1, 2].forEach((f) => T(f).forEach((d, i) => out.push({
    id: 'k_teretana_full_fbpoc_f' + f + '_' + i, naziv: 'Teretana · Full body · ' + d.naziv + ' · Početni · Sedmice ' + (f === 1 ? '1–4' : '5–8'),
    opis: 'Full body za početnike, 3x sedmično. ' + d.naziv + ', ' + (f === 1 ? 'prve četiri sedmice (3 serije)' : 'druge četiri sedmice (4 serije)') + '. Pauza između serija 90 s.',
    nivo: 'početni', mj: 'teretana', kat: 'full', sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Radi 3 treninga sedmično s barem jednim danom odmora između. Težinu biraj tako da zadnja 2 ponavljanja budu teška, ali tehnički čista.'], dani: [d]
  })));
  FS.GOTOVI.push(...out);
})();
