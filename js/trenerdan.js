/* Trenerica: cijeli trening klijentice za bilo koju sedmicu, izgleda kao kod nje (bez štoperice), s uređivanjem */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, bind, opts } = FS;
  const GOT = () => (FS.GOTOVI || []);
  const V = (FS.views = FS.views || {});
  const Store = () => FS.Store;

  V.trener_dan = (el, p, q) => {
    const u = FS.Auth.user();
    if (!u || u.role !== 'trener') { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    const S = Store(), src = S.program(p.id);
    if (!src) { el.innerHTML = h`<div class="empty">Program nije pronađen.</div><a class="btn block" href="#/trener?tab=programi">Nazad</a>`; return; }
    const builtin = GOT().some((x) => x.id === src.id);
    const P = JSON.parse(JSON.stringify(src));
    const kl = q.k && S.user(q.k) ? S.user(q.k) : (P.vlasnik && S.user(P.vlasnik) ? S.user(P.vlasnik) : null);
    FS.perKlijent = kl;
    let week = Math.min(parseInt(P.sedmica, 10) || 1, Math.max(1, parseInt(q.w, 10) || (kl ? FS.currentWeek(kl, P) : 1)));
    let di = Math.max(0, Math.min(P.dani.length - 1, parseInt(q.d, 10) || 0));
    let dirty = false;
    const pz = (s) => (s >= 60 && s % 60 === 0 ? s / 60 + ' min' : s + ' s');

    const draw = () => {
      FS.perKlijent = kl;
      const wi = FS.weekInfo(P, week), days = FS.weekDays(P, week), plan = FS.weekPlan(P, week);
      if (!plan.some((z) => z.i === di) && plan.length) di = plan[0].i;
      const d = days[di], base = P.dani[di], bidx = base.vj.map((b, k) => k).filter((k) => !FS.applyWeek(P, week, di, base.vj[k]).skip);
      const exOpts = S.exercises().map((e) => [e.id, `${e.grupa} · ${e.naziv}`]);
      el.innerHTML = h`<a href="#/trener/program/${P.id}" class="small">← Uredi program</a>
        <div class="eyebrow mt-s">${P.naziv}${kl ? ' · ' + kl.ime : ''}</div><h1>${d.naziv}</h1>
        <div class="weeks" role="tablist">${Array.from({ length: parseInt(P.sedmica, 10) || 1 }, (_, i) => i + 1).map((n) => h`<button class="wk ${n === week ? 'on' : ''}" data-act="wk" data-w="${n}"><span class="wk-l">Sed.</span><b>${n}</b></button>`)}</div>
        <div class="weekinfo"><b class="serif">Sedmica ${week} · ${wi.deload ? 'Deload' : wi.faza}</b><div class="small mt-s">Težina oko ${wi.loadPct} % težine iz 1. sedmice. Rezerva: ${wi.rir} ponavljanja.${wi.pump ? ' Pump serije 15–25 ponavljanja s drop setom na kraju.' : ''}</div></div>
        <div class="row wrap mt-s mb">${plan.map((z) => h`<button class="chip ${z.i === di ? 'on' : ''}" data-act="dy" data-i="${z.i}">${P.dani[z.i].naziv.replace(/^Faza \d · /, '')}</button>`)}</div>
        <p class="small" style="color:var(--beige)">Ovako trening vidi klijentica (bez štoperice). Vježbe uređuješ ispod svake kartice, a izmjena vrijedi za sve sedmice, sedmične razlike dolaze iz periodizacije.</p>
        ${d.vj.map((x) => {
          const bi = bidx[d.vj.indexOf(x)] != null ? bidx[d.vj.indexOf(x)] : -1;
          const e = S.ex(x.id) || { naziv: x.id }, last = kl ? S.lastSets(kl.id, x.id) : null;
          const pk = kl && FS.predlogKg ? FS.predlogKg(kl.id, x, week, P) : null;
          const baseKg = kl && x.pct ? S.baseKg(kl.id, x.id) : 0;
          const sug = pk ? pk.kg : (baseKg ? Math.round((baseKg * x.pct / 100) / (baseKg >= 20 ? 2.5 : 1)) * (baseKg >= 20 ? 2.5 : 1) : 0);
          const cilj = x.r + (pk ? ' · prijedlog ' + sug + ' kg (prošli put ' + pk.prev + ' kg: ' + pk.txt + ')' : x.pct ? ' · ≈ ' + x.pct + ' % težine iz 1. sedmice' + (sug ? ' (prijedlog ' + sug + ' kg)' : '') : '');
          const pa = FS.pauza ? FS.pauza(x) : 0, b = bi >= 0 ? base.vj[bi] : null;
          return h`<div class="card"><div class="row between"><div class="grow"><a href="#/vjezba/${x.id}"><b style="color:var(--cream);font-size:17px">${e.naziv}</b></a>
            <div class="small">Cilj: ${cilj}</div>${pa ? h`<div class="small rest">Pauza između serija: ${pz(pa)}</div>` : (pa === 0 ? h`<div class="small rest">Bez pauze: odmah sljedeća vježba</div>` : '')}${x.n ? h`<div class="small" style="color:var(--beige)">${x.n}</div>` : ''}${x.ds ? h`<div class="mt-s"><span class="chip on">${x.tag === 'pump' ? 'Pump: drop set na zadnjoj seriji' : 'Drop set na zadnjoj seriji'}</span></div>` : ''}${last ? h`<div class="small">Zadnji put: ${last.map((s) => (+s.kg > 0 ? s.kg + ' kg × ' : '') + s.rep).join(' · ')}</div>` : ''}</div></div>
            <div class="setrow small mt-s" style="margin-bottom:4px"><span></span><span class="center">kg</span><span class="center">ponavljanja</span><span></span></div>
            ${Array.from({ length: x.s }, (_, si) => h`<div class="setrow"><span class="n">${si + 1}</span><input readonly value="${sug ? sug : (last && last[si] && last[si].kg ? last[si].kg : '')}" placeholder="0"><input readonly value="${parseInt(x.r, 10) || ''}" placeholder="0"><button class="ok" type="button" tabindex="-1" aria-hidden="true">✓</button></div>`)}
            ${b ? h`<details class="mt-s"><summary style="cursor:pointer"><b>Uredi vježbu</b></summary>
              <div class="row mt-s"><select data-act="xe" data-i="${bi}" class="grow">${opts(exOpts, b.id)}</select><button class="icon-btn" data-act="xup" data-i="${bi}" aria-label="Gore">↑</button><button class="icon-btn" data-act="xdn" data-i="${bi}" aria-label="Dolje">↓</button><button class="icon-btn" data-act="rm" data-i="${bi}" aria-label="Ukloni">✕</button></div>
              <div class="grid3 mt-s"><label class="field" style="margin:0"><span>Serije</span><input data-act="xs" data-i="${bi}" inputmode="numeric" value="${b.s}"></label><label class="field" style="margin:0;grid-column:span 2"><span>Ponavljanja</span><input data-act="xr" data-i="${bi}" value="${b.r}" maxlength="30"></label></div>
              <div class="grid2 mt-s"><label class="field" style="margin:0"><span>Pauza (s)</span><input data-act="xp" data-i="${bi}" inputmode="numeric" placeholder="auto" value="${b.fix && b.p != null && b.p !== 0 ? b.p : ''}"></label><label class="check" style="margin:0;align-self:end"><input type="checkbox" data-act="xds" data-i="${bi}" ${b.ds ? 'checked' : ''}><span>Drop set</span></label></div>
              <label class="check mt-s"><input type="checkbox" data-act="xpump" data-i="${bi}" ${b.pump ? 'checked' : ''}><span>Pump vježba (15–25 ponavljanja u pump sedmici)</span></label>
              <input class="mt-s" data-act="xn" data-i="${bi}" value="${b.n || ''}" placeholder="Napomena uz vježbu" maxlength="120"></details>` : ''}</div>`;
        })}
        <button class="btn block mb" data-act="add">+ Dodaj vježbu</button>
        <button class="btn primary block" data-act="save" ${dirty ? '' : 'disabled'}>Sačuvaj izmjene</button>`;
    };
    draw();
    const mark = () => { dirty = true; const b = el.querySelector('[data-act=save]'); if (b) b.disabled = false; };
    const B = (t) => P.dani[di].vj[+t.dataset.i];
    bind(el, {
      'click:wk': (t) => { week = +t.dataset.w; draw(); },
      'click:dy': (t) => { di = +t.dataset.i; draw(); },
      'change:xe': (t) => { B(t).id = t.value; mark(); draw(); },
      'input:xs': (t) => { B(t).s = parseInt(t.value, 10) || 0; mark(); },
      'input:xr': (t) => { B(t).r = t.value; mark(); },
      'input:xn': (t) => { B(t).n = t.value; mark(); },
      'input:xp': (t) => { const x = B(t), v = parseInt(t.value, 10); if (t.value.trim() !== '' && v >= 0 && v <= 900) { x.fix = true; x.p = v; } else { delete x.fix; delete x.p; } mark(); },
      'change:xds': (t) => { const x = B(t); if (t.checked) x.ds = true; else delete x.ds; mark(); },
      'change:xpump': (t) => { const x = B(t); if (t.checked) x.pump = true; else delete x.pump; mark(); },
      'click:xup': (t) => { const a = P.dani[di].vj, i = +t.dataset.i; if (i > 0) { [a[i - 1], a[i]] = [a[i], a[i - 1]]; mark(); draw(); } },
      'click:xdn': (t) => { const a = P.dani[di].vj, i = +t.dataset.i; if (i < a.length - 1) { [a[i + 1], a[i]] = [a[i], a[i + 1]]; mark(); draw(); } },
      'click:rm': (t) => { if (P.dani[di].vj.length < 2) { FS.toast('Dan mora imati barem jednu vježbu.'); return; } P.dani[di].vj.splice(+t.dataset.i, 1); mark(); draw(); },
      'click:add': () => {
        let qs = '';
        const rows = () => h`${S.exercises().filter((e) => !qs || (e.naziv + ' ' + e.grupa).toLowerCase().includes(qs.toLowerCase())).map((e) => h`<button class="ex" style="width:100%;text-align:left;font:inherit" data-act="pickex" data-id="${e.id}"><div class="grow"><b>${e.naziv}</b><div class="small">${e.grupa} · ${e.nivo}</div></div></button>`)}`.s;
        FS.openSheet(h`<h2>Dodaj vježbu</h2><label class="field"><input type="search" data-act="pq" placeholder="Pretraži…"></label><div id="pl">${FS.raw(rows())}</div>`, (sh) => bind(sh, {
          'input:pq': (i) => { qs = i.value; sh.querySelector('#pl').innerHTML = rows(); },
          'click:pickex': (b) => { P.dani[di].vj.push({ id: b.dataset.id, s: 3, r: '10', n: '' }); FS.closeSheet(); mark(); draw(); }
        }));
      },
      'click:save': () => {
        if (P.dani.some((d) => d.vj.some((x) => !(x.s > 0) || !String(x.r).trim()))) { FS.toast('Unesi serije i ponavljanja za sve vježbe.'); return; }
        if (builtin) { S.db.programMod = S.db.programMod || {}; S.db.programMod[P.id] = { naziv: P.naziv, opis: P.opis, nivo: P.nivo, sedmica: P.sedmica, dana: P.dana, cijena: P.cijena, uShopu: P.uShopu, dani: P.dani, per: FS.perOf(P) }; }
        else { const i = S.db.programi.findIndex((x) => x.id === P.id); if (i >= 0) S.db.programi[i] = P; }
        S.save(); dirty = false; FS.toast('Trening sačuvan.'); draw();
      }
    });
  };
})();
