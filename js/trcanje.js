/* Planovi trčanja za početnice (5 km i 10 km) + kalkulator tempa */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, icon, toast, Store, Auth, $, bind, today } = FS;
  const V = (FS.views = FS.views || {});

  const R = (n, a, b) => `${n}× (${a} trčanje / ${b} hodanje)`;
  const WU = 'Zagrijavanje: 5 min brzog hodanja';
  const CD = 'Hlađenje: 5 min laganog hodanja + istezanje';
  FS.TRK = {
    '5k': {
      naziv: 'Od 0 do 5 km', sedmice: 8, opis: 'Osam sedmica, tri trčanja sedmično, s izmjenom trčanja i hodanja. Cilj: 30 minuta trčanja ili 5 km.',
      napomena: 'Tempo je lagan: moraš moći razgovarati (test razgovora). Između dva trčanja barem jedan dan odmora ili snage.',
      tjedni: [
        ['Sedmica 1', [R(8, '1 min', '90 s'), R(8, '1 min', '90 s'), R(8, '1 min', '90 s')]],
        ['Sedmica 2', [R(6, '2 min', '2 min'), R(6, '2 min', '2 min'), R(6, '2 min', '90 s')]],
        ['Sedmica 3', [R(5, '3 min', '2 min'), R(5, '3 min', '90 s'), R(4, '4 min', '2 min')]],
        ['Sedmica 4', [R(4, '5 min', '2 min'), R(3, '8 min', '2 min'), R(2, '10 min', '2 min')]],
        ['Sedmica 5', [R(3, '8 min', '2 min'), R(2, '12 min', '2 min'), '18 min neprekidnog laganog trčanja']],
        ['Sedmica 6', ['20 min neprekidno', R(3, '10 min', '1 min'), '22 min neprekidno']],
        ['Sedmica 7', ['25 min neprekidno', '25 min neprekidno', '25 min neprekidno']],
        ['Sedmica 8', ['25 min lagano', '28 min lagano', 'Cilj: 30 min neprekidno ili 5 km (bez žurbe)']]
      ]
    },
    '10k': {
      naziv: 'Od 5 do 10 km', sedmice: 10, opis: 'Deset sedmica za one koje već mogu trčati 30 minuta bez zaustavljanja. Tri trčanja sedmično: lagano, brže dionice i dugo trčanje.',
      napomena: 'Lagano znači tempo uz koji možeš razgovarati. Brže dionice su „ugodno teške“, ne sprint. Sedmica 4 i 7 su rasterećenja.',
      tjedni: [
        ['Sedmica 1', ['Lagano 25 min', 'Fartlek: ' + R(6, '1 min brže', '2 min lagano'), 'Dugo: 5 km lagano']],
        ['Sedmica 2', ['Lagano 30 min', 'Fartlek: ' + R(6, '90 s brže', '2 min lagano'), 'Dugo: 6 km lagano']],
        ['Sedmica 3', ['Lagano 30 min', 'Intervali: 5× 400 m brže (200 m hodanja između)', 'Dugo: 7 km lagano']],
        ['Sedmica 4 · rasterećenje', ['Lagano 25 min', 'Fartlek: ' + R(4, '1 min brže', '2 min lagano'), 'Dugo: 5 km lagano']],
        ['Sedmica 5', ['Lagano 35 min', 'Fartlek: ' + R(6, '2 min brže', '2 min lagano'), 'Dugo: 8 km lagano']],
        ['Sedmica 6', ['Lagano 35 min', 'Intervali: 6× 400 m brže (200 m hodanja između)', 'Dugo: 9 km lagano']],
        ['Sedmica 7 · rasterećenje', ['Lagano 30 min', 'Fartlek: ' + R(5, '2 min brže', '2 min lagano'), 'Dugo: 6 km lagano']],
        ['Sedmica 8', ['Lagano 40 min', 'Intervali: 4× 800 m brže (400 m hodanja između)', 'Dugo: 10 km vrlo lagano, bez žurbe']],
        ['Sedmica 9', ['Lagano 35 min', 'Fartlek: ' + R(6, '2 min brže', '1 min lagano'), 'Dugo: 8 km lagano']],
        ['Sedmica 10 · utrka', ['Lagano 25 min', '15 min lagano + 4× 20 s ubrzanja', 'Cilj: 10 km (utrka ili vlastiti test)']]
      ]
    }
  };
  FS.TRK_OPSTE = [
    'Prije početka konsultuj ljekara ako imaš zdravstvene probleme, bolove u koljenima ili si dugo bila neaktivna.',
    'Svaki trening počni zagrijavanjem (5 min hodanja) i završi laganim hodanjem i istezanjem.',
    'Dva puta sedmično dodaj trening snage za noge i trup (npr. Kućna snaga dan A i D ili Oblikuj i ojačaj noge). Jaka muskulatura štiti koljena i leđa.',
    'Ako osjetiš oštru bol (ne samo umor), prekini i odmori nekoliko dana. Ne povećavaj tempo i kilometre istovremeno.',
    'Ako propustiš trening, ne nadoknađuj ga; nastavi dalje ili ponovi prošlu sedmicu.'
  ];

  /* ---------- kalkulator tempa (Riegel, isto kao u tvom Excelu: eksponent 1,06) ---------- */
  const pad = (n) => String(Math.floor(n)).padStart(2, '0');
  const fmt = (sec) => { sec = Math.round(sec); const hh = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60; return (hh ? hh + ':' + pad(mm) : mm) + ':' + pad(ss); };
  const parse = (t) => { const a = String(t || '').trim().replace(',', '.').split(':').map(Number); if (!a.length || a.some((n) => isNaN(n) || n < 0)) return 0; return a.length === 3 ? a[0] * 3600 + a[1] * 60 + a[2] : a.length === 2 ? a[0] * 60 + a[1] : a[0] * 60; };
  FS.trkPredict = (dKm, tSec) => [3, 5, 10, 21.0975].map((d) => ({ d, t: tSec * Math.pow(d / dKm, 1.06) }));
  const distNaz = (d) => (d === 21.0975 ? 'Polumaraton' : d + ' km');

  const doc = (u) => { const L = (Store.db.upitnici = Store.db.upitnici || []); let d = L.find((x) => x.userId === u.id && x.tip === 'trk'); if (!d) { d = { id: 'trk_' + u.id, userId: u.id, tip: 'trk', datum: today(), done: {} }; L.push(d); } d.done = d.done || {}; return d; };

  V.trcanje = (el, p, q) => {
    const u = Auth.user(), isK = u && (u.role === 'klijentica' || u.role === 'trener');
    let tab = ['5k', '10k', 'kalk'].includes(q.tab) ? q.tab : '5k';
    const draw = () => {
      const seg = h`<div class="seg">${[['5k', 'Plan 5 km'], ['10k', 'Plan 10 km'], ['kalk', 'Kalkulator tempa']].map(([k, l]) => h`<button data-act="tab" data-t="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`)}</div>`;
      if (tab === 'kalk') {
        el.innerHTML = h`<div class="eyebrow">Alat</div><h1>Kalkulator tempa</h1>${seg}
          <form class="card" data-act="pred" novalidate><h3>Procjena rezultata i tempa za trening</h3><p class="muted small">Upiši koliko si nedavno trčala neku distancu. Procjena koristi Riegelovu formulu.</p>
            <div class="grid2"><label class="field"><span>Distanca</span><select name="d"><option value="3">3 km</option><option value="5" selected>5 km</option><option value="10">10 km</option><option value="21.0975">Polumaraton</option></select></label>
            <label class="field"><span>Vrijeme (m:ss ili h:mm:ss)</span><input name="t" placeholder="npr. 32:00" inputmode="text"></label></div>
            <p class="err" id="perr" hidden></p><button class="btn primary block" type="submit">Izračunaj</button></form><div id="pout"></div>
          <form class="card" data-act="pace" novalidate><h3>Tempo ↔ vrijeme</h3>
            <div class="grid2"><label class="field"><span>Distanca (km)</span><input name="km" inputmode="decimal" placeholder="npr. 5"></label><label class="field"><span>Vrijeme</span><input name="t" placeholder="npr. 30:00"></label></div>
            <button class="btn block" type="submit">Izračunaj tempo po km</button><div id="cout" class="mt-s"></div></form>`;
        return;
      }
      const P = FS.TRK[tab];
      if (!isK) {
        el.innerHTML = h`<div class="eyebrow">Trčanje za početnice</div><h1>${P.naziv}</h1>${seg}
          <div class="card cream"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow" style="color:var(--navy)"><b>Plan je dostupan klijenticama</b><div class="small">${P.opis} Prijavi se ili kontaktiraj trenericu. Kalkulator tempa je otvoren za sve.</div></div></div></div>
          <a class="btn primary block mb" href="#/prijava">Prijava</a>`;
        return;
      }
      const d = doc(u), total = P.tjedni.length * 3, done = Object.keys(d.done).filter((k) => k.startsWith(tab + '-') && d.done[k]).length;
      el.innerHTML = h`<div class="eyebrow">Trčanje za početnice</div><h1>${P.naziv}</h1>${seg}<p class="muted">${P.opis}</p>
        <div class="progress mb" role="progressbar" aria-valuenow="${done}" aria-valuemax="${total}"><i style="width:${Math.round((done / total) * 100)}%"></i></div><div class="small mb">${done} od ${total} treninga završeno</div>
        <div class="card note"><b>Kako trčati</b><p class="muted mt-s" style="margin:0">${P.napomena}</p></div>
        ${P.tjedni.map(([nz, ss], wi) => h`<details class="card" ${wi === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:18px">${nz}</b></summary>
          <p class="small mt-s">${WU}. ${CD}.</p>
          ${ss.map((t, si) => { const key = tab + '-' + wi + '-' + si; return h`<label class="check" style="align-items:flex-start"><input type="checkbox" data-act="done" data-k="${key}" ${d.done[key] ? 'checked' : ''}><span><b>Trening ${si + 1}.</b> ${t}</span></label>`; })}</details>`)}
        <div class="card"><h3>Dobro je znati</h3><ul class="dots">${FS.TRK_OPSTE.map((t) => h`<li>${t}</li>`)}</ul></div>
        <a class="btn block mb" href="#/trcanje?tab=kalk">Kalkulator tempa</a>`;
    };
    draw();
    bind(el, {
      'click:tab': (t) => { tab = t.dataset.t; try { history.replaceState(null, '', '#/trcanje?tab=' + tab); } catch (e) { /* ignoriši */ } draw(); },
      'change:done': (t) => { const d = doc(u); d.done[t.dataset.k] = t.checked; Store.save(); draw(); },
      'submit:pred': (f) => {
        const x = FS.formData(f), tsec = parse(x.t), dkm = parseFloat(x.d), er = $('#perr', el);
        if (!(tsec > 60)) { er.textContent = 'Upiši vrijeme u formatu m:ss (npr. 32:00).'; er.hidden = false; return; }
        er.hidden = true;
        const pr = FS.trkPredict(dkm, tsec), pace = tsec / dkm, p10 = pace * Math.pow(10 / dkm, 0.06);
        const z = [['Lagano trčanje', pace * 1.25, pace * 1.4], ['Dugo trčanje', pace * 1.2, pace * 1.35], ['Brže dionice (fartlek)', p10 * 0.98, p10 * 1.03], ['Intervali 400–800 m', pace * 0.94, pace * 0.99]];
        $('#pout', el).innerHTML = h`<div class="card"><h3>Procjena rezultata</h3>${pr.map((r) => h`<div class="row between" style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.1)"><span>${distNaz(r.d)}</span><b>${fmt(r.t)} <span class="small">(${fmt(r.t / r.d)}/km)</span></b></div>`)}</div>
          <div class="card"><h3>Tempa za trening (po km)</h3>${z.map(([n, a, b]) => h`<div class="row between" style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.1)"><span>${n}</span><b>${fmt(a)} – ${fmt(b)}</b></div>`)}
          <p class="small mt-s">Okvirne vrijednosti. Početnice se uvijek orijentišu prema osjećaju (test razgovora), a tempo služi kao provjera.</p></div>`.s;
      },
      'submit:pace': (f) => {
        const x = FS.formData(f), km = parseFloat(String(x.km).replace(',', '.')), t = parse(x.t), o = $('#cout', el);
        o.innerHTML = km > 0 && t > 0 ? h`<b>Tempo: ${fmt(t / km)} po km</b> <span class="small">· ${(km / (t / 3600)).toFixed(1)} km/h</span>`.s : h`<span class="err">Upiši distancu i vrijeme.</span>`.s;
      }
    });
  };

  /* 1RM kalkulator (samo trenerica) */
  V.rm = (el) => {
    const u = Auth.user();
    if (!u || u.role !== 'trener') { el.innerHTML = h`<h1>1RM kalkulator</h1><p class="muted">Dostupno samo trenerici.</p>`; return; }
    const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35];
    el.innerHTML = h`<div class="eyebrow">Alati za trenericu</div><h1>1RM kalkulator</h1>
      <p class="muted">Formula: težina × (1 + ponavljanja / 30). Npr. 50 kg × 5 = 58,3 kg.</p>
      <form class="card" data-act="rm"><label>Težina (kg)<input name="w" inputmode="decimal" placeholder="50"></label><label>Ponavljanja<input name="r" inputmode="numeric" placeholder="5"></label><button class="btn block mt-s" type="submit">Izračunaj</button></form>
      <div id="rmout"></div>`;
    bind(el, {
      'submit:rm': (f) => {
        const x = FS.formData(f), w = parseFloat(String(x.w).replace(',', '.')), r = parseInt(x.r, 10), o = $('#rmout', el);
        if (!(w > 0) || !(r >= 1)) { o.innerHTML = h`<p class="err">Upiši težinu i broj ponavljanja.</p>`.s; return; }
        const rm = w * (1 + r / 30), f1 = (v) => (Math.round(v * 10) / 10).toString().replace('.', ',');
        o.innerHTML = h`<div class="card"><h3>Procijenjeni 1RM: ${f1(rm)} kg</h3>
          ${pcts.map((q) => h`<div class="row between" style="padding:6px 0;border-bottom:1px solid rgba(255,255,255,.1)"><span>${q} %</span><b>${f1(rm * q / 100)} kg</b></div>`)}
          <p class="small mt-s">Dinamični dani: postotak glavne šipke + oko 25 % reaktivnog opterećenja (gume ili lanci). Npr. 50 % + 25 % = ${f1(rm * 0.5)} kg + ${f1(rm * 0.25)} kg.</p></div>`.s;
      }
    });
  };
  const alati1 = V.alati;
  V.alati = (el, p, q) => {
    alati1(el, p, q);
    const u = Auth.user();
    if (u && u.role === 'trener') el.insertAdjacentHTML('beforeend', h`<a class="card" href="#/rm" style="display:block"><b>1RM kalkulator</b><div class="small muted">Za Conjugate i trening snage</div></a>`.s);
  };
})();
