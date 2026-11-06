/* Tabata 20/10 · noge i gluteus (biblioteka HIIT treninga) */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI) return;
  const nova = [
    ['kickbackbw', 'Kick Back', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Stani u četveronožni položaj, dlanovi ispod ramena, koljena ispod kukova.|Pogled prema podu, leđa ravna.|Ispruži jednu nogu unazad i gore uz stisak gluteusa.|Vrati koljeno do poda i ponovi, u tabati izmjenjuj nogu po rundi ili po pola vremena.', 'Zdjelica mirna, bez rotacije.|Pokret iz kuka, ne iz donjeg dijela leđa.|Brzo, ali kontrolisano.', 'Izvijanje leđa.|Zamah umjesto stiska gluteusa.'],
    ['highskip', 'High Skip', 'Kardio', 'početni', 'Bez opreme',
      'Stani uspravno, pogled ravno ispred.|Poskoči na jednoj nozi dok drugo koljeno podižeš do visine kuka, a suprotna ruka ide naprijed.|Izmjenjuj strane u ritmu skipinga.|Doskoči mekano na prednji dio stopala.', 'Trup uspravan, ramena opuštena.|Mekan doskok.|Ritam ravnomjeran.', 'Teški doskok na pete.|Naginjanje trupa unazad.'],
    ['iskorakd', 'Reverse Lunge – Right Leg', 'Noge', 'početni', 'Bez opreme',
      'Stani uspravno, ruke na kukovima ili uz tijelo, pogled ravno ispred.|Korakni desnom nogom unazad i spusti se dok oba koljena ne budu oko 90°.|Odgurni se prednjom (lijevom) nogom nazad u stojeći položaj.|Cijelo vrijeme radi samo desnom nogom unazad.', 'Prednje koljeno iznad stopala.|Trup uspravan.|Spuštanje 1–2 s.', 'Koljeno ide daleko preko prstiju.|Naginjanje trupa naprijed.'],
    ['iskorakl', 'Reverse Lunge – Left Leg', 'Noge', 'početni', 'Bez opreme',
      'Stani uspravno, ruke na kukovima ili uz tijelo, pogled ravno ispred.|Korakni lijevom nogom unazad i spusti se dok oba koljena ne budu oko 90°.|Odgurni se prednjom (desnom) nogom nazad u stojeći položaj.|Cijelo vrijeme radi samo lijevom nogom unazad.', 'Prednje koljeno iznad stopala.|Trup uspravan.|Spuštanje 1–2 s.', 'Koljeno ide daleko preko prstiju.|Naginjanje trupa naprijed.'],
    ['crisscross', 'Criss-Cross', 'Core', 'srednji', 'Bez opreme (prostirka)',
      'Lezi na leđa, ruke iza glave, noge podignute iznad poda, koljena savijena.|Pogled prema koljenima, lopatice odvojene od poda.|Okreni trup i približi lakat suprotnom koljenu dok se druga noga ispruža.|Izmjenjuj strane u kontinuiranom ritmu.', 'Rotacija iz trupa, ne vuci vrat.|Donji dio leđa pritisnut uz pod.|Ritam kontrolisan.', 'Vučenje glave rukama.|Brzo mahanje bez rotacije trupa.'],
    ['sidecrunch', 'Side Crunch Toe Touch', 'Core', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na podu, ruke uz tijelo.|Pogled prema stropu, zatim prema stopalu.|Podigni gornji dio trupa i povuci se bočno tako da desna ruka dodirne desno stopalo.|Vrati se i ponovi na istu stranu cijelo vrijeme intervala, pa u sljedećem krugu zamijeni stranu.', 'Pokret iz bočnih trbušnih mišića.|Vrat opušten.|Donji dio leđa uz pod.', 'Povlačenje vrata.|Previše zamaha.'],
    ['bridgepulse', 'Glute Bridge Pulse', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na širini kukova blizu zadnjice.|Podigni kukove u poziciju glute bridge i ostani na vrhu.|Kratkim pokretima 3–5 cm spuštaj i podižite kukove (pulsiranje) bez dodira poda.|Gluteus cijelo vrijeme stegnut.', 'Pete guraju u pod.|Rebra spuštena.|Mali opseg pokreta.', 'Izvijanje donjeg dijela leđa.|Vraćanje kukova do poda.'],
    ['bridgeabd', 'Glute Bridge with Abduction', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na širini kukova.|Podigni kukove u poziciju glute bridge.|Na vrhu razmakni koljena prema van, pa ih vrati.|Spusti kukove i ponovi.', 'Koljena guraju van, stopala ostaju na mjestu.|Zdjelica mirna.|Polako 2 s.', 'Spuštanje kukova između abdukcija.|Naginjanje zdjelice u stranu.']
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, ko, sa, gr] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });
  const R = '20 s', T = 10;
  /* blok: vježbe jedna za drugom (20 s rad / 10 s odmor), 2 kruga, pauza 60 s između krugova, 90 s poslije bloka */
  const blok = (ids, naziv, zadnji) => ids.map((id, i) => {
    const kraj = i === ids.length - 1;
    const x = { id, s: 2, r: R, fix: true, p: kraj ? 60 : T, n: '' };
    if (kraj) x.pz = zadnji ? 0 : 90;
    if (i === 0 && naziv === 'Blok I') x.n = 'Intenzitet: visok (napor 8–9 od 10). ' + naziv + ': 2 kruga. 20 s rad, 10 s odmor između vježbi, 60 s pauza između krugova, poslije bloka 90 s pauze.'; else if (i === 0) x.n = naziv + ': 2 kruga. 20 s rad, 10 s odmor između vježbi, 60 s pauza između krugova' + (zadnji ? '.' : ', poslije bloka 90 s pauze.');
    return x;
  });
  const dan = {
    naziv: 'Tabata 20/10 · Noge i gluteus',
    vj: [].concat(
      blok(['kickbackbw', 'jumpingjack', 'highskip', 'mountainclimb'], 'Blok I'),
      blok(['cucanj', 'sumocucanj', 'iskorakd', 'iskorakl'], 'Blok II'),
      blok(['twist', 'legraise', 'crisscross', 'sidecrunch'], 'Blok III'),
      blok(['bridge', 'bridgepulse', 'bridgeabd', 'singlebridge'], 'Blok IV (gluteus)', true)
    )
  };
  if (FS.GOTOVI.some((g) => g.id === 'sab_hiit')) return;
  FS.GOTOVI.push({
    id: 'sab_hiit', naziv: 'Biblioteka · HIIT treninzi', opis: 'HIIT treninzi za dodjelu klijenticama. Tabata 20/10: 20 sekundi rada, 10 sekundi odmora, štoperica vodi vrijeme. Intenzitet: visok, napor 8 od 10.', nivo: 'srednji', sedmica: 1, dana: 1, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Intenzitet: visok. U intervalima rada radiš na naporu 8 do 9 od 10 (teško, ali s čistom tehnikom), a u 10 s odmora se oporavljaš. Ako ne možeš održati tehniku, smanji tempo.', 'Tabata 20/10: svaka vježba 20 s rada i 10 s odmora, 2 kruga svakog bloka. Pauza 60 s između krugova i 90 s između blokova.', 'Pritisni ⏱ Štoperica pored vježbe: aplikacija odbrojava, označi seriju i pokrene odmor.', 'Zagrij se 5 minuta prije treninga i ohladi 5 minuta poslije.'],
    dani: [dan]
  });
})();
