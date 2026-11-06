/* Upper / Lower za početnike, 4x sedmično (teretana): svaki trening zasebno u biblioteci. Good morning zamijenjen Dumbbell Romanian Deadlift. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => /ulpoc/.test(g.id))) return;
  const nova = [
    ['pullup', 'Wide-Grip Pull Up', 'Leđa', 'srednji', 'Vratilo (šipka za zgib), po potrebi sprava s asistencijom', 'ne',
      'Uhvati vratilo širokim hvatom (šire od ramena), dlanovi gledaju od tebe, i visi s ispruženim rukama.|Lopatice povuci dolje i prema kičmi, noge ukrsti iza sebe, pogled ravno ispred.|Povuci laktove prema rebrima dok brada ne pređe nivo vratila.|Polako se spusti do potpuno ispruženih ruku, 3 s.', 'Počni pokret povlačenjem lopatica, pa tek onda ruku.|Ako ne možeš, koristi spravu s asistencijom ili Lat pulldown.|Bez ljuljanja nogama.', 'Zamah tijelom.|Nepotpuno spuštanje.|Podizanje ramena prema ušima.', ['leđa'], ['biceps', 'podlaktice']],
    ['splitsquat', 'Dumbbell Split Squat', 'Noge', 'početni', 'Dvije bučice', 'ne',
      'Stani u raskorak, jedna noga ispred, druga iza na prstima, bučice uz tijelo.|Trup uspravan, pogled ravno ispred, stopala u širini kukova (ne na jednoj liniji).|Spusti se ravno dolje dok zadnje koljeno ne bude tik iznad poda, prednje oko 90°.|Odgurni se prednjom petom do početnog položaja. Završi sve serije, pa zamijeni nogu.', 'Težina ostaje na prednjoj nozi.|Spuštanje 2 s.|Koljeno prati smjer stopala.', 'Prednje koljeno ide unutra.|Naginjanje trupa naprijed.|Prekratak raskorak.', ['noge', 'gluteus'], ['core']],
    ['preachercurl', 'Preacher Curl', 'Ruke', 'početni', 'Klupa za biceps (Scott), EZ šipka ili bučice', 'ne',
      'Sjedni uz klupu, nadlaktice položi na jastuk, hvat u širini ramena.|Prsa naslonjena na jastuk, pogled prema ispred.|Savij laktove i podigni težinu prema ramenima.|Polako spusti 3 s do skoro potpuno ispruženih ruku.', 'Ne zabacuj ramena.|Ne izdižu se laktovi s jastuka.|Spuštaj kontrolisano.', 'Zamah trupom.|Potpuno zaključavanje lakata na dnu s pretjeranim teretom.', ['biceps'], ['podlaktice']],
    ['skullcrusher', 'Skull Crusher (EZ-Bar)', 'Ruke', 'početni', 'EZ šipka ili bučice, klupa', 'ne',
      'Lezi na klupu, EZ šipka iznad grudi, ruke ispružene, hvat u širini ramena.|Nadlaktice ostaju okomite, laktovi gledaju prema stropu.|Savijanjem lakata spusti šipku prema čelu ili malo iza glave, 2–3 s.|Ispruži ruke do početnog položaja, bez zaključavanja lakata.', 'Laktovi ne idu u stranu.|Lakši teg, strogo izvođenje.|Šipku spuštaj iza čela, ne na lice.', 'Pomjeranje nadlaktica.|Pretežak teg.', ['triceps'], ['ramena']],
    ['inclinerow', 'Chest-Supported Barbell Row (Incline Bench)', 'Leđa', 'početni', 'Kosa klupa, šipka', 'ne',
      'Lezi potrbuške na kosu klupu (oko 30 do 45°), prsa na naslonu, stopala čvrsto na podu.|Uhvati šipku hvatom malo širim od ramena, ruke ispružene, pogled prema podu.|Povuci šipku prema donjem dijelu grudi, laktovi uz tijelo, spoji lopatice.|Zadrži 1 s, polako spusti 2 s do ispruženih ruku.', 'Prsa ostaju na klupi.|Ne podiži glavu.|Povlačenje počinje lopaticama.', 'Odizanje prsa s klupe.|Zamah.|Trzaj rukama bez kontrole.', ['leđa'], ['biceps', 'zadnja ramena']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });
  const X = (id, s, r, p, n) => ({ id, s, r, fix: true, p, n: n || '' });
  const dani = [
    ['gornji', { naziv: 'Upper 1', vj: [X('bench', 3, '5', 150, 'Šipka.'), X('veslanjesipka', 3, '5', 150, 'Veslanje u pretklonu sa šipkom.'), X('kosibucice', 3, '8', 120, 'Kosi bench press sa bučicama.'), X('pullup', 3, '8', 120, 'Zgib, široki hvat.'), X('bocno', 3, '15', 90, 'Letenje za ramena sa bučicama.')] }],
    ['donji', { naziv: 'Lower 1', vj: [X('frontcucanj', 3, '5', 150, 'Prednji čučanj.'), X('rdl', 3, '5', 150, 'Rumunsko mrtvo dizanje s bučicama (umjesto good morning).'), X('splitsquat', 3, '8', 120, 'Split squat sa bučicama.'), X('listovi', 3, '12', 90)] }],
    ['gornji', { naziv: 'Upper 2', vj: [X('potisakb', 3, '10', 90, 'Bench press na ravnoj klupi sa bučicama.'), X('inclinerow', 3, '10', 90, 'Veslanje na kosoj klupi sa šipkom za leđa.'), X('ramena', 2, '10', 90, 'Potisak sjedeći sa bučicama za ramena.'), X('lat', 2, '10', 90, 'Lat mašina, vučenje.'), X('preachercurl', 3, '10', 90, 'Biceps skot.'), X('skullcrusher', 3, '10', 90, 'Triceps potisak sa čela.')] }],
    ['donji', { naziv: 'Lower 2', vj: [X('deadlift', 3, '8', 150), X('legpress', 3, '8', 120), X('legext', 3, '12', 90, 'Ekstenzija na mašini, jedna noga pa druga.'), X('legcurl', 3, '12', 90, 'Fleksija zadnje lože na mašini, ležeći.')] }]
  ];
  const KN = { donji: 'Donji dio tijela', gornji: 'Gornji dio tijela' };
  FS.GOTOVI.push(...dani.map(([kat, d], i) => ({
    id: 'k_teretana_' + kat + '_ulpoc_' + i, naziv: 'Teretana · ' + KN[kat] + ' · ' + d.naziv + ' · Početni · Upper/Lower 4x',
    opis: 'Upper/Lower za početnike, 4x sedmično: ' + d.naziv + '. Prve 4 sedmice drži isti broj serija, zatim dodaj po jednu seriju, pa još jedan ciklus, pa deload.',
    nivo: 'početni', mj: 'teretana', kat, sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Prve 4 sedmice drži taj broj serija, poslije možeš povećati broj serija za po jednu, pa opet jedan ciklus, pa deload.', 'Za teške serije od 5 ponavljanja koristi težinu s kojom ostaje 1 do 2 ponavljanja u rezervi.'], dani: [d]
  })));
})();
