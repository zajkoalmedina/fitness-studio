/* Prava verzija: računi, podaci i snimci na Supabase serveru.
   Aktivira se samo kad u config.js postoji FS.config.supabase = { url, key }.
   Bez toga aplikacija radi kao probna verzija (podaci samo na uređaju). */
(function () {
  const FS = (window.FS = window.FS || {});
  const cfg = FS.config && FS.config.supabase;
  if (!cfg || !cfg.url || !cfg.key) return;
  FS.cloud = true;
  const { Store, Auth, uid, today, toast } = FS;
  const BASE = cfg.url.replace(/\/$/, ''), KEY = cfg.key;
  const SK = 'fs_sb_session';
  const COLLS = ['logs', 'mjere', 'poruke', 'chat', 'kupovine', 'prijave', 'programi', 'zahtjevi', 'upitnici', 'raspored', 'uplate', 'pozivnice'];
  const CONFIGS = ['vjezbeMod', 'vjezbeNove', 'programMod', 'cijene', 'pdfVodic'];
  const PROF = ['ime', 'telefon', 'programi', 'pstart', 'paket', 'jelovnik', 'aktivan', 'mora_promijeniti', 'dob', 'saglasnost'];
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignoriši */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignoriši */ } }
  };
  let sess = null;                      // { access_token, refresh_token, expires_at, user: { id, email } }
  let snap = new Map(), onServer = new Set(), profSnap = new Map(), since = '', timer = null, saving = false, again = false, saveTimer = null;

  const emptyDb = () => ({ v: 2, users: [], programi: [], logs: [], mjere: [], kupovine: [], poruke: [], prijave: [], chat: [], zahtjevi: [], upitnici: [], raspored: [], uplate: [], pozivnice: [], vjezbeMod: {}, vjezbeNove: [], programMod: {}, cijene: {}, pdfVodic: {} });

  /* ---------- niski sloj: pozivi prema serveru ---------- */
  function saveSess(s) { sess = s; if (s) store.set(SK, JSON.stringify(s)); else store.del(SK); }
  function setSession(j) {
    saveSess({ access_token: j.access_token, refresh_token: j.refresh_token, expires_at: Math.floor(Date.now() / 1000) + (j.expires_in || 3600), user: { id: j.user.id, email: j.user.email } });
  }
  let refreshing = null;
  function refresh() {
    if (!sess) return Promise.reject(new Error('Nema sesije.'));
    if (!refreshing) {
      refreshing = fetch(BASE + '/auth/v1/token?grant_type=refresh_token', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: sess.refresh_token }) })
        .then(async (r) => { const j = await r.json().catch(() => null); if (!r.ok || !j || !j.access_token) throw new Error('Sesija je istekla.'); setSession(j); })
        .finally(() => { refreshing = null; });
    }
    return refreshing;
  }
  async function api(path, o = {}) {
    const headers = { apikey: KEY, ...(o.headers || {}) };
    if (o.auth !== false && sess) {
      if (sess.expires_at - 60 < Date.now() / 1000) { try { await refresh(); } catch (e) { saveSess(null); } }
      if (sess) headers.Authorization = 'Bearer ' + sess.access_token;
    }
    let body = o.body;
    if (body !== undefined && !(body instanceof Blob)) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(body); }
    const r = await fetch(BASE + path, { method: o.method || 'GET', headers, body });
    if (r.status === 401 && sess && o.auth !== false && !o.retried) { try { await refresh(); return api(path, { ...o, retried: true }); } catch (e) { saveSess(null); } }
    if (o.raw) return r;
    const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) { /* nije JSON */ }
    if (!r.ok) { const er = new Error((j && (j.msg || j.message || j.error_description || j.error)) || 'Greška ' + r.status); er.status = r.status; er.code = j && (j.error_code || j.code); throw er; }
    return j;
  }
  async function fetchAll(table, query) {
    const out = [];
    for (let from = 0; ; from += 1000) {
      const r = await api(`/rest/v1/${table}?${query || 'select=*'}`, { headers: { Range: `${from}-${from + 999}`, 'Range-Unit': 'items' } });
      out.push(...r); if (r.length < 1000) break;
    }
    return out;
  }
  const nice = (e) => {
    const m = String((e && e.message) || e || '');
    if (/invalid login/i.test(m)) return 'Pogrešan e-mail ili lozinka.';
    if (/already (been )?registered|already exists/i.test(m)) return 'Račun s ovom e-mail adresom već postoji.';
    if (/not confirmed/i.test(m)) return 'E-mail adresa nije potvrđena.';
    if (/rate limit|too many|security purposes/i.test(m)) return 'Previše pokušaja. Pokušaj ponovo za nekoliko minuta.';
    if (/password/i.test(m) && /(least|weak|short)/i.test(m)) return 'Lozinka mora imati najmanje 8 znakova, slova i broj.';
    if (/database error saving|saving new user/i.test(m)) return 'Račun se može napraviti samo uz pozivnicu trenera. Javi se treneru.';
    if (/failed to fetch|network|load failed/i.test(m)) return 'Nema veze sa serverom. Provjeri internet.';
    return m || 'Došlo je do greške.';
  };

  /* ---------- učitavanje ---------- */
  const pf2user = (p) => ({ id: p.id, ime: p.ime || '', email: p.email || '', role: p.role, programi: p.programi || [], pstart: p.pstart || {}, paket: p.paket || null, jelovnik: p.jelovnik || undefined, aktivan: p.aktivan !== false, mora_promijeniti: !!p.mora_promijeniti, biljeska: '', telefon: p.telefon || '', dob: p.dob || '18+', saglasnost: !!p.saglasnost, created: p.created_at });
  const profJson = (u) => JSON.stringify(PROF.map((k) => (u[k] === undefined ? null : u[k])));
  function place(db, r) {
    if (r.coll === 'config') { db[r.id] = r.data && r.data.v !== undefined ? r.data.v : db[r.id]; return; }
    if (r.coll === 'biljeske') { const u = db.users.find((x) => x.id === r.id); if (u) u.biljeska = (r.data && r.data.v) || ''; return; }
    if (Array.isArray(db[r.coll])) { const i = db[r.coll].findIndex((x) => x.id === r.id); if (i >= 0) db[r.coll][i] = r.data; else db[r.coll].push(r.data); }
  }
  const owner = (o) => o.userId || o.vlasnik || null;
  function buildDocs(db) {
    const m = new Map();
    COLLS.forEach((c) => (db[c] || []).forEach((o) => { if (o && o.id) m.set(c + '/' + o.id, { coll: c, id: o.id, user_id: owner(o), data: o }); }));
    (db.users || []).forEach((u) => { if (u.biljeska) m.set('biljeske/' + u.id, { coll: 'biljeske', id: u.id, user_id: null, data: { id: u.id, v: u.biljeska } }); });
    CONFIGS.forEach((k) => m.set('config/' + k, { coll: 'config', id: k, user_id: null, data: { v: db[k] } }));
    return m;
  }
  function rebuildSnap(rows) {
    snap = new Map(); onServer = new Set();
    buildDocs(Store.db).forEach((d, k) => snap.set(k, JSON.stringify(d.data)));
    rows.forEach((r) => onServer.add(r.coll + '/' + r.id));
    profSnap = new Map(Store.db.users.map((u) => [u.id, profJson(u)]));
    since = rows.reduce((a, r) => (r.updated_at > a ? r.updated_at : a), '');
  }
  async function loadAll() {
    const db = emptyDb();
    if (sess) {
      const prof = await fetchAll('profiles', 'select=*&order=created_at.asc');
      db.users = prof.map(pf2user);
    }
    const rows = await fetchAll('docs', 'select=*&order=coll.asc,id.asc');
    Store.db = db;
    rows.forEach((r) => place(db, r));
    rebuildSnap(rows);
    CONFIGS.forEach((k) => { if (db[k] == null) db[k] = k === 'vjezbeNove' ? [] : {}; });
  }

  /* ---------- spremanje (razlika u odnosu na server) ---------- */
  async function flush() {
    if (saving) { again = true; return; }
    saving = true;
    try {
      const cur = buildDocs(Store.db), ins = [], upd = [], del = [];
      cur.forEach((d, k) => {
        const js = JSON.stringify(d.data), s = snap.get(k);
        if (s === js) return;
        if (!onServer.has(k)) { if (d.coll === 'config' && (js === '{"v":{}}' || js === '{"v":[]}')) return; ins.push(d); } else upd.push(d);
      });
      snap.forEach((_, k) => { if (!cur.has(k) && onServer.has(k)) del.push(k); });
      for (let i = 0; i < ins.length; i += 50) {
        const part = ins.slice(i, i + 50);
        await api('/rest/v1/docs' + (sess ? '?on_conflict=coll,id' : ''), { method: 'POST', headers: { Prefer: (sess ? 'resolution=merge-duplicates,' : '') + 'return=minimal' }, body: part.map((d) => ({ coll: d.coll, id: d.id, user_id: d.user_id, data: d.data })) });
        part.forEach((d) => { const k = d.coll + '/' + d.id; snap.set(k, JSON.stringify(d.data)); onServer.add(k); });
      }
      for (const d of upd) {
        await api(`/rest/v1/docs?coll=eq.${encodeURIComponent(d.coll)}&id=eq.${encodeURIComponent(d.id)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: { data: d.data, user_id: d.user_id } });
        snap.set(d.coll + '/' + d.id, JSON.stringify(d.data));
      }
      const byColl = {};
      del.forEach((k) => { const [c, ...r] = k.split('/'); (byColl[c] = byColl[c] || []).push(r.join('/')); });
      for (const c of Object.keys(byColl)) {
        await api(`/rest/v1/docs?coll=eq.${encodeURIComponent(c)}&id=in.(${byColl[c].map(encodeURIComponent).join(',')})`, { method: 'DELETE' });
        byColl[c].forEach((id) => { snap.delete(c + '/' + id); onServer.delete(c + '/' + id); });
      }
      // profili
      if (sess) {
        for (const u of Store.db.users) {
          const js = profJson(u);
          if (profSnap.get(u.id) === js) continue;
          const body = {}; PROF.forEach((k) => { if (u[k] !== undefined) body[k] = u[k]; });
          if (body.jelovnik === undefined) body.jelovnik = null;
          await api(`/rest/v1/profiles?id=eq.${u.id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body });
          profSnap.set(u.id, js);
        }
        const gone = [...profSnap.keys()].filter((id) => !Store.db.users.some((u) => u.id === id));
        for (const id of gone) {
          await api(`/rest/v1/docs?user_id=eq.${id}`, { method: 'DELETE' });
          await api(`/rest/v1/profiles?id=eq.${id}`, { method: 'DELETE' });
          profSnap.delete(id);
        }
      }
    } catch (e) {
      console.warn('Spremanje nije uspjelo', e);
      FS.syncError = true; toast('Promjena još nije sačuvana. Provjeri internet, pokušat ću ponovo.');
      clearTimeout(saveTimer); saveTimer = setTimeout(() => Store.save(), 15000);
    } finally {
      saving = false;
      if (again) { again = false; Store.save(); }
    }
  }
  Store.save = function () { clearTimeout(saveTimer); saveTimer = setTimeout(flush, 250); };
  Store.flush = flush;
  Store.reset = async () => { /* u pravoj verziji nema resetovanja podataka */ };

  /* ---------- osvježavanje (nove poruke i izmjene s drugih uređaja) ---------- */
  async function poll() {
    if (!sess || document.hidden || saving) return;
    try {
      const rows = await api(`/rest/v1/docs?select=*&updated_at=gt.${encodeURIComponent(since)}&order=updated_at.asc`);
      const changed = new Set(); let newMsg = false;
      rows.forEach((r) => {
        if (r.updated_at > since) since = r.updated_at;
        const k = r.coll + '/' + r.id, js = JSON.stringify(r.data);
        if (r.coll === 'biljeske') { onServer.add(k); return; }
        if (snap.get(k) === js) { onServer.add(k); return; }
        const db = Store.db;
        // ne diraj stavku koju sam upravo mijenjam i još nije sačuvana
        let local;
        if (r.coll === 'config') local = JSON.stringify({ v: db[r.id] }); else local = JSON.stringify((db[r.coll] || []).find((x) => x.id === r.id));
        if (snap.has(k) && local !== snap.get(k)) return;
        place(db, r); snap.set(k, js); onServer.add(k); changed.add(r.coll);
        if (r.coll === 'chat' && r.data && r.data.from !== (Auth.user() || {}).role.replace('klijentica', 'klijent')) newMsg = true;
      });
      if (sess && Auth.user() && Auth.user().role === 'trener') {
        const prof = await fetchAll('profiles', 'select=*&order=created_at.asc');
        prof.forEach((p) => {
          const nu = pf2user(p), i = Store.db.users.findIndex((x) => x.id === p.id), js = profJson(nu);
          if (i < 0) { Store.db.users.push(nu); profSnap.set(p.id, js); changed.add('users'); }
          else if (profSnap.get(p.id) !== js && profJson(Store.db.users[i]) === profSnap.get(p.id)) { Store.db.users[i] = nu; profSnap.set(p.id, js); changed.add('users'); }
        });
      }
      if (changed.size) {
        window.dispatchEvent(new CustomEvent('fs:docs', { detail: { colls: [...changed] } }));
        if (FS.refreshNav) FS.refreshNav();
        if (newMsg) toast('Nova poruka.');
      }
    } catch (e) { /* mreža se vratila kasnije */ }
  }
  function startPolling() { stopPolling(); timer = setInterval(poll, 10000); document.addEventListener('visibilitychange', onVis); }
  function stopPolling() { clearInterval(timer); timer = null; document.removeEventListener('visibilitychange', onVis); }
  function onVis() { if (!document.hidden) poll(); }

  /* ---------- Store ---------- */
  Store.init = async function () {
    // povratak sa linka za novu lozinku: #access_token=...&type=recovery
    const h = location.hash || '';
    if (/access_token=/.test(h)) {
      const p = new URLSearchParams(h.replace(/^#\/?/, '').replace(/^.*?(access_token=)/, '$1'));
      try {
        const u = await fetch(BASE + '/auth/v1/user', { headers: { apikey: KEY, Authorization: 'Bearer ' + p.get('access_token') } }).then((r) => r.json());
        saveSess({ access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_at: Math.floor(Date.now() / 1000) + (+p.get('expires_in') || 3600), user: { id: u.id, email: u.email } });
        if (p.get('type') === 'recovery') FS.pendingRecovery = true;
      } catch (e) { /* neispravan link */ }
      history.replaceState(null, '', location.pathname + location.search + '#/');
    } else {
      try { sess = JSON.parse(store.get(SK)); } catch (e) { sess = null; }
    }
    if (sess) { try { if (sess.expires_at - 60 < Date.now() / 1000) await refresh(); } catch (e) { saveSess(null); } }
    try { await loadAll(); }
    catch (e) {
      console.warn(e);
      if (sess && e.status === 401) { saveSess(null); try { await loadAll(); } catch (e2) { Store.db = emptyDb(); } } else { Store.db = emptyDb(); FS.offline = true; }
    }
    if (sess) startPolling();
    if (FS.pendingRecovery) setTimeout(recoverySheet, 700);
    return Store.db;
  };
  function recoverySheet() {
    const { h, openSheet, closeSheet, bind, formData, $ } = FS;
    openSheet(h`<h2>Nova lozinka</h2><form data-act="np" novalidate><label class="field"><span>Nova lozinka (min. 8 znakova, slovo i broj)</span><input name="p" type="password" autocomplete="new-password"></label><p class="err" id="nperr" hidden></p><button class="btn primary block" type="submit">Sačuvaj lozinku</button></form>`, (s) => bind(s, {
      'submit:np': async (f) => { try { await Auth.setPassword(sess.user.id, formData(f).p); closeSheet(); toast('Lozinka je promijenjena.'); } catch (e) { const er = $('#nperr', s); er.textContent = e.message; er.hidden = false; } }
    }));
  }

  /* ---------- Auth ---------- */
  Auth.session = () => (sess ? { uid: sess.user.id } : null);
  Auth.user = () => { if (!sess || !Store.db) return null; const u = Store.user(sess.user.id); return u && u.aktivan !== false ? u : null; };
  Auth.logout = () => {
    api('/auth/v1/logout', { method: 'POST' }).catch(() => {});
    saveSess(null); stopPolling(); Store.draft.clear();
    Store.db = emptyDb(); snap = new Map();
    loadAll().then(() => { if (FS.rerender) FS.rerender(); }).catch(() => {});
  };
  Auth.login = async (email, pass) => {
    email = String(email || '').trim().toLowerCase();
    if (!EMAIL.test(email) || !pass) throw new Error('Unesi e-mail i lozinku.');
    try {
      const j = await api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password: pass }, auth: false });
      setSession(j);
    } catch (e) { throw new Error(nice(e)); }
    await loadAll();
    const u = Auth.user();
    if (!u) { saveSess(null); throw new Error('Račun nije aktivan. Javi se trenerici.'); }
    startPolling();
    return u;
  };
  Auth.register = async ({ ime, email, pass, dob, saglasnost }) => {
    ime = String(ime || '').trim(); email = String(email || '').trim().toLowerCase();
    if (ime.length < 2) throw new Error('Unesi ime i prezime.');
    if (!EMAIL.test(email)) throw new Error('Unesi ispravnu e-mail adresu.');
    if (!Auth.passOk(pass)) throw new Error('Lozinka mora imati najmanje 8 znakova, slova i broj.');
    if (dob === 'ispod16') throw new Error('Aplikacija je namijenjena osobama od 16 godina. Javi se trenerici putem poruke.');
    if (dob === '16-17' && !saglasnost) throw new Error('Za osobe od 16 do 17 godina potrebna je pisana saglasnost roditelja ili staratelja.');
    let j;
    try { j = await api('/auth/v1/signup', { method: 'POST', body: { email, password: pass, data: { ime, odgovornost_potvrdjena: new Date().toISOString() } }, auth: false }); } catch (e) { throw new Error(nice(e)); }
    if (!j || !j.access_token) throw new Error('Račun je napravljen, ali prijava nije moguća dok se e-mail ne potvrdi. Javi se trenerici.');
    setSession(j);
    await loadAll();
    const u = Auth.user();
    if (!u) throw new Error('Račun je napravljen, ali profil nije učitan. Prijavi se ponovo.');
    u.dob = dob || '18+'; u.saglasnost = !!saglasnost; Store.save();
    startPolling();
    return u;
  };
  Auth.setPassword = async (userId, pass) => {
    if (!Auth.passOk(pass)) throw new Error('Lozinka mora imati najmanje 8 znakova, slova i broj.');
    if (!sess || userId !== sess.user.id) throw new Error('Tuđu lozinku ne možeš postaviti. Pošalji link za novu lozinku.');
    try { await api('/auth/v1/user', { method: 'PUT', body: { password: pass } }); } catch (e) { throw new Error(nice(e)); }
  };
  Auth.sendReset = async (email) => {
    email = String(email || '').trim().toLowerCase();
    if (!EMAIL.test(email)) throw new Error('Unesi ispravnu e-mail adresu.');
    const back = encodeURIComponent(location.origin + location.pathname);
    try { await api('/auth/v1/recover?redirect_to=' + back, { method: 'POST', body: { email }, auth: false }); } catch (e) { throw new Error(nice(e)); }
  };
  Auth.createClient = async ({ ime, email, pass, paket }) => {
    email = String(email || '').trim().toLowerCase();
    if (String(ime || '').trim().length < 2) throw new Error('Unesi ime klijentice.');
    if (!EMAIL.test(email)) throw new Error('Unesi ispravnu e-mail adresu.');
    if (!Auth.passOk(pass)) throw new Error('Privremena lozinka: najmanje 8 znakova, slova i broj.');
    // novi račun se pravi bez prijave, da trenerica ostane prijavljena
    const r = await fetch(BASE + '/auth/v1/signup', { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass, data: { ime: ime.trim() } }) });
    const j = await r.json().catch(() => null);
    if (!r.ok) throw new Error(nice(j && (j.msg || j.message || j.error_description) ? { message: j.msg || j.message || j.error_description } : { message: 'Greška ' + r.status }));
    const id = (j && (j.user ? j.user.id : j.id)) || null;
    if (!id) throw new Error('Račun nije napravljen.');
    await api(`/rest/v1/profiles?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: { paket: paket || null, mora_promijeniti: true } });
    await loadAll();
    return Store.user(id);
  };

  /* ---------- snimci (glasovne i video poruke) ---------- */
  const path = (id) => id.split('/').map(encodeURIComponent).join('/');
  FS.media = {
    async put(id, blob) {
      await api('/storage/v1/object/chat/' + path(id), { method: 'POST', headers: { 'Content-Type': (blob.type || 'application/octet-stream').split(';')[0], 'x-upsert': 'true' }, body: blob });
      return true;
    },
    async get(id) {
      try { const r = await api('/storage/v1/object/authenticated/chat/' + path(id), { raw: true }); return r.ok ? await r.blob() : null; } catch (e) { return null; }
    },
    async del(id) { try { await api('/storage/v1/object/chat', { method: 'DELETE', body: { prefixes: [id] } }); } catch (e) { /* ignoriši */ } }
  };
  FS.cloudInfo = () => ({ offline: !!FS.offline });
})();
