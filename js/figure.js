/* Animirane siluete vježbi (bočni pogled): dva ključna položaja i glatki prijelaz */
(function () {
  const FS = (window.FS = window.FS || {});
  const L = { torso: 50, neck: 7, head: 9, thigh: 40, shin: 40, foot: 13, ua: 27, fa: 25 };
  const rad = (a) => (a * Math.PI) / 180;
  const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))];
  const add = (p, d, k) => [p[0] + d[0] * k, p[1] + d[1] * k];
  const DEF = { t: 180, th: 0, sh: 0, ft: 95, ua: 0, fa: 0 };
  const KEYS = ['t', 'th', 'sh', 'ft', 'ua', 'fa', 'th2', 'sh2', 'ft2', 'ua2', 'fa2', 'lift'];

  /* [položaj A, položaj B]; kutovi su u stepenima (0 = dolje, 90 = naprijed, 180 = gore) */
  const ST = { t: 180, th: 0, sh: 0 };
  const P = {
    cucanj: [{ ...ST, ua: 75, fa: 90 }, { t: 145, th: 82, sh: -32, ua: 75, fa: 90 }],
    goblet: [{ ...ST, ua: 10, fa: 160, w: 'db' }, { t: 150, th: 82, sh: -30, ua: 12, fa: 160, w: 'db' }],
    cucanjsipka: [{ ...ST, ua: -20, fa: -150, w: 'barsho' }, { t: 138, th: 88, sh: -30, ua: -20, fa: -150, w: 'barsho' }],
    frontcucanj: [{ ...ST, ua: 70, fa: 170, w: 'barsho' }, { t: 155, th: 88, sh: -28, ua: 70, fa: 170, w: 'barsho' }],
    iskorak: [{ ...ST, w: 'db' }, { t: 175, th: 80, sh: -8, th2: -12, sh2: -105, ft2: 30, w: 'db' }],
    iskorakhod: [{ ...ST, w: 'db' }, { t: 175, th: 80, sh: -8, th2: -12, sh2: -105, ft2: 30, w: 'db' }],
    bugarski: [{ t: 178, th: 8, sh: -3, th2: -10, sh2: -85, ft2: 30, w: 'db', under: 'ankle2' }, { t: 168, th: 85, sh: -8, th2: -25, sh2: -145, ft2: 30, w: 'db', under: 'ankle2' }],
    stepup: [{ t: 175, th: 78, sh: -5, th2: 5, sh2: 5, w: 'db', under: 'ankle' }, { t: 180, th: 0, sh: 0, th2: 60, sh2: 0, w: 'db', under: 'ankle', lift: 32 }],
    rdl: [{ ...ST, w: 'db' }, { t: 105, th: 12, sh: -6, w: 'db' }],
    rdlsipka: [{ ...ST, w: 'bar' }, { t: 105, th: 12, sh: -6, w: 'bar' }],
    veslanje: [{ t: 105, th: 20, sh: -8, w: 'db' }, { t: 105, th: 20, sh: -8, ua: -125, fa: 5, w: 'db' }],
    veslanjesipka: [{ t: 110, th: 18, sh: -8, w: 'bar' }, { t: 110, th: 18, sh: -8, ua: -115, fa: 5, w: 'bar' }],
    veslanjekabl: [{ t: 158, th: 86, sh: 86, ua: 88, fa: 90, w: 'handle' }, { t: 178, th: 86, sh: 86, ua: -18, fa: 90, w: 'handle' }],
    lat: [{ t: 172, th: 88, sh: -2, ua: 165, fa: 176, w: 'handle' }, { t: 166, th: 88, sh: -2, ua: 12, fa: 152, w: 'handle' }],
    sklek: [{ t: 111, th: -69, sh: -69, ft: 20, ua: 0, fa: 0 }, { t: 100, th: -80, sh: -80, ft: 20, ua: -60, fa: 67 }],
    bench: [{ t: -90, th: 110, sh: 5, ua: 180, fa: 180, w: 'bar', under: 'bench' }, { t: -90, th: 110, sh: 5, ua: 75, fa: 180, w: 'bar', under: 'bench' }],
    potisakb: [{ t: -90, th: 110, sh: 5, ua: 180, fa: 180, w: 'db', under: 'bench' }, { t: -90, th: 110, sh: 5, ua: 75, fa: 180, w: 'db', under: 'bench' }],
    kosibucice: [{ t: -128, th: 110, sh: 5, ua: 160, fa: 172, w: 'db', under: 'bench' }, { t: -128, th: 110, sh: 5, ua: 85, fa: 160, w: 'db', under: 'bench' }],
    ramena: [{ ...ST, ua: 15, fa: 165, w: 'db' }, { ...ST, ua: 172, fa: 180, w: 'db' }],
    potisaksipka: [{ ...ST, ua: 15, fa: 165, w: 'bar' }, { ...ST, ua: 172, fa: 180, w: 'bar' }],
    bocno: [{ ...ST, ua: 4, fa: 2, w: 'db' }, { ...ST, ua: 82, fa: 86, w: 'db' }],
    reversepec: [{ t: 120, th: 15, sh: -8, ua: 0, fa: 0, w: 'db' }, { t: 120, th: 15, sh: -8, ua: -70, fa: -60, w: 'db' }],
    biceps: [{ ...ST, ua: 2, fa: 2, w: 'db' }, { ...ST, ua: 8, fa: 148, w: 'db' }],
    triceps: [{ ...ST, ua: 4, fa: 95, w: 'handle' }, { ...ST, ua: 4, fa: 6, w: 'handle' }],
    tricepskabl: [{ ...ST, ua: 4, fa: 95, w: 'handle' }, { ...ST, ua: 4, fa: 6, w: 'handle' }],
    legcurl: [{ t: 170, th: 86, sh: 76, ua: 40, fa: 80 }, { t: 170, th: 86, sh: -18, ua: 40, fa: 80 }],
    legext: [{ t: 172, th: 88, sh: -5, ua: 40, fa: 80 }, { t: 172, th: 88, sh: 80, ua: 40, fa: 80 }],
    legpress: [{ t: -130, th: 150, sh: 60, ua: 60, fa: 100 }, { t: -130, th: 120, sh: 112, ua: 60, fa: 100 }],
    hipthrust: [{ t: -72, th: 130, sh: 22, ua: 65, fa: 95, w: 'barhip', under: 'shoulder' }, { t: -92, th: 92, sh: 3, ua: 65, fa: 95, w: 'barhip', under: 'shoulder' }],
    hipthrust1: [{ t: -72, th: 130, sh: 22, th2: 100, sh2: 150, ua: 65, fa: 95, under: 'shoulder' }, { t: -92, th: 92, sh: 3, th2: 120, sh2: 130, ua: 65, fa: 95, under: 'shoulder' }],
    bridge: [{ t: -90, th: 135, sh: 25, ua: 90, fa: 90 }, { t: -65, th: 115, sh: 10, ua: 90, fa: 90 }],
    frogpump: [{ t: -90, th: 135, sh: 25, ua: 90, fa: 90 }, { t: -65, th: 115, sh: 10, ua: 90, fa: 90 }],
    pullthrough: [{ t: 140, th: 28, sh: -8, ua: 15, fa: 40, w: 'handle' }, { t: 180, th: 3, sh: 0, ua: 15, fa: 40, w: 'handle' }],
    kickback: [{ t: 150, th: 4, sh: 0, th2: 20, sh2: -15, ua: 70, fa: 100 }, { t: 150, th: 4, sh: 0, th2: -55, sh2: -55, ua: 70, fa: 100 }],
    backext: [{ t: 72, th: -35, sh: -35, ua: 40, fa: 150 }, { t: 145, th: -35, sh: -35, ua: 40, fa: 150 }],
    curlloptom: [{ t: -90, th: 110, sh: 98, ua: 90, fa: 90 }, { t: -75, th: 125, sh: 40, ua: 90, fa: 90 }],
    listovi: [{ ...ST, ft: 95, ua: 0, fa: 0, w: 'db' }, { ...ST, ft: 22, ua: 0, fa: 0, w: 'db' }],
    planka: [{ t: 101, th: -79, sh: -79, ft: 20, ua: 0, fa: 90 }, { t: 101, th: -79, sh: -79, ft: 20, ua: 0, fa: 90 }],
    birddog: [{ t: 95, th: 0, sh: -90, ua: 0, fa: 0 }, { t: 95, th: 0, sh: -90, ua: 0, fa: 0, ua2: 90, fa2: 92, th2: -82, sh2: -88 }],
    deadbug: [{ t: -90, th: 172, sh: 92, ua: 178, fa: 180 }, { t: -90, th: 172, sh: 92, ua: 178, fa: 180, ua2: -95, fa2: -95, th2: 96, sh2: 96 }]
  };

  /* dodatne vježbe (bočni prikaz je približan kod pokreta u stranu i rotacija) */
  const LY = { t: -90, th: 135, sh: 25, ua: 90, fa: 90 };            // leđa na podu, koljena savijena
  const QD = { t: 92, th: 0, sh: -90, ua: 0, fa: 0 };                // četveronožni
  Object.assign(P, {
    sidelift: [{ t: -90, th: 90, sh: 90, th2: 92, sh2: 92, ua: 90, fa: 90 }, { t: -90, th: 90, sh: 90, th2: 140, sh2: 140, ua: 90, fa: 90 }],
    sklekzid: [{ t: 150, th: -30, sh: -30, ft: 60, ua: 95, fa: 95 }, { t: 130, th: -50, sh: -50, ft: 50, ua: 50, fa: 125 }],
    disanje: [{ ...LY }, { ...LY, t: -91 }],
    krokodil: [{ t: -90, th: 90, sh: 90, ua: -100, fa: -90 }, { t: -91, th: 90, sh: 90, ua: -100, fa: -90 }],
    vakuum: [{ ...QD }, { ...QD, t: 94 }],
    tva: [{ ...LY }, { ...LY, th: 132 }],
    zdjelica: [{ ...LY }, { ...LY, t: -87, th: 128 }],
    heel: [{ ...LY, th2: 135, sh2: 25 }, { ...LY, th2: 98, sh2: 92 }],
    mackakrava: [{ ...QD, t: 100 }, { ...QD, t: 82 }],
    hodanje: [{ t: 176, th: 24, sh: 6, th2: -22, sh2: -40, ua: -25, fa: 20, ua2: 25, fa2: 70 }, { t: 176, th: -22, sh: -40, th2: 24, sh2: 6, ua: 25, fa: 70, ua2: -25, fa2: 20 }],
    crunch: [{ ...LY, ua: 160, fa: 150 }, { ...LY, t: -50, ua: 120, fa: 110 }],
    twist: [{ t: -150, th: 110, sh: 112, ua: 80, fa: 85 }, { t: -150, th: 110, sh: 112, ua: 105, fa: 110 }],
    abdukcija: [{ t: 178, th: 0, sh: 0, th2: 0, sh2: 0, ua: 0, fa: 0 }, { t: 178, th: 0, sh: 0, th2: 38, sh2: 38, ua: 0, fa: 0 }],
    abdgumom: [{ t: 170, th: 8, sh: 14, th2: -6, sh2: 0, ua: 40, fa: 120 }, { t: 170, th: 8, sh: 14, th2: 30, sh2: 30, ua: 40, fa: 120 }],
    m_tekstenzija: [{ ...LY, ua: 170, fa: -160 }, { ...LY, t: -100, ua: 170, fa: -160 }],
    m_otvaranje: [{ t: -90, th: 100, sh: 50, ua: 95, fa: 95 }, { t: -90, th: 100, sh: 50, ua: 175, fa: 175 }],
    m_9090: [{ t: 180, th: 88, sh: 10, th2: -70, sh2: -100, ua: 60, fa: 20 }, { t: 180, th: -70, sh: -100, th2: 88, sh2: 10, ua: 60, fa: 20 }],
    m_zid: [{ t: 180, th: 0, sh: 0, ua: 70, fa: 175 }, { t: 180, th: 0, sh: 0, ua: 170, fa: 178 }],
    m_golub: [{ t: 172, th: 88, sh: 5, th2: -88, sh2: -88, ua: 0, fa: 0 }, { t: 100, th: 88, sh: 5, th2: -88, sh2: -88, ua: 95, fa: 95 }],
    m_dubokicucanj: [{ t: 180, th: 0, sh: 0, ua: 80, fa: 100 }, { t: 135, th: 100, sh: -48, ua: 70, fa: 110 }],
    m_djecja: [{ t: 98, th: 70, sh: -85, ua: 98, fa: 98 }, { t: 125, th: 70, sh: -85, ua: 100, fa: 100 }],
    m_zabica: [{ t: 92, th: 14, sh: -80, ua: 0, fa: 0 }, { t: 108, th: 52, sh: -72, ua: 0, fa: 0 }],
    m_hinge: [{ t: 180, th: 0, sh: 0, ua: -12, fa: -12 }, { t: 105, th: 12, sh: -6, ua: -12, fa: -12 }],
    m_gleznj: [{ t: 178, th: 88, sh: 2, th2: 5, sh2: -90, ua: 0, fa: 0 }, { t: 178, th: 88, sh: -22, th2: 5, sh2: -90, ua: 0, fa: 0 }],
    m_iskorak_kuk: [{ t: 178, th: 85, sh: 0, th2: 5, sh2: -90, ua: 0, fa: 0 }, { t: 168, th: 85, sh: 0, th2: 5, sh2: -90, ua: 170, fa: 178 }],
    m_zadnja_loza: [{ ...LY, th2: 150, sh2: 60 }, { ...LY, th2: 150, sh2: 150 }],
    m_kobra: [{ t: -90, th: 90, sh: 90, ua: 0, fa: 0 }, { t: -125, th: 90, sh: 90, ua: 0, fa: 0 }],
    m_igla: [{ ...QD, ua: 0, fa: 0 }, { ...QD, t: 84, ua: 60, fa: 60 }],
    m_gumapull: [{ t: 180, th: 0, sh: 0, ua: 88, fa: 88, w: 'handle' }, { t: 180, th: 0, sh: 0, ua: 70, fa: 100, w: 'handle' }],
    m_gumaveslo: [{ t: 178, th: 90, sh: 90, ua: 88, fa: 90, w: 'handle' }, { t: 178, th: 90, sh: 90, ua: -15, fa: 90, w: 'handle' }],
    m_bocniiskorak: [{ t: 180, th: 0, sh: 0 }, { t: 160, th: 60, sh: -30, th2: -20, sh2: -20 }],
    m_skapula: [{ t: 111, th: -69, sh: -69, ft: 20, ua: 0, fa: 0 }, { t: 107, th: -72, sh: -72, ft: 20, ua: 0, fa: 0 }],
    m_v_podizanje: [{ t: -90, th: 90, sh: 90, ua: -88, fa: -88 }, { t: -96, th: 90, sh: 90, ua: -128, fa: -128 }],
    m_sjedeca_rotacija: [{ t: 180, th: 90, sh: 90, ua: 80, fa: 85 }, { t: 180, th: 90, sh: 90, ua: 105, fa: 100 }],
    m_pas: [{ t: -32, th: 32, sh: 32, ua: -32, fa: -32 }, { t: -32, th: 24, sh: 50, ua: -32, fa: -32 }],
    m_kukovi_krug: [{ ...QD, th2: -75, sh2: -92 }, { ...QD, th2: -118, sh2: -105 }],
    m_rame_krug: [{ t: 180, th: 0, sh: 0, ua: 80, fa: 82 }, { t: 180, th: 0, sh: 0, ua: -80, fa: -80 }],
    m_ptica_reach: [{ t: 105, th: 12, sh: -6, ua: 100, fa: 100, ua2: -110, fa2: -110 }, { t: 105, th: 12, sh: -6, ua: -110, fa: -110, ua2: 100, fa2: 100 }]
  });
  Object.keys(FS.EXTRA_POSES || {}).forEach((k) => { const v = FS.EXTRA_POSES[k]; const r = typeof v === 'string' ? P[v] : v; if (r) P[k] = r; });
  FS.FIGURE_IDS = Object.keys(P);

  function solve(p) {
    const q = {}; KEYS.forEach((k) => { q[k] = p[k]; });
    const hip = [0, 0], sdir = dir(p.t ?? DEF.t);
    const sho = add(hip, sdir, L.torso), neck = add(sho, sdir, L.neck), head = add(neck, sdir, L.head + 1);
    const leg = (a, b, f) => { const knee = add(hip, dir(a), L.thigh), ank = add(knee, dir(b), L.shin), toe = add(ank, dir(f), L.foot); return { knee, ank, toe }; };
    const arm = (a, b) => { const el = add(sho, dir(a), L.ua), wr = add(el, dir(b), L.fa); return { el, wr }; };
    const l1 = leg(p.th ?? 0, p.sh ?? 0, p.ft ?? DEF.ft);
    const has2 = p.th2 != null;
    const l2 = has2 ? leg(p.th2, p.sh2 ?? p.th2, p.ft2 ?? DEF.ft) : null;
    const a1 = arm(p.ua ?? 0, p.fa ?? 0);
    const a2 = p.ua2 != null ? arm(p.ua2, p.fa2 ?? p.ua2) : null;
    const pts = [hip, sho, head, l1.knee, l1.ank, l1.toe, a1.el, a1.wr].concat(l2 ? [l2.knee, l2.ank, l2.toe] : [], a2 ? [a2.el, a2.wr] : []);
    const maxY = Math.max(...pts.map((x) => x[1])) + 4;
    return { hip, sho, neck, head, l1, l2, a1, a2, maxY, lift: p.lift || 0, w: p.w, under: p.under };
  }

  const mix = (A, B, u) => {
    const o = {};
    const wrap = (d) => { while (d > 180) d -= 360; while (d < -180) d += 360; return d; };
    ['t', 'th', 'sh', 'ft', 'ua', 'fa'].forEach((k) => { const a = A[k] ?? DEF[k], b = B[k] ?? DEF[k]; o[k] = a + wrap(b - a) * u; });
    ['th2', 'sh2', 'ft2', 'ua2', 'fa2', 'lift'].forEach((k) => {
      const a = A[k], b = B[k];
      if (a == null && b == null) return;
      const aa = a ?? (k === 'lift' ? 0 : (k === 'th2' ? A.th : k === 'sh2' ? A.sh : k === 'ft2' ? A.ft : k === 'ua2' ? A.ua : A.fa) ?? DEF[k.replace('2', '')] ?? 0);
      const bb = b ?? (k === 'lift' ? 0 : (k === 'th2' ? B.th : k === 'sh2' ? B.sh : k === 'ft2' ? B.ft : k === 'ua2' ? B.ua : B.fa) ?? DEF[k.replace('2', '')] ?? 0);
      o[k] = k === 'lift' ? aa + (bb - aa) * u : aa + wrap(bb - aa) * u;
    });
    o.w = u < 0.5 ? A.w : B.w; o.under = u < 0.5 ? A.under : B.under;
    return o;
  };

  const W = 260, H = 190, FLOOR = 168;
  const f1 = (n) => n.toFixed(1);
  const line = (a, b, w, c, o) => `<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${o ? ` opacity="${o}"` : ''}/>`;
  const BODY = '#1b2742', FAR = '#6d7b9c', PROP = '#8ea0c6', PANEL = '#efe7d8';

  function frame(id, u, cx, box) {
    const [A, B] = P[id]; const p = solve(mix(A, B, u));
    const dx = cx, dy = FLOOR - p.maxY - p.lift;
    const T = (pt) => [pt[0] + dx, pt[1] + dy];
    const hip = T(p.hip), sho = T(p.sho), neck = T(p.neck), head = T(p.head);
    const k1 = T(p.l1.knee), a1 = T(p.l1.ank), t1 = T(p.l1.toe), e1 = T(p.a1.el), w1 = T(p.a1.wr);
    let s = `<rect x="${box[0].toFixed(1)}" y="${box[1].toFixed(1)}" width="${box[2].toFixed(1)}" height="${box[3].toFixed(1)}" rx="10" fill="${PANEL}"/><line x1="${(box[0] + 6).toFixed(1)}" y1="${FLOOR + 4}" x2="${(box[0] + box[2] - 6).toFixed(1)}" y2="${FLOOR + 4}" stroke="#9aa3b8" stroke-width="2"/>`;
    const sup = (x0, x1, yTop, r) => `<rect x="${(x0).toFixed(1)}" y="${yTop.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${(FLOOR + 4 - yTop).toFixed(1)}" rx="${r || 3}" fill="${PROP}" opacity=".7"/>`;
    if (p.under === 'bench') s += sup(sho[0] - 20, hip[0] + 16, hip[1] + 7);
    if (p.under === 'shoulder') s += sup(sho[0] - 20, sho[0] + 18, sho[1] + 8);
    if (p.under === 'ankle') s += sup(a1[0] - 20, a1[0] + 22, a1[1] + 5);
    if (p.under === 'ankle2' && p.l2) { const a2 = T(p.l2.ank); s += sup(a2[0] - 18, a2[0] + 18, a2[1] + 5); }
    // oblik tijela: konusni udovi, ženstven torzo, rep
    const V = (a2, b2) => [b2[0] - a2[0], b2[1] - a2[1]];
    const tap = (a2, b2, r1, r2, c) => {
      const d2 = V(a2, b2), L2 = Math.hypot(d2[0], d2[1]) || 1, q = [-d2[1] / L2, d2[0] / L2];
      const P4 = [[a2[0] + q[0] * r1, a2[1] + q[1] * r1], [b2[0] + q[0] * r2, b2[1] + q[1] * r2], [b2[0] - q[0] * r2, b2[1] - q[1] * r2], [a2[0] - q[0] * r1, a2[1] - q[1] * r1]];
      return `<path d="M${P4.map((z) => z[0].toFixed(1) + ' ' + z[1].toFixed(1)).join('L')}Z" fill="${c}"/><circle cx="${a2[0].toFixed(1)}" cy="${a2[1].toFixed(1)}" r="${r1}" fill="${c}"/><circle cx="${b2[0].toFixed(1)}" cy="${b2[1].toFixed(1)}" r="${r2}" fill="${c}"/>`;
    };
    const lerp2 = (a2, b2, t) => [a2[0] + (b2[0] - a2[0]) * t, a2[1] + (b2[1] - a2[1]) * t];
    const leg = (kn, an, to, c) => { const m = lerp2(kn, an, 0.32); return tap(hip, kn, 10.5, 6.2, c) + tap(kn, m, 6.2, 6.9, c) + tap(m, an, 6.9, 3.6, c) + tap(an, to, 3.8, 2.4, c) + `<circle cx="${(an[0]).toFixed(1)}" cy="${(an[1]).toFixed(1)}" r="4.2" fill="${c}"/>`; };
    const arm = (el, wr, c) => tap(sho, el, 5.4, 4.2, c) + tap(el, wr, 4.2, 3.1, c) + `<circle cx="${wr[0].toFixed(1)}" cy="${wr[1].toFixed(1)}" r="3.6" fill="${c}"/>`;
    const sd = V(hip, sho), sl = Math.hypot(sd[0], sd[1]) || 1, ud = [sd[0] / sl, sd[1] / sl], nf = [-ud[1], ud[0]];
    const KEY = [[0, 11, 15], [0.1, 13, 19], [0.3, 10.5, 12], [0.5, 11, 10.5], [0.68, 16, 11.5], [0.88, 12, 11], [1, 7.5, 8]];
    const prof = (f) => { for (let i = 1; i < KEY.length; i++) if (f <= KEY[i][0]) { const k0 = KEY[i - 1], k1 = KEY[i], t = (f - k0[0]) / (k1[0] - k0[0]), m = t * t * (3 - 2 * t); return [k0[1] + (k1[1] - k0[1]) * m, k0[2] + (k1[2] - k0[2]) * m]; } return [KEY[6][1], KEY[6][2]]; };
    const fr = [], bk = [];
    for (let i = 0; i <= 24; i++) { const f = i / 24, sp = lerp2(hip, sho, f), pr = prof(f); fr.push([sp[0] + nf[0] * pr[0], sp[1] + nf[1] * pr[0]]); bk.push([sp[0] - nf[0] * pr[1], sp[1] - nf[1] * pr[1]]); }
    const torso = `<path d="M${fr.concat(bk.reverse()).map((z) => z[0].toFixed(1) + ' ' + z[1].toFixed(1)).join('L')}Z" fill="${BODY}" stroke="${BODY}" stroke-width="2" stroke-linejoin="round"/>`;
    const hc = head, base = [hc[0] - nf[0] * 7 + ud[0] * 3, hc[1] - nf[1] * 7 + ud[1] * 3], tail = [base[0] - nf[0] * 8, base[1] - nf[1] * 8 + 13];
    const headS = tap(sho, neck, 5.2, 3.8, BODY) + tap(neck, [hc[0] - ud[0] * 3, hc[1] - ud[1] * 3], 3.8, 3.8, BODY) + `<circle cx="${hc[0].toFixed(1)}" cy="${hc[1].toFixed(1)}" r="9.3" fill="${BODY}"/><circle cx="${(hc[0] + nf[0] * 8.6).toFixed(1)}" cy="${(hc[1] + nf[1] * 8.6).toFixed(1)}" r="2.2" fill="${BODY}"/>` + tap(base, tail, 4.2, 1.6, BODY);
    if (p.a2) { s += arm(T(p.a2.el), T(p.a2.wr), FAR); }
    if (p.l2) { s += leg(T(p.l2.knee), T(p.l2.ank), T(p.l2.toe), FAR); }
    s += leg(k1, a1, t1, BODY) + torso + headS + arm(e1, w1, BODY);
    // oprema
    const wp = (pt) => {
      if (p.w === 'db') return `<rect x="${(pt[0] - 8).toFixed(1)}" y="${(pt[1] - 3.5).toFixed(1)}" width="16" height="7" rx="2.5" fill="#f3b36b"/>`;
      if (p.w === 'bar') return `<circle cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="9" fill="#f3b36b"/><circle cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="2.5" fill="#1d2b4a"/>`;
      if (p.w === 'handle') return `<rect x="${(pt[0] - 7).toFixed(1)}" y="${(pt[1] - 2).toFixed(1)}" width="14" height="4" rx="2" fill="#f3b36b"/>`;
      return '';
    };
    if (p.w === 'barsho') s += `<circle cx="${sho[0].toFixed(1)}" cy="${(sho[1] - 2).toFixed(1)}" r="9" fill="#f3b36b"/><circle cx="${sho[0].toFixed(1)}" cy="${(sho[1] - 2).toFixed(1)}" r="2.5" fill="#1d2b4a"/>`;
    else if (p.w === 'barhip') s += `<circle cx="${hip[0].toFixed(1)}" cy="${(hip[1] - 4).toFixed(1)}" r="9" fill="#f3b36b"/><circle cx="${hip[0].toFixed(1)}" cy="${(hip[1] - 4).toFixed(1)}" r="2.5" fill="#1d2b4a"/>`;
    else s += wp(w1);
    return s;
  }

  /* horizontalni centar: srednja vrijednost granica oba položaja (stalan, bez drhtanja) */
  function centerX(id) {
    const xs = [0, 0.5, 1].flatMap((u) => { const [A, B] = P[id]; const p = solve(mix(A, B, u)); return [p.hip[0], p.sho[0], p.head[0], p.l1.ank[0], p.l1.toe[0], p.a1.wr[0]].concat(p.l2 ? [p.l2.ank[0], p.l2.toe[0]] : [], p.a2 ? [p.a2.wr[0]] : []); });
    return W / 2 - (Math.min(...xs) + Math.max(...xs)) / 2;
  }

  const BOXC = {};
  function boxOf(id) {
    if (BOXC[id]) return BOXC[id];
    const cx = centerX(id); let x0 = 1e9, x1 = -1e9, y0 = 1e9;
    [0, .25, .5, .75, 1].forEach((u) => {
      const [A, B] = P[id], p = solve(mix(A, B, u)), dy = FLOOR - p.maxY - p.lift;
      const pts = [p.hip, p.sho, p.neck, p.l1.knee, p.l1.ank, p.l1.toe, p.a1.el, p.a1.wr].concat(p.l2 ? [p.l2.knee, p.l2.ank, p.l2.toe] : [], p.a2 ? [p.a2.el, p.a2.wr] : []);
      pts.forEach((q) => { x0 = Math.min(x0, q[0] + cx - 14); x1 = Math.max(x1, q[0] + cx + 14); y0 = Math.min(y0, q[1] + dy - 14); });
      const h = p.head; x0 = Math.min(x0, h[0] + cx - 22); x1 = Math.max(x1, h[0] + cx + 14); y0 = Math.min(y0, h[1] + dy - 20);
    });
    let w = Math.max(150, x1 - x0 + 8), hh = Math.max(95, FLOOR + 10 - y0);
    if (w / hh < 1.25) w = hh * 1.25;               // najmanje malo „široki” okvir
    const bx = (x0 + x1) / 2 - w / 2, by = FLOOR + 10 - hh;
    return (BOXC[id] = [bx, by, w, hh]);
  }
  FS.figureSVG = (id, u, label) => { const b = boxOf(id); return `<svg viewBox="${b.map(f1).join(' ')}" class="fig" role="img" aria-label="${label || 'Prikaz vježbe i mišića'}" xmlns="http://www.w3.org/2000/svg">${frame(id, u, centerX(id), b)}</svg>`; };
  /* siluete su isključene dok trenerica ne snimi vlastite videe; za povratak postavi FS.config.siluete = true */
  FS.hasFigure = (id) => !!P[id] && !!(FS.config && FS.config.siluete);

  /* animacija: poziva se nakon prikaza stranice */
  FS.mountFigure = (host, id) => {
    if (!P[id] || !host) return;
    const cx = centerX(id), still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const box = boxOf(id);
    host.innerHTML = `<svg viewBox="${box.map(f1).join(' ')}" class="fig" role="img" aria-label="Animirani prikaz vježbe i mišića" xmlns="http://www.w3.org/2000/svg"><g></g></svg>`;
    const g = host.querySelector('g');
    const ease = (x) => x * x * (3 - 2 * x);
    const U = (t) => { const c = 3.4, x = (t % c); if (x < 1.2) return ease(x / 1.2); if (x < 1.5) return 1; if (x < 2.7) return 1 - ease((x - 1.5) / 1.2); return 0; };
    let raf = 0, t0 = 0, last = -1, dead = false;
    const draw = (u) => { g.innerHTML = frame(id, u, cx, box); };
    draw(still ? 1 : 0);
    if (still) return;
    const step = (ts) => {
      if (dead || !host.isConnected) return;
      if (!t0) t0 = ts;
      const u = U((ts - t0) / 1000);
      if (Math.abs(u - last) > 0.004) { draw(u); last = u; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    if (FS.onLeave) FS.onLeave(() => { dead = true; cancelAnimationFrame(raf); });
  };
})();
