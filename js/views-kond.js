/* Kondicijski treninzi (EMOM, AMRAP, intervali, Tabata, chipper) s tajmerom */
(function () {
  const FS = (window.FS = window.FS || {});
  const V = FS.views;
  const { h, icon, bind, formData, opts, toast, Store, Auth, uid, today, $ } = FS;

  const SIGURNOST = 'Kondicijski treninzi su intenzivni. Nisu za trudnoću, period nakon porođaja, dijastazu niti za osobe s tegobama srca ili zglobova bez odobrenja ljekara. Zagrij se prvo, smanji tempo ili preskoči vježbu ako ti ne odgovara, a ako osjetiš bol, vrtoglavicu ili nedostatak zraka, prekini.';
  const ZAGRIJAVANJE = 'Zagrijavanje 5 do 8 minuta: lagano hodanje ili vijača, kruženje ramenima i kukovima, 10 čučnjeva, 10 premosnica (glute bridge), 5 sklekova na koljenima.';

  /* vlastiti formati, vježbe se biraju prema opremi koju klijentica ima */
  FS.KOND = [
    { id: 'emom-girja', naziv: 'EMOM 20 – girja ili bučica', tip: 'EMOM', min: 20, nivo: 'srednji', oprema: 'Girja ili bučica',
      opis: 'Svake minute jedna vježba: odradi ponavljanja što brže, a ostatak minute je odmor. Četiri vježbe, pet krugova.',
      min_lista: [['Girja zamah (swing)', '10'], ['Goblet čučanj', '8'], ['Potisak jednom rukom iznad glave', '5 po strani'], ['Veslanje u pretklonu', '8 po strani']],
      savjet: 'Ako ne stigneš napraviti sva ponavljanja za manje od 40 sekundi, smanji težinu ili ponavljanja.' },
    { id: 'emom-tijelo', naziv: 'EMOM 16 – bez opreme', tip: 'EMOM', min: 16, nivo: 'početni', oprema: 'Bez opreme',
      opis: 'Četiri vježbe tjelesnom težinom, svaka se ponavlja jednom u četiri minute. Idealno za kuću.',
      min_lista: [['Čučanj', '15'], ['Sklek (na koljenima ako treba)', '8'], ['Glute bridge', '20'], ['Alpinisti (mountain climbers)', '30 s']],
      savjet: 'Radi čisto i kontrolisano. Preostalo vrijeme u minuti iskoristi za dah.' },
    { id: 'hiit-40-20', naziv: 'HIIT 40/20 – 5 stanica, 4 kruga', tip: 'INTERVALI', rad: 40, odmor: 20, krugova: 4, nivo: 'srednji', oprema: 'Bučice ili girja',
      opis: '40 sekundi rada, 20 sekundi prelaza na sljedeću stanicu. Jedan krug traje 5 minuta, cijeli trening 20 minuta.',
      stanice: ['Girja zamah', 'Thruster s bučicama', 'Veslanje u pretklonu', 'Burpee (bez skoka ako treba)', 'Skakanje vijače ili skakanje u mjestu'],
      savjet: 'Broj ponavljanja na svakoj stanici upiši u prvom krugu i pokušaj ga zadržati do kraja.' },
    { id: 'hiit-kuca', naziv: 'HIIT 30/30 – kućni, bez opreme', tip: 'INTERVALI', rad: 30, odmor: 30, krugova: 4, nivo: 'početni', oprema: 'Bez opreme',
      opis: 'Pola minute rada, pola minute odmora, šest stanica, četiri kruga. Blaži HIIT za početak.',
      stanice: ['Skakanje u mjestu (jumping jacks)', 'Čučanj', 'Alpinisti (mountain climbers)', 'Iskoraci unazad (naizmjenično)', 'Sklekovi na koljenima', 'Visoka koljena u mjestu'],
      savjet: 'Možeš odraditi lakšu varijantu bez skokova. Ravnomjeran tempo je bolji od početnog sprinta.' },
    { id: 'amrap-noge', naziv: 'AMRAP 15 – noge i glutei', tip: 'AMRAP', min: 15, nivo: 'srednji', oprema: 'Bučice',
      opis: 'Koliko krugova stigneš u 15 minuta. Zapiši broj krugova i pokušaj ga nadmašiti sljedeći put.',
      lista: [['Goblet čučanj', '10'], ['Iskorak u hodu', '10 po nozi'], ['Glute bridge s bučicom', '15'], ['Skok iz čučnja', '8']],
      savjet: 'Biraj težinu s kojom bez problema odradiš 15 ponavljanja.' },
    { id: 'amrap-gornji', naziv: 'AMRAP 12 – gornji dio tijela', tip: 'AMRAP', min: 12, nivo: 'početni', oprema: 'Bučice',
      opis: 'Krugovi gornjeg dijela tijela, balans uz treninge za noge i gluteuse.',
      lista: [['Sklek', '8'], ['Veslanje jednom bučicom', '8 po strani'], ['Potisak bučicama iznad glave', '8'], ['Planka', '30 s']],
      savjet: 'Kvalitet ponavljanja je važniji od broja krugova.' },
    { id: 'tabata-core', naziv: 'Tabata 20/10 – 4 bloka', tip: 'TABATA', rad: 20, odmor: 10, krugova: 8, nivo: 'srednji', oprema: 'Bez opreme',
      opis: 'Svaki blok je jedna vježba, 8 puta po 20 sekundi rada i 10 sekundi odmora (4 minute). Poslije bloka 1 minuta odmora.',
      stanice: ['Skok iz čučnja ili čučanj', 'Glute bridge', 'Alpinisti', 'Bočna planka (naizmjenično)'],
      savjet: 'Ovo je kratko, ali jako. Ne preskači zagrijavanje.' },
    { id: 'piramida-5', naziv: 'Piramida – 5 krugova (trčanje, bicikl, girja)', tip: 'PIRAMIDA', krugova: 5, nivo: 'napredni', oprema: 'Traka za trčanje, sobni bicikl, girja',
      opis: 'Svaki krug: trčanje, pa bicikl, a krug završavaš zamasima girje. Trčanje i zamasi se smanjuju iz kruga u krug, bicikl ostaje isti. Mjeri se ukupno vrijeme.',
      pir: [['Trčanje na traci', ['1500 m', '1200 m', '900 m', '600 m', '300 m']], ['Bicikl', ['1200 m', '1200 m', '1200 m', '1200 m', '1200 m']], ['Girja zamah (swing)', ['24', '20', '16', '12', '8']]],
      savjet: 'Bez trake trči vani, a bicikl možeš zamijeniti veslom ili ski ergom na istu udaljenost. Prvi krug je najduži, ne kreći prebrzo. Zapiši vrijeme pa ga pokušaj nadmašiti za 4 sedmice.' },
    { id: 'chipper', naziv: 'Chipper – na vrijeme (oko 20 min)', tip: 'CHIPPER', nivo: 'napredni', oprema: 'Bučice ili girja, klupa',
      opis: 'Jedan prolaz kroz listu od vrha do dna što brže možeš uz dobru formu. Zapiši vrijeme i ponovi za 4 sedmice.',
      lista: [['Thruster s bučicama', '40'], ['Girja zamah (swing)', '40'], ['Penjanje na klupu (step up), bučice', '40'], ['Burpee', '30'], ['Veslanje u pretklonu', '20 po strani']],
      savjet: 'Rastavi velike serije na manje prije nego ti popusti hvat ili tehnika.' }
  ];

  /* kružni treninzi, samo za trenericu */
  const KR = (id, naziv, rad, odmor, krugova, nivo, oprema, opis, stanice, savjet) => ({ id, naziv, tip: 'INTERVALI', rad, odmor, krugova, nivo, oprema, opis, stanice, savjet });
  FS.KOND.push(
    KR('krug-8-tijelo', 'Kružni 8 stanica · cijelo tijelo, bez opreme', 40, 20, 3, 'početni', 'Bez opreme', 'Osam stanica, 3 kruga, 40 s rada i 20 s prelaza. Oko 25 minuta. Odmor 2 min između krugova (dodaj ga sama po potrebi).',
      ['Čučanj', 'Sklek (na koljenima ako treba)', 'Glute bridge', 'Iskoraci unazad', 'Planka na laktovima', 'Jumping jacks', 'Dead bug', 'Bočna planka (naizmjenično)'], 'Redoslijed je napravljen da se naizmjenično opterećuju noge, gornji dio tijela i trup.'),
    KR('krug-10-bucice', 'Kružni 10 stanica · bučice', 45, 15, 3, 'srednji', 'Bučice, klupa', 'Deset stanica, 3 kruga, 45 s rada i 15 s prelaza. Oko 33 minute.',
      ['Goblet čučanj', 'Potisak bučicama (klupa ili pod)', 'Rumunsko mrtvo dizanje', 'Veslanje jednom bučicom (lijevo)', 'Iskorak u mjestu (lijeva noga)', 'Potisak iznad glave', 'Veslanje jednom bučicom (desno)', 'Iskorak u mjestu (desna noga)', 'Hip thrust s bučicom', 'Mrtva buba (dead bug)'], 'Balans: noge, potisak, veslanje, hip hinge i trup. Teret biraj tako da zadnjih 5 s svake stanice bude teško.'),
    KR('krug-12-teretana', 'Kružni 12 stanica · teretana', 40, 20, 2, 'srednji', 'Sprave, bučice, uže', 'Dvanaest stanica, 2 kruga, 40 s rada i 20 s prelaza. Oko 26 minuta. Stanice postavi po teretani da nema čekanja.',
      ['Leg press', 'Potisak s grudi na spravi', 'Veslanje na spravi', 'Čučanj s bučicom', 'Lat sprava', 'Hip thrust ili most', 'Potisak za ramena bučicama', 'Leg curl', 'Biceps s bučicama', 'Triceps na kablu', 'Planka', 'Veslački ergometar ili bicikl'], 'Prvi krug radi s malo rezerve, u drugom krugu možeš dodati težinu.'),
    KR('krug-10-kardio', 'Kružni 10 stanica · kondicija', 30, 30, 4, 'srednji', 'Bez opreme ili girja', 'Deset stanica, 4 kruga, 30 s rada i 30 s odmora. Oko 40 minuta, za dane kad hoćeš kondiciju.',
      ['Skok iz čučnja', 'Alpinisti', 'Burpee (bez skoka ako treba)', 'Skakanje vijače', 'Girja zamah', 'Visoka koljena', 'Sklek', 'Skater skokovi', 'Plank jacks', 'Penjanje na klupu'], 'Ravnomjeran tempo. Ako je prejako, skrati na 3 kruga ili prelazi na lakše varijante bez skoka.'),
    KR('krug-9-donji', 'Kružni 9 stanica · noge i gluteusi', 45, 15, 3, 'srednji', 'Bučice, guma, klupa', 'Devet stanica, 3 kruga, 45 s rada i 15 s prelaza. Oko 27 minuta.',
      ['Goblet čučanj', 'Hip thrust', 'Bugarski čučanj (lijeva)', 'Bugarski čučanj (desna)', 'Rumunsko mrtvo dizanje', 'Bočni koraci s gumom', 'Abdukcija s gumom', 'Wall sit', 'Skokovi na klupu'], 'Odmor između krugova 90 s. Ovo je volumen za noge i gluteuse.'),
    KR('krug-8-gornji', 'Kružni 8 stanica · gornji dio i trup', 40, 20, 3, 'početni', 'Bučice, guma', 'Osam stanica, 3 kruga, 40 s rada i 20 s prelaza. Oko 24 minute.',
      ['Sklek', 'Veslanje s gumom', 'Potisak za ramena bučicama', 'Face pull s gumom', 'Biceps s bučicama', 'Triceps iza glave', 'Planka s dodirom ramena', 'Superman'], 'Balans potiska i povlačenja: 3 potiska i 3 povlačenja, uz trup.')
  );
  FS.kond = (id) => FS.KOND.find((k) => k.id === id);
  const jeTrener = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const vid = () => FS.KOND.filter((k) => !k.samoTrener || jeTrener());

  /* pretvara trening u listu segmenata za tajmer */
  function segments(k) {
    const S = [];
    if (k.tip === 'EMOM') {
      const n = k.min_lista.length;
      for (let m = 0; m < k.min; m++) { const [nm, r] = k.min_lista[m % n]; S.push({ dur: 60, kind: 'rad', title: nm, sub: r, tag: `Minuta ${m + 1} od ${k.min}`, next: (k.min_lista[(m + 1) % n] || [''])[0] }); }
    } else if (k.tip === 'INTERVALI') {
      for (let r = 0; r < k.krugova; r++) k.stanice.forEach((st, i) => {
        S.push({ dur: k.rad, kind: 'rad', title: st, sub: `${k.rad} s rada`, tag: `Krug ${r + 1}/${k.krugova} · stanica ${i + 1}/${k.stanice.length}`, next: k.stanice[(i + 1) % k.stanice.length] });
        const last = r === k.krugova - 1 && i === k.stanice.length - 1;
        if (!last) S.push({ dur: k.odmor, kind: 'odmor', title: 'Odmor', sub: 'Prelaz na: ' + k.stanice[(i + 1) % k.stanice.length], tag: `Krug ${r + 1}/${k.krugova}`, next: k.stanice[(i + 1) % k.stanice.length] });
      });
    } else if (k.tip === 'TABATA') {
      k.stanice.forEach((st, b) => {
        for (let r = 0; r < k.krugova; r++) {
          S.push({ dur: k.rad, kind: 'rad', title: st, sub: `${k.rad} s rada`, tag: `Blok ${b + 1}/${k.stanice.length} · runda ${r + 1}/${k.krugova}`, next: st });
          if (r < k.krugova - 1) S.push({ dur: k.odmor, kind: 'odmor', title: 'Odmor', sub: st, tag: `Blok ${b + 1}/${k.stanice.length}`, next: st });
        }
        if (b < k.stanice.length - 1) S.push({ dur: 60, kind: 'odmor', title: 'Odmor između blokova', sub: 'Sljedeći: ' + k.stanice[b + 1], tag: `Blok ${b + 1}/${k.stanice.length}`, next: k.stanice[b + 1] });
      });
    } else if (k.tip === 'AMRAP') {
      S.push({ dur: k.min * 60, kind: 'rad', title: 'AMRAP ' + k.min + ' min', sub: 'Dodirni "+ krug" kad završiš cijeli krug', tag: 'Što više krugova', next: '', amrap: true });
    } else if (k.tip === 'CHIPPER' || k.tip === 'PIRAMIDA') {
      S.push({ dur: 0, kind: 'rad', title: 'Na vrijeme', sub: k.tip === 'PIRAMIDA' ? 'Dodirni "Krug gotov" poslije svakog kruga' : 'Pritisni "Gotovo" kad završiš listu', tag: 'Štoperica', next: '', up: true });
    }
    return S;
  }

  const fmt = (s) => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  const total = (S) => S.reduce((a, x) => a + x.dur, 0);

  let ac = null;
  function beep(f, ms) {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = f; g.gain.value = 0.08; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + ms / 1000);
    } catch (e) { /* zvuk nije dostupan */ }
  }
  const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignoriši */ } };

  const canKond = () => { const u = FS.Auth.user(); return !!u; };
  const lockCard = () => h`<div class="card note"><div class="row"><div class="grow">Treninzi s tajmerom su dostupni klijenticama. Prijavi se ili se javi trenerici za pristup.</div></div><a class="btn primary block mt-s" href="#/prijava">Prijava</a> <a class="btn block mt-s" href="#/paketi">Online coaching paketi</a></div>`;
  V.kondicija = (el) => {
    el.innerHTML = h`<div class="eyebrow">Kondicija</div><h1>Intenzivni treninzi</h1>
      <p class="muted">EMOM, HIIT, AMRAP, Tabata i chipper. Svaki trening ima tajmer koji te vodi kroz vježbe, a rezultat možeš sačuvati.</p>
      ${canKond() ? h`<div class="card note">${SIGURNOST}</div>` : lockCard()}
      ${vid().map((k) => h`<a class="card" href="${canKond() ? '#/kond/' + k.id : '#/prijava'}" style="display:block"><div class="row between"><h3 style="margin:0">${k.naziv}</h3><span class="badge">${k.tip}${k.samoTrener ? ' · samo ti' : ''}</span></div><div class="small mt-s">${k.nivo} · ${k.oprema}</div><p class="muted mt-s" style="margin-bottom:0">${canKond() ? k.opis : ''}</p></a>`)}`;
  };

  V.kond = (el, p) => {
    if (!canKond()) { el.innerHTML = h`<h1>Kondicija</h1>${lockCard()}`; return; }
    const k = FS.kond(p.id);
    if (!k || (k.samoTrener && !jeTrener())) { el.innerHTML = h`<div class="empty">Trening nije pronađen.</div><a class="btn block" href="#/kondicija">Kondicija</a>`; return; }
    const S = segments(k), u = Auth.user();
    const lista = k.min_lista || k.lista || (k.stanice || []).map((x) => [x, '']);
    const pir = k.tip === 'PIRAMIDA';
    let i = -1, left = 0, elapsed = 0, running = false, timer = null, rounds = 0, started = false, done = false, wake = null, lastTick = 0;

    const draw = () => {
      const seg = S[Math.max(0, i)] || S[0];
      el.innerHTML = h`<div class="eyebrow">${k.tip} · ${k.nivo} · ${k.oprema}</div><h1>${k.naziv}</h1><p class="muted">${k.opis}</p>
        <div class="card" id="tcard" style="text-align:center">
          <div class="small" id="ttag">${started ? seg.tag : 'Spremna?'}</div>
          <div id="ttime" style="font-family:var(--serif);font-size:64px;line-height:1.1;margin:6px 0">${started ? (seg.up ? fmt(elapsed) : fmt(left)) : (seg.up ? '00:00' : fmt(total(S)))}</div>
          <div id="ttitle" style="font-size:20px"><b>${started ? seg.title : 'Ukupno ' + (seg.up ? 'na vrijeme' : fmt(total(S)))}</b></div>
          <div class="small" id="tsub">${started ? seg.sub : ''}</div>
          <div class="small mt-s" id="tnext">${started && seg.next ? 'Sljedeće: ' + seg.next : ''}</div>
          ${started ? h`<div class="progress mt-s"><i id="tbar" style="width:0%"></i></div>` : ''}
          ${pir && started && !done ? h`<div class="card flat mt-s" style="margin-bottom:0"><b>Krug ${Math.min(rounds + 1, k.krugova)} od ${k.krugova}</b>${k.pir.map(([nm, v]) => h`<div class="kv"><span>${nm}</span><b>${v[Math.min(rounds, k.krugova - 1)]}</b></div>`)}</div>` : ''}
          ${k.tip === 'AMRAP' && started ? h`<div class="row mt-s" style="justify-content:center"><button class="btn" data-act="rm">−</button><b style="font-size:22px;min-width:120px">Krugova: ${rounds}</b><button class="btn primary" data-act="rp">+ krug</button></div>` : ''}
          <div class="row mt" style="justify-content:center">
            ${done ? '' : (running ? h`<button class="btn" data-act="pause">Pauza</button>` : h`<button class="btn primary" data-act="start">${started ? 'Nastavi' : 'Start'}</button>`)}
            ${k.tip === 'CHIPPER' && running ? h`<button class="btn primary" data-act="fin">Gotovo</button>` : ''}
            ${pir && running ? h`<button class="btn primary" data-act="rnd">${rounds + 1 >= k.krugova ? 'Završi' : 'Krug gotov'}</button>` : ''}
            ${started && !done ? h`<button class="btn" data-act="reset">Ispočetka</button>` : ''}</div></div>
        <div class="card"><h3>${k.tip === 'INTERVALI' || k.tip === 'TABATA' ? 'Stanice' : (pir ? 'Piramida' : 'Vježbe')}</h3>
          ${pir ? '' : h`<ol class="steps">${lista.map(([nm, r]) => h`<li><span><b>${nm}</b>${r ? ' · ' + r : ''}</span></li>`)}</ol>`}
          ${pir ? h`<table class="mt-s" style="width:100%;font-size:14px;border-collapse:collapse"><tr><th></th>${[1, 2, 3, 4, 5].map((n) => h`<th>${n}</th>`)}</tr>${k.pir.map(([nm, v]) => h`<tr><td><b>${nm}</b></td>${v.map((x) => h`<td style="text-align:center">${x}</td>`)}</tr>`)}</table>` : ''}
          ${k.tip === 'INTERVALI' ? h`<p class="small">${k.rad} s rada, ${k.odmor} s odmora, ${k.krugova} kruga.</p>` : ''}</div>
        <div class="card"><h3>Savjet</h3><p style="margin:0">${k.savjet}</p></div>
        <div class="card"><h3>Zagrijavanje</h3><p style="margin:0">${ZAGRIJAVANJE}</p></div>
        <div class="card note">${SIGURNOST}</div>
        ${done ? h`<div class="card"><h3>Rezultat</h3>${u && u.role === 'klijentica' ? h`<form data-act="save" novalidate>
          <label class="field"><span>Rezultat</span><input name="r" value="${k.tip === 'AMRAP' ? rounds + ' krugova' : (k.tip === 'CHIPPER' || pir ? fmt(elapsed) : 'odrađeno')}" maxlength="60"></label>
          <label class="field"><span>Napor (RPE 1–10)</span><select name="rpe">${opts([['', '–'], ...Array.from({ length: 10 }, (_, n) => String(n + 1))], '')}</select></label>
          <button class="btn primary block" type="submit">Sačuvaj u treninge</button></form>` : h`<p class="muted">Prijavi se kao klijentica da sačuvaš rezultat.</p>`}</div>` : ''}`;
    };

    const stop = () => { clearInterval(timer); timer = null; if (wake) { try { wake.release(); } catch (e) { /* ignoriši */ } wake = null; } };
    FS.onLeave(stop);

    const setSeg = (n) => {
      i = n;
      if (i >= S.length) { finish(); return; }
      left = S[i].dur; lastTick = 0;
      beep(S[i].kind === 'rad' ? 880 : 520, 220); buzz(S[i].kind === 'rad' ? 200 : 80);
      if (!S[i].up) paint(true);
      draw();
    };
    const finish = () => { stop(); running = false; done = true; beep(660, 500); buzz(400); draw(); };
    const paint = () => {
      const seg = S[i]; if (!seg) return;
      const t = $('#ttime', el); if (t) t.textContent = seg.up ? fmt(elapsed) : fmt(left);
      const bar = $('#tbar', el); if (bar && seg.dur) bar.style.width = Math.min(100, ((seg.dur - left) / seg.dur) * 100) + '%';
    };
    const tick = () => {
      const seg = S[i]; if (!seg) return;
      if (seg.up) { elapsed += 1; paint(); return; }
      left -= 1;
      if (left <= 3 && left > 0) beep(700, 80);
      if (left <= 0) { setSeg(i + 1); return; }
      paint();
    };
    const begin = async () => {
      if (!started) { started = true; setSeg(0); } else draw();
      running = true; draw(); stop(); timer = setInterval(tick, 1000);
      try { if (navigator.wakeLock) wake = await navigator.wakeLock.request('screen'); } catch (e) { /* ignoriši */ }
    };
    draw();
    bind(el, {
      'click:start': () => { begin(); },
      'click:pause': () => { stop(); running = false; draw(); },
      'click:reset': () => { stop(); i = -1; running = false; started = false; done = false; rounds = 0; elapsed = 0; draw(); },
      'click:rp': () => { rounds += 1; draw(); },
      'click:rm': () => { rounds = Math.max(0, rounds - 1); draw(); },
      'click:fin': () => { finish(); },
      'click:rnd': () => { rounds += 1; beep(660, 150); buzz(100); if (rounds >= k.krugova) finish(); else draw(); },
      'submit:save': (f) => {
        const d = formData(f);
        Store.db.logs.push({ id: uid(), userId: u.id, datum: today(), programId: 'kond:' + k.id, dan: k.naziv, trajanje: Math.max(1, Math.round((k.tip === 'CHIPPER' || k.tip === 'PIRAMIDA' ? elapsed : (k.min ? k.min * 60 : total(S))) / 60)), rpe: d.rpe ? +d.rpe : null, biljeska: '', kond: String(d.r || '').slice(0, 60), vjezbe: [] });
        Store.save(); toast('Rezultat je sačuvan.'); location.hash = '#/moj?tab=trening';
      }
    });
  };
})();
