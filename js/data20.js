/* Full body x4 sa akcentom na gluteus (srednji nivo, teretana): sedmice 1–2, 3–4 i 6–9; svaki trening zasebno. Sedmica 5 je deload (napomena). */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => /glakc/.test(g.id))) return;
  const nova = [
    ['sipkabridge', 'Barbell Glute Bridge (Banded)', 'Gluteus', 'srednji', 'Šipka, jastuk za šipku, elastična guma oko koljena', 'ne',
      'Sjedni na pod, leđa uz klupu, šipka s jastukom preko kukova, guma oko koljena, stopala u širini kukova.|Pogled naprijed, brada blago spuštena, rebra spuštena.|Stisni gluteus i podigni kukove do ravne linije koljena, kukova i ramena, koljena guraju prema van u gumu.|Zadrži 1 s, spusti 2 s bez odlaganja šipke na pod.', 'Potkoljenice su pri vrhu okomito.|Stopala ne klize.|Ne izvijaj donji dio leđa na vrhu.', 'Koljena upadaju prema unutra.|Izvijanje leđa.|Prebrzo spuštanje.', ['gluteus'], ['zadnja loža']],
    ['seatedbandabd', 'Seated Banded Hip Abduction (Torso Forward)', 'Gluteus', 'početni', 'Elastična guma oko koljena, klupa ili stolica', 'ne',
      'Sjedni na rub klupe, guma oko koljena, stopala u širini kukova.|Nagni trup naprijed s ravnim leđima, ruke na koljena ili uz klupu.|Širi koljena u stranu protiv gume dok ne osjetiš gluteus sa strane.|Zadrži 1 s, polako vrati 2 s bez da koljena potpuno popuste.', 'Trup nagnut naprijed jače aktivira gluteus.|Ne ljuljaj trupom.|Guma ostaje napeta cijelo vrijeme.', 'Zamah trupom.|Podizanje stopala.|Prekratak pokret.', ['gluteus'], ['kukovi']],
    ['standbandabd', 'Standing Banded Hip Abduction', 'Gluteus', 'početni', 'Elastična guma oko gležnjeva, oslonac', 'ne',
      'Stani uz oslonac, guma oko gležnjeva, noge uz jedna drugu, trup uspravan.|Pogled ravno ispred, stisni core.|Odvedi slobodnu nogu u stranu bez naginjanja trupa.|Polako vrati 2 s, stopalo se ne spušta na pod. Završi sve ponavljanja, pa zamijeni nogu.', 'Pokret samo iz kuka.|Nožni prsti gledaju naprijed.|Opterećenu nogu drži blago savijenu.', 'Naginjanje trupa.|Zamah nogom.|Rotiranje stopala prema gore.', ['gluteus'], ['kukovi']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });
  const pz = (r) => { const n = parseInt(String(r).replace(/[^\d]/g, ''), 10) || 10; return n <= 6 ? 180 : n <= 12 ? 120 : 75; };
  const X = (id, s, r, n, o) => Object.assign({ id, s, r, fix: true, p: pz(r), n: n || '' }, o || {});
  const SS = (id, s, r, n) => X(id, s, r, n, { p: 0, ss: true });
  const A = [
    [X('bridge', 4, '8–10', 'Glute bridge: 2 serije po 10, pa 2 serije po 8.'), X('potisaksipka', 4, '5', 'Potisak sa šipkom za ramena.'), X('cucanjsipka', 4, '6', 'Zadnji čučanj.'), X('lat', 3, 'do otkaza', 'Uski hvat.', { p: 120 }), X('legcurl', 3, '15', 'Ležeći.'), X('abdukcija', 3, '30')],
    [X('hipthrust', 3, '30', 'Sa gumom oko koljena, lagano opterećenje.'), X('bench', 3, '12'), X('jednorodl', 3, '15', 'B stance mrtvo dizanje sa bučicama.'), X('veslanjekabl', 3, '12', 'Veslanje na mašini za leđa.'), X('stepup', 3, '12', 'Sa bučicama.'), X('seatedbandabd', 3, '30', 'Sjedeći, torzo naprijed, sa gumom.')],
    [X('sipkabridge', 3, '20', 'Sa gumom oko koljena i šipkom.'), X('ramena', 3, '8', 'Potisak sa bučicama, stojeći.'), X('frontcucanj', 3, '10'), X('lat', 3, '10', 'Široki hvat.'), X('backext', 3, '20', 'Leđnjak na spravi sa bučicom.'), X('standbandabd', 3, '30', 'Stojeća abdukcija sa gumom.')],
    [X('hipthrust', 3, '5', 'Sa šipkom, 5 teških ponavljanja.'), X('potisakb', 3, '12', 'Ravna klupa.'), X('bugarski', 3, '20', 'Bez opterećenja.'), X('veslanjesipka', 3, '12', 'U pretklonu sa šipkom za leđa.'), X('rdlsipka', 3, '12'), X('abdgumom', 3, '20', 'Lateralni hod sa gumom.')]
  ];
  const B = [
    [X('bridge', 5, '6–8', 'Glute bridge: 2 serije po 8, pa 3 serije po 6.'), X('potisaksipka', 5, '5', 'Potisak sa šipkom za ramena.'), X('cucanjsipka', 5, '6', 'Zadnji čučanj.'), X('lat', 4, 'do otkaza', 'Uski hvat.', { p: 120 }), X('legcurl', 4, '15', 'Ležeći.'), X('abdukcija', 4, '30')],
    [X('hipthrust', 4, '30', 'Sa gumom oko koljena, lagano opterećenje.'), X('bench', 4, '12'), X('jednorodl', 4, '15', 'B stance mrtvo dizanje sa bučicama.'), X('veslanjekabl', 4, '12', 'Veslanje na mašini za leđa.'), X('stepup', 4, '12', 'Sa bučicama.'), X('seatedbandabd', 4, '30', 'Sjedeći, torzo naprijed, sa gumom.')],
    [X('sipkabridge', 4, '20', 'Sa gumom oko koljena i šipkom.'), X('ramena', 4, '8', 'Potisak sa bučicama, stojeći.'), X('frontcucanj', 4, '10'), X('lat', 4, '10', 'Široki hvat.'), X('backext', 4, '20', 'Leđnjak na spravi sa bučicom.'), X('standbandabd', 4, '30', 'Stojeća abdukcija sa gumom.')],
    [X('hipthrust', 4, '5', 'Sa šipkom, 5 teških ponavljanja.'), X('potisakb', 4, '12', 'Ravna klupa.'), X('bugarski', 4, '20', 'Bez opterećenja.'), X('veslanjesipka', 4, '12', 'U pretklonu sa šipkom za leđa.'), X('rdlsipka', 4, '12'), X('abdgumom', 4, '20', 'Lateralni hod sa gumom.')]
  ];
  const C = [
    [X('bridge', 5, '5', 'Glute bridge, 5 teških ponavljanja.'), X('potisaksipka', 5, '8', 'Potisak sa šipkom za ramena.'), X('cucanjsipka', 5, '5', 'Zadnji čučanj, teških 5.'), X('lat', 5, '15', 'Uski hvat, pauza u donjem položaju 2 s.', { p: 90 }), X('legcurl', 5, '10', 'Ležeći, tempo spuštanja nazad 3 s.'), X('abdukcija', 4, '20', 'Zadržak 3 s na kraju svakog ponavljanja.')],
    [X('hipthrust', 5, '10', 'Sa gumom oko koljena, 10 teških ponavljanja.'), X('bench', 5, '8', 'Teških 8.'), X('jednorodl', 5, '10', 'B stance mrtvo dizanje sa bučicama, spuštanje dolje 3 s.'), X('veslanjekabl', 4, '12', 'Veslanje jednoručno, sjedeći.'), X('stepup', 5, '10', 'Sa šipkom iza leđa, 10 teških po nozi.'), SS('seatedbandabd', 4, '30', 'Sjedeći, torzo naprijed, sa gumom. Odmah poslije ide frog pump.'), X('frogpump', 4, '30')],
    [X('sipkabridge', 5, '10', 'Sa gumom oko koljena i šipkom, 10 teških ponavljanja.'), X('ramena', 5, '10', 'Jednoručni potisak sa bučicama za ramena.'), X('frontcucanj', 5, '8', 'Pauza dolje 2 s.'), X('lat', 5, '10', 'Široki hvat.'), X('backext', 5, '15', 'Leđnjak na spravi sa bučicom, tempo spuštanja dolje 3 s.'), X('standbandabd', 4, '30', 'Stojeća abdukcija sa gumom.')],
    [X('hipthrust', 5, '5 + 10', 'Sa šipkom: 5 teških ponavljanja, odmah spusti kilažu i uradi još 10 lakših. To je jedna serija.', { ds: true }), X('potisakb', 5, '10', 'Ravna klupa, zadržak dolje 2 s.'), X('bugarski', 5, '10', 'Sa bučicama, trup nagnut naprijed, akcenat na gluteus. 10 po nozi.'), X('veslanjesipka', 5, '10', 'U pretklonu sa šipkom za leđa.'), X('rdlsipka', 5, '8', 'Teških 8.'), X('abdgumom', 4, '20', 'Lateralni hod sa gumom.')]
  ];
  const F = [['1–2', A, 'sedmice 1 i 2'], ['3–4', B, 'sedmice 3 i 4'], ['6–9', C, 'sedmice 6 do 9']];
  const out = [];
  F.forEach(([sed, dani, txt], fi) => dani.forEach((vj, i) => out.push({
    id: 'k_teretana_full_glakc_f' + (fi + 1) + '_' + i, naziv: 'Teretana · Full body · Akcenat na gluteus · Trening ' + (i + 1) + ' · Srednji · Sedmice ' + sed,
    opis: 'Full body 4× sedmično sa akcentom na gluteus (srednje iskusni), trening ' + (i + 1) + ', ' + txt + '. Sedmica 5 je deload: smanji volumen za 30 do 50 % ukupnog broja serija.',
    nivo: 'srednji', mj: 'teretana', kat: 'full', sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Sedmica 5 je deload: smanji volumen za 30 do 50 % ukupnog broja serija za mišićne grupe.'], dani: [{ naziv: 'Trening ' + (i + 1), vj }]
  })));
  FS.GOTOVI.push(...out);
})();
