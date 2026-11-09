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
      'Povlačenje vrata rukama.|Zamah umjesto kontrole.|Podizanje cijelog trupa do sjedenja.'),
    E('lowskip', 'Low Skip', 'Kardio', 'početni', 'Bez opreme',
      'Stani uspravno, stopala u širini kukova, ruke savijene uz tijelo. Pogled ispred.|Lagano trči u mjestu uz niske, kratke korake: stopalo se podigne tek nekoliko centimetara od poda.|Doskači na prednji dio stopala i odmah promijeni nogu, ritam oko 2 koraka u sekundi.|Ruke naizmjenično prate korake, a disanje ostaje ravnomjerno.',
      'Ostani na prednjem dijelu stopala, lagano i tiho.|Trup uspravan, ramena opuštena.|Dobro je i za zagrijavanje i kao lagani kardio.',
      'Tvrdo udaranje petama.|Previsoko podizanje koljena.|Nagnut trup i zadržavanje daha.'),
    E('buttkicks', 'Butt Kicks', 'Kardio', 'početni', 'Bez opreme',
      'Stani uspravno, ruke savijene uz tijelo. Pogled ispred.|Lagano trči u mjestu i pete podiži prema stražnjici.|Koljena ostaju ispod kukova, noge se savijaju iza tijela.|Ritam oko 2 koraka u sekundi, ruke naizmjenično prate noge.',
      'Doskoči na prednji dio stopala, lagano i tiho.|Trup uspravan, ne naginji se naprijed.|Dobro je za zagrijavanje stražnje strane natkoljenice.',
      'Naginjanje trupa naprijed.|Tvrdo udaranje petama.|Koljena idu naprijed umjesto da ostanu ispod kukova.'),
    E('bandlateralwalk', 'Banded Lateral Walk', 'Gluteus', 'početni', 'Mini guma',
      'Stavi gumu oko gležnjeva ili iznad koljena. Stopala u širini kukova, koljena blago savijena, trup lagano nagnut naprijed.|Pogled ispred, ruke ispred tijela radi ravnoteže.|Korak u stranu vodećom nogom 1 s, guma ostaje zategnuta.|Druga noga prati do širine kukova, ne spajaj stopala. Nakon koraka u jednu stranu vrati se u drugu.',
      'Koljena prate smjer prstiju, ne padaju prema unutra.|Drži blagi čučanj cijelo vrijeme.|Korake radi polako i kontrolirano.',
      'Spajanje stopala između koraka.|Naginjanje trupa u stranu.|Koljena padaju prema unutra.'),
    E('squatjump', 'Squat Jump', 'Kardio', 'srednji', 'Bez opreme',
      'Stani u širini ramena, prsti blago prema van. Pogled ispred.|Spusti se u čučanj, kukovi nazad, grudi uspravne, ruke ispred tijela.|Snažno odrazi i skoči uvis, ruke zamahom pomažu.|Doskoči na prednji dio stopala, savij koljena i odmah u idući čučanj. Tempo: dolje 1 s, skok eksplozivno.',
      'Doskok tih i mekan, koljena prate smjer prstiju.|Čučanj dubok onoliko koliko možeš zadržati ravna leđa.|Ako je skok pretežak, radi običan čučanj.',
      'Koljena padaju prema unutra pri doskoku.|Tvrd doskok na ravna stopala.|Zaokruživanje leđa u čučnju.'),
    E('squatreachjump', 'Squat Reach Jump', 'Kardio', 'srednji', 'Bez opreme',
      'Stani u širini ramena. Pogled ispred.|Pregni se u čučanj i dodirni stopala ili pod rukama, leđa duga.|Snažno se odrazi i skoči uvis s rukama ispruženim iznad glave.|Doskoči mekano na prednji dio stopala i odmah se spusti natrag do poda. Tempo: dolje 1 s, skok eksplozivno.',
      'Spuštaj se kontrolirano, koljena prate smjer prstiju.|Ruke idu što više iznad glave.|Ako je pretežak, radi bez skoka i samo se podigni na prste.',
      'Zaokruženo donje leđa pri spuštanju.|Tvrd doskok na ravna stopala.|Ruke ostaju ispred tijela umjesto da idu iznad glave.'),
    E('staticlunge', 'Static Lunge', 'Noge', 'početni', 'Bez opreme',
      'Stani u iskorak: jedna noga ispred, druga iza, razmak oko jedne duge stope. Prednje stopalo čvrsto na podu, zadnja peta podignuta. Pogled ispred.|Spusti se ravno dolje dok zadnje koljeno ne bude tik iznad poda, 2 s. Prednje koljeno prati smjer prstiju.|Odgurni se prednjom nogom i podigni se do skoro ispruženih nogu, 1 s.|Cijelo vrijeme ostaješ u istom iskoraku, bez koraka naprijed ili nazad. Poslije serije zamijeni nogu.',
      'Trup ostaje uspravan, težina na prednjoj nozi.|Spuštaj se ravno dolje, ne naprijed.|Ruke možeš sklopiti ispred sebe ili staviti na kukove.',
      'Prednje koljeno ide daleko ispred prstiju.|Naginjanje trupa naprijed.|Ljuljanje i gubljenje ravnoteže zbog preuskog razmaka stopala.')
  ].forEach((a) => { if (!FS.EXERCISES.some((e) => e.id === a.id)) FS.EXERCISES.push(a); });
  const sb = FS.EXERCISES.find((e) => e.id === 'singlebridge'); if (sb) sb.naziv = 'Single Leg Glute Bridge';
  const fh = FS.EXERCISES.find((e) => e.id === 'firehydrant'); if (fh) fh.naziv = 'Fire Hydrant';
  if (FS.ENG) FS.ENG.lowskip = 'Low skip';
  Object.assign(FS.VIDEOS = FS.VIDEOS || {}, { donkeykick: 'videos/donkeykick.mp4', reachcrunch: 'videos/reachcrunch.mp4', hipthrust: 'videos/hipthrust.mp4', lowskip: 'videos/lowskip.mp4', staticlunge: 'videos/staticlunge.mp4', iskorak: 'videos/iskorak.mp4', firehydrant: 'videos/firehydrant.mp4', mountainclimb: 'videos/mountainclimb.mp4', burpee: 'videos/burpee.mp4', squatjump: 'videos/squatjump.mp4', squatreachjump: 'videos/squatreachjump.mp4', bandlateralwalk: 'videos/bandlateralwalk.mp4', buttkicks: 'videos/buttkicks.mp4', bridge: 'videos/bridge.mp4', singlebridge: 'videos/singlebridge.mp4', jumpingjack: 'videos/jumpingjack.mp4', standabd: 'videos/standabd.mp4', clamshell: 'videos/clamshell.mp4' });
})();
