/* Videi vježbi koje je snimila trenerica (u mapi videos/). Imaju prednost nad starim ručno učitanim videima. */
(function () {
  const FS = window.FS;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['legpress1', 'Potisak nogama jednom nogom (leg press)', 'Noge', 'srednji', 'Leg press sprava', 'kasnije',
      'Sjedni uz naslon, jedno stopalo na sredinu platforme, drugu nogu drži u zraku.|Polako spusti platformu dok koljeno ne dođe prema grudima.|Potisni petom i ispruži nogu, bez zaključavanja koljena.|Odradi sve ponavljanja pa zamijeni nogu.',
      'Lagana kilaža, kontrola u spuštanju.|Kukovi i donji dio leđa ostaju na sjedalu.', 'Podizanje kukova sa sjedala.|Koljeno uvučeno prema unutra.|Zaključavanje koljena pri vrhu.', null, ['kvadriceps', 'glutei'], ['zadnja loža']],
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
  FS.VIDEOS = { legpress: 'videos/legpress.mp4', legpress1: 'videos/legpress1.mp4', bocnaplankabasic: 'videos/bocnaplanka.mp4', goodmorningbw: 'videos/goodmorningbw.mp4' };
})();
