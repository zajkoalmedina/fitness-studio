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

  FS.mjForm = (act, forUid) => h`<form data-act="${act || 'mj'}" ${forUid ? raw('data-uid="' + forUid + '"') : ''} novalidate>
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
      ['trener', 'Da li si ranije radio/la sa trenerom?', 'single', ['Da', 'Ne']], ['ranije', 'Koje vrste aktivnosti ili treninga si ranije radio/la?', 'area'], ['voli', 'Postoje li vježbe koje posebno voliš?', 'area'], ['neVoli', 'Postoje li vježbe koje ne voliš ili ne želiš raditi?', 'area']]],
    ['4. Zdravlje i sigurnost', [['bol', 'Da li trenutno imaš bol, povredu ili ograničenje koje može uticati na trening?', 'yn'], ['povreda', 'Da li si ranije imao/la ozbiljniju povredu ili operaciju?', 'yn'],
      ['ogranic', 'Da li ti je ljekar ili fizioterapeut ograničio određene fizičke aktivnosti ili vježbe?', 'yn'], ['terapija', 'Da li trenutno koristiš terapiju/lijekove koji mogu biti relevantni za fizičku aktivnost?', 'yn'],
      ['stanje', 'Postoji li zdravstveno stanje za koje smatraš da trener treba znati prije početka treninga?', 'yn']],
      'Ako postoji zdravstveni problem, bol ili stanje koje nije u domenu trenera, prije uključivanja ili nastavka određenih aktivnosti može biti potrebna procjena odgovarajućeg zdravstvenog stručnjaka.'],
    ['5. Organizacija treninga', [['sedm', 'Koliko puta sedmično realno možeš trenirati?', 'single', ['2', '3', '4', '5']], ['vrijeme', 'Koliko vremena imaš za jedan trening?', 'single', ['30–45 min', '45–60 min', '60–75 min', '75+ min']],
      ['gdje', 'Gdje ćeš trenirati?', 'single', ['Teretana', 'Kuća', 'Kombinovano']], ['oprema', 'Ako treniraš kod kuće, koju opremu imaš?', 'area'], ['dani', 'Koji dani ti najviše odgovaraju za trening?', 'area']]],
    ['6. Kretanje i kardio', [['aktivnost', 'Koliko si aktivan/na tokom prosječnog dana?', 'single', ['Vrlo malo', 'Malo', 'Umjereno', 'Veoma aktivno']], ['koraci', 'Ako pratiš korake, približan dnevni prosjek', 'text'],
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
      ['oCheck', 'Da li si spreman/na jednom sedmično ispuniti kratki check-in o treningu, oporavku i napretku?', 'single', ['Da', 'Ne']], ['jos', 'Postoji li još nešto što smatraš važnim da znam prije nego napravim tvoj program?', 'area']]],
    ['11. Opcionalno', [['ciklus', 'Postoje li promjene tokom menstrualnog ciklusa koje primjetno utiču na tvoju energiju, trening ili oporavak?', 'single', ['Ne', 'Da', 'Ne želim odgovoriti']], ['ciklusO', 'Ako želiš, opiši', 'area']]]
  ];
  FS.UPITNIK = U;
  const myUp = (userId) => (Store.db.upitnici || []).find((x) => x.userId === userId && !x.tip);

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

  FS.ODGOVORNOST = 'Na treninge i program pristupam na vlastitu odgovornost. Trener nije zamjena za ljekara, a program ne predstavlja medicinski savjet. Ako imam bol, povredu ili zdravstveni problem, prije treninga se javljam ljekaru ili fizioterapeutu.';
  FS.IZJAVA = 'Potvrđujem da sam navedene podatke dao/la tačno prema svom trenutnom znanju i da ću treneru prijaviti promjene koje mogu biti relevantne za sigurno provođenje treninga. Razumijem da treniram na vlastitu odgovornost i da trener ne zamjenjuje ljekara.';

  V.upitnik = (el) => {
    const u = Auth.user(), cur = u && u.role === 'klijentica' ? myUp(u.id) : null, a = (cur && cur.odg) || {};
    el.innerHTML = h`<div class="eyebrow">Novi klijent / klijentica</div><h1>Upitnik</h1>
      <p class="muted">Upitnik za personalni / online coaching. Popuni ga prije početka programa da bih ti mogla prilagoditi trening.</p>
      <a class="btn block mb" href="${FILE}" download>Preuzmi upitnik (Word), za ispis ili slanje</a>
      ${u && u.role === 'klijentica' ? h`
        <div class="card note small">Odgovore vidi samo trenerica. ${cur ? 'Upitnik si već popunila ' + fmtDate(cur.datum) + '. Možeš ga urediti i ponovo sačuvati.' : ''}</div>
        <form data-act="upit" novalidate>
          ${U.map(([naslov, qs, napomena]) => h`<div class="card"><h3>${naslov}</h3>${qs.map((q) => qHtml(q, a))}${napomena ? h`<p class="small">${napomena}</p>` : ''}</div>`)}
          <div class="card cream"><h3>Izjava klijenta / klijentice</h3><p class="small">${FS.IZJAVA}</p>
            <label class="check"><input type="checkbox" name="izjava" ${cur && cur.izjava ? 'checked' : ''}><span>Slažem se s izjavom</span></label></div>
          <div class="card alert"><b>Važna napomena:</b> ${FS.ODGOVORNOST}</div>
          <p class="err" id="uerr" hidden></p><button class="btn primary block" type="submit">Sačuvaj upitnik</button></form>`
    : h`<div class="card flat center"><p class="muted" style="margin:0 0 8px">Za online popunjavanje prijavi se (račun dobijaš uz pozivnicu trenera).</p><a class="btn primary sm" href="#/prijava">Prijava</a></div>`}`;
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
        Store.save(); x = myUp(u.id);
        const em = (Store.db.postavke || {}).trenerEmail, body = FS.upitnikText(x, u.ime);
        if (em) {
          FS.openSheet(h`<h2>Upitnik je sačuvan</h2><p class="muted">Trenerica ga vidi u aplikaciji. Ako želiš, pošalji joj ga i e-mailom.</p>
            <a class="btn primary block" href="${'mailto:' + em + '?subject=' + encodeURIComponent('Upitnik: ' + u.ime) + '&body=' + encodeURIComponent(body.slice(0, 1800))}">Pošalji e-mailom</a>
            <button class="btn block mt-s" data-act="cl">Zatvori</button>`, (s) => bind(s, { 'click:cl': () => { FS.closeSheet(); location.hash = '#/moj'; } }));
        } else { toast('Upitnik je sačuvan.'); location.hash = '#/moj'; }
      }
    });
  };

  FS.upitnikText = (x, ime) => {
    const a = x.odg || {}, out = ['UPITNIK ZA NOVOG KLIJENTA', 'Klijent / klijentica: ' + (ime || ''), 'Datum: ' + x.datum, ''];
    U.forEach(([naslov, qs]) => {
      const L = [];
      qs.forEach(([k, t, tip]) => { let v = a[k]; if (Array.isArray(v)) v = v.join(', '); if (tip === 'yn' && a[k + '_o']) v = (v || '') + ' – ' + a[k + '_o']; if (v) L.push('- ' + t + ' ' + v); });
      if (L.length) out.push(naslov, ...L, '');
    });
    out.push('IZJAVA: ' + FS.IZJAVA, '', 'NAPOMENA: ' + FS.ODGOVORNOST);
    return out.join('\n');
  };
  FS.upitnikBanner = (u) => (myUp(u.id) ? '' : h`<div class="card note"><b>Popuni upitnik</b><div class="small">Kratak upitnik za nove klijente, da ti mogu prilagoditi program.</div><a class="btn sm primary mt-s" href="#/upitnik">Popuni upitnik</a></div>`);

  FS.upitnikCard = (u) => {
    const x = myUp(u.id);
    if (x && !x.vid) { x.vid = true; Store.save(); }
    if (!x) return h`<div class="card"><h3>Upitnik</h3><p class="muted" style="margin:0">Klijent / klijentica još nije popunio/la upitnik.</p></div>`;
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

  /* ================= RASPORED TRENINGA (trenerica slaže po danima) ================= */
  const DANI = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
  const dl = (iso) => { const d = FS.parse(iso); return DANI[(d.getDay() + 6) % 7] + ' ' + d.getDate() + '.' + (d.getMonth() + 1) + '.'; };
  const planStart = {};
  const rasp = () => (Store.db.raspored = Store.db.raspored || []);
  const entryLabel = (e) => {
    if (e.tip === 'odmor') return 'Odmor';
    if (e.tip === 'kond') return 'Kondicija (EMOM / HIIT / AMRAP)';
    if (e.tip === 'kardio') return 'Kardio / hodanje';
    if (e.tip === 'dij') return 'Dijastaza: ' + ((FS.DIJASTAZA.faze[e.faza] || {}).naziv || 'program');
    const pr = Store.program(e.programId), dn = pr && pr.dani[e.dan];
    return pr ? pr.naziv + (dn ? ': ' + dn.naziv : '') : 'Trening';
  };
  const planOptions = (u) => {
    const o = [['', '— nije određeno —'], ['odmor', 'Odmor']];
    Store.userPrograms(u).filter((pr) => FS.access(u, pr).on).forEach((pr) => pr.dani.forEach((dn, i) => o.push(['p|' + pr.id + '|' + i, pr.naziv + ': ' + dn.naziv])));
    if (FS.DIJASTAZA) FS.DIJASTAZA.faze.forEach((f, i) => o.push(['dij|' + i, 'Dijastaza: ' + f.naziv]));
    o.push(['kond', 'Kondicija (EMOM / HIIT / AMRAP)'], ['kardio', 'Kardio / hodanje']);
    return o;
  };
  FS.planCard = (u) => {
    const start = planStart[u.id] || FS.weekStart(today()), o = planOptions(u);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    const cur = (iso) => rasp().find((e) => e.userId === u.id && e.datum === iso);
    const val = (e) => (!e ? '' : e.tip === 'dan' ? 'p|' + e.programId + '|' + e.dan : e.tip === 'dij' ? 'dij|' + e.faza : e.tip);
    return h`<div class="card"><h3>Raspored treninga</h3>
      <p class="small muted">Za svaki dan izaberi šta klijent / klijentica radi. To se prikazuje u njegovom / njenom prostoru, s dugmetom „Započni“. Najprije dodijeli program iznad.</p>
      <div class="row between mb"><button class="btn sm" data-planshift="-7" data-uid="${u.id}">← Ranije</button><b>${dl(days[0])} – ${dl(days[6])}</b><button class="btn sm" data-planshift="7" data-uid="${u.id}">Dalje →</button></div>
      <form data-act="plansave" data-uid="${u.id}" data-start="${start}" novalidate>
        ${days.map((d, i) => h`<div class="field" style="margin-bottom:8px"><span>${dl(d)}${d === today() ? ' (danas)' : ''}</span>
          <select name="s${i}">${opts(o, val(cur(d)))}</select>
          <input name="n${i}" maxlength="150" placeholder="Napomena (nije obavezno)" value="${(cur(d) && cur(d).nota) || ''}" style="margin-top:4px"></div>`)}
        <label class="field"><span>Ponovi isti raspored još</span><select name="rep">${opts([['0', 'Ne ponavljaj'], ['1', '1 sedmicu'], ['3', '3 sedmice'], ['7', '7 sedmica'], ['11', '11 sedmica (do 12 ukupno)']], '0')}</select></label>
        <button class="btn primary block" type="submit">Sačuvaj raspored</button></form></div>`;
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-planshift]'); if (!b) return;
    const id = b.dataset.uid; planStart[id] = addDays(planStart[id] || FS.weekStart(today()), +b.dataset.planshift); FS.rerender();
  });
  document.addEventListener('submit', (e) => {
    const f = e.target;
    if (f.matches && f.matches('form[data-act=plansave]')) {
      e.preventDefault(); const fd = new FormData(f), uidv = f.dataset.uid, start = f.dataset.start, reps = +fd.get('rep') || 0;
      for (let w = 0; w <= reps; w++) for (let i = 0; i < 7; i++) {
        const iso = addDays(start, w * 7 + i), v = String(fd.get('s' + i) || ''), nota = String(fd.get('n' + i) || '').trim().slice(0, 150);
        Store.db.raspored = rasp().filter((x) => !(x.userId === uidv && x.datum === iso));
        if (!v) continue;
        const en = { id: uid(), userId: uidv, datum: iso, nota, ts: Date.now() };
        if (v.startsWith('dij|')) Object.assign(en, { tip: 'dij', faza: +v.split('|')[1] }); else if (v.startsWith('p|')) { const [, pid, di] = v.split('|'); Object.assign(en, { tip: 'dan', programId: pid, dan: +di }); } else en.tip = v;
        Store.db.raspored.push(en);
      }
      Store.save(); toast('Raspored sačuvan.'); FS.rerender();
    }
    if (f.matches && f.matches('form[data-act=mjt]')) {
      e.preventDefault(); if (FS.mjSubmit(f, f.dataset.uid, f.closest('.card') || document)) FS.rerender();
    }
  });
  FS.rasporedCard = (u) => {
    const t = today(), until = addDays(t, 13);
    const list = rasp().filter((e) => e.userId === u.id && e.datum >= t && e.datum <= until).sort((a, b) => (a.datum < b.datum ? -1 : 1));
    if (!list.length) return '';
    const done = (iso) => Store.db.logs.some((l) => l.userId === u.id && l.datum === iso);
    return h`<div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Moj raspored</div>
      ${list.map((e) => { const pr = e.tip === 'dan' ? Store.program(e.programId) : null; const can = pr && FS.access(u, pr).on;
        return h`<div class="row between" style="padding:8px 0;border-bottom:1px solid rgba(10,22,48,.12)"><div><b>${dl(e.datum)}${e.datum === t ? ' · danas' : ''}</b><div class="small">${entryLabel(e)}${e.nota ? ' · ' + e.nota : ''}</div></div>
          ${done(e.datum) && e.tip !== 'odmor' ? h`<span class="badge ok">urađeno</span>` : (e.tip === 'dij' ? h`<a class="btn sm primary" href="#/trening/novi?p=dijastaza&f=${e.faza}">Započni</a>` : can ? h`<a class="btn sm primary" href="#/trening/novi?p=${pr.id}&d=${e.dan}&w=${FS.currentWeek(u, pr)}">Započni</a>` : '')}</div>`; })}</div>`;
  };

  /* ================= ZABORAVLJENA LOZINKA: zahtjev stiže treneru ================= */
  const genPw = () => { const c = 'abcdefghjkmnpqrstuvwxyz23456789', r = (n) => Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join(''); return 'Fs' + r(5) + '7' + r(2); };
  FS.pwRequests = () => {
    const l = (Store.db.prijave || []).filter((r) => r.tip === 'lozinka' && r.status === 'novo');
    if (!l.length) return '';
    return h`<h3>Zaboravljene lozinke</h3>${l.slice().reverse().map((r) => { const u = Store.db.users.find((x) => String(x.email).toLowerCase() === String(r.kontakt).toLowerCase());
      return h`<div class="card flat"><div class="row between"><b>${u ? u.ime : r.kontakt}</b><span class="badge warn">novo</span></div><div class="small">${fmtDate(r.datum)} · ${r.kontakt}${u ? '' : ' · nema računa s ovim e-mailom'}</div>
        <div class="row mt-s">${u ? h`<button class="btn sm primary grow" data-pwreq="${r.id}">Postavi novu lozinku</button>` : ''}<button class="btn sm danger" data-pwdel="${r.id}" aria-label="Obriši">${icon('trash')}</button></div></div>`; })}`;
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-pwreq]'), d = e.target.closest && e.target.closest('[data-pwdel]');
    if (d) { Store.db.prijave = Store.db.prijave.filter((x) => x.id !== d.dataset.pwdel); Store.save(); FS.rerender(); return; }
    if (!b) return;
    const r = Store.db.prijave.find((x) => x.id === b.dataset.pwreq), u = r && Store.db.users.find((x) => String(x.email).toLowerCase() === String(r.kontakt).toLowerCase());
    if (!u) { toast('Nema računa s ovim e-mailom.'); return; }
    const pw = genPw();
    FS.openSheet(h`<h2>Nova lozinka: ${u.ime}</h2><p class="small muted">Predložena je privremena lozinka. Možeš je promijeniti. Pri prvoj prijavi klijent bira svoju.</p>
      <form data-act="pwset" novalidate><label class="field"><span>Privremena lozinka</span><input name="p" autocomplete="off" value="${pw}"></label><p class="err" id="pwerr" hidden></p><button class="btn primary block" type="submit">Postavi lozinku</button></form>`, (s) => bind(s, {
      'submit:pwset': async (f) => {
        const p = String(formData(f).p || '').trim(), er = $('#pwerr', s);
        try { await Auth.setPassword(u.id, p); } catch (x) { er.textContent = x.message; er.hidden = false; return; }
        u.mora_promijeniti = true; r.status = 'obradjeno'; Store.save(); FS.closeSheet();
        const msg = 'Zdravo ' + String(u.ime).split(' ')[0] + '! Tvoja nova privremena lozinka za aplikaciju Almedina Fitness je: ' + p + '\nPrijavi se s e-mailom ' + u.email + ', pa ćeš odmah izabrati svoju lozinku.';
        FS.openSheet(h`<h2>Lozinka je postavljena</h2><p class="small muted">Pošalji klijentu ovu poruku (WhatsApp, Viber, Instagram).</p><textarea id="pwmsg" rows="6" readonly>${msg}</textarea>
          <div class="row mt-s"><button class="btn primary grow" data-act="cp">Kopiraj poruku</button><button class="btn grow" data-act="ok">Gotovo</button></div>`, (s2) => bind(s2, {
          'click:cp': () => copyText(msg, $('#pwmsg', s2)), 'click:ok': () => { FS.closeSheet(); FS.rerender(); } }));
      }
    }));
  });

  /* ================= POSTAVKE: e-mail za upitnike ================= */
  FS.postavkeCard = () => h`<form class="card" data-act="postavke" novalidate><h3>E-mail za upitnike</h3>
    <p class="small muted">Kad klijent popuni upitnik, ponudit će mu se slanje na ovu adresu. Upitnik uvijek vidiš i u aplikaciji.</p>
    <label class="field"><span>Tvoj e-mail</span><input name="em" type="email" autocapitalize="off" value="${(Store.db.postavke || {}).trenerEmail || ''}" placeholder="npr. ime@gmail.com"></label>
    <button class="btn sm primary" type="submit">Sačuvaj</button></form>`;
  document.addEventListener('submit', (e) => {
    const f = e.target; if (!(f.matches && f.matches('form[data-act=postavke]'))) return;
    e.preventDefault(); const em = String(new FormData(f).get('em') || '').trim().toLowerCase();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { toast('Unesi ispravnu e-mail adresu.'); return; }
    Store.db.postavke = Object.assign({}, Store.db.postavke, { trenerEmail: em }); Store.save(); toast('Sačuvano.');
  });

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


  /* ================= POZIVNICE (registracija samo uz pozivnicu) ================= */
  const pozList = () => (Store.db.pozivnice = Store.db.pozivnice || []);
  const appUrl = () => location.origin + location.pathname;
  FS.invMsg = (p) => 'Zdravo' + (p.ime ? ' ' + String(p.ime).split(' ')[0] : '') + '! Pozvan/a si u aplikaciju Almedina Fitness.\n\n1) Otvori: ' + appUrl() + '#/prijava?tab=registracija&e=' + encodeURIComponent(p.id) +
    '\n2) Upiši e-mail ' + p.id + ', svoje ime i izaberi lozinku (najmanje 8 znakova, slovo i broj).\n3) Na iPhoneu: Safari, Podijeli, Dodaj na početni ekran.\n\nLozinku znaš samo ti.';
  FS.pozivnicePending = () => {
    const have = new Set(Store.db.users.map((u) => String(u.email || '').toLowerCase())), l = pozList().filter((p) => !have.has(String(p.id).toLowerCase()));
    if (!l.length) return '';
    return h`<h3>Poslane pozivnice</h3>${l.map((p) => h`<div class="card flat"><b>${p.ime || p.id}</b><div class="small">${p.id}${p.paket ? ' · ' + p.paket : ''} · čeka aktivaciju računa</div>
      <div class="mt-s">${(p.programi || []).map((pid) => { const pr = Store.program(pid); return h`<div class="row between small" style="padding:4px 0"><span>${pr ? pr.naziv : pid}</span><button class="btn sm danger" data-invrm="${p.id}" data-pid="${pid}" aria-label="Ukloni program">×</button></div>`; })}
        <div class="row"><select class="grow" data-invsel="${p.id}"><option value="">Dodijeli program unaprijed…</option>${Store.allPrograms().filter((x) => !(p.programi || []).includes(x.id)).map((x) => h`<option value="${x.id}">${x.naziv}</option>`)}</select><button class="btn sm" data-invadd="${p.id}">Dodaj</button></div></div>
      <div class="row mt-s"><button class="btn sm grow" data-invcopy="${p.id}">Kopiraj poruku</button><button class="btn sm danger" data-invdel="${p.id}" aria-label="Obriši pozivnicu">${icon('trash')}</button></div></div>`)}<h3>Klijenti</h3>`;
  };
  const copyText = async (t, ta) => {
    try { await navigator.clipboard.writeText(t); toast('Poruka je kopirana. Zalijepi je u WhatsApp, Viber ili Instagram.'); }
    catch (e) { if (ta) { ta.select(); try { document.execCommand('copy'); toast('Poruka je kopirana.'); } catch (er) { toast('Označi tekst i kopiraj ga ručno.'); } } }
  };
  FS.inviteSheet = (done) => {
    FS.openSheet(h`<h2>Pozovi klijenta / klijenticu</h2><p class="small muted">Račun se može napraviti samo na e-mail koji ovdje upišeš. Poslije dobiješ poruku koju šalješ u WhatsApp, Viber ili Instagram.</p>
      <form data-act="inv" novalidate><label class="field"><span>Ime i prezime</span><input name="ime" autocomplete="off"></label>
      <label class="field"><span>E-mail</span><input name="email" type="email" autocapitalize="off" autocomplete="off"></label>
      <label class="field"><span>Paket</span><select name="paket">${opts([['', 'Bez paketa'], 'START', 'ACTIVE', 'STRONG'])}</select></label>
      <p class="err" id="ierr" hidden></p><button class="btn primary block" type="submit">Napravi pozivnicu</button></form>`, (s) => bind(s, {
      'submit:inv': (f) => {
        const d = formData(f), em = String(d.email || '').trim().toLowerCase(), ime = String(d.ime || '').trim(), er = $('#ierr', s);
        const bad = (m) => { er.textContent = m; er.hidden = false; };
        if (ime.length < 2) return bad('Unesi ime.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return bad('Unesi ispravnu e-mail adresu.');
        if (Store.db.users.some((u) => String(u.email).toLowerCase() === em)) return bad('Račun s ovim e-mailom već postoji.');
        const inv = { id: em, ime: ime.slice(0, 80), paket: d.paket || '', ts: Date.now() };
        const i = pozList().findIndex((x) => x.id === em); if (i >= 0) pozList()[i] = inv; else pozList().push(inv);
        Store.save(); FS.closeSheet();
        FS.openSheet(h`<h2>Pozivnica je spremna</h2><p class="small muted">Pošalji ovu poruku ${ime}. Kad se registruje tim e-mailom, račun je njen / njegov.</p>
          <textarea id="imsg" rows="9" readonly>${FS.invMsg(inv)}</textarea>
          <div class="row mt-s"><button class="btn primary grow" data-act="cp">Kopiraj poruku</button>${navigator.share ? h`<button class="btn grow" data-act="sh">Podijeli…</button>` : ''}</div>
          <button class="btn block mt-s" data-act="ok">Gotovo</button>`, (s2) => bind(s2, {
          'click:cp': () => copyText(FS.invMsg(inv), $('#imsg', s2)),
          'click:sh': () => navigator.share({ text: FS.invMsg(inv) }).catch(() => {}),
          'click:ok': () => { FS.closeSheet(); if (done) done(); }
        }));
      }
    }));
  };
  document.addEventListener('click', async (e) => {
    const c = e.target.closest && e.target.closest('[data-invcopy]'), d = e.target.closest && e.target.closest('[data-invdel]');
    if (c) { const p = pozList().find((x) => x.id === c.dataset.invcopy); if (p) copyText(FS.invMsg(p)); }
    const ad = e.target.closest && e.target.closest('[data-invadd]'), rm = e.target.closest && e.target.closest('[data-invrm]');
    if (ad) { const p = pozList().find((x) => x.id === ad.dataset.invadd), sel = document.querySelector('[data-invsel="' + CSS.escape(ad.dataset.invadd) + '"]'); if (p && sel && sel.value) { p.programi = (p.programi || []).concat(sel.value); Store.save(); toast('Program je dodijeljen. Klijent ga ima čim napravi račun.'); FS.rerender(); } }
    if (rm) { const p = pozList().find((x) => x.id === rm.dataset.invrm); if (p) { p.programi = (p.programi || []).filter((x) => x !== rm.dataset.pid); Store.save(); FS.rerender(); } }
    if (d) {
      if (!await FS.confirmSheet({ title: 'Obrisati pozivnicu?', text: 'Osoba se više neće moći registrovati s tim e-mailom.', ok: 'Obriši', danger: true })) return;
      Store.db.pozivnice = pozList().filter((x) => x.id !== d.dataset.invdel); Store.save(); FS.rerender();
    }
  });

  /* ================= UPLATE (ko je platio, a ko nije) ================= */
  const MJESECI = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Juni', 'Juli', 'August', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];
  let uplMonth = today().slice(0, 7), uplFilter = 'svi';
  const mjL = (m) => MJESECI[+m.slice(5, 7) - 1] + ' ' + m.slice(0, 4);
  const shiftM = (m, d) => { const dt = new Date(+m.slice(0, 4), +m.slice(5, 7) - 1 + d, 1); return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'); };
  const uplList = () => (Store.db.uplate = Store.db.uplate || []);
  const payOf = (id, m) => uplList().find((x) => x.userId === id && x.mjesec === m);
  const expOf = (u) => { const p = FS.paketi().find((x) => x.id === u.paket); return p ? p.cijena : 0; };
  FS.payTag = (u) => {
    if (u.aktivan === false || !u.paket) return '';
    return payOf(u.id, today().slice(0, 7)) ? h` · <span class="badge ok">plaćeno</span>` : h` · <span class="badge warn">nije plaćeno</span>`;
  };
  FS.uplateTab = () => {
    const act = Store.klijentice().filter((u) => u.aktivan !== false);
    const all = act.map((u) => ({ u, p: payOf(u.id, uplMonth), exp: expOf(u) }));
    const paid = all.reduce((s, r) => s + (r.p ? +r.p.iznos || 0 : 0), 0), due = all.filter((r) => !r.p).reduce((s, r) => s + r.exp, 0);
    const nPaid = all.filter((r) => r.p).length, nUn = all.filter((r) => !r.p && r.u.paket).length;
    const rows = all.filter((r) => uplFilter === 'svi' || (uplFilter === 'jesu' ? r.p : !r.p && r.u.paket));
    return h`<div class="row between mb"><button class="btn sm" data-uplshift="-1">←</button><b>${mjL(uplMonth)}</b><button class="btn sm" data-uplshift="1">→</button></div>
      <div class="stats"><div class="stat"><b>${paid} ${config.valuta}</b><span>uplaćeno</span></div><div class="stat"><b>${due} ${config.valuta}</b><span>još čeka</span></div><div class="stat"><b>${nUn}</b><span>nisu platili</span></div></div>
      <div class="chips mb">${[['svi', 'Svi'], ['nisu', 'Nisu platili'], ['jesu', 'Platili (' + nPaid + ')']].map(([k, l]) => h`<button class="chip ${uplFilter === k ? 'on' : ''}" data-uplf="${k}">${l}</button>`)}</div>
      ${rows.length ? rows.map((r) => h`<div class="card"><div class="row between"><div class="grow"><a href="#/trener/klijentica/${r.u.id}"><b style="color:var(--cream)">${r.u.ime}</b></a>
        <div class="small">${r.u.paket ? r.u.paket + ' · ' + r.exp + ' ' + config.valuta : 'bez paketa'}${r.p ? ' · uplaćeno ' + fmtDate(r.p.datum) + ': ' + r.p.iznos + ' ' + config.valuta + (r.p.napomena ? ' (' + r.p.napomena + ')' : '') : ''}</div></div>
        ${r.p ? h`<span class="badge ok">plaćeno</span>` : h`<span class="badge warn">nije</span>`}</div>
        <div class="row mt-s">${r.p ? h`<button class="btn sm grow" data-uplundo="${r.u.id}">Poništi uplatu</button>` : h`<button class="btn primary sm grow" data-uplpay="${r.u.id}">Označi kao plaćeno</button>`}</div></div>`) : h`<div class="empty">${act.length ? 'Nema klijenata za ovaj filter.' : 'Još nema klijenata.'}</div>`}`;
  };
  document.addEventListener('click', async (e) => {
    const t = (sel) => e.target.closest && e.target.closest(sel);
    let b;
    if ((b = t('[data-uplshift]'))) { uplMonth = shiftM(uplMonth, +b.dataset.uplshift); FS.rerender(); }
    if ((b = t('[data-uplf]'))) { uplFilter = b.dataset.uplf; FS.rerender(); }
    if ((b = t('[data-uplundo]'))) {
      if (!await FS.confirmSheet({ title: 'Poništiti uplatu?', text: 'Uplata za ' + mjL(uplMonth) + ' bit će uklonjena.', ok: 'Poništi', danger: true })) return;
      Store.db.uplate = uplList().filter((x) => !(x.userId === b.dataset.uplundo && x.mjesec === uplMonth)); Store.save(); FS.rerender();
    }
    if ((b = t('[data-uplpay]'))) {
      const u = Store.user(b.dataset.uplpay); if (!u) return;
      FS.openSheet(h`<h2>Uplata: ${u.ime}</h2><div class="small mb">${mjL(uplMonth)}</div><form data-act="upls" novalidate>
        <label class="field"><span>Iznos (${config.valuta})</span><input name="iznos" inputmode="decimal" value="${expOf(u) || ''}"></label>
        <label class="field"><span>Napomena (nije obavezno)</span><input name="nota" maxlength="80" placeholder="npr. gotovina, račun…"></label>
        <p class="err" id="uerr2" hidden></p><button class="btn primary block" type="submit">Sačuvaj uplatu</button></form>`, (s) => bind(s, {
        'submit:upls': (f) => {
          const d = formData(f), v = num(d.iznos);
          if (isNaN(v) || v < 0 || v > 100000) { const er = $('#uerr2', s); er.textContent = 'Unesi ispravan iznos.'; er.hidden = false; return; }
          Store.db.uplate = uplList().filter((x) => !(x.userId === u.id && x.mjesec === uplMonth));
          Store.db.uplate.push({ id: uid(), userId: u.id, mjesec: uplMonth, iznos: v, datum: today(), napomena: String(d.nota || '').trim().slice(0, 80) });
          Store.save(); FS.closeSheet(); toast('Uplata zabilježena.'); FS.rerender();
        }
      }));
    }
  });

  /* ================= VJEŽBE: biblioteka samo za trenericu ================= */
  FS.allowedExercises = (u) => {
    if (u && u.role === 'trener') return Store.exercises();
    const ids = new Set();
    Store.allPrograms().filter((p) => FS.access(u, p).on).forEach((p) => (p.dani || []).forEach((d) => (d.vj || []).forEach((x) => ids.add(x.id))));
    if (FS.DIJASTAZA && u) FS.DIJASTAZA.faze.forEach((f) => f.dani.forEach((d) => d.vj.forEach((x) => ids.add(x.id))));
    return Store.exercises().filter((e) => ids.has(e.id));
  };
  const vjezbe0 = V.vjezbe, vjezba0 = V.vjezba;
  V.vjezbe = (el, p, q) => {
    const u = Auth.user();
    if (u && u.role === 'trener') return vjezbe0(el, p, q);
    el.innerHTML = h`<div class="card note"><b>Vježbe su u programima.</b><p class="muted" style="margin:6px 0 0">Vježbe vidiš unutar programa koji ti je dodijeljen ili koji si kupila / kupio.</p></div><a class="btn primary block" href="#/programi">Programi</a>`;
  };
  V.vjezba = (el, p, q) => {
    const u = Auth.user();
    if (u && u.role === 'trener') return vjezba0(el, p, q);
    if (!FS.allowedExercises(u).some((e) => e.id === p.id)) { el.innerHTML = h`<div class="card note"><b>Vježba nije dostupna.</b><p class="muted" style="margin:6px 0 0">Vježbe se otključavaju uz program.</p></div><a class="btn primary block" href="#/programi">Programi</a>`; return; }
    return vjezba0(el, p, q);
  };
  const home1 = V.home;
  V.home = (el, p, q) => {
    home1(el, p, q);
    const u = Auth.user();
    if (!(u && u.role === 'trener')) el.querySelectorAll('a.tile[href="#/vjezbe"]').forEach((a) => a.remove());
  };

  /* ================= VODIČ: čitač PDF-a (iste stranice, sa slikama) ================= */
  const BASE = (document.currentScript && document.currentScript.src ? document.currentScript.src : location.href).replace(/[^/]+$/, '');
  let pdfLib = null, pdfCache = { path: '', blob: null };
  FS.pdfReady = () => !!pdfInfo();
  FS.pdfTab = () => {
    const p = pdfInfo();
    return p ? h`<div id="pdfhost"><div class="card"><p class="muted" style="margin:0">Učitavam vodič…</p></div></div>
      <button class="btn block mb" data-pdfget="1">Preuzmi PDF</button>`
      : h`<div class="card note">PDF vodič još nije dodat. ${Auth.user() && Auth.user().role === 'trener' ? 'Dodaj ga u panelu: Programi, pa PDF vodič.' : 'Trenerica će ga uskoro dodati.'}</div>`;
  };
  FS.pdfMount = async (root) => {
    const host = $('#pdfhost', root), p = pdfInfo();
    if (!host || !p) return;
    try {
      if (pdfCache.path !== p.path) { const b = await FS.fileStore.get(p.path); if (!b) throw new Error('nema'); pdfCache = { path: p.path, blob: b }; }
      if (!pdfLib) { pdfLib = await import(BASE + 'vendor/pdf.min.mjs'); pdfLib.GlobalWorkerOptions.workerSrc = BASE + 'vendor/pdf.worker.min.mjs'; }
      const doc = await pdfLib.getDocument({ data: new Uint8Array(await pdfCache.blob.arrayBuffer()) }).promise;
      if (!host.isConnected) { doc.destroy(); return; }
      const first = await doc.getPage(1), vp = first.getViewport({ scale: 1 }), ratio = vp.height / vp.width;
      host.innerHTML = '<div class="pdfinfo small muted">Stranice: ' + doc.numPages + '. Dodirni dvaput za uvećanje.</div>';
      const boxes = [];
      for (let i = 1; i <= doc.numPages; i++) { const d = document.createElement('div'); d.className = 'pdfpg'; d.style.aspectRatio = '1 / ' + ratio.toFixed(4); d.dataset.n = i; host.appendChild(d); boxes.push(d); }
      const state = new Map();
      const render = async (box) => {
        if (state.get(box)) return; state.set(box, 'busy');
        try {
          const pg = await doc.getPage(+box.dataset.n), w = box.clientWidth || 360, sc = (w / pg.getViewport({ scale: 1 }).width) * Math.min(window.devicePixelRatio || 1, 2);
          const v = pg.getViewport({ scale: sc }), cv = document.createElement('canvas'); cv.width = Math.floor(v.width); cv.height = Math.floor(v.height);
          await pg.render({ canvasContext: cv.getContext('2d'), viewport: v }).promise;
          if (state.get(box) === 'busy') { box.replaceChildren(cv); state.set(box, 'done'); }
        } catch (e) { state.delete(box); console.warn('pdf page', e); }
      };
      const io = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting) render(en.target);
        else if (state.get(en.target) === 'done') { en.target.replaceChildren(); state.delete(en.target); }
      }), { rootMargin: '900px 0px' });
      boxes.forEach((b) => io.observe(b));
      FS.onLeave(() => { io.disconnect(); doc.destroy(); });
      host.addEventListener('dblclick', (ev) => { const b = ev.target.closest('.pdfpg'); if (b) b.classList.toggle('zoom'); });
    } catch (e) { host.innerHTML = '<div class="card alert">Vodič se trenutno ne može prikazati. Provjeri internet i pokušaj ponovo.</div>'; console.warn(e); }
  };


  /* ================= DIJASTAZA: zatvoren program, besplatan za klijente ================= */
  const dijDoc = (u) => { const L = (Store.db.upitnici = Store.db.upitnici || []); return L.find((x) => x.userId === u.id && x.tip === 'dijack'); };
  V.dijastaza = (el) => {
    const D = FS.DIJASTAZA, u = Auth.user();
    if (!u) {
      el.innerHTML = h`<div class="eyebrow">Kućni program</div><h1>Dijastaza recti</h1>
        <div class="card cream"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow" style="color:var(--navy)"><b>Besplatno za klijente</b><div class="small">Program od 8 sedmica u 4 faze za sigurno vraćanje treningu nakon trudnoće. Otključava se kad dobiješ račun od trenera.</div></div></div></div>
        <a class="btn primary block mb" href="#/prijava">Prijava</a><a class="btn block" href="#/paketi?tab=personalni">Kontakt i paketi</a>`;
      return;
    }
    const isK = u.role === 'klijentica';
    const draw = () => {
      const d = isK ? dijDoc(u) : { faza: 0 }, ack = !isK || !!d, cur = d ? Math.min(d.faza || 0, 4) : 0;
      const odgovori = Store.db.poruke.filter((m) => m.userId === u.id && m.tip === 'dijastaza');
      const phase = (f, i) => {
        const state = i < cur ? 'urađena' : i === cur ? 'trenutna' : 'sljedeća';
        return h`<details class="card" ${i === cur || !isK ? 'open' : ''}><summary style="cursor:pointer"><div class="row between"><b style="font-family:var(--serif);font-size:18px">${f.naziv}</b><span class="badge ${i < cur ? 'ok' : i === cur ? 'warn' : ''}">${state}</span></div><div class="small">${f.sedmice} · ${f.dana}</div></summary>
          <p class="muted mt-s">${f.cilj}</p>
          ${f.dani.map((dd, di) => h`<h3 class="mt-s">${dd.naziv}</h3><ul class="clean">${dd.vj.map((x) => { const e = Store.ex(x.id); if (!e) return ''; return h`<li>${FS.hasFigure(e.id) ? h`<a href="#/vjezba/${e.id}" class="ph figph" aria-hidden="true" tabindex="-1">${FS.raw(FS.figureSVG(e.id, 1, ''))}</a>` : ''}<div class="grow"><a href="#/vjezba/${e.id}"><b style="color:var(--cream)">${e.naziv}</b></a>${x.n ? h`<div class="small">${x.n}</div>` : ''}${FS.raw(FS.pauzaTag ? FS.pauzaTag(x) : '')}</div><b>${x.s} × ${x.r}</b></li>`; })}</ul>
          ${isK ? h`<a class="btn primary block mt-s" href="#/trening/novi?p=dijastaza&f=${i}&d=${di}">Započni ${dd.naziv.toLowerCase()}</a>` : ''}`)}
          ${isK && i === cur ? h`<button class="btn block mt-s" data-act="next" data-i="${i}">Završila sam ovu fazu</button>` : ''}</details>`;
      };
      el.innerHTML = h`<div class="eyebrow">Kućni program · besplatno za klijente</div><h1>Dijastaza recti</h1>
        <p class="muted">Razdvojenost ravnih trbušnih mišića (najčešće nakon trudnoće). Program je blag i postepen: disanje, dubinska stabilnost i kontrola, pa tek onda snaga.</p>
        <div class="stats"><div class="stat"><b>8</b><span>sedmica</span></div><div class="stat"><b>4</b><span>faze</span></div><div class="stat"><b>3–4×</b><span>sedmično</span></div></div>
        <div class="card alert"><h3>Prije nego počneš</h3><ul class="dots">${D.prijeStarta.map((t) => h`<li>${t}</li>`)}</ul></div>
        <div class="card"><h3>Prekini vježbanje i javi se ljekaru ili fizioterapeutu ako:</h3><ul class="clean">${D.stop.map((t) => h`<li><span class="tick no">!</span><span>${t}</span></li>`)}</ul></div>
        ${ack ? '' : h`<div class="card cream"><h3>Potvrda</h3><label class="check" style="color:var(--navy)"><input type="checkbox" data-act="ackbox"><span>Razumijem da ovo nije medicinski savjet te da sam se konsultovala (ili ću se konsultovati) s ljekarom ili fizioterapeutom prije vježbanja.</span></label><button class="btn primary block mt-s" data-act="ack" disabled>Otključaj program</button></div>`}
        ${ack ? h`<h2 class="mt">Program po fazama</h2>
          ${isK ? h`<div class="progress mb" role="progressbar" aria-valuenow="${cur}" aria-valuemax="4"><i style="width:${Math.min(100, (cur / 4) * 100)}%"></i></div><div class="small mb">${cur >= 4 ? 'Završila si sve četiri faze. Svaka čast!' : 'Faza ' + (cur + 1) + ' od 4'}</div>` : ''}
          ${D.faze.map(phase)}
          <div class="card note"><b>Kada preći na sljedeću fazu?</b><p class="muted mt-s" style="margin:0">${D.napredovanje}</p></div>
          ${D.kretanje ? h`<div class="card"><h3>${D.kretanje.naslov}</h3><p class="muted">${D.kretanje.uvod}</p><ul class="dots">${D.kretanje.savjeti.map((t) => h`<li>${t}</li>`)}</ul></div>` : ''}
          <div class="card"><h3>Izbjegavaj u početku</h3><ul class="clean">${D.izbjegavaj.map((t) => h`<li><span class="tick no">✕</span><span>${t}</span></li>`)}</ul></div>
          <details class="card"><summary style="cursor:pointer;font-weight:600">Orijentaciona samoprovjera razmaka</summary><ol class="steps mt-s">${D.samotest.map((t) => h`<li><span>${t}</span></li>`)}</ol></details>` : ''}
        <div class="card"><h2>Individualna prilagodba</h2>
          <p class="muted">Opiši svoju situaciju (koliko je prošlo od porođaja, šta je rekao ljekar ili fizioterapeut, bolovi, ograničenja). Trener ti prilagođava program.</p>
          ${odgovori.map((m) => h`<div class="card flat"><div class="small">${fmtDate(m.datum)} · ${m.status === 'obradjeno' ? 'odgovoreno' : 'čeka odgovor'}</div><p style="margin:6px 0">${m.tekst}</p>${m.odgovor ? h`<div class="card cream" style="margin:0"><b>Odgovor trenera:</b><br>${m.odgovor}</div>` : ''}</div>`)}
          ${isK ? h`<form data-act="adapt" novalidate><label class="field"><span>Tvoja poruka</span><textarea name="t" maxlength="1200" placeholder="Opiši situaciju…"></textarea></label><p class="err" id="aerr" hidden></p><button class="btn primary block" type="submit">Pošalji treneru</button></form>` : ''}
        </div>`;
    };
    draw();
    bind(el, {
      'change:ackbox': (c) => { $('[data-act=ack]', el).disabled = !c.checked; },
      'click:ack': () => { Store.db.upitnici.push({ id: 'dij_' + u.id, userId: u.id, tip: 'dijack', datum: today(), faza: 0 }); Store.save(); draw(); window.scrollTo(0, 0); },
      'click:next': async () => {
        if (!await FS.confirmSheet({ title: 'Završena faza?', text: D.napredovanje, ok: 'Da, idem dalje' })) return;
        const d = dijDoc(u); d.faza = Math.min(4, (d.faza || 0) + 1); Store.save(); draw();
      },
      'submit:adapt': (f) => {
        const t = String(formData(f).t || '').trim(), e = $('#aerr', el);
        if (t.length < 10) { e.textContent = 'Napiši malo više detalja (najmanje 10 znakova).'; e.hidden = false; return; }
        Store.db.poruke.push({ id: uid(), userId: u.id, tip: 'dijastaza', tekst: t.slice(0, 1200), datum: today(), status: 'novo', odgovor: '' });
        Store.save(); toast('Poruka poslana treneru.'); draw();
      }
    });
  };

  /* ================= POČETNA: programi i vodič vidljivi prije registracije ================= */
  const home0 = V.home;
  V.home = (el, p, q) => {
    home0(el, p, q);
    const shop = Store.shop(), anchor = el.querySelector('.eyebrow.mt');
    if (!shop.length || !anchor) return;
    const sec = h`<div class="eyebrow">Gotovi programi i vodič</div><h2>Za samostalan trening</h2>
      ${shop.map((pr) => h`<a class="price-card" href="${pr.tip === 'vodic' ? '#/ishrana' : '#/program/' + pr.id}"><div class="grow"><div class="nm" style="font-size:18px">${pr.naziv}</div><div class="ds">${pr.tip === 'vodic' ? 'e-vodič · 42 recepta · dnevni jelovnik' : pr.sedmica + ' sedmica · ' + pr.dana + '× sedmično · pristup ' + pr.sedmica + ' sedmica'}</div></div><div class="price-tag">${pr.cijena} ${config.valuta}</div></a>`)}
      <a class="card" href="#/trcanje" style="display:block"><b>Trčanje za početnice: 5 km i 10 km</b><div class="small muted">Planovi i kalkulator tempa</div></a>
      <a class="btn block mb" href="#/programi">Svi programi →</a><div class="eyebrow mt">Prije početka</div>
      <a class="card" href="#/upitnik" style="display:block"><b>Upitnik za nove klijente</b><div class="small muted">Preuzmi ili popuni online prije početka coachinga.</div></a>`;
    anchor.insertAdjacentHTML('beforebegin', sec.s);
    el.insertAdjacentHTML('beforeend', '<p class="small center muted" style="margin-top:18px">Verzija 45</p>');
  };

  /* Kalkulatori: veza na suplemente */
  const alati0 = V.alati;
  V.alati = (el, p, q) => {
    alati0(el, p, q);
    const wrap = document.createElement('div'); wrap.innerHTML = h`<a class="card" href="#/trcanje" style="display:block"><b>Trčanje: planovi 5 km i 10 km + kalkulator tempa</b><div class="small muted">Za početnice, korak po korak</div></a><a class="card" href="#/suplementi" style="display:block"><b>Suplementi</b><div class="small muted">Praktične smjernice: šta ima smisla, a šta ne</div></a>`.s;
    while (wrap.firstChild) el.appendChild(wrap.firstChild);
  };
})();
