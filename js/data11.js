/* Kućni trening s bučicama i gumom: 3 treninga sedmično, 8 sedmica, bez deloada.
   Tri bloka (CORE, BLOK 1, BLOK 2); svake sedmice vježbe prelaze u težu varijantu istog pokreta, a oblik rada se mijenja svake dvije sedmice. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => g.id === 'kuca2')) return;
  const L = (id, o) => Object.assign({ id, uni: '', t: false }, o || {});
  const LAD = {
    SQ: [L('cucanj'), L('goblet'), L('sumocucanj'), L('bugarski', { uni: 'po nozi' })],
    HG: [L('goodmorningbw'), L('rdl'), L('rdlkickstand', { uni: 'po nozi' }), L('jednorodl', { uni: 'po nozi' })],
    BR: [L('bridge'), L('frogpump'), L('singlebridge', { uni: 'po nozi' }), L('hipthrust1', { uni: 'po nozi' })],
    LUN: [L('stepup', { uni: 'po nozi' }), L('iskorak', { uni: 'po nozi' }), L('iskorakhod', { uni: 'po nozi' }), L('bugarski', { uni: 'po nozi' })],
    LUN2: [L('lateralnilunge', { uni: 'po strani' }), L('curtsy', { uni: 'po nozi' }), L('stepup', { uni: 'po nozi' }), L('iskorak', { uni: 'po nozi' })],
    ABD: [L('clamshell', { uni: 'po strani' }), L('firehydrant', { uni: 'po strani' }), L('sidelift', { uni: 'po strani' }), L('abdgumom')],
    PUSH: [L('sklekzid'), L('skleknakoljenima'), L('floorpress'), L('sklek')],
    PUSH2: [L('skleknakoljenima'), L('floorpress'), L('sklek'), L('sklek')],
    ROW: [L('veslanjeguma'), L('veslanje', { uni: 'po strani' }), L('gorillarow', { uni: 'po strani' }), L('renegade', { uni: 'po strani' })],
    SH: [L('ramena'), L('arnold'), L('zpotisak'), L('uprightrow')],
    REAR: [L('ytw'), L('swimmers'), L('reversepec'), L('ytw')],
    ARM: [L('biceps'), L('tricepsrb'), L('hammer'), L('triceps')],
    /* core: t = vrijeme (s), inače ponavljanja */
    CA: [L('birddog', { uni: 'po strani' }), L('deadbug', { uni: 'po strani' }), L('planka', { t: true }), L('hollow', { t: true })],
    CB: [L('bocnaplankabasic', { t: true, uni: 'po strani' }), L('flutter', { t: true }), L('skarice', { t: true }), L('twist')],
    CC: [L('planka', { t: true }), L('birddog', { uni: 'po strani' }), L('bocnaplankabasic', { t: true, uni: 'po strani' }), L('deadbug', { uni: 'po strani' })]
  };
  const SIRI = { 1: 'Pauza 60 s između serija.', 2: 'Kružno: radiš vježbe jednu za drugom bez pauze, pauza 75 s poslije kruga.', 3: 'Kružno: 1. krug 25, 2. krug 20, 3. krug 15 ponavljanja. Pauza 75 s poslije kruga. Uzmi lakšu težinu.', 4: 'Teže serije: spuštanje 3 s, pauza 75 s između serija.' };
  const faza = (w) => Math.ceil(w / 2);
  const KORAK = [0, 1, 2, 3, 1, 2, 3, 3];   /* varijanta po sedmici: bez povratka na najlakšu u 5. sedmici */
  /* slot za blok 1 ili 2: lad = ljestvica, r = osnovna ponavljanja, zadnji = zadnja vježba u bloku (dobija pauzu poslije kruga) */
  const blok = (lad, r, zadnji) => {
    const kw = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
      const v = LAD[lad][KORAK[w - 1]], f = faza(w), uni = v.uni ? ' ' + v.uni : '';
      const cirk = f === 2 || f === 3;
      const base = { id: v.id, fix: true };
      if (f === 1) return Object.assign(base, { s: 3, r: r + uni, n: v.id === LAD[lad][0].id && w === 1 ? '' : '', p: 60 });
      if (f === 2) return Object.assign(base, { s: 4, r: '15' + uni, n: zadnji ? SIRI[2] : '', p: zadnji ? 75 : 0 });
      if (f === 3) return Object.assign(base, { s: 3, r: v.uni ? '12, 10, 8' + uni : '25, 20, 15', n: zadnji ? SIRI[3] : '', p: zadnji ? 75 : 0 });
      return Object.assign(base, { s: 4, r: (v.uni ? '10' : '12') + uni, n: SIRI[4], p: 75 });
    });
    return { id: kw[0].id, s: 3, r: r, fix: true, p: 60, kw };
  };
  const core = (lad) => {
    const kw = [1, 2, 3, 4, 5, 6, 7, 8].map((w) => {
      const v = LAD[lad][KORAK[w - 1]], f = faza(w);
      const r = (v.t ? [30, 40, 45, 50][f - 1] + ' s' : ['12', '12', '15', '15'][f - 1]) + (v.uni ? ' ' + v.uni : '');
      return { id: v.id, fix: true, s: 3, r, p: 30, n: '' };
    });
    return { id: kw[0].id, s: 3, r: kw[0].r, fix: true, p: 30, kw };
  };
  const dan = (naziv, c1, c2, c3, b1, b2) => ({ naziv, vj: [core(c1), core(c2), core(c3)].concat(b1.map((b, i) => blok(b[0], b[1], i === b1.length - 1)), b2.map((b, i) => blok(b[0], b[1], i === b2.length - 1))) });
  const hiit = () => {
    const c = (id, n, last) => ({ id, s: 3, r: '30 s', n: n || '', p: last ? 60 : 0, fix: true });
    return { naziv: 'Opcionalno · HIIT (bez skokova)', vj: [c('cucanj', 'Cirkuit: svaku vježbu radiš 30 s bez pauze, odmor 60 s tek kad završiš cijeli krug. Ukupno 3 kruga.'), c('stolicasklek'), c('iskorak'), c('mountainclimb', 'Sporo, korak po korak'), c('highknees', 'Marširanje, bez skoka'), c('twist', '', true)] };
  };
  FS.GOTOVI.push({
    id: 'kuca2', naziv: 'Kućni trening · bučice i guma', nivo: 'početni', sedmica: 8, dana: 3, cijena: 29, tip: 'gotov', uShopu: false,
    opis: 'Osam sedmica treninga kod kuće s bučicama i elastičnom gumom: tri treninga sedmično, svaki sa CORE dijelom i dva bloka. Vježbe se svake sedmice mijenjaju u težu varijantu, a oblik rada (serije, krugovi, silazni krug) mijenja se svake dvije sedmice.',
    per: { tip: 'nema', deload: 0 },
    bilj: [
      'Oprema: dva para bučica (lakše i teže), mini elastična guma, stolica ili klupa i prostirka. Kettlebell može zamijeniti bučicu kod čučnjeva i zamaha.',
      'Zagrijavanje 5 minuta prije svakog treninga: kruženja kukovima i ramenima, čučanj tjelesnom težinom, hip hinge s ravnim leđima i most za gluteus.',
      'Svaki trening ima tri dijela: CORE, BLOK 1 (noge i gluteus) i BLOK 2 (gornji dio tijela). U sedmicama 1 i 2 radiš klasične serije, u 3 i 4 kružno sa 4 kruga, u 5 i 6 silazni krug 25, 20, 15 ponavljanja, a u 7 i 8 teže serije sa sporim spuštanjem.',
      'Svake sedmice dio vježbi prelazi u težu varijantu istog pokreta (na primjer čučanj tjelesnom težinom, goblet čučanj, sumo čučanj, bugarski čučanj), a od 5. sedmice ne vraćaš se na najlakšu varijantu. Nema deload sedmice.',
      'Težinu odaberi tako da zadnja dva ponavljanja budu teška, ali tehnika ostane čista. Kada ti postane lako, uzmi težu bučicu.',
      'Opcionalno: kratki HIIT jednom sedmično, na dan bez treninga.'
    ],
    dani: [
      dan('Trening 1 · Noge i gluteus', 'CA', 'ABD', 'CC', [['SQ', '15'], ['HG', '15'], ['BR', '15']], [['PUSH', '10'], ['ROW', '12'], ['SH', '12']]),
      dan('Trening 2 · Gluteus i gornji dio', 'CB', 'CA', 'CC', [['LUN', '12'], ['ABD', '15'], ['BR', '15']], [['SH', '12'], ['REAR', '12'], ['ARM', '12']]),
      dan('Trening 3 · Cijelo tijelo', 'CC', 'CB', 'CA', [['SQ', '15'], ['HG', '12'], ['LUN2', '12']], [['PUSH2', '10'], ['ROW', '12'], ['ARM', '12']]),
      hiit()
    ]
  });
})();
