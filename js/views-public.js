/* Javni ekrani: početna, paketi, alati, vježbe, programi, dijastaza, prijava */
(function () {
  const FS = (window.FS = window.FS || {});
  FS.views = FS.views || {};
  const { h, raw, icon, bind, formData, opts, toast, openSheet, closeSheet, confirmSheet, Store, Auth, config, num, r1, fmtDate, today, uid, $ } = FS;
  const V = FS.views;

  const demoBar = () => (config.demo ? h`<div class="demo-bar">Probna verzija · demonstracijski podaci · bez stvarnih uplata</div>` : '');
  const go = (hash) => { location.hash = hash; };
  const homeFor = (u) => (u.role === 'trener' ? '#/trener' : '#/moj');
  FS.demoBar = demoBar;

  /* ---------- prijava na paket / upit (zajednički obrazac) ---------- */
  function openLead(paket) {
    const u = Auth.user();
    openSheet(h`<h2>Prijava${paket ? ' – ' + paket : ''}</h2>
      <p class="muted">Ostavi kontakt i javit ću ti se s daljnjim informacijama.</p>
      <form data-act="lead" novalidate>
        <label class="field"><span>Ime i prezime</span><input name="ime" autocomplete="name" value="${u ? u.ime : ''}" required></label>
        <label class="field"><span>E-mail ili Instagram</span><input name="kontakt" autocomplete="email" value="${u ? u.email : ''}" required></label>
        <label class="field"><span>Paket</span><select name="paket">${opts([['', 'Još nisam odlučila'], 'START', 'ACTIVE', 'STRONG', ['PERSONALNI', 'Personalni treninzi'], ['TINEJDZERI', 'Trening za tinejdžere (od 16 god.)']], paket || '')}</select></label>
        <label class="field"><span>Poruka (nije obavezno)</span><textarea name="tekst" maxlength="600"></textarea></label>
        <p class="err" id="leadErr" hidden></p>
        <button class="btn primary block" type="submit">Pošalji prijavu</button>
        ${config.instagram ? h`<a class="btn block mt-s" href="${config.instagram}" target="_blank" rel="noopener">Piši na Instagramu</a>` : ''}
      </form>`, (sheet) => bind(sheet, {
      'submit:lead': (f) => {
        const d = formData(f); const err = $('#leadErr', sheet);
        if (String(d.ime).trim().length < 2 || String(d.kontakt).trim().length < 3) { err.textContent = 'Unesi ime i kontakt.'; err.hidden = false; return; }
        Store.db.prijave.push({ id: uid(), ime: String(d.ime).trim().slice(0, 80), kontakt: String(d.kontakt).trim().slice(0, 120), paket: d.paket, tekst: String(d.tekst || '').slice(0, 600), datum: today(), status: 'novo' });
        Store.save(); closeSheet(); toast('Prijava poslana. Hvala!');
      }
    }));
  }
  FS.openLead = openLead;

  /* ================= POČETNA ================= */
  V.home = (el) => {
    const u = Auth.user();
    el.innerHTML = h`
      <section class="hero">
        <img src="images/trener.jpg" alt="FITNESS STUDIO – trenerica" fetchpriority="high">
        <div class="inner">
          <div class="eyebrow">Personalni treninzi · Online coaching</div>
          <h1>FITNESS<br>STUDIO</h1>
          <p>Stručno vođen, siguran i elegantan trening prilagođen tvojim ciljevima i mogućnostima.</p>
          <div class="row wrap mt">
            <a class="btn primary" href="#/paketi">Pogledaj pakete</a>
            <a class="btn" href="${u ? homeFor(u) : '#/prijava'}">${u ? 'Moj prostor' : 'Prijava'}</a>
          </div>
        </div>
      </section>
      ${demoBar()}
      <div class="eyebrow">Online coaching</div>
      <h2>Mjesečni paketi</h2>
      ${FS.paketi().map((p) => h`<a class="price-card" href="#/paketi">
        <div class="grow"><div class="nm">${p.id}</div><div class="ds">${p.sedmicno} treninga sedmično</div></div>
        <div class="price-tag">${p.cijena} ${config.valuta}</div></a>`)}
      <a class="btn block mb" href="#/paketi">Šta je sve uključeno →</a>

      <div class="eyebrow mt">Istraži</div>
      <div class="tiles">
        <a class="tile" href="#/vjezbe">${icon('dumbbell')}<b>Vježbe</b><small>Biblioteka s videouputama</small></a>
        <a class="tile" href="#/programi">${icon('list')}<b>Programi</b><small>Gotovi planovi treninga</small></a>
        <a class="tile" href="#/alati">${icon('calc')}<b>BMI i kalorije</b><small>Brzi kalkulatori</small></a>
        <a class="tile" href="#/ishrana">${icon('flame')}<b>Ishrana</b><small>Vodič, recepti, primjer dana</small></a>
        <a class="tile" href="#/dijastaza">${icon('heart')}<b>Dijastaza</b><small>Siguran kućni program</small></a>
        <a class="tile" href="#/paketi?tab=personalni">${icon('user')}<b>Personalni treninzi</b><small>Individualno i 2 na 1</small></a>
        <a class="tile" href="#/paketi?tab=tinejdzeri">${icon('shield')}<b>Tinejdžeri</b><small>Od 16 godina</small></a>
      </div>
      <div class="card flat mt center"><p class="muted" style="margin:0">Imaš pitanje? Prijavi se i javit ću ti se.</p><button class="btn sm mt-s" data-act="lead">Pošalji upit</button></div>`;
    bind(el, { 'click:lead': () => openLead('') });
  };

  /* ================= PAKETI ================= */
  V.paketi = (el, p, q) => {
    let tab = ['online', 'personalni', 'tinejdzeri'].includes(q.tab) ? q.tab : 'online';
    const draw = () => {
      const P = FS.PERSONALNI;
      el.innerHTML = h`
        <h1>Paketi i cijene</h1>
        <div class="seg"><button data-act="tab" data-t="online" class="${tab === 'online' ? 'on' : ''}">Online</button><button data-act="tab" data-t="personalni" class="${tab === 'personalni' ? 'on' : ''}">Personalni</button><button data-act="tab" data-t="tinejdzeri" class="${tab === 'tinejdzeri' ? 'on' : ''}">Tinejdžeri</button></div>
        ${tab === 'online' ? h`
          <p class="muted">Individualni program, praćenje i podrška. Mjesečne cijene.</p>
          ${FS.paketi().map((x) => h`<div class="card cream"><div class="row"><div class="grow"><div class="nm" style="font-family:var(--serif);font-size:26px;font-weight:700;letter-spacing:1px">${x.id}</div><div class="muted">${x.sedmicno} treninga sedmično</div></div><div class="price-tag">${x.cijena} ${config.valuta}</div></div><button class="btn dark block mt-s" data-act="lead" data-p="${x.id}">Prijavi se – ${x.id}</button></div>`)}
          <div class="card"><h3>Svi paketi uključuju</h3><ul class="clean">${FS.PAKET_UKLJUCUJE.map((t) => h`<li><span class="tick">✓</span><span>${t}</span></li>`)}</ul></div>
          <div class="card note"><b>Mjesečne cijene.</b><br><span class="muted">Treninzi se izvode samostalno, bez videopoziva i bez uključene članarine teretane.</span></div>` : ''}
        ${tab === 'personalni' ? h`
          <div class="card cream"><h3>Individualni treninzi</h3>
            ${P.individualni.map((x) => h`<div class="row between" style="padding:10px 0;border-bottom:1px solid rgba(10,22,48,.12)"><div><b>${x.n}</b><div class="muted small">${x.s}</div></div><div class="price-tag" style="font-size:18px;padding:9px 12px">${x.c} ${config.valuta}</div></div>`)}
          </div>
          <div class="card cream"><h3>Poluindividualni treninzi</h3><p class="muted small">Cijene su po osobi.</p>
            <table class="tbl"><tr><th>Broj osoba</th><th>8 treninga</th><th>12 treninga</th></tr><tr><td>${P.poluindividualni.tip}</td><td>${P.poluindividualni.c8} ${config.valuta}</td><td>${P.poluindividualni.c12} ${config.valuta}</td></tr></table></div>
          <div class="card"><h3>U cijenu je uključeno</h3><ul class="clean">${P.ukljuceno.map((t) => h`<li><span class="tick">✓</span><span>${t}</span></li>`)}</ul></div>
          <button class="btn primary block" data-act="lead" data-p="PERSONALNI">Prijavi se za personalni trening</button>` : ''}
        ${tab === 'tinejdzeri' ? h`
          <div class="card cream"><h2>Tinejdžeri od 16 godina</h2><p>Da, treninzi su namijenjeni i djevojčicama i dječacima od 16 godina. U ovom uzrastu trening je odlična prilika za pravilan razvoj, jačanje samopouzdanja i usvajanje zdravih navika koje traju cijeli život.</p></div>
          <div class="card"><h3>Šta treniranje donosi tinejdžerima?</h3><ul class="clean">
            <li><span class="tick">✓</span><span><b>Pravilan fizički razvoj</b><br><span class="muted small">Jačanje mišića, kostiju i pravilno držanje tijela.</span></span></li>
            <li><span class="tick">✓</span><span><b>Manji rizik od povreda</b><br><span class="muted small">Učenje pravilne tehnike i sigurnog izvođenja vježbi.</span></span></li>
            <li><span class="tick">✓</span><span><b>Bolje zdravlje i kondicija</b><br><span class="muted small">Jači imunitet, više energije i bolja izdržljivost.</span></span></li>
            <li><span class="tick">✓</span><span><b>Veće samopouzdanje</b><br><span class="muted small">Pozitivnija slika o sebi i veća motivacija.</span></span></li>
            <li><span class="tick">✓</span><span><b>Zdrave navike</b><br><span class="muted small">Osnova za aktivan, ispunjen i zdrav odrastao život.</span></span></li></ul></div>
          <div class="card"><h3>Kako izgleda trening za tinejdžere?</h3><ul class="clean">${['Prilagođen uzrastu, iskustvu i ciljevima.', 'Fokus na pravilnoj tehnici i sigurnosti.', 'Razvoj snage, kondicije, pokretljivosti i koordinacije.', 'Postepeno povećanje opterećenja.', 'Individualan pristup – prema potrebama svakog tinejdžera.', 'Podrška, edukacija i praćenje napretka.'].map((t) => h`<li><span class="tick">✓</span><span>${t}</span></li>`)}</ul></div>
          <div class="card note"><h3>Važna informacija</h3>
            <p><b>Saglasnost roditelja ili staratelja.</b> Za trening djevojčica i dječaka od 16 godina potrebna je pismena saglasnost roditelja ili staratelja.</p>
            <p><b>Sigurno i kontrolisano okruženje.</b> Treninzi se provode u sigurnom i profesionalnom okruženju.</p>
            <p style="margin:0"><b>Stručan pristup.</b> Program je kreiran od strane stručnjaka, uz praćenje napretka i prilagodbe prema individualnim potrebama.</p></div>
          <button class="btn primary block" data-act="lead" data-p="TINEJDZERI">Želiš saznati više? Pošalji upit</button>
          <p class="center muted mt" style="font-family:var(--serif);font-style:italic">Zdrave navike danas, jači ljudi sutra.</p>` : ''}`;
    };
    draw();
    bind(el, { 'click:tab': (t) => { tab = t.dataset.t; draw(); window.scrollTo(0, 0); }, 'click:lead': (t) => openLead(t.dataset.p || '') });
  };

  /* ================= ALATI: BMI + KALORIJE ================= */
  const bmiCat = (b) => (b < 18.5 ? ['Niska tjelesna masa', 'warn'] : b < 25 ? ['Normalna tjelesna masa', 'ok'] : b < 30 ? ['Povišena tjelesna masa', 'warn'] : b < 35 ? ['Gojaznost I stepena', 'bad'] : b < 40 ? ['Gojaznost II stepena', 'bad'] : ['Gojaznost III stepena', 'bad']);
  const AKT = [[1.2, 'Sjedilački (malo ili nimalo vježbanja)'], [1.375, 'Lagano aktivna (1–3 treninga sedmično)'], [1.55, 'Umjereno aktivna (3–5 treninga sedmično)'], [1.725, 'Vrlo aktivna (6–7 treninga sedmično)'], [1.9, 'Izuzetno aktivna (naporan fizički posao ili 2 treninga dnevno)']];
  const CILJ = [['gubitak', 'Smanjenje tjelesne mase (umjereno, oko −15 %)'], ['odrzavanje', 'Održavanje tjelesne mase'], ['masa', 'Povećanje tjelesne mase (oko +10 %)']];

  V.alati = (el, p, q) => {
    let tab = q.tab === 'kalorije' ? 'kalorije' : 'bmi';
    const draw = () => {
      el.innerHTML = h`<h1>Kalkulatori</h1>
        <div class="seg"><button data-act="tab" data-t="bmi" class="${tab === 'bmi' ? 'on' : ''}">BMI</button><button data-act="tab" data-t="kalorije" class="${tab === 'kalorije' ? 'on' : ''}">Dnevne kalorije</button></div>
        ${tab === 'bmi' ? h`
          <form class="card" data-act="bmi" novalidate>
            <p class="muted small">Namijenjeno odraslim osobama (18+). Nije prikladno za trudnice i dojilje.</p>
            <div class="grid2"><label class="field"><span>Visina (cm)</span><input name="v" inputmode="decimal" placeholder="npr. 168" required></label>
            <label class="field"><span>Težina (kg)</span><input name="t" inputmode="decimal" placeholder="npr. 65" required></label></div>
            <label class="field"><span>Godine</span><input name="g" inputmode="numeric" placeholder="npr. 30" required></label>
            <p class="err" id="err" hidden></p><button class="btn primary block" type="submit">Izračunaj BMI</button></form>
          <div id="out"></div>` : h`
          <form class="card" data-act="kal" novalidate>
            <p class="muted small">Namijenjeno zdravim odraslim osobama (18+). Procjena po Mifflin–St Jeor formuli.</p>
            <label class="field"><span>Spol</span><select name="s">${opts([['z', 'Žensko'], ['m', 'Muško']], 'z')}</select></label>
            <div class="grid3"><label class="field"><span>Godine</span><input name="g" inputmode="numeric" required></label><label class="field"><span>Visina (cm)</span><input name="v" inputmode="decimal" required></label><label class="field"><span>Težina (kg)</span><input name="t" inputmode="decimal" required></label></div>
            <label class="field"><span>Nivo aktivnosti</span><select name="a">${opts(AKT, 1.55)}</select></label>
            <label class="field"><span>Cilj</span><select name="c">${opts(CILJ, 'odrzavanje')}</select></label>
            <p class="err" id="err" hidden></p><button class="btn primary block" type="submit">Izračunaj kalorije</button></form>
          <div id="out"></div>`}
        <a class="btn block mb" href="#/ishrana">Vodič za ishranu i recepti →</a>
        <p class="small center">Rezultati su okvirni i ne zamjenjuju savjet ljekara ili nutricioniste.</p>`;
    };
    const fail = (m) => { const e = $('#err', el); e.textContent = m; e.hidden = false; $('#out', el).innerHTML = ''; };
    draw();
    bind(el, {
      'click:tab': (t) => { tab = t.dataset.t; draw(); },
      'submit:bmi': (f) => {
        const d = formData(f), v = num(d.v), t = num(d.t), g = num(d.g);
        if (!(g >= 18)) return fail('BMI kalkulator je namijenjen osobama od 18 godina. Za mlađe se javi trenerici.');
        if (!(v >= 120 && v <= 230)) return fail('Unesi visinu između 120 i 230 cm.');
        if (!(t >= 30 && t <= 300)) return fail('Unesi težinu između 30 i 300 kg.');
        $('#err', el).hidden = true;
        const m = v / 100, b = t / (m * m), [cat, tone] = bmiCat(b), pos = Math.min(100, Math.max(0, ((b - 15) / 25) * 100));
        const u = Auth.user();
        $('#out', el).innerHTML = h`<div class="card"><div class="eyebrow">Tvoj BMI</div><div class="row between"><div class="big">${r1(b)}</div><span class="badge ${tone}">${cat}</span></div>
          <div class="meter"><i style="left:calc(${pos}% - 2px)"></i></div><div class="row between small"><span>15</span><span>18,5</span><span>25</span><span>30</span><span>40</span></div>
          <div class="divider"></div><div class="kv"><span>Zdrav raspon težine za tvoju visinu</span><b>${r1(18.5 * m * m)}–${r1(24.9 * m * m)} kg</b></div>
          <p class="small mt-s">BMI ne razlikuje mišićnu od masne mase – kod osoba koje treniraju snagu može dati previsoku procjenu.</p>
          ${u && u.role === 'klijentica' ? h`<button class="btn block mt-s" data-act="save" data-t="${t}">Sačuvaj težinu u moj napredak</button>` : ''}</div>`.s;
      },
      'click:save': (b) => {
        const u = Auth.user(); Store.db.mjere.push({ id: uid(), userId: u.id, datum: today(), tezina: num(b.dataset.t), struk: null, kukovi: null, biljeska: 'Iz BMI kalkulatora' });
        Store.save(); toast('Težina sačuvana u napredak.');
      },
      'submit:kal': (f) => {
        const d = formData(f), g = num(d.g), v = num(d.v), t = num(d.t), a = num(d.a);
        if (!(g >= 18 && g <= 100)) return fail('Kalkulator je namijenjen odraslim osobama (18–100 godina).');
        if (!(v >= 120 && v <= 230)) return fail('Unesi visinu između 120 i 230 cm.');
        if (!(t >= 30 && t <= 300)) return fail('Unesi težinu između 30 i 300 kg.');
        $('#err', el).hidden = true;
        const bmr = 10 * t + 6.25 * v - 5 * g + (d.s === 'm' ? 5 : -161), tdee = bmr * a;
        const f2 = { gubitak: 0.85, odrzavanje: 1, masa: 1.1 }[d.c] || 1;
        let kcal = tdee * f2, floorMsg = '';
        const floor = d.s === 'm' ? 1500 : 1200;
        if (kcal < floor) { kcal = floor; floorMsg = `Izračunata vrijednost je bila ispod sigurnog minimuma, pa je podignuta na ${floor} kcal. Ne preporučuje se dugotrajno jesti manje bez nadzora stručnjaka.`; }
        const prot = t * 1.6, fat = (kcal * 0.25) / 9, carb = Math.max(0, (kcal - prot * 4 - fat * 9) / 4);
        $('#out', el).innerHTML = h`<div class="card"><div class="eyebrow">Preporučeni dnevni unos</div><div class="big">${Math.round(kcal)} <span style="font-size:20px">kcal</span></div>
          ${floorMsg ? h`<p class="small mt-s" style="color:var(--warn)">${floorMsg}</p>` : ''}
          <div class="divider"></div>
          <div class="kv"><span>Bazalni metabolizam (BMR)</span><b>${Math.round(bmr)} kcal</b></div>
          <div class="kv"><span>Održavanje (TDEE)</span><b>${Math.round(tdee)} kcal</b></div>
          <div class="divider"></div><div class="eyebrow">Orijentacioni makronutrijenti</div>
          <div class="stats" style="margin:0"><div class="stat"><b>${Math.round(prot)}</b><span>g proteina</span></div><div class="stat"><b>${Math.round(carb)}</b><span>g ugljikohidrata</span></div><div class="stat"><b>${Math.round(fat)}</b><span>g masti</span></div></div>
          <p class="small mt-s">Za trudnice, dojilje, osobe s zdravstvenim stanjima ili poremećajima ishrane potreban je individualan plan stručnjaka.</p></div>`.s;
      }
    });
  };

  /* ================= VJEŽBE ================= */
  function videoEmbed(url) {
    if (!url || !/^https:\/\//i.test(url)) return '';
    let m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (m) return h`<iframe src="https://www.youtube-nocookie.com/embed/${m[1]}" title="Video uputa" allow="accelerometer; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    m = url.match(/vimeo\.com\/(\d+)/);
    if (m) return h`<iframe src="https://player.vimeo.com/video/${m[1]}" title="Video uputa" allow="picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) return h`<video src="${url}" controls playsinline preload="metadata"></video>`;
    return h`<a class="btn" href="${url}" target="_blank" rel="noopener">Otvori video</a>`;
  }
  FS.videoEmbed = videoEmbed;
  const DIJ_TONE = { da: 'ok', kasnije: 'warn', ne: 'bad' };
  const exRow = (e) => h`<a class="ex" href="#/vjezba/${e.id}">${FS.hasFigure(e.id) ? h`<div class="ph figph">${FS.raw(FS.figureSVG(e.id, 1, ''))}</div>` : h`<div class="ph">${icon(e.video ? 'play' : 'dumbbell')}</div>`}<div class="grow"><b>${e.naziv}</b><div class="small">${e.grupa} · ${e.nivo} · ${e.oprema}</div></div>${e.dij === 'kasnije' ? '' : h`<span class="badge ${DIJ_TONE[e.dij]}" title="${FS.DIJ_LABEL[e.dij]}">${e.dij === 'da' ? 'dijastaza ✓' : 'izbjegavati'}</span>`}</a>`;

  V.vjezbe = (el) => {
    const S = { q: '', g: 'Sve', n: 'Sve', d: false };
    const list = () => {
      const qq = S.q.trim().toLowerCase();
      const r = Store.exercises().filter((e) => (S.g === 'Sve' || e.grupa === S.g) && (S.n === 'Sve' || e.nivo === S.n) && (!S.d || e.dij === 'da') && (!qq || (e.naziv + ' ' + e.grupa + ' ' + e.oprema).toLowerCase().includes(qq)));
      $('#list', el).innerHTML = r.length ? h`${r.map(exRow)}`.s : '<div class="empty">Nema vježbi za zadane filtere.</div>';
      $('#cnt', el).textContent = r.length + ' vježbi';
    };
    el.innerHTML = h`<h1>Biblioteka vježbi</h1>
      <label class="field"><span class="small">Pretraga</span><input type="search" data-act="q" placeholder="Pretraži vježbe…" enterkeyhint="search"></label>
      <div class="chips">${['Sve', ...FS.GRUPE].map((g) => h`<button class="chip ${g === 'Sve' ? 'on' : ''}" data-act="g" data-v="${g}">${g}</button>`)}</div>
      <div class="row between mb wrap"><select data-act="n" style="width:auto;min-height:40px">${opts([['Sve', 'Svi nivoi'], ...FS.NIVOI])}</select>
        <label class="check" style="margin:0"><input type="checkbox" data-act="d"> <span>Samo za dijastazu</span></label></div>
      <div class="small mb" id="cnt"></div><div id="list"></div>`;
    list();
    bind(el, {
      'input:q': (t) => { S.q = t.value; list(); },
      'click:g': (t) => { S.g = t.dataset.v; el.querySelectorAll('[data-act=g]').forEach((c) => c.classList.toggle('on', c === t)); list(); },
      'change:n': (t) => { S.n = t.value; list(); },
      'change:d': (t) => { S.d = t.checked; list(); }
    });
  };

  V.vjezba = (el, p) => {
    const e = Store.ex(p.id);
    if (!e) { el.innerHTML = h`<div class="empty">Vježba nije pronađena.</div><a class="btn block" href="#/vjezbe">Sve vježbe</a>`; return; }
    el.innerHTML = h`<div class="eyebrow">${e.grupa} · ${e.nivo}</div><h1>${e.naziv}</h1>
      <div class="video">${e.video ? videoEmbed(e.video) : h`<div><div class="play">${icon('play')}</div><div class="small" style="max-width:26ch;margin:auto">Videouputa uskoro. Trenerica je može dodati u trenerskom panelu.</div></div>`}</div>
      ${FS.hasFigure && FS.hasFigure(e.id) ? h`<div class="card figcard"><div class="row" style="gap:8px"><div class="fstill big">${FS.raw(FS.figureSVG(e.id, 0, 'Početni položaj'))}<span class="small">1 · Početak</span></div><div class="fstill big">${FS.raw(FS.figureSVG(e.id, 1, 'Završni položaj'))}<span class="small">2 · Kraj</span></div></div></div>` : ''}
      ${(() => { const m = FS.muskulChips ? FS.muskulChips(e.id) : { p: [], s: [] }; return m.p.length || m.s.length ? h`<div class="card"><h3>Koji mišići rade</h3>
        ${m.p.length ? h`<div class="mb"><b>Primarni (glavni):</b> ${m.p.join(', ')}</div>` : ''}
        ${m.s.length ? h`<div><b>Sekundarni (pomažu):</b> ${m.s.join(', ')}</div>` : ''}
        <p class="small mt-s">Dvije slike prikazuju početni i završni položaj (približan bočni prikaz). Pravo izvođenje pogledaj na videu.</p></div>` : ''; })()}
      <div class="row wrap mb"><span class="badge">${e.oprema}</span><span class="badge ${DIJ_TONE[e.dij]}">${FS.DIJ_LABEL[e.dij]}</span></div>
      ${e.dij !== 'da' ? h`<div class="card ${e.dij === 'ne' ? 'alert' : 'note'}"><b>${e.dij === 'ne' ? 'Pažnja:' : 'Napomena:'}</b> ${e.dij === 'ne' ? 'ova vježba se kod dijastaze izbjegava.' : 'kod dijastaze uvodi se tek u kasnijim fazama i uz odobrenje stručnjaka.'} <a href="#/dijastaza">Više o dijastazi</a></div>` : ''}
      <div class="card"><h3>Kako izvesti</h3><ol class="steps">${e.koraci.map((k) => h`<li><span>${k}</span></li>`)}</ol></div>
      <div class="card"><h3>Savjeti</h3><ul class="dots">${e.savjeti.map((k) => h`<li>${k}</li>`)}</ul><h3>Česte greške</h3><ul class="dots">${(e.greske || []).map((k) => h`<li>${k}</li>`)}</ul></div>
      <p class="small center">Ako osjetiš bol (a ne samo napor), prekini vježbu i javi se trenerici.</p>`;
  };

  /* ================= PROGRAMI (prodaja) ================= */
  const lvl = (p) => p.tip === 'vodic' ? 'e-vodič · 42 recepta · dnevni jelovnik' : `${p.nivo} · ${p.sedmica} sedmica · ${p.dana}× sedmično`;
  const owned = (u, p) => !!u && FS.access(u, p).on;

  FS.buySheet = (prog) => buySheet(prog);
  function buySheet(prog) {
    const u = Auth.user();
    if (!u) { toast('Prijavi se za kupovinu.'); go('#/prijava'); return; }
    if (u.role !== 'klijentica') { toast('Kupovina je dostupna klijenticama.'); return; }
    if (FS.cloud) {
      const pend = (Store.db.zahtjevi || []).find((z) => z.userId === u.id && z.programId === prog.id && z.status === 'novo');
      openSheet(h`<h2>${prog.naziv}</h2>
        <div class="kv"><span>Cijena</span><b>${prog.cijena} ${config.valuta}</b></div>
        ${pend ? h`<div class="card note mt-s">Tvoj zahtjev je poslan. Trenerica će otključati program čim potvrdi uplatu.</div>` : h`<p class="small mt-s">Pošalji zahtjev za kupovinu. Trenerica ti javlja kako da uplatiš, a program se otključava čim potvrdi uplatu.${prog.sedmica ? ' Pristup programu traje ' + prog.sedmica + ' sedmica od otključavanja.' : ''}</p>`}
        <div class="row mt"><button class="btn grow" data-act="no">${pend ? 'Zatvori' : 'Odustani'}</button>${pend ? '' : h`<button class="btn primary grow" data-act="yes">Pošalji zahtjev</button>`}</div>`,
      (s) => bind(s, {
        'click:no': () => closeSheet(),
        'click:yes': () => {
          (Store.db.zahtjevi = Store.db.zahtjevi || []).push({ id: uid(), userId: u.id, programId: prog.id, iznos: prog.cijena, datum: today(), ts: Date.now(), status: 'novo' });
          Store.save(); closeSheet(); toast('Zahtjev poslan trenerici.');
        }
      }));
      return;
    }
    openSheet(h`<h2>${prog.naziv}</h2><div class="demo-bar">DEMO · bez stvarne naplate</div>
      <div class="kv"><span>Cijena</span><b>${prog.cijena} ${config.valuta}</b></div><p class="small mt-s">U probnoj verziji kupovina se samo bilježi i odmah otključava program. Online plaćanje se povezuje u sljedećoj fazi.</p>
      <div class="row mt"><button class="btn grow" data-act="no">Odustani</button><button class="btn primary grow" data-act="yes">Potvrdi (demo)</button></div>`,
    (s) => bind(s, {
      'click:no': () => closeSheet(),
      'click:yes': () => {
        if (!owned(u, prog)) { if (!u.programi.includes(prog.id)) u.programi.push(prog.id); (u.pstart = u.pstart || {})[prog.id] = today(); Store.db.kupovine.push({ id: uid(), userId: u.id, programId: prog.id, datum: today(), iznos: prog.cijena, demo: true }); Store.save(); }
        closeSheet(); toast('Otključano.'); go(prog.id === 'vodic-ishrana' ? '#/ishrana?tab=jelovnik' : '#/program/' + prog.id); setTimeout(() => FS.rerender && FS.rerender(), 50);
      }
    }));
  }

  V.programi = (el) => {
    const u = Auth.user();
    const draw = () => {
      el.innerHTML = h`<h1>Programi</h1>${demoBar()}
        <a class="card cream" href="#/dijastaza" style="display:block;color:var(--navy)"><div class="eyebrow" style="color:var(--beige-2)">Kućni program</div><h2>Dijastaza – siguran početak</h2><p class="muted" style="margin:0">Četiri faze, sigurnosne napomene i individualna prilagodba. Besplatno za klijente.</p></a>
        <a class="card" href="#/kondicija" style="display:block"><div class="eyebrow">Kondicija</div><h3 style="margin:0">EMOM, HIIT, AMRAP i Tabata</h3><p class="muted" style="margin:6px 0 0">Intenzivni treninzi s tajmerom koji te vodi kroz vježbe.</p></a>
        <div class="eyebrow mt">Gotovi programi</div>
        ${Store.shop().map((p) => h`<div class="card"><div class="row between"><h3 style="margin:0">${p.naziv}</h3><span class="price-tag" style="font-size:16px;padding:7px 11px">${p.cijena} ${config.valuta}</span></div>
          <div class="small mt-s">${lvl(p)}</div><p class="muted mt-s">${p.opis}</p>
          <div class="row"><a class="btn sm grow" href="${p.tip === 'vodic' ? '#/ishrana?tab=recepti' : '#/program/' + p.id}">${owned(u, p) ? 'Otvori' : 'Pregled'}</a>${owned(u, p) ? '<span class="badge ok">Tvoj program</span>' : h`<button class="btn primary sm grow" data-act="buy" data-id="${p.id}">Kupi</button>`}</div></div>`)}
        <div class="card flat center"><p class="muted" style="margin:0 0 8px">Želiš program samo za sebe?</p><a class="btn sm" href="#/paketi">Online coaching paketi</a></div>`;
    };
    draw();
    bind(el, { 'click:buy': (b) => buySheet(Store.program(b.dataset.id)) });
  };

  V.program = (el, p, q) => {
    const u = Auth.user(), prog = Store.program(p.id);
    if (!prog) { el.innerHTML = h`<div class="empty">Program nije pronađen.</div><a class="btn block" href="#/programi">Programi</a>`; return; }
    const full = prog.tip === 'individualni' ? (u && (u.role === 'trener' || (u.programi || []).includes(prog.id))) : (owned(u, prog) || (u && u.role === 'trener'));
    if (prog.tip === 'vodic') { location.replace('#/ishrana?tab=recepti'); return; }
    if (prog.tip === 'individualni' && !full) { el.innerHTML = h`<div class="empty">Ovaj program nije dostupan s tvog računa.</div><a class="btn block" href="#/programi">Programi</a>`; return; }
    const per = FS.perOf(prog), hasPlan = per.tip !== 'nema' || per.deload > 0;
    const isK = u && u.role === 'klijentica' && full;
    let week = q && q.w ? Math.min(prog.sedmica, Math.max(1, parseInt(q.w, 10) || 1)) : (isK ? FS.currentWeek(u, prog) : 1);
    const draw = () => {
      const wi = FS.weekInfo(prog, week), days = FS.weekDays(prog, week), vol = FS.weekVolume(prog, week);
      const tipLabel = (FS.PER_TIPOVI.find((x) => x[0] === per.tip) || [])[1] || '';
      el.innerHTML = h`<div class="eyebrow">${lvl(prog)}</div><h1>${prog.naziv}</h1><p class="muted">${prog.opis}</p>
      ${full ? '' : h`<div class="card note"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow">${FS.access(u, prog).expired ? 'Pristup ovom programu je istekao ' + FS.fmtDate(FS.access(u, prog).end) + '. Možeš ga ponovo kupiti.' : 'Otključaj sve vježbe, serije i ponavljanja. Pristup traje ' + prog.sedmica + ' sedmica od otključavanja.'}</div></div><button class="btn primary block mt-s" data-act="buy">Kupi za ${prog.cijena} ${config.valuta}${FS.cloud ? '' : ' (demo)'}</button></div>`}
      ${full && hasPlan ? h`<div class="card"><div class="eyebrow">Periodizacija</div><b>${tipLabel}${per.deload ? ' · deload svake ' + per.deload + '. sedmice' : ''}</b>
        <div class="row wrap mt-s">${Array.from({ length: prog.sedmica }, (_, i) => i + 1).map((n) => { const x = FS.weekInfo(prog, n); return h`<button class="btn sm ${n === week ? 'primary' : ''}" data-act="wk" data-w="${n}" aria-pressed="${n === week}">${n}${x.deload ? ' · D' : ''}</button>`; })}</div>
        <div class="card flat mt-s" style="margin-bottom:0"><b>Sedmica ${wi.w} – ${wi.deload ? 'Deload' : wi.faza}</b>
          <div class="small">${wi.deload ? 'Serije su prepolovljene, težina oko 90 %, ostavi najmanje 4 ponavljanja u rezervi.' : (wi.tip === 'valovita' ? 'Teški, srednji i lagani dan. Težina oko ' + wi.loadPct + ' % radne težine, sa dnevnim razlikama.' : (wi.loadPct !== 100 ? 'Težina oko ' + wi.loadPct + ' % težine iz 1. sedmice.' : 'Ista težina kao u 1. sedmici, progresija kad ti postane lako.'))} Rezerva: ${wi.rir} ponavljanja.</div></div>
        <div class="small mt-s">${FS.PER_OPIS[per.tip] || ''} ${per.deload ? FS.DELOAD_OPIS : ''}</div></div>` : ''}
      ${full && prog.bilj ? h`<details class="card"><summary><b>Napomene za program</b></summary><ul class="dots mt-s">${prog.bilj.map((t) => h`<li>${t}</li>`)}</ul></details>` : ''}
      ${full ? h`<div class="card"><div class="eyebrow">Direktnih serija sedmično${hasPlan ? ' (sedmica ' + week + ')' : ''}</div><div class="row wrap mt-s">${FS.MISICI.filter((m) => vol[m] > 0).map((m) => h`<span class="pill">${m} <b>${vol[m]}</b></span>`)}</div></div>` : ''}
      ${full && FS.balans ? (() => { const b = FS.balans(prog), tot = Object.values(b).reduce((a, c) => a + c, 0); return tot ? h`<details class="card"><summary><b>Balans pokreta u programu</b></summary><div class="row wrap mt-s">${FS.BALANS_KLJUCEVI.filter((k2) => b[k2] > 0).map((k2) => h`<span class="pill">${k2} <b>${b[k2]}</b></span>`)}</div><p class="small mt-s">Serije po ciklusu dana. Program drži ravnotežu između guranja i povlačenja (horizontalno i vertikalno), pregiba kuka i koljena.</p></details>` : ''; })() : ''}
      ${days.map((d, i) => h`<div class="card"><div class="row between"><h3 style="margin:0">${d.naziv}${d.vj[0] && d.vj[0].tag ? h` <span class="small">· ${d.vj[0].tag} dan</span>` : ''}</h3>${isK ? h`<a class="btn sm primary" href="#/trening/novi?p=${prog.id}&d=${i}&w=${week}">Započni</a>` : ''}</div>
        <ul class="clean mt-s">${d.vj.map((x) => { const e = Store.ex(x.id); return e ? (full ? h`<li>${FS.hasFigure(e.id) ? h`<a href="#/vjezba/${e.id}" class="ph figph" aria-hidden="true" tabindex="-1">${FS.raw(FS.figureSVG(e.id, 1, ''))}</a>` : ''}<div class="grow"><a href="#/vjezba/${e.id}"><b style="color:var(--cream)">${e.naziv}</b></a>${x.n ? h`<div class="small">${x.n}</div>` : ''}${FS.raw(FS.pauzaTag ? FS.pauzaTag(x) : '')}${x.pct ? h`<div class="small">≈ ${x.pct} % težine iz 1. sedmice</div>` : ''}</div><b>${x.s} × ${x.r}</b></li>` : '') : ''; })}</ul>${full ? '' : h`<div class="row between"><span class="muted">${d.vj.length} vježbi</span><span class="muted small">${icon('lock')} Otključava se nakon kupovine</span></div>`}</div>`)}`;
    };
    draw();
    bind(el, { 'click:buy': () => buySheet(prog), 'click:wk': (b) => { week = +b.dataset.w; draw(); } });
  };

  /* ================= DIJASTAZA ================= */
  V.dijastaza = (el) => {
    const D = FS.DIJASTAZA, u = Auth.user(), key = u ? u.id : 'anon';
    Store.db.dijAck = Store.db.dijAck || {};
    const draw = () => {
      const ack = !!Store.db.dijAck[key];
      const odgovori = u ? Store.db.poruke.filter((m) => m.userId === u.id && m.tip === 'dijastaza') : [];
      el.innerHTML = h`<div class="eyebrow">Kućni program</div><h1>Dijastaza recti</h1>
        <p class="muted">Razdvojenost ravnih trbušnih mišića (najčešće nakon trudnoće). Ovaj program je blag, postepen i usmjeren na disanje, dubinsku stabilnost i kontrolu.</p>
        <div class="card alert"><h3>Prije nego počneš</h3><ul class="dots">${D.prijeStarta.map((t) => h`<li>${t}</li>`)}</ul></div>
        <div class="card"><h3>Prekini vježbanje i javi se ljekaru ili fizioterapeutu ako:</h3><ul class="clean">${D.stop.map((t) => h`<li><span class="tick no">!</span><span>${t}</span></li>`)}</ul></div>
        <div class="card"><h3>Izbjegavaj u početku</h3><ul class="clean">${D.izbjegavaj.map((t) => h`<li><span class="tick no">✕</span><span>${t}</span></li>`)}</ul></div>
        <details class="card"><summary style="cursor:pointer;font-weight:600">Orijentaciona samoprovjera razmaka</summary><ol class="steps mt-s">${D.samotest.map((t) => h`<li><span>${t}</span></li>`)}</ol></details>
        ${ack ? '' : h`<div class="card cream"><h3>Potvrda</h3><label class="check" style="color:var(--navy)"><input type="checkbox" data-act="ackbox"><span>Razumijem da ovo nije medicinski savjet te da sam se konsultovala (ili ću se konsultovati) s ljekarom ili fizioterapeutom prije vježbanja.</span></label><button class="btn dark block" data-act="ack" disabled>Prikaži program</button></div>`}
        ${ack ? h`<h2 class="mt">Program po fazama</h2>
          ${D.faze.map((f, i) => h`<details class="card" ${i === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:18px">${f.naziv}</b><div class="small">${f.sedmice} · ${f.dana}</div></summary>
            <p class="muted mt-s">${f.cilj}</p>
            <ul class="clean">${f.dani[0].vj.map((x) => { const e = Store.ex(x.id); return h`<li><div class="grow"><a href="#/vjezba/${e.id}"><b style="color:var(--cream)">${e.naziv}</b></a>${x.n ? h`<div class="small">${x.n}</div>` : ''}${FS.raw(FS.pauzaTag ? FS.pauzaTag(x) : '')}</div><b>${x.s} × ${x.r}</b></li>`; })}</ul>
            ${u && u.role === 'klijentica' ? h`<a class="btn primary block mt-s" href="#/trening/novi?p=dijastaza&f=${i}">Započni trening</a>` : h`<p class="small mt-s">Prijavi se kao klijentica da bi bilježila treninge.</p>`}</details>`)}
          <div class="card note"><b>Kada preći na sljedeću fazu?</b><p class="muted mt-s" style="margin:0">${D.napredovanje}</p></div>` : ''}
        <div class="card"><h2>Individualna prilagodba</h2>
          <p class="muted">Opiši svoju situaciju (koliko je prošlo od porođaja, šta je rekao ljekar ili fizioterapeut, bolovi, ograničenja). Trenerica ti prilagođava program.</p>
          ${odgovori.map((m) => h`<div class="card flat"><div class="small">${fmtDate(m.datum)} · ${m.status === 'obradjeno' ? 'odgovoreno' : 'čeka odgovor'}</div><p style="margin:6px 0">${m.tekst}</p>${m.odgovor ? h`<div class="card cream" style="margin:0"><b>Odgovor trenerice:</b><br>${m.odgovor}</div>` : ''}</div>`)}
          ${u && u.role === 'klijentica' ? h`<form data-act="adapt" novalidate><label class="field"><span>Tvoja poruka</span><textarea name="t" maxlength="1200" placeholder="Opiši situaciju…"></textarea></label><p class="err" id="aerr" hidden></p><button class="btn primary block" type="submit">Pošalji trenerici</button></form><p class="small mt-s">Podaci o zdravlju su osjetljivi – piši samo ono što želiš podijeliti.</p>` : h`<a class="btn primary block" href="#/prijava">Prijavi se da pošalješ upit</a>`}
        </div>`;
    };
    draw();
    bind(el, {
      'change:ackbox': (c) => { $('[data-act=ack]', el).disabled = !c.checked; },
      'click:ack': () => { Store.db.dijAck[key] = today(); Store.save(); draw(); window.scrollTo(0, 0); },
      'submit:adapt': (f) => {
        const t = String(formData(f).t || '').trim(), e = $('#aerr', el);
        if (t.length < 10) { e.textContent = 'Napiši malo više detalja (najmanje 10 znakova).'; e.hidden = false; return; }
        Store.db.poruke.push({ id: uid(), userId: u.id, tip: 'dijastaza', tekst: t.slice(0, 1200), datum: today(), status: 'novo', odgovor: '' });
        Store.save(); toast('Poruka poslana trenerici.'); draw();
      }
    });
  };

  /* ================= PRIJAVA / REGISTRACIJA ================= */
  V.prijava = (el, p, q) => {
    const u = Auth.user();
    if (u) {
      el.innerHTML = h`<h1>Račun</h1><div class="card"><div class="user-chip"><div class="avatar">${FS.initials(u.ime)}</div><div class="grow"><b>${u.ime}</b><div class="small">${u.email} · ${u.role === 'trener' ? 'trenerica' : 'klijentica'}</div></div></div></div>
        <a class="btn primary block mb" href="${homeFor(u)}">${u.role === 'trener' ? 'Otvori trenerski panel' : 'Otvori moj prostor'}</a>
        <button class="btn block" data-act="out">Odjava</button>`;
      bind(el, { 'click:out': () => { Auth.logout(); toast('Odjava uspješna.'); FS.refreshNav(); go('#/'); } });
      return;
    }
    let tab = q.tab === 'registracija' ? 'registracija' : 'prijava';
    const draw = () => {
      el.innerHTML = h`<h1>${tab === 'prijava' ? 'Prijava' : (FS.cloud ? 'Aktiviraj račun' : 'Novi račun')}</h1>
        <div class="seg"><button data-act="tab" data-t="prijava" class="${tab === 'prijava' ? 'on' : ''}">Prijava</button><button data-act="tab" data-t="registracija" class="${tab === 'registracija' ? 'on' : ''}">${FS.cloud ? 'Pozivnica' : 'Registracija'}</button></div>
        ${tab === 'prijava' ? h`<form class="card" data-act="login" novalidate>
            <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="username" inputmode="email" autocapitalize="off" required></label>
            <label class="field"><span>Lozinka</span><input name="pass" type="password" autocomplete="current-password" required></label>
            <p class="err" id="err" hidden></p><button class="btn primary block" type="submit">Prijavi se</button>${FS.cloud ? h`<button class="btn sm block mt-s" type="button" data-act="forgot">Zaboravila sam lozinku</button>` : ''}</form>
          ${config.demo ? h`<div class="card flat"><div class="eyebrow">Demo računi</div><p class="small">Samo u probnoj verziji. Dodirni za popunjavanje.</p>
            <button class="btn sm block mb" data-act="fill" data-e="trenerica@demo.ba" data-p="Trener#2026">Trenerica · trenerica@demo.ba</button>
            <button class="btn sm block mb" data-act="fill" data-e="ana@demo.ba" data-p="Klijent#2026">Klijentica · ana@demo.ba</button>
            <button class="btn sm block" data-act="fill" data-e="maja@demo.ba" data-p="Klijent#2026">Klijentica · maja@demo.ba</button></div>` : ''}` : h`
          ${FS.cloud ? h`<div class="card note small">Račun možeš napraviti samo uz pozivnicu trenera. Upiši e-mail na koji je stigla pozivnica.</div>` : ''}
          <form class="card" data-act="reg" novalidate>
            <label class="field"><span>Ime i prezime</span><input name="ime" autocomplete="name" required></label>
            <label class="field"><span>E-mail</span><input name="email" type="email" autocomplete="username" inputmode="email" autocapitalize="off" value="${q.e || ''}" required></label>
            <label class="field"><span>Lozinka (min. 8 znakova, slovo i broj)</span><input name="pass" type="password" autocomplete="new-password" required></label>
            <label class="field"><span>Moj uzrast</span><select name="dob" data-act="dob">${opts([['18+', '18 godina ili više'], ['16-17', '16–17 godina'], ['ispod16', 'Ispod 16 godina']])}</select></label>
            <label class="check" id="cons" hidden><input type="checkbox" name="saglasnost"><span>Imam pismenu saglasnost roditelja ili staratelja za treniranje.</span></label>
            <label class="check"><input type="checkbox" name="odgovornost"><span>Razumijem da treniram na vlastitu odgovornost i da trener ne zamjenjuje ljekara. Za zdravstvene tegobe prvo se javljam ljekaru.</span></label>
            <p class="err" id="err" hidden></p><button class="btn primary block" type="submit">Napravi račun</button></form>`}`;
    };
    const after = (usr) => { FS.refreshNav(); toast('Dobro došli, ' + usr.ime.split(' ')[0] + '!'); go(homeFor(usr)); };
    const showErr = (m) => { const e = $('#err', el); e.textContent = m; e.hidden = false; };
    draw();
    bind(el, {
      'click:tab': (t) => { tab = t.dataset.t; draw(); },
      'click:fill': (b) => { $('[name=email]', el).value = b.dataset.e; $('[name=pass]', el).value = b.dataset.p; },
      'change:dob': (s) => { $('#cons', el).hidden = s.value !== '16-17'; },
      'click:forgot': async () => {
        const em = $('[name=email]', el).value;
        try { toast(await Auth.requestReset(em)); } catch (e) { showErr(e.message); }
      },
      'submit:login': async (f) => {
        const d = formData(f), btn = $('button[type=submit]', f); btn.disabled = true;
        try { after(await Auth.login(d.email, d.pass)); } catch (e) { showErr(e.message); btn.disabled = false; }
      },
      'submit:reg': async (f) => {
        const d = formData(f), btn = $('button[type=submit]', f); btn.disabled = true;
        if (!d.odgovornost) { showErr('Za nastavak potvrdi da treniraš na vlastitu odgovornost.'); btn.disabled = false; return; }
        try { after(await Auth.register({ ...d, saglasnost: !!d.saglasnost })); } catch (e) { showErr(e.message); btn.disabled = false; }
      }
    });
  };
})();
