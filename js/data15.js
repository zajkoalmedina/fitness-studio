/* Kućni trening: gornji dio tijela i leđa (peškir, zatvorena guma, flaše vode, stolica) */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => g.id === 'sab_kuca')) return;
  const nova = [
    ['towelpull', 'Towel Pull Apart', 'Leđa', 'početni', 'Peškir',
      'Stani uspravno, uhvati peškir objema rukama malo šire od ramena, ruke ispred tijela.|Čvrsto povlači peškir na suprotne strane, kao da ga želiš razdvojiti, i drži napetost cijelo vrijeme.|Povuci ruke prema van i unazad do visine grudi te stisni lopatice zajedno.|Zadrži 1 do 2 s i polako vrati ruke uz napet peškir.', 'Ramena spuštena od ušiju, pogled ravno ispred.|Napetost peškira ne popušta ni pri povratku.|Povrat 2 do 3 s.', 'Podizanje ramena prema ušima.|Opušten peškir bez napetosti.'],
    ['bandlateral', 'Banded Lateral Raise (alternate arms)', 'Ramena', 'početni', 'Zatvorena guma',
      'Stani obje noge na zatvorenu gumu, stopala u širini kukova, koljena blago savijena.|Uhvati gumu jednom rukom uz bedro, pogled ravno ispred.|Podigni ruku u stranu do visine ramena, lakat blago savijen.|Polako spusti 2 do 3 s. Radi jednu ruku, pa drugu.', 'Trup miran, bez naginjanja.|Podižeš do visine ramena, ne više.|Lakši otpor guma, čist pokret.', 'Zamah trupom.|Podizanje ramena prema ušima.'],
    ['bandrowseated', 'Seated Single-Arm Band Row', 'Leđa', 'početni', 'Zatvorena guma',
      'Sjedni na pod ili rub stolice, nagni trup malo naprijed (pretklon), leđa ravna.|Provuci zatvorenu gumu oko stopala i uhvati je jednom rukom.|Povuci ruku prema kuku, lakat uz tijelo, stisni lopaticu.|Polako vrati 2 do 3 s. Radi jednu ruku, pa drugu.', 'Leđa ostaju ravna cijelo vrijeme.|Trup se ne okreće.|Pogled prema podu ispred stopala.', 'Zaobljena leđa.|Povlačenje ramenom umjesto lopaticom.']
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, ko, sa, gr] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });
  const ids = ['skleknakoljenima', 'towelpull', 'bandlateral', 'bandrowseated', 'benchdip', 'bocapregib', 'deadbug'];
  const vj = ids.map((id, i) => {
    const kraj = i === ids.length - 1;
    const x = { id, s: 4, r: '10–12', fix: true, p: kraj ? 90 : 0, n: '' };
    if (i === 0) x.n = 'Krug: vježbe jednu za drugom bez pauze, 4 kruga, pauza 90 s između krugova.';
    if (id === 'bandlateral' || id === 'bandrowseated') x.n = '10–12 po ruci, jedna pa druga.';
    if (id === 'benchdip') x.n = 'Na stabilnoj stolici uz zid.';
    if (id === 'bocapregib') x.n = 'Dvije flaše vode.';
    return x;
  });
  FS.GOTOVI.push({
    id: 'sab_kuca', naziv: 'Biblioteka · Kućni trening', opis: 'Kućni trening gornjeg dijela tijela i leđa: peškir, zatvorena guma, flaše vode i stolica. 7 vježbi jedna za drugom, 4 kruga po 10 do 12 ponavljanja.', nivo: 'početni', sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Rekviziti: peškir, zatvorena guma, dvije flaše vode i stabilna stolica.', 'Radiš svih 7 vježbi jednu za drugom bez pauze, to je jedan krug. Ukupno 4 kruga, pauza 90 s između krugova.', 'Težinu otpora odaberi tako da zadnja dva ponavljanja budu teška, a tehnika čista.'],
    dani: [{ naziv: 'Kućni · Gornji dio tijela i leđa', vj }]
  });
})();
