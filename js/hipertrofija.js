/* Vodič za trenericu: kako napraviti plan treninga za hipertrofiju (vidi samo trenerica). */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h } = FS;
  const V = (FS.views = FS.views || {});
  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const TAB = [
    ['1', 'Adaptacija i tehnika', '10–15 ponavljanja, umjereno opterećenje', 'Uči se pokret, tehnika i tempo. Ostavi 3 do 4 ponavljanja u rezervi.'],
    ['2', 'Progresivno opterećenje', '8–12 ponavljanja, postepeno povećanje težine', 'Kad klijentica uradi sve serije na vrhu raspona, povećaj težinu (dvostruka progresija).'],
    ['3', 'Veći hipertrofijski stimulans', 'Glavne vježbe 6–12, završne pump serije 15–25 ponavljanja', 'Glavne vježbe teže, a pump serije na kraju treninga na lakšim izolacijama i spravama. Zadnje serije blizu otkaza (1 do 2 u rezervi).'],
    ['4', 'Deload (oporavak)', 'Smanji broj serija i ukupni zamor', 'Oko 30 do 50 % manje serija, težine ostaju iste ili nešto lakše, bez serija do otkaza.']
  ];
  FS.HIPER_TAB = TAB;
  const KORACI = [
    ['Izaberi broj treninga sedmično', 'Svaku mišićnu grupu treniraj 2× sedmično. 3 dana: full body. 4 dana: gornji/donji dio. 5 dana: donji, gornji, donji, push, pull ili akcenat na gluteus.'],
    ['Odredi serije po mišićnoj grupi', 'Početnice 8 do 12 direktnih serija sedmično po mišićnoj grupi, srednje iskusne 10 do 16, napredne 12 do 20. Povećavaj postepeno, po jednu seriju, ne na svim vježbama odjednom.'],
    ['Poredaj vježbe', 'Prvo glavne složene vježbe (čučanj, hip thrust, potisak, veslanje) dok je snaga najveća, zatim pomoćne, pa izolacije i pump serije na kraju. Za prioritetnu mišićnu grupu stavi vježbe na početak treninga.'],
    ['Izaberi raspon ponavljanja', 'Glavne vježbe 6 do 12, pomoćne 8 do 15, izolacije i pump 12 do 25. Hipertrofija radi u širokom rasponu ponavljanja, važno je da su serije blizu otkaza i da se težina progresivno povećava.'],
    ['Postavi napor (rezerva)', 'Početnice 2 do 4 ponavljanja u rezervi, napredne 0 do 2 na zadnjim serijama izolacija. Teške složene vježbe nemoj voditi do otkaza.'],
    ['Odredi pauze', 'Složene vježbe 2 do 3 minute, izolacije 60 do 90 sekundi. U aplikaciji se pauza upisuje uz svaku vježbu, a štoperica odbrojava.'],
    ['Odredi progresiju', 'Dvostruka progresija: ostani na istoj težini dok ne uradiš gornji broj ponavljanja u svim serijama, pa povećaj težinu i vrati se na donji broj. Zapisuj težine u dnevnik treninga.'],
    ['Planiraj deload', 'Nakon 3 do 5 sedmica rada napravi sedmicu oporavka sa 30 do 50 % manje serija. Aplikacija to podržava kroz periodizaciju programa.'],
    ['Prilagodi klijentici', 'Provjeri povrede, trudnoću i porod, dijastazu i zdravstvena stanja prije plana. Za ta stanja plan se prilagođava pojedinačno.']
  ];
  const APP = [
    'Programi → Novi program (ili Klijentice → Napravi individualni program): izaberi dane i dodaj vježbe iz biblioteke.',
    'Uz svaku vježbu upiši serije, ponavljanja (npr. 8–12), pauzu i napomenu koju klijentica vidi.',
    'Za pump serije kvačicom označi Drop set, a za superseriju „Superserija“. Klijentica dobija objašnjenje klikom na oznaku.',
    'Za vježbe na vrijeme upiši sekunde (npr. 30 s), pa se pojavljuje štoperica.',
    'Biblioteka treninga (samo trenerica): dodijeli trening klijentici, a ona ga vidi kao svoj individualni program. Zatim ga po potrebi uredi.',
    'Periodizacija programa u uređivanju: linearna, valovita ili „Pump hipertrofija“ (4 sedmice, pump serije 15–25 u 3. sedmici, deload u 4.). Cijeli trening po sedmici otvaraš gumbom „Otvori“.'
  ];
  V.hipertrofija = (el) => {
    if (!jeT()) { el.innerHTML = h`<div class="empty">Ova stranica je samo za trenericu.</div><a class="btn block" href="#/">Početna</a>`; return; }
    el.innerHTML = h`<div class="eyebrow">Samo za tebe</div><h1>Plan treninga za hipertrofiju</h1>
      <p class="muted">Podsjetnik kako složiti plan za rast mišića. Smjernice su okvirne, a plan se uvijek prilagođava klijentici i njenom stanju.</p>
      <div class="card"><h3>Kako rasporediti pump kroz 4 sedmice</h3>
        <table class="tbl"><tr><th>Sedmica</th><th>Fokus</th><th>Kako trenirati</th></tr>${TAB.map(([n, f, k]) => h`<tr><td><b>${n}.</b></td><td>${f}</td><td>${k}</td></tr>`)}</table>
        <ul class="dots mt-s">${TAB.map(([n, f, k, o]) => h`<li><b>${n}. sedmica:</b> ${o}</li>`)}</ul></div>
      <div class="card"><h3>Korak po korak: kako napraviti plan</h3><ol class="steps">${KORACI.map(([t, o]) => h`<li><span><b>${t}.</b> ${o}</span></li>`)}</ol></div>
      <div class="card"><h3>Pregled brojeva</h3>
        <table class="tbl"><tr><th>Šta</th><th>Smjernica</th></tr>
          <tr><td>Treninga po mišićnoj grupi</td><td>2× sedmično</td></tr><tr><td>Serija po mišićnoj grupi</td><td>10 do 20 sedmično</td></tr>
          <tr><td>Glavne vježbe</td><td>6–12 ponavljanja</td></tr><tr><td>Izolacije i pump</td><td>12–25 ponavljanja</td></tr>
          <tr><td>Pauza</td><td>2–3 min složene, 60–90 s izolacije</td></tr><tr><td>Rezerva</td><td>1–3 ponavljanja, zadnje serije izolacija 0–1</td></tr>
          <tr><td>Deload</td><td>svake 4. do 6. sedmice, 30–50 % manje serija</td></tr></table></div>
      <div class="card"><h3>Kako to napraviti u aplikaciji</h3><ul class="dots">${APP.map((t) => h`<li>${t}</li>`)}</ul></div>
      <a class="btn block mb" href="#/trener?tab=programi">Programi</a>`;
  };
})();
