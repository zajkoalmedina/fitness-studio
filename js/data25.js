/* Nove vježbe uz vlastite videe: Donkey Kick, Reach Crunch + videi za Hip thrust, Clamshell, Standing Banded Hip Abduction */
(function () {
  const FS = (window.FS = window.FS || {});
  const E = (id, naziv, grupa, nivo, oprema, ko, sa, gr) => ({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  [
    E('donkeykick', 'Donkey Kick', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Klekni na sve četiri, dlanovi ispod ramena, koljena ispod kukova. Pogled prema podu malo ispred dlanova.|Stegni trbuh da leđa ostanu ravna.|Podigni jednu nogu savijenu u koljenu, peta ide prema stropu, 2 s.|Na vrhu stisni gluteus 1 s, pa polako spusti nogu 2 s bez spuštanja na pod.',
      'Kukovi ostaju okrenuti prema podu, ne otvaraj ih u stranu.|Pokret dolazi iz gluteusa, ne iz leđa.|Počni bez tereta, kasnije dodaj gumu.',
      'Ljuljanje i izvijanje donjeg dijela leđa.|Zamah nogom umjesto kontrole.|Rotiranje kukova prema van.'),
    E('reachcrunch', 'Reach Crunch', 'Core', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na podu. Ruke ispružene prema stropu.|Pogled prema rukama, brada odmaknuta od grudi.|Izdahni i podigni lopatice s poda, ruke idu prema koljenima ili stropu, 2 s.|Polako se spusti 2 s i ponovi bez odmaranja glave na podu.',
      'Pokret vodi trbuh, ne vrat.|Donji dio leđa ostaje na podu.|Izdahni kad se dižeš, udahni kad se spuštaš.',
      'Povlačenje vrata rukama.|Zamah umjesto kontrole.|Podizanje cijelog trupa do sjedenja.')
  ].forEach((a) => { if (!FS.EXERCISES.some((e) => e.id === a.id)) FS.EXERCISES.push(a); });
  Object.assign(FS.VIDEOS = FS.VIDEOS || {}, { donkeykick: 'videos/donkeykick.mp4', reachcrunch: 'videos/reachcrunch.mp4', hipthrust: 'videos/hipthrust.mp4', standabd: 'videos/standabd.mp4', clamshell: 'videos/clamshell.mp4' });
})();
