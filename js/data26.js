/* Banded Upright Row + vlastiti videi za Banded Lateral Raise; Bottle lateral raise se zamjenjuje (vidi ocisti.js) */
(function () {
  const FS = (window.FS = window.FS || {});
  const E = (id, naziv, grupa, nivo, oprema, ko, sa, gr) => ({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  [
    E('banduprightrow', 'Banded Upright Row', 'Ramena', 'početni', 'Duga guma',
      'Stani na sredinu duge gume, stopala u širini kukova, krajeve gume uhvati hvatom odozgo ispred bedara.|Pogled ispred, ramena opuštena, trbuh blago napet.|Povuci laktove prema gore i u stranu, ruke klize uz tijelo do visine grudi.|Na vrhu laktovi ostaju malo iznad podlaktica, zadrži 1 s.|Polako spusti ruke 2 do 3 s do početnog položaja.',
      'Laktovi vode pokret, šaka ostaje ispod lakta.|Ramena ne podižeš prema ušima.|Ako guma pretjerano steže vrat ili ramena, uhvati je šire ili stani na jači dio gume.',
      'Podizanje ramena prema ušima.|Zamah trupom.|Povlačenje iznad visine grudi uz bol u ramenu.')
  ].forEach((a) => { if (!FS.EXERCISES.some((e) => e.id === a.id)) FS.EXERCISES.push(a); });
  const bl = FS.EXERCISES.find((e) => e.id === 'bandlateral'); if (bl) bl.naziv = 'Banded Lateral Raise';
  Object.assign(FS.VIDEOS = FS.VIDEOS || {}, { banduprightrow: 'videos/banduprightrow.mp4', bandlateral: 'videos/bandlateral.mp4' });
  if (FS.ENG) { FS.ENG.banduprightrow = 'Banded upright row'; FS.ENG.bandlateral = 'Banded lateral raise'; }
})();
