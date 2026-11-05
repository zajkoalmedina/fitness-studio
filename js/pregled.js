/* Početni pregled za online coaching: video tehnike osnovnih vježbi + kretanje kroz dan.
   Klijentica šalje video u poruci (ili WhatsAppom), trenerica ocjenjuje tehniku i na osnovu toga piše plan. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, toast, Store, Auth, today, fmtDate, uid, bind, config } = FS;
  const V = (FS.views = FS.views || {});
  const recs = () => (Store.db.pregled = Store.db.pregled || []);
  const rec = (id) => recs().find((x) => x.userId === id) || null;
  const wa = () => { const n = String(config.whatsapp || '').replace(/\D/g, ''); return n ? 'https://wa.me/' + n : ''; };

  const VJ = [
    ['squat', 'Bodyweight Squat', 'Snimaj sa strane i spreda. 8 sporih ponavljanja, stopala u širini ramena.'],
    ['lunge', 'Reverse Lunge', 'Snimaj sa strane. 6 ponavljanja po nozi, bez utega.'],
    ['hinge', 'Hip Hinge (Romanian Deadlift)', 'Snimaj sa strane. 8 ponavljanja s metlom, bučicama ili praznim rukama.'],
    ['pushup', 'Push Up', 'Snimaj sa strane. 5 do 8 ponavljanja, na koljenima ili uz zid ako treba.'],
    ['plank', 'Plank', 'Snimaj sa strane. Drži koliko možeš, najviše 30 sekundi.']
  ];
  const Q = [
    ['koraci', 'Koliko koraka napraviš u prosječnom danu?', ['Manje od 4.000', '4.000 do 7.000', '7.000 do 10.000', 'Više od 10.000', 'Ne znam']],
    ['posao', 'Kakav je tvoj dan?', ['Pretežno sjedim', 'Pomalo sjedim, pomalo hodam', 'Većinu dana sam na nogama']],
    ['hodanje', 'Koliko se namjerno krećeš (hodanje, bicikl, šetnja)?', ['Gotovo nikako', 'Do 20 minuta dnevno', '20 do 45 minuta dnevno', 'Više od 45 minuta dnevno']],
    ['trenira', 'Koliko sada treniraš?', ['Ne treniram', '1 do 2 puta sedmično', '3 ili više puta sedmično']]
  ];
  const OC = [['', 'Nije ocijenjeno'], ['ok', 'Tehnika je u redu'], ['kor', 'Treba korekcija'], ['nov', 'Pošalji novi video']];

  V.pregled = (el) => {
    const u = Auth.user(), x = (u && rec(u.id)) || {}, a = x.odg || {};
    const link = wa();
    el.innerHTML = h`<div class="eyebrow">Online coaching</div><h1>Početni pregled</h1>
      <p class="muted">Prije nego složim tvoj plan, trebam vidjeti kako vježbaš i koliko se kreneš kroz dan. Tako je plan siguran i napravljen baš za tebe.</p>
      <div class="card"><h3>1. Snimi video vježbi</h3>
        <ul class="clean">${VJ.map(([id, n, t]) => h`<li><span class="tick">▶</span><span><b>${n}</b><br><span class="muted small">${t}</span>${x.oc && x.oc[id] && x.oc[id].s ? h`<br><span class="badge ${x.oc[id].s === 'ok' ? 'ok' : 'warn'}">${(OC.find((o) => o[0] === x.oc[id].s) || [0, ''])[1]}</span>${x.oc[id].n ? h` <span class="small">${x.oc[id].n}</span>` : ''}` : ''}</span></li>`)}</ul>
        <p class="small muted">Cijelo tijelo neka bude u kadru, dobro osvijetljeno. Ne moraju biti savršene, trebam vidjeti kako se kreneš. Videi mogu biti odvojeni ili jedan snimak.</p>
        <a class="btn primary block" href="#/moj?tab=poruke">Pošalji video u poruci</a>
        ${link ? h`<a class="btn block mt-s" href="${link}" target="_blank" rel="noopener">Pošalji preko WhatsAppa</a>` : ''}</div>
      <form data-act="pg" novalidate class="card"><h3>2. Koliko se krećeš kroz dan</h3>
        ${Q.map(([k, t, o]) => h`<label class="field"><span>${t}</span><select name="${k}"><option value="">Izaberi…</option>${o.map((v) => h`<option ${a[k] === v ? 'selected' : ''}>${v}</option>`)}</select></label>`)}
        <label class="field"><span>Kardio koji trenutno radiš (nije obavezno)</span><input name="kardio" maxlength="200" value="${a.kardio || ''}" placeholder="npr. šetnja psa 30 min, trčanje 2× sedmično"></label>
        <label class="field"><span>Bolovi ili ograničenja pri kretanju (nije obavezno)</span><input name="bol" maxlength="200" value="${a.bol || ''}" placeholder="npr. koljeno, leđa"></label>
        <button class="btn primary block" type="submit">Sačuvaj</button></form>
      <p class="small center muted">Videe vidi samo trenerica. Plan dobijaš nakon pregleda.</p>`;
    bind(el, { 'submit:pg': (f) => {
      const fd = new FormData(f), odg = {};
      [...Q.map((q) => q[0]), 'kardio', 'bol'].forEach((k) => { const v = fd.get(k); if (v && String(v).trim()) odg[k] = String(v).trim().slice(0, 200); });
      let r = rec(u.id); if (r) { r.odg = odg; r.datum = today(); r.vid = false; } else recs().push(r = { id: uid(), userId: u.id, datum: today(), odg, oc: {}, vid: false });
      Store.save(); toast('Sačuvano. Hvala!'); FS.rerender();
    } });
  };

  /* banner u prostoru klijentice */
  const b0 = FS.upitnikBanner;
  FS.upitnikBanner = (u) => {
    const s = b0 ? b0(u) : '';
    if (!u || !u.paket) return s;
    const x = rec(u.id);
    return h`${s}${x ? '' : h`<div class="card note"><b>Početni pregled</b><div class="small">Pošalji video osnovnih vježbi i reci koliko se krećeš kroz dan, pa ti slažem plan.</div><a class="btn sm primary mt-s" href="#/pregled">Počni pregled</a></div>`}`;
  };

  /* kartica kod trenerice */
  const c0 = FS.upitnikCard;
  FS.upitnikCard = (u) => {
    const x = rec(u.id), s = c0 ? c0(u) : '';
    if (x && !x.vid) { x.vid = true; Store.save(); }
    if (!x) return h`${s}<div class="card"><h3>Početni pregled</h3><p class="muted" style="margin:0">Još nije poslan. Videe i odgovore o kretanju klijentica šalje iz svog prostora.</p></div>`;
    const a = x.odg || {};
    return h`${s}<div class="card"><h3>Početni pregled</h3><p class="small muted">Poslano ${fmtDate(x.datum)} Videe pogledaj u razgovoru ispod.</p>
      <div class="small">${Q.map(([k, t]) => a[k] ? h`<div style="margin-bottom:4px"><b>${t}</b><br>${a[k]}</div>` : '')}${a.kardio ? h`<div><b>Kardio:</b> ${a.kardio}</div>` : ''}${a.bol ? h`<div><b>Ograničenja:</b> ${a.bol}</div>` : ''}</div>
      <div class="divider"></div>
      ${VJ.map(([id, n]) => { const o = (x.oc && x.oc[id]) || {}; return h`<div class="mb"><b>${n}</b>
        <div class="grid2"><select data-pgo="${u.id}|${id}|s">${OC.map(([v, l]) => h`<option value="${v}" ${o.s === v ? 'selected' : ''}>${l}</option>`)}</select>
        <input data-pgo="${u.id}|${id}|n" maxlength="200" placeholder="Napomena" value="${o.n || ''}"></div></div>`; })}</div>`;
  };
  document.addEventListener('change', (e) => {
    const t = e.target.closest && e.target.closest('[data-pgo]'); if (!t) return;
    const [uid_, ex, f] = t.dataset.pgo.split('|'), r = rec(uid_); if (!r) return;
    r.oc = r.oc || {}; (r.oc[ex] = r.oc[ex] || {})[f] = t.value.slice(0, 200); Store.save(); toast('Sačuvano.');
  });
})();
