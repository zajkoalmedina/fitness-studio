/* Videi vježbi koje je snimila trenerica (u mapi videos/). Imaju prednost nad starim ručno učitanim videima. */
(function () {
  const FS = window.FS;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['bocnaplankabasic', 'Side Plank', 'Core', 'srednji', 'Bez opreme', 'ne',
      'Leži na bok, osloni se na podlakticu ili dlan ispod ramena.|Podigni kukove tako da tijelo bude u ravnoj liniji.|Gornju ruku podigni prema stropu, pogled naprijed.|Zadrži položaj, zatim promijeni stranu.',
      'Počni na koljenu ako je pretežak.|Stisni trbuh i gluteus.', 'Propadanje kukova.|Rotiranje trupa prema naprijed.', null, ['kosi trbušni mišići', 'core'], ['ramena', 'gluteus']],
    ['veslanjeoslonjeno', 'Chest-Supported Dumbbell Row', 'Leđa', 'početni', 'Bučice, kosa klupa', 'ne',
      'Podesi klupu na blagi nagib (oko 30°).|Lezi licem prema dolje, prsa i trbuh na naslonu, glava malo iznad ruba, stopala na podu.|Uhvati po jednu bučicu u svaku ruku, ruke ispružene prema podu.|Povuci bučice prema donjem dijelu rebara, laktovi uz tijelo.|Zadrži 1 sekundu uz stisak lopatica, pa polako spusti.',
      'Prsa cijelo vrijeme ostaju na klupi.|Povlači laktovima, ne rukama.|Vrat u liniji s kičmom, pogled prema podu.', 'Podizanje prsa s klupe.|Podizanje ramena prema ušima.|Zamah i trzaj.', null, ['široki leđni mišić', 'srednji dio leđa'], ['biceps', 'zadnja ramena']],
    ['gorillarow', 'Gorilla Row', 'Leđa', 'srednji', 'Dvije girje ili bučice', 'ne',
      'Stani nad dvije girje, stopala šire od kukova.|Savij kukove i ravna leđa, uhvati obje girje.|Povuci jednu girju laktom prema kuku, a drugu ostavi na podu.|Spusti je i povuci drugu, naizmjenično.',
      'Leđa ravna, trup gotovo paralelan s podom.|Povlači laktom prema kuku, ne rukom.|Kukove ne okreći.', 'Zaobljena leđa.|Zamah trupom.|Podizanje ramena prema ušima.', null, ['široki leđni mišić', 'srednji dio leđa'], ['biceps', 'zadnja loža']],
    ['rdlkickstand', 'Romanian Deadlift – Kickstand (Kettlebell)', 'Gluteus', 'srednji', 'Girja ili bučica', 'ne',
      'Stani u raskoračni stav: prednje stopalo cijelo na podu, zadnje samo na prstima, malo iza.|Girju drži uz prednju nogu, savij kukove i potisni ih unazad.|Spuštaj girju uz nogu uz ravna leđa, osjeti istezanje zadnje lože prednje noge.|Stisni gluteus prednje noge i uspravi se. Zatim zamijeni stranu.',
      'Teret nosi prednja noga, zadnja je samo oslonac za ravnotežu.|Koljeno prednje noge blago savijeno.|Leđa ravna, pogled prema podu.', 'Previše težine na zadnjoj nozi.|Zaobljena leđa.|Okretanje kukova.', null, ['zadnja loža', 'gluteus'], ['donja leđa']],
    ['skleknakoljenima', 'Knee Push Up', 'Prsa', 'početni', 'Bez opreme', 'kasnije',
      'Klekni, dlanovi na podu malo šire od ramena, tijelo u liniji od koljena do glave.|Stegni trbuh i gluteus, pogled malo ispred dlanova.|Savij laktove i spusti grudi prema podu.|Odgurni se i ispruži ruke, bez propadanja kukova.',
      'Laktovi idu pod uglom od oko 45° od tijela.|Disanje: udahni dolje, izdahni dok se odgurneš.|Kad postane lako, pređi na običan sklek.', 'Propadanje kukova ili izbacivanje zadnjice.|Laktovi širom od tijela.|Spuštanje samo napola.', null, ['grudi', 'triceps'], ['ramena', 'core']],
    ['goodmorningbw', 'Good Morning (Bodyweight)', 'Gluteus', 'početni', 'Bez opreme', 'ne',
      'Stani u širini kukova, koljena blago savijena, ruke iza glave.|Potisni kukove unazad uz ravna leđa i nagni trup naprijed.|Spusti trup do paralele s podom ili dokle ide bez zaokruživanja leđa.|Stisni gluteus i uspravi se.',
      'Pokret ide iz kukova, ne iz leđa.|Pogled prema dolje, vrat u liniji s kičmom.', 'Zaobljena leđa.|Previše savijena koljena (postaje čučanj).', null, ['zadnja loža', 'gluteus'], ['donja leđa']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, pose, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
    FS.EXTRA_POSES[id] = pose; FS.EXTRA_MUSKUL[id] = { p: prim, s: sec };
  });
  FS.VIDEOS = { bugarski: 'videos/bugarski.mp4', iskorak: 'videos/iskorak.mp4', iskorakhod: 'videos/iskorakhod.mp4', farmer: 'videos/farmer.mp4', sklek: 'videos/sklek.mp4', skleknakoljenima: 'videos/skleknakoljenima.mp4', stolicasklek: 'videos/sklekincline.mp4', cucanj: 'videos/cucanj.mp4', goblet: 'videos/goblet.mp4', veslanjesipka: 'videos/veslanjesipka.mp4', rdlsipka: 'videos/rdlsipka.mp4', ramena: 'videos/ramena.mp4', veslanjeoslonjeno: 'videos/veslanjeoslonjeno.mp4', chestpress: 'videos/chestpress.mp4', bocno: 'videos/bocno.mp4', tricepskabl: 'videos/tricepskabl.mp4', cucanjsipka: 'videos/cucanjsipka.mp4', veslanjekabl: 'videos/veslanjekabl.mp4', abdukcija: 'videos/abdukcija.mp4', legcurl: 'videos/legcurl.mp4', legext: 'videos/legext.mp4', planka: 'videos/planka.mp4', lat: 'videos/lat.mp4', jednorodl: 'videos/jednorodl.mp4', rdl: 'videos/rdl.mp4', kbswing: 'videos/kbswing.mp4', rdlkickstand: 'videos/rdlkickstand.mp4', gorillarow: 'videos/gorillarow.mp4',  legpress: 'videos/legpress.mp4', lateralnilunge: 'videos/bocniiskorak.mp4', stepup: 'videos/stepup.mp4', bocnaplankabasic: 'videos/bocnaplanka.mp4', goodmorningbw: 'videos/goodmorningbw.mp4' };
  /* vježbe koje je trenerica sama dodala u aplikaciji: video se veže po nazivu */
  /* vježbe koje trenerica sama doda: video se veže i ako naziv samo sadrži ovaj izraz */
  FS.VIDEOS_SADRZI = [['gorilla row', 'videos/gorillarow.mp4'], ['clean and press', 'videos/kbcleanpress.mp4'], ['incline push', 'videos/sklekincline.mp4'], ['incline sklek', 'videos/sklekincline.mp4']];
  FS.VIDEOS_NAZIV = { 'single leg press': 'videos/legpress1.mp4', 'kb clean and press – nabačaj i potisak girje': 'videos/kbcleanpress.mp4', 'kb clean and press - nabačaj i potisak girje': 'videos/kbcleanpress.mp4' };
})();

