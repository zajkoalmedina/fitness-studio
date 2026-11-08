/* Dodatni recepti za plan ishrane: grčki jogurt s voćem, crna čokolada (po redovima) i cheat obroci (jedan sedmično) */
(function () {
  const FS = (window.FS = window.FS || {});
  const R = (id, naziv, obrok, kcal, p, uh, m, v, sast, priprema, cheat) => ({ id, naziv, obrok, kcal, p, uh, m, v, sast, priprema, cilj: '', okvir: true, jogurt100: false, ...(cheat ? { cheat: true } : {}) });
  FS.RECEPTI_V = (FS.RECEPTI_V || []).concat([
    R('u01', 'Grčki jogurt s borovnicama', 'Užina', 165, 17.5, 24.5, 0.5, 3, ['200 g grčkog jogurta 0% masti', '100 g borovnica'], 'Jogurt staviti u zdjelicu i dodati borovnice.'),
    R('u02', 'Grčki jogurt s jagodama', 'Užina', 156, 17.8, 21.5, 0.5, 3, ['200 g grčkog jogurta 0% masti', '150 g jagoda'], 'Jagode narezati i staviti preko jogurta.'),
    R('u03', 'Grčki jogurt s bananom i cimetom', 'Užina', 197, 18.6, 33, 0.3, 3, ['200 g grčkog jogurta 0% masti', '1 mala banana', 'prstohvat cimeta'], 'Bananu narezati, dodati u jogurt i posuti cimetom.'),
    R('u04', 'Grčki jogurt s malinama i orasima', 'Užina', 225, 19.5, 23, 6.8, 4, ['200 g grčkog jogurta 0% masti', '100 g malina', '10 g oraha'], 'Jogurt, maline i sjeckani orasi u zdjelici.'),
    R('u05', 'Grčki jogurt s malinama', 'Užina', 150, 17.6, 19.6, 0.6, 4, ['200 g grčkog jogurta 0% masti', '80 g malina'], 'Maline staviti preko jogurta.'),
    R('u06', 'Crna čokolada 70%: 2 reda (oko 20 g)', 'Užina', 115, 1.6, 7, 8.5, 2, ['20 g crne čokolade (70% kakaa), 2 reda'], 'Dva reda crne čokolade su razumna porcija za slatku užinu.'),
    R('u07', 'Crna čokolada 70%: 1 red (oko 10 g)', 'Užina', 57, 0.8, 3.5, 4.3, 1, ['10 g crne čokolade (70% kakaa), 1 red'], 'Jedan red crne čokolade uz kafu ili voće.'),
    R('c01', 'Cheat doručak: palačinke s bananom i Nutellom', 'Doručak', 535, 15, 78, 18, 4, ['3 manje palačinke (1 jaje, 60 g brašna, 150 ml mlijeka)', '1 banana', '1 kašika Nutelle (15 g)'], 'Ispeci tanke palačinke, premaži Nutellom i dodaj narezanu bananu. Jednom sedmično, bez grižnje savjesti.', true),
    R('c02', 'Cheat obrok: domaća pizza (2 kriške)', 'Ručak', 620, 28, 70, 25, 4, ['2 kriške pizze (oko 250 g)', 'salata od paradajza'], 'Jedna slobodna poslastica sedmično. Pojedi polako i uživaj.', true),
    R('c03', 'Cheat obrok: burger i pečeni krompirići', 'Ručak', 780, 38, 70, 36, 5, ['1 burger u lepinji', 'porcija pečenog krompira (150 g)'], 'Jedan cheat obrok sedmično, a ostatak dana ostaje po planu.', true)
  ]);
})();
