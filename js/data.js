/* Statički sadržaj: vježbe, paketi, gotovi programi, program za dijastazu */
(function () {
  const FS = (window.FS = window.FS || {});

  /* dij: 'da' = pogodno za dijastazu (uz kontrolu), 'kasnije' = tek u kasnijim fazama uz odobrenje, 'ne' = izbjegavati */
  const E = (id, naziv, grupa, nivo, oprema, dij, koraci, savjeti, greske) => ({ id, naziv, grupa, nivo, oprema, dij, koraci, savjeti, greske, video: '' });

  FS.GRUPE = ['Noge', 'Gluteusi', 'Leđa', 'Prsa', 'Ramena', 'Ruke', 'Core', 'Disanje', 'Mobilnost', 'Kardio'];
  FS.NIVOI = ['početni', 'srednji', 'napredni'];
  FS.DIJ_LABEL = { da: 'Pogodno za dijastazu', kasnije: 'Tek uz odobrenje (kasnije faze)', ne: 'Izbjegavati kod dijastaze' };

  FS.EXERCISES = [
    E('cucanj', 'Čučanj tjelesnom težinom', 'Noge', 'početni', 'Bez opreme', 'kasnije',
      ['Stani u širinu ramena, prsti blago okrenuti prema van.', 'Udahni, zategni trup i spuštaj kukove unazad i dolje.', 'Spusti se dokle možeš uz ravna leđa; koljena prate smjer stopala.', 'Izdahni i odgurni se kroz cijela stopala do uspravnog stava.'],
      ['Težina je na petama i sredini stopala.', 'Grudi ostaju podignute, pogled ispred sebe.'], ['Koljena upadaju prema unutra.', 'Pete se odižu od poda.']),
    E('goblet', 'Gobletov čučanj', 'Noge', 'srednji', 'Bučica ili girja', 'kasnije',
      ['Drži bučicu uz grudi objema rukama.', 'Stani u širinu ramena, laktovi ispod bučice.', 'Spusti se u čučanj uz ravna leđa.', 'Izdahni i uspravi se.'],
      ['Teret je blizu tijela.', 'Izdisaj pri usponu, ne zadržavaj dah.'], ['Pretjerano naginjanje naprijed.', 'Prebrzo spuštanje.']),
    E('rdl', 'Rumunsko mrtvo dizanje s bučicama', 'Gluteusi', 'srednji', 'Bučice', 'kasnije',
      ['Stani uspravno, bučice ispred bedara.', 'Blago savij koljena i potiskuj kukove unazad.', 'Spuštaj bučice uz noge dok ne osjetiš istezanje u zadnjoj strani bedara.', 'Stisni gluteuse i vrati se u uspravan stav.'],
      ['Leđa su ravna kroz cijeli pokret.', 'Kretanje dolazi iz kukova, ne iz leđa.'], ['Zaobljena leđa.', 'Bučice se udaljavaju od nogu.']),
    E('iskorak', 'Iskorak unazad', 'Noge', 'srednji', 'Bez opreme ili bučice', 'kasnije',
      ['Stani uspravno, noge u širini kukova.', 'Zakorači jednom nogom unazad.', 'Spusti stražnje koljeno prema podu, prednje koljeno iznad stopala.', 'Odgurni se prednjom nogom i vrati se na početak.'],
      ['Trup je uspravan.', 'Po potrebi se pridrži za stabilan oslonac.'], ['Prednje koljeno ide daleko ispred stopala.', 'Gubi se ravnoteža.']),
    E('bridge', 'Podizanje kukova (glute bridge)', 'Gluteusi', 'početni', 'Bez opreme', 'da',
      ['Lezi na leđa, koljena savijena, stopala na podu u širini kukova.', 'Izdahni, blago zategni trbuh i podigni kukove.', 'Na vrhu stisni gluteuse, bez prevelikog luka u donjem dijelu leđa.', 'Polako spusti kukove na pod.'],
      ['Gurni kroz pete.', 'Trbuh ostaje blago aktivan, bez ispupčenja po sredini.'], ['Pretjeran luk u leđima.', 'Zadržavanje daha.']),
    E('hipthrust', 'Hip thrust uz klupu', 'Gluteusi', 'srednji', 'Klupa, bučica ili šipka', 'kasnije',
      ['Osloni gornji dio leđa na klupu, stopala na podu.', 'Postavi teret na kukove.', 'Izdahni i podigni kukove do ravne linije koljena–kukovi–ramena.', 'Spusti kontrolisano.'],
      ['Brada ostaje blizu grudi.', 'Zaustavi se na vrhu 1 sekundu.'], ['Prevelik luk u leđima.', 'Stopala preblizu ili predaleko.']),
    E('sidelift', 'Bočno podizanje noge (ležeći)', 'Gluteusi', 'početni', 'Bez opreme ili mini-guma', 'da',
      ['Lezi na bok, donja noga blago savijena.', 'Gornju nogu drži ispruženom, stopalo paralelno s podom.', 'Podigni nogu bez okretanja kukova.', 'Polako spusti.'],
      ['Kukovi su naslagani jedan iznad drugog.', 'Pokret je spor i kontrolisan.'], ['Kukovi se rotiraju unazad.', 'Zamahivanje nogom.']),
    E('veslanje', 'Veslanje jednom bučicom', 'Leđa', 'srednji', 'Bučica i klupa', 'kasnije',
      ['Osloni koljeno i ruku na klupu, leđa ravna.', 'Bučicu drži ispod ramena.', 'Povuci lakat prema kuku, stišćući lopatice.', 'Spusti polako do pune ispruženosti.'],
      ['Povlači lakat, ne ruku.', 'Trup miran.'], ['Rotiranje trupa.', 'Podizanje ramena prema ušima.']),
    E('lat', 'Povlačenje na lat spravi', 'Leđa', 'početni', 'Lat sprava', 'kasnije',
      ['Sjedni i podesi jastučiće preko bedara.', 'Uhvati šipku nešto šire od ramena.', 'Povuci šipku do ključnih kostiju, laktovi prema dolje.', 'Polako vrati uz kontrolu.'],
      ['Grudi lagano podignute.', 'Ne ljuljaj se trupom.'], ['Povlačenje iza glave.', 'Prevelik zamah.']),
    E('sklekzid', 'Sklekovi uz zid', 'Prsa', 'početni', 'Zid', 'kasnije',
      ['Stani na dužinu ruke od zida, dlanovi u visini ramena.', 'Savij laktove i približi grudi zidu.', 'Odgurni se do ispruženih ruku.', 'Tijelo ostaje u ravnoj liniji.'],
      ['Laktovi pod uglom oko 45° od tijela.', 'Izdahni pri odgurivanju.'], ['Trbuh se ispupči ili kukovi propadaju.', 'Glava naprijed.']),
    E('potisakb', 'Potisak bučicama (ravna klupa)', 'Prsa', 'srednji', 'Bučice, klupa', 'kasnije',
      ['Lezi na klupu, bučice iznad grudi.', 'Spusti bučice do visine grudi uz laktove oko 45°.', 'Potisni gore uz izdah.', 'Zadrži lopatice stisnute o klupu.'],
      ['Stopala čvrsto na podu.', 'Ne zadržavaj dah.'], ['Laktovi previše razmaknuti.', 'Podizanje kukova s klupe.']),
    E('ramena', 'Potisak bučicama iznad glave', 'Ramena', 'srednji', 'Bučice', 'kasnije',
      ['Sjedni ili stani, bučice u visini ramena.', 'Zategni trup i potisni bučice iznad glave.', 'Spusti polako do visine ušiju.', 'Ne preteruj s lukom u donjem dijelu leđa.'],
      ['Izdahni pri potisku.', 'Počni lakšim teretom.'], ['Pretjeran luk u leđima.', 'Prebrz tempo.']),
    E('bocno', 'Bočno podizanje bučicama', 'Ramena', 'početni', 'Bučice', 'kasnije',
      ['Stani uspravno, bučice uz tijelo.', 'Blago savij laktove.', 'Podigni ruke u stranu do visine ramena.', 'Polako spusti.'],
      ['Koristi lagani teret.', 'Ramena ostaju spuštena.'], ['Zamahivanje trupom.', 'Dizanje iznad visine ramena.']),
    E('biceps', 'Pregib bučicama (biceps)', 'Ruke', 'početni', 'Bučice', 'kasnije',
      ['Stani uspravno, bučice uz tijelo, dlanovi naprijed.', 'Savij laktove i podigni bučice prema ramenima.', 'Kratko zadrži na vrhu.', 'Polako spusti.'],
      ['Laktovi uz tijelo.', 'Bez zamaha.'], ['Ljuljanje trupa.', 'Prebrz povratak.']),
    E('triceps', 'Triceps s elastičnom gumom', 'Ruke', 'početni', 'Elastična guma', 'kasnije',
      ['Pričvrsti gumu u visini glave ili iznad.', 'Laktovi uz tijelo, savij ih do 90°.', 'Ispruži ruke prema dolje.', 'Polako vrati.'],
      ['Laktovi se ne pomjeraju.', 'Trup miran.'], ['Širenje laktova.', 'Naginjanje trupa.']),
    E('disanje', 'Dijafragmalno disanje', 'Disanje', 'početni', 'Bez opreme', 'da',
      ['Lezi na leđa, koljena savijena, jedna ruka na prsima, druga na trbuhu.', 'Udahni nosom i pusti rebra da se šire u stranu i prema nazad.', 'Izdahni polako na usta, blago približavajući rebra.', 'Opusti vrat i ramena.'],
      ['Pokret dolazi iz rebara i dijafragme, ne iz ramena.', 'Izdisaj traje duže od udisaja.'], ['Podizanje ramena pri udahu.', 'Gurkanje trbuha prema van uz napor.']),
    E('krokodil', 'Krokodilsko disanje', 'Disanje', 'početni', 'Bez opreme', 'da',
      ['Lezi na stomak, savij ruke i položi čelo na nadlanice. Noge opuštene, u širini kukova.', 'Udahni na nos i usmjeri dah u donji dio trbuha i rebra prema nazad, tako da osjetiš kako te dah lagano podiže od poda.', 'Izdahni polako na usta, trbuh se spušta, a rebra se vraćaju.', 'Ponavljaj mirno, bez forsiranja, 8 do 10 udisaja.'],
      ['Ramena i vrat su opušteni.', 'Dah širi rebra u stranu i prema leđima, a ne podiže ramena.', 'Izdisaj je duži od udisaja.'], ['Podizanje ramena pri udahu.', 'Prebrzo i plitko disanje.', 'Zadržavanje daha.']),
    E('vakuum', 'Vakuum (stomach vacuum)', 'Core', 'srednji', 'Bez opreme', 'kasnije',
      ['Stani na sve četiri ili lezi na leđa s koljenima savijenim. Početnicama je lakše na sve četiri.', 'Udahni nosom, a zatim potpuno izdahni na usta, do kraja.', 'Bez udaha uvuci trbuh prema kičmi i prema gore ispod rebara, kao da zatvaraš patent do grudi.', 'Zadrži 5 do 10 sekundi, pa opusti trbuh i normalno udahni.'],
      ['Počni sa 5 sekundi i povećavaj postepeno.', 'Vježbaj na prazan stomak, najbolje ujutro.', 'Pazi da se po sredini trbuha ne pojavi greben ili kupola.'], ['Podizanje ramena i naprezanje vrata.', 'Zadržavanje daha predugo, do vrtoglavice.', 'Guranje trbuha prema van kad se opusti.']),
    E('tva', 'Aktivacija poprečnog trbušnog mišića', 'Core', 'početni', 'Bez opreme', 'da',
      ['Lezi na leđa, koljena savijena.', 'Udahni, a pri izdahu blago „skupi“ donji dio trbuha prema kičmi, kao da zatvaraš patent.', 'Zadrži 3–5 sekundi uz normalno disanje.', 'Opusti i ponovi.'],
      ['Kontrakcija je blaga (oko 30 %).', 'Pazi da se po sredini trbuha ne pojavi ispupčenje.'], ['Uvlačenje trbuha do maksimuma.', 'Zadržavanje daha.']),
    E('zdjelica', 'Naginjanje zdjelice', 'Core', 'početni', 'Bez opreme', 'da',
      ['Lezi na leđa, koljena savijena.', 'Izdahni i blago spljošti donji dio leđa o pod.', 'Udahni i vrati u neutralan položaj.', 'Pokret je mali i kontrolisan.'],
      ['Pokret izvodi zdjelica, ne noge.', 'Glatko disanje.'], ['Guranje stopalima.', 'Podizanje kukova s poda.']),
    E('heel', 'Klizanje pete (heel slide)', 'Core', 'početni', 'Bez opreme', 'da',
      ['Lezi na leđa, koljena savijena, blago aktiviraj trbuh.', 'Izdahni i polako klizi jednom petom naprijed.', 'Zaustavi se prije nego se zdjelica počne ljuljati.', 'Udahni i vrati petu.'],
      ['Zdjelica miruje.', 'Pokret je spor.'], ['Zdjelica se okreće.', 'Trbuh se ispupči po sredini.']),
    E('birddog', 'Ptica-pas (bird dog)', 'Core', 'početni', 'Bez opreme', 'da',
      ['Postavi se na sve četiri, ruke ispod ramena, koljena ispod kukova.', 'Blago aktiviraj trbuh i izdahni.', 'Ispruži suprotnu ruku i nogu bez rotacije trupa.', 'Vrati i promijeni stranu.'],
      ['Zamisli čašu vode na leđima.', 'Počni samo s nogama ili samo s rukama ako je teško.'], ['Ljuljanje kukova.', 'Spuštanje stomaka prema podu.']),
    E('deadbug', 'Mrtvi kukac (dead bug) – modifikovan', 'Core', 'srednji', 'Bez opreme', 'kasnije',
      ['Lezi na leđa, koljena savijena iznad kukova, ruke prema stropu.', 'Izdahni i polako spusti jedno stopalo prema podu (koljeno ostaje savijeno).', 'Zadrži donji dio leđa stabilnim.', 'Vrati i promijeni stranu.'],
      ['Ako se trbuh ispupči, smanji raspon pokreta.', 'Polako i uz kontrolu.'], ['Luk u donjem dijelu leđa.', 'Brzina.']),
    E('mackakrava', 'Mačka–krava', 'Mobilnost', 'početni', 'Bez opreme', 'da',
      ['Na sve četiri, dlanovi ispod ramena.', 'Izdahni i zaobli leđa prema stropu.', 'Udahni i spusti stomak, podigni prsni koš.', 'Pokretaj kičmu polako.'],
      ['Ne forsiraj raspon pokreta.', 'Prati disanje.'], ['Prebrz tempo.']),
    E('hodanje', 'Brzo hodanje', 'Kardio', 'početni', 'Bez opreme', 'da',
      ['Hodaj tempom pri kojem možeš razgovarati, ali ti je disanje ubrzano.', 'Ruke se prirodno njišu.', 'Drži uspravan stav.'],
      ['Počni s 10–15 minuta.', 'Povećavaj trajanje postepeno.'], ['Pretjerano naginjanje naprijed.']),
    E('planka', 'Planka', 'Core', 'srednji', 'Bez opreme', 'ne',
      ['Osloni se na podlaktice i prste stopala.', 'Tijelo u ravnoj liniji od glave do pete.', 'Zadrži uz normalno disanje.'],
      ['Kod dijastaze se u početku izbjegava jer povećava pritisak na središnju liniju trbuha.'], ['Spuštanje kukova.', 'Zadržavanje daha.']),
    E('crunch', 'Trbušnjaci (crunch)', 'Core', 'početni', 'Bez opreme', 'ne',
      ['Lezi na leđa, koljena savijena.', 'Podigni ramena od poda prema koljenima.', 'Spusti polako.'],
      ['Kod dijastaze se izbjegava jer razdvaja trbušne mišiće i stvara ispupčenje.'], ['Povlačenje vrata rukama.']),
    E('twist', 'Uvijanja trupa (russian twist)', 'Core', 'srednji', 'Bez opreme ili lopta', 'ne',
      ['Sjedni, nagni trup unazad, noge blago podignute.', 'Rotiraj trup lijevo-desno.'],
      ['Kod dijastaze se izbjegava zbog opterećenja kosih trbušnih mišića i pritiska.'], ['Zaokruživanje leđa.'])
  ];

  const ex = (id, s, r, n) => ({ id, s, r, n: n || '' });

  /* ---------- paketi ---------- */
  FS.PAKETI = [
    { id: 'START', cijena: 110, sedmicno: 2 },
    { id: 'ACTIVE', cijena: 135, sedmicno: 3 },
    { id: 'STRONG', cijena: 160, sedmicno: 4 }
  ];
  FS.PAKET_UKLJUCUJE = ['Individualni četverosedmični program', 'Videoobjašnjenja vježbi', 'Sedmičnu provjeru napretka', 'Korekcije programa prema potrebi', 'Smjernice za ishranu i recepte', 'Podršku putem poruka u dogovorenom vremenu'];
  FS.PERSONALNI = {
    individualni: [{ n: '8 treninga mjesečno', s: '2× sedmično', c: 240 }, { n: '12 treninga mjesečno', s: '3× sedmično', c: 360 }, { n: '16 treninga mjesečno', s: '4× sedmično', c: 480 }],
    poluindividualni: { tip: '2 na 1', c8: 192, c12: 288 },
    ukljuceno: ['Stručno vođeni treninzi prilagođeni ciljevima i mogućnostima', 'Praćenje napretka i prilagođavanje treninga', 'Smjernice za ishranu s receptima i kalorijskim vrijednostima', 'Podrška i komunikacija tokom cijelog perioda']
  };

  /* ---------- gotovi programi (prodaja) ---------- */
  FS.GOTOVI = [
    { id: 'fullbody', naziv: 'Fullbody za početnice', opis: 'Četiri sedmice uvoda u trening snage: tri dana, jednostavne vježbe, jasan napredak.', nivo: 'početni', sedmica: 4, dana: 3, cijena: 49, tip: 'gotov', uShopu: true,
      dani: [
        { naziv: 'Dan A', vj: [ex('cucanj', 3, '12'), ex('veslanje', 3, '10 po strani'), ex('bridge', 3, '15'), ex('bocno', 2, '12'), ex('tva', 3, '10 × 5 s')] },
        { naziv: 'Dan B', vj: [ex('iskorak', 3, '10 po nozi'), ex('sklekzid', 3, '10'), ex('rdl', 3, '10'), ex('biceps', 2, '12'), ex('hodanje', 1, '15 min')] },
        { naziv: 'Dan C', vj: [ex('goblet', 3, '10'), ex('lat', 3, '12'), ex('hipthrust', 3, '12'), ex('triceps', 2, '12'), ex('deadbug', 3, '8 po strani')] }] },
    { id: 'gluteus', naziv: 'Gluteus – 6 sedmica', opis: 'Fokus na gluteuse i noge, progresivno opterećenje kroz šest sedmica.', nivo: 'srednji', sedmica: 6, dana: 3, cijena: 59, tip: 'gotov', uShopu: true,
      dani: [
        { naziv: 'Dan A', vj: [ex('hipthrust', 4, '10'), ex('rdl', 3, '10'), ex('iskorak', 3, '10 po nozi'), ex('sidelift', 3, '15 po strani'), ex('bridge', 2, '15')] },
        { naziv: 'Dan B', vj: [ex('goblet', 4, '10'), ex('hipthrust', 3, '12'), ex('rdl', 3, '12'), ex('sidelift', 3, '20 po strani'), ex('hodanje', 1, '20 min')] },
        { naziv: 'Dan C', vj: [ex('iskorak', 4, '8 po nozi'), ex('rdl', 4, '8'), ex('hipthrust', 4, '8'), ex('bridge', 3, '20'), ex('mackakrava', 2, '10')] }] },
    { id: 'kuca', naziv: 'Kućni trening bez opreme', opis: 'Šest sedmica treninga kod kuće, bez ikakve opreme.', nivo: 'početni', sedmica: 6, dana: 3, cijena: 39, tip: 'gotov', uShopu: true,
      dani: [
        { naziv: 'Dan A', vj: [ex('cucanj', 3, '15'), ex('bridge', 3, '15'), ex('sklekzid', 3, '12'), ex('birddog', 3, '8 po strani'), ex('hodanje', 1, '15 min')] },
        { naziv: 'Dan B', vj: [ex('iskorak', 3, '12 po nozi'), ex('sidelift', 3, '15 po strani'), ex('mackakrava', 2, '10'), ex('deadbug', 3, '8 po strani')] },
        { naziv: 'Dan C', vj: [ex('cucanj', 4, '12'), ex('bridge', 4, '12'), ex('sklekzid', 3, '10'), ex('tva', 3, '10 × 5 s'), ex('hodanje', 1, '20 min')] }] }
  ];

  /* ---------- kućni program za dijastazu (4 faze) ---------- */
  FS.DIJASTAZA = {
    id: 'dijastaza', naziv: 'Kućni program za dijastazu',
    faze: [
      { naziv: 'Faza 1 – Disanje i temelji', sedmice: '1.–2. sedmica', dana: '3–4 puta sedmično, 10–15 min',
        cilj: 'Naučiti dubinsko disanje, blagu aktivaciju dubokog trbušnog mišića i kontrolu zdjelice.',
        dani: [{ naziv: 'Trening', vj: [ex('disanje', 2, '8 udisaja'), ex('krokodil', 2, '8 udisaja'), ex('tva', 3, '8 × 5 s'), ex('zdjelica', 2, '10'), ex('heel', 2, '8 po nozi'), ex('hodanje', 1, '10–15 min')] }] },
      { naziv: 'Faza 2 – Stabilnost', sedmice: '3.–4. sedmica', dana: '3 puta sedmično, 15–20 min',
        cilj: 'Dodati stabilnost trupa i gluteuse uz zadržanu kontrolu središnje linije trbuha.',
        dani: [{ naziv: 'Trening', vj: [ex('disanje', 1, '8 udisaja'), ex('tva', 2, '8 × 5 s'), ex('bridge', 3, '12'), ex('sidelift', 2, '12 po strani'), ex('mackakrava', 2, '10'), ex('birddog', 2, '6 po strani'), ex('hodanje', 1, '15–20 min')] }] },
      { naziv: 'Faza 3 – Snaga', sedmice: '5.–6. sedmica', dana: '3 puta sedmično, 20–30 min',
        cilj: 'Uvesti osnovne obrasce snage (čučanj, veslanje) uz izdisaj pri naporu.',
        dani: [{ naziv: 'Trening', vj: [ex('tva', 2, '8 × 5 s'), ex('cucanj', 3, '10', 'izdahni pri usponu'), ex('bridge', 3, '15'), ex('veslanje', 3, '10 po strani', 'lagan teret'), ex('deadbug', 2, '6 po strani', 'smanji raspon ako se pojavi ispupčenje'), ex('vakuum', 3, '5 × 10 s', 'tek uz odobrenje ljekara ili fizioterapeuta'), ex('hodanje', 1, '20 min')] }] },
      { naziv: 'Faza 4 – Funkcionalna snaga', sedmice: '7.–8. sedmica', dana: '3 puta sedmično, 30 min',
        cilj: 'Povratak složenijim vježbama uz stalnu kontrolu i praćenje znakova upozorenja.',
        dani: [{ naziv: 'Trening', vj: [ex('goblet', 3, '10', 'lagan teret'), ex('rdl', 3, '10', 'lagan teret'), ex('veslanje', 3, '10 po strani'), ex('sklekzid', 3, '10'), ex('birddog', 3, '8 po strani'), ex('hodanje', 1, '20–30 min')] }] }
    ],
    prijeStarta: [
      'Prije početka obavezno se javi ljekaru ili fizioterapeutu (pelvic floor) da ti potvrdi da možeš početi vježbati i procijeni razmak između trbušnih mišića.',
      'Nakon porođaja vježbanje se obično počinje tek nakon ljekarskog pregleda; carski rez zahtijeva dodatnu pažnju.',
      'Ovaj program je opšti vodič i ne zamjenjuje medicinski savjet niti dijagnozu.'
    ],
    stop: [
      'Po sredini trbuha se pojavi greben ili ispupčenje (u obliku kupole ili „šatora“).',
      'Osjetiš bol u trbuhu, leđima, zdjelici ili preponama.',
      'Dođe do nehotičnog curenja urina ili osjećaja težine u zdjelici.',
      'Pojave se nova krvarenja, vrtoglavica ili neobičan umor.'
    ],
    izbjegavaj: ['Trbušnjake (crunch) i podizanje oba koljena ili ispruženih nogu', 'Plank i slične vježbe uz zadržavanje daha', 'Uvijanja trupa (russian twist, „bicikl“)', 'Teške terete uz zadržavanje daha i naprezanje', 'Duboke pregibe unazad (cobra, wheel)'],
    samotest: [
      'Lezi na leđa, koljena savijena, stopala na podu.',
      'Postavi prste (dlan prema tijelu) iznad pupka, a drugu ruku iza glave.',
      'Izdahni i blago podigni glavu i ramena nekoliko centimetara.',
      'Osjeti koliko prstiju stane u razmak između mišića i je li razmak dubok. Ponovi iznad i ispod pupka.',
      'Ovo je samo orijentacija – tačnu procjenu radi ljekar ili fizioterapeut.'
    ],
    napredovanje: 'Na sljedeću fazu prelazi kada bez bola i bez ispupčenja možeš izvesti sve vježbe uz kontrolu disanja, u dogovoru s trenericom ili fizioterapeutom. Ako ti je teško, ostani u istoj fazi koliko god treba.'
  };

  /* ---------- pretvarači / traženje ---------- */
  FS.byEx = (id, extra) => (FS.EXERCISES.concat(extra || [])).find((e) => e.id === id);
})();
