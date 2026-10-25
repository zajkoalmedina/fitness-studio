/* Dodatne vježbe, mišićne grupe i gotovi programi (prilagođeni iz knjige i provjereni prema dokazima) */
(function () {
  const FS = (window.FS = window.FS || {});
  const E = (id, naziv, grupa, nivo, oprema, dij, koraci, savjeti, greske) => ({ id, naziv, grupa, nivo, oprema, dij, koraci, savjeti, greske, video: '' });
  const ex = (id, s, r, n) => ({ id, s, r, n: n || '' });

  FS.EXERCISES.push(
    E('sklek', 'Sklek', 'Prsa', 'početni', 'Bez opreme (po potrebi klupa ili zid)', 'kasnije',
      ['Dlanovi su nešto šire od ramena, tijelo u ravnoj liniji od glave do pete.', 'Spuštaj grudi prema podu uz laktove pod uglom oko 45° od tijela.', 'Odgurni se do ispruženih ruku.', 'Ako je pretežak, radi ga na koljenima ili s rukama na klupi.'],
      ['Trbuh i gluteusi su blago stegnuti.', 'Izdahni pri odgurivanju.'], ['Kukovi propadaju ili se dižu.', 'Laktovi su razmaknuti u stranu pod 90°.']),
    E('bench', 'Potisak šipkom na ravnoj klupi', 'Prsa', 'srednji', 'Šipka, klupa', 'kasnije',
      ['Lezi tako da su oči ispod šipke, lopatice stisnute i spuštene, stopala čvrsto na podu.', 'Skini šipku i spusti je kontrolisano do donjeg dijela grudi.', 'Potisni šipku gore do ispruženih ruku.', 'Prvi put vježbaj uz pomoć osobe koja te čuva.'],
      ['Zglobovi ruku ostaju iznad laktova.', 'Spuštanje traje oko 2 sekunde.'], ['Odbijanje šipke od grudi.', 'Podizanje kukova s klupe.']),
    E('kosibucice', 'Kosi potisak bučicama', 'Prsa', 'srednji', 'Bučice, kosa klupa (30°)', 'kasnije',
      ['Klupa je pod uglom 30° do 45°, bučice su u visini ramena.', 'Potisni bučice gore i lagano ih približi iznad grudi.', 'Spusti polako do istezanja u prsima.', 'Zadrži lopatice stisnute uz klupu.'],
      ['Kut klupe do 45°, strmije više opterećuje ramena.', 'Bučice se spuštaju do visine grudi.'], ['Prestrma klupa.', 'Laktovi previše razmaknuti.']),
    E('veslanjekabl', 'Veslanje sjedeći na spravi (uski hvat)', 'Leđa', 'početni', 'Sprava ili kabl za veslanje', 'kasnije',
      ['Sjedni uspravno, stopala čvrsto oslonjena, hvat uz tijelo.', 'Povuci laktove unazad prema kukovima uz stezanje lopatica.', 'Zadrži 1 sekundu.', 'Vrati ruke polako do punog istezanja.'],
      ['Trup miran, pokret dolazi iz laktova i lopatica.', 'Ramena ostaju spuštena.'], ['Ljuljanje trupa.', 'Podizanje ramena prema ušima.']),
    E('veslanjesipka', 'Veslanje u pretklonu sa šipkom', 'Leđa', 'srednji', 'Šipka', 'kasnije',
      ['Stani u širinu kukova, savij koljena i nagni se naprijed s ravnim leđima.', 'Povuci šipku prema donjem dijelu trbuha.', 'Stisni lopatice, pa kontrolisano spusti.', 'Za početnice je lakša varijanta veslanje bučicom ili na spravi.'],
      ['Leđa ostaju ravna, trup nepomičan.', 'Kreni s lakšim opterećenjem.'], ['Zaobljena leđa.', 'Zamah trupom.']),
    E('legpress', 'Potisak nogama (leg press)', 'Noge', 'početni', 'Leg press sprava', 'kasnije',
      ['Sjedni, stopala u širini ramena na sredini platforme.', 'Spusti platformu do savijenih koljena oko 90°.', 'Odgurni kroz cijela stopala bez potpunog ispružanja koljena.', 'Donji dio leđa ostaje uz naslon.'],
      ['Koljena prate smjer prstiju.', 'Izdahni pri potisku.'], ['Donji dio leđa se odvaja od naslona.', 'Koljena upadaju prema unutra.']),
    E('legcurl', 'Fleksija zadnje lože na spravi', 'Noge', 'početni', 'Sprava za zadnju ložu (sjedeća ili ležeća)', 'kasnije',
      ['Podesi spravu tako da je os sprave u visini koljena.', 'Povuci jastuče prema gluteusima.', 'Zadrži kratko u kontrakciji.', 'Vrati polako, spuštanje traje oko 2 do 3 sekunde.'],
      ['Kukovi ostaju na podlozi.', 'Kontrolisano spuštanje je važno koliko i podizanje.'], ['Podizanje kukova.', 'Prebrz povratak.']),
    E('legext', 'Ekstenzija nogu na spravi', 'Noge', 'početni', 'Sprava za prednju ložu', 'kasnije',
      ['Podesi naslon tako da su koljena u liniji s osom sprave.', 'Ispruži noge do kraja.', 'Zadrži 1 sekundu.', 'Spusti polako.'],
      ['Lakše je jednu po jednu nogu ako ti je jedna slabija.', 'Bez zamaha.'], ['Zamah i trzaj.', 'Podizanje bedara sa sjedala.']),
    E('abdukcija', 'Abdukcija na spravi', 'Gluteusi', 'početni', 'Sprava za abdukciju', 'kasnije',
      ['Sjedni i blago nagni trup naprijed (naglasak ide na gluteus).', 'Razmakni noge prema van do kraja pokreta.', 'Zadrži 1 sekundu.', 'Vrati polako, bez spuštanja utega na stack.'],
      ['Trup blago nagnut naprijed.', 'Lagan teret i više ponavljanja (15 do 30) odgovara ovoj vježbi.'], ['Zamah i trzaj.', 'Oslanjanje na leđa umjesto na noge.']),
    E('abdgumom', 'Abdukcija / lateralni hod s gumom', 'Gluteusi', 'početni', 'Mini guma oko koljena', 'kasnije',
      ['Stavi gumu iznad koljena, stani u blagi polučučanj.', 'Korači bočno uz stalnu tenziju na gumi.', 'Stopala ostaju paralelna, koljena ne upadaju prema unutra.', 'Vrati se u suprotnom smjeru.'],
      ['Ostani u blagom čučnju cijelo vrijeme.', 'Koraci su kratki i kontrolisani.'], ['Koljena upadaju prema unutra.', 'Guma je spuštena do stopala.']),
    E('backext', 'Hiperekstenzija (45°)', 'Leđa', 'početni', 'Sprava za hiperekstenziju, po želji bučica', 'kasnije',
      ['Osloni kukove na jastuk, tijelo u liniji s nogama.', 'Spusti trup do ugla oko 90° u kukovima.', 'Podigni se stezanjem gluteusa i zadnje lože.', 'Zaustavi se u ravnoj liniji, bez zabacivanja.'],
      ['Za glutee: zaobli gornji dio leđa blago i stegni gluteuse.', 'Ne zabacuj se iznad ravne linije.'], ['Pretjerana ekstenzija leđa.', 'Zamah.']),
    E('frontcucanj', 'Prednji čučanj sa šipkom', 'Noge', 'napredni', 'Šipka, stalak', 'kasnije',
      ['Šipka leži na prednjem dijelu ramena, laktovi visoko.', 'Spusti se u čučanj uz uspravan trup.', 'Odgurni se kroz cijela stopala.', 'Prvi put vježbaj s lakom šipkom ili uz trenera.'],
      ['Laktovi su stalno podignuti.', 'Teret ide na pete i sredinu stopala.'], ['Laktovi padaju.', 'Trup se naginje naprijed.']),
    E('cucanjsipka', 'Čučanj sa šipkom (zadnji)', 'Noge', 'srednji', 'Šipka, stalak', 'kasnije',
      ['Šipka leži na gornjem dijelu leđa, stopala u širini ramena.', 'Udahni, zategni trup i spusti se do paralele ili duboko koliko možeš uz ravna leđa.', 'Izdahni i odgurni se kroz cijela stopala.', 'Početnice prvo savladaju gobletov čučanj.'],
      ['Koljena prate smjer stopala.', 'Zategni trup prije svakog ponavljanja.'], ['Leđa se zaobljuju na dnu.', 'Pete se odižu.']),
    E('rdlsipka', 'Rumunsko mrtvo dizanje sa šipkom', 'Gluteusi', 'srednji', 'Šipka', 'kasnije',
      ['Drži šipku ispred bedara, koljena blago savijena.', 'Potiskuj kukove unazad, šipka klizi uz noge.', 'Spusti do istezanja u zadnjoj lozi (ispod koljena ili malo niže).', 'Stisni gluteuse i vrati se uspravno.'],
      ['Leđa ravna, pogled nekoliko metara ispred.', 'Šipka cijelo vrijeme dodiruje noge.'], ['Zaobljena leđa.', 'Spuštanje savijanjem leđa umjesto kukova.']),
    E('bugarski', 'Bugarski iskorak', 'Noge', 'srednji', 'Klupa, bučice', 'kasnije',
      ['Stražnje stopalo (nazuvica) osloni na klupu, prednje stopalo je jedan veliki korak ispred.', 'Spusti stražnje koljeno prema podu.', 'Odgurni se prednjom nogom.', 'Za više glutea nagni trup lagano naprijed, za više kvadricepsa ostani uspravna.'],
      ['Prednje koljeno prati stopalo.', 'Počni bez tereta, pa dodaj bučice.'], ['Prednje stopalo je preblizu klupi.', 'Gubitak ravnoteže zbog prevelikog tereta.']),
    E('iskorakhod', 'Iskorak u hodu', 'Gluteusi', 'srednji', 'Bez opreme ili bučice/šipka', 'kasnije',
      ['Napravi dug korak naprijed i spusti stražnje koljeno prema podu.', 'Odgurni se prednjom nogom i prenesi težinu na sljedeći korak.', 'Duži korak i blagi pretklon više angažuju gluteus.', 'Hodaj ravno, koraci su jednaki.'],
      ['Trup kontrolisan, bez ljuljanja.', 'Počni bez opterećenja.'], ['Prekratki koraci.', 'Koljeno upada prema unutra.']),
    E('stepup', 'Penjanje na klupu (step up)', 'Noge', 'početni', 'Klupa ili stepenica, bučice', 'kasnije',
      ['Stani ispred klupe, cijelo stopalo postavi na klupu.', 'Odgurni se prednjom nogom i popni se do uspravnog položaja.', 'Spuštaj se polako i kontrolisano.', 'Većinu posla radi noga na klupi.'],
      ['Visina klupe do koljena.', 'Ne odgurivati se zadnjom nogom.'], ['Odgurivanje zadnjom nogom.', 'Prevelika klupa.']),
    E('pullthrough', 'Cable pull-through', 'Gluteusi', 'srednji', 'Kabl (niski), uže', 'kasnije',
      ['Stani leđima prema kablu, uže prolazi između nogu.', 'Potisni kukove unazad uz blago savijena koljena.', 'Iz kukova se uspravi stezanjem gluteusa.', 'Ruke su samo kuka, ne vuku.'],
      ['Leđa ravna, pokret iz kukova.', 'Stisni gluteuse na vrhu.'], ['Vučenje rukama.', 'Zaobljena leđa.']),
    E('kickback', 'Kick back na kablu', 'Gluteusi', 'početni', 'Kabl, manžeta za gležanj', 'kasnije',
      ['Osloni se rukama na sprave, trup blago nagnut.', 'Odnesi nogu unazad stezanjem gluteusa.', 'Zadrži 1 sekundu, bez izvijanja donjeg dijela leđa.', 'Vrati polako.'],
      ['Pokret dolazi iz kuka.', 'Zdjelica ostaje mirna.'], ['Izvijanje u donjem dijelu leđa.', 'Zamah nogom.']),
    E('hipthrust1', 'Hip thrust na jednoj nozi', 'Gluteusi', 'srednji', 'Klupa', 'kasnije',
      ['Osloni gornji dio leđa na klupu, jedno stopalo na podu, druga noga savijena.', 'Podigni kukove do ravne linije.', 'Stisni gluteus, spusti kontrolisano.', 'Radi isti broj ponavljanja na obje strane.'],
      ['Brada blizu grudi.', 'Kukovi ostaju vodoravni.'], ['Kukovi se okreću.', 'Prevelik luk u leđima.']),
    E('frogpump', 'Frog pump', 'Gluteusi', 'početni', 'Bez opreme', 'kasnije',
      ['Lezi na leđa, stopala spojena, koljena otvorena prema van.', 'Podigni kukove stezanjem gluteusa.', 'Zadrži 1 sekundu na vrhu.', 'Spusti i ponovi, obično više ponavljanja (20 do 30).'],
      ['Odlična završna vježba za gluteuse.', 'Gura se kroz stopala.'], ['Izvijanje leđa.', 'Prebrz tempo.']),
    E('curlloptom', 'Fleksija zadnje lože na lopti', 'Noge', 'srednji', 'Pilates lopta', 'kasnije',
      ['Lezi na leđa, listovi ili pete na lopti, kukovi podignuti.', 'Priteži loptu prema gluteusima uz podignute kukove.', 'Ispruži noge uz zadržane kukove.', 'Za lakši oblik radi bez podizanja kukova.'],
      ['Kukovi ostaju visoko cijelo vrijeme.', 'Polagan tempo.'], ['Kukovi propadaju.', 'Prebrz tempo.']),
    E('reversepec', 'Zadnja ramena (reverse pec deck / letenje u pretklonu)', 'Ramena', 'početni', 'Sprava ili bučice', 'kasnije',
      ['Sjedni prsima uz jastuk ili se nagni naprijed s bučicama.', 'Razmakni ruke u stranu do visine ramena.', 'Lopatice se stežu uz kraj pokreta.', 'Vrati polako.'],
      ['Lagan teret, više ponavljanja.', 'Laktovi blago savijeni.'], ['Zamah trupom.', 'Podizanje ramena prema ušima.']),
    E('potisaksipka', 'Potisak šipkom iznad glave', 'Ramena', 'srednji', 'Šipka', 'kasnije',
      ['Stani u širinu kukova, šipka na prednjem dijelu ramena.', 'Stegni gluteuse i trbuh, potisni šipku iznad glave.', 'Glava prolazi naprijed kad šipka prođe lice.', 'Spusti kontrolisano do ramena.'],
      ['Rebra ostaju spuštena.', 'Izdahni pri potisku.'], ['Prevelik luk u leđima.', 'Šipka ide previše daleko naprijed.']),
    E('tricepskabl', 'Triceps na kablu (potisak dolje)', 'Ruke', 'početni', 'Kabl, uže ili šipka', 'kasnije',
      ['Stani uz kabl, laktovi uz tijelo.', 'Ispruži ruke prema dolje.', 'Zadrži 1 sekundu, bez pomjeranja laktova.', 'Vrati polako do 90°.'],
      ['Laktovi se ne miču.', 'Trup uspravan.'], ['Naginjanje trupa.', 'Laktovi odlaze naprijed.']),
    E('listovi', 'Podizanje na prste (listovi)', 'Noge', 'početni', 'Stepenica ili sprava, bučice', 'kasnije',
      ['Stani na rub stepenice s prednjim dijelom stopala.', 'Spusti pete ispod nivoa stepenice do istezanja.', 'Podigni se što više na prste.', 'Zadrži 1 sekundu gore.'],
      ['Puni raspon pokreta je važan.', 'Polagan tempo.'], ['Kratak raspon pokreta.', 'Odskakanje.'])
  );

  /* mišićna grupa po vježbi: [primarna, sekundarna]. Računaju se samo direktne (primarne) serije. */
  FS.MISICI = ['leđa', 'grudi', 'kvadriceps', 'glutei', 'zadnja loža', 'ramena', 'biceps', 'triceps', 'listovi', 'core'];
  FS.MUSCLE = {
    cucanj: ['kvadriceps', 'glutei'], goblet: ['kvadriceps', 'glutei'], rdl: ['zadnja loža', 'glutei'], iskorak: ['kvadriceps', 'glutei'],
    bridge: ['glutei', 'zadnja loža'], hipthrust: ['glutei'], sidelift: ['glutei'], veslanje: ['leđa', 'biceps'], lat: ['leđa', 'biceps'],
    sklekzid: ['grudi', 'triceps'], potisakb: ['grudi', 'triceps'], ramena: ['ramena', 'triceps'], bocno: ['ramena'], biceps: ['biceps'], triceps: ['triceps'],
    planka: ['core'], crunch: ['core'], twist: ['core'], deadbug: ['core'], birddog: ['core'], tva: ['core'], zdjelica: ['core'], heel: ['core'], vakuum: ['core'],
    sklek: ['grudi', 'triceps'], bench: ['grudi', 'triceps'], kosibucice: ['grudi', 'ramena'], veslanjekabl: ['leđa', 'biceps'], veslanjesipka: ['leđa', 'biceps'],
    legpress: ['kvadriceps', 'glutei'], legcurl: ['zadnja loža'], legext: ['kvadriceps'], abdukcija: ['glutei'], abdgumom: ['glutei'], backext: ['glutei', 'zadnja loža'],
    frontcucanj: ['kvadriceps', 'glutei'], cucanjsipka: ['kvadriceps', 'glutei'], rdlsipka: ['zadnja loža', 'glutei'], bugarski: ['kvadriceps', 'glutei'],
    iskorakhod: ['glutei', 'kvadriceps'], stepup: ['kvadriceps', 'glutei'], pullthrough: ['glutei', 'zadnja loža'], kickback: ['glutei'], hipthrust1: ['glutei'],
    frogpump: ['glutei'], curlloptom: ['zadnja loža'], reversepec: ['ramena'], potisaksipka: ['ramena', 'triceps'], tricepskabl: ['triceps'], listovi: ['listovi']
  };
  const GRUPA_MISIC = { Noge: 'kvadriceps', Gluteusi: 'glutei', Leđa: 'leđa', Prsa: 'grudi', Ramena: 'ramena', Ruke: 'biceps', Core: 'core' };
  FS.primMisic = (id) => {
    if (FS.MUSCLE[id]) return FS.MUSCLE[id][0];
    if (FS.EXTRA_MUSKUL && FS.EXTRA_MUSKUL[id]) return FS.EXTRA_MUSKUL[id].p[0];
    const e = (FS.EXERCISES || []).find((x) => x.id === id) || (window.FS.Store && FS.Store.ex ? FS.Store.ex(id) : null);
    return e ? GRUPA_MISIC[e.grupa] || null : null;
  };

  const NAPOMENE_KNJIGA = [
    'Ovaj program je prilagođen iz tvog materijala i provjeren prema smjernicama za trening snage i hipertrofije.',
    'Ostavi 1 do 3 ponavljanja u rezervi na većini serija. Zadnja serija izolacionih vježbi može ići bliže otkazu.',
    'Napreduj dvostrukim pravilom: kad u svim serijama dosegneš gornju granicu ponavljanja, povećaj težinu za 2 do 5 %.',
    'Odmor između serija: 2 do 3 minute za teške složene vježbe, 60 do 90 sekundi za ostale.'
  ];

  FS.GOTOVI.push(
    { id: 'pocetnice3', naziv: 'Početnice – full body 3× sedmično', opis: 'Osam sedmica uvoda u trening snage uz sve glavne pokrete tijela, tri dana sedmično.', nivo: 'početni', sedmica: 8, dana: 3, cijena: 49, tip: 'gotov', uShopu: true,
      per: { tip: 'blok', deload: 4 },
      bilj: NAPOMENE_KNJIGA.concat(['Prve četiri sedmice drži isti broj serija, zatim program dodaje po jednu seriju na glavnim vježbama, pa slijedi deload.']),
      dani: [
        { naziv: 'Trening 1', vj: [ex('sklek', 3, '8–10', 'Po potrebi na koljenima ili uz klupu'), ex('goblet', 3, '10'), ex('lat', 3, '10', 'Široki hvat ispred glave'), ex('ramena', 3, '10'), ex('legcurl', 3, '12–15', 'Sjedeća sprava'), ex('planka', 2, '20–30 s')] },
        { naziv: 'Trening 2', vj: [ex('rdl', 3, '10'), ex('kosibucice', 3, '10'), ex('iskorakhod', 3, '10 po nozi'), ex('veslanjekabl', 3, '10'), ex('biceps', 3, '12')] },
        { naziv: 'Trening 3', vj: [ex('lat', 3, '10', 'Uski obrnuti hvat'), ex('legpress', 3, '10'), ex('bocno', 3, '12–15'), ex('backext', 3, '12', 'Vježba zamjenjuje "good morning" jer je sigurnija za početnice'), ex('tricepskabl', 3, '12–15')] }] },
    { id: 'upperlower4', naziv: 'Početnice – Upper/Lower 4× sedmično', opis: 'Osam sedmica podjele gornji/donji dio tijela, četiri puta sedmično, s fokusom na osnovne vježbe.', nivo: 'početni', sedmica: 8, dana: 4, cijena: 59, tip: 'gotov', uShopu: true,
      per: { tip: 'blok', deload: 4 },
      bilj: NAPOMENE_KNJIGA.concat(['U odnosu na original, teški "front squat" i "good morning" za početnice su zamijenjeni sigurnijim čučnjem i rumunskim mrtvim dizanjem, a zgib je zamijenjen povlačenjem na lat spravi.']),
      dani: [
        { naziv: '1. Upper', vj: [ex('bench', 3, '6–8'), ex('veslanjesipka', 3, '6–8'), ex('kosibucice', 3, '8–10'), ex('lat', 3, '8–10'), ex('bocno', 3, '15')] },
        { naziv: '2. Lower', vj: [ex('cucanjsipka', 3, '6–8'), ex('rdl', 3, '8–10'), ex('iskorak', 3, '8 po nozi'), ex('listovi', 3, '12')] },
        { naziv: '3. Upper', vj: [ex('potisakb', 3, '10'), ex('veslanje', 3, '10 po strani'), ex('ramena', 3, '10'), ex('lat', 3, '10', 'Uski hvat'), ex('biceps', 3, '10'), ex('tricepskabl', 3, '10')] },
        { naziv: '4. Lower', vj: [ex('rdlsipka', 3, '8'), ex('legpress', 3, '8–10'), ex('legext', 3, '12'), ex('legcurl', 3, '12')] }] },
    { id: 'glutefb4', naziv: 'Srednji nivo – full body s akcentom na gluteuse', opis: 'Osam sedmica, četiri treninga sedmično, gluteusi se treniraju svaki dan uz zadržan rad za cijelo tijelo.', nivo: 'srednji', sedmica: 8, dana: 4, cijena: 69, tip: 'gotov', uShopu: true,
      per: { tip: 'linearna', deload: 4 },
      bilj: NAPOMENE_KNJIGA.concat(['Gluteusi dobijaju oko 20 direktnih serija sedmično, što je gornja granica korisnog volumena. Ako ti se oporavak pogorša, izbaci po jednu seriju abdukcija. Bugarski iskorak je u originalu bio bez tereta i 3×20, ovdje je s bučicama i 8 do 12 ponavljanja po nozi.']),
      dani: [
        { naziv: 'Trening 1', vj: [ex('bridge', 2, '10', 'Zagrijavanje i aktivacija glutea'), ex('potisaksipka', 4, '5–6'), ex('cucanjsipka', 4, '6'), ex('lat', 3, '8–12', 'Uski hvat, zadnja serija do otkaza'), ex('legcurl', 3, '12–15', 'Ležeća sprava'), ex('abdukcija', 3, '20–30')] },
        { naziv: 'Trening 2', vj: [ex('hipthrust', 3, '12–15', 'S gumom oko koljena'), ex('bench', 3, '10–12'), ex('rdl', 3, '12', 'B-stance (jedna noga unaprijed)'), ex('veslanjekabl', 3, '12'), ex('stepup', 3, '12 po nozi'), ex('abdgumom', 2, '25', 'Sjedeći, trup nagnut naprijed')] },
        { naziv: 'Trening 3', vj: [ex('bridge', 3, '15–20', 'S šipkom i gumom oko koljena'), ex('ramena', 3, '8–10', 'Stojeći'), ex('frontcucanj', 3, '8–10'), ex('lat', 3, '10', 'Široki hvat'), ex('backext', 2, '12–15', 'S bučicom, naglasak na gluteusu'), ex('abdgumom', 2, '25', 'Stojeći')] },
        { naziv: 'Trening 4', vj: [ex('hipthrust', 3, '6–8', 'Sa šipkom, teže'), ex('potisakb', 3, '10–12'), ex('bugarski', 3, '10 po nozi', 'S bučicama'), ex('veslanjesipka', 3, '10–12'), ex('rdlsipka', 3, '10–12'), ex('abdgumom', 2, '20', 'Lateralni hod')] }] },
    { id: 'napredni5', naziv: 'Napredni nivo – glutei, 5× sedmično', opis: 'Osam sedmica, pet treninga: lower, upper, lower, upper + glute, lower. Tačno planiran volumen po mišićnim grupama.', nivo: 'napredni', sedmica: 8, dana: 5, cijena: 79, tip: 'gotov', uShopu: true,
      per: { tip: 'blok', deload: 4 },
      bilj: NAPOMENE_KNJIGA.concat(['Volumen je poravnat s tvojom bilješkom: oko 15 serija leđa, 14 grudi, 15 kvadricepsa, 20 glutea i 12 ramena sedmično.', 'U odnosu na original, izbačeni su prednji letovi za ramena (prednja ramena već dobijaju posao u potiscima), a gornji dio je dobio vježbe za grudi.']),
      dani: [
        { naziv: '1. Lower (kvadriceps)', vj: [ex('frontcucanj', 4, '5–6'), ex('rdlsipka', 3, '8'), ex('legcurl', 3, '12–15'), ex('legext', 3, '12'), ex('abdukcija', 4, '20–30')] },
        { naziv: '2. Upper', vj: [ex('ramena', 3, '10', 'Sjedeći potisak'), ex('lat', 4, '10', 'Uski obrnuti hvat'), ex('veslanjekabl', 4, '10–12'), ex('bench', 4, '6–8'), ex('kosibucice', 3, '8–10'), ex('bocno', 3, '15')] },
        { naziv: '3. Lower (glutei)', vj: [ex('hipthrust', 4, '8–12', 'Zadnja serija 20 ponavljanja s 30 % manje kilaže'), ex('pullthrough', 3, '12'), ex('kickback', 3, '15'), ex('planka', 3, '30–45 s')] },
        { naziv: '4. Upper + gluteus', vj: [ex('lat', 4, '10', 'Široki hvat'), ex('veslanje', 3, '10 po strani'), ex('kosibucice', 4, '12'), ex('potisakb', 3, '10–12'), ex('reversepec', 3, '15'), ex('bocno', 3, '15'), ex('biceps', 3, '12'), ex('tricepskabl', 3, '12')] },
        { naziv: '5. Lower (miks)', vj: [ex('bugarski', 4, '10 po nozi'), ex('legpress', 4, '12'), ex('backext', 3, '15', 'Naglasak na gluteusu'), ex('abdgumom', 3, '20', 'Lateralni hod'), ex('curlloptom', 3, '12')] }] }
  );

  /* Gluteus program: dodan gornji dio tijela radi balansa, uz deload svake 4. sedmice */
  Object.assign(FS.GOTOVI.find((x) => x.id === 'gluteus'), {
    naziv: 'Gluteus + gornji dio – balans (8 sedmica)',
    opis: 'Dva treninga za gluteuse i noge, dva za gornji dio tijela. Gluteusi dobijaju najviše pažnje, a gornji dio drži balans i držanje. Deload svake 4. sedmice.',
    nivo: 'srednji', sedmica: 8, dana: 4,
    per: { tip: 'blok', deload: 4 },
    bilj: NAPOMENE_KNJIGA.concat(['Raspored: ponedjeljak gluteusi A, utorak gornji dio A, četvrtak gluteusi B, petak gornji dio B. Između su dani odmora ili lagano kretanje.', 'Deload (4. i 8. sedmica) prepolovi serije i spusti težinu na oko 90 %. Nemoj preskakati.']),
    dani: [
      { naziv: 'Dan 1 · Gluteusi A', vj: [ex('hipthrust', 4, '8–12'), ex('rdl', 3, '10'), ex('bugarski', 3, '10 po nozi', 'Počni bez tereta ako je teško'), ex('abdukcija', 3, '15–20'), ex('frogpump', 2, '20')] },
      { naziv: 'Dan 2 · Gornji dio A', vj: [ex('kosibucice', 3, '10'), ex('lat', 3, '10'), ex('ramena', 3, '10'), ex('veslanjekabl', 3, '12'), ex('bocno', 3, '15'), ex('tricepskabl', 2, '12')] },
      { naziv: 'Dan 3 · Gluteusi B', vj: [ex('goblet', 3, '10'), ex('pullthrough', 3, '12'), ex('stepup', 3, '12 po nozi'), ex('legcurl', 3, '12'), ex('kickback', 3, '15 po nozi')] },
      { naziv: 'Dan 4 · Gornji dio B', vj: [ex('sklek', 3, '8–12', 'Na koljenima ako treba'), ex('veslanje', 3, '10 po strani'), ex('reversepec', 3, '15'), ex('biceps', 2, '12'), ex('planka', 3, '30 s')] }]
  });

  /* bolji nazivi i nešto niže cijene gotovih programa (trenerica ih može mijenjati u panelu) */
  const NOVI = {
    fullbody: ['Prvi koraci · full body', 39], kuca: ['Kućna snaga · bez opreme', 29], pocetnice3: ['Snažni temelji · 3 dana', 39],
    upperlower4: ['Cijelo tijelo · 4 dana', 49], gluteus: ['Glute balans · 8 sedmica', 49], glutefb4: ['Glute fokus · 4 dana', 59], napredni5: ['Glute Pro · 5 dana', 69]
  };
  FS.GOTOVI.forEach((g) => { if (NOVI[g.id]) { g.naziv = NOVI[g.id][0]; g.cijena = NOVI[g.id][1]; } });
  /* cijene paketa mogu se promijeniti u trenerskom panelu */
  FS.paketi = () => FS.PAKETI.map((x) => { const o = FS.Store && FS.Store.db && FS.Store.db.cijene; const v = o && o[x.id]; return v != null && !isNaN(v) ? { ...x, cijena: +v } : x; });
})();
