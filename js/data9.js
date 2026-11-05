/* ALMEDINA SCULPT · 6 sedmica hipertrofije (teretana): tri faze po dvije sedmice */
(function () {
  const FS = (window.FS = window.FS || {});
  const x = (id, s, r, n, p, ss) => { const o = { id, s, r, n: n || '', p: p == null ? 120 : p }; if (ss) o.ss = true; return o; };
  const M = (id, s, r, n) => x(id, s, r, n, 180);          // glavna složena vježba: pauza 3 min
  const S = (id, s, r, n) => x(id, s, r, n, 120);          // izolacija: pauza 2 min
  const A = (id, s, r, n) => x(id, s, r, n, 0, true);      // superserija: bez pauze
  const T = (id, s, r, n) => x(id, s, r, n, 45);           // trup
  const H = (id, n, last) => x(id, 4, '45 s', n || '', last ? 75 : 0);
  const HN = 'Cirkuit: svaku vježbu radiš 45 s bez pauze, odmor 60–90 s tek kad završiš cijeli krug. Ukupno 4 kruga. Lagan tempo, bez skokova ako su noge umorne.';

  FS.GOTOVI.push({
    id: 'sculpt', naziv: 'ALMEDINA SCULPT · 6 sedmica', opis: 'Šest sedmica hipertrofije u teretani, pet treninga sedmično: noge, gornji dio tijela dva puta, gluteusi i lagan HIIT. Tri faze od lakših ka težim varijantama, uz napor koji raste iz sedmice u sedmicu.',
    nivo: 'srednji', sedmica: 6, dana: 5, cijena: 49, tip: 'gotov', uShopu: true, per: { tip: 'nema', deload: 0 },
    bilj: [
      'Tri faze: sedmice 1–2 radiš treninge „Faza 1“, sedmice 3–4 „Faza 2“, a sedmice 5–6 „Faza 3“ (svaka teža od prethodne).',
      'Raspored sedmice: ponedjeljak noge, utorak gornji dio A, srijeda lagan HIIT (ili odmor), četvrtak gluteusi, petak gornji dio B, subota i nedjelja odmor i šetnja.',
      'Napor (RIR = ponavljanja u rezervi): sedmica 1 oko 3, sedmica 2 oko 2–3, sedmica 3 oko 2, sedmice 4 i 5 oko 1–2, sedmica 6 oko 1.',
      'Kad u svim serijama stigneš do gornje granice ponavljanja sa zadanim naporom, povećaj težinu za najmanji skok (oko 2,5–5 %) i vrati se na donju granicu.',
      'Složene vježbe (čučanj, rumunsko mrtvo dizanje, hip thrust, bench press) ne radi do potpunog otkaza. Izolacione u zadnjoj seriji mogu do 0–1 ponavljanja u rezervi.',
      'Pauze: 3 min kod glavnih vježbi, 2 min kod izolacija, 4 min kod hip thrusta. Prije prve vježbe zagrij se sa 50 % radne težine.',
      'Poslije sedmice 6: jedna lakša sedmica (oko pola serija sa istim težinama), pa ponovo od Faze 1 sa težim težinama.',
      'Ako forma popusti ili osjetiš bol, smanji težinu ili stani. Bol koji se širi ili ne prolazi je razlog za ljekara.'
    ],
    dani: [
      { naziv: 'Faza 1 · Noge', vj: [M('cucanjsipka', 3, '8–12'), M('legpress', 3, '10–12', 'Stopala visoko na platformi (fokus na gluteus)'), M('bugarski', 2, '8–10 po nozi'), S('legext', 3, '10–12'), S('backext', 2, '8–12', '45° ekstenzija kuka'), S('listovi', 3, '12–15')] },
      { naziv: 'Faza 1 · Gornji dio A (leđa)', vj: [M('lat', 3, '8–12', 'Široki hvat'), M('veslanjekabl', 3, '8–12', 'Veslanje na mašini ili sajli'), S('veslanje', 2, '8–12 po strani', 'Jednoručno na klupi'), S('reversepec', 3, '10–12'), S('chestpress', 2, '10–12'), A('biceps', 3, '10–12', 'Superserija'), x('tricepskabl', 3, '10–12', 'Superserija s bicepsom', 90)] },
      { naziv: 'Faza 1 · HIIT (lagan)', vj: [H('cucanj', HN), H('sklek'), H('jumpingjack'), H('mountainclimb'), H('plankhops', '', true)] },
      { naziv: 'Faza 1 · Gluteusi', vj: [x('hipthrust', 3, '8–12', 'Ili glute bridge sa šipkom u Smith mašini', 240), M('rdlsipka', 3, '8–10'), S('iskorak', 2, '6–10 po nozi'), S('legcurl', 3, '8–12'), S('kickback', 3, '10–15 po nozi', 'Do kraja raspona, bez zabacivanja trupa'), S('abdukcija', 2, '12–20'), T('planka', 3, '30 s'), T('deadbug', 3, '8 po strani')] },
      { naziv: 'Faza 1 · Gornji dio B (prsa i ramena)', vj: [M('chestpress', 3, '8–12'), M('kosibucice', 2, '8–12'), M('ramenaspr', 2, '8–10'), S('bocno', 3, '8–20'), S('tricepskabl', 3, '8–15', 'Sa konopom'), S('reversepec', 2, '12–15'), S('veslanjekabl', 2, '10–12')] },

      { naziv: 'Faza 2 · Noge', vj: [M('cucanjsipka', 3, '6–8'), M('legpress', 3, '8–12'), M('iskorakhod', 2, '8–10 po nozi'), S('legext', 3, '10–15'), S('backext', 3, '8–12', 'Hiperekstenzija za gluteus'), S('listovi', 3, '10–15')] },
      { naziv: 'Faza 2 · Gornji dio A (leđa)', vj: [M('lat', 3, '8–10', 'Srednji hvat'), M('veslanjekabl', 3, '8–12', 'Horizontalno veslanje na sajli'), M('veslanje', 3, '8–12 po strani', 'Bučica na kosoj klupi'), S('reversepec', 3, '10–12'), S('potisakb', 2, '8–10'), A('biceps', 3, '10–12', 'Superserija'), x('tricepskabl', 3, '10–12', 'Superserija s bicepsom', 90)] },
      { naziv: 'Faza 2 · HIIT (lagan)', vj: [H('skokpovisenje', 'Skok na step ili povišenje, meko slijetanje. ' + HN), H('flutter', 'Leg raises ili leptir udarci'), H('planksavijanje'), H('mountainclimb'), H('plankhops', 'Plank sa abdukcijom noge'), H('iskorak', 'Zakorak unazad', true)] },
      { naziv: 'Faza 2 · Gluteusi', vj: [x('hipthrust', 3, '8 + 8', 'Druga osmica do pola pokreta', 240), M('rdlsipka', 3, '8–10'), S('stepup', 2, '8–10 po nozi'), S('legcurl', 3, '8–12'), S('kickback', 3, '10–12 po nozi'), S('abdukcija', 2, '12–20'), T('bocnaplanka', 3, '20 s po strani'), T('deadbug', 3, '8 po strani')] },
      { naziv: 'Faza 2 · Gornji dio B (prsa i ramena)', vj: [M('potisakb', 3, '8–10', 'Chest press sa bučicama'), M('kosibucice', 3, '8–12'), M('ramena', 2, '8–10', 'Military press bučicama'), S('bocno', 3, '8–20'), S('tricepskabl', 3, '8–15', 'Sa konopom'), S('reversepec', 2, '10–12'), S('veslanjekabl', 2, '8–12')] },

      { naziv: 'Faza 3 · Noge', vj: [M('cucanjsipka', 4, '6–8'), M('legpress', 3, '6–10'), M('bugarski', 3, '8–10 po nozi', 'Teže bučice'), S('legext', 3, '8–20'), S('backext', 3, '8–12', 'Sa tegom'), S('listovi', 4, '10–15')] },
      { naziv: 'Faza 3 · Gornji dio A (leđa)', vj: [M('lat', 4, '8–10', 'Srednji hvat'), M('veslanjesipka', 3, '8–10', 'Veslanje u pretklonu sa šipkom'), M('veslanje', 3, '8–12 po strani', 'Bučica na kosoj klupi, teže'), S('reversepec', 3, '10–12'), S('potisakb', 2, '8–10'), A('biceps', 3, '10–12', 'Superserija'), x('tricepskabl', 3, '10–12', 'Superserija s bicepsom', 90)] },
      { naziv: 'Faza 3 · HIIT (lagan)', vj: [H('kbswing', HN), H('jumpingjack'), H('iskorak', 'Zakorak unazad'), H('twist', 'Russian twist'), H('mountainclimb', 'Marinci'), H('sklopke'), H('cucanjskok', '', true)] },
      { naziv: 'Faza 3 · Gluteusi', vj: [x('hipthrust', 3, '8 + 8 s + 8', 'Osmica do pola, 8 s držanja, osmica do pola', 240), M('rdlsipka', 3, '8–10', 'Teže'), S('iskorak', 2, '6–10 po nozi', 'Teže'), S('legcurl', 3, '8–12'), S('kickback', 3, '10–12 po nozi'), S('abdukcija', 3, '12–20'), T('hollow', 3, '30 s'), T('bocnaplanka', 3, '30 s po strani')] },
      { naziv: 'Faza 3 · Gornji dio B (prsa i ramena)', vj: [M('bench', 3, '6–10', 'Klasični bench press'), M('kosibucice', 3, '8–12', 'Teže'), M('ramena', 3, '8–10', 'Military press bučicama'), S('bocno', 4, '8–20'), S('tricepskabl', 4, '8–15', 'Sa konopom'), S('reversepec', 2, '10–12'), S('veslanjekabl', 2, '8–12')] }
    ]
  });

  /* u prodaji ostaju četiri programa (kuća, početnici, teretana srednji, teretana napredni) + vodič za ishranu; ostali se i dalje mogu dodijeliti klijenticama */
  Object.assign(FS.GOTOVI.find((g) => g.id === 'pocetnice3'), {
    naziv: 'Snažni temelji · početnici · 3 dana',
    opis: 'Devet sedmica za sve koji tek počinju u teretani, žene i muškarce. Tri treninga sedmično za cijelo tijelo: prve tri sedmice samo na spravama zbog kontrole pokreta, zatim jednostavne bučice, a na kraju zahtjevnije slobodne varijante.'
  });
  const PRODAJA = ['kuca', 'pocetnice3', 'sculpt', 'napredni5', 'vodic-ishrana'];
  FS.GOTOVI.forEach((g) => { if (g.uShopu && !PRODAJA.includes(g.id)) g.uShopu = false; });
})();
