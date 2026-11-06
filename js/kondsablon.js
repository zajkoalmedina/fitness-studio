/* Kondicijski šabloni (samo trenerica): uredi primjer, sačuvaj, dodijeli klijentici (dobija tajmer) */
(function () {
  const FS = (window.FS = window.FS || {});
  const V = FS.views;
  const { h, bind, formData, opts, toast, Store, uid, today, confirmSheet } = FS;

  /* pretraga: ugrađeni treninzi + sačuvani šabloni/dodijeljeni programi s kond konfiguracijom */
  const base = FS.kond;
  FS.kond = (id) => {
    const b = base(id); if (b) return b;
    const p = (Store.db.programi || []).find((x) => x.id === id && x.kond);
    return p ? Object.assign({ nivo: 'srednji', oprema: '', savjet: '' }, p.kond, { id: p.id, naziv: p.naziv, opis: p.opis || p.kond.opis || '' }) : null;
  };

  /* klijentica koja otvori dodijeljeni program dobija tajmer */
  const pv = V.program;
  V.program = (el, p, q) => {
    const pr = Store.program(p.id);
    if (pr && pr.kond && pr.tip === 'individualni') { location.replace('#/kond/' + pr.id); return; }
    return pv(el, p, q);
  };

  const TIPOVI = [['EMOM', 'EMOM (svake minute)'], ['AMRAP', 'AMRAP (što više krugova)'], ['TABATA', 'Tabata'], ['INTERVALI', 'Intervali / kružni'], ['CHIPPER', 'Chipper (na vrijeme)'], ['PIRAMIDA', 'Piramida']];
  const PRIMJERI = {
    EMOM: { naziv: 'EMOM 16 – primjer', tip: 'EMOM', min: 16, lista: 'Čučanj | 15\nSklek | 8\nGlute bridge | 20\nAlpinisti | 30 s', opis: 'Svake minute jedna vježba, ostatak minute je odmor.' },
    AMRAP: { naziv: 'AMRAP 12 – primjer', tip: 'AMRAP', min: 12, lista: 'Sklek | 8\nVeslanje bučicom | 8 po strani\nPotisak za ramena | 8\nPlanka | 30 s', opis: 'Koliko krugova stigneš u zadanom vremenu.' },
    TABATA: { naziv: 'Tabata 20/10 – primjer', tip: 'TABATA', rad: 20, odmor: 10, krugova: 8, lista: 'Čučanj\nGlute bridge\nAlpinisti\nBočna planka', opis: '20 s rada, 10 s odmora, 8 rundi kroz sve vježbe.' },
    INTERVALI: { naziv: 'HIIT 40/20 – primjer', tip: 'INTERVALI', rad: 40, odmor: 20, krugova: 4, lista: 'Girja zamah\nThruster\nVeslanje u pretklonu\nBurpee\nVijača', opis: 'Rad i odmor po stanici, više krugova.' },
    CHIPPER: { naziv: 'Chipper – primjer', tip: 'CHIPPER', lista: 'Thruster | 40\nGirja zamah | 40\nStep up | 40\nBurpee | 30', opis: 'Jedan prolaz kroz listu što brže uz dobru formu.' },
    PIRAMIDA: { naziv: 'Piramida 10/8/6/4/2', tip: 'PIRAMIDA', niz: '10,8,6,4,2', lista: 'Goblet čučanj\nSklek\nVeslanje bučicom\nGlute bridge s bučicom', opis: 'Pet krugova, ponavljanja se smanjuju: 10, 8, 6, 4, 2. Odmor 60–90 s između krugova.' }
  };
  FS.KONDPRIMJERI = PRIMJERI;

  const lines = (t) => String(t || '').split('\n').map((x) => x.trim()).filter(Boolean).map((x) => x.split('|').map((y) => y.trim()));
  const n = (v, a, b, d) => { v = parseInt(v, 10); return isNaN(v) ? d : Math.max(a, Math.min(b, v)); };

  /* forma → konfiguracija tajmera */
  function build(d) {
    const L = lines(d.lista), tip = d.tip, k = { tip, nivo: d.nivo || 'srednji', oprema: String(d.oprema || '').slice(0, 80), savjet: String(d.savjet || '').slice(0, 300), opis: String(d.opis || '').slice(0, 300), formLista: String(d.lista || ''), formNiz: String(d.niz || '') };
    if (!L.length) return { err: 'Dodaj bar jednu vježbu.' };
    if (tip === 'EMOM') { k.min = n(d.min, 2, 60, 16); k.min_lista = L.map((x) => [x[0], x[1] || '']); }
    else if (tip === 'AMRAP') { k.min = n(d.min, 2, 60, 12); k.lista = L.map((x) => [x[0], x[1] || '']); }
    else if (tip === 'CHIPPER') { k.lista = L.map((x) => [x[0], x[1] || '']); }
    else if (tip === 'TABATA' || tip === 'INTERVALI') { k.stanice = L.map((x) => x[0]); k.rad = n(d.rad, 5, 300, 30); k.odmor = n(d.odmor, 3, 300, 15); k.krugova = n(d.krugova, 1, 20, 4); }
    else if (tip === 'PIRAMIDA') {
      const niz = String(d.niz || '').split(/[,\/ ]+/).filter(Boolean).slice(0, 10); if (niz.length < 2) return { err: 'Upiši niz, npr. 10,8,6,4,2.' };
      k.krugova = niz.length; k.pir = L.map((x) => [x[0], x[1] ? x[1].split(/[,\/ ]+/).filter(Boolean).slice(0, niz.length) : niz]);
      if (k.pir.some((r) => r[1].length !== niz.length)) return { err: 'Svaka vježba mora imati ' + niz.length + ' vrijednosti.' };
    }
    return { k };
  }

  const sabloni = () => (Store.db.programi || []).filter((x) => x.kond && x.tip === 'kond');

  V.kondsablon = (el, p, q) => {
    const u0 = FS.Auth.user(); if (!u0 || u0.role !== 'trener') { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    let ed = q && q.id ? Store.program(q.id) : null, tipSel = ed ? ed.kond.tip : 'EMOM';
    const ex = () => PRIMJERI[tipSel], val = () => {
      if (ed) return { naziv: ed.naziv, tip: ed.kond.tip, min: ed.kond.min, rad: ed.kond.rad, odmor: ed.kond.odmor, krugova: ed.kond.krugova, lista: ed.kond.formLista, niz: ed.kond.formNiz, opis: ed.kond.opis, oprema: ed.kond.oprema, savjet: ed.kond.savjet, nivo: ed.kond.nivo };
      return ex(); };
    const draw = (v) => {
      v = v || val(); const t = v.tip, kl = FS.Auth.users ? FS.Auth.users() : Store.db.users;
      const klij = (Store.db.users || []).filter((x) => x.role === 'klijentica');
      el.innerHTML = h`<a class="small" href="#/trener?tab=programi">← Programi</a><div class="eyebrow">Kondicija</div><h1>Kondicijski šabloni</h1>
        <p class="muted">Izaberi vrstu, izmijeni primjer, sačuvaj i dodijeli klijentici. Ona dobija tajmer koji je vodi kroz trening.</p>
        <div class="card"><form data-act="save" novalidate>
          <label class="field"><span>Vrsta treninga</span><select name="tip" data-act="tip">${opts(TIPOVI, t)}</select></label>
          <label class="field"><span>Naziv</span><input name="naziv" value="${v.naziv || ''}" maxlength="80"></label>
          ${t === 'EMOM' || t === 'AMRAP' ? h`<label class="field"><span>Trajanje (minuta)</span><input name="min" type="number" value="${v.min || ''}"></label>` : ''}
          ${t === 'TABATA' || t === 'INTERVALI' ? h`<div class="grid2"><label class="field"><span>Rad (s)</span><input name="rad" type="number" value="${v.rad || ''}"></label><label class="field"><span>Odmor (s)</span><input name="odmor" type="number" value="${v.odmor || ''}"></label></div><label class="field"><span>Broj krugova</span><input name="krugova" type="number" value="${v.krugova || ''}"></label>` : ''}
          ${t === 'PIRAMIDA' ? h`<label class="field"><span>Niz ponavljanja ili metara</span><input name="niz" value="${v.niz || ''}" placeholder="10,8,6,4,2"></label>` : ''}
          <label class="field"><span>${t === 'TABATA' || t === 'INTERVALI' ? 'Stanice (jedna po redu)' : t === 'PIRAMIDA' ? 'Vježbe (jedna po redu; opciono: naziv | drugi niz)' : 'Vježbe (naziv | ponavljanja)'}</span><textarea name="lista" rows="7">${v.lista || ''}</textarea></label>
          <label class="field"><span>Opis</span><input name="opis" value="${v.opis || ''}" maxlength="300"></label>
          <div class="grid2"><label class="field"><span>Nivo</span><select name="nivo">${opts(['početni', 'srednji', 'napredni'], v.nivo || 'srednji')}</select></label><label class="field"><span>Oprema</span><input name="oprema" value="${v.oprema || ''}" maxlength="80"></label></div>
          <label class="field"><span>Savjet za klijenticu</span><input name="savjet" value="${v.savjet || ''}" maxlength="300"></label>
          <p class="err" id="kerr"></p>
          <button class="btn primary block" type="submit">${ed ? 'Sačuvaj izmjene' : 'Sačuvaj šablon'}</button>
          ${ed ? h`<a class="btn block mt-s" href="#/kondsablon">Novi šablon</a>` : ''}</form></div>
        <h2>Sačuvani šabloni</h2>
        ${sabloni().length ? sabloni().map((s) => h`<div class="card"><div class="row between"><div><b>${s.naziv}</b><div class="small muted">${s.kond.tip}</div></div><div><a class="btn sm" href="#/kond/${s.id}">Pregled</a> <a class="btn sm" href="#/kondsablon?id=${s.id}">Uredi</a> <button class="btn sm" data-act="del" data-id="${s.id}">Obriši</button></div></div>
          <div class="row mt-s"><select data-sel="${s.id}"><option value="">Klijentica…</option>${klij.map((c) => h`<option value="${c.id}">${c.ime}</option>`)}</select><button class="btn sm primary" data-act="assign" data-id="${s.id}">Dodijeli</button></div></div>`) : h`<div class="empty">Još nema sačuvanih šablona.</div>`}`;
    };
    draw();
    const saved = () => { const f = el.querySelector('form'); return Object.assign({}, formData(f)); };
    bind(el, {
      'change:tip': (s) => { tipSel = s.value; const old = saved(); ed = null; draw(Object.assign({}, PRIMJERI[tipSel])); void old; },
      'submit:save': (f) => {
        const d = formData(f); d.tip = d.tip || tipSel; const r = build(d);
        if (r.err) { el.querySelector('#kerr').textContent = r.err; return; }
        const naziv = String(d.naziv || '').trim().slice(0, 80) || 'Kondicijski trening';
        if (ed) { ed.naziv = naziv; ed.opis = r.k.opis; ed.kond = r.k; }
        else Store.db.programi.push({ id: 'kt_' + uid(), naziv, opis: r.k.opis, nivo: r.k.nivo, sedmica: 1, dana: 1, cijena: 0, tip: 'kond', uShopu: false, samoTrener: true, dani: [{ naziv, vj: [] }], kond: r.k });
        Store.save(); toast('Šablon sačuvan.'); ed = null; tipSel = d.tip; location.hash = '#/kondsablon'; draw(Object.assign({}, PRIMJERI[tipSel]));
      },
      'click:del': async (b) => { if (!await confirmSheet({ title: 'Obrisati šablon?', text: 'Treninzi koje su klijentice već dobile ostaju kod njih.', ok: 'Obriši', danger: true })) return; Store.db.programi = Store.db.programi.filter((x) => x.id !== b.dataset.id); Store.save(); draw(); },
      'click:assign': (b) => {
        const sel = el.querySelector('[data-sel="' + b.dataset.id + '"]'), u = sel && Store.user(sel.value), src = Store.program(b.dataset.id);
        if (!u || !src) { toast('Izaberi klijenticu.'); return; }
        const cp = JSON.parse(JSON.stringify(src)); delete cp.samoTrener; cp.id = 'ind_' + uid(); cp.tip = 'individualni'; cp.vlasnik = u.id; cp.uShopu = false; cp.cijena = 0;
        Store.db.programi.push(cp); u.programi = u.programi || []; u.programi.push(cp.id); (u.dodijeljeno = u.dodijeljeno || []).push(cp.id); (u.pstart = u.pstart || {})[cp.id] = today();
        Store.save(); toast('Dodijeljeno: ' + u.ime + ' vidi trening s tajmerom.');
      }
    });
  };
})();
