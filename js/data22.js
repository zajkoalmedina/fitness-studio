/* Cijeli programi (više treninga zajedno, po sedmicama) sastavljeni od treninga iz biblioteke. Samo za trenericu; pri dodjeli klijentici postaju njen individualni program. */
(function () {
  const FS = (window.FS = window.FS || {});
  if (!FS.GOTOVI || FS.GOTOVI.some((g) => g.kat === 'cijeli')) return;
  const G = (id) => FS.GOTOVI.find((g) => g.id === id);
  const D = (id, naziv) => { const g = G(id); return g ? { naziv: naziv || g.dani[0].naziv, vj: JSON.parse(JSON.stringify(g.dani[0].vj)) } : null; };
  const out = [];
  const add = (id, naziv, opis, nivo, sedmica, dana, faze, bilj, deload) => {
    const dani = []; const fz = [];
    faze.forEach(([od, do2, lab, list]) => { const idx = []; list.forEach(([gid, nm]) => { const d = D(gid, (lab ? lab + ' · ' : '') + nm); if (d) { idx.push(dani.length); dani.push(d); } }); fz.push({ od, do: do2, dani: idx }); });
    if (!dani.length) return;
    out.push({ id, naziv, opis, nivo, mj: 'teretana', kat: 'cijeli', sedmica, dana, cijena: 0, tip: 'gotov', uShopu: false, samoTrener: true, per: { tip: 'nema', deload: deload || 0 }, faze: fz, bilj, dani });
  };
  const fb = (f) => [0, 1, 2].map((i) => ['k_teretana_full_fbpoc_f' + f + '_' + i, 'Trening ' + (i + 1)]);
  add('cp_fb_pocetnici3', 'Full body za početnike · 3× sedmično · 8 sedmica', 'Tri treninga sedmično, cijelo tijelo. Prve četiri sedmice 3 serije, druge četiri 4 serije.', 'početni', 8, 3,
    [[1, 4, 'Faza 1', fb(1)], [5, 8, 'Faza 2', fb(2)]], ['Radi 3 treninga sedmično s barem jednim danom odmora između.', 'Težinu biraj tako da zadnja 2 ponavljanja budu teška, ali tehnički čista.']);
  add('cp_ul_pocetnici4', 'Upper / Lower za početnike · 4× sedmično', 'Četiri treninga sedmično: gornji i donji dio tijela naizmjenično.', 'početni', 8, 4,
    [[1, 8, '', [['k_teretana_gornji_ulpoc_0', 'Upper 1'], ['k_teretana_donji_ulpoc_1', 'Lower 1'], ['k_teretana_gornji_ulpoc_2', 'Upper 2'], ['k_teretana_donji_ulpoc_3', 'Lower 2']]]],
    ['Prve 4 sedmice drži isti broj serija, poslije možeš povećati broj serija za po jednu, pa opet jedan ciklus, pa deload.']);
  add('cp_glut_fb4', 'Full body 4× sa akcentom na gluteus · srednji nivo', 'Četiri treninga sedmično, akcenat na gluteus. Sedmice 1–2, 3–4, deload u 5. i sedmice 6–9.', 'srednji', 9, 4,
    [[1, 2, 'Faza 1', [0, 1, 2, 3].map((i) => ['k_teretana_full_glakc_f1_' + i, 'Trening ' + (i + 1)])], [3, 5, 'Faza 2', [0, 1, 2, 3].map((i) => ['k_teretana_full_glakc_f2_' + i, 'Trening ' + (i + 1)])], [6, 9, 'Faza 3', [0, 1, 2, 3].map((i) => ['k_teretana_full_glakc_f3_' + i, 'Trening ' + (i + 1)])]],
    ['Sedmica 5 je deload: smanji volumen za 30 do 50 % ukupnog broja serija.'], 5);
  add('cp_srednji5', 'Lower / Upper / Lower / Push / Pull · 5× sedmično · srednji nivo', 'Pet treninga sedmično za srednje iskusne vježbače.', 'srednji', 2, 5,
    [[1, 2, '', [['k_teretana_donji_pl5x_srednji_0', 'Trening 1 · Lower'], ['k_teretana_gornji_pl5x_srednji_1', 'Trening 2 · Upper'], ['k_teretana_donji_pl5x_srednji_2', 'Trening 3 · Lower'], ['k_teretana_gornji_pl5x_srednji_3', 'Trening 4 · Push'], ['k_teretana_gornji_pl5x_srednji_4', 'Trening 5 · Pull']]]], ['Plan je opisan za sedmice 1 i 2. Dalje prilagodi klijentici (dodaj seriju, promijeni vježbe).']);
  add('cp_napredni5', 'Akcenat na gluteus · 5× sedmično · napredni nivo', 'Lower, Upper, Lower, Upper + Gluteus, Lower.', 'napredni', 5, 5,
    [[1, 5, '', [['k_teretana_donji_pl5x_napredni_0', 'Trening 1 · Lower'], ['k_teretana_gornji_pl5x_napredni_1', 'Trening 2 · Upper'], ['k_teretana_gluteus_pl5x_napredni_2', 'Trening 3 · Lower'], ['k_teretana_full_pl5x_napredni_3', 'Trening 4 · Upper + Gluteus'], ['k_teretana_gluteus_pl5x_napredni_4', 'Trening 5 · Lower']]]], ['Prvih 4 sedmice postepeno podiži po 1 seriju, ali ne na svim vježbama, pa napravi deload nakon 4 do 6 sedmica.'], 5);
  const P1 = [['početni', 'Početni'], ['srednji', 'Srednji'], ['napredni', 'Napredni']];
  P1.forEach(([nv, nn]) => add('cp_plan1_' + nv, 'Plan 1 · ' + nn + ' · 4× sedmično', 'Strong Legs, Back Day, Glutes i Upper Body. Teretana, ' + nv + ' nivo.', nv, 4, 4,
    [[1, 4, '', [['k_teretana_donji_' + nv + '_0', 'Strong Legs'], ['k_teretana_gornji_' + nv + '_0', 'Back Day'], ['k_teretana_gluteus_' + nv + '_0', 'Hipertrofija Glutes'], ['k_teretana_gornji_' + nv + '_1', 'Upper Body']]]], ['Pauze između serija prema napomeni uz vježbu.']));
  add('cp_plan2', 'Plan 2 · Faza 2 i Faza 3 · srednji nivo', 'Plan treninga br. 2: faza 2 (Strong Legs, Back Day, Glutes, Upper Body) i faza 3 (Glutes, Upper Body).', 'srednji', 8, 4,
    [[1, 4, 'Faza 2', [['k_teretana_donji_plan2f2_0', 'Strong Legs'], ['k_teretana_gornji_plan2f2_1', 'Back Day'], ['k_teretana_gluteus_plan2f2_2', 'Glutes'], ['k_teretana_gornji_plan2f2_3', 'Upper Body']]], [5, 8, 'Faza 3', [['k_teretana_donji_plan2f2_0', 'Strong Legs'], ['k_teretana_gornji_plan2f2_1', 'Back Day'], ['k_teretana_gluteus_plan2f3_0', 'Glutes'], ['k_teretana_gornji_plan2f3_1', 'Upper Body']]]], ['Pauza između serija 3 min. Strong Legs i Back Day su u fazi 3 isti kao u fazi 2. Trajanje faza prilagodi klijentici.']);
  FS.GOTOVI.push(...out);
})();
