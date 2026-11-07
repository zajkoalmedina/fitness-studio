/* Dodjela klijentici: odvojeno cijeli programi, pojedinačni treninzi (mjesto → dio tijela) i kondicija */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, bind, toast, Store, today, openSheet, closeSheet } = FS;
  const rid = () => 'ind_' + Math.random().toString(36).slice(2, 9);

  /* klonira trening iz biblioteke u individualni program klijentice; klijentica ne vidi da je pripremljen unaprijed */
  FS.dodijeli = (u, srcId) => {
    let v = srcId, naziv = '';
    const push = (cp) => { Store.db.programi.push(cp); v = cp.id; naziv = cp.naziv; };
    const kb = String(srcId).startsWith('k:') ? FS.kond(String(srcId).slice(2)) : null;
    const src = kb ? null : Store.program(srcId);
    if (kb) {
      const k = JSON.parse(JSON.stringify(kb)); const nz = k.naziv, op = k.opis; delete k.id; delete k.naziv; delete k.samoTrener;
      push({ id: rid(), naziv: nz, opis: op || 'Trening prilagođen tebi.', nivo: k.nivo || 'srednji', sedmica: 1, dana: 1, cijena: 0, tip: 'individualni', uShopu: false, vlasnik: u.id, dani: [{ naziv: nz, vj: [] }], kond: k });
    } else if (src && src.samoTrener && (src.tip === 'gotov' || src.tip === 'kond')) {
      const cp = JSON.parse(JSON.stringify(src)); delete cp.samoTrener; delete cp.mj; delete cp.kat; if (!cp.per || (cp.per.tip === 'nema' && !cp.per.deload)) delete cp.per;
      cp.id = rid(); cp.tip = 'individualni'; cp.vlasnik = u.id; cp.uShopu = false; cp.cijena = 0;
      cp.naziv = String(src.naziv).replace(/^(Teretana|Kućni treninzi|Kućni|Kuća|Kod kuće|Biblioteka)\s·\s/, ''); cp.opis = src.kond ? (src.opis || 'Trening prilagođen tebi.') : 'Individualni program prilagođen tebi.';
      push(cp);
    } else if (src) naziv = src.naziv;
    u.programi = u.programi || []; u.programi.push(v); (u.dodijeljeno = u.dodijeljeno || []).push(v); (u.pstart = u.pstart || {})[v] = today();
    Store.save(); return naziv;
  };

  const lib = () => Store.allPrograms().filter((x) => x.samoTrener && x.tip === 'gotov');
  const kuca = (k) => /bez opreme/i.test(k.oprema || '');

  FS.dodjelaSheet = (u, mode) => {
    const st = { mode, mj: 'teretana', kat: '', kmj: 'kuca', done: {} };
    const have = (id) => (u.programi || []).includes(id);
    const chip = (act, val, label, on) => h`<button type="button" class="chip${on ? ' on' : ''}" data-act="${act}" data-v="${val}">${label}</button>`;
    const row = (id, naziv, meta) => h`<div class="row between" style="padding:8px 0;border-top:1px solid var(--line,#ddd)"><div class="grow"><b>${naziv}</b><div class="small muted">${meta}</div></div>${st.done[id] ? h`<span class="small">✓ Dodijeljeno</span>` : h`<button class="btn sm primary" data-act="pick" data-id="${id}">Dodijeli</button>`}</div>`;
    const draw = (sh) => {
      let body = '';
      if (st.mode === 'cijeli') {
        const L = lib().filter((x) => x.kat === 'cijeli'), own = Store.db.programi.filter((x) => x.tip === 'gotov' && !x.samoTrener && !have(x.id));
        body = h`<p class="muted small">Cijeli višesedmični programi. Klijentica ih vidi kao svoj individualni program.</p>${L.map((x) => row(x.id, x.naziv, `${x.sedmica} sedmica · ${x.dana} dana · ${x.nivo}`))}
          ${own.length ? h`<h3 class="mt">Moji programi</h3>${own.map((x) => row(x.id, x.naziv, `${x.sedmica || ''} sedmica`))}` : ''}`;
      } else if (st.mode === 'pojed') {
        const M = lib().filter((x) => x.mj === st.mj && x.kat !== 'cijeli'), kats = FS.KAT.filter(([k]) => M.some((x) => x.kat === k));
        if (!kats.some(([k]) => k === st.kat)) st.kat = kats.length ? kats[0][0] : '';
        body = h`<div class="row" style="flex-wrap:wrap;gap:6px">${FS.MJESTA.map(([k, n]) => chip('mj', k, n, st.mj === k))}</div>
          <div class="row mt-s" style="flex-wrap:wrap;gap:6px">${kats.map(([k, n]) => chip('kat', k, `${n} (${M.filter((x) => x.kat === k).length})`, st.kat === k))}</div>
          <div class="mt-s">${M.filter((x) => x.kat === st.kat).map((x) => row(x.id, x.naziv.replace(/^(Teretana|Kućni treninzi|Kućni)\s·\s/, ''), `${x.dana} dan(a) · ${x.nivo}`))}</div>`;
      } else {
        const mine = Store.db.programi.filter((x) => x.kond && x.tip === 'kond');
        const K = FS.KOND.filter((k) => (st.kmj === 'kuca' ? kuca(k) : st.kmj === 'teretana' ? !kuca(k) : false));
        body = h`<div class="row" style="flex-wrap:wrap;gap:6px">${chip('kmj', 'kuca', 'Kućni (bez opreme)', st.kmj === 'kuca')}${chip('kmj', 'teretana', 'Teretana (oprema)', st.kmj === 'teretana')}${chip('kmj', 'moji', `Moji šabloni (${mine.length})`, st.kmj === 'moji')}</div>
          <div class="mt-s">${st.kmj === 'moji' ? (mine.length ? mine.map((x) => row(x.id, x.naziv, x.kond.tip)) : h`<p class="muted">Još nema šablona. <a href="#/kondsablon">Napravi šablon</a></p>`) : K.map((k) => row('k:' + k.id, k.naziv, `${k.tip} · ${k.nivo} · ${k.oprema}`))}</div>`;
      }
      sh.innerHTML = h`<h2>${u.ime}: ${st.mode === 'cijeli' ? 'Cijeli programi' : st.mode === 'pojed' ? 'Pojedinačni treninzi' : 'Kondicija'}</h2>${body}<button class="btn block mt" data-act="close">Gotovo</button>`;
    };
    openSheet(h``, (sh) => {
      draw(sh);
      bind(sh, {
        'click:mj': (b) => { st.mj = b.dataset.v; st.kat = ''; draw(sh); },
        'click:kat': (b) => { st.kat = b.dataset.v; draw(sh); },
        'click:kmj': (b) => { st.kmj = b.dataset.v; draw(sh); },
        'click:pick': (b) => { const n = FS.dodijeli(u, b.dataset.id); st.done[b.dataset.id] = 1; toast('Dodijeljeno: ' + n); draw(sh); },
        'click:close': () => { closeSheet(); FS.rerender(); }
      });
    });
  };
})();
