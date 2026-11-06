/* Biblioteka treninga po nivoima (samo za trenericu) + Drop set + štoperica.
   Brišu se svi gotovi programi osim dijastaze (kućni program za dijastazu živi u FS.DIJASTAZA) i vodiča za ishranu. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI) return;
  const nova = [
    ['gluteext', 'Glute Hyperextension (45°)', 'Gluteus', 'početni', 'Sprava za hiperekstenziju, podloga 45°', 'ne',
      'Namjesti jastuk sprave ispod kukova, stopala pod valjkom, noge ispružene, stopala blago okrenuta prema van.|Ukrsti ruke na grudima ili uz glavu, gornji dio leđa blago zaobljen, brada prema grudima.|Spusti trup iz kukova dok ne osjetiš istezanje zadnje lože i gluteusa.|Podigni trup stiskom gluteusa do ravne linije tijela i zaustavi se, bez izvijanja leđa.', 'Pokret dolazi iz kukova, ne iz donjeg dijela leđa.|Na vrhu stisni gluteus 1 s.|Spuštanje 2–3 s.|Za više opterećenja drži bučicu ili kolut uz grudi.', 'Izvijanje donjeg dijela leđa na vrhu.|Zamah trupom.|Spuštanje ispod kontrolisanog opsega.', ['gluteus'], ['zadnja loža', 'donji dio leđa']],
    ['facepull', 'Face Pull', 'Ramena', 'početni', 'Kabl, uže', 'ne',
      'Namjesti kabl u visinu lica i uhvati uže s oba kraja, dlanovi gledaju jedan prema drugom.|Odstupi korak, rebra spuštena, pogled ravno ispred.|Povuci uže prema licu, laktovi visoko i vani, lopatice se spajaju.|Zadrži 1 s, polako vrati 2 s.', 'Lakši teg, čist pokret.|Rotiraj podlaktice prema van na kraju pokreta.|Ne naginji se unazad.', 'Pretežak teg i zamah trupom.|Laktovi padaju ispod ramena.', ['ramena', 'leđa'], ['rotatori']],
    ['dbfly', 'Dumbbell Fly', 'Prsa', 'srednji', 'Bučice, klupa', 'ne',
      'Lezi na klupu, bučice iznad prsa, dlanovi okrenuti jedan prema drugom, laktovi blago savijeni.|Pogled prema stropu, lopatice stisnute uz klupu.|Širom otvori ruke u luku dok ne osjetiš istezanje prsa.|Vrati bučice u luku iznad prsa.', 'Savijanje u laktovima ostaje isto cijelo vrijeme.|Spuštanje 3 s.|Ne spuštaj ispod visine ramena.', 'Pretjerano spuštanje ramena.|Pretvaranje u potisak.', ['prsa'], ['ramena']],
    ['pullover', 'Dumbbell Pull Over', 'Leđa', 'srednji', 'Bučica, klupa', 'ne',
      'Lezi poprečno ili uzdužno na klupu, drži jednu bučicu objema rukama iznad prsa.|Laktovi blago savijeni, pogled prema stropu.|Polako spusti bučicu iza glave dok ne osjetiš istezanje leđa.|Povuci bučicu nazad iznad prsa snagom leđa.', 'Rebra ostaju spuštena.|Spuštanje 3 s.|Zadrži blagi pregib laktova.', 'Izvijanje donjeg dijela leđa.|Pretežak teg.', ['leđa'], ['prsa', 'triceps']],
    ['cablepullover', 'Straight-Arm Cable Pull Down', 'Leđa', 'početni', 'Kabl, šipka ili uže', 'ne',
      'Stani ispred kabla postavljenog visoko, uhvati šipku nadhvatom u širini ramena.|Lagano nagnut naprijed, ruke skoro ispružene, pogled ispred sebe.|Povuci šipku u luku prema bedrima snagom leđa.|Polako vrati do visine ramena.', 'Laktovi blago savijeni i ne mijenjaju ugao.|Povrat 3 s.|Stegni trbuh.', 'Savijanje laktova (postaje triceps vježba).|Zamah trupom.', ['leđa'], ['triceps', 'core']],
    ['cablereardelt', 'Cable Rear Delt Fly', 'Ramena', 'srednji', 'Dva kabla, ručke', 'ne',
      'Namjesti kablove u visinu ramena, uhvati ručke unakrsno.|Stani uspravno, laktovi blago savijeni.|Raširi ruke u stranu i unazad do visine ramena.|Polako vrati ruke ispred sebe.', 'Pokret iz zadnjih ramena, ne iz leđa.|Lakši teg.|Povrat 2–3 s.', 'Povlačenje laktovima daleko iza trupa.|Njihanje trupom.', ['ramena'], ['leđa']],
    ['cablefly', 'Single-Arm Cable Fly', 'Prsa', 'srednji', 'Kabl, ručka', 'ne',
      'Namjesti kabl u visinu ramena, uhvati ručku jednom rukom i okreni se bočno od sprave.|Stani u iskorak radi stabilnosti, ruka blago savijena.|Povuci ručku u luku ispred prsa prema sredini tijela.|Polako vrati do istezanja prsa. Zamijeni stranu.', 'Trup miran, bez rotacije.|Zadrži 1 s pri sastavljanju.|Povrat 3 s.', 'Rotacija trupa za više težine.|Savijanje lakta u potisak.', ['prsa'], ['ramena']],
    ['cablecurl', 'Cable Biceps Curl', 'Ruke', 'početni', 'Kabl, šipka ili uže', 'ne',
      'Stani ispred kabla postavljenog nisko, uhvati šipku podhvatom.|Laktovi uz tijelo, pogled ispred sebe.|Savij laktove i podigni šipku prema ramenima.|Polako spusti 3 s do skoro ispruženih ruku.', 'Laktovi ostaju uz tijelo.|Ne naginji se unazad.|Cijeli opseg pokreta.', 'Zamah trupom.|Podizanje ramena.', ['biceps'], ['podlaktice']],
    ['benchdip', 'Bench Dip', 'Ruke', 'srednji', 'Klupa ili stabilna stolica', 'ne',
      'Osloni dlanove na rub klupe iza sebe, stopala ispred, koljena savijena (lakše) ili noge ispružene (teže).|Pogled ravno ispred, ramena spuštena od ušiju.|Savij laktove unazad do oko 90° i spusti kukove uz klupu.|Odgurni se u početni položaj bez zaključavanja laktova.', 'Laktovi gledaju unazad, ne u stranu.|Ne spuštaj se dublje od 90° u laktu.|Ako boli rame, prekini.', 'Ramena idu naprijed i gore.|Predubok spust.', ['triceps'], ['prsa', 'ramena']],
    ['tbar', 'T-Bar Row', 'Leđa', 'srednji', 'T-bar ili šipka u uglu, ručke', 'ne',
      'Stani iznad šipke, koljena blago savijena, trup nagnut oko 45°, leđa ravna.|Pogled prema podu malo ispred sebe.|Povuci ručke prema donjem dijelu grudi, laktovi uz tijelo.|Zadrži 1 s i polako spusti 2 s.', 'Neutralna kičma cijelo vrijeme.|Ne koristi zamah kukovima.|Stisni lopatice.', 'Zaobljena leđa.|Podizanje trupa u svakom ponavljanju.', ['leđa'], ['biceps', 'zadnja ramena']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });

  const X = (id, s, r, p, o) => Object.assign({ id, s, r, fix: true, p, n: '' }, o || {});
  const SS = (id, s, r, o) => X(id, s, r, 0, Object.assign({ ss: true, n: 'Superserija: odmah poslije ove ide sljedeća vježba.' }, o || {}));
  const DS = { ds: true };

  /* HIIT: noge, gornji dio, kardio, stomak, pa isto još jednom; vrijeme ide na štoperici */
  const hiit = (ids, rad, kruga, odmor, inten) => {
    const tr = 15;
    return ids.map((id, i) => X(id, kruga, rad + ' s', i === ids.length - 1 ? odmor : tr, i === 0 ? { n: 'Intenzitet: ' + inten + '. Štoperica: pritisni ⏱ i radi ' + rad + ' s, odmor ' + tr + ' s prije sljedeće vježbe. Redoslijed: noge, gornji dio, kardio, stomak (dvaput). Cijeli krug × ' + kruga + ', pauza ' + odmor + ' s poslije zadnje vježbe.' } : {}));
  };

  const dani = {
    pocetni: [
      { naziv: 'Trening 1 · Strong Legs', vj: [X('legpress', 3, '12–15', 90), X('legext', 3, '15–20', 90), X('legcurl', 3, '12–15', 90), X('goblet', 3, '12–15', 90, { n: 'Spuštaj polako 3 s, grudi podignute.' }), X('listovi', 3, '15–20', 60)] },
      { naziv: 'Trening 2 · Back Day', vj: [X('lat', 3, '12–15', 90), X('veslanjekabl', 3, '12–15', 90), X('reversepec', 3, '15', 90), X('facepull', 2, '15', 90), SS('biceps', 2, '12–15'), X('tricepskabl', 2, '12–15', 90)] },
      { naziv: 'Trening 3 · Glutes', vj: [X('abdukcija', 3, '15–20', 90), X('kickback', 3, '12–15', 90, { n: 'Po nozi.' }), X('legpress', 3, '15', 90, { n: 'Stopala visoko na platformi, koljena prate prste.' }), X('bridge', 3, '15', 90, { n: 'Zadrži 2 s na vrhu.' }), X('gluteext', 3, '12–15', 90, { n: 'Zaobljen gornji dio leđa, stisni gluteus na vrhu.' })] },
      { naziv: 'Trening 4 · Upper Body', vj: [X('chestpress', 3, '12–15', 90), X('ramenaspr', 3, '12–15', 90), X('veslanjeoslonjeno', 2, '12–15', 90), X('bocno', 2, '15', 60), X('triceps', 2, '15', 60)] },
      { naziv: 'Trening 5 · HIIT', vj: hiit(['cucanj', 'skleknakoljenima', 'jumpingjack', 'bicycle', 'sumocucanj', 'stolicasklek', 'highknees', 'toetaps'], 30, 3, 90, 'umjeren do visok (napor 6–7 od 10)') }
    ],
    srednji: [
      { naziv: 'Trening 1 · Strong Legs', vj: [X('legpress', 3, '10–12', 120), X('cucanjsipka', 3, '8–10', 150), X('bugarski', 2, '8–10 po nozi', 120), X('rdl', 2, '10', 120), X('legext', 3, '12–15', 90, DS), X('listovi', 3, '15', 60)] },
      { naziv: 'Trening 2 · Back Day', vj: [X('lat', 3, '10–12', 120), X('veslanjekabl', 3, '10–12', 120), X('veslanje', 2, '10–12 po strani', 90), X('facepull', 3, '12–15', 90), SS('cablecurl', 2, '10–12'), X('tricepskabl', 2, '10–12', 90, DS)] },
      { naziv: 'Trening 3 · Glutes', vj: [X('hipthrust', 3, '10–12', 150, { n: 'Pauza 2–3 min.' }), X('iskorak', 2, '10 po nozi', 120), X('rdlsipka', 3, '8–10', 150), X('legcurl', 2, '12', 90), X('gluteext', 2, '12–15', 90), X('abdukcija', 2, '12–15', 90, DS)] },
      { naziv: 'Trening 4 · Upper Body', vj: [X('potisakb', 3, '8–10', 120), X('ramena', 2, '8–10', 120), X('lat', 2, '10–12', 120), X('dbfly', 2, '10–12', 90), X('bocno', 2, '12–15', 60, DS), X('hammer', 2, '10–12', 60)] },
      { naziv: 'Trening 5 · HIIT', vj: hiit(['iskorak', 'sklek', 'skaterhop', 'planka', 'curtsy', 'veslanjeguma', 'squatjacks', 'twist'], 40, 4, 75, 'visok (napor 7–8 od 10)') }
    ],
    napredni: [
      { naziv: 'Trening 1 · Strong Legs', vj: [X('cucanjsipka', 4, '5–8', 180, { n: 'Zagrijavanje: 50 % radne kilaže.' }), X('bugarski', 3, '8–10 po nozi', 150), X('rdlsipka', 3, '8', 150), X('legpress', 3, '10–12', 120, DS), X('legext', 3, '12', 90, DS), X('listovi', 3, '12–15', 60)] },
      { naziv: 'Trening 2 · Back Day', vj: [X('lat', 4, '8–10', 150), X('veslanjesipka', 3, '8', 150), X('tbar', 3, '8–10', 120), X('cablepullover', 3, '12', 90), X('facepull', 3, '15', 90, DS), SS('cablecurl', 3, '10–12'), X('tricepsrb', 3, '10–12', 90, DS)] },
      { naziv: 'Trening 3 · Glutes', vj: [X('hipthrust', 4, '6–8', 180, { n: 'Zadnja serija: zadrži 8 s na vrhu. Pauza 3–5 min.' }), X('hipthrust1', 3, '8 po nozi', 120), X('rdlsipka', 3, '8–10', 150), X('iskorakhod', 3, '10 po nozi', 120), X('legcurl', 3, '10–12', 90), X('gluteext', 3, '10–12', 90, { n: 'Uz bučicu ili kolut uz grudi.' }), X('kickback', 3, '12 po nozi', 90, DS), X('abdukcija', 2, '15', 60, DS)] },
      { naziv: 'Trening 4 · Upper Body', vj: [X('bench', 4, '6–8', 180), X('potisaksipka', 3, '8', 150), X('veslanjesipka', 3, '8', 150), X('cablefly', 2, '10–12 po strani', 90), X('bocno', 3, '12–15', 60, DS), X('tricepsrb', 2, '10–12', 60)] },
      { naziv: 'Trening 5 · HIIT', vj: hiit(['lungejump', 'diamondsklek', 'burpee', 'sklopke', 'cucanjskok', 'pikesklek', 'plankhops', 'hollow'], 45, 4, 60, 'vrlo visok (napor 8–9 od 10)') }
    ]
  };
  const prog = (id, naziv, nivo, opis, bilj) => ({
    id, naziv, opis, nivo, sedmica: 4, dana: 5, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj, dani: dani[nivo === 'početni' ? 'pocetni' : nivo]
  });
  const KOM = ['Biblioteka treninga za trenericu: dodijeli cijeli plan klijentici ili kopiraj pojedinačne treninge u njen individualni program (Uredi program, Kopiraj trening).', 'Svaka vježba ima Drop set opciju (kvačica u uređivanju programa). Klijent klikom na „Drop set" dobije objašnjenje.'];
  const NOVI = [
    prog('sab_pocetni', 'Biblioteka · Početni nivo', 'početni', 'Pet treninga: Strong Legs, Back Day, Glutes, Upper Body i HIIT. Prvo sprave, ponavljanja 12 do 20, pa lakše varijacije vježbi.', KOM.concat(['Početni nivo: 12–15 ponavljanja (do 20 za noge i gluteus), pauza oko 90 s, prvo sprave, pa jednostavne varijacije.'])),
    prog('sab_srednji', 'Biblioteka · Srednji nivo', 'srednji', 'Pet treninga: Strong Legs, Back Day, Glutes, Upper Body i HIIT. Sprave i slobodni tegovi, 8 do 12 ponavljanja, teže varijacije, drop set na izolacijama.', KOM.concat(['Srednji nivo: 8–12 ponavljanja, pauza 2 do 2,5 min na složenim vježbama.'])),
    prog('sab_napredni', 'Biblioteka · Napredni nivo', 'napredni', 'Pet treninga: Strong Legs, Back Day, Glutes, Upper Body i HIIT. Teški složeni pokreti (5 do 10 ponavljanja), jednostrane varijante i drop set.', KOM.concat(['Napredni nivo: 5–10 ponavljanja na složenim vježbama, pauza 2 do 3 min (hip thrust 3–5 min).']))
  ];
  const KEEP = ['dijastaza', 'vodic-ishrana'];
  FS.GOTOVI.splice(0, FS.GOTOVI.length, ...FS.GOTOVI.filter((g) => KEEP.includes(g.id)), ...NOVI);

  /* ---------- Drop set: objašnjenje za klijenta ---------- */
  FS.dropSetInfo = () => {
    const { h, openSheet } = FS;
    openSheet(h`<div class="eyebrow">Tehnika za zadnju seriju</div><h2 style="margin-top:2px">Drop set: šta je to?</h2>
      <p>Drop set produžava zadnju seriju vježbe: kad ne možeš više s trenutnom težinom, odmah je smanjiš i nastaviš.</p>
      <h3>Kako se radi</h3>
      <ol class="steps"><li>Zadnju seriju radiš normalnom težinom dok ne ostane 0 do 2 čista ponavljanja u rezervi.</li>
      <li>Odmah, bez pauze, smanji težinu za oko 20 do 30 % (na spravi pomjeri klin, s bučicama uzmi lakše).</li>
      <li>Radi opet dok ne možeš čisto nastaviti.</li>
      <li>Po želji ponovi još jednom. Više od dva smanjenja nije potrebno.</li></ol>
      <div class="card flat"><b>Primjer:</b> 40 kg × 10, odmah 30 kg × 8, odmah 22,5 kg × 8.</div>
      <h3>Važno</h3>
      <ul class="clean"><li>Samo na zadnjoj seriji vježbe, ne na svakoj.</li><li>Najbolje na spravama i kablu, jer je mijenjanje težine brzo i sigurno.</li><li>Tehnika mora ostati čista do zadnjeg ponavljanja.</li><li>Ne radi drop set na čučnju ili mrtvom dizanju sa šipkom.</li><li>Ako osjetiš bol, vrtoglavicu ili gubitak kontrole, prekini.</li></ul>
      <h3>Kako upisati u aplikaciju</h3>
      <p>Pritisni „+ serija" i upiši svako smanjenje kao novu seriju s manjom težinom.</p>
      <button class="btn primary block mt-s" data-act="close-sheet">Razumijem</button>`, (sh) => { const b = sh.querySelector('[data-act=close-sheet]'); if (b) b.onclick = () => FS.closeSheet(); });
  };
  document.addEventListener('click', (ev) => { const t = ev.target.closest && ev.target.closest('[data-act=dsinfo]'); if (t) { ev.preventDefault(); FS.dropSetInfo(); } });
})();
