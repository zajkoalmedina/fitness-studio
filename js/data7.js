/* Engleski nazivi vježbi (dodaju se u zagradi), zone gluteusa, redoslijed osnovne → izolacione */
(function () {
  const FS = (window.FS = window.FS || {});
  /* zamjena: Cable pull-through izbačen iz biblioteke */
  FS.EXERCISES = FS.EXERCISES.filter((e) => e.id !== 'pullthrough');
  /* MUST DO za gluteus medius */
  FS.EXERCISES.push({ id: 'sidelegabd', naziv: 'Bočna abdukcija jedne noge na kablu', grupa: 'Gluteusi', nivo: 'početni', oprema: 'Kabl s manžetom oko gležnja', dij: 'kasnije',
    koraci: ['Postavi kabl nisko i manžetu oko gležnja noge koja radi.', 'Stani bočno uz sprave, drži se za oslonac, trup uspravan.', 'Podigni nogu u stranu, bez nagiba trupa, do visine kuka.', 'Zadrži 1 s i polako vrati nogu.'], savjeti: ['Pokret ide iz kuka, ne iz leđa.', 'Prsti stopala gledaju naprijed ili malo dolje.', 'Radi isto serija s obje noge.'], greske: ['Naginjanje trupa u stranu.', 'Zamah umjesto kontrole.'], video: '' });
  FS.EXTRA_POSES = FS.EXTRA_POSES || {}; FS.EXTRA_MUSKUL = FS.EXTRA_MUSKUL || {};
  FS.EXTRA_POSES.sidelegabd = null; FS.EXTRA_MUSKUL.sidelegabd = { p: ['glutei (gluteus medius)'], s: ['gluteus minimus', 'tensor fasciae latae'] };
  FS.ENG = FS.ENG || {};
  const EN = {
    cucanj: 'Bodyweight squat', goblet: 'Goblet squat', rdl: 'Dumbbell Romanian deadlift', iskorak: 'Reverse lunge', sidelift: 'Side-lying leg raise',
    veslanje: 'One-arm dumbbell row', lat: 'Lat pulldown', sklekzid: 'Wall push-up', potisakb: 'Dumbbell bench press', ramena: 'Dumbbell shoulder press', bocno: 'Lateral raise',
    biceps: 'Dumbbell biceps curl', triceps: 'Band triceps extension', disanje: 'Diaphragmatic breathing', krokodil: 'Crocodile breathing', tva: 'Transverse abdominis activation',
    zdjelica: 'Pelvic tilt', mackakrava: 'Cat-cow', hodanje: 'Brisk walking', planka: 'Plank', crunch: 'Crunch', twist: 'Russian twist', sklek: 'Push-up',
    bench: 'Barbell bench press', kosibucice: 'Incline dumbbell press', veslanjekabl: 'Seated cable row', veslanjesipka: 'Barbell bent-over row', legpress: 'Leg press', legcurl: 'Hamstring curl machine', legext: 'Leg extension',
    abdukcija: 'Hip abduction machine', abdgumom: 'Banded lateral walk', backext: 'Hyperextension (back extension)', frontcucanj: 'Front squat', cucanjsipka: 'Barbell back squat', rdlsipka: 'Barbell Romanian deadlift',
    bugarski: 'Bulgarian split squat', iskorakhod: 'Walking lunge', stepup: 'Step-up', kickback: 'Cable kickback', hipthrust1: 'Single-leg hip thrust', curlloptom: 'Stability ball hamstring curl',
    reversepec: 'Reverse pec deck / rear delt fly', potisaksipka: 'Barbell overhead press', tricepskabl: 'Cable triceps pushdown', listovi: 'Calf raise',
    m_tekstenzija: 'Thoracic extension on foam roller', m_otvaranje: 'Open book (thoracic rotation)', m_9090: '90/90 hip switch', m_zid: 'Wall slide', m_golub: 'Pigeon pose', m_dubokicucanj: 'Deep squat hold',
    m_djecja: 'Child\'s pose', m_zabica: 'Frog stretch (dynamic)', m_hinge: 'Dowel hip hinge', m_gleznj: 'Ankle rock', m_iskorak_kuk: 'Hip flexor stretch (lunge)', m_zadnja_loza: 'Dynamic hamstring stretch',
    m_kobra: 'Cobra', m_igla: 'Thread the needle', m_gumapull: 'Band pull-apart', m_gumaveslo: 'Seated band row', m_bocniiskorak: 'Lateral lunge hold', m_skapula: 'Scapular push-up',
    m_v_podizanje: 'Prone V raise', m_sjedeca_rotacija: 'Seated trunk rotation with dowel', m_pas: 'Downward dog', m_kukovi_krug: 'Quadruped hip circles', m_rame_krug: 'Shoulder circles', m_ptica_reach: 'Hip-hinge swimmers',
    jednorodl: 'Single-leg Romanian deadlift', sumocucanj: 'Sumo squat', lungejump: 'Jumping lunge', lateralnilunge: 'Lateral lunge', singlebridge: 'Single-leg glute bridge', flutter: 'Flutter kicks', skarice: 'Scissor kicks',
    ytw: 'Y-T-W raise', plankwalk: 'Plank walk-up (up-downs)', farmer: 'Farmer\'s carry', hollow: 'Hollow body hold', skokpovisenje: 'Box jump', kbswing: 'Kettlebell swing', reversehyper: 'Reverse hyperextension', clamshell: 'Clamshell',
    bocnaplanka: 'Side plank with leg lift', zpotisak: 'Z-press', renegade: 'Renegade row', abwheel: 'Ab wheel rollout', swimmers: 'Swimmers (prone)', curtsy: 'Curtsy lunge', kangsquat: 'Kang squat', woodchop: 'Woodchopper',
    skaterhop: 'Skater hop', nevidljiva: 'Invisible jump rope', lakatkoljeno: 'Elbow-to-knee squat', planksavijanje: 'Plank up-downs (forearm to hand)', plankhops: 'Plank jacks / hops', sklopke: 'V-up', pistol: 'Pistol squat (assisted)',
    jumpingjack: 'Jumping jacks', highknees: 'High knees', bocacucanj: 'Water-bottle squat', bocaveslanje: 'Bottle row', bocapotisak: 'Bottle overhead press', bocarazmah: 'Bottle lateral raise', bocarodl: 'Bottle Romanian deadlift',
    bocapregib: 'Bottle biceps curl', bocatriceps: 'Bottle overhead triceps extension', jastukmost: 'Pillow squeeze glute bridge', jastukstisak: 'Pillow squeeze', stolicasklek: 'Incline push-up (chair)', zidsjed: 'Wall sit',
    klizniiskorak: 'Slider reverse lunge', toetaps: 'Toe taps', firehydrant: 'Fire hydrant', chestpress: 'Chest press machine', ramenaspr: 'Shoulder press machine', boxsquat: 'Box squat', blockpull: 'Block pull',
    floorpress: 'Floor press', closegrip: 'Close-grip bench press', boardpress: 'Board press', ghdraise: 'GHD raise', bandknee: 'Banded knee extension', tricepsrb: 'Triceps roll-back', uprightrow: 'Upright row',
    hammer: 'Hammer curl', shrugs: 'Dumbbell shrug', abs100: 'ABS 100', cucanjskok: 'Squat jump', skokudalj: 'Standing broad jump', dubinskok: 'Depth jump', tuckjump: 'Tuck jump', deadlift: 'Conventional deadlift', veslanjeguma: 'Band row',
    sidelegabd: 'Side one-leg abduction', heel: 'Heel slide', birddog: 'Bird dog', deadbug: 'Dead bug', vakuum: 'Stomach vacuum', mountainclimb: 'Mountain climbers', squatjacks: 'Squat jacks'
  };
  FS.ENG = EN;
  FS.EXERCISES.forEach((e) => { const en = EN[e.id]; if (en && !e.naziv.toLowerCase().includes(en.toLowerCase())) { e.en = en; e.naziv = /\)$/.test(e.naziv) ? e.naziv + ' · ' + en : e.naziv + ' (' + en + ')'; } });

  /* ----- zone gluteusa (TOP / MID / BOTTOM) ----- */
  const ZONE = {
    TOP: ['hipthrust', 'hipthrust1', 'bridge', 'singlebridge', 'frogpump', 'kickback', 'abdukcija', 'abdgumom', 'jastukmost', 'reversehyper', 'kbswing', 'firehydrant', 'clamshell', 'sidelift', 'sidelegabd'],
    MID: ['rdl', 'rdlsipka', 'legpress', 'backext', 'sumocucanj', 'jednorodl', 'goodmorning', 'kangsquat', 'blockpull', 'deadlift', 'ghdraise', 'bocarodl'],
    BOTTOM: ['iskorak', 'stepup', 'bugarski', 'cucanjsipka', 'frontcucanj', 'cucanj', 'goblet', 'curtsy', 'lateralnilunge', 'klizniiskorak', 'iskorakhod', 'boxsquat', 'pistol', 'bocacucanj', 'lungejump']
  };
  FS.ZONE_OPIS = {
    TOP: 'TOP zona: maksimalna aktivacija gluteusa u gornjoj, skraćenoj poziciji (hip thrust, glute bridge, kick back, abdukcija).',
    MID: 'MID zona: nema maksimalne aktivacije ni gore ni dolje (rumunsko mrtvo dizanje, leg press, hiperekstenzija, sumo).',
    BOTTOM: 'BOTTOM zona: maksimalna aktivacija u donjoj, izduženoj poziciji (iskoraci, čučnjevi, step up, bugarski čučanj).'
  };
  FS.zona = (id) => (ZONE.TOP.includes(id) ? 'TOP' : ZONE.MID.includes(id) ? 'MID' : ZONE.BOTTOM.includes(id) ? 'BOTTOM' : '');
  FS.zoneProg = (prog) => {
    const o = { TOP: 0, MID: 0, BOTTOM: 0, abd: 0 };
    (prog.dani || []).forEach((d) => d.vj.forEach((v) => { const z = FS.zona(v.id); if (z) o[z] += v.s || 0; if (v.id === 'sidelegabd') o.abd += v.s || 0; }));
    return o;
  };

  /* ----- zamjena pull-through + MUST DO u glute danima ----- */
  const G = (id) => FS.GOTOVI.find((p) => p.id === id);
  const swap = (prog, from, to) => (prog.dani || []).forEach((d) => d.vj.forEach((v) => { if (v.id === from) v.id = to; }));
  FS.GOTOVI.forEach((p) => swap(p, 'pullthrough', 'rdl'));
  { const n5 = G('napredni5'); if (n5) swap(n5, 'rdl', 'rdlsipka'); }
  const must = (id, di) => { const p = G(id); if (!p || !p.dani[di]) return; const d = p.dani[di]; if (!d.vj.some((v) => v.id === 'sidelegabd')) d.vj.push({ id: 'sidelegabd', s: 3, r: '12 po nozi', n: 'Obavezna izolacija za gluteus medius (MUST DO)' }); };
  must('gluteus', 0); must('gluteus', 2); must('glutefb4', 1); must('glutefb4', 3); must('napredni5', 2); must('napredni5', 4); must('oblikuj', 2); must('oblikuj', 7);
  const addAt = (id, di, after, item) => { const p = G(id); if (!p || !p.dani[di]) return; const d = p.dani[di]; if (d.vj.some((v) => v.id === item.id)) return; const k = d.vj.findIndex((v) => v.id === after); d.vj.splice(k >= 0 ? k + 1 : d.vj.length, 0, item); };
  addAt('gluteus', 2, 'goblet', { id: 'legpress', s: 3, r: '12', n: 'Stopala visoko na platformi za veći naglasak na gluteuse' });
  addAt('glutefb4', 0, 'cucanjsipka', { id: 'legpress', s: 3, r: '12', n: 'Stopala visoko i šire' });
  addAt('kuca', 3, 'cucanj', { id: 'bocarodl', s: 3, r: '12', n: 'Boce vode u rukama, pregib u kukovima' });
  { const gl = G('glutefb4'); if (gl) { gl.bilj = (gl.bilj || []).concat(['Tri zone gluteusa: TOP (hip thrust, bridge), MID (rumunsko mrtvo dizanje, leg press) i BOTTOM (iskoraci, čučnjevi). Svaka zona treba biti zastupljena, a bočna abdukcija jedne noge je obavezna za gluteus medius.']); } }

  /* ----- redoslijed unutar dana: prvo osnovne (višezglobne), pa izolacione, pa core ----- */
  const ISO = new Set(['legcurl', 'legext', 'abdukcija', 'abdgumom', 'kickback', 'frogpump', 'clamshell', 'firehydrant', 'sidelift', 'sidelegabd', 'bocno', 'biceps', 'triceps', 'tricepskabl', 'reversepec', 'listovi', 'hammer', 'shrugs', 'bandknee', 'tricepsrb', 'curlloptom', 'bocapregib', 'bocatriceps', 'bocarazmah', 'jastukstisak', 'ytw', 'uprightrow', 'singlebridge', 'bridge']);
  const MACH = new Set(['chestpress', 'ramenaspr', 'lat', 'veslanjekabl']);
  const rank = (v) => {
    const e = FS.EXERCISES.find((x) => x.id === v.id); if (!e) return 1;
    if (v.id === 'legpress') return 0;
    if (ISO.has(v.id)) return 3; if (MACH.has(v.id)) return 1;
    if (['Core', 'Kardio', 'Disanje', 'Mobilnost'].includes(e.grupa)) return 4;
    if (e.grupa === 'Ruke') return 3;
    return 1;
  };
  const SKIP_P = new Set(['mobilnost', 'conjugate', 'pliometrija', 'vodic-ishrana']);
  FS.GOTOVI.forEach((p) => {
    if (SKIP_P.has(p.id)) return;
    (p.dani || []).forEach((d) => {
      if (/HIIT|Max effort|Dinami/i.test(d.naziv) || (p.id === 'kuca' && /Dan C/.test(d.naziv))) return;
      const units = []; for (let i = 0; i < d.vj.length; i++) { if (d.vj[i].p === 0 && d.vj[i + 1]) { units.push([d.vj[i], d.vj[i + 1]]); i++; } else units.push([d.vj[i]]); }
      const idx = new Map(units.map((u, i) => [u, i]));
      units.sort((a, b) => Math.min(...a.map(rank)) - Math.min(...b.map(rank)) || idx.get(a) - idx.get(b));
      d.vj = units.flat();
    });
  });
})();
