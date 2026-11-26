/* Blog: javni članci (vidljivi i bez prijave). Novi članak se dodaje u listu FS.BLOG. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h } = FS;
  const V = (FS.views = FS.views || {});
  const B = 'images/blog/';

  FS.BLOG = [
    { id: 'nije-samo-gluteus', naslov: 'Trening nije samo gluteus', oznaka: 'Mitovi', min: 3, datum: '2026-11-26', slika: B + '9637_1.jpg', poz: '50% 25%',
      uvod: 'Društvene mreže često pokazuju samo donji dio tijela. Evo zašto je cijelo tijelo bolji plan.',
      d: [
        ['Šta se stalno vidi', 'Na mrežama se najviše reklamira trening nogu i gluteusa. Lijepo izgleda, ali to je samo dio slike.'],
        ['Zašto treba cijelo tijelo', 'Leđa, ramena, grudi i core te drže uspravnom, pomažu u svakodnevnim pokretima i štite zglobove. Jaka leđa pomažu i kod sjedenja za računarom.'],
        ['Ravnoteža u planu', 'Dobar plan ima potiske i povlačenja, noge, gornji dio tijela i trup. Gluteus i dalje ima svoje mjesto, samo ne jedini.'],
        ['Kako to izgleda kod mene', 'U programima kombinujem trening nogu i gluteusa sa leđima, ramenima i trupom, prilagođeno tvom cilju i nivou.']
      ],
      cta: 'Želiš plan za cijelo tijelo? Javi mi se.' },
    { id: 'tegovi-i-zene', naslov: '"Postat ću glomazna": zašto se većina žena nema čega bojati', oznaka: 'Mitovi', min: 3, datum: '2026-11-25', slika: B + '3022.jpg', poz: '50% 45%',
      uvod: 'Jedan od najčešćih strahova kod žena koje počinju s tegovima. Šta je zapravo istina?',
      d: [
        ['Mišići ne rastu preko noći', 'Izgradnja mišića je spor proces koji traje mjesecima i godinama, uz redovan trening i dovoljno hrane. Žene u pravilu imaju manje testosterona, pa im je to još sporije.'],
        ['Šta tegovi zaista rade', 'Trening snage često donosi čvršće tijelo, bolje držanje i više energije u svakodnevnim stvarima. Rezultati su različiti od osobe do osobe.'],
        ['Počni umjereno', 'Kreni s težinom s kojom možeš lijepo izvesti pokret, pa postepeno dodaj. Tehnika ide prije kilograma.'],
        ['Ako ti se ne sviđa promjena', 'Plan se uvijek može prilagoditi, a ti odlučuješ kakav oblik tijela želiš.']
      ],
      cta: 'Nisi sigurna odakle početi? Napiši mi.' },
    { id: 'salo-na-jednom-mjestu', naslov: 'Ne možeš skinuti salo samo sa stomaka', oznaka: 'Mitovi', min: 2, datum: '2026-11-24', slika: B + '3021.jpg', poz: '50% 40%',
      uvod: 'Stotine trbušnjaka neće "istopiti" stomak. Evo šta se zapravo dešava.',
      d: [
        ['Tijelo bira samo', 'Kad tijelo troši energiju iz masnih zaliha, ne bira mjesto koje ti želiš. Vježba za stomak jača mišiće stomaka, ali ne briše salo baš s tog dijela.'],
        ['Šta pomaže', 'Cjelokupan plan: trening snage, kretanje preko dana, dovoljno sna i uravnotežena ishrana. Strpljenje je veći dio posla.'],
        ['Trbušnjaci imaju smisla', 'Jak trup pomaže držanju i stabilnosti, ali to je druga priča od gubitka masti.'],
        ['Mjerenja umjesto vage', 'Obim struka i kukova te slike kroz vrijeme često pokažu više od same vage. U aplikaciji možeš unositi mjerenja.']
      ],
      cta: 'Želiš plan prilagođen sebi? Javi se.' },
    { id: 'progresivno-opterecenje', naslov: 'Kako napredovati: progresivno opterećenje jednostavno', oznaka: 'Trening', min: 3, datum: '2026-11-23', slika: B + '1408.jpg', poz: '50% 30%',
      uvod: 'Isti trening iz sedmice u sedmicu ne daje isti napredak. Kako postepeno povećavati bez povrjeđivanja?',
      d: [
        ['Šta to znači', 'Tijelu povremeno dajemo malo veći izazov: nešto više kilograma, ponavljanja ili serija.'],
        ['Pravilo dvije stepenice', 'Kad možeš lijepo odraditi sve serije do gornje granice ponavljanja, tek tada povećaj težinu. U aplikaciji dobijaš prijedlog težine na osnovu prošlog treninga.'],
        ['Nije svaki trening rekord', 'Ima dana kad si umorna. Tada ostani na istoj težini i drži tehniku.'],
        ['Lakša sedmica je dio plana', 'Povremeno planiramo deload da se tijelo oporavi i nastavi dalje.']
      ],
      cta: 'Želiš da pratim tvoj napredak? Javi se.' },
    { id: 'proteini', naslov: 'Koliko proteina ti zaista treba', oznaka: 'Ishrana', min: 3, datum: '2026-11-22', slika: 'images/recepti/r01.jpg', poz: '50% 50%',
      uvod: 'Proteini su svuda u reklamama. Evo jednostavnog okvira, bez komplikacija.',
      d: [
        ['Okvirna količina', 'Za osobe koje treniraju snagu često se navodi oko 1,2 do 2 grama proteina po kilogramu tjelesne težine dnevno. Tačna količina zavisi od osobe.'],
        ['Iz čega ih unositi', 'Meso, riba, jaja, mliječni proizvodi, mahunarke. Prašak nije obavezan, samo praktična dopuna.'],
        ['Rasporedi preko dana', 'Lakše je u svaki obrok staviti izvor proteina nego sve pojesti navečer.'],
        ['Kad je potreban oprez', 'Ako imaš zdravstvenih problema, prije promjene ishrane posavjetuj se s ljekarom ili nutricionistom.']
      ],
      cta: 'Kalkulator kalorija i recepte nađi u aplikaciji. Pitanja? Piši mi.' },
    { id: 'prvi-trening', naslov: 'Kako izgleda prvi trening kod mene', oznaka: 'Trening', min: 2, datum: '2026-11-21', slika: B + '3023.jpg', poz: '50% 45%',
      uvod: 'Prvi trening je najčešće najveća prepreka. Evo šta te čeka, da dođeš bez treme.',
      d: [
        ['Prvo razgovor', 'Prije prvog čučnja pričamo: šta želiš, koliko puta sedmično možeš trenirati, imaš li bolove ili povrede iz prošlosti i kako izgleda tvoj dan.'],
        ['Zagrijavanje i tehnika', 'Počinjemo laganim zagrijavanjem, pa učimo osnovne pokrete s malom težinom. Tehnika je važnija od kilograma.'],
        ['Tvoj tempo', 'Ne moraš sve odmah znati ni moći. Kreće se od onoga što ti odgovara, a opterećenje raste postepeno.'],
        ['Poslije treninga', 'Normalno je da osjetiš mišiće sutradan. Pij vodu, lijepo se naspavaj i javi mi kako ti je bilo.']
      ],
      cta: 'Želiš prvi trening? Javi mi se, pa dogovaramo termin.' },
    { id: 'deload', naslov: 'Deload: zašto je lakša sedmica dio plana', oznaka: 'Oporavak', min: 2, datum: '2026-11-20', slika: B + '3025.jpg', poz: '50% 40%',
      uvod: 'Ako je jedna sedmica lakša nego prethodne, to nije greška u planu. To je deload, i planiran je.',
      d: [
        ['Šta je deload', 'Sedmica u kojoj se smanji opterećenje: manje serija, malo lakša težina i nešto manje ponavljanja. Pokreti ostaju isti.'],
        ['Zašto ga radimo', 'Tijelo napreduje u oporavku, a ne samo na treningu. Nakon nekoliko sedmica rada, lakša sedmica daje mišićima, zglobovima i glavi priliku da se odmore.'],
        ['Kako da ga odradiš', 'Drži se onoga što piše u planu. Ne dodaj težinu "jer možeš". Fokus je na lijepom izvođenju.'],
        ['I poslije toga', 'Sljedeće sedmice nastavljamo dalje. Aplikacija sama pokazuje koja je sedmica deload.']
      ],
      cta: 'Pitanja o svom planu? Napiši mi.' },
    { id: 'trcanje-pocetak', naslov: 'Kako početi s rekreativnim trčanjem', oznaka: 'Trčanje', min: 3, datum: '2026-11-19', slika: 'images/trener.jpg', poz: '50% 30%',
      uvod: 'Za trčanje ne treba biti sportista. Treba strpljenje i plan koji kreće polako.',
      d: [
        ['Počni hodanjem i trčanjem', 'Izmjenjuj kratko lagano trčanje i hodanje, npr. 1 minuta trčanja, 2 minute hodanja. Postepeno produžavaj trčanje.'],
        ['Tempo za razgovor', 'Trči tako da možeš izgovoriti rečenicu bez gušenja. Početnici najčešće trče prebrzo.'],
        ['Obuća i teren', 'Udobne patike su bitnije od skupe opreme. Ravnije staze su dobar izbor za početak.'],
        ['Snaga pomaže', 'Dva kratka treninga snage sedmično pomažu stabilnosti u koljenima i kukovima.'],
        ['Dani odmora', 'Između trčanja ostavi dan odmora ili laganu šetnju.']
      ],
      cta: 'U aplikaciji postoji i plan trčanja za početnice. Javi se, pa ti ga složim.' }
  ];

  const fmt = (iso) => iso.split('-').reverse().join('.') + '.';
  const IMG = 'width:100%;height:170px;object-fit:cover;border-radius:14px 14px 0 0;display:block';

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
      <img src="${b.slika}" alt="" style="width:100%;height:220px;object-fit:cover;object-position:${b.poz};border-radius:16px;margin-bottom:12px">
      <div class="eyebrow">${b.oznaka} · ${b.min} min čitanja</div>
      <h2>${b.naslov}</h2>
      <p class="muted">${b.uvod}</p>
      ${b.d.map((s) => h`<div class="card"><h3>${s[0]}</h3><p style="margin:0">${s[1]}</p></div>`)}
      <div class="card flat center"><p>${b.cta}</p><button class="btn primary" data-act="lead">Pošalji upit</button></div>
      <a class="btn block mt-s" href="#/blog">← Svi članci</a>
      <p class="small muted center mt">Opšte informacije, ne zamjena za savjet ljekara.</p>`;
    FS.bind(el, { 'click:lead': () => FS.openLead('') });
  };
})();
