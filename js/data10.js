/* Videi vježbi koje je snimila trenerica (u mapi videos/). Imaju prednost nad starim ručno učitanim videima. */
(function () {
  const FS = window.FS;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['bocnaplankabasic', 'Side Plank', 'Core', 'srednji', 'Bez opreme', 'ne',
      'Leži na bok, osloni se na podlakticu ili dlan ispod ramena.|Podigni kukove tako da tijelo bude u ravnoj liniji.|Gornju ruku podigni prema stropu, pogled naprijed.|Zadrži položaj, zatim promijeni stranu.',
      'Počni na koljenu ako je pretežak.|Stisni trbuh i gluteuse.', 'Propadanje kukova.|Rotiranje trupa prema naprijed.', null, ['kosi trbušni mišići', 'core'], ['ramena', 'gluteus']],
    ['gorillarow', 'Gorilla Row', 'Leđa', 'srednji', 'Dvije girje ili bučice', 'ne',
      'Stani nad dvije girje, stopala šire od kukova.|Savij kukove i ravna leđa, uhvati obje girje.|Povuci jednu girju laktom prema kuku, a drugu ostavi na podu.|Spusti je i povuci drugu, naizmjenično.',
      'Leđa ravna, trup gotovo paralelan s podom.|Povlači laktom prema kuku, ne rukom.|Kukove ne okreći.', 'Zaobljena leđa.|Zamah trupom.|Podizanje ramena prema ušima.', null, ['široki leđni mišić', 'srednji dio leđa'], ['biceps', 'zadnja loža']],
    ['rdlkickstand', 'Romanian Deadlift – Kickstand (Kettlebell)', 'Gluteusi', 'srednji', 'Girja ili bučica', 'ne',
      'Stani u raskoračni stav: prednje stopalo cijelo na podu, zadnje samo na prstima, malo iza.|Girju drži uz prednju nogu, savij kukove i potisni ih unazad.|Spuštaj girju uz nogu uz ravna leđa, osjeti istezanje zadnje lože prednje noge.|Stisni gluteus prednje noge i uspravi se. Zatim zamijeni stranu.',
      'Teret nosi prednja noga, zadnja je samo oslonac za ravnotežu.|Koljeno prednje noge blago savijeno.|Leđa ravna, pogled prema podu.', 'Previše težine na zadnjoj nozi.|Zaobljena leđa.|Okretanje kukova.', null, ['zadnja loža', 'gluteus'], ['donja leđa']],
    ['skleknakoljenima', 'Knee Push Up', 'Prsa', 'početni', 'Bez opreme', 'kasnije',
      'Klekni, dlanovi na podu malo šire od ramena, tijelo u liniji od koljena do glave.|Stegni trbuh i gluteus, pogled malo ispred dlanova.|Savij laktove i spusti grudi prema podu.|Odgurni se i ispruži ruke, bez propadanja kukova.',
      'Laktovi idu pod uglom od oko 45° od tijela.|Disanje: udahni dolje, izdahni dok se odgurneš.|Kad postane lako, pređi na običan sklek.', 'Propadanje kukova ili izbacivanje zadnjice.|Laktovi širom od tijela.|Spuštanje samo napola.', null, ['grudi', 'triceps'], ['ramena', 'core']],
    ['goodmorningbw', 'Good Morning (Bodyweight)', 'Gluteusi', 'početni', 'Bez opreme', 'ne',
      'Stani u širini kukova, koljena blago savijena, ruke iza glave.|Potisni kukove unazad uz ravna leđa i nagni trup naprijed.|Spusti trup do paralele s podom ili dokle ide bez zaokruživanja leđa.|Stisni gluteuse i uspravi se.',
      'Pokret ide iz kukova, ne iz leđa.|Pogled prema dolje, vrat u liniji s kičmom.', 'Zaobljena leđa.|Previše savijena koljena (postaje čučanj).', null, ['zadnja loža', 'gluteus'], ['donja leđa']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, pose, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
    FS.EXTRA_POSES[id] = pose; FS.EXTRA_MUSKUL[id] = { p: prim, s: sec };
  });
  FS.VIDEOS = { bugarski: 'videos/bugarski.mp4', iskorak: 'videos/iskorak.mp4', iskorakhod: 'videos/iskorakhod.mp4', farmer: 'videos/farmer.mp4', sklek: 'videos/sklek.mp4', skleknakoljenima: 'videos/skleknakoljenima.mp4', stolicasklek: 'videos/sklekincline.mp4', cucanj: 'videos/cucanj.mp4', goblet: 'videos/goblet.mp4', jednorodl: 'videos/jednorodl.mp4', rdl: 'videos/rdl.mp4', kbswing: 'videos/kbswing.mp4', rdlkickstand: 'videos/rdlkickstand.mp4', gorillarow: 'videos/gorillarow.mp4',  legpress: 'videos/legpress.mp4', lateralnilunge: 'videos/bocniiskorak.mp4', stepup: 'videos/stepup.mp4', bocnaplankabasic: 'videos/bocnaplanka.mp4', goodmorningbw: 'videos/goodmorningbw.mp4' };
  /* vježbe koje je trenerica sama dodala u aplikaciji: video se veže po nazivu */
  /* vježbe koje trenerica sama doda: video se veže i ako naziv samo sadrži ovaj izraz */
  FS.VIDEOS_SADRZI = [['clean and press', 'videos/kbcleanpress.mp4'], ['incline push', 'videos/sklekincline.mp4'], ['incline sklek', 'videos/sklekincline.mp4']];
  FS.VIDEOS_NAZIV = { 'single leg press': 'videos/legpress1.mp4', 'kb clean and press – nabačaj i potisak girje': 'videos/kbcleanpress.mp4', 'kb clean and press - nabačaj i potisak girje': 'videos/kbcleanpress.mp4' };
})();
