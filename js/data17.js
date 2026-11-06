/* Plan treninga br. 2 (faza 2 i faza 3) za teretanu, tačno kako je napisan (isti redoslijed i vježbe). */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => /plan2/.test(g.id))) return;
  const X = (id, s, r, n, o) => Object.assign({ id, s, r, fix: true, p: 180, n: n || '' }, o || {});
  const SS = (id, s, r, n) => X(id, s, r, n, { p: 0, ss: true });
  const legs = () => ({ naziv: 'Strong Legs', kat: 'donji', vj: [X('cucanjsipka', 3, '6–8', '8 do otkaza.'), X('iskorakhod', 2, '8–10', '10 do otkaza.'), X('rdlsipka', 2, '8–10', '10 do otkaza.'), X('gluteext', 3, '8–12', '12 do otkaza.')] });
  const back = () => ({ naziv: 'Back Day', kat: 'gornji', vj: [X('lat', 3, '8–10', 'Srednji hvat. 10 do otkaza.'), X('veslanjesipka', 2, '8–12', 'Veslanje u pretklonu sa šipkom. 12 do otkaza.'), X('cablereardelt', 2, '10–12', 'Zadnje rame na sajli. 12 do otkaza.'), X('cablefly', 2, '10–12', 'Letenje na sajli, jednoručno. 12 do otkaza.'), SS('cablecurl', 3, '10–12', 'Biceps na sajli, superserija s tricepsom. 12 do otkaza.'), X('benchdip', 3, '10–12', 'Triceps dips. Pauza između superserija 3 min.')] });
  const glute2 = () => ({ naziv: 'Glutes', kat: 'gluteus', vj: [X('hipthrust', 3, '8 + 8', 'Druga osmica do pola pokreta.'), X('stepup', 2, '8–10', '10 do otkaza.'), X('legpress', 2, '6–10', '10 do otkaza.'), X('legcurl', 2, '8–12', 'Zadnja loža, fleksija. 12 do otkaza.'), X('kickback', 3, '10–12', '12 do otkaza.')] });
  const upper2 = () => ({ naziv: 'Upper Body', kat: 'gornji', vj: [X('potisakb', 3, '8–10', 'Chest press s bučicama. 10 do otkaza.'), X('potisaksipka', 2, '8–10', 'Military press. 10 do otkaza.'), X('tbar', 2, '8–10', '10 do otkaza.'), X('cablepullover', 2, '8–12', 'Pull over na sajli. 12 do otkaza.'), X('facepull', 2, '10–12', '12 do otkaza.')] });
  const glute3 = () => ({ naziv: 'Glutes', kat: 'gluteus', vj: [X('hipthrust', 2, '8 + 8', '8 do pola pokreta, zadrži 8 s, još 8 do pola pokreta.'), X('iskorak', 2, '6–10', '10 do otkaza.'), X('rdlsipka', 2, '8–10', 'Rumunsko mrtvo dizanje. 10 do otkaza.'), X('legcurl', 2, '8–12', 'Zadnja loža, fleksija. 12 do otkaza.'), X('kickback', 3, '10–12', '12 do otkaza.')] });
  const upper3 = () => ({ naziv: 'Upper Body', kat: 'gornji', vj: [X('bench', 3, '6–10', 'Bench press, klasični. 10 do otkaza.'), X('tbar', 2, '8–12', 'T-bar row u pretklonu. 12 do otkaza.'), X('cablepullover', 2, '8–12', 'Pull over na sajli. 12 do otkaza.'), X('potisaksipka', 2, '8–10', 'Military press. 10 do otkaza.'), X('cablereardelt', 2, '10–12', 'Jednoručno zadnje rame. 12 do otkaza.')] });
  const faze = [[2, [legs(), back(), glute2(), upper2()]], [3, [glute3(), upper3()]]];
  const KN = { donji: 'Donji dio tijela', gluteus: 'Gluteus', gornji: 'Gornji dio tijela' };
  const out = [];
  faze.forEach(([f, days]) => days.forEach((d, i) => {
    const kat = d.kat; delete d.kat;
    out.push({ id: 'k_teretana_' + kat + '_plan2f' + f + '_' + i, naziv: 'Teretana · ' + KN[kat] + ' · ' + d.naziv + ' · Plan 2 Faza ' + f,
      opis: 'Plan treninga br. 2, faza ' + f + ': ' + d.naziv + '. Isti redoslijed i vježbe kao u planu.' + (f === 3 && kat !== 'gluteus' ? '' : ''), nivo: 'srednji', mj: 'teretana', kat, sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
      bilj: ['Pauza između serija 3 min. Zagrijavanje: prva vježba sa 50 % radne težine.' + (f === 3 ? ' Strong Legs i Back Day u fazi 3 su isti kao u fazi 2.' : '')], dani: [d] });
  }));
  FS.GOTOVI.push(...out);
})();