/* HIIT dodatak: kratki cirkuiti (3 nivoa) koje klijentica dodaje na dan bez teškog treninga nogu */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => g.id === 'hiit')) return;
  const c = (rad, rundi) => (id, n, last) => ({ id, s: rundi, r: rad + ' s', n: n || '', p: last ? 60 : 0 });
  const P = c(30, 3), Sr = c(40, 4), N = c(45, 4);
  const KRUG = (rad, rundi) => 'Cirkuit: svaku vježbu radiš ' + rad + ' s bez pauze, odmor 60 s tek kad završiš cijeli krug. Ukupno ' + rundi + ' kruga.';
  FS.GOTOVI.push({
    id: 'hiit', naziv: 'HIIT dodatak · 3 nivoa', nivo: 'početni', sedmica: 4, dana: 3, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true,
    opis: 'Kratki HIIT cirkuiti od oko 11 do 21 minute u tri nivoa (početni bez skokova, srednji, napredni). Dodaju se uz program snage na dan bez teškog treninga nogu.',
    per: { tip: 'nema', deload: 0 },
    bilj: [
      'Ovo je dodatak uz glavni program, ne zamjena za trening snage. Radi ga na dan bez teškog treninga nogu, najmanje dan prije sljedećeg lower treninga.',
      'Dovoljno je 1 do 2 puta sedmično. Više nije bolje: oporavak je dio treninga.',
      'Odaberi nivo prema iskustvu: Početni (bez skokova, oko 11 min), Srednji (oko 19 min), Napredni (oko 21 min).',
      'Prije početka 3 do 5 minuta lagane šetnje ili zagrijavanja. Tempo je težak, ali tehnika ostaje čista; ako forma popusti, smanji tempo ili stani.',
      'Ako imaš probleme s koljenima, dijastazu, ili si nakon porođaja, preskoči skokove i dogovori vježbe s trenericom ili ljekarom.'
    ],
    dani: [
      { naziv: 'HIIT · Početni (bez skokova)', vj: [P('cucanj', KRUG(30, 3)), P('stolicasklek'), P('iskorak'), P('mountainclimb', 'Sporo, korak po korak'), P('highknees', 'Marširanje, bez skoka'), P('twist', '', true)] },
      { naziv: 'HIIT · Srednji', vj: [Sr('jumpingjack', KRUG(40, 4)), Sr('cucanj'), Sr('skaterhop'), Sr('mountainclimb'), Sr('plankhops'), Sr('twist', '', true)] },
      { naziv: 'HIIT · Napredni', vj: [N('kbswing', KRUG(45, 4)), N('burpee'), N('cucanjskok'), N('skaterhop'), N('plankhops'), N('mountainclimb', '', true)] }
    ]
  });
})();

