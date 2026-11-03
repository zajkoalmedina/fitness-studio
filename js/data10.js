/* Videi vježbi koje je snimila trenerica (u mapi videos/). Imaju prednost nad starim ručno učitanim videima. */
(function () {
  const FS = window.FS;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['bocnaplankabasic', 'Bočni plank (side plank)', 'Core', 'srednji', 'Bez opreme', 'ne',
      'Lezi na bok, osloni se na podlakticu ili dlan ispod ramena.|Podigni kukove tako da tijelo bude u ravnoj liniji.|Gornju ruku podigni prema stropu, pogled naprijed.|Zadrži položaj, zatim promijeni stranu.',
      'Počni na koljenu ako je pretežak.|Stisni trbuh i gluteuse.', 'Propadanje kukova.|Rotiranje trupa prema naprijed.', null, ['kosi trbušni mišići', 'core'], ['ramena', 'glutei']],
    ['goodmorningbw', 'Good morning (bez opterećenja)', 'Gluteusi', 'početni', 'Bez opreme', 'ne',
      'Stani u širini kukova, koljena blago savijena, ruke iza glave.|Potisni kukove unazad uz ravna leđa i nagni trup naprijed.|Spusti trup do paralele s podom ili dokle ide bez zaokruživanja leđa.|Stisni gluteuse i uspravi se.',
      'Pokret ide iz kukova, ne iz leđa.|Pogled prema dolje, vrat u liniji s kičmom.', 'Zaobljena leđa.|Previše savijena koljena (postaje čučanj).', null, ['zadnja loža', 'glutei'], ['donja leđa']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, pose, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
    FS.EXTRA_POSES[id] = pose; FS.EXTRA_MUSKUL[id] = { p: prim, s: sec };
  });
  FS.VIDEOS = { legpress: 'videos/legpress.mp4', lateralnilunge: 'videos/bocniiskorak.mp4', stepup: 'videos/stepup.mp4', bocnaplankabasic: 'videos/bocnaplanka.mp4', goodmorningbw: 'videos/goodmorningbw.mp4' };
  /* vježbe koje je trenerica sama dodala u aplikaciji: video se veže po nazivu */
  FS.VIDEOS_NAZIV = { 'single leg press': 'videos/legpress1.mp4' };
})();
