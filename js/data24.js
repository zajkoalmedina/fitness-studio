/* Dodatni recepti za plan ishrane: grčki jogurt s voćem, crna čokolada (po redovima) i cheat obroci (jedan sedmično) */
(function () {
  const FS = (window.FS = window.FS || {});
  const R = (id, naziv, obrok, kcal, p, uh, m, v, sast, priprema, cheat) => ({ id, naziv, obrok, kcal, p, uh, m, v, sast, priprema, cilj: '', okvir: true, jogurt100: false, ...(cheat ? { cheat: true } : {}), ...(/whey/i.test(naziv + sast.join(' ')) ? { whey: true } : {}) });
  FS.RECEPTI_V = (FS.RECEPTI_V || []).concat([
    R('u01', 'Grčki jogurt s borovnicama', 'Užina', 165, 17.5, 24.5, 0.5, 3, ['200 g grčkog jogurta 0% masti', '100 g borovnica'], 'Jogurt staviti u zdjelicu i dodati borovnice.'),
    R('u02', 'Grčki jogurt s jagodama', 'Užina', 156, 17.8, 21.5, 0.5, 3, ['200 g grčkog jogurta 0% masti', '150 g jagoda'], 'Jagode narezati i staviti preko jogurta.'),
    R('u03', 'Grčki jogurt s bananom i cimetom', 'Užina', 197, 18.6, 33, 0.3, 3, ['200 g grčkog jogurta 0% masti', '1 mala banana', 'prstohvat cimeta'], 'Bananu narezati, dodati u jogurt i posuti cimetom.'),
    R('u04', 'Grčki jogurt s malinama i orasima', 'Užina', 225, 19.5, 23, 6.8, 4, ['200 g grčkog jogurta 0% masti', '100 g malina', '10 g oraha'], 'Jogurt, maline i sjeckani orasi u zdjelici.'),
    R('u05', 'Grčki jogurt s malinama', 'Užina', 150, 17.6, 19.6, 0.6, 4, ['200 g grčkog jogurta 0% masti', '80 g malina'], 'Maline staviti preko jogurta.'),
    R('u06', 'Crna čokolada 70%: 2 reda (oko 20 g)', 'Užina', 115, 1.6, 7, 8.5, 2, ['20 g crne čokolade (70% kakaa), 2 reda'], 'Dva reda crne čokolade su razumna porcija za slatku užinu.'),
    R('u07', 'Crna čokolada 70%: 1 red (oko 10 g)', 'Užina', 57, 0.8, 3.5, 4.3, 1, ['10 g crne čokolade (70% kakaa), 1 red'], 'Jedan red crne čokolade uz kafu ili voće.'),
    R('u08', 'Proteinski puding (gotov, 200 g)', 'Užina', 140, 20, 12, 2, 1, ['200 g gotovog proteinskog pudinga'], 'Poslužiti hladno. Provjeri deklaraciju proizvođača jer se vrijednosti razlikuju.'),
    R('u09', 'Proteinski puding (domaći)', 'Užina', 225, 30.6, 21, 2.5, 1, ['30 g whey proteina (vanilija ili čokolada)', '200 ml mlijeka 0,5%', '10 g kukuruznog škroba'], 'Škrob razmutiti u hladnom mlijeku, kuhati uz miješanje dok ne zgusne, skloniti s vatre i umiješati whey. Hladiti u frižideru.'),
    R('u10', 'Whey protein u vodi (1 mjerica, 30 g)', 'Užina', 120, 24, 3, 1.5, 0, ['30 g whey proteina', '250 ml vode'], 'Protresti u šejkeru. Dobra opcija kad ti fale proteini, a nemaš prostora za još jedan obrok.'),
    R('u11', 'Whey protein s bananom (poslije treninga)', 'Užina', 210, 25, 26, 1.8, 3, ['30 g whey proteina', '1 banana (oko 100 g)', '250 ml vode'], 'Izmiksati ili protresti u šejkeru. Najbolje u roku od sat vremena poslije treninga.'),
    R('c01', 'Cheat doručak: palačinke s bananom i Nutellom', 'Doručak', 535, 15, 78, 18, 4, ['3 manje palačinke (1 jaje, 60 g brašna, 150 ml mlijeka)', '1 banana', '1 kašika Nutelle (15 g)'], 'Ispeci tanke palačinke, premaži Nutellom i dodaj narezanu bananu. Jednom sedmično, bez grižnje savjesti.', true),
    R('c02', 'Cheat obrok: domaća pizza (2 kriške)', 'Ručak', 620, 28, 70, 25, 4, ['2 kriške pizze (oko 250 g)', 'salata od paradajza'], 'Jedna slobodna poslastica sedmično. Pojedi polako i uživaj.', true),
    R('c03', 'Cheat obrok: burger i pečeni krompirići', 'Ručak', 780, 38, 70, 36, 5, ['1 burger u lepinji', 'porcija pečenog krompira (150 g)'], 'Jedan cheat obrok sedmično, a ostatak dana ostaje po planu.', true)
  ]);
})();
/* sezonsko voće (mjeseci kad je u ponudi u BiH); plan ishrane bira samo ono što je u sezoni */
(function () {
  const FS = (window.FS = window.FS || {});
  const Y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], r = (a, b) => Y.filter((m) => (a <= b ? m >= a && m <= b : m >= a || m <= b));
  FS.SEZONA = { v01: r(8, 4), v02: r(8, 2), v04: r(11, 4), v05: r(11, 2), v06: r(8, 11), v07: r(7, 10), v08: r(6, 9), v09: r(5, 7), v10: r(5, 8), v11: r(6, 9), v12: r(6, 9), v13: r(7, 9), v14: r(7, 9), v15: r(10, 4), v16: r(8, 10), v19: r(11, 4), v20: r(6, 8), v22: r(10, 12),
    u01: r(6, 9), u02: r(5, 8), u04: r(6, 9), u05: r(6, 9), u12: r(8, 4), u13: r(10, 4) };
  FS.uSezoni = (rec, iso) => { const s = FS.SEZONA[rec.id]; if (!s) return true; const m = /^\d{4}-(\d\d)/.exec(String(iso)); return !m || s.includes(+m[1]); };
  const R = (id, naziv, kcal, p, uh, m, v, sast, priprema) => ({ id, naziv, obrok: 'Užina', kcal, p, uh, m, v, sast, priprema, cilj: '', okvir: true, jogurt100: false });
  FS.RECEPTI_V = (FS.RECEPTI_V || []).concat([
    R('u12', 'Grčki jogurt s jabukom i cimetom', 190, 18.5, 30, 0.4, 3, ['200 g grčkog jogurta 0% masti', '1 manja jabuka', 'prstohvat cimeta'], 'Jabuku narezati na kockice, dodati u jogurt i posuti cimetom.'),
    R('u13', 'Grčki jogurt s kivijem', 160, 17.5, 22, 0.6, 3, ['200 g grčkog jogurta 0% masti', '2 kivija'], 'Kivi oljuštiti, narezati i staviti preko jogurta.')]);
})();
/* dodatne namirnice za popunjavanje makroa (prijedlozi kad nešto fali) */
(function () {
  const FS = (window.FS = window.FS || {});
  const R = (id, naziv, kcal, p, uh, m, v, sast, priprema) => ({ id, naziv, obrok: 'Užina', kcal, p, uh, m, v, sast, priprema, cilj: '', okvir: true, jogurt100: false, dod: true });
  FS.RECEPTI_V = (FS.RECEPTI_V || []).concat([
    R('n01', 'Kuhana jaja (2 komada)', 140, 12.6, 1.1, 9.5, 0, ['2 kuhana jaja'], 'Kuhati 10 minuta, ohladiti i oljuštiti.'),
    R('n02', 'Svježi sir s niskim udjelom masti (200 g)', 180, 24, 6, 4, 0, ['200 g svježeg sira (cottage) 2% masti'], 'Poslužiti samostalno ili uz krastavac i paradajz.'),
    R('n03', 'Tuna iz konzerve u vlastitom soku (1 konzerva)', 110, 26, 0, 1, 0, ['1 konzerva tune u vlastitom soku (120 g)', 'limun'], 'Ocijediti i začiniti limunom. Odlično uz povrće.'),
    R('n04', 'Ćureća prsa (šunka) s krastavcem (100 g)', 110, 20, 3, 2, 1, ['100 g ćurećih prsa u šunki', '1 krastavac'], 'Narezati krastavac i poslužiti uz narezak.'),
    R('n05', 'Bademi (30 g)', 174, 6.3, 6, 15, 3.5, ['30 g badema, oko šaka'], 'Šaka badema je dobra porcija masnoća.'),
    R('n06', 'Orasi (30 g)', 196, 4.6, 4, 19.5, 2, ['30 g oraha, oko 6 polovica'], 'Šaka oraha, odlična dopuna za zdrave masti.'),
    R('n07', 'Avokado s limunom (pola)', 160, 2, 8.5, 15, 6.5, ['1/2 avokada', 'limun', 'so'], 'Avokado prepoloviti, pokapati limunom i posoliti.'),
    R('n08', 'Integralni hljeb s maslacem od kikirikija', 175, 8, 17, 9, 3, ['1 kriška integralnog hljeba', '1 kašika maslaca od kikirikija (16 g)'], 'Namazati i pojesti.'),
    R('n09', 'Banana s maslacem od kikirikija', 183, 4.8, 26, 8.4, 3, ['1 banana', '1 kašika maslaca od kikirikija (16 g)'], 'Bananu narezati i preliti maslacem od kikirikija.'),
    R('n10', 'Hurme (3 komada)', 170, 1, 45, 0.2, 4, ['3 hurme (60 g)'], 'Brz izvor ugljikohidrata, npr. prije treninga.'),
    R('n11', 'Rižine galete s mladim sirom i paradajzom (3 komada)', 160, 9, 25, 3, 2, ['3 rižine galete', '50 g mladog sira', '1 paradajz'], 'Namazati sirom i dodati paradajz.'),
    R('n12', 'Kefir (250 ml)', 140, 8, 10, 7, 0, ['250 ml kefira'], 'Piti hladno.'),
    R('n13', 'Humus s mrkvom i krastavcem (60 g humusa)', 110, 5, 12, 6, 4, ['60 g humusa', '1 mrkva', '1/2 krastavca'], 'Povrće narezati na štapiće i umakati u humus.'),
    R('n14', 'Proteinska pločica (1 komad)', 200, 20, 17, 7, 3, ['1 proteinska pločica (oko 50 g)'], 'Provjeri deklaraciju proizvođača jer se vrijednosti razlikuju.')
  ]);
})();
