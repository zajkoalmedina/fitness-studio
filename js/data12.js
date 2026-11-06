/* Kućni trening · 5 nivoa (jastuk, zatvorena mini guma, flaša vode): 10 sedmica, 4 treninga sedmično.
   Svaki nivo traje 2 sedmice i donosi teže varijacije istih pokreta. Zamjenjuje raniji "kuca2". */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI) return;
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  const nova = [
    ['abdstolica', 'Seated Banded Hip Abduction', 'Gluteus', 'početni', 'Mini guma, stolica', 'ne',
      'Sjedni na rub stabilne stolice, leđa uspravna, mini gumu stavi oko koljena.|Stopala stoje na podu u širini kukova.|Razmakni koljena prema van i zadrži 1 sekundu.|Polako vrati koljena nazad bez gubitka napetosti gume.', 'Zdjelica ostaje mirna, ne naginji se u stranu.|Pogled ravno ispred sebe.|Pokret polagan, 2 s van i 2 s nazad.', 'Zamah trupom umjesto rada kukova.|Brz povrat gume.', null, ['gluteus medius', 'gluteus'], ['tenzor fascije late']],
    ['bandsquat', 'Banded Squat', 'Noge', 'početni', 'Mini guma oko koljena', 'ne',
      'Stavi mini gumu iznad koljena, stopala u širini ramena, vrhovi prstiju malo van.|Pogled ravno ispred, grudi podignute.|Spusti se u čučanj uz guranje koljena prema van protiv gume.|Odgurni se kroz pete i ispruži kukove.', 'Težina na petama i prednjem dijelu stopala.|Koljena prate pravac prstiju.|Spuštanje 3 s.', 'Koljena upadaju prema unutra.|Pete se dižu s poda.', null, ['kvadriceps', 'gluteus'], ['gluteus medius']],
    ['bandgm', 'Banded Good Morning', 'Gluteus', 'početni', 'Mini guma', 'ne',
      'Stani na sredinu gume, krajeve gume prebaci preko leđa iznad ramena (ili drži uz grudi).|Koljena blago savijena, leđa ravna, pogled prema podu ispred sebe.|Gurni kukove unazad i nagni trup naprijed dok ne osjetiš zadnju ložu.|Stisni gluteus i ispravi se.', 'Leđa ostaju ravna cijelo vrijeme.|Kukovi idu unazad, ne spuštaš koljena.|Spuštanje 3 s.', 'Zaobljena leđa.|Pretjerano savijanje koljena.', null, ['zadnja loža', 'gluteus'], ['donji dio leđa']],
    ['bandbridge', 'Banded Glute Bridge', 'Gluteus', 'početni', 'Mini guma oko koljena', 'ne',
      'Lezi na leđa, mini guma iznad koljena, stopala na širini kukova blizu zadnjice.|Pogled prema stropu, ruke uz tijelo.|Podigni kukove uz guranje koljena prema van protiv gume.|Zadrži 2 s na vrhu, spuštaj 3 s.', 'Stisni gluteus na vrhu, ne naginji rebra.|Pete guraju u pod.|Koljena ne padaju prema unutra.', 'Hiperekstenzija donjeg dijela leđa.|Koljena upadaju.', null, ['gluteus'], ['gluteus medius', 'zadnja loža']],
    ['kickbackguma', 'Banded Quadruped Kickback', 'Gluteus', 'srednji', 'Mini guma', 'ne',
      'Stani u četveronožni položaj, mini guma oko stopala (ili iznad koljena), dlanovi ispod ramena.|Pogled prema podu, leđa ravna.|Ispruži jednu nogu unazad i gore uz stisak gluteusa.|Polako vrati koljeno do poda i ponovi, pa zamijeni stranu.', 'Zdjelica ostaje mirna, bez okretanja.|Pokret dolazi iz kuka, ne iz donjeg dijela leđa.|Zadrži 1 s na vrhu.', 'Izvijanje leđa pri podizanju noge.|Zamah umjesto kontrole.', null, ['gluteus'], ['zadnja loža']],
    ['bandsquatwalk', 'Banded Squat Walk', 'Gluteus', 'srednji', 'Mini guma oko koljena', 'ne',
      'Mini guma iznad koljena, spusti se u polučučanj i ostani nisko.|Pogled ravno ispred, grudi podignute.|Korakom u stranu razmakni nogu, pa dovedi drugu da stopala ostanu u širini kukova.|Prođi niz prostoriju i vrati se u drugu stranu.', 'Ostani u istoj visini, bez „skakanja".|Guma uvijek napeta.|Koljena prate prste.', 'Ustajanje između koraka.|Spajanje stopala.', null, ['gluteus medius', 'gluteus'], ['kvadriceps']],
    ['standabd', 'Standing Banded Hip Abduction', 'Gluteus', 'početni', 'Mini guma, stolica (oslonac)', 'ne',
      'Stani bočno uz naslon stolice, mini guma oko gležnjeva, lagano držiš naslon.|Pogled ispred sebe, trup uspravan.|Odmakni jednu nogu u stranu uz napetu gumu.|Zadrži 1 s, polako vrati. Zamijeni stranu.', 'Ne naginji trup u stranu.|Stopalo gleda naprijed.|Pokret kontrolisan, 2 s.', 'Naginjanje trupa.|Zamah nogom.', null, ['gluteus medius'], ['gluteus']],
    ['bocalunge', 'Bottle Reverse Lunge', 'Noge', 'početni', 'Dvije boce vode', 'ne',
      'Stani uspravno s bocom u svakoj ruci uz tijelo.|Pogled ravno ispred.|Korakni jednom nogom unazad i spusti se dok oba koljena ne budu oko 90°.|Odgurni se prednjom nogom nazad u stojeći položaj.', 'Prednje koljeno ostaje iznad stopala.|Trup uspravan.|Spuštanje 2–3 s.', 'Prednje koljeno ide daleko preko prstiju.|Naginjanje trupa.', null, ['kvadriceps', 'gluteus'], ['zadnja loža']],
    ['diamondsklek', 'Diamond Push Up', 'Prsa', 'srednji', 'Bez opreme (prostirka)', 'ne',
      'Postavi dlanove ispod prsa tako da prsti i palčevi čine oblik dijamanta, tijelo u ravnoj liniji.|Pogled malo ispred dlanova.|Savij laktove uz tijelo i spusti prsa prema rukama.|Odgurni se i ispruži ruke. Na koljenima ako je pretežak.', 'Laktovi blizu tijela.|Trbuh i gluteus stegnuti.|Spuštanje 3 s.', 'Propadanje kukova.|Laktovi se šire u stranu.', null, ['triceps', 'prsa'], ['ramena']],
    ['pikesklek', 'Pike Push Up', 'Ramena', 'srednji', 'Bez opreme (prostirka)', 'ne',
      'Dlanovi na podu, kukovi visoko, tijelo u obliku obrnutog slova V.|Pogled prema stopalima ili između dlanova.|Savij laktove i spusti glavu prema podu, laktovi malo u stranu.|Odgurni se nazad u početni položaj.', 'Kukovi ostaju visoko.|Glava prolazi između ruku.|Počni s manjim opsegom pokreta.', 'Spuštanje kukova kao kod običnog sklekova.|Ramena se dižu prema ušima.', null, ['ramena'], ['triceps', 'prsa']],
    ['legraise', 'Lying Leg Raise', 'Core', 'srednji', 'Bez opreme (prostirka)', 'ne',
      'Lezi na leđa, dlanovi ispod zadnjice, noge ispružene.|Donji dio leđa pritisni u pod, pogled prema stropu.|Podigni noge do oko 90°, polako spuštaj 3 s bez dodirivanja poda.|Ponovi bez gubitka kontakta leđa s podom.', 'Ako leđa odlaze od poda, savij koljena.|Izdah pri podizanju.|Spuštaj što sporije.', 'Izvijanje donjeg dijela leđa.|Zamah nogama.', null, ['donji dio trbuha'], ['kukovi (pregibači)']],
    ['sideplankdip', 'Side Plank Hip Dip', 'Core', 'srednji', 'Bez opreme (prostirka)', 'ne',
      'Lezi na bok, osloni se na podlakticu, noge jedna na drugoj ili jedna ispred druge.|Podigni kukove u ravnu liniju, pogled naprijed.|Spusti kuk prema podu, pa ga podigni iznad linije.|Ponovi, pa zamijeni stranu.', 'Pokret iz bočnih mišića trupa.|Rame ispod lakta.|Polako 2 s gore, 2 s dolje.', 'Okretanje trupa naprijed.|Brzo „klaćenje".', null, ['kosi trbušni mišići'], ['core', 'ramena']],
    ['bicycle', 'Bicycle Crunch', 'Core', 'početni', 'Bez opreme (prostirka)', 'ne',
      'Lezi na leđa, ruke iza glave, noge podignute sa savijenim koljenima.|Pogled prema koljenima, lopatice odvojene od poda.|Lakat približi suprotnom koljenu dok se druga noga ispruža.|Izmjenjuj strane polako, jedan puni ciklus oko 3 s.', 'Ne vuci vrat rukama.|Rotacija dolazi iz trupa, ne samo iz lakata.|Donji dio leđa pritisnut u pod.', 'Brzo mahanje nogama.|Povlačenje glave rukama.', null, ['kosi trbušni mišići'], ['trbušni mišići']]
  ];
  nova.forEach((a) => {
    const [id, naziv, grupa, nivo, oprema, dij, ko, sa, gr, pose, prim, sec] = a;
    if (FS.EXERCISES.some((e) => e.id === id)) return;
    FS.EXERCISES.push({ id, naziv, grupa, nivo, oprema, dij, koraci: ko.split('|'), savjeti: sa.split('|'), greske: gr.split('|'), video: '' });
    FS.EXTRA_POSES[id] = pose; FS.EXTRA_MUSKUL[id] = { p: prim, s: sec };
  });

  /* ---------- ljestvice: po jedna vježba za svaki od 5 nivoa ---------- */
  const LAD = {
    SQ: ['bocacucanj', 'bandsquat', 'sumocucanj', 'cucanjskok', 'bugarski'],
    SQ2: ['zidsjed', 'boxsquat', 'kangsquat', 'cucanj', 'lungejump'],
    HG: ['goodmorningbw', 'bocarodl', 'bandgm', 'rdlkickstand', 'jednorodl'],
    HG2: ['bandgm', 'bocarodl', 'rdlkickstand', 'jednorodl', 'jednorodl'],
    BR: ['bridge', 'jastukmost', 'bandbridge', 'singlebridge', 'hipthrust1'],
    BR2: ['frogpump', 'jastukmost', 'singlebridge', 'hipthrust1', 'hipthrust1'],
    ABD: ['abdstolica', 'abdgumom', 'sidelift', 'standabd', 'bandsquatwalk'],
    ABD2: ['standabd', 'sidelift', 'firehydrant', 'abdgumom', 'bandsquatwalk'],
    CLAM: ['clamshell', 'clamshell', 'firehydrant', 'firehydrant', 'kickbackguma'],
    LUN: ['klizniiskorak', 'iskorak', 'curtsy', 'iskorakhod', 'bugarski'],
    LUN2: ['stepup', 'lateralnilunge', 'bocalunge', 'curtsy', 'pistol'],
    CALF: ['listovi', 'listovi', 'listovi', 'listovi', 'listovi'],
    PUSH: ['sklekzid', 'skleknakoljenima', 'sklek', 'diamondsklek', 'pikesklek'],
    PUSH2: ['floorpress', 'stolicasklek', 'skleknakoljenima', 'sklek', 'diamondsklek'],
    ROW: ['bocaveslanje', 'veslanjeguma', 'veslanje', 'renegade', 'gorillarow'],
    SH: ['bocarazmah', 'bocapotisak', 'arnold', 'uprightrow', 'zpotisak'],
    REAR: ['ytw', 'm_gumapull', 'swimmers', 'm_v_podizanje', 'm_gumaveslo'],
    ARM: ['bocapregib', 'bocatriceps', 'hammer', 'triceps', 'tricepsrb'],
    UP: ['crunch', 'hollow', 'planka', 'planksavijanje', 'sklopke'],
    LOW: ['heel', 'toetaps', 'legraise', 'flutter', 'skarice'],
    LAT: ['bocnaplankabasic', 'bocnaplankabasic', 'bocnaplanka', 'sideplankdip', 'bocnaplanka'],
    ROT: ['twist', 'bicycle', 'woodchop', 'lakatkoljeno', 'mountainclimb']
  };
  const TIME = new Set(['planka', 'hollow', 'bocnaplankabasic', 'bocnaplanka', 'flutter', 'skarice', 'zidsjed', 'mountainclimb']);
  const UNI = { klizniiskorak: 'po nozi', iskorak: 'po nozi', curtsy: 'po nozi', iskorakhod: 'po nozi', bugarski: 'po nozi', pistol: 'po nozi', stepup: 'po nozi', bocalunge: 'po nozi', singlebridge: 'po nozi', hipthrust1: 'po nozi', rdlkickstand: 'po nozi', jednorodl: 'po nozi', lateralnilunge: 'po strani', clamshell: 'po strani', firehydrant: 'po strani', sidelift: 'po strani', standabd: 'po strani', kickbackguma: 'po strani', bocnaplankabasic: 'po strani', bocnaplanka: 'po strani', sideplankdip: 'po strani', veslanje: 'po strani', renegade: 'po strani', gorillarow: 'po strani', lakatkoljeno: 'po strani' };
  const SPORO = { 4: 'Spuštanje 3 s.', 5: 'Spuštanje 4 s i kratka pauza u najnižoj tački.' };
  const NOTA = { listovi: ['', '', 'Pauza 1 s na vrhu.', 'Na jednoj nozi, drži se zida.', 'Na jednoj nozi, spuštanje 4 s.'] };
  const lvl = (w) => Math.ceil(w / 2), par = (w) => (w % 2 === 0 ? 1 : 0);
  const rep = (id, w) => {
    const l = lvl(w), b = par(w), u = UNI[id] ? ' ' + UNI[id] : '';
    if (TIME.has(id)) return ([30, 35, 40, 45, 50][l - 1] + (b ? 5 : 0)) + ' s' + u;
    if (UNI[id]) return (b ? 12 : 10) + u;
    return String(b ? 15 : 12);
  };
  const CIRK = 'Krug: radiš vježbe jednu za drugom bez pauze. 3 kruga, pauza 90 s između krugova.';
  const CIRK_C = 'Krug: vježbe jednu za drugom bez pauze. 3 kruga, pauza 60 s između krugova.';
  /* lad = ljestvica, first/last = prva/zadnja vježba u krugu */
  const slot = (lad, first, last, core) => {
    const kw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => {
      const id = LAD[lad][lvl(w) - 1];
      let n = [];
      if (first) n.push(core ? CIRK_C : CIRK);
      if (SPORO[lvl(w)] && !TIME.has(id)) n.push(SPORO[lvl(w)]);
      if (NOTA[id] && NOTA[id][lvl(w) - 1]) n.push(NOTA[id][lvl(w) - 1]);
      if (lad === 'CLAM' && lvl(w) === 2) n.push('Zadrži 3 s na vrhu.');
      if (lad === 'CLAM' && lvl(w) === 4) n.push('Uz gumu oko koljena, zadrži 2 s.');
      if (id === 'hipthrust1' && lvl(w) === 5) n.push('Uz gumu oko koljena.');
      return { id, s: 3, r: rep(id, w), n: n.join(' '), p: last ? (core ? 60 : 90) : 0, fix: true };
    });
    return { id: kw[0].id, s: 3, r: kw[0].r, fix: true, p: kw[0].p, kw };
  };
  const set = (lads, core) => lads.map((l, i) => slot(l, i === 0, i === lads.length - 1, core));
  FS._kuca = { set };
  const dan = (naziv, parts) => ({ naziv, vj: [].concat(...parts) });

  /* intervalni kardio, 40 min: 5 min zagrijavanje + 5 krugova × 6 min + 5 min hlađenje */
  const HI = [
    ['highknees', 'bocacucanj', 'stolicasklek', 'nevidljiva', 'bridge', 'toetaps'],
    ['jumpingjack', 'bandsquat', 'skleknakoljenima', 'mountainclimb', 'bandbridge', 'flutter'],
    ['squatjacks', 'curtsy', 'sklek', 'skaterhop', 'singlebridge', 'planksavijanje'],
    ['cucanjskok', 'iskorakhod', 'diamondsklek', 'mountainclimb', 'singlebridge', 'sklopke'],
    ['burpee', 'lungejump', 'pikesklek', 'plankhops', 'tuckjump', 'skaterhop']
  ];
  const WR = [[30, 30], [35, 25], [40, 20], [40, 20], [45, 15]];
  const hiit = () => {
    const mk = (i, pos) => {
      const kw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((w) => {
        const l = lvl(w), id = HI[l - 1][i], [r, o] = WR[l - 1];
        const note = i === 0 ? 'Odradi cijeli krug od 6 vježbi: ' + r + ' s rad, ' + o + ' s odmor. 5 krugova bez dodatne pauze. Ako ti treba, smanji tempo, ne tehniku.' : (i === 5 ? 'Poslije 5. kruga kreni na hlađenje.' : '');
        return { id, s: 5, r: r + ' s rad / ' + o + ' s odmor', n: note, p: 0, fix: true };
      });
      return { id: kw[0].id, s: 5, r: kw[0].r, fix: true, p: 0, kw };
    };
    const zag = { id: 'hodanje', s: 1, r: '5 min', n: 'Zagrijavanje: lagano marširanje u mjestu, kruženja ramenima i kukovima.', p: 0, fix: true };
    const hl = { id: 'm_zadnja_loza', s: 1, r: '5 min', n: 'Hlađenje: lagano hodanje po sobi i istezanje nogu i leđa.', p: 0, fix: true };
    return { naziv: 'Dan 4 · Intervalni kardio (40 min)', vj: [zag].concat([0, 1, 2, 3, 4, 5].map((i) => mk(i)), [hl]) };
  };

  const def = {
    id: 'kuca2', naziv: 'Kućni trening · 5 nivoa', nivo: 'početni', sedmica: 10, dana: 4, cijena: 29, tip: 'gotov', uShopu: false,
    opis: 'Deset sedmica treninga kod kuće sa samo tri rekvizita: jastuk, zatvorena mini guma i flaša vode. Četiri treninga sedmično, pet nivoa po dvije sedmice. Svaki nivo donosi teže varijacije istih pokreta.',
    per: { tip: 'nema', deload: 0 },
    bilj: [
      'Rekviziti: jastuk, zatvorena mini guma (petlja oko koljena) i dvije flaše vode od 1,5 l (ili jedna po ruci). Stolica za neke vježbe. Prostirka je poželjna.',
      'Raspored sedmice: Dan 1 noge + gornji dio tijela + stomak, Dan 2 gornji dio + noge + stomak, Dan 3 samo noge, Dan 4 intervalni kardio 40 minuta.',
      'Svaki nivo traje 2 sedmice: 1–2 Nivo 1, 3–4 Nivo 2, 5–6 Nivo 3, 7–8 Nivo 4, 9–10 Nivo 5. U drugoj sedmici nivoa radiš više ponavljanja ili duže vrijeme.',
      'Vježbe se rade u krugovima: sve vježbe jednu za drugom bez pauze, 3 kruga, pauza 90 sekundi između krugova (stomak 60 s).',
      'Zagrij se 5 minuta prije svakog treninga: kruženja kukovima i ramenima, čučanj tjelesnom težinom, most za gluteus.',
      'Težinu flaše odaberi tako da zadnja dva ponavljanja budu teška, ali tehnika ostane čista. Mini gumu stavi iznad koljena, a za laganije varijante oko stopala.',
      'Ako imaš zdravstvenih tegoba ili si poslije porođaja, program dogovori s ljekarom i trenericom.'
    ],
    dani: [
      dan('Dan 1 · Noge, gornji dio i stomak', [set(['SQ', 'BR', 'ABD', 'CLAM']), set(['PUSH', 'ROW', 'SH']), set(['UP', 'LOW', 'LAT', 'ROT'], true)]),
      dan('Dan 2 · Gornji dio, noge i stomak', [set(['PUSH2', 'ROW', 'REAR', 'ARM']), set(['LUN', 'HG', 'BR2']), set(['UP', 'LOW', 'LAT', 'ROT'], true)]),
      dan('Dan 3 · Samo noge', [set(['SQ2', 'HG2', 'LUN2', 'BR2']), set(['ABD2', 'CLAM', 'CALF'])]),
      hiit()
    ]
  };
  const i = FS.GOTOVI.findIndex((g) => g.id === 'kuca2');
  if (i >= 0) FS.GOTOVI[i] = def; else FS.GOTOVI.push(def);
})();
