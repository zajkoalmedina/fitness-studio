/* Videi vježbi koje je snimila trenerica (u mapi videos/). Imaju prednost nad starim ručno učitanim videima. */
(function () {
  const FS = window.FS;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['bocnaplankabasic', 'Bočni plank (side plank)', 'Core', 'srednji', 'Bez opreme', 'ne',
      'Leži na bok, osloni se na podlakticu ili dlan ispod ramena.|Podigni kukove tako da tijelo bude u ravnoj liniji.|Gornju ruku podigni prema stropu, pogled naprijed.|Zadrži položaj, zatim promijeni stranu.',
      'Počni na koljenu ako je pretežak.|Stisni trbuh i gluteuse.', 'Propadanje kukova.|Rotiranje trupa prema naprijed.', null, ['kosi trbušni mišići', 'core'], ['ramena', 'gluteus']],
    ['gorillarow', 'Gorilla row (veslanje s dvije girje)', 'Leđa', 'srednji', 'Dvije girje ili bučice', 'ne',
      'Stani nad dvije girje, stopala šire od kukova.|Savij kukove i ravna leđa, uhvati obje girje.|Povuci jednu girju laktom prema kuku, a drugu ostavi na podu.|Spusti je i povuci drugu, naizmjenično.',
      'Leđa ravna, trup gotovo paralelan s podom.|Povlači laktom prema kuku, ne rukom.|Kukove ne okreći.', 'Zaobljena leđa.|Zamah trupom.|Podizanje ramena prema ušima.', null, ['široki leđni mišić', 'srednji dio leđa'], ['biceps', 'zadnja loža']],
    ['rdlkickstand', 'Rumunski deadlift s oslonjenom zadnjom nogom (girja)', 'Gluteusi', 'srednji', 'Girja ili bučica', 'ne',
      'Stani u raskoračni stav: prednje stopalo cijelo na podu, zadnje samo na prstima, malo iza.|Girju drži uz prednju nogu, savij kukove i potisni ih unazad.|Spuštaj girju uz nogu uz ravna leđa, osjeti istezanje zadnje lože prednje noge.|Stisni gluteus prednje noge i uspravi se. Zatim zamijeni stranu.',
      'Teret nosi prednja noga, zadnja je samo oslonac za ravnotežu.|Koljeno prednje noge blago savijeno.|Leđa ravna, pogled prema podu.', 'Previše težine na zadnjoj nozi.|Zaobljena leđa.|Okretanje kukova.', null, ['zadnja loža', 'gluteus'], ['donja leđa']],
    ['goodmorningbw', 'Good morning (bez opterećenja)', 'Gluteusi', 'početni', 'Bez opreme', 'ne',
      'Stani u širini kukova, koljena blago savijena, ruke iza glave.|Potisni kukove unazad uz ravna leđa i nagni trup naprijed.|Spusti trup do paralele s podom ili dokle ide bez zaokruživanja leđa.|Stisni gluteuse i uspravi se.',
      'Pokret ide iz kukova, ne iz leđa.|Pogled prema dolje, vrat u liniji s kičmom.', 'Zaobljena leđa.|Previše savijena koljena (postaje čučanj).', null, ['zadnja loža', 'gluteus'], ['donja leđa']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, pose, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
    FS.EXTRA_POSES[id] = pose; FS.EXTRA_MUSKUL[id] = { p: prim, s: sec };
  });
  FS.VIDEOS = { cucanj: 'videos/cucanj.mp4', goblet: 'videos/goblet.mp4', jednorodl: 'videos/jednorodl.mp4', rdl: 'videos/rdl.mp4', rdlkickstand: 'videos/rdlkickstand.mp4', gorillarow: 'videos/gorillarow.mp4',  legpress: 'videos/legpress.mp4', lateralnilunge: 'videos/bocniiskorak.mp4', stepup: 'videos/stepup.mp4', bocnaplankabasic: 'videos/bocnaplanka.mp4', goodmorningbw: 'videos/goodmorningbw.mp4' };
  /* vježbe koje je trenerica sama dodala u aplikaciji: video se veže po nazivu */
  FS.VIDEOS_NAZIV = { 'single leg press': 'videos/legpress1.mp4' };
})();
