/* Lokalna "baza" (localStorage) + prijava. VAŽNO: ovo je probna verzija bez servera.
   Podaci žive samo na uređaju. Za pravu produkciju (više uređaja, stvarna sigurnost, uplate)
   Store i Auth treba zamijeniti pozivima prema serveru (npr. Supabase ili Firebase). */
(function () {
  const FS = (window.FS = window.FS || {});
  const { uid, iso, today, addDays } = FS;
  const KEY = 'fs_db_v1', SKEY = 'fs_session_v1', AKEY = 'fs_attempts_v1', DKEY = 'fs_draft_v1';
  const mem = {};
  const ls = {
    get(k) { try { const v = localStorage.getItem(k); return v == null ? null : v; } catch (e) { return mem[k] == null ? null : mem[k]; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { delete mem[k]; } }
  };

  /* ---------- kripto: PBKDF2 ---------- */
  const b64e = (u8) => btoa(String.fromCharCode(...u8));
  const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function hashPw(pw, salt) {
    if (!window.crypto || !crypto.subtle) throw new Error('Za sigurnu prijavu potrebna je HTTPS veza.');
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: b64d(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
    return b64e(new Uint8Array(bits));
  }
  const newSalt = () => b64e(crypto.getRandomValues(new Uint8Array(16)));
  const same = (a, b) => { if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };
  async function makeUser(o) {
    const salt = newSalt();
    return { id: uid(), ime: o.ime, email: o.email.trim().toLowerCase(), role: o.role || 'klijentica', salt, hash: await hashPw(o.pass, salt), paket: o.paket || null, aktivan: true, dob: o.dob || '18+', saglasnost: !!o.saglasnost, biljeska: '', programi: [], kreirano: today(), mora_promijeniti: !!o.mora_promijeniti };
  }

  /* ---------- demo podaci ---------- */
  function seedLogs(userId, progId) {
    const logs = [], mj = [];
    const t = today();
    const mon = FS.weekStart(t);
    for (let w = 7; w >= 0; w--) {
      const wk = addDays(mon, -7 * w);
      mj.push({ id: uid(), userId, datum: wk, tezina: Math.round((74.6 - (7 - w) * 0.35) * 10) / 10, struk: Math.round((82 - (7 - w) * 0.4) * 10) / 10, kukovi: Math.round((101 - (7 - w) * 0.25) * 10) / 10, biljeska: '' });
      const days = w === 0 ? [0, 2].filter((d) => addDays(wk, d) <= t) : [0, 2, 4];
      days.forEach((d, i) => {
        if (w === 7 && i === 2) return;
        const prog = FS.GOTOVI.find((p) => p.id === progId);
        const dan = prog.dani[i % prog.dani.length];
        logs.push({
          id: uid(), userId, datum: addDays(wk, d), programId: progId, dan: dan.naziv, trajanje: 45 + (i * 5), rpe: 6 + (i % 3), biljeska: '',
          vjezbe: dan.vj.filter((e) => e.id !== 'hodanje').map((e) => ({ id: e.id, serije: Array.from({ length: e.s }, () => ({ kg: ['sklekzid', 'bridge', 'tva', 'bocno', 'deadbug', 'cucanj'].includes(e.id) ? 0 : Math.round(8 + (7 - w) * 0.8 + i), rep: parseInt(e.r, 10) || 10, ok: true })) }))
        });
      });
    }
    return { logs, mj };
  }
  async function seed() {
    const trener = await makeUser({ ime: FS.config.trenerIme, email: 'trenerica@demo.ba', pass: 'Trener#2026', role: 'trener' });
    const ana = await makeUser({ ime: 'Ana Demić', email: 'ana@demo.ba', pass: 'Klijent#2026', paket: 'ACTIVE' });
    const maja = await makeUser({ ime: 'Maja Kovač', email: 'maja@demo.ba', pass: 'Klijent#2026', paket: 'START' });
    const lejla = await makeUser({ ime: 'Lejla Hodžić', email: 'lejla@demo.ba', pass: 'Klijent#2026', paket: 'STRONG' });
    const progAna = {
      id: 'ind_ana', naziv: 'Individualni program – Ana (4 sedmice)', opis: 'Prilagođeno cilju: snaga i oblikovanje, 3 dana sedmično.', nivo: 'srednji', sedmica: 4, dana: 3, cijena: 0, tip: 'individualni', uShopu: false, vlasnik: ana.id,
      dani: [
        { naziv: 'Dan 1 – Noge i gluteusi', vj: [{ id: 'goblet', s: 4, r: '10', n: '' }, { id: 'hipthrust', s: 4, r: '10', n: '' }, { id: 'rdl', s: 3, r: '10', n: '' }, { id: 'sidelift', s: 3, r: '15', n: '' }] },
        { naziv: 'Dan 2 – Gornji dio', vj: [{ id: 'veslanje', s: 3, r: '10', n: '' }, { id: 'potisakb', s: 3, r: '10', n: '' }, { id: 'ramena', s: 3, r: '10', n: '' }, { id: 'biceps', s: 2, r: '12', n: '' }, { id: 'triceps', s: 2, r: '12', n: '' }] },
        { naziv: 'Dan 3 – Fullbody', vj: [{ id: 'iskorak', s: 3, r: '10', n: '' }, { id: 'lat', s: 3, r: '12', n: '' }, { id: 'bridge', s: 3, r: '15', n: '' }, { id: 'deadbug', s: 3, r: '8', n: '' }] }]
    };
    ana.programi = [progAna.id];
    maja.programi = ['kuca']; // kupljeno
    const sa = seedLogs(ana.id, 'fullbody');
    const sm = seedLogs(maja.id, 'kuca');
    const db = {
      v: 1, users: [trener, ana, maja, lejla], programi: [progAna], logs: [...sa.logs, ...sm.logs.slice(0, 5)], mjere: [...sa.mj, ...sm.mj.slice(0, 4)],
      kupovine: [{ id: uid(), userId: maja.id, programId: 'kuca', datum: addDays(today(), -20), iznos: 39, demo: true }],
      poruke: [{ id: uid(), userId: lejla.id, tip: 'upit', tekst: 'Zanima me može li se plan prilagoditi za rad od kuće bez opreme.', datum: addDays(today(), -1), status: 'novo', odgovor: '' }],
      prijave: [{ id: uid(), ime: 'Sara (demo)', kontakt: '@sara.demo', paket: 'START', tekst: 'Počinjem od nule.', datum: addDays(today(), -2), status: 'novo' }],
      vjezbeMod: {}, vjezbeNove: []
    };
    return db;
  }

  /* ---------- Store ---------- */
  const Store = {
    db: null,
    async init() {
      const raw = ls.get(KEY);
      if (raw) { try { Store.db = JSON.parse(raw); } catch (e) { Store.db = null; } }
      if (!Store.db || !Store.db.users) { Store.db = await seed(); Store.save(); }
      return Store.db;
    },
    save() { ls.set(KEY, JSON.stringify(Store.db)); },
    async reset() { ls.del(KEY); ls.del(SKEY); ls.del(DKEY); Store.db = await seed(); Store.save(); },
    user(id) { return Store.db.users.find((u) => u.id === id); },
    klijentice() { return Store.db.users.filter((u) => u.role === 'klijentica'); },
    exercises() {
      const mod = Store.db.vjezbeMod || {};
      const gi = (e) => { const i = FS.GRUPE.indexOf(e.grupa); return i < 0 ? 99 : i; }, ni = (e) => { const i = FS.NIVOI.indexOf(e.nivo); return i < 0 ? 9 : i; };
      return FS.EXERCISES.map((e) => (mod[e.id] ? { ...e, ...mod[e.id] } : e)).concat(Store.db.vjezbeNove || [])
        .sort((a, b) => gi(a) - gi(b) || ni(a) - ni(b) || String(a.naziv).localeCompare(String(b.naziv), 'bs'));
    },
    ex(id) { return Store.exercises().find((e) => e.id === id); },
    allPrograms() { return FS.GOTOVI.map((p) => ({ ...p, ...((Store.db.programMod || {})[p.id] || {}) })).concat(Store.db.programi); },
    program(id) { return Store.allPrograms().find((p) => p.id === id); },
    shop() { return Store.allPrograms().filter((p) => p.uShopu && p.tip !== 'individualni'); },
    userPrograms(u) {
      return (u.programi || []).map((id) => Store.program(id)).filter(Boolean);
    },
    logsOf(uidv) { return Store.db.logs.filter((l) => l.userId === uidv).sort((a, b) => (a.datum < b.datum ? 1 : -1)); },
    mjereOf(uidv) { return Store.db.mjere.filter((m) => m.userId === uidv).sort((a, b) => (a.datum < b.datum ? -1 : 1)); },
    weekCount(uidv, from) { const a = from || FS.weekStart(today()), b = addDays(a, 6); return Store.db.logs.filter((l) => l.userId === uidv && l.datum >= a && l.datum <= b).length; },
    best(uidv) {
      const best = {};
      Store.db.logs.filter((l) => l.userId === uidv).forEach((l) => l.vjezbe.forEach((v) => v.serije.forEach((s) => {
        if (!s.ok && s.ok !== undefined) return;
        const kg = +s.kg || 0, rep = +s.rep || 0;
        const b = best[v.id] || (best[v.id] = { kg: 0, rep: 0, datum: l.datum });
        if (kg > b.kg || (kg === b.kg && rep > b.rep)) { b.kg = kg; b.rep = rep; b.datum = l.datum; }
      })));
      return best;
    },
    lastSets(uidv, exId) {
      const l = Store.logsOf(uidv).find((x) => x.vjezbe.some((v) => v.id === exId));
      return l ? l.vjezbe.find((v) => v.id === exId).serije : null;
    },
    /* težina iz prve zabilježene sedmice (najbolja serija prvog treninga te vježbe) */
    baseKg(uidv, exId) {
      const ls2 = Store.logsOf(uidv).filter((x) => x.vjezbe.some((v) => v.id === exId)); if (!ls2.length) return 0;
      const first = ls2[ls2.length - 1], v = first.vjezbe.find((q) => q.id === exId);
      return Math.max(0, ...v.serije.map((z) => +z.kg || 0));
    },
    draft: { get() { try { return JSON.parse(ls.get(DKEY)); } catch (e) { return null; } }, set(d) { ls.set(DKEY, JSON.stringify(d)); }, clear() { ls.del(DKEY); } }
  };

  /* ---------- Auth ---------- */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const Auth = {
    session() { try { const s = JSON.parse(ls.get(SKEY)); return s && s.exp > Date.now() ? s : null; } catch (e) { return null; } },
    user() { const s = Auth.session(); if (!s || !Store.db) return null; const u = Store.user(s.uid); return u && u.aktivan !== false ? u : null; },
    is(role) { const u = Auth.user(); return !!u && u.role === role; },
    logout() { ls.del(SKEY); Store.draft.clear(); },
    passOk(p) { return typeof p === 'string' && p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p); },
    async login(email, pass) {
      const a = (() => { try { return JSON.parse(ls.get(AKEY)) || {}; } catch (e) { return {}; } })();
      if (a.until && a.until > Date.now()) throw new Error(`Previše pokušaja. Pokušaj ponovo za ${Math.ceil((a.until - Date.now()) / 1000)} s.`);
      const u = Store.db.users.find((x) => x.email === String(email).trim().toLowerCase());
      let ok = false;
      if (u && u.aktivan !== false) ok = same(await hashPw(pass, u.salt), u.hash);
      else await hashPw(pass || 'x', newSalt()); // izjednačavanje vremena
      if (!ok) {
        a.n = (a.n || 0) + 1;
        if (a.n >= 5) { a.until = Date.now() + 60000; a.n = 0; }
        ls.set(AKEY, JSON.stringify(a));
        throw new Error('Pogrešan e-mail ili lozinka.');
      }
      ls.del(AKEY);
      ls.set(SKEY, JSON.stringify({ uid: u.id, exp: Date.now() + 7 * 864e5 }));
      return u;
    },
    async register({ ime, email, pass, dob, saglasnost }) {
      ime = String(ime || '').trim(); email = String(email || '').trim().toLowerCase();
      if (ime.length < 2) throw new Error('Unesi ime i prezime.');
      if (!EMAIL.test(email)) throw new Error('Unesi ispravnu e-mail adresu.');
      if (!Auth.passOk(pass)) throw new Error('Lozinka mora imati najmanje 8 znakova, slova i broj.');
      if (dob === 'ispod16') throw new Error('Aplikacija je namijenjena osobama od 16 godina. Javi se trenerici putem poruke.');
      if (dob === '16-17' && !saglasnost) throw new Error('Za osobe od 16 do 17 godina potrebna je pisana saglasnost roditelja ili staratelja.');
      if (Store.db.users.some((u) => u.email === email)) throw new Error('Račun s ovom e-mail adresom već postoji.');
      const u = await makeUser({ ime, email, pass, dob, saglasnost });
      Store.db.users.push(u); Store.save();
      ls.set(SKEY, JSON.stringify({ uid: u.id, exp: Date.now() + 7 * 864e5 }));
      return u;
    },
    async setPassword(userId, pass) {
      if (!Auth.passOk(pass)) throw new Error('Lozinka mora imati najmanje 8 znakova, slova i broj.');
      const u = Store.user(userId); u.salt = newSalt(); u.hash = await hashPw(pass, u.salt); Store.save();
    },
    async createClient({ ime, email, pass, paket }) {
      email = String(email || '').trim().toLowerCase();
      if (String(ime || '').trim().length < 2) throw new Error('Unesi ime klijentice.');
      if (!EMAIL.test(email)) throw new Error('Unesi ispravnu e-mail adresu.');
      if (!Auth.passOk(pass)) throw new Error('Privremena lozinka: najmanje 8 znakova, slova i broj.');
      if (Store.db.users.some((u) => u.email === email)) throw new Error('Račun s ovom e-mail adresom već postoji.');
      const u = await makeUser({ ime: ime.trim(), email, pass, paket: paket || null, mora_promijeniti: true });
      Store.db.users.push(u); Store.save(); return u;
    }
  };

  Object.assign(FS, { Store, Auth });
})();
