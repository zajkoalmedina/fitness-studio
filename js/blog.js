/* Blog: javni članci (vidljivi i bez prijave). Novi članak se dodaje u listu FS.BLOG. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h } = FS;
  const V = (FS.views = FS.views || {});
  const B = 'images/blog/';

  FS.BLOG = [
    { id: 'nije-samo-gluteus', naslov: 'Dan nogu svaki dan? Trening je više od gluteusa', oznaka: 'Mitovi', min: 3, datum: '2026-11-26', slika: B + 'leda.jpg', poz: '50% 35%',
      uvod: 'Instagram bi rekao da tijelo ima samo donju polovinu. Tvoja leđa se ne slažu.',
      d: [
        ['Algoritam voli gluteus', 'Na mrežama se najviše guraju trening nogu i gluteusa. Lijepo izgleda u kadru, ali tijelo ne radi u dijelovima, nego kao cjelina.'],
        ['Leđa rade za tebe 16 sati dnevno', 'Leđa, ramena i trup te drže uspravnom dok sjediš za računarom, nosiš torbu ili podižeš kesu iz marketa. Niko ih ne hvali, a stalno rade. Zaslužuju svoj dio plana.'],
        ['Kako izgleda dobar plan', 'Potisci i povlačenja, noge i gornji dio tijela, plus trup. Gluteus ostaje u planu, samo dijeli prostor s ostalima.'],
        ['Mala provjera', 'Ako zadnjih mjesec dana nisi dotakla veslanje, zgibove ili neku vježbu za leđa, vrijeme je da se upoznate.']
      ],
      u: 'Gluteus je dio plana, ne cijeli plan.',
      cta: 'Želiš plan za cijelo tijelo? Javi mi se.' },
    { id: 'tegovi-i-zene', naslov: '"Postat ću glomazna": zašto se većina žena nema čega bojati', oznaka: 'Mitovi', min: 3, datum: '2026-11-25', slika: B + 'sunset.jpg', poz: '50% 30%',
      uvod: 'Da su mišići tako brzi, svi bismo ih dobili preko vikenda. Evo kako stvarno ide.',
      d: [
        ['Mišići ne rastu preko noći', 'Izgradnja mišića je spor proces. Traje mjesecima i godinama, uz redovan trening i dovoljno hrane. Žene u pravilu imaju manje testosterona, pa ide još sporije.'],
        ['Šta tegovi zaista rade', 'Trening snage često donosi čvršće tijelo, bolje držanje i više energije u svakodnevnim stvarima. Rezultati su različiti od osobe do osobe.'],
        ['Počni pametno', 'Kreni s težinom s kojom možeš lijepo izvesti pokret, pa postepeno dodaj. Tehnika ide prije kilograma, a ego ostavi kod garderobe.'],
        ['Ti biraš oblik', 'Plan se uvijek može prilagoditi tvom cilju. Ako ti se nešto ne sviđa, mijenjamo ga, a niko neće biti iznenađen jednog jutra.']
      ],
      u: 'Mišići rastu polako, a ti odlučuješ u kom smjeru idemo.',
      cta: 'Nisi sigurna odakle početi? Napiši mi.' },
    { id: 'salo-na-jednom-mjestu', naslov: 'Trbušnjaci neće istopiti stomak (žao mi je)', oznaka: 'Mitovi', min: 2, datum: '2026-11-24', slika: B + 'sunset2.jpg', poz: '50% 18%',
      uvod: 'Tijelo ne prima narudžbe tipa: "Salo samo sa stomaka, hvala."',
      d: [
        ['Tijelo bira samo', 'Kad troši energiju iz masnih zaliha, tijelo ne pita s kojeg dijela želiš da krene. Vježba za stomak jača mišiće stomaka, ali ne briše salo baš s tog mjesta.'],
        ['Šta zaista pomaže', 'Cijeli plan: trening snage, kretanje preko dana, dovoljno sna i uravnotežena ishrana. Nije glamurozno, ali je pouzdano.'],
        ['Trbušnjaci ipak imaju smisla', 'Jak trup pomaže držanju i stabilnosti. To je druga priča od gubitka masti, ali je jednako korisna.'],
        ['Mjeri pametno', 'Obim struka i kukova te slike kroz vrijeme često kažu više od vage. U aplikaciji možeš unositi mjerenja.']
      ],
      u: 'Cijelo tijelo, cijeli plan, malo strpljenja.',
      cta: 'Želiš plan prilagođen sebi? Javi se.' },
    { id: 'progresivno-opterecenje', naslov: 'Isti trening, ista težina, isti rezultat. Iznenađenje!', oznaka: 'Trening', min: 3, datum: '2026-11-23', slika: B + 'coach.jpg', poz: '55% 45%',
      uvod: 'Ako već mjesecima dižeš istu težinu, tijelo je odavno naučilo gradivo.',
      d: [
        ['Šta je progresivno opterećenje', 'Tijelu povremeno damo malo veći izazov: nešto više kilograma, ponavljanja ili serija. Tako napredak ne stoji.'],
        ['Jednostavno pravilo', 'Kad lijepo odradiš sve serije do gornje granice ponavljanja, povećaj težinu. U aplikaciji dobijaš prijedlog težine na osnovu prošlog treninga.'],
        ['Ne mora svaki dan biti rekord', 'Ima dana kad je teg težak samo zato što je ponedjeljak. Tada ostani na istoj težini i drži tehniku.'],
        ['Lakša sedmica je dio plana', 'Povremeno planiramo deload da se tijelo oporavi i nastavi dalje.']
      ],
      u: 'Malo više, malo po malo, uz dobru tehniku.',
      cta: 'Želiš da pratim tvoj napredak? Javi se.' },
    { id: 'proteini', naslov: 'Proteini: nisu čarolija, ali jesu bitni', oznaka: 'Ishrana', min: 3, datum: '2026-11-22', slika: 'images/recepti/r01.jpg', poz: '50% 50%',
      uvod: 'Prašak nije obavezan. Piletina se neće uvrijediti.',
      d: [
        ['Okvirna količina', 'Za osobe koje treniraju snagu često se navodi oko 1,2 do 2 grama proteina po kilogramu tjelesne težine dnevno. Tačna količina zavisi od osobe.'],
        ['Iz čega ih unositi', 'Meso, riba, jaja, mliječni proizvodi, mahunarke. Prašak je samo praktična dopuna, ne uslov.'],
        ['Rasporedi preko dana', 'Lakše je dodati izvor proteina u svaki obrok nego sve pojesti uveče i nadati se najboljem.'],
        ['Kad je potreban oprez', 'Ako imaš zdravstvenih problema, prije promjene ishrane posavjetuj se s ljekarom ili nutricionistom.']
      ],
      u: 'Redovni obroci s proteinima su važniji od najskupljeg praška.',
      cta: 'Kalkulator kalorija i recepte nađi u aplikaciji. Pitanja? Piši mi.' },
    { id: 'prvi-trening', naslov: 'Prvi trening: nema ispita i niko ne ocjenjuje', oznaka: 'Trening', min: 2, datum: '2026-11-21', slika: B + 'teretana.jpg', poz: '50% 30%',
      uvod: 'Prvi dolazak u teretanu je najteži dio. Evo šta te čeka, da dođeš bez treme.',
      d: [
        ['Prvo razgovor', 'Prije prvog čučnja pričamo: šta želiš, koliko puta sedmično možeš trenirati, imaš li bolove ili povrede iz prošlosti i kako izgleda tvoj dan.'],
        ['Zagrijavanje i tehnika', 'Počinjemo laganim zagrijavanjem, pa učimo osnovne pokrete s malom težinom. Tehnika je važnija od kilograma.'],
        ['Tvoj tempo', 'Ne moraš sve odmah znati ni moći. Kreće se od onoga što ti odgovara, a opterećenje raste postepeno.'],
        ['Poslije treninga', 'Normalno je da osjetiš mišiće sutradan. Pij vodu, lijepo se naspavaj i javi mi kako ti je bilo. Silazak niz stepenice možda bude avantura.']
      ],
      u: 'Dovoljno je da dođeš. Ostalo radimo zajedno.',
      cta: 'Želiš prvi trening? Javi mi se, pa dogovaramo termin.' },
    { id: 'deload', naslov: 'Lakša sedmica nije lijenost, nego strategija', oznaka: 'Oporavak', min: 2, datum: '2026-11-20', slika: B + 'studio.jpg', poz: '50% 4%',
      uvod: 'Ako je jedna sedmica lakša od prethodnih, plan nije pogriješio. To se zove deload.',
      d: [
        ['Šta je deload', 'Sedmica u kojoj se smanji opterećenje: manje serija, malo lakša težina i nešto manje ponavljanja. Pokreti ostaju isti.'],
        ['Zašto ga radimo', 'Tijelo napreduje u oporavku, a ne samo na treningu. Nakon nekoliko sedmica rada, lakša sedmica daje mišićima, zglobovima i glavi priliku da odahnu.'],
        ['Kako da ga odradiš', 'Drži se onoga što piše u planu. Ne dodaj težinu "jer možeš". Fokus je na lijepom izvođenju.'],
        ['I poslije toga', 'Sljedeće sedmice nastavljamo dalje. Aplikacija sama pokazuje koja je sedmica deload.']
      ],
      u: 'Odmor je dio treninga, a ne njegova suprotnost.',
      cta: 'Pitanja o svom planu? Napiši mi.' },
    { id: 'trcanje-pocetak', naslov: 'Trčanje za početnice: cilj je stići do kraja ulice', oznaka: 'Trčanje', min: 3, datum: '2026-11-19', slika: B + 'trk.jpg', poz: '75% 40%',
      uvod: 'Za trčanje ne treba biti sportista. Treba strpljenje i plan koji kreće polako.',
      d: [
        ['Mješavina hodanja i trčanja', 'Izmjenjuj kratko lagano trčanje i hodanje, npr. 1 minuta trčanja, 2 minute hodanja. Postepeno produžavaj trčanje.'],
        ['Tempo za razgovor', 'Trči tako da možeš izgovoriti rečenicu bez gušenja. Početnici najčešće trče prebrzo, kao da ih juri autobus.'],
        ['Obuća i teren', 'Udobne patike su važnije od skupe opreme. Ravnije staze su dobar izbor za početak.'],
        ['Snaga pomaže', 'Dva kratka treninga snage sedmično pomažu stabilnosti u koljenima i kukovima.'],
        ['Dani odmora', 'Između trčanja ostavi dan odmora ili laganu šetnju.']
      ],
      u: 'Polako, redovno i s dobrom muzikom.',
      cta: 'U aplikaciji postoji i plan trčanja za početnice. Javi se, pa ti ga složim.' }
  ];


  const fmt = (iso) => iso.split('-').reverse().join('.') + '.';
  const IMG = 'width:100%;height:210px;object-fit:cover;border-radius:14px 14px 0 0;display:block';

  V.blog = (el, p, q) => {
    const cats = ['Sve'].concat([...new Set(FS.BLOG.map((b) => b.oznaka))]), c = q && q.c && cats.includes(q.c) ? q.c : 'Sve';
    const list = FS.BLOG.filter((b) => c === 'Sve' || b.oznaka === c);
    el.innerHTML = h`
      <div class="eyebrow">Blog</div>
      <h2>Savjeti za trening, ishranu i oporavak</h2>
      <div class="row wrap mb" style="gap:6px">${cats.map((k) => h`<a class="btn sm ${k === c ? 'primary' : ''}" href="#/blog?c=${k}">${k}</a>`)}</div>
      ${list.map((b) => h`<a class="card" href="#/blog/${b.id}" style="display:block;text-decoration:none;color:inherit;padding:0;overflow:hidden">
        <img src="${b.slika}" alt="" loading="lazy" style="${IMG};object-position:${b.poz}">
        <div style="padding:12px 16px 16px"><div class="row between"><span class="badge">${b.oznaka}</span><small class="muted">${b.min} min · ${fmt(b.datum)}</small></div>
        <h3 style="margin:8px 0 4px">${b.naslov}</h3><p class="muted" style="margin:0">${b.uvod}</p></div></a>`)}
      <p class="small muted center mt">Opšte informacije, ne zamjena za savjet ljekara.</p>`;
  };

  V.blog_clanak = (el, p) => {
    const b = FS.BLOG.find((x) => x.id === p.id);
    if (!b) { el.innerHTML = h`<div class="card"><p>Članak nije pronađen.</p><a class="btn" href="#/blog">Svi članci</a></div>`; return; }
    el.innerHTML = h`
      <img src="${b.slika}" alt="" style="width:100%;height:280px;object-fit:cover;object-position:${b.poz};border-radius:16px;margin-bottom:12px">
      <div class="eyebrow">${b.oznaka} · ${b.min} min čitanja</div>
      <h2>${b.naslov}</h2>
      <p class="muted">${b.uvod}</p>
      ${b.d.map((s) => h`<div class="card"><h3>${s[0]}</h3><p style="margin:0">${s[1]}</p></div>`)}
      <div class="card flat"><small class="muted">UKRATKO</small><p style="margin:4px 0 0"><b>${b.u}</b></p></div>
      <div class="card flat center"><p>${b.cta}</p><button class="btn primary" data-act="lead">Pošalji upit</button></div>
      <a class="btn block mt-s" href="#/blog">← Svi članci</a>
      <p class="small muted center mt">Opšte informacije, ne zamjena za savjet ljekara.</p>`;
    FS.bind(el, { 'click:lead': () => FS.openLead('') });
  };
})();
