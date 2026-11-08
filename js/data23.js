/* Nove vježbe uz vlastite videe: Toes to Bar, Bent-Over Dumbbell Row, Assisted Pull Up */
(function () {
  const FS = (window.FS = window.FS || {});
  const E = (id, naziv, grupa, nivo, oprema, ko, sa, gr) => ({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  [
    E('toestobar', 'Toes to Bar', 'Core', 'napredni', 'Vratilo ili sprava za zgibove',
      'Uhvati vratilo malo šire od ramena i visi s ispruženim rukama, lopatice spuštene.|Pogled ispred, noge zajedno.|Napni trbuh i podigni ispružene noge prema vratilu dok prsti ne dodirnu šipku.|Polako spusti noge u početni vis, 2 do 3 s, bez ljuljanja.',
      'Počni s podizanjem koljena ili ravnih nogu do pola pa tek onda do vratila.|Pokret vodi trbuh, ne zamah.|Hvat čvrst, ramena ne sležu uši.',
      'Jak zamah nogama i trupom.|Savijena leđa i opuštena ramena.|Prebrzo spuštanje.'),
    E('dbrowbent', 'Bent-Over Dumbbell Row', 'Leđa', 'srednji', 'Dvije bučice',
      'Stani, stopala u širini kukova, bučice u rukama, koljena blago savijena.|Nagni trup naprijed oko 45° s ravnim leđima, ruke vise okomito, pogled prema podu malo ispred.|Povuci laktove prema kukovima, lopatice stisni.|Polako spusti bučice do ispruženih ruku, 2 do 3 s.',
      'Trup ostaje u istom nagibu cijelo vrijeme.|Lakat vodi pokret, bučice uz tijelo.|Na vrhu stisni lopatice 1 s.',
      'Zaokruživanje leđa.|Podizanje trupa uz svako ponavljanje.|Zamah bučicama.'),
    E('assistedpullup', 'Assisted Pull Up', 'Leđa', 'početni', 'Smith sprava ili stalak, niska šipka',
      'Postavi šipku u visinu malo iznad ispruženih ruku dok klečiš ili sjediš ispod nje.|Uhvati šipku malo šire od ramena, lopatice spuštene, pogled ispred.|Povuci laktove prema rebrima i podigni se, noge pomažu tek koliko je potrebno.|Polako se spusti 3 s do ispruženih ruku.',
      'Što manje pomoći nogama, tim bolje.|Prsa prema šipci, ne bradom.|Kad lako radiš 3 serije od 10, spusti pomoć ili pređi na zgib.',
      'Odgurivanje nogama.|Podizanje ramena prema ušima.|Prebrzo spuštanje.')
  ].forEach((a) => { if (!FS.EXERCISES.some((e) => e.id === a.id)) FS.EXERCISES.push(a); });
  Object.assign(FS.VIDEOS = FS.VIDEOS || {}, { zidsjed: 'videos/zidsjed.mp4', benchdip: 'videos/benchdip.mp4', bandgm: 'videos/bandgm.mp4', frogpump: 'videos/frogpump.mp4', toestobar: 'videos/toestobar.mp4', dbrowbent: 'videos/dbrowbent.mp4', assistedpullup: 'videos/assistedpullup.mp4' });
})();
