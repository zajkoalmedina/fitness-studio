/* Dodaci: trajanje pristupa programu, mjerenja (0•4•8•12), suplementi, upitnik za novu klijenticu,
   PDF vodič za ishranu i prikaz programa prije registracije. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, raw, toast, Store, Auth, uid, today, fmtDate, addDays, num, opts, icon, bind, formData, config, $ } = FS;
  const V = (FS.views = FS.views || {});
  const FILE = 'files/Upitnik_za_novog_klijenta.docx';

  /* ================= PRISTUP PROGRAMU (traje koliko program) ================= */
  const dayDiff = (a, b) => Math.round((FS.parse(b) - FS.parse(a)) / 86400000);
  FS.access = (u, p) => {
    if (!u || !p) return { on: false, has: false };
    if (u.role === 'trener') return { on: true, has: true };
    if (!(u.programi || []).includes(p.id)) return { on: false, has: false };
    if (p.tip === 'individualni' || p.tip === 'vodic' || !p.sedmica) return { on: true, has: true, trajno: true };
    const st = (u.pstart || {})[p.id];
    if (!st) return { on: true, has: true, nov: true };
    const last = addDays(st, p.sedmica * 7 - 1), left = dayDiff(today(), last);
    return { on: left >= 0, has: true, expired: left < 0, left, end: last };
  };
  FS.accessLabel = (p, u) => {
    const a = FS.access(u, p);
    if (a.trajno) return p.tip === 'individualni' ? 'Individualni program' : 'Stalni pristup';
    if (a.nov) return 'Pristup traje ' + p.sedmica + ' sedmica od prvog otvaranja';
    if (a.expired) return 'Pristup istekao ' + fmtDate(a.end);
    return 'Aktivno još ' + (a.left + 1) + ' dana (do ' + fmtDate(a.end) + ')';
  };

  /* ================= MJERENJA ================= */
  FS.MJERE_POLJA = [['tezina', 'Tjelesna masa', 'kg', 30, 300], ['struk', 'Struk', 'cm', 30, 250], ['stomak', 'Stomak – pupak', 'cm', 30, 250], ['kukovi', 'Kukovi', 'cm', 40, 250],
    ['natL', 'Natkoljenica L', 'cm', 20, 150], ['natD', 'Natkoljenica D', 'cm', 20, 150], ['nadL', 'Nadlaktica L', 'cm', 10, 100], ['nadD', 'Nadlaktica D', 'cm', 10, 100], ['listL', 'List L', 'cm', 10, 100], ['listD', 'List D', 'cm', 10, 100]];
  const TACKE = [['', 'Redovno mjerenje'], ['0', 'Početak'], ['4', '4. sedmica'], ['8', '8. sedmica'], ['12', '12. sedmica']];
  const tackaL = (t) => (TACKE.find((x) => x[0] === String(t || '')) || [0, ''])[1];

  FS.mjForm = () => h`<form data-act="mj" novalidate>
    <div class="grid2"><label class="field"><span>Datum</span><input type="date" name="d" value="${today()}" max="${today()}"></label>
    <label class="field"><span>Točka praćenja</span><select name="tacka">${opts(TACKE, '')}</select></label></div>
    <div class="grid2">${FS.MJERE_POLJA.map(([k, l, un]) => h`<label class="field"><span>${l} (${un})</span><input name="${k}" inputmode="decimal" placeholder="${un}"></label>`)}</div>
    <p class="small">Mjeri pod što sličnijim uslovima: isto doba dana, ista tačka mjerenja, traka kroz pupak, najširi dio gluteusa, najširi dio lista. Rezultat procjenjuj zajedno sa snagom, izvedbom, oporavkom i osjećajem.</p>
    <p class="err" id="merr" hidden></p><button class="btn primary block" type="submit">Sačuvaj mjerenje</button></form>`;

  FS.mjSubmit = (f, userId, el) => {
    const d = formData(f), er = $('#merr', el), bad = (m) => { er.textContent = m; er.hidden = false; return false; };
    const o = { id: uid(), userId, datum: d.d, tacka: d.tacka || '', biljeska: '' }; let n = 0;
    for (const [k, l, un, lo, hi] of FS.MJERE_POLJA) {
      const v = num(d[k]);
      if (isNaN(v)) { o[k] = null; continue; }
      if (v < lo || v > hi) return bad(l + ' mora biti između ' + lo + ' i ' + hi + ' ' + un + '.');
      o[k] = v; n++;
    }
    if (!n) return bad('Unesi barem jednu vrijednost.');
    if (!d.d || d.d > today()) return bad('Datum ne može biti u budućnosti.');
    Store.db.mjere.push(o); Store.save(); toast('Mjerenje sačuvano.');
    return true;
  };

  FS.mjHistory = (mj, withDel) => (mj.length ? mj.slice().reverse().map((m) => {
    const parts = FS.MJERE_POLJA.filter(([k]) => m[k] != null && m[k] !== '').map(([k, l, un]) => l + ' ' + m[k] + ' ' + un);
    return h`<div class="card flat"><div class="row between"><b>${fmtDate(m.datum)}${m.tacka ? ' · ' + tackaL(m.tacka) : ''}</b>${withDel ? h`<button class="icon-btn" style="width:30px;height:30px" data-act="delmj" data-id="${m.id}" aria-label="Obriši">${icon('trash')}</button>` : ''}</div><div class="small mt-s">${parts.join(' · ') || '–'}</div></div>`;
  }) : h`<div class="empty">Još nema mjerenja.</div>`);

  FS.mjTable = (mj) => {
    if (!mj.length) return '';
    const by = (k) => mj.filter((m) => m[k] != null && m[k] !== '');
    const rows = FS.MJERE_POLJA.map(([k, l, un]) => {
      const a = by(k); if (!a.length) return null;
      const t = (w) => { const x = a.find((m) => String(m.tacka || '') === w); return x ? x[k] : ''; };
      const start = t('0') !== '' ? t('0') : a[0][k], last = a[a.length - 1][k];
      const diff = a.length > 1 ? Math.round((last - start) * 10) / 10 : '';
      return h`<tr><td>${l}</td><td>${start}</td><td>${t('4')}</td><td>${t('8')}</td><td>${t('12')}</td><td><b>${diff === '' ? '–' : (diff > 0 ? '+' : '') + diff}</b></td></tr>`;
    }).filter(Boolean);
    if (!rows.length) return '';
    return h`<div class="card"><h3>Mjerenja: početak • 4 • 8 • 12 sedmica</h3><div style="overflow-x:auto"><table class="tbl"><tr><th>Mjera</th><th>Početak</th><th>4.</th><th>8.</th><th>12.</th><th>Promjena</th></tr>${rows}</table></div>
      <p class="small mt-s">Promjena = zadnje mjerenje minus početno. Težina i obimi nisu jedina mjera napretka: važni su i snaga, tehnika i oporavak.</p></div>`;
  };

  /* ================= SUPLEMENTI ================= */
  FS.SUPLEMENTI = {
    uvod: 'Osnova su prehrana, trening, san i hidratacija. Suplementi su dodatak. Kod bolesti, trudnoće/dojenja, terapije ili laboratorijski potvrđenog manjka suplementaciju uskladiti s ljekarom/farmaceutom.',
    lista: [
      ['Whey protein', 'Korisno po potrebi', 'Obično 20–30 g proteina po porciji; količinu prilagoditi dnevnom unosu.', 'Poslije treninga ili bilo kada tokom dana kada je praktično.', 'Praktičan način da se dopuni dnevni unos kvalitetnih proteina.', 'Nije obavezan ako se dovoljno proteina unese hranom. Provjeri deklaraciju proizvoda.'],
      ['Kreatin monohidrat', 'Visok prioritet za snagu / hipertrofiju', '3–5 g svaki dan.', 'Svaki dan, i kada se ne trenira. Vrijeme uzimanja nije presudno. Loading nije neophodan.', 'Podržava snagu, power i trening visokog intenziteta; može pomoći adaptacijama na trening.', 'Birati creatine monohydrate. Moguće je blago povećanje tjelesne mase zbog vode. Kod bolesti bubrega ili drugih medicinskih stanja prvo ljekar.'],
      ['Kofein', 'Opcionalno', 'Počni nisko; za sportski učinak se često proučava oko 2–6 mg/kg.', 'Otprilike 15–60 min prije treninga, samo ako se dobro podnosi.', 'Može smanjiti osjećaj umora i poboljšati izvedbu kod nekih aktivnosti.', 'Računati i kafu/energetska pića. Ne uzimati kasno ako remeti san. Veće doze povećavaju nuspojave.'],
      ['Omega-3 (EPA+DHA)', 'Po potrebi', 'Nema jedne univerzalne sportske doze; prvo procijeniti unos masne ribe.', 'Uz obrok.', 'Dopuna prehrani kada je unos omega-3 nizak.', 'Gledati količinu EPA+DHA na deklaraciji, ne samo ukupno „riblje ulje“. Oprez uz antikoagulantnu terapiju.'],
      ['Vitamin D', 'Prema nalazu / riziku', 'Dozu odrediti prema statusu vitamina D i preporuci zdravstvenog stručnjaka.', 'Uz obrok, prema preporuci.', 'Korisno kada postoji nedovoljan status / deficit.', 'Ne određivati visoke ili terapijske doze kao trener bez nalaza i stručne preporuke.'],
      ['Magnezij', 'Po potrebi', 'Prema prehrani, proizvodu i eventualno potvrđenom manjku.', 'Prema deklaraciji i toleranciji.', 'Može pomoći pokriti nedovoljan prehrambeni unos, ali nije automatski potreban svakom vježbaču.', 'Veće suplementalne količine mogu izazvati probavne smetnje i mogu imati interakcije s lijekovima.'],
      ['Multivitamin', 'Nizak / situacioni prioritet', 'Prema deklaraciji; ne duplirati visoke doze iz više proizvoda.', 'Uz obrok.', 'Može biti praktičan kada je prehrana dugoročno ograničena, ali nije zamjena za kvalitetnu prehranu.', 'Ne koristiti rutinski kao „osiguranje“ za lošu prehranu; paziti na ukupni unos vitamina/minerala.'],
      ['BCAA', 'Nizak prioritet', 'Nije potrebno rutinski dozirati ako je unos kvalitetnih proteina dovoljan.', '', 'Kod dovoljnog ukupnog proteina dodatna korist je ograničena.', 'Whey i kvalitetna proteinska hrana već osiguravaju BCAA/esencijalne aminokiseline.'],
      ['Fat burner / detox', 'Ne preporučuje se rutinski', '', '', 'Nisu temelj gubitka masnog tkiva.', 'Prioritet: održiv kalorijski deficit, trening, svakodnevno kretanje i san. Oprez s mješavinama stimulansa.']
    ]
  };
  V.suplementi = (el) => {
    const S = FS.SUPLEMENTI;
    el.innerHTML = h`<div class="eyebrow">Ishrana</div><h1>Suplementi</h1>
      <div class="card note">${S.uvod}</div>
      ${S.lista.map(([n, pr, kol, kad, zasto, op]) => h`<details class="card"><summary style="cursor:pointer"><div class="row between"><b>${n}</b><span class="badge">${pr}</span></div></summary>
        ${kol ? h`<div class="mt-s"><b>Količina:</b> ${kol}</div>` : ''}${kad ? h`<div class="mt-s"><b>Kada / kako:</b> ${kad}</div>` : ''}
        <div class="mt-s"><b>Zašto:</b> ${zasto}</div><div class="mt-s"><b>Napomena / oprez:</b> ${op}</div></details>`)}
      <div class="card alert"><b>Važno:</b> ovo su opšte smjernice, ne zamjena za savjet ljekara ili farmaceuta. Suplementi nisu obavezni. Ako imaš bolest, uzimaš terapiju, trudna si ili dojiš, prvo se posavjetuj sa stručnjakom.</div>
      <a class="btn block" href="#/ishrana">← Vodič za ishranu</a>`;
  };

  /* ================= UPITNIK ================= */
  const YN = ['Ne', 'Da'];
  const U = [
    ['1. Osnovni podaci', [['ime', 'Ime i prezime', 'text'], ['rodjenje', 'Datum rođenja / godine', 'text'], ['visina', 'Visina (cm)', 'text'], ['masa', 'Tjelesna masa (kg)', 'text'], ['zanimanje', 'Zanimanje', 'text'],
      ['posao', 'Da li je tvoj posao pretežno:', 'single', ['sjedeći', 'stojeći', 'fizički aktivan', 'kombinovan']], ['kontakt', 'Kontakt telefon / e-mail', 'text']]],
    ['2. Tvoj glavni cilj', [['cilj', 'Koji je tvoj primarni cilj?', 'single', ['Oblikovanje tijela', 'Povećanje mišićne mase', 'Gluteus i noge', 'Smanjenje tjelesne mase / masnog tkiva', 'Povećanje snage', 'Poboljšanje kondicije', 'Mobilnost i postura', 'Povratak redovnom treningu', 'Drugo']],
      ['cilj_drugo', 'Ako si izabrala „Drugo“, napiši koji', 'text'], ['dijelovi', 'Koje dijelove tijela želiš posebno unaprijediti?', 'area'], ['rezultat', 'Šta bi za tebe bio uspješan rezultat nakon 12 sedmica?', 'area'], ['vaznost', 'Koliko ti je trenutno važno ostvariti ovaj cilj, od 1 do 10?', 'scale', 10]]],
    ['3. Iskustvo sa treningom', [['trenira', 'Da li trenutno treniraš?', 'single', YN.slice().reverse()], ['puta', 'Ako da, koliko puta sedmično?', 'text'], ['staz', 'Koliko dugo treniraš sa opterećenjem?', 'single', ['Nikada', '< 6 mjeseci', '6–12 mjeseci', '1–3 godine', '> 3 godine']],
      ['trener', 'Da li si ranije radila sa trenerom?', 'single', ['Da', 'Ne']], ['ranije', 'Koje vrste aktivnosti ili treninga si ranije radila?', 'area'], ['voli', 'Postoje li vježbe koje posebno voliš?', 'area'], ['neVoli', 'Postoje li vježbe koje ne voliš ili ne želiš raditi?', 'area']]],
    ['4. Zdravlje i sigurnost', [['bol', 'Da li trenutno imaš bol, povredu ili ograničenje koje može uticati na trening?', 'yn'], ['povreda', 'Da li si ranije imala ozbiljniju povredu ili operaciju?', 'yn'],
      ['ogranic', 'Da li ti je ljekar ili fizioterapeut ograničio određene fizičke aktivnosti ili vježbe?', 'yn'], ['terapija', 'Da li trenutno koristiš terapiju/lijekove koji mogu biti relevantni za fizičku aktivnost?', 'yn'],
      ['stanje', 'Postoji li zdravstveno stanje za koje smatraš da trener treba znati prije početka treninga?', 'yn']],
      'Ako postoji zdravstveni problem, bol ili stanje koje nije u domenu trenera, prije uključivanja ili nastavka određenih aktivnosti može biti potrebna procjena odgovarajućeg zdravstvenog stručnjaka.'],
    ['5. Organizacija treninga', [['sedm', 'Koliko puta sedmično realno možeš trenirati?', 'single', ['2', '3', '4', '5']], ['vrijeme', 'Koliko vremena imaš za jedan trening?', 'single', ['30–45 min', '45–60 min', '60–75 min', '75+ min']],
      ['gdje', 'Gdje ćeš trenirati?', 'single', ['Teretana', 'Kuća', 'Kombinovano']], ['oprema', 'Ako treniraš kod kuće, koju opremu imaš?', 'area'], ['dani', 'Koji dani ti najviše odgovaraju za trening?', 'area']]],
    ['6. Kretanje i kardio', [['aktivnost', 'Koliko si aktivna tokom prosječnog dana?', 'single', ['Vrlo malo', 'Malo', 'Umjereno', 'Veoma aktivno']], ['koraci', 'Ako pratiš korake, približan dnevni prosjek', 'text'],
      ['kardio', 'Da li trenutno radiš kardio? (ako da, napiši vrstu, učestalost i trajanje)', 'yn'], ['oblik', 'Koji oblik kardija ti najviše odgovara?', 'single', ['Hodanje', 'Traka', 'Bicikl', 'Trčanje', 'Steper', 'Drugo']]]],
    ['7. San, stres i oporavak', [['san', 'Koliko prosječno spavaš (sati)?', 'text'], ['sanK', 'Kvalitet sna (1 = loš, 5 = odličan)', 'scale', 5], ['stres', 'Trenutni nivo stresa (1 = nizak, 5 = visok)', 'scale', 5],
      ['osjecaj', 'Kako se generalno osjećaš tokom dana?', 'single', ['Umorno', 'Promjenjivo', 'Dobro', 'Veoma energično']], ['raspored', 'Postoji li nešto u tvom rasporedu što bi moglo otežati redovno treniranje?', 'area']]],
    ['8. Prehrambene navike', [['obroka', 'Koliko obroka najčešće jedeš dnevno?', 'text'], ['dorucak', 'Da li redovno doručkuješ?', 'single', ['Da', 'Ne', 'Ponekad']], ['voda', 'Koliko vode približno piješ dnevno?', 'text'],
      ['vocepov', 'Koliko često jedeš voće i povrće?', 'area'], ['slatkisi', 'Koliko često jedeš slatkiše, grickalice ili fast food?', 'area'], ['proteini', 'Koji su tvoji najčešći izvori proteina?', 'area'], ['neJede', 'Postoje li namirnice koje ne jedeš ili ne voliš?', 'area'],
      ['alergije', 'Da li imaš alergije ili intolerancije na hranu?', 'yn'],
      ['problem', 'Šta ti trenutno predstavlja najveći problem u ishrani?', 'multi', ['Neredovni obroci', 'Premalo proteina', 'Slatkiši / grickalice', 'Prejedanje', 'Jedenje zbog stresa / dosade', 'Premalo vode', 'Organizacija hrane', 'Ne znam sastaviti kvalitetan obrok', 'Drugo']]]],
    ['9. Mjerenja i praćenje napretka', [['pTezina', 'Da li pristaješ na praćenje tjelesne mase?', 'single', ['Da', 'Ne']], ['pObimi', 'Da li pristaješ na mjerenje obima tijela?', 'single', ['Da', 'Ne']],
      ['pFoto', 'Da li želiš koristiti fotografije napretka za privatno praćenje vlastitog rezultata?', 'single', ['Da', 'Ne']], ['pokaz', 'Šta ti je najvažniji pokazatelj napretka?', 'single', ['Izgled', 'Obimi', 'Tjelesna masa', 'Snaga', 'Kondicija', 'Kako se osjećam', 'Kombinacija']]]],
    ['10. Online coaching', [['oKg', 'Da li možeš redovno unositi kg, ponavljanja i RIR nakon treninga?', 'single', ['Da', 'Ne']], ['oVideo', 'Da li možeš po potrebi poslati video izvođenja vježbe radi provjere tehnike?', 'single', ['Da', 'Ne']],
      ['oCheck', 'Da li si spremna jednom sedmično ispuniti kratki check-in o treningu, oporavku i napretku?', 'single', ['Da', 'Ne']], ['jos', 'Postoji li još nešto što smatraš važnim da znam prije nego napravim tvoj program?', 'area']]],
    ['11. Opcionalno', [['ciklus', 'Postoje li promjene tokom menstrualnog ciklusa koje primjetno utiču na tvoju energiju, trening ili oporavak?', 'single', ['Ne', 'Da', 'Ne želim odgovoriti']], ['ciklusO', 'Ako želiš, opiši', 'area']]]
  ];
  FS.UPITNIK = U;
  const myUp = (userId) => (Store.db.upitnici || []).find((x) => x.userId === userId);

  const qHtml = ([k, t, tip, o], a) => {
    const v = a[k];
    if (tip === 'text') return h`<label class="field"><span>${t}</span><input name="${k}" maxlength="200" value="${v || ''}"></label>`;
    if (tip === 'area') return h`<label class="field"><span>${t}</span><textarea name="${k}" maxlength="800">${v || ''}</textarea></label>`;
    if (tip === 'single') return h`<div class="field"><span>${t}</span><div class="row wrap">${o.map((x) => h`<label class="check"><input type="radio" name="${k}" value="${x}" ${v === x ? 'checked' : ''}><span>${x}</span></label>`)}</div></div>`;
    if (tip === 'multi') return h`<div class="field"><span>${t}</span><div class="row wrap">${o.map((x) => h`<label class="check"><input type="checkbox" name="${k}" value="${x}" ${(v || []).includes(x) ? 'checked' : ''}><span>${x}</span></label>`)}</div></div>`;
    if (tip === 'scale') return h`<div class="field"><span>${t}</span><div class="row wrap">${Array.from({ length: o }, (_, i) => String(i + 1)).map((x) => h`<label class="check"><input type="radio" name="${k}" value="${x}" ${v === x ? 'checked' : ''}><span>${x}</span></label>`)}</div></div>`;
    if (tip === 'yn') return h`<div class="field"><span>${t}</span><div class="row wrap">${YN.map((x) => h`<label class="check"><input type="radio" name="${k}" value="${x}" ${v === x ? 'checked' : ''}><span>${x}</span></label>`)}</div>
      <input name="${k}_o" maxlength="300" placeholder="Ako da, objasni…" value="${a[k + '_o'] || ''}" style="margin-top:6px"></div>`;
    return '';
  };

  FS.IZJAVA = 'Potvrđujem da sam navedene podatke dala tačno prema svom trenutnom znanju i da ću trenerici prijaviti promjene koje mogu biti relevantne za sigurno provođenje treninga. Razumijem da treniram na vlastitu odgovornost i da trener ne zamjenjuje ljekara.';

  V.upitnik = (el) => {
    const u = Auth.user(), cur = u && u.role === 'klijentica' ? myUp(u.id) : null, a = (cur && cur.odg) || {};
    el.innerHTML = h`<div class="eyebrow">Nova klijentica</div><h1>Upitnik</h1>
      <p class="muted">Upitnik za personalni / online coaching. Popuni ga prije početka programa da bih ti mogla prilagoditi trening.</p>
      <a class="btn block mb" href="${FILE}" download>Preuzmi upitnik (Word), za ispis ili slanje</a>
      ${u && u.role === 'klijentica' ? h`
        <div class="card note small">Odgovore vidi samo trenerica. ${cur ? 'Upitnik si već popunila ' + fmtDate(cur.datum) + '. Možeš ga urediti i ponovo sačuvati.' : ''}</div>
        <form data-act="upit" novalidate>
          ${U.map(([naslov, qs, napomena]) => h`<div class="card"><h3>${naslov}</h3>${qs.map((q) => qHtml(q, a))}${napomena ? h`<p class="small">${napomena}</p>` : ''}</div>`)}
          <div class="card cream"><h3>Izjava klijentice</h3><p class="small">${FS.IZJAVA}</p>
            <label class="check"><input type="checkbox" name="izjava" ${cur && cur.izjava ? 'checked' : ''}><span>Slažem se s izjavom</span></label></div>
          <p class="err" id="uerr" hidden></p><button class="btn primary block" type="submit">Sačuvaj upitnik</button></form>`
    : h`<div class="card flat center"><p class="muted" style="margin:0 0 8px">Za online popunjavanje prijavi se ili napravi račun.</p><a class="btn primary sm" href="#/prijava?tab=registracija">Napravi račun</a> <a class="btn sm" href="#/prijava">Prijava</a></div>`}`;
    bind(el, {
      'submit:upit': (f) => {
        const fd = new FormData(f), odg = {}, er = $('#uerr', el);
        U.forEach(([, qs]) => qs.forEach(([k, , tip]) => {
          if (tip === 'multi') odg[k] = fd.getAll(k).map(String); else { const v = fd.get(k); if (v != null && String(v).trim()) odg[k] = String(v).trim().slice(0, 800); }
          if (tip === 'yn') { const o = fd.get(k + '_o'); if (o && String(o).trim()) odg[k + '_o'] = String(o).trim().slice(0, 300); }
        }));
        if (!fd.get('izjava')) { er.textContent = 'Za slanje potvrdi izjavu na dnu upitnika.'; er.hidden = false; return; }
        Store.db.upitnici = Store.db.upitnici || [];
        let x = myUp(u.id);
        if (x) { x.odg = odg; x.datum = today(); x.izjava = true; x.ts = Date.now(); } else Store.db.upitnici.push({ id: uid(), userId: u.id, datum: today(), ts: Date.now(), izjava: true, odg });
        Store.save(); toast('Upitnik je sačuvan.'); location.hash = '#/moj';
      }
    });
  };

  FS.upitnikBanner = (u) => (myUp(u.id) ? '' : h`<div class="card note"><b>Popuni upitnik</b><div class="small">Kratak upitnik za novu klijenticu, da ti mogu prilagoditi program.</div><a class="btn sm primary mt-s" href="#/upitnik">Popuni upitnik</a></div>`);

  FS.upitnikCard = (u) => {
    const x = myUp(u.id);
    if (!x) return h`<div class="card"><h3>Upitnik</h3><p class="muted" style="margin:0">Klijentica još nije popunila upitnik.</p></div>`;
    const a = x.odg || {};
    const rows = U.map(([naslov, qs]) => {
      const lines = qs.map(([k, t, tip]) => {
        let v = a[k]; if (Array.isArray(v)) v = v.join(', ');
        if (tip === 'yn' && a[k + '_o']) v = (v || '') + ' – ' + a[k + '_o'];
        return v ? h`<div class="kv"><span class="small">${t}</span><b style="text-align:right">${v}</b></div>` : '';
      });
      return lines.some(Boolean) ? h`<h4 style="margin:12px 0 4px">${naslov}</h4>${lines}` : '';
    });
    return h`<details class="card"><summary style="cursor:pointer"><b>Upitnik</b> <span class="small">· popunjen ${fmtDate(x.datum)}</span></summary>${rows}<p class="small mt-s">Izjava potvrđena: ${x.izjava ? 'da' : 'ne'}.</p></details>`;
  };

  /* ================= PDF VODIČ ZA ISHRANU ================= */
  const pdfInfo = () => (Store.db && Store.db.pdfVodic && Store.db.pdfVodic.path ? Store.db.pdfVodic : null);
  const sizeL = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
  FS.pdfBox = (has) => {
    const p = pdfInfo();
    if (!p || !has) return '';
    return h`<div class="card cream"><div class="row between"><div><b>PDF vodič za ishranu</b><div class="small">${p.name} · ${sizeL(p.size)}</div></div><button class="btn primary sm" data-pdfget="1">Preuzmi PDF</button></div></div>`;
  };
  FS.pdfCard = () => {
    const p = pdfInfo();
    return h`<div class="card"><h3>PDF vodič za ishranu</h3>
      <p class="small muted">Klijentice koje kupe vodič mogu preuzeti ovaj PDF. ${FS.cloud ? '' : '(Probna verzija: fajl ostaje na ovom uređaju.)'}</p>
      ${p ? h`<div class="kv"><span>${p.name}</span><b>${sizeL(p.size)}</b></div><div class="row mt-s"><button class="btn sm grow" data-pdfget="1">Preuzmi</button><button class="btn sm danger" data-pdfdel="1">Ukloni</button></div><p class="small mt-s">Novi PDF zamjenjuje ovaj:</p>` : ''}
      <input type="file" accept="application/pdf,.pdf" data-pdfup="1"></div>`;
  };
  document.addEventListener('click', async (e) => {
    const g = e.target.closest && e.target.closest('[data-pdfget]'), d = e.target.closest && e.target.closest('[data-pdfdel]');
    const p = pdfInfo();
    if (g && p) {
      toast('Pripremam PDF…');
      const blob = await FS.fileStore.get(p.path);
      if (!blob) { toast('PDF trenutno nije dostupan.'); return; }
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })), a = document.createElement('a');
      a.href = url; a.download = p.name || 'vodic.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
    if (d && p) {
      if (!await FS.confirmSheet({ title: 'Ukloniti PDF?', text: 'Klijentice ga više neće moći preuzeti.', ok: 'Ukloni', danger: true })) return;
      FS.fileStore.del(p.path); Store.db.pdfVodic = {}; Store.save(); FS.rerender();
    }
  });
  document.addEventListener('change', async (e) => {
    const t = e.target; if (!t || !t.matches || !t.matches('[data-pdfup]')) return;
    const f = t.files && t.files[0]; t.value = '';
    if (!f) return;
    if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') { toast('Izaberi PDF fajl.'); return; }
    if (f.size > 45 * 1048576) { toast('PDF je prevelik (najviše 45 MB).'); return; }
    toast('Šaljem PDF…');
    const old = pdfInfo(), path = 'pdf/vodic_' + Date.now() + '.pdf';
    try { await FS.fileStore.put(path, f); } catch (er) { toast('PDF nije poslan. Provjeri internet.'); return; }
    if (old) FS.fileStore.del(old.path);
    Store.db.pdfVodic = { path, name: f.name.slice(0, 80), size: f.size, ts: Date.now() }; Store.save(); toast('PDF je dodat.'); FS.rerender();
  });

  /* ================= POČETNA: programi i vodič vidljivi prije registracije ================= */
  const home0 = V.home;
  V.home = (el, p, q) => {
    home0(el, p, q);
    const shop = Store.shop(), anchor = el.querySelector('.eyebrow.mt');
    if (!shop.length || !anchor) return;
    const sec = h`<div class="eyebrow">Gotovi programi i vodič</div><h2>Za samostalan trening</h2>
      ${shop.map((pr) => h`<a class="price-card" href="${pr.tip === 'vodic' ? '#/ishrana' : '#/program/' + pr.id}"><div class="grow"><div class="nm" style="font-size:18px">${pr.naziv}</div><div class="ds">${pr.tip === 'vodic' ? 'e-vodič · 42 recepta · dnevni jelovnik' : pr.sedmica + ' sedmica · ' + pr.dana + '× sedmično · pristup ' + pr.sedmica + ' sedmica'}</div></div><div class="price-tag">${pr.cijena} ${config.valuta}</div></a>`)}
      <a class="btn block mb" href="#/programi">Svi programi →</a><div class="eyebrow mt">Prije početka</div>
      <a class="card" href="#/upitnik" style="display:block"><b>Upitnik za novu klijenticu</b><div class="small muted">Preuzmi ili popuni online prije početka coachinga.</div></a>`;
    anchor.insertAdjacentHTML('beforebegin', sec.s);
  };

  /* Kalkulatori: veza na suplemente */
  const alati0 = V.alati;
  V.alati = (el, p, q) => {
    alati0(el, p, q);
    const wrap = document.createElement('div'); wrap.innerHTML = h`<a class="card" href="#/suplementi" style="display:block"><b>Suplementi</b><div class="small muted">Praktične smjernice: šta ima smisla, a šta ne</div></a>`.s;
    el.appendChild(wrap.firstChild);
  };
})();
