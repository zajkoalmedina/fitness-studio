/* Program Oblikuj i ojačaj (2 ciklusa), obogaćeni kućni program, dijastaza, balans pokreta */
(function () {
  const FS = (window.FS = window.FS || {});
  /* x(id, serije, ponavljanja, napomena, pauza s, superserija) */
  const x = (id, s, r, n, p, ss) => { const o = { id, s, r, n: n || '' }; if (p != null) o.p = p; if (ss) o.ss = true; return o; };
  const A = (id, s, r, n) => x(id, s, r, n, 0, true);          // superserija: bez pauze, odmah sljedeća
  const T = (id, s, r, n) => x(id, s, r, n, 30);                // vrijeme / core
  const H = (id, s, r, n) => x(id, s, r || '30 s', n, 15);     // HIIT: 30 s rad / 15 s pauza

  const BILJ_GLOW = [
    'Oznaka „jednostrano“ znači da zadani broj ponavljanja radiš za svaku nogu/stranu posebno.',
    'Vježbe označene „superserija“ radiš jednu za drugom bez pauze, pa tek onda pauza.',
    'Pauza između serija je ispisana kod svake vježbe (obično 60 s, kod teških složenih 90 s).',
    'Raspored u sedmici: pon–uto–srijeda trening, četvrtak aktivni odmor, petak trening, subota HIIT, nedjelja odmor.',
    'Ako je neka vježba pretežka, smanji težinu ili broj ponavljanja; tehnika je važnija od težine.'
  ];
  const HIIT_NOTE = 'Cirkuit: svaku vježbu radiš 30 s, pauza 15 s, pa sljedeća. Kad završiš sve, odmor 90–120 s i ponovi krug (ukupno 4–6 krugova).';

  FS.GOTOVI.push(
    { id: 'oblikuj', naziv: 'Oblikuj i ojačaj · teretana', opis: 'Osam sedmica u teretani u dva ciklusa po četiri sedmice: noge, gornji dio tijela, gluteusi, hibrid i HIIT. Superserije, jednostrane vježbe i booty finisher.', nivo: 'srednji', sedmica: 8, dana: 5, cijena: 59, tip: 'gotov', uShopu: true, per: { tip: 'nema', deload: 0 }, bilj: BILJ_GLOW.concat(['Sedmice 1–4 radiš treninge A1–A5, a sedmice 5–8 treninge B1–B5 (teži ciklus).']),
      dani: [
        { naziv: 'A1 · Noge', vj: [A('iskorak', 4, '12 po nozi', 'Iskorak unazad'), x('squatjacks', 4, '12'), x('jednorodl', 4, '12 po nozi'), x('sumocucanj', 4, '12'), x('lungejump', 4, '8 po nozi', 'Zamijeni običnim iskorakom ako je pretežak'), x('frogpump', 4, '15'), A('lateralnilunge', 4, '15 po strani'), x('singlebridge', 4, '15 po nozi'), T('flutter', 3, '30 s'), T('skarice', 3, '30 s')] },
        { naziv: 'A2 · Gornji dio tijela', vj: [A('bench', 4, '12'), x('veslanje', 4, '12 po strani'), x('arnold', 4, '12'), x('lat', 4, '12', 'Podhvat (dlanovi prema tebi)'), A('ytw', 4, '15'), x('plankwalk', 4, '15 po strani'), x('farmer', 4, '1 min'), T('hollow', 3, '30 s'), T('mountainclimb', 3, '30 s')] },
        { naziv: 'A3 · Gluteusi', vj: [x('stepup', 4, '12 po nozi', 'Atletski nakorak s podizanjem koljena'), x('hipthrust1', 4, '12 po nozi', 'Staggered stance'), x('rdlsipka', 4, '12', 'Konvencionalno mrtvo dizanje, lagano'), x('singlebridge', 4, '15 po nozi', 'Stopalo na povišenju'), x('firehydrant', 4, '15 po strani'), x('abdgumom', 1, '30-25-20-15-10-5', 'Booty finisher: piramida bez odmora', 0, true), x('cucanj', 1, '30-25-20-15-10-5', 'Booty finisher: nastavi bez odmora', 0, true), x('hipthrust1', 1, '30-25-20-15-10-5', 'Booty finisher: marching hip thrust', 60), T('bocnaplanka', 3, '30 s po strani')] },
        { naziv: 'A4 · Hibrid snaga', vj: [x('hipthrust', 4, '12'), x('kangsquat', 4, '12'), x('zpotisak', 4, '12'), x('iskorak', 4, '12 po nozi', 'Iskorak s ekstenzijom'), x('birddog', 4, '12 po strani', 'Bird dog s veslanjem'), x('kickback', 4, '15 po nozi', 'Do kraja raspona'), x('woodchop', 4, '15 po strani'), x('kosibucice', 3, '12', 'Horizontalno guranje za balans')] },
        { naziv: 'A5 · HIIT', vj: [H('mountainclimb', 4, '30 s', HIIT_NOTE), H('lakatkoljeno', 4), H('skokpovisenje', 4), H('plankhops', 4), H('nevidljiva', 4), H('planksavijanje', 4), H('hollow', 4), H('squatjacks', 4)] },

        { naziv: 'B1 · Noge', vj: [A('rdlsipka', 4, '12', 'Sumo stav (široke noge)'), x('squatjacks', 4, '12'), x('legpress', 4, '12'), x('lateralnilunge', 4, '12 po strani'), x('backext', 4, '12', 'GHD ili hiperekstenzija'), x('bocnaplanka', 4, '15 po strani', 'Bočna planka s podizanjem noge'), x('goblet', 1, '10 min', 'Čučanj s gumom bez pauze', 0), T('twist', 3, '30 s'), T('skarice', 3, '30 s')] },
        { naziv: 'B2 · Gornji dio tijela', vj: [A('sklek', 4, '12'), x('lat', 4, '12', 'Kleknuta varijanta'), A('zpotisak', 4, '12'), x('veslanjesipka', 4, '12', 'Veslanje u pretklonu'), x('renegade', 4, '12 po strani'), x('reversepec', 4, '15', 'Stražnje razvlačenje'), x('farmer', 6, '1 min', 'Waiter walk: jedna ruka iznad glave'), T('mountainclimb', 3, '30 s', 'Leg kick through'), T('abwheel', 3, '30 s'), T('planka', 3, '30 s')] },
        { naziv: 'B3 · Gluteusi', vj: [A('hipthrust', 4, '12', 'Banded skorcher'), x('skokpovisenje', 4, '12'), A('sumocucanj', 4, '12'), x('kbswing', 4, '12'), x('abdukcija', 4, '20'), x('reversehyper', 4, '15'), x('pullthrough', 4, '20'), x('clamshell', 4, '20 po strani'), T('bocnaplanka', 3, '30 s po strani'), T('crunch', 3, '30 s')] },
        { naziv: 'B4 · Hibrid snaga', vj: [x('rdlsipka', 4, '12'), x('ramena', 4, '12', 'Potisak iznad glave'), x('curtsy', 4, '12 po nozi'), x('veslanjekabl', 4, '12', 'Veslanje uz potporu prsa'), x('kickback', 4, '20 po nozi', 'Ekstenzija kuka u polučučnju'), x('swimmers', 4, '15'), x('singlebridge', 4, '20 po nozi'), x('sklek', 3, '10', 'Na koljenima ako treba; horizontalno guranje za balans')] },
        { naziv: 'B5 · HIIT', vj: [H('skaterhop', 4, '30 s', HIIT_NOTE), H('burpee', 4), H('nevidljiva', 4), H('mountainclimb', 4), H('squatjacks', 4), H('sklopke', 4), H('plankhops', 4), H('pistol', 4, '30 s', 'Jedna strana pa druga, uz oslonac')] }] }
  );

  /* ----- obogaćeni kućni program ----- */
  const kuca = FS.GOTOVI.find((g) => g.id === 'kuca');
  Object.assign(kuca, {
    naziv: 'Kućna snaga · bez opreme', sedmica: 6, dana: 4, nivo: 'početni',
    opis: 'Šest sedmica treninga kod kuće. Koristiš samo tijelo, stolicu, jastuk i boce vode. Uključen je i HIIT dan.',
    per: { tip: 'blok', deload: 4 },
    bilj: ['Boca vode od 1,5 l je približno 1,5 kg. Dvije boce su dovoljne za većinu vježbi; kad postanu lagane, napuni ih pijeskom ili koristi veće boce.', 'Pauze: 45 do 60 s između serija, 20 s između kardio vježbi u HIIT danu.', 'HIIT (dan C) ima nisku varijantu: umjesto skokova radi korak u stranu / marš, ako imaš probleme sa zglobovima.', 'Dan D je cijelo tijelo i core; ne zadržavaj dah.'],
    dani: [
      { naziv: 'Dan A · Noge i gluteusi', vj: [x('bocacucanj', 3, '15', '', 45), x('jastukmost', 3, '15', 'Jastuk stisni među koljena', 45), x('klizniiskorak', 3, '10 po nozi', 'Ručnik ili jastuk ispod stopala', 45), x('bocarodl', 3, '12', '', 45), x('zidsjed', 3, '30 s', '', 45), x('clamshell', 3, '15 po strani', '', 30), x('sidelift', 2, '15 po strani', '', 30)] },
      { naziv: 'Dan B · Gornji dio tijela', vj: [x('stolicasklek', 3, '10', 'Što više povišenje, to lakše', 45), x('bocaveslanje', 3, '12', '', 45), x('bocapotisak', 3, '12', '', 45), x('bocarazmah', 3, '12', '', 45), x('bocatriceps', 3, '12', '', 45), x('bocapregib', 3, '12', '', 45), x('birddog', 3, '8 po strani', '', 30)] },
      { naziv: 'Dan C · HIIT 20 min', vj: [x('jumpingjack', 4, '40 s', 'Cirkuit: 40 s rad / 20 s pauza, pa sljedeća. Poslije kruga odmor 90 s. Radi 3–4 kruga.', 20), x('squatjacks', 4, '40 s', '', 20), x('highknees', 4, '40 s', 'Lakše: marš u mjestu', 20), x('mountainclimb', 4, '40 s', '', 20), x('skaterhop', 4, '40 s', 'Lakše: korak u stranu', 20), x('burpee', 4, '40 s', 'Lakše: bez skoka', 20)] },
      { naziv: 'Dan D · Cijelo tijelo i core', vj: [x('cucanj', 3, '15', '', 45), x('sklek', 3, '8–12', 'Na koljenima ako treba', 45), x('bocaveslanje', 3, '12', '', 45), x('singlebridge', 3, '12 po nozi', '', 45), x('deadbug', 3, '8 po strani', '', 30), x('hollow', 3, '20 s', '', 30), x('planka', 3, '30 s', '', 30)] }]
  });

  /* ----- dijastaza: više raznolikosti, bez brzog hoda ----- */
  FS.DIJASTAZA.faze = [
    { naziv: 'Faza 1 – Disanje i temelji', sedmice: '1.–2. sedmica', dana: '3–4 puta sedmično, 10–15 min', cilj: 'Naučiti dubinsko disanje, blagu aktivaciju dubokog trbušnog mišića i kontrolu zdjelice.',
      dani: [
        { naziv: 'Trening A', vj: [x('disanje', 2, '8 udisaja', '', 30), x('krokodil', 2, '8 udisaja', '', 30), x('tva', 3, '8 × 5 s', '', 30), x('zdjelica', 2, '10', '', 30), x('heel', 2, '8 po nozi', '', 30), x('jastukstisak', 2, '8 × 3 s', 'Izdahni i stisni jastuk', 30)] },
        { naziv: 'Trening B', vj: [x('disanje', 2, '8 udisaja', '', 30), x('tva', 3, '8 × 5 s', '', 30), x('mackakrava', 2, '10', '', 30), x('clamshell', 2, '10 po strani', '', 30), x('m_igla', 2, '6 po strani', 'Otvaranje prsnog koša', 30), x('bridge', 2, '10', '', 30)] }] },
    { naziv: 'Faza 2 – Stabilnost', sedmice: '3.–4. sedmica', dana: '3 puta sedmično, 15–20 min', cilj: 'Dodati stabilnost trupa i gluteuse uz zadržanu kontrolu središnje linije trbuha.',
      dani: [
        { naziv: 'Trening A', vj: [x('disanje', 1, '8 udisaja', '', 30), x('tva', 2, '8 × 5 s', '', 30), x('bridge', 3, '12', '', 45), x('jastukmost', 3, '12', '', 45), x('toetaps', 2, '8 po nozi', 'Samo ako nema ispupčenja', 30), x('birddog', 2, '6 po strani', '', 30)] },
        { naziv: 'Trening B', vj: [x('tva', 2, '8 × 5 s', '', 30), x('sidelift', 3, '12 po strani', '', 45), x('clamshell', 3, '12 po strani', 'Mini guma kad bude lako', 45), x('firehydrant', 2, '10 po strani', '', 45), x('veslanjeguma', 3, '12', 'Elastična guma, izdahni pri povlačenju', 45), x('mackakrava', 2, '10', '', 30)] }] },
    { naziv: 'Faza 3 – Snaga', sedmice: '5.–6. sedmica', dana: '3 puta sedmično, 20–30 min', cilj: 'Uvesti osnovne obrasce snage (čučanj, veslanje, potisak) uz izdisaj pri naporu.',
      dani: [
        { naziv: 'Trening A', vj: [x('tva', 2, '8 × 5 s', '', 30), x('cucanj', 3, '10', 'Izdahni pri usponu', 60), x('bridge', 3, '15', '', 45), x('veslanje', 3, '10 po strani', 'Lagan teret', 60), x('deadbug', 2, '6 po strani', 'Smanji raspon ako se pojavi ispupčenje', 30), x('vakuum', 3, '5 × 10 s', 'Tek uz odobrenje ljekara ili fizioterapeuta', 30)] },
        { naziv: 'Trening B', vj: [x('tva', 2, '8 × 5 s', '', 30), x('zidsjed', 3, '20 s', '', 45), x('stolicasklek', 3, '8', 'Visoko povišenje', 60), x('abdgumom', 3, '10 koraka', '', 45), x('birddog', 3, '8 po strani', '', 30), x('toetaps', 2, '8 po nozi', '', 30)] }] },
    { naziv: 'Faza 4 – Funkcionalna snaga', sedmice: '7.–8. sedmica', dana: '3 puta sedmično, 30 min', cilj: 'Povratak složenijim vježbama uz stalnu kontrolu i praćenje znakova upozorenja.',
      dani: [
        { naziv: 'Trening A', vj: [x('goblet', 3, '10', 'Lagan teret', 60), x('rdl', 3, '10', 'Lagan teret', 60), x('veslanje', 3, '10 po strani', '', 60), x('stolicasklek', 3, '10', '', 60), x('birddog', 3, '8 po strani', '', 30)] },
        { naziv: 'Trening B', vj: [x('klizniiskorak', 3, '8 po nozi', '', 60), x('hipthrust', 3, '10', 'Bez opterećenja ili lagano', 60), x('bocapotisak', 3, '10', 'Dvije boce, lagano', 60), x('veslanjeguma', 3, '12', '', 45), x('abdgumom', 3, '10 koraka', '', 45), x('farmer', 3, '40 s', 'Lagan hod s teretom, uz izdisaj', 45)] }] }
  ];
  FS.DIJASTAZA.kretanje = {
    naslov: 'Više kretanja kroz dan',
    uvod: 'Kretanje je dobro za oporavak, ali ne mora biti „brzi hod“ ni poseban trening. U prvim sedmicama važnije je da se krećeš često i blago nego intenzivno.',
    savjeti: [
      'Kratke šetnje laganim tempom, 5 do 10 minuta, 2 do 3 puta dnevno. Tempo na kojem možeš pričati bez daha.',
      'Hodaj uspravno, rebra iznad zdjelice, disanje mirno. Ne forsiraj brzinu.',
      'Stepenice i kućni poslovi su kretanje: izdahni prije nego što podigneš ili povučeš nešto.',
      'Izbjegavaj nošenje teških kesa i dizanje djeteta uz zadržavanje daha; prvo izdahni, pa podigni.',
      'Ako se pojavi ispupčenje po sredini trbuha, bol ili osjećaj težine u zdjelici, skrati šetnju ili usporite.',
      'U fazi 3 i 4, uz odobrenje ljekara, šetnja se može postepeno produžiti na 20 do 30 minuta.'
    ]
  };
  FS.DIJASTAZA.napredovanje = 'Na sljedeću fazu prelazi kada bez bola i bez ispupčenja možeš izvesti sve vježbe uz kontrolu disanja, u dogovoru s trenericom ili fizioterapeutom. Ako ti je teško, ostani u istoj fazi koliko god treba. Treninge A i B naizmjenično radiš kroz sedmicu.';

  /* ----- balans pokreta ----- */
  const PAT = {
    'Horizontalno guranje': ['sklek', 'bench', 'potisakb', 'kosibucice', 'sklekzid', 'stolicasklek'],
    'Vertikalno guranje': ['ramena', 'potisaksipka', 'arnold', 'zpotisak', 'bocapotisak'],
    'Horizontalno veslanje': ['veslanje', 'veslanjesipka', 'veslanjekabl', 'renegade', 'bocaveslanje', 'veslanjeguma', 'reversepec', 'ytw', 'swimmers'],
    'Vertikalno povlačenje': ['lat'],
    'Hip hinge': ['rdl', 'rdlsipka', 'jednorodl', 'kbswing', 'kangsquat', 'bocarodl', 'backext', 'reversehyper', 'pullthrough'],
    'Dominacija koljena': ['cucanj', 'goblet', 'cucanjsipka', 'frontcucanj', 'iskorak', 'iskorakhod', 'bugarski', 'stepup', 'legpress', 'legext', 'sumocucanj', 'lateralnilunge', 'curtsy', 'klizniiskorak', 'zidsjed', 'bocacucanj', 'pistol'],
    'Gluteusi': ['hipthrust', 'hipthrust1', 'bridge', 'frogpump', 'singlebridge', 'kickback', 'abdukcija', 'abdgumom', 'sidelift', 'clamshell', 'jastukmost', 'firehydrant'],
    'Core': ['planka', 'deadbug', 'birddog', 'hollow', 'abwheel', 'woodchop', 'bocnaplanka', 'tva', 'flutter', 'skarice', 'crunch', 'twist', 'sklopke', 'planksavijanje', 'mountainclimb']
  };
  FS.balans = (prog) => {
    const out = {}; Object.keys(PAT).forEach((k) => { out[k] = 0; });
    (prog.dani || []).forEach((d) => d.vj.forEach((v) => { Object.keys(PAT).forEach((k) => { if (PAT[k].includes(v.id)) out[k] += (v.s || 0); }); }));
    return out;
  };
  FS.BALANS_KLJUCEVI = Object.keys(PAT);

  /* ----- obogati ostale programe pokretima koji nedostaju ----- */
  const find = (id) => FS.GOTOVI.find((g) => g.id === id);
  const fb = FS.GOTOVI.find((g) => g.id === 'fullbody'); if (fb) fb.uShopu = false;   // preklapa se sa programom Snažni temelji
  const add = (pid, di, list) => { const p = find(pid); if (p && p.dani[di]) p.dani[di].vj.push(...list); };
  add('fullbody', 0, [x('veslanjeguma', 2, '12', 'Horizontalno veslanje gumom')]);
  add('fullbody', 2, [x('ramena', 2, '10', 'Vertikalno guranje, lagani teret')]);
  add('gluteus', 0, [x('kbswing', 3, '12', 'Hip hinge, dinamično')]);
  add('gluteus', 1, [x('ytw', 2, '12')]);
  add('gluteus', 2, [x('clamshell', 2, '15 po strani'), x('lateralnilunge', 2, '10 po strani')]);
  add('gluteus', 3, [x('lat', 3, '10', 'Vertikalno povlačenje')]);
  add('pocetnice3', 1, [x('arnold', 2, '10', 'Vertikalno guranje')]);
  add('upperlower4', 0, [T('planka', 3, '30 s')]);
  add('upperlower4', 1, [x('hipthrust', 3, '10', 'Gluteusi')]);
  add('pocetnice3', 0, [x('bridge', 3, '15')]);
  add('pocetnice3', 1, [x('veslanje', 3, '10 po strani')]);
  add('glutefb4', 0, [T('planka', 3, '30 s')]);
  add('glutefb4', 2, [T('deadbug', 3, '8 po strani')]);
  add('glutefb4', 1, [x('singlebridge', 3, '12 po nozi')]);
  add('glutefb4', 3, [x('curtsy', 3, '10 po nozi')]);
})();
