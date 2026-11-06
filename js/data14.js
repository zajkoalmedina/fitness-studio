/* Tabata 20/10 · noge i gluteus (biblioteka HIIT treninga) */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI) return;
  const nova = [
    ['kickbackbw', 'Kick Back', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Stani u četveronožni položaj, dlanovi ispod ramena, koljena ispod kukova.|Pogled prema podu, leđa ravna.|Ispruži jednu nogu unazad i gore uz stisak gluteusa.|Vrati koljeno do poda i ponovi, u tabati izmjenjuj nogu po rundi ili po pola vremena.', 'Zdjelica mirna, bez rotacije.|Pokret iz kuka, ne iz donjeg dijela leđa.|Brzo, ali kontrolisano.', 'Izvijanje leđa.|Zamah umjesto stiska gluteusa.'],
    ['highskip', 'High Skip', 'Kardio', 'početni', 'Bez opreme',
      'Stani uspravno, pogled ravno ispred.|Poskoči na jednoj nozi dok drugo koljeno podižeš do visine kuka, a suprotna ruka ide naprijed.|Izmjenjuj strane u ritmu skipinga.|Doskoči mekano na prednji dio stopala.', 'Trup uspravan, ramena opuštena.|Mekan doskok.|Ritam ravnomjeran.', 'Teški doskok na pete.|Naginjanje trupa unazad.'],
    ['crisscross', 'Criss-Cross', 'Core', 'srednji', 'Bez opreme (prostirka)',
      'Lezi na leđa, ruke iza glave, noge podignute iznad poda, koljena savijena.|Pogled prema koljenima, lopatice odvojene od poda.|Okreni trup i približi lakat suprotnom koljenu dok se druga noga ispruža.|Izmjenjuj strane u kontinuiranom ritmu.', 'Rotacija iz trupa, ne vuci vrat.|Donji dio leđa pritisnut uz pod.|Ritam kontrolisan.', 'Vučenje glave rukama.|Brzo mahanje bez rotacije trupa.'],
    ['sidecrunch', 'Side Crunch Toe Touch', 'Core', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na podu, ruke uz tijelo.|Pogled prema stropu, zatim prema stopalu.|Podigni gornji dio trupa i povuci se bočno tako da desna ruka dodirne desno stopalo.|Vrati se i ponovi na istu stranu cijelo vrijeme intervala, pa u sljedećem krugu zamijeni stranu.', 'Pokret iz bočnih trbušnih mišića.|Vrat opušten.|Donji dio leđa uz pod.', 'Povlačenje vrata.|Previše zamaha.'],
    ['bridgepulse', 'Glute Bridge Pulse', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na širini kukova blizu zadnjice.|Podigni kukove u poziciju glute bridge i ostani na vrhu.|Kratkim pokretima 3–5 cm spuštaj i podižite kukove (pulsiranje) bez dodira poda.|Gluteus cijelo vrijeme stegnut.', 'Pete guraju u pod.|Rebra spuštena.|Mali opseg pokreta.', 'Izvijanje donjeg dijela leđa.|Vraćanje kukova do poda.'],
    ['bridgeabd', 'Glute Bridge with Abduction', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, koljena savijena, stopala na širini kukova.|Podigni kukove u poziciju glute bridge.|Na vrhu razmakni koljena prema van, pa ih vrati.|Spusti kukove i ponovi.', 'Koljena guraju van, stopala ostaju na mjestu.|Zdjelica mirna.|Polako 2 s.', 'Spuštanje kukova između abdukcija.|Naginjanje zdjelice u stranu.'],
    ['lowskip', 'Low Skip', 'Kardio', 'početni', 'Bez opreme',
      'Stani uspravno, pogled ravno ispred.|Lagano poskakuj s noge na nogu, koljeno se podiže samo do oko 45°, suprotna ruka ide naprijed.|Održavaj ritam ravnomjernim i doskakuj mekano na prednji dio stopala.|Disanje ravnomjerno.', 'Niske, brze skokove drži blizu poda.|Trup uspravan, ramena opuštena.|Manje opterećenje nego High Skip.', 'Teški doskok.|Naginjanje trupa unazad.'],
    ['lungekneedrive', 'Reverse Lunge with Knee Drive', 'Noge', 'srednji', 'Bez opreme',
      'Stani uspravno, pogled ravno ispred. U prvom krugu radiš desnom nogom, u drugom lijevom.|Korakni radnom nogom unazad u iskorak, oba koljena oko 90°.|Odgurni se i odmah dovedi istu nogu naprijed u fleksiju kuka, koljeno savijeno oko 90°.|Spusti nogu nazad u iskorak i ponovi.', 'Stabilna noga ostaje blago savijena.|Trup uspravan, stegni trbuh.|Kontrolisano, bez zamaha.', 'Naginjanje trupa unazad pri podizanju koljena.|Koljeno prednje noge ide preko prstiju.'],
    ['bandsquatabd', 'Banded Squat with Abduction', 'Gluteus', 'srednji', 'Mini guma (zatvorena) oko koljena',
      'Stavi zatvorenu mini gumu iznad koljena, stopala u širini kukova.|Pogled ravno ispred, grudi podignute.|Spusti se u čučanj uz guranje koljena prema van protiv gume.|Pri ispravljanju prebaci težinu na jednu nogu i odmakni drugu u stranu (abdukcija). Naizmjenično mijenjaj nogu.', 'Guma uvijek napeta.|Zdjelica mirna pri abdukciji.|Ne naginji trup.', 'Koljena upadaju prema unutra.|Naginjanje trupa u stranu.'],
    ['hamstringbridge', 'Hamstring Bridge (90° Knees)', 'Gluteus', 'početni', 'Bez opreme (prostirka)',
      'Lezi na leđa, ruke uz tijelo, stopala postavi dalje od zadnjice nego kod običnog mosta, tako da pri vrhu pokreta potkoljenica bude okomita, a koljeno oko 90°.|Pogled prema stropu, rebra spuštena.|Pete guraju u pod, podigni kukove u liniju koljena, kukova i ramena.|Stisni zadnju ložu i gluteus, zadrži 1 s i polako spusti.', 'Pete guraju u pod, prsti mogu biti blago podignuti.|Ne izvijaj donji dio leđa.|Spuštanje 2–3 s.', 'Stopala preblizu zadnjici.|Grč zadnje lože: pomakni stopala bliže.']
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, ko, sa, gr] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij: 'ne', koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
  });
  const R = '20 s', T = 10;
  /* blok: vježbe jedna za drugom (20 s rad / 10 s odmor), 2 kruga, pauza 60 s između krugova, 90 s poslije bloka */
  const blok = (ids, naziv, zadnji, rad, odmor, uvod) => ids.map((id, i) => {
    const kraj = i === ids.length - 1;
    const x = { id, s: 2, r: (rad || 20) + ' s', fix: true, p: kraj ? 60 : (odmor || T), n: '' };
    if (kraj) x.pz = zadnji ? 0 : 90;
    if (i === 0) x.n = (uvod || '') + naziv + ': 2 kruga. ' + (rad || 20) + ' s rad, ' + (odmor || T) + ' s odmor između vježbi, 60 s pauza između krugova' + (zadnji ? '.' : ', poslije bloka 90 s pauze.');
    return x;
  });
  const fixIsk = (arr) => arr.map((x) => (x.id === 'iskorak' ? { ...x, r: '40 s', n: '20 s desna noga, odmah 20 s lijeva noga.' } : x));
  const dan = {
    naziv: 'Tabata 20/10 · Noge i gluteus',
    vj: [].concat(
      blok(['kickbackbw', 'jumpingjack', 'highskip', 'burpee'], 'Blok I', false, 20, 10, 'Intenzitet: visok (napor 8–9 od 10). '),
      fixIsk(blok(['cucanj', 'sumocucanj', 'iskorak'], 'Blok II')),
      blok(['twist', 'legraise', 'crisscross', 'sidecrunch'], 'Blok III'),
      blok(['bridge', 'bridgepulse', 'bridgeabd', 'singlebridge'], 'Blok IV (gluteus)', true)
    )
  };
  const dan2 = {
    naziv: 'Intervalni 30/10 · Noge',
    vj: [].concat(
      blok(['cucanj', 'jumpingjack'], 'Blok 1', false, 30, 10, 'Intenzitet: visok (napor 7–8 od 10). '),
      blok(['lungekneedrive', 'lowskip'], 'Blok 2', false, 30, 10).map((x) => (x.id === 'lungekneedrive' ? { ...x, n: x.n + ' Prvi krug desna noga, drugi krug lijeva noga.' } : x)),
      blok(['bandsquatabd', 'kickbackguma'], 'Blok 3 (zatvorena mini guma)', false, 30, 10),
      blok(['lateralnilunge', 'burpee'], 'Blok 4', false, 30, 10),
      blok(['hamstringbridge', 'mountainclimb'], 'Blok 5', true, 30, 10)
    )
  };
  if (FS.GOTOVI.some((g) => g.id === 'sab_hiit')) return;
  FS.GOTOVI.push({
    id: 'sab_hiit', naziv: 'Biblioteka · HIIT treninzi', opis: 'HIIT treninzi za dodjelu klijenticama. Tabata 20/10: 20 sekundi rada, 10 sekundi odmora, štoperica vodi vrijeme. Intenzitet: visok, napor 8 od 10.', nivo: 'srednji', sedmica: 1, dana: 2, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: 0 },
    bilj: ['Intenzitet: visok. U intervalima rada radiš na naporu 8 do 9 od 10 (teško, ali s čistom tehnikom), a u 10 s odmora se oporavljaš. Ako ne možeš održati tehniku, smanji tempo.', 'Tabata 20/10: svaka vježba 20 s rada i 10 s odmora, 2 kruga svakog bloka. Pauza 60 s između krugova i 90 s između blokova.', 'Intervalni 30/10: 30 s rada, 10 s odmora, 2 kruga svakog od 5 blokova. Intenzitet visok, napor 7 do 8 od 10. Blok 3 radiš sa zatvorenom mini gumom iznad koljena.', 'Pritisni ⏱ Štoperica pored vježbe: aplikacija odbrojava, označi seriju i pokrene odmor.', 'Zagrij se 5 minuta prije treninga i ohladi 5 minuta poslije.'],
    dani: [dan, dan2]
  });
})();
