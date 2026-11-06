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

  /* plan trčanja za klijenticu je individualni program (sinhronizuje se kao i ostali programi) */
  FS.trkPlanOf = (u) => { const p = u && (Store.db.programi || []).find((x) => x.trk && x.vlasnik === u.id); return p ? p.trk : null; };
  FS.trkPlanSet = (u, plan) => { const id = 'trk_' + u.id, L = Store.db.programi; let p = L.find((x) => x.id === id);
    if (!p) { p = { id, naziv: plan.naziv, opis: 'Plan trčanja prilagođen tebi.', nivo: 'početni', sedmica: 1, dana: 1, cijena: 0, tip: 'individualni', uShopu: false, vlasnik: u.id, dani: [{ naziv: 'Plan trčanja', vj: [] }] }; L.push(p); }
    p.naziv = plan.naziv; p.trk = plan; u.programi = u.programi || []; if (!u.programi.includes(id)) u.programi.push(id); (u.pstart = u.pstart || {})[id] = today(); };
  FS.trkPlanDel = (u) => { const id = 'trk_' + u.id; Store.db.programi = Store.db.programi.filter((x) => x.id !== id); u.programi = (u.programi || []).filter((x) => x !== id); };
  const doc = (u) => { const L = (Store.db.upitnici = Store.db.upitnici || []); let d = L.find((x) => x.userId === u.id && x.tip === 'trk'); if (!d) { d = { id: 'trk_' + u.id, userId: u.id, tip: 'trk', datum: today(), done: {} }; L.push(d); } d.done = d.done || {}; return d; };

  V.trcanje = (el, p, q) => {
    const u = Auth.user(), isK = u && (u.role === 'klijentica' || u.role === 'trener');
    const isT = !!u && u.role === 'trener'; /* Cooperov test i intervali: samo trenerica, ona ih prilagođava klijenticama */
    const plan0 = u && u.role === 'klijentica' && FS.trkPlanOf(u); /* plan trčanja koji je trenerica sastavila za klijenticu */
    let tab = ['5k', '10k', 'kalk'].concat(isT ? ['coop', 'int', 'plan'] : [], plan0 ? ['moj'] : []).includes(q.tab) ? q.tab : (plan0 && !q.tab ? 'moj' : '5k');
    let pd = null; /* nacrt plana u uređivanju (trenerica) */
    const draw = () => {
      const seg = h`<div class="seg">${(plan0 ? [['moj', 'Moj plan']] : []).concat([['5k', 'Plan 5 km'], ['10k', 'Plan 10 km']], FS.trkExtra && isT ? FS.trkExtra.tabs.concat([['plan', 'Plan za klijenticu']]) : [], [['kalk', 'Kalkulator tempa']]).map(([k, l]) => h`<button data-act="tab" data-t="${k}" class="${tab === k ? 'on' : ''}">${l}</button>`)}</div>`;

      const RED = ['Intervali', 'Tempo', 'Dugo lagano'];
      if (tab === 'moj' && plan0) {
        const pl = plan0, d = doc(u), ks = [];
        pl.tjedni.forEach((w, wi) => w.ss.forEach((tx, si) => { if (String(tx).trim()) ks.push('moj-' + wi + '-' + si); }));
        const dn = ks.filter((k) => d.done[k]).length;
        el.innerHTML = h`<div class="eyebrow">Plan trčanja</div><h1>${pl.naziv}</h1>${seg}
          <div class="progress mb" role="progressbar" aria-valuenow="${dn}" aria-valuemax="${ks.length}"><i style="width:${ks.length ? Math.round((dn / ks.length) * 100) : 0}%"></i></div><div class="small mb">${dn} od ${ks.length} treninga završeno</div>
          <div class="card note"><b>Kako trčati</b><p class="muted mt-s" style="margin:0">Svaki trening počni zagrijavanjem (WU) i završi hlađenjem (CD). Lagano znači da možeš razgovarati. Ako osjetiš oštru bol, prekini. Oznake: WU zagrijavanje, CD hlađenje, I interval, T tempo.</p></div>
          ${pl.tjedni.map((w, wi) => h`<details class="card" ${wi === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:19px">${w.naz}</b></summary>
            ${w.ss.map((tx, si) => String(tx).trim() ? h`<div class="kv"><span style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-act="done" data-k="${'moj-' + wi + '-' + si}" ${d.done['moj-' + wi + '-' + si] ? 'checked' : ''} aria-label="Završeno">${RED[si] || 'Trening ' + (si + 1)}</span><b>${tx}</b></div>` : '')}</details>`)}
          ${FS.raw(FS.trkExtra ? FS.trkExtra.puls : '')}
          <a class="btn block mb" href="#/trcanje?tab=kalk">Kalkulator tempa</a>`;
        return;
      }
      if (tab === 'plan' && isT && FS.trkData) {
        if (!pd) { pd = { kid: q.k || '', nivo: 0, naziv: 'Priprema za Cooperov test', testm: '', tjedni: [{ naz: 'Sedmica 1', ss: ['', '', ''] }] }; const k0 = pd.kid && Store.user(pd.kid), t0p = k0 && FS.trkPlanOf(k0); if (t0p) { pd.nivo = t0p.nivo || 0; pd.naziv = t0p.naziv; pd.tjedni = JSON.parse(JSON.stringify(t0p.tjedni)); } }
        const { W, T, NIV, D } = FS.trkData, ks = Store.klijentice(), n = pd.nivo;
        const grp = (lab, arr) => arr.length ? h`<optgroup label="${lab}">${arr.map(([v, t2]) => h`<option value="${t2}">${v}</option>`)}</optgroup>` : '';
        const fromT = (ti) => T[ti].s.filter(([nm, v]) => v[n] !== D).map(([nm, v]) => [T[ti].naz + ' · ' + nm + ': ' + v[n], T[ti].naz + ' (' + nm + '): ' + v[n]]);
        const cw = (col) => W.map((r) => [r[0] + ': ' + r[col][n], r[col][n]]);
        const POOL = [
          [['Cooperov test (12 min)', 'Cooperov test 12 min (zapiši udaljenost)']].concat(fromT(0), fromT(1), fromT(2)).concat(cw(1).map(([a, b]) => [a, b])),
          fromT(4).concat(fromT(3), cw(2).map(([a, b]) => [a, 'Tempo ' + b + ' (5 min lagano prije i poslije)'])),
          fromT(5).concat(cw(3).map(([a, b]) => [a, b]))
        ];
        const LAB = [['Cooper test, intervali', 'Iz Cooper plana'], ['Tempo, progresija', 'Iz Cooper plana'], ['Lagano i dugo', 'Iz Cooper plana']];
        el.innerHTML = h`<div class="eyebrow">Samo za tebe</div><h1>Plan trčanja / Cooper priprema</h1>${seg}
          <p class="muted">Sastavi sedmični plan za klijenticu. U svaki red možeš ubaciti gotov trening iz liste (intervali, tempo, dugo trčanje) ili upisati svoj, na osnovu rezultata testiranja. Klijentica vidi plan u svom prostoru.</p>
          <div class="card"><label class="field"><span>Klijentica</span><select data-f="kid" data-act="pkid"><option value="">Izaberi…</option>${ks.map((k) => h`<option value="${k.id}" ${pd.kid === k.id ? 'selected' : ''}>${k.ime}${FS.trkPlanOf(k) ? ' (ima plan)' : ''}</option>`)}</select></label>
            <div class="grid2"><label class="field"><span>Nivo (za gotove liste)</span><select data-f="nivo" data-act="pniv">${NIV.map(([en, bs], i) => h`<option value="${i}" ${pd.nivo === i ? 'selected' : ''}>${en} (${bs})</option>`)}</select></label>
            <label class="field"><span>Naziv plana</span><input data-f="naziv" value="${pd.naziv}"></label></div>
            <div class="row wrap"><button class="btn sm" data-act="pcoop">Učitaj Cooper plan (6 sedmica)</button><button class="btn sm" data-act="pprazan">Prazan plan</button></div></div>
          <div class="card"><h3>Rezultat testa klijentice</h3><p class="muted small">Upiši pređene metre u 12 min. Dobiješ okvirne tempe za treninge, pa ih upišeš u plan.</p>
            <div class="row"><input data-f="testm" inputmode="numeric" placeholder="npr. 2000" value="${pd.testm || ''}" class="grow"><button class="btn sm" data-act="ptest">Izračunaj</button></div><div id="ptestout" class="mt-s">${FS.raw(pd.testHtml || '')}</div></div>
          ${pd.tjedni.map((w, wi) => h`<div class="card"><label class="field"><span>Sedmica</span><input data-f="wn" data-w="${wi}" value="${w.naz}"></label>
            ${w.ss.map((tx, si) => h`<label class="field"><span>${RED[si]}</span><textarea data-f="tx" data-w="${wi}" data-s="${si}" rows="2" placeholder="${si === 0 ? 'Npr. 1,5 km WU, 8 × 300 m I (100 m lagano), 1,5 km CD' : si === 1 ? 'Npr. 10 min tempo, 5 min lagano prije i poslije' : 'Npr. 25 min lagano'}">${tx}</textarea></label>
              <select data-act="ppick" data-w="${wi}" data-s="${si}" class="mb"><option value="">+ Ubaci gotov trening…</option>${grp('Iz biblioteke', POOL[si].slice(si === 0 ? 0 : 0))}</select>`)}</div>`)}
          <div class="row wrap mb"><button class="btn sm" data-act="padd">+ Dodaj sedmicu</button><button class="btn sm" data-act="prm">− Ukloni zadnju</button></div>
          <button class="btn primary block mb" data-act="psave">Dodijeli plan klijentici</button>
          ${pd.kid && FS.trkPlanOf(Store.user(pd.kid) || {}) ? h`<button class="btn danger block mb" data-act="pdel">Ukloni plan klijentici</button>` : ''}`;
        el.__pool = POOL;
        return;
      }
      if (tab === 'kalk') {
        el.innerHTML = h`<div class="eyebrow">Alat</div><h1>Kalkulator tempa</h1>${seg}
          <form class="card" data-act="pred" novalidate><h3>Procjena rezultata i tempa za trening</h3><p class="muted small">Upiši koliko si nedavno trčala neku distancu. Procjena koristi Riegelovu formulu.</p>
            <div class="grid2"><label class="field"><span>Distanca</span><select name="d"><option value="3">3 km</option><option value="5" selected>5 km</option><option value="10">10 km</option><option value="21.0975">Polumaraton</option></select></label>
            <label class="field"><span>Vrijeme (m:ss ili h:mm:ss)</span><input name="t" placeholder="npr. 32:00" inputmode="text"></label></div>
            <p class="err" id="perr" hidden></p><button class="btn primary block" type="submit">Izračunaj</button></form><div id="pout"></div>
          <form class="card" data-act="pace" novalidate><h3>Tempo ↔ vrijeme</h3>
            <div class="grid2"><label class="field"><span>Distanca (km)</span><input name="km" inputmode="decimal" placeholder="npr. 5"></label><label class="field"><span>Vrijeme</span><input name="t" placeholder="npr. 30:00"></label></div>
            <button class="btn block" type="submit">Izračunaj tempo po km</button><div id="cout" class="mt-s"></div></form>${FS.raw(FS.trkExtra ? FS.trkExtra.puls : '')}`;
        return;
      }
      if ((tab === 'coop' || tab === 'int') && FS.trkExtra) {
        if (!isK) { el.innerHTML = h`<div class="eyebrow">Trčanje</div><h1>${tab === 'coop' ? 'Cooperov test' : 'Intervali i tempo'}</h1>${seg}<div class="card cream"><div class="row"><span style="width:26px">${icon('lock')}</span><div class="grow" style="color:var(--navy)"><b>Dostupno klijenticama</b><div class="small">Prijavi se ili kontaktiraj trenericu.</div></div></div></div><a class="btn primary block mb" href="#/prijava">Prijava</a>`; return; }
        el.innerHTML = h`${seg}${FS.trkExtra.html(tab)}`; return;
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
        ${FS.raw(FS.trkExtra ? FS.trkExtra.puls : '')}
        ${P.tjedni.map(([nz, ss], wi) => h`<details class="card" ${wi === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:18px">${nz}</b></summary>
          <p class="small mt-s">${WU}. ${CD}.</p>
          ${ss.map((t, si) => { const key = tab + '-' + wi + '-' + si; return h`<label class="check" style="align-items:flex-start"><input type="checkbox" data-act="done" data-k="${key}" ${d.done[key] ? 'checked' : ''}><span><b>Trening ${si + 1}.</b> ${t}</span></label>`; })}</details>`)}
        <div class="card"><h3>Dobro je znati</h3><ul class="dots">${FS.TRK_OPSTE.map((t) => h`<li>${t}</li>`)}</ul></div>
        <a class="btn block mb" href="#/trcanje?tab=kalk">Kalkulator tempa</a>`;
    };
    const sync = () => { if (!pd) return; const g = (f) => el.querySelector('[data-f=' + f + ']'); if (!g('kid')) return; pd.kid = g('kid').value; pd.nivo = +g('nivo').value; pd.naziv = g('naziv').value; if (g('testm')) pd.testm = g('testm').value;
      el.querySelectorAll('[data-f=wn]').forEach((i) => { pd.tjedni[+i.dataset.w].naz = i.value; }); el.querySelectorAll('[data-f=tx]').forEach((i) => { pd.tjedni[+i.dataset.w].ss[+i.dataset.s] = i.value; }); };
    draw();
    bind(el, {
      'click:pcoop': () => { sync(); const { W } = FS.trkData, n = pd.nivo; pd.tjedni = W.map(([naz, iv, tm, lg]) => ({ naz, ss: [iv[n], tm[n] + ' (5 min lagano prije i poslije)', lg[n]] })); draw(); },
      'click:pprazan': () => { sync(); pd.tjedni = [{ naz: 'Sedmica 1', ss: ['', '', ''] }]; draw(); },
      'click:padd': () => { sync(); pd.tjedni.push({ naz: 'Sedmica ' + (pd.tjedni.length + 1), ss: ['', '', ''] }); draw(); },
      'click:prm': () => { sync(); if (pd.tjedni.length > 1) pd.tjedni.pop(); draw(); },
      'change:pkid': () => { sync(); const k = pd.kid && Store.user(pd.kid), tp = k && FS.trkPlanOf(k); if (tp) { pd.nivo = tp.nivo || 0; pd.naziv = tp.naziv; pd.tjedni = JSON.parse(JSON.stringify(tp.tjedni)); toast('Učitan postojeći plan klijentice.'); } draw(); },
      'change:pniv': () => { sync(); draw(); },
      'change:ppick': (s) => { sync(); if (!s.value) return; const c = pd.tjedni[+s.dataset.w].ss, i = +s.dataset.s; c[i] = c[i] ? c[i] + ' + ' + s.value : s.value; draw(); },
      'click:ptest': () => { sync(); const m = parseFloat(String(pd.testm).replace(',', '.')); if (!(m >= 500 && m <= 5000)) { toast('Upiši udaljenost u metrima (500 do 5000).'); return; }
        const r = FS.coopCalc(m), pc = r.pace, f = (x) => fmt(x);
        pd.testHtml = h`<div class="kv"><span>VO₂max (procjena)</span><b>${r.v.toFixed(1)}</b></div><div class="kv"><span>Prosječan tempo testa</span><b>${f(pc)} po km</b></div><div class="kv"><span>Lagano</span><b>${f(pc * 1.25)} – ${f(pc * 1.4)}</b></div><div class="kv"><span>Tempo (T)</span><b>${f(pc * 1.05)} – ${f(pc * 1.12)}</b></div><div class="kv"><span>Intervali 400–800 m</span><b>${f(pc * 0.94)} – ${f(pc * 0.99)}</b></div><p class="small mt-s">Okvirno, po km. Prilagodi klijentici prema osjećaju i pulsu.</p>`.s; draw(); },
      'click:psave': () => { sync(); const k = pd.kid && Store.user(pd.kid); if (!k) { toast('Izaberi klijenticu.'); return; }
        const tj = pd.tjedni.map((w) => ({ naz: String(w.naz).trim() || 'Sedmica', ss: w.ss.map((x) => String(x).trim()) })).filter((w) => w.ss.some((x) => x));
        if (!tj.length) { toast('Upiši barem jedan trening.'); return; }
        const dd = doc(k); Object.keys(dd.done).forEach((x) => { if (x.startsWith('moj-')) delete dd.done[x]; });
        FS.trkPlanSet(k, { naziv: String(pd.naziv).trim() || 'Plan trčanja', nivo: pd.nivo, tjedni: tj, kreirano: today() }); Store.save(); toast('Plan je dodijeljen. ' + k.ime + ' ga vidi kao „Moj plan”.'); draw(); },
      'click:pdel': () => { const k = pd && pd.kid && Store.user(pd.kid); if (!k) return; FS.trkPlanDel(k); Store.save(); toast('Plan je uklonjen.'); draw(); },
      'click:tab': (t) => { tab = t.dataset.t; try { history.replaceState(null, '', '#/trcanje?tab=' + tab); } catch (e) { /* ignoriši */ } draw(); },
      'submit:coop': (f) => {
        const x = FS.formData(f), d = parseFloat(String(x.d).replace(',', '.')), er = $('#cerr', el), o = $('#cout', el);
        if (!(d >= 500 && d <= 5000)) { er.textContent = 'Upiši udaljenost u metrima (npr. 2000).'; er.hidden = false; return; }
        er.hidden = true; const r = FS.coopCalc(d);
        o.innerHTML = h`<div class="kv"><span>Okvirni VO₂max</span><b>${r.v.toFixed(1)} ml/kg/min</b></div><div class="kv"><span>Prosječan tempo</span><b>${fmt(r.pace)} po km</b></div><p class="small mt-s">Procjena po Cooperovoj formuli. Služi za praćenje napretka kroz vrijeme.</p>`.s;
      },
      'submit:puls': (f) => {
        const x = FS.formData(f), g = parseInt(x.g, 10), r = parseInt(x.r, 10), mx = parseInt(x.m, 10), er = $('#perr2', el), o = $('#pzone', el);
        if (!(g >= 14 && g <= 90) || !(r >= 35 && r <= 110) || (x.m && !(mx > r + 40 && mx <= 230))) { er.textContent = 'Provjeri unos: godine, puls u mirovanju (35 do 110) i, ako upisuješ, najviši puls.'; er.hidden = false; return; }
        er.hidden = true;
        const max = x.m ? mx : Math.round(208 - 0.7 * g), rez = max - r, bpm = (p) => Math.round(r + rez * p);
        const Z = [['Hodanje, oporavak', 0.5, 0.6, 'Zagrijavanje i hlađenje'], ['Lagano (Easy, dugo)', 0.6, 0.7, 'Možeš razgovarati, napor 5 do 6'], ['Tempo (T), progresija', 0.8, 0.88, 'Ugodno teško, napor 7'], ['Intervali (brze dionice)', 0.88, 0.95, 'Napor 8, pogledaj napomenu ispod']];
        const vo = (15.3 * max / r).toFixed(1);
        o.innerHTML = h`<div class="kv"><span>Najviši puls ${x.m ? '(tvoj)' : '(procjena)'}</span><b>${max} otkucaja/min</b></div>${Z.map(([n, a, b, t]) => h`<div class="kv"><span>${n}<br><span class="small">${t}</span></span><b>${bpm(a)} – ${bpm(b)}</b></div>`)}
          <div class="kv"><span>Okvirni VO₂max iz pulsa</span><b>${vo} ml/kg/min</b></div>
          <p class="small mt-s">Zone računa Karvonenova formula (puls rezerve). Procjena najvišeg pulsa ${x.m ? 'nije potrebna jer si upisala svoj' : '(208 − 0,7 × godine) može odstupati i za 10 do 12 otkucaja'}, a tačnija je vrijednost izmjerena na kraju Cooperovog testa. VO₂max iz pulsa je grublja procjena od testa. U kratkim intervalima (do 2 minute) puls kasni, pa se tu orijentiši prema osjećaju. Ako uzimaš lijekove za srce ili pritisak, zone dogovori s ljekarom.</p>`.s;
      },
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
