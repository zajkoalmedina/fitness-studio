/* Trčanje: Cooperov test + intervali, fartlek i tempo po nivoima (Ready, Steady, Go) iz planova za polumaraton */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h } = FS;
  const NIV = [['Ready', 'početni'], ['Steady', 'srednji'], ['Go', 'napredni']];

  /* ---------- Cooperov test ---------- */
  const W = [
    ['Sedmica 1', ['Probni test 12 min (zapiši udaljenost)', 'Probni test 12 min (zapiši udaljenost)', 'Probni test 12 min (zapiši udaljenost)'], ['6 min', '10 min', '15 min'], ['20 min', '25 min', '30 min']],
    ['Sedmica 2', ['5 × 3 min trčanje / 1 min hod', '5 × 3 min brže / 2 min lagano', '6 × 3 min brže / 90 s lagano'], ['8 min', '12 min', '18 min'], ['20 min', '25 min', '35 min']],
    ['Sedmica 3', ['4 × 4 min trčanje / 1 min hod', '4 × 4 min brže / 2 min lagano', '5 × 4 min brže / 2 min lagano'], ['10 min', '15 min', '20 min'], ['25 min', '30 min', '40 min']],
    ['Sedmica 4', ['4 × 4 min trčanje / 1 min hod', '3 × 5 min brže / 2 min lagano', '4 × 5 min brže / 2 min lagano'], ['12 min', '18 min', '25 min'], ['25 min', '30 min', '40 min']],
    ['Sedmica 5', ['3 × 5 min trčanje / 1 min hod', '2 × 6 min brže / 3 min lagano', '3 × 6 min brže / 2 min lagano'], ['14 min', '20 min', '25 min'], ['30 min', '35 min', '45 min']],
    ['Sedmica 6 · lakša', ['4 × 1 min brže / 2 min hod', '4 × 1 min brzo / 2 min lagano', '5 × 1 min brzo / 2 min lagano'], ['8 min', '10 min', '12 min'], ['COOPEROV TEST', 'COOPEROV TEST', 'COOPEROV TEST']]
  ];
  const coop = () => h`
    <div class="eyebrow">Trčanje</div><h1>Cooperov test</h1>
    <div class="card note"><b>Šta je to?</b><p class="muted mt-s" style="margin:0">Trčiš 12 minuta i mjeriš koliko si metara pretrčala. Test pokazuje aerobnu kondiciju (izdržljivost). Radi se na početku i na kraju priprema, pa vidiš svoj napredak. Rezultat poredi samo sa vlastitim prethodnim testom.</p></div>
    <div class="card"><h3>Kako se radi, korak po korak</h3>
      <ol class="steps"><li><b>Odaberi ravnu podlogu.</b> Atletska staza je najbolja (jedan krug je 400 m). Može i ravna staza uz sat s GPS-om.</li>
      <li><b>Zagrij se 8 do 10 minuta:</b> lagano hodanje i trčanje, kruženja kukovima i ramenima, 3 ubrzanja po 20 sekundi.</li>
      <li><b>Kreni ravnomjerno.</b> Prve 2 minute ne trči prebrzo, jer ćeš se brzo umoriti.</li>
      <li><b>Trči 12 minuta bez zaustavljanja.</b> Ako moraš, hodaj, ali sat ne zaustavljaj. Zadnju minutu ubrzaj koliko možeš.</li>
      <li><b>Zabilježi udaljenost</b> u metrima odmah po završetku.</li>
      <li><b>Hlađenje 5 minuta:</b> lagano hodanje i istezanje nogu.</li></ol></div>
    <form class="card" data-act="coop" novalidate><h3>Procjena kondicije</h3><p class="muted small">Upiši pređenu udaljenost u metrima.</p>
      <label class="field"><span>Udaljenost u 12 min (m)</span><input name="d" inputmode="numeric" placeholder="npr. 2000"></label><p class="err" id="cerr" hidden></p>
      <button class="btn primary block" type="submit">Izračunaj</button><div id="cout" class="mt-s"></div></form>
    <form class="card" data-act="puls" novalidate><h3>Pulsne zone za trening</h3><p class="muted small">Puls pokazuje koliko ti je napor stvarno težak. Upiši godine i puls u mirovanju (izmjeri ujutro, prije ustajanja, 1 min). Ako znaš najviši puls izmjeren na kraju testa ili intervala, upiši ga.</p>
      <div class="grid3"><label class="field"><span>Godine</span><input name="g" inputmode="numeric" placeholder="npr. 35"></label><label class="field"><span>Puls u mirovanju</span><input name="r" inputmode="numeric" placeholder="npr. 62"></label><label class="field"><span>Najviši puls (ne mora)</span><input name="m" inputmode="numeric" placeholder="npr. 185"></label></div><p class="err" id="perr2" hidden></p>
      <button class="btn primary block" type="submit">Izračunaj zone</button><div id="pzone" class="mt-s"></div></form>
    <div class="card"><h3>Raspored sedmice (6 sedmica)</h3><p class="small">Teretana 2 puta, trčanje 3 puta, najmanje jedan dan odmora.</p>
      ${[['Ponedjeljak', 'Trčanje: intervali'], ['Utorak', 'Teretana A: gornji dio tijela i trup'], ['Srijeda', 'Trčanje: tempo'], ['Četvrtak', 'Teretana B: noge i gluteus (umjereno, ne do otkaza)'], ['Petak', 'Odmor'], ['Subota', 'Trčanje: dugo, lagano'], ['Nedjelja', 'Odmor ili šetnja']].map(([d, t]) => h`<div class="kv"><span>${d}</span><b>${t}</b></div>`)}</div>
    <h3>Plan po sedmicama i nivoima</h3>
    <p class="small muted">Nivo biraš prema trčanju: <b>početni</b> ne trči 12 min bez zaustavljanja, <b>srednji</b> trči 20 do 30 min lagano, <b>napredni</b> trči redovno 30 min i više.</p>
    ${W.map(([nz, iv, tm, lg], wi) => h`<details class="card" ${wi === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:18px">${nz}</b></summary>
      ${NIV.map(([en, bs], i) => h`<div class="card flat" style="margin:8px 0 0"><div class="eyebrow">${bs}</div>
        <div class="kv"><span>Intervali</span><b>${iv[i]}</b></div><div class="kv"><span>Tempo</span><b>${tm[i]}</b></div><div class="kv"><span>Dugo lagano</span><b>${lg[i]}</b></div></div>`)}</details>`)}
    <div class="card"><h3>Napor i pravila</h3><ul class="dots"><li><b>Lagano:</b> možeš razgovarati, napor 5 do 6 od 10.</li><li><b>Tempo:</b> ravnomjerno i ugodno teško, napor 7 od 10, bez zaustavljanja. Prije i poslije 5 min lagano.</li><li><b>Brže u intervalima:</b> tempo kojim planiraš trčati test, ne sprint (napor 7 do 8 od 10).</li><li>U zadnjoj sedmici u teretani smanji serije i ne radi drop set ni do otkaza.</li><li>Ako ne uspiješ završiti trening, ponovi tu sedmicu još jednom.</li><li>Test radi samo zdrava osoba. Ako imaš tegobe sa srcem, zglobovima ili si dugo bila neaktivna, prvo pitaj ljekara.</li></ul></div>`;

  /* ---------- intervali, fartlek, tempo ---------- */
  const D = '—';
  const T = [
    { naz: 'Intervali (I)', sta: 'Ponavljane brze dionice (npr. 300 do 1500 m) između kojih je lagan oporavak.', kako: 'Zagrijavanje (WU), pa serija brzih dionica, a između njih lagano trčanje ili hod. Na kraju hlađenje (CD). Zadnja dionica treba biti jednako brza kao prva, ne brža od prve.', napor: '8 od 10 na brzim dionicama, oporavak lagan.', zasto: 'Podiže brzinu i VO₂max, a to najviše pomaže u Cooperovom testu.', s: [
      ['Kratki', ['1,5 km WU, 8 × 300 m I (100 m lagano), 1,5 km CD', '1,5 km WU, 10 × 300 m I (100 m lagano), 1,5 km CD', '2 km WU, 10 × 400 m I, 2 km CD']],
      ['Mješoviti', ['1,5 km WU, 3 × 800 m + 3 × 400 m I (2 min lagano), 1,5 km CD', '1,5 km WU, 3 × 800 m + 3 × 400 m I (2 min lagano), 1,5 km CD', '2 km WU, 3 × 1000 m + 3 × 500 m I, 2 km CD']],
      ['Dugi', ['1,5 km WU, 6 × 600 m (2 min lagano), 1,5 km CD', '1,5 km WU, 6 × 600 m (2 min lagano), 1,5 km CD', '2 km WU, 3 × 1500 m, 2 km CD']],
      ['Brzi 150 m', ['2 km WU, 10 × 150 m I (150 m lagano), 2 km CD', '2 km WU, 10 × 150 m I (150 m lagano), 2 km CD', '2 km WU, 6 × 800 m I, 2 km CD']],
      ['Piramida', ['1,5 km WU, 1000-600-200-600-1000 I (2 min pauza), 1,5 km CD', '1,5 km WU, 1000-600-200-600-1000 I (2 min pauza), 1,5 km CD', '2 km WU, 1200-800-400-800-1200 I, 2 km CD']],
      ['1200 m', ['1,5 km WU, 3 × 1200 m I (3 min lagano), 1,5 km CD', '1,5 km WU, 3 × 1200 m I (3 min lagano), 1,5 km CD', D]],
      ['500 m', ['1,5 km WU, 6 × 500 m I (200 m lagano), 1,5 km CD', '1,5 km WU, 6 × 500 m I (200 m lagano), 1,5 km CD', D]],
      ['400 m', [D, D, '2 km WU, 11 × 400 m, 2 km CD']]
    ] },
    { naz: 'Ponavljanja uzbrdo', sta: 'Kratki brzi usponi od oko 150 m uz strmu, ali sigurnu dionicu.', kako: 'Trči uzbrdo snažno, ne sprintom, a nazad se vraćaj hodom. 2,5 km zagrijavanja i hlađenja.', napor: '8 od 10 uzbrdo, povratak hodom.', zasto: 'Jača noge i gluteus, popravlja tehniku trčanja i snagu odraza.', s: [
      ['10 × 150 m', ['2,5 km WU, 10 × 150 m uzbrdo I, 2,5 km CD', '2,5 km WU, 10 × 150 m uzbrdo I, 2,5 km CD', '2,5 km WU, 10 × 150 m uzbrdo I, 2,5 km CD']]
    ] },
    { naz: 'Fartlek', sta: 'Švedski izraz za „igru brzinom“: brže i sporije dionice mijenjaš bez strogih mjerenja udaljenosti.', kako: 'Zagrijavanje 10 min, pa izmjena brže i lagane dionice po vremenu, pa 10 min hlađenja. Brže dionice su ugodno teške.', napor: '7 do 8 od 10 na bržim dionicama.', zasto: 'Najlakši način da se privikneš na intenzivniji rad. Dobar prvi korak prije pravih intervala.', s: [
      ['Minute', ['10 min WU, 6 × (3 / 1) min, 10 min CD', '10 min WU, 6 × (3 / 1) min, 10 min CD', 'Easy 8 km']],
      ['Sekunde', ['10 min WU, (30/90, 30/75, 30/60, 30/45, 30/30, 30/15 s) × 2, 10 min CD', '10 min WU, (30/90, 30/75, 30/60, 30/45, 30/30, 30/15 s) × 2, 10 min CD', '2 km WU, 11 × 400 m, 2 km CD']],
      ['Ljestvica', ['10 min WU, 4-1, 3-1, 2-1, 1-1, 2-1, 3-1, 4-1 min, 10 min CD', '10 min WU, 4-1, 3-1, 2-1, 1-1, 2-1, 3-1, 4-1 min, 10 min CD', '10 min WU, 5 × (4 min / 2 min), 10 min CD']]
    ] },
    { naz: 'Progresivno trčanje', sta: 'Trčanje u kojem tempo postepeno raste od laganog do ugodno teškog.', kako: 'Svakih 10 minuta (ili kilometara) ubrzaj malo. Zadnji dio je najbrži, a ne smije biti sprint.', napor: 'od 5 do 7 od 10, zadnji dio 7.', zasto: 'Uči te da trčiš ravnomjerno i da završiš brže nego što si počela.', s: [
      ['40 min', ['40 min progresivno (ubrzavati svakih 10 min), 10 min CD', '40 min progresivno (ubrzavati svakih 10 min), 10 min CD', D]],
      ['9 km', [D, D, '2 km WU, 9 km progresija, 2 km CD']],
      ['30 min', [D, D, '10 min WU, 30 min progresija, 10 min CD']]
    ] },
    { naz: 'Tempo (T)', sta: 'Dugotrajna dionica ravnomjernim, ugodno teškim tempom, malo sporijim od tempa u intervalima.', kako: 'Zagrijavanje, pa neprekidno trčanje u jednakom tempu, pa hlađenje. Ne zaustavljaj se.', napor: '7 od 10: možeš izgovoriti samo nekoliko riječi.', zasto: 'Podiže laktatni prag, pa duže možeš održati brzi tempo, što je ključno u testu od 12 minuta.', s: [
      ['9 km tempo', [D, D, '2 km WU, 9 km T, 2 km CD']],
      ['Tempo polumaratona', [D, D, '10 km tempom polumaratona']]
    ] },
    { naz: 'Lagano (Easy) i dugo (LSD)', sta: 'Osnova svakog plana trčanja. Lagano je kratko trčanje, a LSD (long slow distance) je najduže trčanje sedmice.', kako: 'Trči tempom uz koji možeš razgovarati. Nema žurbe i nema ubrzanja.', napor: '5 do 6 od 10.', zasto: 'Gradi aerobnu osnovu i oporavlja tijelo između teških treninga.', s: [
      ['Primjer', ['Easy 6 km, LSD 13 do 15 km', 'Easy 7 km, LSD 14 do 16 km', 'Easy 8 km, LSD 15 do 17 km']]
    ] }
  ];
  const int = () => h`
    <div class="eyebrow">Trčanje</div><h1>Intervali, fartlek i tempo</h1>
    <div class="card note"><b>Kratko objašnjenje oznaka</b><ul class="dots mt-s" style="margin:0"><li><b>WU</b> je zagrijavanje, a <b>CD</b> hlađenje.</li><li><b>I</b> znači interval, brza dionica.</li><li><b>T</b> je tempo, a <b>Easy</b> lagano trčanje.</li><li><b>Ready</b> je početni, <b>Steady</b> srednji, a <b>Go</b> napredni nivo.</li><li>Oznaka „—” znači da taj nivo nema takav trening u planu.</li></ul></div>
    ${T.map((t, ti) => h`<details class="card" ${ti === 0 ? 'open' : ''}><summary style="cursor:pointer"><b style="font-family:var(--serif);font-size:19px">${t.naz}</b></summary>
      <p class="mt-s"><b>Šta je to:</b> ${t.sta}</p><p><b>Kako se radi:</b> ${t.kako}</p><p><b>Napor:</b> ${t.napor}</p><p><b>Zašto:</b> ${t.zasto}</p>
      ${t.s.map(([n, v]) => h`<div class="card flat" style="margin:8px 0 0"><div class="eyebrow">${n}</div>${NIV.map(([en, bs], i) => h`<div class="kv"><span>${en} <span class="small">(${bs})</span></span><b>${v[i]}</b></div>`)}</div>`)}</details>`)}
    <div class="card"><h3>Dobro je znati</h3><ul class="dots"><li>Intervale radi najviše 1 do 2 puta sedmično, uz dan odmora ili lagano trčanje između.</li><li>Ako ne možeš održati isti tempo kroz sve dionice, počela si prebrzo. Smanji tempo.</li><li>Ako osjetiš oštru bol (ne samo umor), prekini trening.</li><li>Prije početka konsultuj ljekara ako imaš zdravstvenih tegoba.</li></ul></div>`;

  const PULS = '<form class="card" data-act="puls" novalidate><h3>Pulsne zone za trening</h3><p class="muted small">Puls pokazuje koliko ti je napor stvarno težak. Upiši godine i puls u mirovanju (izmjeri ujutro, prije ustajanja, 1 min). Ako znaš najviši puls izmjeren na kraju testa ili intervala, upiši ga.</p>\n      <div class="grid3"><label class="field"><span>Godine</span><input name="g" inputmode="numeric" placeholder="npr. 35"></label><label class="field"><span>Puls u mirovanju</span><input name="r" inputmode="numeric" placeholder="npr. 62"></label><label class="field"><span>Najviši puls (ne mora)</span><input name="m" inputmode="numeric" placeholder="npr. 185"></label></div><p class="err" id="perr2" hidden></p>\n      <button class="btn primary block" type="submit">Izračunaj zone</button><div id="pzone" class="mt-s"></div></form>';
  FS.trkExtra = { puls: PULS, tabs: [['coop', 'Cooperov test'], ['int', 'Intervali i tempo']], html: (tab) => (tab === 'coop' ? coop() : int()) };
  FS.trkData = { W, T, NIV, D };
  FS.coopCalc = (d) => { const v = (d - 504.9) / 44.73, pace = 720 / (d / 1000); return { v, pace }; };
})();
