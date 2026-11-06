/* Ruter, navigacija i pokretanje aplikacije */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, icon, toast, closeSheet, Store, Auth, $ } = FS;

  const ROUTES = [
    ['', 'home'], ['paketi', 'paketi'], ['alati', 'alati'], ['vjezbe', 'vjezbe'], ['vjezba/:id', 'vjezba'],
    ['programi', 'programi'], ['program/:id', 'program'], ['dijastaza', 'dijastaza'], ['prica', 'prica'], ['ishrana', 'ishrana'], ['kondicija', 'kondicija'], ['kondsablon', 'kondsablon', 'trener'], ['suplementi', 'suplementi'], ['trcanje', 'trcanje'], ['rm', 'rm'], ['zagrijavanje', 'zagrijavanje'], ['hipertrofija', 'hipertrofija'], ['poruke', 'poruke', 'trener'], ['mjerenje', 'mjerenje'], ['upitnik', 'upitnik'], ['kond/:id', 'kond'], ['prijava', 'prijava'],
    ['moj', 'moj', 'klijentica'], ['pregled', 'pregled', 'klijentica'], ['trening/novi', 'trening_novi', 'klijentica'],
    ['trener', 'trener', 'trener'], ['trener/klijentica/:id', 'trener_klijentica', 'trener'], ['trener/program/:id', 'trener_program', 'trener']
  ];
  const DETAIL = new Set(['prica', 'vjezba', 'program', 'trening_novi', 'trener_klijentica', 'trener_program', 'paketi', 'dijastaza', 'ishrana', 'kond', 'kondsablon', 'suplementi', 'upitnik', 'pregled', 'trcanje', 'rm', 'zagrijavanje', 'hipertrofija', 'mjerenje']);
  const leave = [];
  FS.onLeave = (fn) => leave.push(fn);

  function parseHash() {
    const raw = (location.hash || '#/').slice(1);
    const [path, qs] = raw.split('?');
    const segs = path.split('/').filter(Boolean);
    const q = {}; new URLSearchParams(qs || '').forEach((v, k) => { q[k] = v; });
    return { segs, q };
  }
  function match(segs) {
    for (const [pat, name, role] of ROUTES) {
      const ps = pat.split('/').filter(Boolean);
      if (ps.length !== segs.length) continue;
      const params = {}; let ok = true;
      ps.forEach((s, i) => { if (s[0] === ':') params[s.slice(1)] = decodeURIComponent(segs[i]); else if (s !== segs[i]) ok = false; });
      if (ok) return { name, role, params };
    }
    return null;
  }

  function renderNav(name) {
    const u = Auth.user();
    const acc = u ? (u.role === 'trener' ? ['#/trener', 'Panel', 'users'] : ['#/moj', 'Moj prostor', 'user']) : ['#/prijava', 'Prijava', 'user'];
    const items0 = [['#/', 'Početna', 'home', ['home']], ['#/programi', 'Programi', 'list', ['programi', 'program', 'dijastaza', 'kondicija', 'kond']], ['#/vjezbe', 'Vježbe', 'dumbbell', ['vjezbe', 'vjezba']], ['#/alati', 'Alati', 'calc', ['alati', 'ishrana', 'suplementi']], [acc[0], acc[1], acc[2], ['prijava', 'moj', 'trening_novi', 'trener', 'trener_klijentica', 'trener_program']]];
    const items = items0.filter((it) => it[0] !== '#/vjezbe' || (u && u.role === 'trener'));
    if (u && u.role === 'trener') items.splice(items.length - 1, 0, ['#/poruke', 'Poruke', 'chat', ['poruke']]); /* poruke klijentica uvijek pri ruci, sa značkom nepročitanih */
    const fab = $('#fab'); if (fab) fab.hidden = !!(u && u.role === 'trener'); /* plutajući Instagram gumb je za klijentice, trenerici zaklanja sadržaj */
    $('#tabbar').innerHTML = h`${items.map(([href, label, ic, names]) => h`<a class="tab ${names.includes(name) ? 'on' : ''}" href="${href}" ${names.includes(name) ? 'aria-current="page"' : ''}>${icon(ic)}<span>${label}${href === '#/trener' && FS.obavNovo && FS.obavNovo() ? h` <b style="background:var(--rose-2);color:#fff;border-radius:99px;padding:0 6px;font-size:11px">${FS.obavNovo()}</b>` : ''}${href === '#/poruke' && FS.porukeNovo && FS.porukeNovo() ? h` <b style="background:var(--rose-2);color:#fff;border-radius:99px;padding:0 6px;font-size:11px">${FS.porukeNovo()}</b>` : ''}</span></a>`)}`.s;
  }
  FS.refreshNav = () => renderNav(FS.currentRoute);

  function route() {
    leave.splice(0).forEach((fn) => { try { fn(); } catch (e) { /* ignorisi */ } });
    closeSheet();
    const { segs, q } = parseHash();
    let m = match(segs);
    if (!m) { location.replace('#/'); return; }
    const u = Auth.user();
    if (m.role) {
      if (!u) { toast('Prijavi se za nastavak.'); location.replace('#/prijava'); return; }
      if (u.role !== m.role) { location.replace(u.role === 'trener' ? '#/trener' : '#/moj'); return; }
    }
    FS.currentRoute = m.name;
    renderNav(m.name);
    const back = $('#backBtn');
    back.hidden = !DETAIL.has(m.name);
    const main = $('#view');
    const page = document.createElement('div');
    main.replaceChildren(page);
    try { FS.views[m.name](page, m.params, q); }
    catch (e) {
      console.error(e);
      page.innerHTML = h`<div class="card alert"><h3>Došlo je do greške</h3><p class="muted">Pokušaj ponovo ili se vrati na početnu.</p><a class="btn block" href="#/">Početna</a></div>`.s;
    }
    window.scrollTo(0, 0);
  }
  FS.rerender = route;

  async function boot() {
    const back = $('#backBtn');
    back.innerHTML = icon('back').s;
    back.addEventListener('click', () => { if (history.length > 1) history.back(); else location.hash = '#/'; });
    window.addEventListener('hashchange', route);
    try { await Store.init(); }
    catch (e) { console.error(e); $('#view').innerHTML = '<div class="card alert"><h3>Greška pri pokretanju</h3><p>Podaci aplikacije nisu dostupni. Osvježi stranicu.</p></div>'; return; }
    route();
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
      navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW nije registrovan', e));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
