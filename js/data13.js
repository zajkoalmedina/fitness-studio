/* Biblioteka treninga po nivoima (samo za trenericu) + Drop set + štoperica.
   Brišu se svi gotovi programi osim dijastaze (kućni program za dijastazu živi u FS.DIJASTAZA) i vodiča za ishranu. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI) return;
  const nova = [
    ['bentfly', 'Bent-Over Dumbbell Rear Delt Fly', 'Ramena', 'srednji', 'Dvije lagane bučice', 'ne',
      'Stani s koljenima blago savijenim, nagni trup naprijed s ravnim leđima, bučice vise ispod ramena, dlanovi jedan prema drugom.|Pogled prema podu ispred stopala, vrat u liniji kičme.|Raširi ruke u stranu do visine ramena, laktovi blago savijeni, lopatice se spajaju.|Polako spusti bučice 2 do 3 s.', 'Lagane bučice, bez zamaha.|Trup miran.|Zadrži 1 s na vrhu.', 'Zamah trupom.|Podizanje ramena prema ušima.', ['ramena'], ['leđa']],
    ['iskorakbuc', 'Dumbbell Reverse Lunge', 'Noge', 'srednji', 'Dvije bučice', 'ne',
      'Stani uspravno s bučicom u svakoj ruci uz tijelo, pogled ravno ispred.|Korakni jednom nogom unazad i spusti se dok oba koljena ne budu oko 90°.|Odgurni se prednjom nogom nazad u stojeći položaj.|Ponovi na istu ili naizmjenično na drugu nogu.', 'Prednje koljeno iznad stopala.|Trup uspravan, ramena opuštena.|Spuštanje 2–3 s.', 'Koljeno ide daleko preko prstiju.|Naginjanje trupa naprijed.', ['kvadriceps', 'gluteus'], ['zadnja loža']],
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

  /* Srednji nivo je tačno plan treninga br. 1 (isti redoslijed i vježbe). Početni i napredni imaju ista mjesta vježbi, samo lakšu ili težu varijaciju. */
  const LI = { 'početni': 0, srednji: 1, napredni: 2 };
  const E = (ids, o) => Object.assign({ ids }, o);
  /* r: [početni, srednji, napredni]; p: pauza; n: napomene po nivou; ds: drop set po nivou */
  const SLOT = (ids, s, r, p, n, ds, ss) => ({ ids, s, r, p, n: n || ['', '', ''], ds: ds || [0, 0, 0], ss: !!ss });
  const mk = (sl, li) => {
    const x = { id: sl.ids[li], s: sl.s, r: sl.r[li], fix: true, p: sl.ss ? 0 : sl.p[li], n: sl.n[li] || '' };
    if (sl.ss) { x.ss = true; x.n = x.n || 'Superserija: odmah poslije ove ide sljedeća vježba.'; }
    if (sl.ds[li]) x.ds = true;
    return x;
  };
  const P3 = [120, 180, 180], P3H = [150, 240, 240];
  const T = {
    donji: [
      SLOT(['goblet', 'cucanjsipka', 'frontcucanj'], 3, ['12–15', '8–16', '6–8'], P3, ['Bučica uz grudi. Zagrijavanje: prvu vježbu zagrij sa 50 % radne težine.', '8 do otkaza. Zagrijavanje: prvu vježbu zagrij sa 50 % radne težine.', 'Zagrijavanje: 50 % radne težine. Šipka ispred, laktovi visoko.']),
      SLOT(['bridge', 'hipthrust', 'hipthrust1'], 2, ['12–15', '8–10', '6–8 po nozi'], P3H, ['Zadrži 2 s na vrhu.', '10 do otkaza. Pauza 3 do 5 min.', 'Jedna noga. Pauza 3 do 5 min.']),
      SLOT(['iskorak', 'bugarski', 'bugarski'], 2, ['10–12 po nozi', '8–10', '6–8 po nozi'], P3, ['Iskorak unazad bez težine.', '10 do otkaza.', 'S bučicama u rukama.']),
      SLOT(['legext', 'legext', 'legext'], 3, ['15–20', '10–12', '8–10'], P3, ['Lagana težina, polako.', '12 do otkaza.', 'Zadnja serija drop set.'], [0, 0, 1])],
    back: [
      SLOT(['lat', 'lat', 'lat'], 3, ['12–15', '8–10', '6–8'], P3, ['Srednji hvat, polako.', '10 do otkaza.', 'Pauza 1 s dolje, povrat 3 s.']),
      SLOT(['veslanjeguma', 'veslanjekabl', 'tbar'], 2, ['12–15', '8–12', '6–8'], P3, ['Elastična guma.', '12 do otkaza.', 'T-bar veslanje.']),
      SLOT(['m_gumapull', 'facepull', 'facepull'], 3, ['12–15', '10–12', '10–12'], P3, ['Razvlačenje elastične gume.', '12 do otkaza.', 'Zadrži 1 s na kraju pokreta.'], [0, 0, 1]),
      SLOT(['reversepec', 'bentfly', 'cablereardelt'], 2, ['12–15', '10–12', '10–12'], P3, ['Na spravi, lagana težina.', 'Bučice, 12 do otkaza.', 'Na kablu, jedna pa druga ruka.'], [0, 0, 1]),
      SLOT(['biceps', 'biceps', 'cablecurl'], 3, ['12–15', '10–12', '8–10'], P3, ['Superserija s tricepsom.', 'Superserija s tricepsom, 12 do otkaza.', 'Superserija s tricepsom.'], [0, 0, 1], true),
      SLOT(['triceps', 'tricepskabl', 'tricepskabl'], 3, ['12–15', '10–12', '8–10'], [120, 120, 120], ['Elastična guma. Pauza između superserija 2 min.', 'Kanap. Pauza između superserija 2 min.', 'Kanap. Pauza između superserija 2 min.'], [0, 0, 1])],
    glute: [
      SLOT(['bridge', 'hipthrust', 'hipthrust1'], 3, ['12–15', '8–10', '6–8 po nozi'], P3H, ['Zadrži 2 s na vrhu. Pauza 3 do 5 min.', '10 do otkaza. Pauza 3 do 5 min.', 'Jedna noga. Pauza 3 do 5 min.']),
      SLOT(['klizniiskorak', 'iskorak', 'iskorakhod'], 2, ['10–12 po nozi', '6–10', '8–10 po nozi'], P3, ['Klizni iskorak, oslonac po potrebi.', '10 do otkaza.', 'Iskorak u hodu s bučicama.']),
      SLOT(['rdl', 'rdlsipka', 'jednorodl'], 2, ['12–15', '8–10', '6–8 po nozi'], P3, ['Bučice.', 'Šipka, 10 do otkaza.', 'B-Stance, jedna noga naprijed.']),
      SLOT(['legcurl', 'legcurl', 'legcurl'], 2, ['12–15', '8–12', '8–10'], P3, ['Lagana težina.', '12 do otkaza.', 'Jedna noga, spuštanje 3 s.'], [0, 0, 1]),
      SLOT(['abdgumom', 'abdukcija', 'sidelegabd'], 2, ['15–20', '10–12', '8–10'], P3, ['Mini guma.', '12 do otkaza.', 'Na kablu, po nozi.'], [0, 0, 1])],
    upper: [
      SLOT(['chestpress', 'chestpress', 'potisakb'], 3, ['12–15', '8–10', '6–8'], P3, ['Lagana težina.', '10 do otkaza.', 'Bučice na ravnoj klupi.']),
      SLOT(['cablepullover', 'pullover', 'pullover'], 2, ['12–15', '10–12', '8–10'], P3, ['Kabl, ruke ispružene.', '12 do otkaza.', 'Bučica, povrat 3 s.']),
      SLOT(['ramenaspr', 'ramena', 'potisaksipka'], 2, ['12–15', '8–10', '6–8'], P3, ['Na spravi.', 'Bučice, 10 do otkaza.', 'Šipka.']),
      SLOT(['veslanjeoslonjeno', 'veslanje', 'gorillarow'], 2, ['12–15', '8–12', '6–8 po strani'], P3, ['Oslonjeno na klupu.', '12 do otkaza.', 'Gorilla Row.']),
      SLOT(['dbfly', 'dbfly', 'cablefly'], 2, ['12–15', '10 + 15 (do pola pokreta)', '8–10 po strani'], P3, ['Lagane bučice.', '10 ponavljanja i još 15 do pola pokreta.', 'Na kablu.'], [0, 0, 1])]
  };
  const day = (naziv, arr, li) => ({ naziv, vj: arr.map((x) => mk(x, li)) });
  const dan = (li) => [
    day('Trening 1 · Strong Legs', T.donji, li), day('Trening 2 · Back Day', T.back, li),
    day('Trening 3 · Hipertrofija Glutes', T.glute, li), day('Trening 4 · Upper Body', T.upper, li)
  ];
  const dani = { pocetni: dan(0), srednji: dan(1), napredni: dan(2) };
  /* HIIT dani za kućnu biblioteku (ne ulaze u teretanske planove) */
  const H = [['cucanj', 'cucanjskok', 'lungejump'], ['skleknakoljenima', 'sklek', 'diamondsklek'], ['jumpingjack', 'skaterhop', 'burpee'], ['bicycle', 'planka', 'sklopke'],
    ['sumocucanj', 'curtsy', 'tuckjump'], ['stolicasklek', 'planksavijanje', 'pikesklek'], ['highknees', 'squatjacks', 'plankhops'], ['toetaps', 'twist', 'hollow']];
  const HP = [[30, 3, 90, 'umjeren do visok (napor 6–7 od 10)'], [40, 4, 75, 'visok (napor 7–8 od 10)'], [45, 4, 60, 'vrlo visok (napor 8–9 od 10)']];
  FS._hiit = {};
  ['pocetni', 'srednji', 'napredni'].forEach((k, li) => { FS._hiit[k] = { naziv: 'Trening 5 · HIIT', vj: hiit(H.map((a) => a[li]), HP[li][0], HP[li][1], HP[li][2], HP[li][3]) }; });
  const prog = (id, naziv, nivo, opis, bilj) => ({
    id, naziv, opis, nivo, sedmica: 4, dana: 4, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj, dani: dani[nivo === 'početni' ? 'pocetni' : nivo]
  });
  const KOM = ['Biblioteka treninga za trenericu: dodijeli cijeli plan klijentici ili kopiraj pojedinačne treninge u njen individualni program (Uredi program, Kopiraj trening).', 'Svaka vježba ima Drop set opciju (kvačica u uređivanju programa). Klijent klikom na „Drop set" dobije objašnjenje.'];
  const NOVI = [
    prog('sab_pocetni', 'Biblioteka · Početni nivo', 'početni', 'Četiri treninga: Strong Legs, Back Day, Hipertrofija Glutes i Upper Body. Prvo sprave, ponavljanja 12 do 20, pa lakše varijacije vježbi.', KOM.concat(['Početni nivo: 12–15 ponavljanja (do 20 za noge i gluteus), pauza oko 90 s, prvo sprave, pa jednostavne varijacije.'])),
    prog('sab_srednji', 'Biblioteka · Srednji nivo', 'srednji', 'Četiri treninga: Strong Legs, Back Day, Hipertrofija Glutes i Upper Body. Sprave i slobodni tegovi, 8 do 12 ponavljanja, teže varijacije, drop set na izolacijama.', KOM.concat(['Srednji nivo: 8–12 ponavljanja, pauza 2 do 2,5 min na složenim vježbama.'])),
    prog('sab_napredni', 'Biblioteka · Napredni nivo', 'napredni', 'Četiri treninga: Strong Legs, Back Day, Hipertrofija Glutes i Upper Body. Teški složeni pokreti (5 do 10 ponavljanja), jednostrane varijante i drop set.', KOM.concat(['Napredni nivo: 5–10 ponavljanja na složenim vježbama, pauza 2 do 3 min (hip thrust 3–5 min).']))
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
