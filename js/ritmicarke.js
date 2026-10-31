/* Ritmička gimnastika: 7 vođenih treninga od 60 min (crteži poza + tajmer) */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, bind } = FS;
  const V = (FS.views = FS.views || {});

  /* ---------- nove poze (bočni pogled; 0 = dolje, 90 = naprijed, 180 = gore) ---------- */
  const ST = { t: 180, th: 0, sh: 0 };
  const REL = { ft: 22, ft2: 22 };
  FS.EXTRA_POSES = Object.assign(FS.EXTRA_POSES || {}, {
    rg_zamah: [{ ...ST, th2: 40, sh2: 40, ua: 70, fa: 80 }, { ...ST, th2: -32, sh2: -32, ua: 70, fa: 80 }],
    rg_developpe: [{ ...ST, th2: 86, sh2: 4, ua: 60, fa: 75 }, { ...ST, th2: 88, sh2: 88, ua: 60, fa: 75 }],
    rg_arabesque: [{ ...ST, ua: 95, fa: 100, th2: -8, sh2: -8 }, { t: 158, th: 0, sh: 0, th2: -100, sh2: -100, ua: 100, fa: 105 }],
    rg_attitude: [{ ...ST, ua: 150, fa: 170, th2: -8, sh2: -8 }, { t: 168, th: 0, sh: 0, th2: -92, sh2: -168, ua: 150, fa: 172 }],
    rg_passe: [{ ...ST, ...REL, ua: 150, fa: 170, th2: 0, sh2: 0 }, { ...ST, ...REL, ft2: 90, th2: 88, sh2: 4, ua: 150, fa: 172 }],
    rg_stoj: [{ ...ST, th2: 50, sh2: 20, ua: 80, fa: 85 }, { ...ST, th2: 68, sh2: 60, ua: 90, fa: 95 }],
    rg_poskok: [{ ...ST, ft: 95, ua: 15, fa: 40 }, { ...ST, ft: 20, lift: 12, ua: 15, fa: 40 }],
    rg_slijetanje: [{ t: 180, th: 0, sh: 0, ft: 40, lift: 30, ua: 20, fa: 20 }, { t: 150, th: 72, sh: -30, ua: 82, fa: 85 }],
    rg_slijetanje1: [{ t: 180, th: 0, sh: 0, th2: 8, sh2: 8, ft: 40, lift: 30, ua: 20, fa: 20 }, { t: 152, th: 66, sh: -28, th2: 20, sh2: -45, ua: 82, fa: 85 }],
    rg_cmj: [{ t: 150, th: 72, sh: -30, ua: -60, fa: -60 }, { t: 180, th: 0, sh: 0, ft: 22, lift: 28, ua: 170, fa: 175 }],
    rg_dalj: [{ t: 150, th: 72, sh: -30, ua: -70, fa: -70 }, { t: 135, th: 50, sh: -10, ft: 60, lift: 22, ua: 100, fa: 105 }],
    rg_kutija: [{ t: 150, th: 72, sh: -30, ua: -60, fa: -60 }, { t: 172, th: 90, sh: 12, ft: 40, lift: 32, ua: 150, fa: 160 }],
    rg_split: [{ ...ST, ua: 40, fa: 60 }, { t: 176, th: 92, sh: 92, th2: -88, sh2: -88, lift: 52, ua: 100, fa: 100 }],
    rg_ring: [{ ...ST, ua: 40, fa: 60 }, { t: 164, th: 92, sh: 92, th2: -95, sh2: -170, lift: 52, ua: 172, fa: 176 }],
    rg_stag: [{ ...ST, ua: 40, fa: 60 }, { t: 178, th: 92, sh: 6, th2: -85, sh2: -150, lift: 52, ua: 100, fa: 100 }],
    rg_pirueta: [{ ...ST, ...REL, th2: 88, sh2: 4, ft2: 90, ua: 150, fa: 172 }, { ...ST, ...REL, th2: 88, sh2: 4, ft2: 90, ua: 105, fa: 150 }],
    rg_start: [{ ...ST, ua: 20, fa: 40 }, { t: 140, th: 52, sh: -40, th2: -30, sh2: -60, ua: -45, fa: 60 }],
    rg_hvatanje: [{ t: 178, th: 20, sh: -10, ua: 100, fa: 100 }, { t: 150, th: 72, sh: -30, ua: 25, fa: 35 }]
  });

  /* ---------- sadržaj treninga ---------- */
  const S = (n, s, d, f) => ({ n, s, d, f: f || '' });
  const B = (naziv, vj) => ({ naziv, vj, s: vj.reduce((a, x) => a + x.s, 0) });
  const WARM = B('Zagrijavanje', [
    S('Lagano kretanje', 300, 'Hod, skip i plesni koraci, postepeno ubrzaj. Puls raste, disanje ostaje mirno.', 'hodanje'),
    S('Krugovi kuka', 60, 'Veliki spori krugovi, po 30 s u svaku stranu.', 'm_kukovi_krug'),
    S('Zamasi nogom', 60, '10 po nozi, naprijed–nazad uz oslonac. Kontrolisano, bez trzaja.', 'rg_zamah'),
    S('Mačka–krava', 60, 'Na sve četiri, savijaj i izvijaj kičmu kroz cijeli raspon.', 'mackakrava'),
    S('Krugovi ramenima', 60, 'Naprijed pa nazad, široko i polako.', 'm_rame_krug'),
    S('Most za gluteuse', 60, '10–12 ponavljanja, stisni gluteuse gore.', 'bridge'),
    S('Dead bug', 60, '8 po strani, donji dio leđa uz pod.', 'deadbug'),
    S('Bird-dog', 60, '8 po strani, zdjelica mirna.', 'birddog')
  ]);
  const COOL = B('Hlađenje', [
    S('Lagano hodanje', 120, 'Smiri puls, diši duboko.', 'hodanje'),
    S('Zadnja loža', 60, '30 s po nozi, bez trzanja.', 'm_zadnja_loza'),
    S('Prednja strana kuka', 60, '30 s po strani, zdjelica podvučena.', 'm_iskorak_kuk'),
    S('Listovi i gležanj', 60, '30 s po nozi, peta na podu.', 'm_gleznj'),
    S('Dječja poza', 60, 'Opusti leđa i ramena.', 'm_djecja'),
    S('Grudni mišići i ramena', 60, 'Ruke uz zid, blago otvori grudi.', 'm_zid'),
    S('Mirno disanje', 60, 'Leđa na podu, spor udah nosom, izdah ustima.', 'disanje')
  ]);

  const TR = [
    { id: 'fleksibilnost', naziv: 'Fleksibilnost', ikona: '🤸', cilj: 'Veći aktivni opseg pokreta u kuku, leđima i ramenima.',
      bl: [
        B('Aktivna fleksibilnost', [
          S('Aktivni développé naprijed', 180, '2×8 po nozi. Podizanje 3 s, držanje 3 s, spuštanje 3 s.', 'rg_developpe'),
          S('Aktivni développé u stranu', 180, '2×8 po nozi, isti ritam. Zdjelica ostaje mirna.', 'abdukcija'),
          S('Aktivni développé nazad (arabesque)', 120, '2×8 po nozi, bez savijanja donjeg dijela leđa.', 'rg_arabesque'),
          S('Podizanje ispružene noge na leđima', 120, '2×10 po nozi, leđa uz pod.', 'm_zadnja_loza')]),
        B('Statičko istezanje', [
          S('Zadnja loža', 180, 'Remen ili traka. 3×30 s po nozi, na ivici nelagode, ne bola.', 'm_zadnja_loza'),
          S('Prednja strana kuka', 180, 'Iskorak sa zdjelicom naprijed. 3×30 s po strani.', 'm_iskorak_kuk'),
          S('Aduktori (žaba i leptir)', 180, '3×40 s. Leđa duga, bez forsiranja.', 'm_zabica'),
          S('Grudni mišići i ramena sa štapom', 180, '3×40 s. Ruke uz štap, rebra mirna.', 'm_zid')]),
        B('PNF istezanje', [
          S('Zadnja loža: kontrakcija–opuštanje', 240, '6 s lagana kontrakcija (20–30 % snage), pa 20 s dublje istezanje. 3 ponavljanja po nozi, uz partnera ili zid.', 'm_zadnja_loza'),
          S('Raznoženje (podjela)', 240, 'Isti obrazac, 3 ponavljanja. Ulazak lagano, bez poskakivanja.', 'm_golub')]),
        B('Leđa i ramena', [
          S('Mačka–krava', 90, '10 ponavljanja.', 'mackakrava'),
          S('Sfinga', 120, '3×20 s, ramena daleko od ušiju.', 'm_kobra'),
          S('Kontrolisani most uz zid ili ručnik', 150, '3×10–15 s, neutralna zdjelica, bez forsiranja donjeg dijela leđa.', ''),
          S('Ekstenzija grudne kralježnice na valjku', 120, '8 ponavljanja, ruke iza glave.', 'm_tekstenzija'),
          S('Rotacija ramena sa štapom', 120, '10 ponavljanja, laktovi ispruženi.', 'm_rame_krug')])
      ], nap: ['Svaku fleksibilnu poziciju završi kratkim držanjem 3×10 s u kraju opsega, aktivnom snagom mišića.', 'Ovaj trening ne ide prije skokova ili sprinta.'] },
    { id: 'ravnoteze', naziv: 'Ravnoteže', ikona: '⚖️', cilj: 'Stabilnost na releveu i u oblicima, jak gležanj i stabilan kuk.',
      bl: [
        B('Propriocepcija', [
          S('Stoj na jednoj nozi, oči otvorene', 180, '3×30 s po nozi.', 'rg_stoj'),
          S('Stoj na jednoj nozi, oči zatvorene', 120, '2×15 s po nozi.', 'rg_stoj'),
          S('Stoj na jastuku ili balans disku', 180, '2×20 s po nozi.', 'rg_stoj')]),
        B('Ravnoteža na releveu', [
          S('Relevé passé, držanje', 240, '3×10 s, napredak do 3×20 s. Bez oslonca rukom.', 'rg_passe'),
          S('Attitude', 180, '4×5 s po nozi.', 'rg_attitude'),
          S('Arabesque', 180, '4×5 s po nozi.', 'rg_arabesque')]),
        B('Stopalo i gležanj', [
          S('Podizanje na prste', 180, '3×12, dvije noge pa jedna.', 'listovi'),
          S('Kratko stopalo (short foot)', 120, '3×10 s, luk stopala podignut, prsti dole.', ''),
          S('Podizanje prstiju (tibialis)', 90, '2×15, leđa uz zid.', ''),
          S('Traka: inverzija i everzija', 210, '2×12 po strani.', '')]),
        B('Kuk i trup', [
          S('Rumunski mrtvi dizač na jednoj nozi', 180, 'Bez tega, 3×8 po nozi.', 'm_hinge'),
          S('Bočni most', 150, '3×20–30 s po strani.', ''),
          S('Školjka (clamshell) sa trakom', 150, '2×15 po strani.', '')]),
        B('Dvostruki zadatak', [
          S('Relevé i hvatanje lopte', 120, '3×20 s po nozi, bacaj i hvataj loptu.', 'rg_passe'),
          S('Ravnoteža i okretanje glave', 120, '3×20 s po nozi, glava lijevo–desno.', 'rg_stoj')])
      ], nap: ['Radi obje noge jednako. Počni sa slabijom i ne dopuštaj da razlika među nogama raste.', 'Napredak: duže držanje, zatvorene oči, nestabilna podloga, tek na kraju rekvizit.'] },
    { id: 'skokovi', naziv: 'Skokovi', ikona: '🦘', cilj: 'Veća visina i oblik u zraku (split, ring, stag), uz sigurno slijetanje.',
      bl: [
        B('Priprema stopala', [
          S('Mali poskoci na mjestu', 150, '2×15 s, meko, kroz stopalo.', 'rg_poskok'),
          S('A-skip', 150, '2×15 m, visoka koljena, brz kontakt.', 'hodanje'),
          S('Poskoci na gležnjevima', 180, '2×10, ravna kolena, brz odskok.', 'rg_poskok')]),
        B('Slijetanje', [
          S('Skok sa niskog postolja i zalijepi slijetanje', 240, '3×5, postolje 20–30 cm, zadrži 3 s. Koljena u liniji sa stopalima.', 'rg_slijetanje'),
          S('Slijetanje na jednu nogu', 240, '3×4 po nozi, meko kroz prste i petu.', 'rg_slijetanje1')]),
        B('Pliometrija (3 kruga)', [
          S('Krug 1: skok uvis iz čučnja (5)', 20, '5 ponavljanja, eksplozivno.', 'rg_cmj'),
          S('Krug 1: skok u dalj sa mjesta (4)', 20, '4 ponavljanja, slijetanje mekano.', 'rg_dalj'),
          S('Krug 1: skok na kutiju 30 cm (5)', 20, '5 ponavljanja, silazak korakom.', 'rg_kutija'),
          S('Pauza', 180, 'Odmori 3 minute.', ''),
          S('Krug 2: skok uvis iz čučnja (5)', 20, '5 ponavljanja.', 'rg_cmj'),
          S('Krug 2: skok u dalj sa mjesta (4)', 20, '4 ponavljanja.', 'rg_dalj'),
          S('Krug 2: skok na kutiju 30 cm (5)', 20, '5 ponavljanja.', 'rg_kutija'),
          S('Pauza', 180, 'Odmori 3 minute.', ''),
          S('Krug 3: skok uvis iz čučnja (5)', 20, '5 ponavljanja.', 'rg_cmj'),
          S('Krug 3: skok u dalj sa mjesta (4)', 20, '4 ponavljanja.', 'rg_dalj'),
          S('Krug 3: skok na kutiju 30 cm (5)', 20, '5 ponavljanja.', 'rg_kutija'),
          S('Pauza', 180, 'Odmori 3 minute.', '')]),
        B('Skokovi u formi', [
          S('Split leap, serija 1 od 3', 90, '4 skoka sa 4 kratka koraka zaleta, pa pauza.', 'rg_split'),
          S('Split leap, serija 2 od 3', 90, '4 skoka, naglasak na visinu.', 'rg_split'),
          S('Split leap, serija 3 od 3', 90, '4 skoka, fiksiran oblik u vrhu.', 'rg_split'),
          S('Ring leap, serija 1 od 3', 90, '4 skoka, glava i leđa nazad kontrolisano.', 'rg_ring'),
          S('Ring leap, serija 2 od 3', 90, '4 skoka.', 'rg_ring'),
          S('Ring leap, serija 3 od 3', 90, '4 skoka.', 'rg_ring'),
          S('Stag leap, serija 1 od 2', 90, '4 skoka.', 'rg_stag'),
          S('Stag leap, serija 2 od 2', 90, '4 skoka.', 'rg_stag')])
      ], nap: ['Okvirno oko 80–100 kontakata sa tlom po treningu za početak. Više samo uz nadzor i dobru tehniku.', 'Ako se tehnika slijetanja pokvari (koljena unutra, tvrdo slijetanje), prekini seriju.', 'Ne radi dan prije ili poslije teškog treninga snage nogu.'] },
    { id: 'piruete', naziv: 'Piruete', ikona: '🌀', cilj: 'Stabilna osa, jači trup i fiksiranje pogleda (spotting).',
      bl: [
        B('Spotting i orijentacija', [
          S('Okret u 1/4 uz fiksiranje pogleda', 240, '2×5 po strani, glava dolazi posljednja i vraća se prva. Sporo.', 'rg_pirueta'),
          S('Okret u 1/2 uz fiksiranje pogleda', 240, '2×5 po strani, bez ubrzavanja.', 'rg_pirueta')]),
        B('Osa na releveu', [
          S('Relevé passé, držanje', 240, '3×15 s, kuk iznad stopala.', 'rg_passe'),
          S('Relevé passé, zatvorene oči', 120, '2×10 s.', 'rg_passe'),
          S('Pirueta po fazama', 360, '1/4, 1/2 i pun okret, 4 ponavljanja svaki, po strani.', 'rg_pirueta')]),
        B('Trup', [
          S('Hollow hold', 180, '3×20 s, donja leđa uz pod.', ''),
          S('Bočni most', 180, '3×20 s po strani.', ''),
          S('Pallof pritisak sa trakom', 180, '3×10 po strani, trup se ne okreće.', ''),
          S('Dead bug', 180, '3×8 po strani.', 'deadbug')]),
        B('Pirueta u nizu', [
          S('Serija 1 od 5', 96, '3 piruete lijevo, 3 desno, pauza.', 'rg_pirueta'),
          S('Serija 2 od 5', 96, '3 piruete lijevo, 3 desno, pauza.', 'rg_pirueta'),
          S('Serija 3 od 5', 96, '3 piruete lijevo, 3 desno, pauza.', 'rg_pirueta'),
          S('Serija 4 od 5', 96, '3 piruete lijevo, 3 desno, pauza.', 'rg_pirueta'),
          S('Serija 5 od 5', 96, '3 piruete lijevo, 3 desno, rekvizit tek kad je osa čista.', 'rg_pirueta')])
      ], nap: ['Podjednako radi lijevu i desnu stranu. Pauza ako se javi vrtoglavica.', 'Ne zaredati više od 3 piruete u jednom nizu bez pauze.', 'Ako se osa gubi, vrati se korak nazad (manje okreta).'] },
    { id: 'snaga', naziv: 'Snaga', ikona: '💪', cilj: 'Jače noge, trup i leđa uz umjerena opterećenja i čistu tehniku.',
      bl: [
        B('Noge A', [
          S('Goblet čučanj', 300, '3×8–10, lagani teg ili bez. Pauza oko 1 min.', 'goblet'),
          S('Bugarski čučanj', 300, '3×8 po nozi.', 'bugarski')]),
        B('Noge B i zadnja loža', [
          S('Rumunski mrtvi dizač', 300, 'Laganim tegom, 3×8–10.', 'rdl'),
          S('Most za gluteuse sa jednom nogom', 300, '3×8 po nozi.', 'hipthrust1')]),
        B('Guranje i povlačenje', [
          S('Sklekovi', 200, '3×6–10, na koljenima ili puni.', 'sklek'),
          S('Veslanje sa trakom', 200, '3×10–12.', 'm_gumaveslo'),
          S('Razmicanje trake', 200, '3×12.', 'm_gumapull')]),
        B('Trup', [
          S('Plank', 150, '3×30 s.', 'planka'),
          S('Bočni plank', 150, '3×20–30 s po strani.', ''),
          S('Dead bug', 150, '3×8 po strani.', 'deadbug'),
          S('Bird-dog', 150, '3×8 po strani.', 'birddog')])
      ], nap: ['Težina: serija završava sa 2–3 ponavljanja u rezervi. Tek kad se 3×12 radi čisto, malo povećaj.', 'Za početnice: 1–2 serije i manje ponavljanja uz povratnu informaciju trenera.', 'Redovnost je važnija od težine: gubitak snage nastaje za 8–12 sedmica bez treninga.'] },
    { id: 'reakcija', naziv: 'Brzina reakcije', ikona: '⚡', cilj: 'Brz odgovor na signal uz zadržavanje tehnike.',
      bl: [
        B('Priprema', [
          S('Lagani poskoci i kružno kretanje', 240, 'Probudi stopala i koordinaciju.', 'rg_poskok'),
          S('Hvatanje lopte u mjestu', 240, '2×1 min, bacaj i hvataj sve brže.', '')]),
        B('Reakcija na signal', [
          S('Kratki start na signal, serija 1', 200, '6 ponavljanja 3–5 m. Partner pokazuje boju, smjer ili broj prstiju. Pauza 45–60 s.', 'rg_start'),
          S('Kratki start na signal, serija 2', 200, '6 ponavljanja.', 'rg_start'),
          S('Kratki start na signal, serija 3', 200, '6 ponavljanja.', 'rg_start')]),
        B('Reakcija sa rekvizitom', [
          S('Hvatanje ispuštene loptice', 300, '3×8, uhvati prije drugog odskoka.', 'rg_hvatanje'),
          S('Okret za 180° po signalu i hvatanje', 300, '3×6, vrati se u početni položaj poslije svakog hvatanja.', 'rg_hvatanje')]),
        B('Izbor odgovora', [
          S('Lijevo / desno / skok / čučanj, serija 1', 120, '30 s rada, partner nepredvidljivo zove. Pauza 45 s.', 'rg_poskok'),
          S('Lijevo / desno / skok / čučanj, serija 2', 120, '30 s rada.', 'rg_poskok'),
          S('Lijevo / desno / skok / čučanj, serija 3', 120, '30 s rada.', 'rg_poskok'),
          S('Lijevo / desno / skok / čučanj, serija 4', 120, 'Dodaj dvostruki zadatak (lopta u ruci).', 'rg_poskok')]),
        B('Agilnost', [
          S('Ljestve ili linije, uzorak 1', 60, '2 prolaza, pauza 30–45 s.', 'rg_start'),
          S('Ljestve ili linije, uzorak 2', 60, '2 prolaza.', 'rg_start'),
          S('Ljestve ili linije, uzorak 3', 60, '2 prolaza.', 'rg_start'),
          S('Ljestve ili linije, uzorak 4', 60, '2 prolaza.', 'rg_start')])
      ], nap: ['Radi na svježim nogama. Kad tehnika opadne zbog umora, završi trening.', 'Signal mijenjaj nepredvidljivo, predvidljiv ritam ne uči reakciju.'] },
    { id: 'ledja', naziv: 'Korektivne vježbe za leđa', ikona: '🧘', cilj: 'Stabilan trup, jaki gluteusi i pokretna grudna kralježnica da donji dio leđa ne preuzima opterećenje.',
      bl: [
        B('Pokretljivost', [
          S('Mačka–krava', 90, '10 ponavljanja.', 'mackakrava'),
          S('Provlačenje igle', 120, '8 po strani.', 'm_igla'),
          S('Ekstenzija grudne kralježnice na valjku', 120, '8 ponavljanja.', 'm_tekstenzija'),
          S('Rotacija kuka 90/90', 150, '6 po strani.', 'm_9090')]),
        B('Stabilnost trupa', [
          S('Curl-up', 240, '3 serije 6, 4, 2 sa držanjem 8 s. Mala glava i ramena od poda.', 'crunch'),
          S('Bočni most', 240, '3×10 s po strani.', ''),
          S('Bird-dog', 240, '3×6 sa držanjem 7–10 s. Neutralna leđa, bez ljuljanja.', 'birddog')]),
        B('Kuk i gluteusi', [
          S('Most za gluteuse', 150, '3×12.', 'bridge'),
          S('Most sa jednom nogom', 150, '2×8 po nozi.', 'hipthrust1'),
          S('Školjka (clamshell) sa trakom', 150, '2×15.', ''),
          S('Istezanje prednje strane kuka', 150, '2×30 s po strani, zdjelica nagnuta.', 'm_iskorak_kuk')]),
        B('Lopatice i držanje', [
          S('Y, T i W ležeći na trbuhu', 240, '2×8 svaki oblik.', 'm_v_podizanje'),
          S('Razmicanje trake', 180, '3×12.', 'm_gumapull'),
          S('Klizanje uz zid (wall slides)', 180, '2×10.', 'm_zid')])
      ], nap: ['Izbjegavaj ponovljeno svijanje donjeg dijela leđa unazad pod umorom.', 'Bol koji se širi u nogu, utrnulost ili bol koji se ponavlja u ekstenziji: stani i javi se ljekaru ili fizioterapeutu.', 'Radi 2–3 puta sedmično, redovnost daje rezultat.'] }
  ];
  TR.forEach((t) => { t.bloks = [WARM].concat(t.bl, [COOL]); t.s = t.bloks.reduce((a, b) => a + b.s, 0); t.koraci = []; t.bloks.forEach((b) => b.vj.forEach((v) => t.koraci.push({ ...v, blok: b.naziv }))); });
  FS.RG_TRENINZI = TR;

  /* ---------- prikaz ---------- */
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const hasF = (id) => !!id && (FS.FIGURE_IDS || []).includes(id);
  const fig = (id, u, cls) => (hasF(id) ? h`<div class="${cls || 'fstill'}">${FS.raw(FS.figureSVG(id, u == null ? 1 : u, ''))}</div>` : '');
  let ac = null;
  const beep = (f) => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.08; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.18); } catch (e) { /* bez zvuka */ } };
  const BC = ['#6d7b9c', '#d6b28a', '#8ea0c6', '#d6b28a', '#8ea0c6', '#d6b28a', '#8ea0c6', '#d6b28a', '#6d7b9c'];
  const bar = (t, cur) => h`<div style="display:flex;gap:2px;height:14px;border-radius:7px;overflow:hidden">${t.bloks.map((b, i) => h`<div title="${b.naziv}" style="flex:${b.s};background:${BC[i % BC.length]};opacity:${cur == null || cur === i ? 1 : 0.35}"></div>`)}</div>`;

  const lista = (el) => {
    el.innerHTML = h`<div class="eyebrow">Ritmička gimnastika</div><h1>Dodatni treninzi</h1>
      <p class="muted">Sedam odvojenih treninga od po 60 minuta za takmičarke: 12 min zagrijavanje, 40 min glavni dio, 8 min hlađenje. Tajmer te vodi vježbu po vježbu.</p>
      <div class="card note"><b>Prije početka:</b> treninge treba da vodi kvalifikovan trener. Tehnika ide prije opterećenja, a bol je razlog da staneš. Ne radi svih sedam u istoj sedmici: dva do tri dodatna treninga uz redovne treninge kluba su dovoljna.</div>
      ${TR.map((t) => h`<a class="card" href="#/ritmicarke?t=${t.id}" style="display:block"><div class="row between"><h3 style="margin:0">${t.ikona} ${t.naziv}</h3><span class="badge">${Math.round(t.s / 60)} min</span></div><div class="small muted" style="margin:4px 0 8px">${t.cilj}</div>${bar(t)}</a>`)}`;
  };

  const detalj = (el, t) => {
    el.innerHTML = h`<div class="eyebrow">Ritmička gimnastika · ${Math.round(t.s / 60)} min</div><h1>${t.ikona} ${t.naziv}</h1><p class="muted">${t.cilj}</p>
      <div class="card">${bar(t)}<div class="row between small muted" style="margin-top:6px"><span>Zagrijavanje 12</span><span>Glavni dio 40</span><span>Hlađenje 8</span></div>
        <a class="btn primary block mt" href="#/ritmicarke?t=${t.id}&go=1">Pokreni vođeni trening</a></div>
      ${t.bloks.map((b) => h`<div class="card"><div class="row between"><h3 style="margin:0">${b.naziv}</h3><span class="badge">${Math.round(b.s / 60)} min</span></div>
        <div>${b.vj.map((v) => h`<div class="row" style="gap:10px;align-items:center;padding:8px 0;border-top:1px solid rgba(255,255,255,.08)">${fig(v.f, 1) || h`<div class="fstill" style="visibility:hidden"></div>`}<div style="flex:2"><b>${v.n}</b> · ${v.s >= 60 ? Math.round(v.s / 6) / 10 + ' min' : v.s + ' s'}<div class="small muted">${v.d}</div></div></div>`)}</div></div>`)}
      ${t.nap.length ? h`<div class="card note"><b>Napomene</b><ul class="clean">${t.nap.map((x) => h`<li>${x}</li>`)}</ul></div>` : ''}
      <a class="btn block mb" href="#/ritmicarke">Svi treninzi</a>`;
  };

  const igraj = (el, t) => {
    const K = t.koraci; let i = -1, left = 0, run = false, timer = null, elapsed = 0, last = 0;
    const start = (n) => { i = n; if (i < K.length) { left = K[i].s; beep(880); } else { stop(); beep(520); } draw(); };
    const stop = () => { run = false; clearInterval(timer); timer = null; };
    const mount = () => { const x = K[i]; const box = el.querySelector('#rgf'); if (box && x && hasF(x.f)) FS.mountFigure(box, x.f); };
    const upd = () => { const a = el.querySelector('#rgt'), b = el.querySelector('#rge'); if (a) a.textContent = fmt(left); if (b) b.textContent = fmt(elapsed) + ' / ' + fmt(t.s); };
    const draw = () => {
      const x = K[Math.max(0, i)], fin = i >= K.length;
      const bIdx = fin ? null : t.bloks.findIndex((b) => b.naziv === x.blok);
      el.innerHTML = h`<div class="eyebrow">${t.naziv} · ${Math.round(t.s / 60)} min</div>
        <div class="card" style="text-align:center">
          ${bar(t, bIdx)}
          <div class="small muted" style="margin-top:6px">${i < 0 ? 'Spremna?' : fin ? 'Gotovo' : x.blok + ' · korak ' + (i + 1) + ' od ' + K.length}</div>
          ${i >= 0 && !fin && hasF(x.f) ? h`<div id="rgf" class="fstill big" style="margin:8px 0"></div>` : ''}
          <div id="rgt" style="font-family:var(--serif);font-size:64px;line-height:1.1;margin:6px 0">${i < 0 ? fmt(t.s) : fin ? '✓' : fmt(left)}</div>
          <div style="font-size:20px"><b>${i < 0 ? 'Ukupno 60 min' : fin ? 'Odlično, trening je završen' : x.n}</b></div>
          <div class="small" style="margin-top:4px">${i >= 0 && !fin ? x.d : ''}</div>
          <div class="small muted mt-s">${i >= 0 && !fin && K[i + 1] ? 'Sljedeće: ' + K[i + 1].n : ''}</div>
          <div id="rge" class="small muted mt-s">${fmt(elapsed)} / ${fmt(t.s)}</div>
          <div class="row mt" style="justify-content:center;flex-wrap:wrap;gap:8px">
            ${fin ? h`<a class="btn primary" href="#/ritmicarke">Svi treninzi</a>` : h`${i > 0 ? h`<button class="btn" data-act="prev">Nazad</button>` : ''}${run ? h`<button class="btn" data-act="pause">Pauza</button>` : h`<button class="btn primary" data-act="start">${i < 0 ? 'Start' : 'Nastavi'}</button>`}${i >= 0 ? h`<button class="btn" data-act="next">Dalje</button>` : ''}`}</div></div>
        <a class="btn block mb" href="#/ritmicarke?t=${t.id}">Pregled treninga</a>`;
      mount();
    };
    const tick = () => {
      if (!run) return; const n = Date.now(), d = Math.min(2, Math.round((n - last) / 1000)); if (d < 1) return; last += d * 1000;
      elapsed = Math.min(t.s, elapsed + d); left -= d;
      if (left <= 0) { start(i + 1); if (i < K.length) { run = true; last = Date.now(); tick0(); } } else upd();
    };
    const tick0 = () => { if (!timer) timer = setInterval(tick, 250); };
    draw();
    bind(el, {
      'click:start': () => { run = true; last = Date.now(); if (i < 0) start(0); else draw(); tick0(); },
      'click:pause': () => { stop(); draw(); },
      'click:next': () => { const r = run; elapsed = Math.min(t.s, elapsed + Math.max(0, left)); start(i + 1); if (r && i < K.length) { run = true; last = Date.now(); tick0(); } },
      'click:prev': () => { const r = run; const ns = K.slice(0, i - 1).reduce((a, x) => a + x.s, 0); elapsed = ns; start(Math.max(0, i - 1)); if (r) { run = true; last = Date.now(); tick0(); } }
    });
    const obs = new MutationObserver(() => { if (!document.body.contains(el)) { stop(); obs.disconnect(); } });
    obs.observe(document.body, { childList: true, subtree: true });
    if (FS.onLeave) FS.onLeave(stop);
  };

  V.ritmicarke = (el, p, q) => {
    q = q || {};
    const t = TR.find((x) => x.id === q.t);
    if (!t) return lista(el);
    if (q.go) return igraj(el, t);
    detalj(el, t);
  };
})();