/* Glute Pro: peti trening je opcionalni HIIT koji se mijenja svake sedmice (A, B, C, D); HIIT opcionalno i u ostalim programima */
(function () {
  const FS = (window.FS = window.FS || {});
  const G = (id) => (FS.GOTOVI || []).find((g) => g.id === id);
  const h = (rad, rundi) => (id, n, last) => ({ id, s: rundi, r: rad + ' s', n: n || '', p: last ? 60 : 0, fix: true });
  const krug = (rad, rundi) => 'Cirkuit: svaku vježbu radiš ' + rad + ' s bez pauze, odmor 60 s tek kad završiš cijeli krug. Ukupno ' + rundi + ' kruga.';
  const L = h(30, 3), M = h(40, 4);
  const lagani = () => [L('cucanj', krug(30, 3)), L('stolicasklek'), L('iskorak'), L('mountainclimb', 'Sporo, korak po korak'), L('highknees', 'Marširanje, bez skoka'), L('twist', '', true)];
  const srednji = () => [M('jumpingjack', krug(40, 4)), M('cucanj'), M('skaterhop'), M('mountainclimb'), M('plankhops'), M('twist', '', true)];

  /* ---- Glute Pro: 4 treninga snage + opcionalni HIIT ---- */
  const n5 = G('napredni5');
  if (n5 && n5.dani.length === 5 && !n5.dani.some((d) => /HIIT/.test(d.naziv))) {
    const o = (id, s, r, n) => ({ id, s, r, n: n || '' });
    const d1 = n5.dani[0], d3 = n5.dani[2];
    d1.vj.splice(1, 0, o('legpress', 3, '10–12'));
    const i = d3.vj.findIndex((v) => v.id === 'hipthrust');
    d3.vj.splice(i + 1, 0, o('bugarski', 3, '10 po nozi'));
    const r = d3.vj.findIndex((v) => v.id === 'rdlsipka' || v.id === 'pullthrough');
    d3.vj.splice(r + 1, 0, o('backext', 3, '15', 'Naglasak na gluteusu'));
    const A = [M('kbswing', krug(40, 4)), M('jumpingjack'), M('iskorak'), M('mountainclimb'), M('skaterhop'), M('twist', '', true)];
    const B = [M('skokpovisenje', krug(40, 4)), M('plankhops'), M('cucanj'), M('squatjacks'), M('planksavijanje'), M('highknees', '', true)];
    const C = [M('cucanjskok', krug(40, 4)), M('mountainclimb'), M('nevidljiva'), M('iskorak'), M('sklopke'), M('skaterhop', '', true)];
    n5.dani = n5.dani.slice(0, 4).concat([
      { naziv: '5. HIIT A · sedmice 1 i 5 (opcionalno)', vj: A },
      { naziv: '5. HIIT B · sedmice 2 i 6 (opcionalno)', vj: B },
      { naziv: '5. HIIT C · sedmice 3 i 7 (opcionalno)', vj: C },
      { naziv: '5. HIIT D · sedmice 4 i 8 (opcionalno)', vj: srednji() }]);
    n5.opis = 'Osam sedmica: četiri treninga snage (lower, upper, lower, upper) i peti trening, opcionalni HIIT, koji se mijenja svake sedmice. Tačno planiran volumen po mišićnim grupama.';
    n5.bilj = n5.bilj.map((b) => b.replace('15 kvadricepsa', '13 kvadricepsa'))
      .concat(['Peti trening je HIIT (oko 11 do 21 minuta) i nije obavezan. Mijenja se svake sedmice: A, B, C i D. Radi ga na dan bez teškog treninga nogu. Ako si umorna, preskoči ga: trening snage ima prednost.']);
  }

  /* ---- ostali programi: jedan opcionalni HIIT dan na kraju ---- */
  const dodaj = (id, naziv, vj, ime) => {
    const p = G(id);
    if (!p || p.dani.some((d) => /HIIT/.test(d.naziv))) return;
    p.dani.push({ naziv, vj });
    p.bilj = (p.bilj || []).concat([ime]);
  };
  const OPC = (min, bez) => 'Opcionalno: HIIT trening od oko ' + min + ' minuta, jednom sedmično, na dan bez teškog treninga nogu' + (bez ? ' (bez skokova)' : '') + '. Preskoči ga ako si umorna: glavni trening ima prednost.';
  dodaj('gluteus', 'Opcionalno · HIIT', srednji(), OPC(19));
  dodaj('glutefb4', 'Opcionalno · HIIT', srednji(), OPC(19));
  dodaj('fullbody', 'Opcionalno · HIIT (bez skokova)', lagani(), OPC(11, true));
  dodaj('pocetnice3', 'Opcionalno · HIIT (bez skokova)', lagani(), OPC(11, true));
  dodaj('upperlower4', 'Opcionalno · HIIT (bez skokova)', lagani(), OPC(11, true));
})();

