/* Vodič za ishranu: principi, recepti, primjer dana, pitanja */
(function () {
  const FS = (window.FS = window.FS || {});
  FS.views = FS.views || {};
  const { h, icon, bind, formData, num, $, today, addDays, fmtDate, Store, Auth } = FS;
  const VID = 'vodic-ishrana';
  const SLOTS = [['dorucak', 'Doručak', 'Doručak'], ['rucak', 'Ručak', 'Ručak'], ['uzina', 'Užina', 'Užina'], ['vecera', 'Večera', 'Večera'], ['d1', 'Dodatni obrok', ''], ['d2', 'Dodatni obrok', '']];
  const POR = [0.5, 1, 1.5, 2];
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
    let tab = ['principi', 'recepti', 'jelovnik', 'pitanja'].includes(q.tab) ? q.tab : 'principi';
    let datum = today();
    const draw = () => {
      el.innerHTML = h`<div class="eyebrow">Vodič</div><h1>Ishrana</h1>
        ${FS.pdfBox ? FS.pdfBox(has()) : ''}
        <div class="seg"><button data-act="tab" data-t="principi" class="${tab === 'principi' ? 'on' : ''}">Principi</button><button data-act="tab" data-t="recepti" class="${tab === 'recepti' ? 'on' : ''}">Recepti</button><button data-act="tab" data-t="jelovnik" class="${tab === 'jelovnik' ? 'on' : ''}">Jelovnik</button><button data-act="tab" data-t="pitanja" class="${tab === 'pitanja' ? 'on' : ''}">Pitanja</button></div>
        ${tab === 'principi' ? principi() : ''}${tab === 'recepti' ? recepti() : ''}${tab === 'jelovnik' ? jelovnik() : ''}${tab === 'pitanja' ? pitanja() : ''}
        <div class="card alert mt"><b>Važno:</b> ovaj vodič je opšta edukacija i ne zamjenjuje savjet ljekara ili nutricioniste. Ako imaš zdravstvene tegobe, poremećaj ishrane, trudnoća ili dojenje, ili ti je ishrana izvor straha ili brige, javi se stručnoj osobi.</div>`;
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

    const R = () => FS.RECEPTI_V || [];
    const rid = (id) => R().find((x) => x.id === id);
    const makro = (r) => h`<div class="row wrap mt-s"><span class="pill">${r.kcal} kcal</span><span class="pill">P ${fx(r.p)} g</span><span class="pill">UH ${fx(r.uh)} g</span><span class="pill">M ${fx(r.m)} g</span></div>`;
    const lockBox = () => h`<div class="card note"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow"><b>${prod().naziv}</b><div class="small">42 recepta sa sastojcima i pripremom + Moj dnevni jelovnik. Cijena ${prod().cijena} ${FS.config.valuta}.</div></div></div><button class="btn primary block mt-s" data-act="buy">Kupi vodič</button></div>`;
    const kartica = (r, open) => h`<details class="card" ${open ? 'open' : ''}><summary style="cursor:pointer"><div class="row between"><b>${r.naziv}</b><span class="badge">${r.obrok}</span></div>
      <div class="small">${r.kcal} kcal · P ${fx(r.p)} · UH ${fx(r.uh)} · M ${fx(r.m)}${r.cilj ? ' · ' + r.cilj : ''}</div></summary>
      <h3 class="mt-s">Sastojci (1 porcija)</h3><ul class="dots">${r.sast.map((x) => h`<li>${x}</li>`)}</ul>
      <h3>Priprema</h3><p style="margin:0">${r.priprema || 'Pripremi prema popisu sastojaka.'}</p>
      ${r.okvir ? h`<p class="small mt-s">Makroi su okvirna procjena za pretpostavljenu porciju.</p>` : ''}${r.jogurt100 ? h`<p class="small mt-s">Podaci po 100 g proizvoda, provjeri etiketu pakovanja.</p>` : ''}</details>`;
    const SAMPLE = ['r01', 'r07', 'r13'];
    const recepti = () => {
      const all = R(), g = has();
      return h`<p class="muted">${all.length} recepata sa kalorijama i makroima po porciji. Vrijednosti su okvirne i zavise od namirnica i veličine porcije.</p>
        ${g ? '' : lockBox()}
        ${g ? all.map((r) => kartica(r)) : all.map((r) => SAMPLE.includes(r.id) ? kartica(r) : h`<div class="card"><div class="row between"><b>${r.naziv}</b><span class="badge">${r.obrok}</span></div><div class="row between small"><span>${r.kcal} kcal · P ${fx(r.p)} g</span><span>${icon('lock')}</span></div></div>`)}`;
    };

    const dnevnik = () => { u.jelovnik = u.jelovnik || { cilj: 1800, dani: {} }; return u.jelovnik; };
    const jelovnik = () => {
      if (!u) return h`<div class="card note">Moj dnevni jelovnik je dostupan klijenticama. <a class="btn primary block mt-s" href="#/prijava">Prijava</a></div>`;
      if (!has()) return h`<div class="card"><h3>Moj dnevni jelovnik</h3><p class="muted">Izaberi recept za svaki obrok. Aplikacija sama računa kalorije, proteine, ugljikohidrate i masti, pokazuje koliko ti je ostalo do cilja i pravi popis namirnica za taj dan.</p></div>${lockBox()}`;
      if (u.role === 'trener') return h`<div class="card">Jelovnik koriste klijentice. Ti vidiš cijelu kolekciju u kartici Recepti.</div>`;
      const J = dnevnik(), dan = (J.dani[datum] = J.dani[datum] || {});
      let k = 0, p = 0, uh = 0, m = 0; const izabrani = [];
      SLOTS.forEach(([key]) => { const e = dan[key], r = e && rid(e.id); if (r) { const f = e.por || 1; k += r.kcal * f; p += r.p * f; uh += r.uh * f; m += r.m * f; izabrani.push([key, r, f]); } });
      const cilj = +J.cilj || 0, ost = cilj - k;
      const grupe = ['Doručak', 'Ručak', 'Večera', 'Užina'];
      const sel = ([key, label, pref]) => { const e = dan[key] || {}; const ord = pref ? [pref, ...grupe.filter((x) => x !== pref)] : grupe;
        return h`<div class="card flat"><div class="eyebrow" style="margin:0">${label}</div>
          <select data-act="rec" data-k="${key}" aria-label="${label}"><option value="">Izaberi recept</option>${ord.map((gr) => h`<optgroup label="${gr}">${R().filter((r) => r.obrok === gr).map((r) => h`<option value="${r.id}" ${e.id === r.id ? 'selected' : ''}>${r.naziv} (${r.kcal} kcal)</option>`)}</optgroup>`)}</select>
          ${rid(e.id) ? h`<div class="row between mt-s"><span class="small">${Math.round(rid(e.id).kcal * (e.por || 1))} kcal · P ${fx(rid(e.id).p * (e.por || 1))} g</span><label class="small">Porcija <select data-act="por" data-k="${key}" style="width:auto;min-height:36px">${POR.map((x) => h`<option value="${x}" ${(e.por || 1) === x ? 'selected' : ''}>${fx(x)}</option>`)}</select></label></div>` : ''}</div>`; };
      return h`<div class="card"><div class="row between"><button class="icon-btn" data-act="dd" data-d="-1" aria-label="Prethodni dan">‹</button><input type="date" data-act="dt" value="${datum}" style="width:auto"><button class="icon-btn" data-act="dd" data-d="1" aria-label="Sljedeći dan">›</button></div>
        <label class="field mt-s"><span>Dnevni cilj (kcal)</span><input data-act="cilj" inputmode="numeric" value="${J.cilj || ''}" placeholder="npr. 1800"></label>
        <a class="small" href="#/alati?tab=kalorije">Izračunaj svoj cilj u kalkulatoru</a></div>
        ${SLOTS.map(sel)}
        <div class="card cream"><div class="eyebrow" style="color:var(--beige-2)">Ukupno danas</div>
          <div class="stats"><div class="stat"><b>${Math.round(k)}</b><span>kcal</span></div><div class="stat"><b>${fx(p)}</b><span>proteini g</span></div><div class="stat"><b>${fx(uh)}</b><span>UH g</span></div><div class="stat"><b>${fx(m)}</b><span>masti g</span></div></div>
          <div class="kv"><span>${!k ? 'Izaberi obroke' : (ost < 0 ? 'Iznad cilja za' : 'Preostalo do cilja')}</span><b>${cilj ? Math.abs(Math.round(ost)) + ' kcal' : '–'}</b></div></div>
        <div class="card"><h3>Namirnice za ovaj dan</h3>${izabrani.length ? izabrani.map(([, r, f]) => h`<div class="mb"><b>${r.naziv}</b>${f !== 1 ? h` <span class="badge">× ${fx(f)}</span>` : ''}<ul class="dots">${r.sast.map((x) => h`<li>${x}</li>`)}</ul></div>`) : h`<p class="muted">Popis se pojavljuje kad izabereš obroke.</p>`}
          ${izabrani.length ? h`<p class="small">Količine su za 1 porciju${izabrani.some(([, , f]) => f !== 1) ? ', pomnoži ih brojem porcija' : ''}.</p>` : ''}</div>
        <p class="small">Vrijednosti su okvirne i nisu individualni medicinski plan.</p>`;
    };

    const pitanja = () => h`${FAQ.map(([a, b]) => h`<details class="card"><summary style="cursor:pointer;font-weight:600">${a}</summary><p class="muted mt-s" style="margin:0">${b}</p></details>`)}
      <div class="card flat center"><p class="muted">Želiš plan ishrane prilagođen sebi? Dostupan je uz coaching pakete.</p><a class="btn sm" href="#/paketi">Pogledaj pakete</a></div>`;

    draw();
    bind(el, {
      'click:tab': (t) => { tab = t.dataset.t; draw(); window.scrollTo(0, 0); },
      'click:buy': () => FS.buySheet(prod()),
      'change:rec': (t) => { const d = dnevnik().dani[datum] = dnevnik().dani[datum] || {}; if (t.value) d[t.dataset.k] = { id: t.value, por: (d[t.dataset.k] || {}).por || 1 }; else delete d[t.dataset.k]; Store.save(); draw(); },
      'change:por': (t) => { const d = dnevnik().dani[datum]; if (d && d[t.dataset.k]) { d[t.dataset.k].por = +t.value; Store.save(); draw(); } },
      'change:cilj': (t) => { const v = Math.round(num(t.value)); if (v >= 800 && v <= 6000) { dnevnik().cilj = v; Store.save(); } else FS.toast('Unesi cilj između 800 i 6000 kcal.'); draw(); },
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
