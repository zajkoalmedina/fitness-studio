/* Koji mišići rade: p = primarni (glavni), s = sekundarni (pomažu) */
(function () {
  const FS = (window.FS = window.FS || {});
  const M = (p, s) => ({ p, s: s || [] });
  FS.MISIC_NAZIV = { 'grudi': 'prsni mišići', 'ramena': 'ramena', 'biceps': 'biceps', 'triceps': 'triceps', 'podlaktice': 'podlaktice (hvat)', 'leđa': 'gornji dio leđa', 'donja leđa': 'donji dio leđa', 'core': 'trbušni mišići (core)', 'glutei': 'gluteusi', 'kvadriceps': 'prednja loža (kvadriceps)', 'zadnja loža': 'zadnja loža', 'listovi': 'listovi', 'aduktori': 'unutrašnja strana natkoljenice', 'pregibači kuka': 'pregibači kuka' };
  FS.MUSKUL = {
    cucanj: M(['kvadriceps', 'glutei'], ['zadnja loža', 'aduktori', 'core', 'donja leđa']),
    goblet: M(['kvadriceps', 'glutei'], ['aduktori', 'core', 'donja leđa', 'podlaktice']),
    cucanjsipka: M(['kvadriceps', 'glutei'], ['zadnja loža', 'donja leđa', 'core']),
    frontcucanj: M(['kvadriceps'], ['glutei', 'core', 'donja leđa', 'leđa']),
    iskorak: M(['kvadriceps', 'glutei'], ['zadnja loža', 'aduktori', 'listovi']),
    iskorakhod: M(['glutei', 'kvadriceps'], ['zadnja loža', 'listovi', 'aduktori']),
    bugarski: M(['kvadriceps', 'glutei'], ['zadnja loža', 'core', 'aduktori']),
    stepup: M(['kvadriceps', 'glutei'], ['listovi', 'zadnja loža']),
    rdl: M(['zadnja loža', 'glutei'], ['donja leđa', 'leđa', 'podlaktice']),
    rdlsipka: M(['zadnja loža', 'glutei'], ['donja leđa', 'leđa', 'podlaktice']),
    veslanje: M(['leđa'], ['biceps', 'ramena', 'podlaktice', 'donja leđa']),
    veslanjesipka: M(['leđa'], ['biceps', 'ramena', 'podlaktice', 'donja leđa']),
    veslanjekabl: M(['leđa'], ['biceps', 'ramena', 'podlaktice']),
    lat: M(['leđa'], ['biceps', 'ramena', 'podlaktice']),
    sklek: M(['grudi'], ['triceps', 'ramena', 'core']),
    sklekzid: M(['grudi'], ['triceps', 'ramena', 'core']),
    bench: M(['grudi'], ['triceps', 'ramena']),
    potisakb: M(['grudi'], ['triceps', 'ramena']),
    kosibucice: M(['grudi', 'ramena'], ['triceps']),
    ramena: M(['ramena'], ['triceps', 'core']),
    potisaksipka: M(['ramena'], ['triceps', 'core']),
    bocno: M(['ramena'], ['leđa']),
    reversepec: M(['ramena', 'leđa'], ['triceps']),
    biceps: M(['biceps'], ['podlaktice']),
    triceps: M(['triceps'], ['ramena']),
    tricepskabl: M(['triceps'], ['ramena']),
    bridge: M(['glutei'], ['zadnja loža', 'core']),
    hipthrust: M(['glutei'], ['zadnja loža', 'kvadriceps', 'core']),
    hipthrust1: M(['glutei'], ['zadnja loža', 'core']),
    frogpump: M(['glutei'], ['aduktori', 'core']),
    sidelift: M(['glutei'], ['core', 'aduktori']),
    abdukcija: M(['glutei'], ['core']),
    abdgumom: M(['glutei'], ['core', 'kvadriceps']),
    pullthrough: M(['glutei', 'zadnja loža'], ['donja leđa', 'core']),
    kickback: M(['glutei'], ['zadnja loža', 'core']),
    backext: M(['donja leđa', 'glutei'], ['zadnja loža']),
    legpress: M(['kvadriceps', 'glutei'], ['zadnja loža', 'listovi']),
    legcurl: M(['zadnja loža'], ['listovi']),
    curlloptom: M(['zadnja loža'], ['glutei', 'listovi']),
    legext: M(['kvadriceps']),
    listovi: M(['listovi']),
    hodanje: M(['kvadriceps', 'listovi'], ['glutei', 'zadnja loža']),
    planka: M(['core'], ['ramena', 'glutei', 'grudi']),
    crunch: M(['core'], ['pregibači kuka']),
    twist: M(['core'], ['pregibači kuka', 'donja leđa']),
    deadbug: M(['core'], ['pregibači kuka']),
    birddog: M(['core', 'donja leđa'], ['glutei', 'ramena']),
    tva: M(['core'], ['donja leđa']), zdjelica: M(['core'], ['donja leđa']), heel: M(['core'], ['pregibači kuka']),
    vakuum: M(['core'], ['donja leđa']), krokodil: M(['core'], ['donja leđa']), disanje: M(['core'], ['donja leđa']),
    mackakrava: M(['donja leđa', 'leđa'], ['core']),
    m_tekstenzija: M(['leđa'], ['ramena']), m_otvaranje: M(['leđa'], ['core', 'ramena']), m_9090: M(['glutei', 'aduktori'], ['pregibači kuka']),
    m_zid: M(['ramena', 'leđa'], ['grudi']), m_golub: M(['glutei'], ['pregibači kuka']), m_dubokicucanj: M(['aduktori', 'glutei'], ['kvadriceps', 'listovi']),
    m_djecja: M(['donja leđa'], ['glutei', 'ramena']), m_zabica: M(['aduktori'], ['glutei']), m_hinge: M(['zadnja loža'], ['glutei', 'donja leđa']),
    m_gleznj: M(['listovi'], ['kvadriceps']), m_iskorak_kuk: M(['pregibači kuka'], ['kvadriceps', 'glutei']), m_zadnja_loza: M(['zadnja loža'], ['listovi']),
    m_kobra: M(['donja leđa'], ['glutei', 'grudi']), m_igla: M(['leđa'], ['ramena']), m_gumapull: M(['leđa', 'ramena'], ['triceps']),
    m_gumaveslo: M(['leđa'], ['biceps', 'podlaktice']), m_bocniiskorak: M(['aduktori', 'glutei'], ['kvadriceps']), m_skapula: M(['leđa'], ['grudi', 'core']),
    m_v_podizanje: M(['leđa'], ['ramena', 'donja leđa']), m_sjedeca_rotacija: M(['core'], ['leđa']), m_pas: M(['zadnja loža', 'listovi'], ['ramena']),
    m_kukovi_krug: M(['glutei'], ['core']), m_rame_krug: M(['ramena'], ['leđa']), m_ptica_reach: M(['leđa', 'donja leđa'], ['glutei', 'zadnja loža', 'ramena'])
  };
  Object.assign(FS.MUSKUL, FS.EXTRA_MUSKUL || {});
  /* za vježbe koje je trenerica dodala sama: grupa vježbe daje okvirnu sliku */
  const GR = { Noge: M(['kvadriceps', 'glutei']), Gluteusi: M(['glutei'], ['zadnja loža']), Leđa: M(['leđa'], ['biceps']), Prsa: M(['grudi'], ['triceps']), Ramena: M(['ramena']), Ruke: M(['biceps', 'triceps']), Core: M(['core']), Mobilnost: M(['donja leđa'], ['leđa']) };
  FS.muskulOf = (id) => {
    if (FS.MUSKUL[id]) return FS.MUSKUL[id];
    const e = FS.Store && FS.Store.ex ? FS.Store.ex(id) : null;
    return (e && GR[e.grupa]) || { p: [], s: [] };
  };
  /* mala slika (početni položaj) za liste vježbi */
  FS.thumb = (id) => (FS.hasFigure && FS.hasFigure(id) ? `<span class="fthumb">${FS.figureSVG(id, 1, '')}</span>` : '');
  /* oznake: primarno i sekundarno */
  FS.muskulChips = (id) => { const m = FS.muskulOf(id), n = (x) => FS.MISIC_NAZIV[x] || x; return { p: m.p.map(n), s: m.s.map(n) }; };
})();