/* Kardio na kraju treninga snage (glute programi): 3 nivoa težine, trajanje 10–20 min tako da trening ostane kratak */
(function () {
  const FS = (window.FS = window.FS || {});
  const novi = [
    ['kardio_traka', 'Hodanje na traci s nagibom (Incline treadmill walk)', 'početni', 'Traka', ['Postavi blagi do umjeren nagib i brzinu uz koju hodaš brzo, ali ravnomjerno.', 'Drži se za traku samo lagano ili uopće ne.', 'Disanje je ubrzano, ali još uvijek možeš govoriti u cijelim rečenicama.'], ['Nivo težine 1 od 3 (najlakše): najbolji izbor poslije teškog treninga nogu.', 'Ako nema trake, hodaj brzo vani ili uz stepenice.'], ['Naslanjanje na ručke trake.', 'Prekratak korak i naginjanje trupa naprijed.']],
    ['kardio_bicikl', 'Sobni bicikl (Stationary bike)', 'početni', 'Sobni bicikl', ['Podesi sjedalo tako da koljeno ostane lagano savijeno na dnu pedale.', 'Okreći ravnomjerno, bez trzaja, uz umjeren otpor.', 'Tempo je takav da možeš govoriti u kratkim rečenicama.'], ['Nivo težine 2 od 3 (srednje).', 'Povećaj otpor prije brzine, uz ravnu kičmu.'], ['Prenisko ili previsoko sjedalo.', 'Pretežak otpor uz pritisak na koljena.']],
    ['kardio_stepenice', 'Stepenice na spravi (Stair climber)', 'srednji', 'Sprava za stepenice', ['Stani uspravno, noge cijelim stopalom na stepenicama.', 'Penji se ravnomjerno, bez oslanjanja svom težinom na ručke.', 'Tempo je umjeren: možeš govoriti u kratkim rečenicama.'], ['Nivo težine 3 od 3 (najteže): bolje poslije gornjeg dijela tijela nego poslije teškog treninga nogu.', 'Počni sporije i ostani na istom tempu do kraja.'], ['Naslanjanje na ručke.', 'Penjanje na prstima.']]
  ];
  novi.forEach(([id, naziv, nivo, oprema, koraci, savjeti, greske]) => {
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa: 'Kardio', nivo, oprema, dij: 'da', koraci, savjeti, greske, video: '' });
  });
  const NAME = { kardio_traka: 'Hodanje na traci (nivo 1, najlakše)', kardio_bicikl: 'Sobni bicikl (nivo 2)', kardio_stepenice: 'Stepenice (nivo 3, najteže)' };
  const ZAM = { kardio_traka: 'sobnim biciklom', kardio_bicikl: 'hodanjem na traci', kardio_stepenice: 'sobnim biciklom' };
  const INT = {
    lagani: 'Lagan tempo (3–4 od 10): možeš pričati bez zadihanosti.',
    umjeren: 'Umjeren tempo (5–6 od 10): možeš govoriti u kratkim rečenicama.'
  };
  const NOTA = (id, inten) => INT[inten] + ' Možeš zamijeniti ' + ZAM[id] + '.';
  /* vrsta po sedmicama: 1 hodanje, 2 bicikl, 3 stepenice, 4 hodanje, 5 bicikl, 6 i 7 stepenice, 8 hodanje;
     intenzitet: poslije teškog treninga nogu lagan, poslije lakšeg treninga snage umjeren */
  const VRSTE = ['kardio_traka', 'kardio_bicikl', 'kardio_stepenice', 'kardio_traka', 'kardio_bicikl', 'kardio_stepenice', 'kardio_stepenice', 'kardio_traka'];
  const ljestvica = (teski) => VRSTE.map((id) => ({ id, n: NOTA(id, teski ? 'lagani' : 'umjeren') }));
  const dodaj = (id, plan) => {
    const g = (FS.GOTOVI || []).find((x) => x.id === id);
    if (!g) return;
    Object.keys(plan).forEach((i) => {
      const d = g.dani[+i]; if (!d || d.vj.some((v) => v.kw)) return;
      const lj = ljestvica(plan[i][1]);
      d.vj.push({ id: 'kardio_traka', s: 1, r: plan[i][0] + ' min', n: lj[0].n, p: 0, fix: true, kw: lj });
    });
    g.bilj = (g.bilj || []).concat(['Kardio na kraju treninga radiš dva puta sedmično (na dva dana označena u programu), ne mora poslije svakog treninga. Vrsta se mijenja po sedmicama: 1. hodanje na traci, 2. sobni bicikl, 3. stepenice, 4. hodanje, 5. bicikl, 6. i 7. stepenice, 8. hodanje.', 'Intenzitet kardija je naznačen uz vježbu: lagan (3–4 od 10) ili umjeren (5–6 od 10). Trajanje je prilagođeno dužini treninga, tako da cijeli trening ostaje okvirno do 1 sat i 10 minuta.']);
  };
  dodaj('gluteus', { 1: [20, false], 3: [20, false] });
  dodaj('glutefb4', { 0: [10, true], 2: [15, true] });
  dodaj('napredni5', { 1: [15, false], 3: [15, false] });
})();


