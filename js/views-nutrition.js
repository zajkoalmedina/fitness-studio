/* Vodič za ishranu: principi, recepti, primjer dana, pitanja */
(function () {
  const FS = (window.FS = window.FS || {});
  FS.views = FS.views || {};
  const { h, icon, bind, formData, num, $, today, addDays, fmtDate, Store, Auth } = FS;
  const VID = 'vodic-ishrana';
  const SLOTS = [['dorucak', 'Doručak', 'Doručak'], ['rucak', 'Ručak', 'Ručak'], ['uzina', 'Užina', 'Užina'], ['vecera', 'Večera', 'Večera'], ['d1', 'Dodatni obrok', ''], ['d2', 'Dodatni obrok', '']];
  const POR = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const fx = (n) => String(Math.round(n * 10) / 10).replace('.', ',');

  const FAQ = [
    ['Moram li brojati kalorije?', 'Ne nužno. Kalkulator ti daje okvir, a mnogim ljudima je dovoljno držati se tanjira iz vodiča, jesti dovoljno proteina i redovno pratiti napredak. Brojanje je alat, ne obaveza.'],
    ['Smijem li jesti ugljikohidrate uveče?', 'Da. Za tjelesnu masu je presudan ukupan dnevni unos i kvalitet hrane, a ne sat u kojem jedeš.'],
    ['Šta jesti prije i poslije treninga?', 'Prije treninga lagan obrok s ugljikohidratima i malo proteina (npr. kaša s jogurtom ili hljeb s jajima), 1–3 sata ranije. Poslije treninga obrok s proteinima i ugljikohidratima kad ti odgovara.'],
    ['Trebaju li mi suplementi?', 'Uz uravnoteženu ishranu najčešće nisu potrebni. Ako razmišljaš o suplementima, posavjetuj se s ljekarom ili nutricionistom, naročito u trudnoći, dojenju ili uz zdravstvene tegobe.'],
    ['Trening nakon porođaja i dijastaza?', 'U tom periodu se ne ide u strogo smanjenje unosa. Hrana treba podržati oporavak i dojenje, ako dojiš. Individualni plan dogovori s ljekarom i trenericom.'],
    ['Ishrana za tinejdžere?', 'U razvoju je važno jesti redovno i raznovrsno, bez restriktivnih dijeta i brojanja kalorija. Cilj je energija za trening i rast. Plan ishrane za mlađe od 18 godina dogovara se uz roditelje ili staratelje.']
  ];

  FS.views.ishrana = (el, p, q) => {
    const u = Auth.user();
    const has = () => !!u && (u.role === 'trener' || (u.programi || []).includes(VID));
    const prod = () => Store.program(VID) || { id: VID, naziv: 'Vodič za ishranu', cijena: 25 };
    let tab = ['vodic', 'principi', 'recepti', 'jelovnik', 'pitanja', 'savjeti'].includes(q.tab) ? q.tab : (has() && FS.pdfReady && FS.pdfReady() ? 'vodic' : 'principi');
    let datum = today();
    const draw = () => {
      el.innerHTML = h`<div class="eyebrow">Vodič</div><h1>Ishrana</h1>
         <div class="seg"><button data-act="tab" data-t="vodic" class="${tab === 'vodic' ? 'on' : ''}">Vodič</button><button data-act="tab" data-t="principi" class="${tab === 'principi' ? 'on' : ''}">Principi</button><button data-act="tab" data-t="recepti" class="${tab === 'recepti' ? 'on' : ''}">Recepti</button><button data-act="tab" data-t="jelovnik" class="${tab === 'jelovnik' ? 'on' : ''}">Plan ishrane</button><button data-act="tab" data-t="pitanja" class="${tab === 'pitanja' ? 'on' : ''}">Pitanja</button><button data-act="tab" data-t="savjeti" class="${tab === 'savjeti' ? 'on' : ''}">Savjeti</button></div>
        ${tab === 'vodic' ? (has() ? FS.pdfTab() : lockBox()) : ''}${tab === 'principi' ? principi() : ''}${tab === 'recepti' ? recepti() : ''}${tab === 'jelovnik' ? jelovnik() : ''}${tab === 'pitanja' ? pitanja() : ''}${tab === 'savjeti' ? (u ? FS.savjetiTab() : savjetiLock()) : ''}
        <div class="card alert mt"><b>Važno:</b> ovaj vodič je opšta edukacija i ne zamjenjuje savjet ljekara ili nutricioniste. Ako imaš zdravstvene tegobe, poremećaj ishrane, trudnoća ili dojenje, ili ti je ishrana izvor straha ili brige, javi se stručnoj osobi.</div>`;
      if (tab === 'vodic' && has() && FS.pdfMount) FS.pdfMount(el);
      if (FS.recFotoLoad) FS.recFotoLoad(el);
    };

    const principi = () => h`
      <div class="card cream"><h2>Tanjir za većinu obroka</h2>
        <div class="grid3" style="text-align:center;margin:12px 0">
          <div><div class="big" style="color:var(--navy);font-size:40px">½</div><b>Povrće</b><div class="small">sirovo ili kuhano</div></div>
          <div><div class="big" style="color:var(--navy);font-size:40px">¼</div><b>Proteini</b><div class="small">meso, riba, jaja, mliječni proizvodi, mahunarke</div></div>
          <div><div class="big" style="color:var(--navy);font-size:40px">¼</div><b>Ugljikohidrati</b><div class="small">riža, krompir, hljeb, kaša</div></div></div>
        <p class="muted" style="margin:0">Dodaj malo zdravih masti (maslinovo ulje, orasi, avokado).</p></div>
      <div class="card"><h3>Osnovna pravila</h3><ul class="clean">
        ${['Protein uz svaki obrok: jaja, riba, piletina, mliječni proizvodi, mahunarke.', 'Povrće i voće svaki dan, različitih boja.', 'Cjelovite namirnice češće od visoko prerađenih (ne u svakom obroku).', 'Redovni obroci, tri glavna i po potrebi jedna do dvije užine.', 'Voda kroz cijeli dan, uz kafu i čaj bez viška šećera.', 'Spavanje i oporavak utiču na apetit i napredak jednako kao hrana.', 'Pravilo 80/20: većina obroka uravnotežena, a ostatak prostor za uživanje bez grižnje savjesti.'].map((t) => h`<li><span class="tick">✓</span><span>${t}</span></li>`)}</ul></div>
      <form class="card" data-act="quick" novalidate><h3>Okvirna potreba za proteinima i vodom</h3>
        <p class="muted small">Za zdrave odrasle osobe (18+) koje treniraju. Okvirne vrijednosti.</p>
        <label class="field"><span>Tvoja težina (kg)</span><input name="t" inputmode="decimal" placeholder="npr. 65"></label>
        <p class="err" id="qerr" hidden></p><button class="btn primary block" type="submit">Izračunaj</button><div id="qout" class="mt"></div>
        <a class="btn sm block mt-s" href="#/alati?tab=kalorije">Izračunaj i dnevne kalorije</a></form>
      <a class="card" href="#/suplementi" style="display:block"><b>Suplementi</b><div class="small muted">Šta ima smisla, a šta ne</div></a>`;

    const ALL = () => FS.RECEPTI_V || [];
    const klijentica = () => !!u && u.role !== 'trener';
    const JJ = () => (u && u.jelovnik) || {};
    const R = () => (klijentica() && ((FS.imaAlergije && FS.imaAlergije(JJ())) || (FS.imaDij && FS.imaDij(JJ()))) ? ALL().filter((r) => !FS.alergMatch(r, JJ()).length && FS.dijOk(r, JJ())) : ALL());
    const sakriveno = () => ALL().length - R().length;
    const rid = (id) => ALL().find((x) => x.id === id);
    const algCard = () => (klijentica() && has() && FS.alergijeCard ? h`${FS.alergijeCard(JJ())}${FS.dijabetesCard ? FS.dijabetesCard(JJ()) : ''}` : '');
    const sadrzi = (r) => { const a = (FS.recAlergeni ? FS.recAlergeni(r) : []).map(FS.alergLabel); return a.length ? h`<p class="small muted mt-s" style="margin:0">Sadrži: ${a.join(', ')}</p>` : ''; };
    const makro = (r) => h`<div class="row wrap mt-s"><span class="pill">${r.kcal} kcal</span><span class="pill">P ${fx(r.p)} g</span><span class="pill">UH ${fx(r.uh)} g</span><span class="pill">M ${fx(r.m)} g</span></div>`;
    const savjetiLock = () => h`<div class="card note"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow"><b>Savjeti o ishrani i suplementima</b><div class="small">Dostupno klijenticama nakon prijave u aplikaciju.</div></div></div><a class="btn block mt-s" href="#/prijava">Prijavi se</a></div>`;
    const lockBox = () => h`<div class="card note"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow"><b>${prod().naziv}</b><div class="small">${R().length} recepata (i bosanska jela, voće) sa sastojcima i pripremom + Moj dnevni plan ishrane sa automatskim izborom obroka. Cijena ${prod().cijena} ${FS.config.valuta}.</div></div></div>${FS.gratisBanner ? FS.gratisBanner() : ''}<button class="btn primary block mt-s" data-act="buy">Kupi vodič</button></div>`;
    const kartica = (r, open) => h`<details class="card" ${open === false ? '' : 'open'}><summary style="cursor:pointer"><div class="row between"><b>${r.naziv}</b><span class="badge">${r.bos ? '🇧🇦 ' : ''}${r.obrok}</span></div>
      <div class="small">${r.kcal} kcal · P ${fx(r.p)} · UH ${fx(r.uh)} · M ${fx(r.m)}${r.v != null ? ' · vlakna ' + fx(r.v) : ''}${r.cilj ? ' · ' + r.cilj : ''}</div></summary>
      ${FS.recFoto ? FS.recFoto(r.id) : ''}
      <div class="row wrap mt-s"><span class="pill">${r.kcal} kcal</span><span class="pill">P ${fx(r.p)} g</span><span class="pill">UH ${fx(r.uh)} g</span><span class="pill">M ${fx(r.m)} g</span>${r.v != null ? h`<span class="pill">vlakna ${fx(r.v)} g</span>` : ''}</div>
      <h3 class="mt-s">Sastojci (1 porcija)</h3><ul class="dots">${r.sast.map((x) => h`<li>${x}</li>`)}</ul>
      <h3>Kako se pravi</h3><p style="margin:0">${r.priprema || 'Pripremi prema popisu sastojaka.'}</p>
      ${r.okvir ? h`${sadrzi(r)}<p class="small mt-s">Makroi su okvirna procjena za pretpostavljenu porciju.</p>` : ''}${r.v != null ? h`<p class="small mt-s">Ugljikohidrati uključuju vlakna. Vlakna daju oko 2 kcal/g, zato zbir 4/4/9 može biti malo viši od navedenih kalorija.</p>` : ''}${r.jogurt100 ? h`<p class="small mt-s">Podaci po 100 g proizvoda, provjeri etiketu pakovanja.</p>` : ''}</details>`;
    const SAMPLE = ['r01', 'r07', 'r13'];
    const FILT = [['sve', 'Sve'], ['bos', '🇧🇦 Bosanska jela'], ['Doručak', 'Doručak'], ['Ručak', 'Ručak'], ['Večera', 'Večera'], ['Užina', 'Užina'], ['Voće', 'Voće']];
    let rf = 'sve';
    const recepti = () => {
      const g = has(), all = R().filter((r) => rf === 'sve' || (rf === 'bos' ? r.bos : r.obrok === rf));
      return h`<p class="muted">${R().length} recepata i namirnica sa kalorijama, makroima i vlaknima po porciji. Vrijednosti su okvirne i zavise od namirnica i veličine porcije.</p>
        ${algCard()}${sakriveno() ? h`<div class="card note small">Zbog tvojih postavki (alergije, dijabetes) sakriveno je ${sakriveno()} recepata.</div>` : ''}
        <div class="row wrap mb">${FILT.map(([k, l]) => h`<button class="btn sm ${rf === k ? 'primary' : ''}" data-act="rf" data-k="${k}">${l}</button>`)}</div>
        ${g ? '' : lockBox()}
        ${g ? all.map((r) => kartica(r)) : all.map((r) => SAMPLE.includes(r.id) ? kartica(r) : h`<div class="card"><div class="row between"><b>${r.naziv}</b><span class="badge">${r.obrok}</span></div><div class="row between small"><span>${r.kcal} kcal · P ${fx(r.p)} g</span><span>${icon('lock')}</span></div></div>`)}`;
    };

    const dnevnik = () => { u.jelovnik = u.jelovnik || { cilj: 1800, dani: {} }; return u.jelovnik; };
    const jelovnik = () => {
      if (!u) return h`<div class="card note">Moj dnevni plan ishrane je dostupan klijenticama. <a class="btn primary block mt-s" href="#/prijava">Prijava</a></div>`;
      if (!has()) return h`<div class="card"><h3>Moj dnevni plan ishrane</h3><p class="muted">Izaberi recept za svaki obrok. Aplikacija sama računa kalorije, proteine, ugljikohidrate i masti, pokazuje koliko ti je ostalo do cilja i pravi popis namirnica za taj dan.</p></div>${lockBox()}`;
      if (u.role === 'trener') return h`<div class="card">Plan ishrane je namijenjen klijenticama. Ti vidiš cijelu kolekciju u kartici Recepti.</div>`;
      const J = dnevnik(), dan = (J.dani[datum] = J.dani[datum] || {});
      let k = 0, p = 0, uh = 0, m = 0; const izabrani = [];
      SLOTS.forEach(([key]) => { const e = dan[key], r = e && rid(e.id); if (r) { const f = e.por || 1; k += r.kcal * f; p += r.p * f; uh += r.uh * f; m += r.m * f; const ex = izabrani.find((x) => x[1].id === r.id); if (ex) ex[2] += f; else izabrani.push([key, r, f]); } });
      const cilj = +J.cilj || 0, ost = cilj - k, sp = FS.spisak ? FS.spisak(J, datum, 7) : { items: [], extra: [] };
      const grupe = ['Doručak', 'Ručak', 'Večera', 'Užina', 'Voće'];
      const sel = ([key, label, pref]) => { const e = dan[key] || {}; const ord = pref ? [pref, ...grupe.filter((x) => x !== pref)] : grupe;
        return h`<div class="card flat"><div class="eyebrow" style="margin:0">${label}</div>
          <select data-act="rec" data-k="${key}" aria-label="${label}"><option value="">Izaberi recept</option>${ord.map((gr) => h`<optgroup label="${gr}">${R().filter((r) => r.obrok === gr).map((r) => h`<option value="${r.id}" ${e.id === r.id ? 'selected' : ''}>${r.naziv} (${r.kcal} kcal)</option>`)}</optgroup>`)}</select>
          ${e.ostatak && key === 'vecera' ? h`<div class="badge ok mt-s">ostatak od ručka: skuhaj odmah veću količinu</div>` : ''}${rid(e.id) ? h`<div class="row between mt-s"><span class="small">${Math.round(rid(e.id).kcal * (e.por || 1))} kcal · P ${fx(rid(e.id).p * (e.por || 1))} g</span><label class="small">Porcija <select data-act="por" data-k="${key}" style="width:auto;min-height:36px">${POR.map((x) => h`<option value="${x}" ${(e.por || 1) === x ? 'selected' : ''}>${fx(x)}</option>`)}</select></label></div>` : ''}</div>`; };
      const DAN = ['Ned', 'Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub'];
      const sedmica = Array.from({ length: 7 }, (_, i) => addDays(today(), i)).map((d) => { const e = J.dani[d] || {}; let kc = 0, br = 0; Object.values(e).forEach((x) => { const r = rid(x.id); if (r) { kc += r.kcal * (x.por || 1); br++; } }); return [d, kc, br]; });
      return h`${algCard()}<div class="card"><h3 style="margin-top:0">Moja sedmica</h3><div class="row wrap">${sedmica.map(([d, kc, br]) => h`<button class="btn sm ${d === datum ? 'primary' : ''}" data-act="dj" data-d="${d}" style="flex:1 1 28%;padding:8px 4px"><b>${DAN[new Date(d + 'T12:00:00').getDay()]} ${(+d.slice(8)) + '.' + (+d.slice(5, 7)) + '.'}</b><br><span class="small" style="color:inherit;opacity:.8">${br ? Math.round(kc) + ' kcal' : 'nema plana'}</span></button>`)}</div>
          <label class="check mt-s" style="display:flex;gap:10px"><input type="checkbox" data-act="autoon" ${J.auto !== false ? 'checked' : ''}><span>Plan se sam obnavlja svake sedmice prema mojim podacima (ne moram ništa ponovo unositi)</span></label></div>
        <div class="card"><div class="row between"><button class="icon-btn" data-act="dd" data-d="-1" aria-label="Prethodni dan">‹</button><input type="date" data-act="dt" value="${datum}" style="width:auto"><button class="icon-btn" data-act="dd" data-d="1" aria-label="Sljedeći dan">›</button></div>
        <label class="field mt-s"><span>Dnevni cilj (kcal)</span><input data-act="cilj" inputmode="numeric" value="${J.cilj || ''}" placeholder="npr. 1800"></label>
        <a class="small" href="#/alati?tab=kalorije">Izračunaj svoj cilj u kalkulatoru</a>
</div>
        <div class="card" id="prefcard" style="${q.pref ? 'border-color:var(--beige)' : ''}"><h3 style="margin-top:0">Napravi moj plan ishrane</h3>
          <p class="small muted">1) Izaberi namirnice. Dodirni jednom ako ih <b>voliš</b> (✓), dvaput ako ih <b>ne jedeš</b> (✕), treći put poništi.</p>
          <div class="row mb"><button class="btn sm ${['piletina', 'curetina', 'junetina', 'riba'].every((k) => (J.ne || []).includes(k)) ? 'primary' : ''}" data-act="vege">🌱 Vegetarijanski plan ishrane (bez mesa i ribe)</button></div>
          <div class="row wrap mb">${(FS.NAMIRNICE || []).map(([k, l]) => { const st = (J.voli || []).includes(k) ? 'v' : (J.ne || []).includes(k) ? 'n' : ''; return h`<button class="btn sm ${st === 'v' ? 'primary' : st === 'n' ? 'danger' : ''}" data-act="nm" data-k="${k}">${st === 'v' ? '✓ ' : st === 'n' ? '✕ ' : ''}${l}</button>`; })}</div>
          <label class="field mt-s"><span>Večera od ostataka ručka (štedi vrijeme i novac)</span><select data-act="ost">${[['ne', 'Ne, svaki obrok posebno'], ['neki', 'Povremeno (oko 3 dana sedmično)'], ['svaki', 'Svaki dan']].map(([k, l]) => h`<option value="${k}" ${(J.ostaci || 'ne') === k ? 'selected' : ''}>${l}</option>`)}</select></label>
          <div class="row mt-s"><button class="btn sm primary grow" data-act="auto" data-n="7">Napravi plan ishrane za 7 dana</button><button class="btn sm grow" data-act="auto" data-n="1">Samo za ovaj dan</button></div>
          <p class="small muted mt-s">Plan ishrane se slaže prema tvom dnevnom cilju i namirnicama koje voliš. Poslije možeš sama zamijeniti bilo koji obrok ili porciju.</p></div>
        ${SLOTS.map(sel)}
        <div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Ukupno danas</div>
          <div class="stats"><div class="stat"><b>${Math.round(k)}</b><span>kcal</span></div><div class="stat"><b>${fx(p)}</b><span>proteini g</span></div><div class="stat"><b>${fx(uh)}</b><span>UH g</span></div><div class="stat"><b>${fx(m)}</b><span>masti g</span></div></div>
          <div class="kv"><span>${!k ? 'Izaberi obroke' : (ost < 0 ? 'Iznad cilja za' : 'Preostalo do cilja')}</span><b>${cilj ? Math.abs(Math.round(ost)) + ' kcal' : '–'}</b></div>
          ${cilj && k ? (() => { const tm = J.makro && J.makro.p > 0 ? J.makro : { p: (cilj * 0.25) / 4, m: (cilj * 0.25) / 9, uh: (cilj * 0.5) / 4 };
            const red = [['Proteini', tm.p, p, 'g'], ['Ugljikohidrati', tm.uh, uh, 'g'], ['Masti', tm.m, m, 'g']].map(([l, t, a, u]) => { const d = t - a, tol = t * 0.05; return [l, t, d > tol ? 'još ' + Math.round(d) + ' ' + u : d < -tol ? 'višak ' + Math.round(-d) + ' ' + u : 'u cilju', d > tol ? 0 : d < -tol ? 2 : 1]; });
            return h`<div class="mkst mt-s">${red.map(([l, t, tx, st]) => h`<div class="kv"><span>${l} <span style="opacity:.75">(cilj ${Math.round(t)})</span></span><b>${st === 1 ? '✓ ' : ''}${tx}</b></div>`)}
              ${tm.p - p > 20 ? h`<p class="small" style="margin:6px 0 0">Fali ti proteina. Dobra opcija: proteinski puding, grčki jogurt ili whey protein.</p>` : ''}</div>`; })() : ''}</div>
        <div class="card"><h3>Obroci za ovaj dan: sastojci i priprema</h3>${izabrani.length ? izabrani.map(([key, r, f]) => h`<div class="mb" style="padding-bottom:12px;border-bottom:1px solid rgba(255,255,255,.1)"><div class="eyebrow" style="margin:0">${(SLOTS.find((x) => x[0] === key) || [])[1] || ''}</div><b>${r.naziv}</b>${f !== 1 ? h` <span class="badge">× ${fx(f)}</span>` : ''}<div class="small">${Math.round(r.kcal * f)} kcal · P ${fx(r.p * f)} · UH ${fx(r.uh * f)} · M ${fx(r.m * f)}</div><h3 class="mt-s" style="font-size:15px">Sastojci</h3><ul class="dots">${r.sast.map((x) => h`<li>${x}</li>`)}</ul><h3 style="font-size:15px">Kako se pravi</h3><p style="margin:0">${r.priprema || 'Pripremi prema popisu sastojaka.'}</p></div>`) : h`<p class="muted">Recepti i priprema pojavljuju se kad izabereš obroke.</p>`}
          ${izabrani.length ? h`<p class="small">Količine su za 1 porciju${izabrani.some(([, , f]) => f !== 1) ? ', pomnoži ih brojem porcija' : ''}.</p>` : ''}</div>
        ${sp.items.length ? h`<div class="card"><div class="row between"><h3 style="margin:0">Spisak za kupovinu</h3><button class="btn sm" data-act="spcopy">Kopiraj</button></div>
          <p class="small muted">Za dane od ${fmtDate(datum)} (najviše 7 dana), količine su zbirne i okvirne.</p>
          ${sp.items.map((x) => h`<label class="check" style="display:flex;gap:10px;padding:6px 0"><input type="checkbox" data-act="kup" data-k="${x.key}" ${(J.kup || {})[x.key] ? 'checked' : ''}><span>${x.text}</span></label>`)}
          ${sp.extra.length ? h`<div class="small muted mt-s">Još treba: ${sp.extra.join(', ')}</div>` : ''}</div>` : ''}
        <p class="small">Vrijednosti su okvirne i nisu individualni medicinski plan.</p>`;
    };

    const pitanja = () => h`${FAQ.map(([a, b]) => h`<details class="card"><summary style="cursor:pointer;font-weight:600">${a}</summary><p class="muted mt-s" style="margin:0">${b}</p></details>`)}
      <div class="card flat center"><p class="muted">Želiš plan ishrane prilagođen sebi? Dostupan je uz coaching pakete.</p><a class="btn sm" href="#/paketi">Pogledaj pakete</a></div>`;

    /* sedmični plan se sam obnavlja: dani bez plana se popune prema već spremljenim podacima (cilj, namirnice, alergije) */
    if (klijentica() && has() && u.jelovnik && (u.jelovnik.planOd || Object.keys(u.jelovnik.dani || {}).length) && u.jelovnik.auto !== false && FS.autoFill) {
      const n = FS.autoFill(u, today(), 7); if (n) setTimeout(() => FS.toast('Plan ishrane za narednih 7 dana je obnovljen automatski.'), 400);
    }
    const algSave = (J) => {
      const n = FS.alergPurge ? FS.alergPurge(J) : 0; Store.save();
      FS.toast(n ? 'Sačuvano. Iz plana ishrane je izbačeno obroka: ' + n + '. Napravi plan ishrane ponovo.' : 'Alergije su sačuvane.');
      const y = window.scrollY; draw(); window.scrollTo(0, y);
    };
    draw();
    if (q.pref && tab === 'jelovnik') { const c = $('#prefcard', el); if (c) setTimeout(() => c.scrollIntoView({ block: 'start' }), 50); }
    bind(el, {
      'click:tab': (t) => { tab = t.dataset.t; draw(); window.scrollTo(0, 0); },
      'click:rf': (t) => { rf = t.dataset.k; draw(); },
      'click:vege': () => { const J = dnevnik(), M = ['piletina', 'curetina', 'junetina', 'riba']; J.ne = J.ne || []; J.voli = (J.voli || []).filter((x) => !M.includes(x));
        if (M.every((k) => J.ne.includes(k))) J.ne = J.ne.filter((k) => !M.includes(k)); else M.forEach((k) => { if (!J.ne.includes(k)) J.ne.push(k); });
        Store.save(); const y = window.scrollY; draw(); window.scrollTo(0, y); },
      'change:kup': (t) => { const J = dnevnik(); J.kup = J.kup || {}; if (t.checked) J.kup[t.dataset.k] = 1; else delete J.kup[t.dataset.k]; Store.save(); },
      'click:spcopy': () => { const sp = FS.spisak(dnevnik(), datum, 7), tx = 'Spisak za kupovinu\n' + sp.items.map((x) => '• ' + x.text).join('\n') + (sp.extra.length ? '\n\nJoš treba: ' + sp.extra.join(', ') : ''); try { navigator.clipboard.writeText(tx).then(() => FS.toast('Spisak je kopiran.')); } catch (e) { FS.toast('Kopiranje nije podržano.'); } },
      'click:nm': (t) => { const J = dnevnik(), k = t.dataset.k; J.voli = J.voli || []; J.ne = J.ne || [];
        if (J.voli.includes(k)) { J.voli = J.voli.filter((x) => x !== k); J.ne.push(k); } else if (J.ne.includes(k)) J.ne = J.ne.filter((x) => x !== k); else J.voli.push(k);
        Store.save(); const y = window.scrollY; draw(); window.scrollTo(0, y); },
      'change:ost': (t) => { dnevnik().ostaci = t.value; Store.save(); },
      'click:auto': async (t) => {
        const J = dnevnik(), n = +t.dataset.n;
        if (!(+J.cilj >= 800)) { FS.toast('Prvo upiši dnevni cilj (kcal) ili ga izračunaj u kalkulatoru.'); return; }
        const dan = J.dani[datum] || {};
        if (Object.keys(dan).length && !(await FS.confirmSheet({ title: 'Napraviti novi plan ishrane?', text: n > 1 ? 'Zamijenit će obroke za idućih 7 dana.' : 'Zamijenit će izabrane obroke za ovaj dan.', ok: 'Napravi' }))) return;
        FS.autoMenu(u, +J.cilj, datum, n, J.makro); if (n > 1) J.planOd = datum; Store.save(); FS.toast(n > 1 ? 'Plan ishrane za 7 dana je spreman.' : 'Plan ishrane je spreman.'); draw();
      },
      'click:buy': () => FS.buySheet(prod()),
      'click:dj': (t) => { datum = t.dataset.d; draw(); },
      'change:autoon': (t) => { const J = dnevnik(); J.auto = !!t.checked; if (J.auto && !J.planOd && Object.keys(J.dani || {}).length) J.planOd = today(); Store.save(); FS.toast(J.auto ? 'Plan će se obnavljati sam.' : 'Automatsko obnavljanje je isključeno.'); },
      'change:alg': (t) => { const J = dnevnik(); J.alergije = (J.alergije || []).filter((x) => x !== t.dataset.k); if (t.checked) J.alergije.push(t.dataset.k); algSave(J); },
      'change:dij': (t) => { const J = dnevnik(); J.dijabetes = !!t.checked; if (!J.uhObrok) J.uhObrok = 45; const n = FS.dijPurge ? FS.dijPurge(J) : 0; Store.save(); FS.toast(J.dijabetes ? (n ? 'Prilagođeno dijabetesu. Izbačeno obroka: ' + n + '. Napravi plan ishrane ponovo.' : 'Plan ishrane je prilagođen dijabetesu.') : 'Prilagodba isključena.'); const y = window.scrollY; draw(); window.scrollTo(0, y); },
      'change:dijuh': (t) => { const J = dnevnik(); J.uhObrok = +t.value; const n = FS.dijPurge ? FS.dijPurge(J) : 0; Store.save(); FS.toast(n ? 'Sačuvano. Izbačeno obroka: ' + n + '. Napravi plan ishrane ponovo.' : 'Sačuvano.'); draw(); },
      'change:algo': (t) => { const J = dnevnik(); J.alergijeOstalo = t.value.trim().slice(0, 120); algSave(J); },
      'change:rec': (t) => { const d = dnevnik().dani[datum] = dnevnik().dani[datum] || {}; if (t.value) d[t.dataset.k] = { id: t.value, por: (d[t.dataset.k] || {}).por || 1 }; else delete d[t.dataset.k]; Store.save(); draw(); },
      'change:por': (t) => { const d = dnevnik().dani[datum]; if (d && d[t.dataset.k]) { d[t.dataset.k].por = +t.value; Store.save(); draw(); } },
      'change:cilj': (t) => { const v = Math.round(num(t.value)); if (v >= 800 && v <= 6000) { if (dnevnik().cilj !== v) delete dnevnik().makro; dnevnik().cilj = v; Store.save(); } else FS.toast('Unesi cilj između 800 i 6000 kcal.'); draw(); },
      'change:dt': (t) => { if (t.value) { datum = t.value; draw(); } },
      'click:dd': (t) => { datum = addDays(datum, +t.dataset.d); draw(); },
      'submit:quick': (f) => {
        const w = num(formData(f).t), e = $('#qerr', el), out = $('#qout', el);
        if (!(w >= 30 && w <= 300)) { e.textContent = 'Unesi težinu između 30 i 300 kg.'; e.hidden = false; out.innerHTML = ''; return; }
        e.hidden = true;
        out.innerHTML = h`<div class="kv"><span>Protein (orijentaciono)</span><b>${Math.round(w * 1.4)}–${Math.round(w * 2)} g dnevno</b></div><div class="kv"><span>Tekućina (orijentaciono)</span><b>${(w * 0.03).toFixed(1).replace('.', ',')}–${(w * 0.035).toFixed(1).replace('.', ',')} l dnevno</b></div>
          <p class="small mt-s">Veće potrebe za tekućinom imaš po vrućini i uz znojenje. Bubrežne i druge bolesti mijenjaju preporuke, pa to dogovori s ljekarom.</p>`.s;
      }
    });
  };
})();
