/* Koji mišići rade: p = primarni (glavni), s = sekundarni (pomažu) */
(function () {
  const FS = (window.FS = window.FS || {});
  const M = (p, s) => ({ p, s: s || [] });
  FS.MISIC_NAZIV = { 'grudi': 'prsni mišići', 'ramena': 'ramena', 'biceps': 'biceps', 'triceps': 'triceps', 'podlaktice': 'podlaktice (hvat)', 'leđa': 'gornji dio leđa', 'donja leđa': 'donji dio leđa', 'core': 'trbušni mišići (core)', 'gluteus': 'gluteusi', 'kvadriceps': 'prednja loža (kvadriceps)', 'zadnja loža': 'zadnja loža', 'listovi': 'listovi', 'aduktori': 'unutrašnja strana natkoljenice', 'pregibači kuka': 'pregibači kuka' };
  FS.MUSKUL = {
    cucanj: M(['kvadriceps', 'gluteus'], ['zadnja loža', 'aduktori', 'core', 'donja leđa']),
    goblet: M(['kvadriceps', 'gluteus'], ['aduktori', 'core', 'donja leđa', 'podlaktice']),
    cucanjsipka: M(['kvadriceps', 'gluteus'], ['zadnja loža', 'donja leđa', 'core']),
    frontcucanj: M(['kvadriceps'], ['gluteus', 'core', 'donja leđa', 'leđa']),
    iskorak: M(['kvadriceps', 'gluteus'], ['zadnja loža', 'aduktori', 'listovi']),
    iskorakhod: M(['gluteus', 'kvadriceps'], ['zadnja loža', 'listovi', 'aduktori']),
    bugarski: M(['kvadriceps', 'gluteus'], ['zadnja loža', 'core', 'aduktori']),
    stepup: M(['kvadriceps', 'gluteus'], ['listovi', 'zadnja loža']),
    rdl: M(['zadnja loža', 'gluteus'], ['donja leđa', 'leđa', 'podlaktice']),
    rdlsipka: M(['zadnja loža', 'gluteus'], ['donja leđa', 'leđa', 'podlaktice']),
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
    bridge: M(['gluteus'], ['zadnja loža', 'core']),
    hipthrust: M(['gluteus'], ['zadnja loža', 'kvadriceps', 'core']),
    hipthrust1: M(['gluteus'], ['zadnja loža', 'core']),
    frogpump: M(['gluteus'], ['aduktori', 'core']),
    sidelift: M(['gluteus'], ['core', 'aduktori']),
    abdukcija: M(['gluteus'], ['core']),
    abdgumom: M(['gluteus'], ['core', 'kvadriceps']),
    pullthrough: M(['gluteus', 'zadnja loža'], ['donja leđa', 'core']),
    kickback: M(['gluteus'], ['zadnja loža', 'core']),
    backext: M(['donja leđa', 'gluteus'], ['zadnja loža']),
    legpress: M(['kvadriceps', 'gluteus'], ['zadnja loža', 'listovi']),
    legcurl: M(['zadnja loža'], ['listovi']),
    curlloptom: M(['zadnja loža'], ['gluteus', 'listovi']),
    legext: M(['kvadriceps']),
    listovi: M(['listovi']),
    hodanje: M(['kvadriceps', 'listovi'], ['gluteus', 'zadnja loža']),
    planka: M(['core'], ['ramena', 'gluteus', 'grudi']),
    crunch: M(['core'], ['pregibači kuka']),
    twist: M(['core'], ['pregibači kuka', 'donja leđa']),
    deadbug: M(['core'], ['pregibači kuka']),
    birddog: M(['core', 'donja leđa'], ['gluteus', 'ramena']),
    tva: M(['core'], ['donja leđa']), zdjelica: M(['core'], ['donja leđa']), heel: M(['core'], ['pregibači kuka']),
    vakuum: M(['core'], ['donja leđa']), krokodil: M(['core'], ['donja leđa']), disanje: M(['core'], ['donja leđa']),
    mackakrava: M(['donja leđa', 'leđa'], ['core']),
    m_tekstenzija: M(['leđa'], ['ramena']), m_otvaranje: M(['leđa'], ['core', 'ramena']), m_9090: M(['gluteus', 'aduktori'], ['pregibači kuka']),
    m_zid: M(['ramena', 'leđa'], ['grudi']), m_golub: M(['gluteus'], ['pregibači kuka']), m_dubokicucanj: M(['aduktori', 'gluteus'], ['kvadriceps', 'listovi']),
    m_djecja: M(['donja leđa'], ['gluteus', 'ramena']), m_zabica: M(['aduktori'], ['gluteus']), m_hinge: M(['zadnja loža'], ['gluteus', 'donja leđa']),
    m_gleznj: M(['listovi'], ['kvadriceps']), m_iskorak_kuk: M(['pregibači kuka'], ['kvadriceps', 'gluteus']), m_zadnja_loza: M(['zadnja loža'], ['listovi']),
    m_kobra: M(['donja leđa'], ['gluteus', 'grudi']), m_igla: M(['leđa'], ['ramena']), m_gumapull: M(['leđa', 'ramena'], ['triceps']),
    m_gumaveslo: M(['leđa'], ['biceps', 'podlaktice']), m_bocniiskorak: M(['aduktori', 'gluteus'], ['kvadriceps']), m_skapula: M(['leđa'], ['grudi', 'core']),
    m_v_podizanje: M(['leđa'], ['ramena', 'donja leđa']), m_sjedeca_rotacija: M(['core'], ['leđa']), m_pas: M(['zadnja loža', 'listovi'], ['ramena']),
    m_kukovi_krug: M(['gluteus'], ['core']), m_rame_krug: M(['ramena'], ['leđa']), m_ptica_reach: M(['leđa', 'donja leđa'], ['gluteus', 'zadnja loža', 'ramena'])
  };
  Object.assign(FS.MUSKUL, FS.EXTRA_MUSKUL || {});
  /* za vježbe koje je trenerica dodala sama: grupa vježbe daje okvirnu sliku */
  const GR = { Noge: M(['kvadriceps', 'gluteus']), Gluteusi: M(['gluteus'], ['zadnja loža']), Leđa: M(['leđa'], ['biceps']), Prsa: M(['grudi'], ['triceps']), Ramena: M(['ramena']), Ruke: M(['biceps', 'triceps']), Core: M(['core']), Mobilnost: M(['donja leđa'], ['leđa']) };
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