/* Glute programi (Glute balans, Glute fokus, Glute Pro): bez deloada. Svake sedmice dio vježbi prelazi u težu varijantu istog pokreta;
   u sedmicama 5–8 iste varijante rade se težom tehnikom (pauza ili sporo spuštanje). Glavne vježbe (hip thrust, čučnjevi, potisci) ostaju iste. */
(function () {
  const FS = (window.FS = window.FS || {});
  const G = (id) => (FS.GOTOVI || []).find((g) => g.id === id);
  const L = (id, suf) => ({ id, suf: suf || '' });
  const LADDER = {
    /* abdukcije: od najlakše do najteže */
    A: { cue: 'Pauza 2 s u kontrakciji.', v: [L('clamshell', 'po strani'), L('firehydrant', 'po strani'), L('abdgumom'), L('abdukcija')] },
    /* hinge */
    H: { cue: 'Spuštanje 3 s.', v: [L('rdl'), L('rdlkickstand', 'po nozi'), L('jednorodl', 'po nozi'), L('rdlsipka')] },
    /* jednonožni pokreti za noge i gluteus */
    U: { cue: 'Spuštanje 3 s.', v: [L('iskorak', 'po nozi'), L('iskorakhod', 'po nozi'), L('stepup', 'po nozi'), L('curtsy', 'po nozi')] },
    LB: { cue: 'Spuštanje 3 s.', v: [L('stepup', 'po nozi'), L('iskorakhod', 'po nozi'), L('curtsy', 'po nozi'), L('bugarski', 'po nozi')] },
    /* veslanja */
    ROW: { cue: 'Pauza 1 s uz stisak lopatica, spuštanje 3 s.', v: [L('veslanjekabl'), L('veslanje', 'po strani'), L('veslanjesipka'), L('gorillarow', 'po strani')] },
    /* potisak iznad glave */
    RS: { cue: 'Spuštanje 3 s.', v: [L('ramenaspr'), L('ramena'), L('arnold'), L('zpotisak')] },
    /* podizanje kukova */
    B: { cue: 'Pauza 2 s na vrhu.', v: [L('bridge'), L('frogpump'), L('singlebridge', 'po nozi'), L('hipthrust1', 'po nozi')] },
    /* core */
    CORE: { cue: 'Zadrži 10 s duže nego prije.', v: [L('planka'), L('bocnaplankabasic', 'po strani'), L('hollow'), L('planksavijanje')] }
  };
  const ocisti = (r) => String(r).replace(/\s*po (nozi|strani)\s*$/, '');
  const IME = { A: 'abdukcije', H: 'rumunsko mrtvo dizanje', U: 'iskoraci', LB: 'jednonožni čučnjevi i iskoraci', ROW: 'veslanja', RS: 'potisak za ramena', B: 'podizanje kukova', CORE: 'core' };
  const PLAN = {
    gluteus: { 0: { rdl: 'H', abdukcija: 'A' }, 1: { ramena: 'RS', veslanjekabl: 'ROW' }, 2: { stepup: 'U' }, 3: { veslanje: 'ROW', planka: 'CORE' } },
    glutefb4: { 0: { abdukcija: 'A', planka: 'CORE' }, 1: { stepup: 'U', rdl: 'H', veslanjekabl: 'ROW' }, 2: { ramena: 'RS', bridge: 'B' }, 3: { curtsy: 'U', rdlsipka: 'H', veslanjesipka: 'ROW' } },
    napredni5: { 0: { rdlsipka: 'H', abdukcija: 'A' }, 1: { ramena: 'RS', veslanjekabl: 'ROW' }, 2: { bugarski: 'LB', planka: 'CORE' }, 3: { veslanje: 'ROW' } }
  };
  Object.keys(PLAN).forEach((pid) => {
    const g = G(pid); if (!g || g.rotirano) return;
    const koristi = new Set();
    Object.keys(PLAN[pid]).forEach((di) => {
      const d = g.dani[+di]; if (!d) return;
      Object.keys(PLAN[pid][di]).forEach((slot) => {
        const x = d.vj.find((v) => v.id === slot && !v.kw); if (!x) return;
        const lad = LADDER[PLAN[pid][di][slot]], base = ocisti(x.r);
        const tjedni = (w) => {
          const v = lad.v[(w - 1) % 4], teze = w > 4;
          const r = v.suf ? base + ' ' + v.suf : base;
          const n = teze ? lad.cue : (v.id === slot ? x.n || '' : '');
          return { id: v.id, r, n };
        };
        x.kw = [1, 2, 3, 4, 5, 6, 7, 8].map(tjedni);
        koristi.add(PLAN[pid][di][slot]);
      });
    });
    g.rotirano = true;
    g.bilj = (g.bilj || []).filter((b) => !/^Deload/.test(b)).concat([
      'Bez deload sedmice: svake sedmice dio vježbi (' + [...koristi].map((k) => IME[k]).join(', ') + ') prelazi u težu varijantu istog pokreta. U sedmicama 5 do 8 iste varijante radiš težom tehnikom (pauza ili sporo spuštanje). Glavne vježbe, kao hip thrust, čučnjevi i potisci, ostaju iste, a napreduješ težinom.'
    ]);
    g.per = { tip: g.per && g.per.tip ? g.per.tip : 'nema', deload: 0 };
  });
  const gl = G('gluteus');
  if (gl) {
    gl.opis = gl.opis.replace(' Deload svake 4. sedmice.', ' Svake sedmice dio vježbi prelazi u težu varijantu.');
    const ht = gl.dani[0].vj.find((v) => v.id === 'hipthrust'); if (ht && !ht.n) ht.n = 'Na vrhu zadrži 1–2 s i stisni gluteus.';
  }
  const k = G('kuca'); if (k && k.per) k.per = { tip: k.per.tip, deload: 0 };
  const sc = G('sculpt'); if (sc) sc.bilj = (sc.bilj || []).map((b) => b.replace('Poslije sedmice 6: jedna lakša sedmica (oko pola serija sa istim težinama), pa ponovo od Faze 1 sa težim težinama.', 'Poslije sedmice 6 ponovo počni od Faze 1 sa težim težinama.'));
})();
