/* Blog: javni članci (vidljivi i bez prijave). Novi članak se dodaje u listu FS.BLOG. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, icon } = FS;
  const V = (FS.views = FS.views || {});

  FS.BLOG = [
    { id: 'prvi-trening', naslov: 'Kako izgleda prvi trening kod mene', oznaka: 'Trening', min: 2, datum: '2026-11-26',
      uvod: 'Prvi trening je najčešće najveća prepreka. Evo šta te čeka, da dođeš bez treme.',
      d: [
        ['Prvo razgovor', 'Prije prvog čučnja pričamo: šta želiš, koliko puta sedmično možeš trenirati, imaš li bolove ili povrede iz prošlosti i kako izgleda tvoj dan.'],
        ['Zagrijavanje i tehnika', 'Počinjemo laganim zagrijavanjem, pa učimo osnovne pokrete s malom težinom. Tehnika je važnija od kilograma, a težina dolazi kasnije.'],
        ['Tvoj tempo', 'Ne moraš sve odmah znati ni moći. Kreće se od onoga što ti odgovara, a opterećenje se povećava postepeno.'],
        ['Poslije treninga', 'Normalno je da osjetiš mišiće sutradan. Pij vodu, lijepo se naspavaj i javi mi kako ti je bilo, pa prilagođavamo sljedeći trening.']
      ],
      cta: 'Želiš prvi trening? Javi mi se, pa dogovaramo termin.' },
    { id: 'deload', naslov: 'Deload: zašto je lakša sedmica dio plana', oznaka: 'Oporavak', min: 2, datum: '2026-11-26',
      uvod: 'Ako je jedna sedmica lakša nego prethodne, to nije greška u planu. To je deload, i planiran je.',
      d: [
        ['Šta je deload', 'Sedmica u kojoj se smanji opterećenje: manje serija, malo lakša težina i nešto manje ponavljanja. Pokreti ostaju isti.'],
        ['Zašto ga radimo', 'Tijelo napreduje u oporavku, a ne samo na treningu. Nakon nekoliko sedmica rada lakša sedmica daje mišićima, zglobovima i glavi priliku da se odmore.'],
        ['Kako da ga odradiš', 'Drži se onoga što piše u planu. Ne dodaj težinu "jer možeš". Fokus je na lijepom izvođenju i dobrom osjećaju.'],
        ['I poslije toga', 'Sljedeće sedmice nastavljamo dalje s novim opterećenjem. Aplikacija sama pokazuje koja je sedmica deload.']
      ],
      cta: 'Pitanja o svom planu? Napiši mi.' },
    { id: 'trcanje-pocetak', naslov: 'Kako početi s rekreativnim trčanjem', oznaka: 'Trčanje', min: 3, datum: '2026-11-26',
      uvod: 'Za trčanje ne treba biti sportista. Treba strpljenje i plan koji kreće polako.',
      d: [
        ['Počni hodanjem i trčanjem', 'Izmjenjuj kratko lagano trčanje i hodanje, npr. 1 minuta trčanja, 2 minute hodanja. Postepeno produžavaj trčanje.'],
        ['Tempo za razgovor', 'Trči tako da možeš izgovoriti rečenicu bez gušenja. Ako ne možeš, uspori. Početnici najčešće trče prebrzo.'],
        ['Obuća i teren', 'Udobne patike su bitnije od skupe opreme. Ravnije staze su dobar izbor za početak.'],
        ['Snaga pomaže', 'Dva kratka treninga snage sedmično pomažu stabilnosti u koljenima i kukovima, pa ti trčanje bude ugodnije.'],
        ['Dani odmora', 'Između trčanja ostavi dan odmora ili laganu šetnju. Oporavak je dio treninga.']
      ],
      cta: 'U aplikaciji postoji i plan trčanja za početnice. Javi se, pa ti ga složim.' }
  ];

  const fmt = (iso) => iso.split('-').reverse().join('.') + '.';

  V.blog = (el) => {
    el.innerHTML = h`
      <div class="eyebrow">Blog</div>
      <h2>Savjeti za trening, oporavak i trčanje</h2>
      <p class="muted" style="margin-top:-6px">Kratki članci, 2–3 minute čitanja.</p>
      ${FS.BLOG.map((b) => h`<a class="card" href="#/blog/${b.id}" style="display:block;text-decoration:none;color:inherit">
        <div class="row between"><span class="badge">${b.oznaka}</span><small class="muted">${b.min} min · ${fmt(b.datum)}</small></div>
        <h3 style="margin:8px 0 4px">${b.naslov}</h3><p class="muted" style="margin:0">${b.uvod}</p></a>`)}
      <p class="small muted center mt">Opšte informacije, ne zamjena za savjet ljekara.</p>`;
  };

  V.blog_clanak = (el, p) => {
    const b = FS.BLOG.find((x) => x.id === p.id);
    if (!b) { el.innerHTML = h`<div class="card"><p>Članak nije pronađen.</p><a class="btn" href="#/blog">Svi članci</a></div>`; return; }
    el.innerHTML = h`
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
