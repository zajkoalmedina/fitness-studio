/* Zagrijavanje: vođene rutine s tajmerom + podsjetnik u programima i treningu */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, bind, $ } = FS;
  const V = (FS.views = FS.views || {});

  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  FS.ZAGR = [
    { id: 'cft', naziv: 'Opće zagrijavanje po CFT 1 i 2', min: 14, za: 'Od ležećeg položaja ka stojećem: mobilnost, klečeći, potkoljenice, stojeći', vj: [
      ['LEŽEĆI · Koljena na prsa, kružno', 40, 'Ležeći na leđima, ruke oko koljena, mali krugovi za donja leđa.'], ['LEŽEĆI · Rotacija kukova (brisači, windshield)', 45, 'Koljena savijena, spuštaj ih lijevo–desno, ramena na podu.'], ['LEŽEĆI · Glute bridge', 40, '10–12 ponavljanja, stisni gluteuse.'], ['LEŽEĆI · Dead bug', 40, 'Donja leđa na podu, sporo.'],
      ['MOBILNOST · Mačka–krava', 45, 'Na sve četiri, kičma kroz cijeli raspon.'], ['MOBILNOST · Rotacija grudnog dijela (otvorena knjiga)', 60, 'Po 30 s na stranu, pogled prati ruku.'], ['MOBILNOST · Bird dog', 40, 'Naizmjenično ruka–noga, bez ljuljanja zdjelice.'],
      ['KLEČEĆI · Istezanje pregibača kuka (half-kneeling)', 60, 'Po 30 s na stranu, zdjelica podvučena.'], ['KLEČEĆI · Sjedenje na petama i dizanje (kneeling squat)', 40, 'Kontrolisano, ispravi kukove na vrhu.'],
      ['POTKOLJENICE · Koljeno ka zidu (gležanj)', 60, 'Po 30 s na stranu, peta na podu.'], ['POTKOLJENICE · Podizanje prstiju (tibialis)', 30, 'Leđa uz zid, 15–20 ponavljanja.'], ['POTKOLJENICE · Podizanje na prste (listovi)', 30, '15 ponavljanja, spuštaj sporo.'],
      ['STOJEĆI · Zamasi nogom naprijed–nazad i bočno', 60, 'Po 15 s na stranu u oba smjera.'], ['STOJEĆI · Inchworm sa sklekom', 45, 'Hodaj rukama u plank pa nazad.'], ['STOJEĆI · Kruženje ramenima i rukama', 30, 'Veliki krugovi, naprijed i nazad.'], ['STOJEĆI · Čučanj tjelesnom težinom (prazna šipka ako treba)', 40, '10 ponavljanja, pun raspon.'], ['PULS · Jumping jacks ili lagano skakanje', 40, 'Podigni puls prije glavnog dijela.']] },
    { id: 'opce', naziv: 'Opće zagrijavanje', min: 6, za: 'Prije bilo kojeg treninga', vj: [
      ['Lagano hodanje ili marš u mjestu', 60, 'Podigni puls, diši mirno.'], ['Kruženje ramenima', 30, 'Naprijed pa nazad.'], ['Kruženje kukovima', 30, 'Veliki, spori krugovi.'],
      ['Mačka–krava', 40, 'Na sve četiri, savijaj i izvijaj kičmu.'], ['Svjetski najbolji istezaj (lunge s rotacijom)', 60, 'Po 30 s na svaku stranu.'], ['Čučanj tjelesnom težinom', 40, 'Kontrolisano, 10–12 ponavljanja.'], ['Glute bridge', 40, '10–12 ponavljanja.'], ['Čučanj s rukama iznad glave i širenje grudi', 40, 'Otvori prsa, ruke iznad glave.']] },
    { id: 'noge', naziv: 'Noge i gluteusi', min: 8, za: 'Čučanj, mrtvo dizanje, hip thrust, iskoraci', vj: [
      ['Lagano hodanje ili sobni bicikl', 120, 'Pulz oko 60 % maksimalnog.'], ['Kruženje kukovima', 30, 'Po 15 s u svaku stranu.'], ['Zamasi nogom naprijed–nazad', 60, 'Po 30 s na nogu, držeći se za oslonac.'], ['Bočni zamasi nogom', 60, 'Po 30 s na nogu.'],
      ['Bočni koraci s gumom', 40, 'Guma iznad koljena.'], ['Glute bridge', 40, 'Stisni gluteuse gore.'], ['Čučanj tjelesnom težinom (spori)', 40, '3 s dolje, 1 s gore.'], ['Prvih 1–2 serije glavne vježbe sa lakim teretom', 0, 'Rampa: 50 %, pa 70 %, pa radna težina.']] },
    { id: 'gornji', naziv: 'Gornji dio tijela', min: 6, za: 'Potisci, veslanja, zgibovi, ramena', vj: [
      ['Kruženje rukama', 40, 'Naprijed i nazad.'], ['Rotacija grudnog dijela (otvorena knjiga)', 60, 'Ležeći na boku, po 30 s.'], ['Guma za ramena: razmicanje i veslanje', 60, '15 ponavljanja svakog.'], ['Face pull s gumom', 40, '12–15 ponavljanja.'],
      ['Sklek uz zid ili na koljenima', 40, '10 sporih ponavljanja.'], ['Plank s dodirom ramena', 40, 'Bez ljuljanja kukova.'], ['Prvih 1–2 serije glavne vježbe sa lakim teretom', 0, 'Rampa: 50 %, pa 70 %, pa radna težina.']] },
    { id: 'kondicija', naziv: 'Kondicija, HIIT i kružni', min: 7, za: 'EMOM, AMRAP, Tabata, kružni trening', vj: [
      ['Lagano hodanje ili trčanje u mjestu', 90, 'Postepeno ubrzaj.'], ['Jumping jacks (lakše)', 40, 'Bez skoka ako treba.'], ['Visoka koljena', 30, 'Ravan trup.'], ['Pete ka gluteusima', 30, 'Lagani tempo.'],
      ['Čučanj + istezanje rukama', 40, 'Ruke gore pri usponu.'], ['Skater korak (lagano)', 40, 'Bočno, bez skoka.'], ['Alpinisti (sporo)', 30, 'Ravna leđa.'], ['Kratki ubrzani dio', 20, 'Zadnja stanica kao priprema.']] },
    { id: 'plio', naziv: 'Pliometrija i maksimalna snaga', min: 12, za: 'Skokovi, Conjugate, teški čučanj i mrtvo dizanje', vj: [
      ['Lagano kardio (bicikl ili veslo)', 180, 'Do blagog znojenja.'], ['Mobilnost kukova (90/90 ili duboki čučanj)', 90, 'Pomjeri kukove kroz puni raspon.'], ['Aktivacija gluteusa: bridge s gumom', 60, '15 ponavljanja, stisak 2 s.'], ['Zamasi nogom', 60, 'Po 30 s na nogu.'],
      ['Dinamička fleksibilnost gležnjeva (koljeno ka zidu)', 40, 'Po 20 s na nogu.'], ['Skokovi u mjestu (mali, meki doskoci)', 40, 'Doskoči tiho, koljena prate stopala.'], ['Čučanj sa skokom (lagani)', 30, '5 ponavljanja.'], ['Rampa na glavnoj vježbi: 40 %, 60 %, 75 %', 0, 'Samo 1–3 ponavljanja po koraku.']] }
  ];
  const tot = (z) => z.vj.reduce((a, x) => a + x[1], 0);
  const fmt = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  let ac = null;
  const beep = (f) => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.08; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + 0.15); } catch (e) { /* bez zvuka */ } };

  const card = (z) => h`<a class="card" href="#/zagrijavanje?r=${z.id}" style="display:block"><div class="row between"><h3 style="margin:0">${z.naziv}</h3><span class="badge">${z.min} min</span></div><div class="small muted mt-s">${z.za}</div></a>`;

  V.zagrijavanje = (el, p, q) => {
    q = q || {};
    if (!jeT()) { el.innerHTML = h`<h1>Zagrijavanje</h1><p class="muted">Dostupno samo trenerici.</p>`; return; }
    const z = FS.ZAGR.find((x) => x.id === q.r);
    if (!z) {
      el.innerHTML = h`<div class="eyebrow">Prije treninga</div><h1>Zagrijavanje</h1>
        <p class="muted">Uvijek 5–12 minuta prije treninga. Izaberi rutinu prema treningu koji slijedi, a tajmer te vodi vježbu po vježbu.</p>
        <div class="card note">Zagrijavanje podiže temperaturu mišića, smanjuje rizik od povrede i poboljšava kvalitetu prvih serija. Poslije njega slijedi rampa na glavnoj vježbi (lagani teret, pa sve teže).</div>
        ${FS.ZAGR.map(card)}`;
      return;
    }
    let i = -1, left = 0, run = false, timer = null;
    const draw = () => {
      const x = z.vj[Math.max(0, i)], fin = i >= z.vj.length;
      el.innerHTML = h`<div class="eyebrow">Zagrijavanje · ${z.min} min</div><h1>${z.naziv}</h1><p class="muted">${z.za}</p>
        <div class="card" style="text-align:center">
          <div class="small">${i < 0 ? 'Spremna?' : fin ? 'Gotovo' : 'Vježba ' + (i + 1) + ' od ' + z.vj.length}</div>
          <div style="font-family:var(--serif);font-size:64px;line-height:1.1;margin:6px 0">${i < 0 ? fmt(tot(z)) : fin ? '✓' : (x[1] ? fmt(left) : '–')}</div>
          <div style="font-size:20px"><b>${i < 0 ? 'Ukupno ' + z.min + ' min' : fin ? 'Možeš na trening' : x[0]}</b></div>
          <div class="small">${i >= 0 && !fin ? x[2] : ''}</div>
          <div class="small mt-s">${i >= 0 && !fin && z.vj[i + 1] ? 'Sljedeće: ' + z.vj[i + 1][0] : ''}</div>
          <div class="row mt" style="justify-content:center">
            ${fin ? h`<a class="btn primary" href="#/zagrijavanje">Sve rutine</a>` : h`${run ? h`<button class="btn" data-act="pause">Pauza</button>` : h`<button class="btn primary" data-act="start">${i < 0 ? 'Start' : 'Nastavi'}</button>`}${i >= 0 ? h`<button class="btn" data-act="next">Dalje</button>` : ''}`}</div></div>
        <div class="card"><h3>Vježbe</h3><ol class="steps">${z.vj.map((v, k) => h`<li><span><b>${v[0]}</b>${v[1] ? ' · ' + v[1] + ' s' : ''}<div class="small muted">${v[2]}</div></span></li>`)}</ol></div>
        <a class="btn block mb" href="#/zagrijavanje">Druge rutine</a>`;
    };
    const stop = () => { run = false; clearInterval(timer); timer = null; };
    const go = (n) => { i = n; if (i < z.vj.length) { left = z.vj[i][1]; beep(880); } else { stop(); beep(520); } draw(); };
    const tick = () => { if (!run) return; if (z.vj[i] && z.vj[i][1] === 0) return; left--; if (left <= 0) { go(i + 1); if (i < z.vj.length) tick0(); } else { const t = document.querySelector('#zt'); draw(); } };
    const tick0 = () => { if (!timer) timer = setInterval(tick, 1000); };
    draw();
    bind(el, {
      'click:start': () => { run = true; if (i < 0) go(0); else draw(); tick0(); },
      'click:pause': () => { stop(); draw(); },
      'click:next': () => { const r = run; go(i + 1); if (r && i < z.vj.length) { run = true; tick0(); } }
    });
    const obs = new MutationObserver(() => { if (!document.body.contains(el) || !el.querySelector('h1')) { stop(); obs.disconnect(); } });
    obs.observe(el, { childList: true });
  };

  /* podsjetnik u detalju programa i novog treninga */
  const hint = '<a class="card" href="#/zagrijavanje" style="display:block"><b>Zagrijavanje prije treninga</b><div class="small muted">Vođene rutine s tajmerom (5–12 min)</div></a>';
  ['program', 'trening_novi'].forEach((k) => {
    const f = V[k]; if (!f) return;
    V[k] = (el, p, q) => { const r = f(el, p, q); const u = FS.Auth.user(); if (u && u.role === 'trener') { const h1 = el.querySelector('h1'); if (h1 && h1.parentNode === el) { const nx = h1.nextElementSibling; (nx || h1).insertAdjacentHTML('afterend', hint); } } return r; };
  });
  const prog0 = V.programi;
  if (prog0) V.programi = (el, p, q) => { const r = prog0(el, p, q); const h1 = el.querySelector('h1'); if (jeT() && h1 && h1.parentNode === el) h1.insertAdjacentHTML('afterend', hint); return r; };
  const alati2 = V.alati;
  V.alati = (el, p, q) => { alati2(el, p, q); if (jeT()) el.insertAdjacentHTML('beforeend', h`<a class="card" href="#/zagrijavanje" style="display:block"><b>Zagrijavanje</b><div class="small muted">Rutine s tajmerom za noge, gornji dio, kondiciju i snagu</div></a>`.s); };
})();
