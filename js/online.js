/* Online klijentice: video izvođenja ispod vježbe (šalje trenerici) + korekcije (jedna, više ili sve) + rokovi korekcija planova.
   Video je obična poruka u razgovoru (chat) s oznakom vj {pid, ex, naziv}; odgovor trenerice je poruka s oznakom odg. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, today, addDays, uid, toast, icon, $ } = FS;
  const V = (FS.views = FS.views || {});
  const jeT = () => { const u = FS.Auth.user(); return !!u && u.role === 'trener'; };
  const chat = () => (Store.db.chat = Store.db.chat || []);
  const MAXV = 80 * 1024 * 1024;
  const KOR = ['Dublje spusti kukove', 'Leđa ravna', 'Koljena prema van', 'Uspori spuštanje', 'Gurni petama', 'Sve je ok'];
  const timeOf = (ts) => { const d = new Date(ts); return d.getDate() + '.' + (d.getMonth() + 1) + '. ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  const videos = () => chat().filter((m) => m.vj && m.from !== 'trener');
  const reply = (m) => chat().find((r) => r.odg === m.id);
  FS.videiNovo = () => (jeT() ? videos().filter((m) => !reply(m)).length : 0);
  /* zadnji odgovor trenerice za ovu vježbu u ovom programu */
  const feedbackZa = (u, pid, ex) => chat().filter((r) => r.userId === u.id && r.from === 'trener' && r.odg && r.vj && r.vj.pid === pid && r.vj.ex === ex).sort((a, b) => b.ts - a.ts)[0];
  const poslano = (u, pid, ex) => videos().filter((m) => m.userId === u.id && m.vj.pid === pid && m.vj.ex === ex).sort((a, b) => b.ts - a.ts)[0];

  /* ---------- klijentica: video ispod vježbe u programu ---------- */
  const online = (u) => !!u && u.role === 'klijentica' && FS.vrsta(u) === 'online';
  const posalji = async (u, pid, ex, file) => {
    if (!/^video\//.test(file.type) && !/\.(mp4|mov|m4v|webm)$/i.test(file.name)) { toast('Izaberi video snimak.'); return false; }
    if (file.size > MAXV) { toast('Video je prevelik. Snimi kraći (do 30 sekundi).'); return false; }
    toast('Šaljem video…');
    const id = (FS.media ? u.id + '/' : '') + 'm_' + uid();
    try { await FS.fileStore.put(id, file); } catch (e) { toast('Video nije poslan. Provjeri internet.'); return false; }
    const e = Store.ex(ex);
    chat().push({ id: uid(), userId: u.id, from: 'klijent', ts: Date.now(), tekst: 'Video: ' + (e ? e.naziv : ex), read: false, media: { id, kind: 'video', mime: file.type || '', size: file.size, dur: 0 }, vj: { pid, ex, naziv: e ? e.naziv : ex } });
    Store.save(); toast('Video poslan trenerici.'); return true;
  };
  /* video se šalje na WhatsApp trenerice (ne zauzima prostor u aplikaciji); poruka je unaprijed napisana */
  const wa = (u, ex) => { const e = Store.ex(ex); return 'https://wa.me/' + ((FS.config && FS.config.whatsapp) || '38762734397') + '?text=' + encodeURIComponent('Zdravo, ' + u.ime + ' ovdje. Šaljem video vježbe: ' + (e ? e.naziv : ex) + '.'); };
  const dekoriraj = (el, prog) => {
    const u = FS.Auth.user(); if (!online(u) || !prog || prog.tip === 'vodic') return;
    el.querySelectorAll('.day-b ul.clean li').forEach((li) => {
      if (li.querySelector('.vidx')) return;
      const a = li.querySelector('a[href^="#/vjezba/"]'); if (!a) return;
      const ex = a.getAttribute('href').split('/').pop(), fb = feedbackZa(u, prog.id, ex), sent = poslano(u, prog.id, ex);
      const box = document.createElement('div'); box.className = 'vidx small mt-s';
      box.innerHTML = h`${fb ? h`<div class="fbox"><b>Trenerica:</b><ul>${(fb.kor && fb.kor.length ? fb.kor : [fb.tekst]).map((t) => h`<li>${t}</li>`)}</ul></div>` : sent ? h`<span class="badge">video poslan, čeka odgovor</span> ` : ''}<a class="btn sm" target="_blank" rel="noopener" href="${wa(u, ex)}">${icon('video')} Pošalji video na WhatsApp</a>`.s;
      (li.querySelector('.grow') || li).appendChild(box);
    });
  };
  const v0 = V.program;
  V.program = (el, p, q) => {
    v0(el, p, q);
    const prog = Store.program(p.id); if (!prog) return;
    const mo = new MutationObserver(() => { mo.disconnect(); dekoriraj(el, prog); mo.observe(el, { childList: true, subtree: true }); });
    dekoriraj(el, prog); mo.observe(el, { childList: true, subtree: true });
    FS.onLeave && FS.onLeave(() => mo.disconnect());
  };

  /* preuzimanje snimka na računar (da ga trenerica može obrisati iz aplikacije i osloboditi prostor) */
  FS.preuzmi = async (mid, ime) => {
    const b = await FS.fileStore.get(mid); if (!b) { toast('Snimak nije dostupan.'); return; }
    const url = URL.createObjectURL(b), a = document.createElement('a'); a.href = url; a.download = ime; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const obrisi = (m) => { if (m.media) FS.fileStore.del(m.media.id); const r = reply(m); Store.db.chat = chat().filter((x) => x.id !== m.id && !(r && x.id === r.id)); Store.save(); };
  const mb = (n) => (n / 1048576).toFixed(n > 10485760 ? 0 : 1) + ' MB';

  /* ---------- trenerica: videi klijentica i korekcije ---------- */
  const SEL = {};
  V.videi = (el) => {
    if (!jeT()) { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    const ms = videos().sort((a, b) => b.ts - a.ts), novi = ms.filter((m) => !reply(m)).length, urls = [];
    FS.onLeave && FS.onLeave(() => urls.forEach((x) => URL.revokeObjectURL(x)));
    const ime = (id) => { const x = Store.user(id); return x ? x.ime : '?'; };
    el.innerHTML = h`<div class="eyebrow">Online klijentice</div><h1>Videi vježbi${novi ? h` <span class="badge" style="background:var(--rose-2);color:#fff">${novi}</span>` : ''}</h1>
      ${ms.length ? h`<div class="card flat"><div class="row between"><span class="small">Videa: <b>${ms.length}</b> · zauzima oko <b>${mb(ms.reduce((t, m) => t + ((m.media && m.media.size) || 0), 0))}</b></span>${ms.some((m) => reply(m)) ? h`<button class="btn sm danger" data-clean="1">Obriši sve odgovorene</button>` : ''}</div><p class="small muted" style="margin:6px 0 0">Preuzmi video na računar pa ga obriši da ne zauzima prostor.</p></div>` : ''}
      <p class="small muted">Klijentice ti šalju snimak izvođenja ispod vježbe u svom planu. Označi jednu, više ili sve korekcije i pošalji. Odgovor odmah vide ispod te vježbe.</p>
      ${ms.length ? ms.map((m) => { const r = reply(m), sel = (SEL[m.id] = SEL[m.id] || new Set());
        return h`<div class="card" data-vid="${m.id}"><div class="row between"><div><b>${ime(m.userId)}</b> · ${m.vj.naziv}<div class="small muted">${timeOf(m.ts)}</div></div><span class="badge ${r ? 'ok' : 'warn'}">${r ? 'odgovoreno' : 'novo'}</span></div>
          <div class="cmedia mt-s" data-mid="${m.media ? m.media.id : ''}" data-kind="video">Video se učitava…</div>
          <div class="row mt-s"><button class="btn sm grow" data-dl="${m.id}">Preuzmi</button><button class="btn sm danger grow" data-rm="${m.id}">Obriši video</button></div>
          ${r ? h`<div class="small mt-s"><b>Tvoj odgovor:</b> ${(r.kor && r.kor.length ? r.kor : [r.tekst]).join(' · ')}</div>` : h`
            <div class="row wrap mt-s">${KOR.map((k) => h`<button type="button" class="btn sm ${sel.has(k) ? 'primary' : ''}" data-k="${k}">${k}</button>`)}<button type="button" class="btn sm" data-all="1">Označi sve</button></div>
            <label class="field mt-s"><span>Svoja rečenica (nije obavezno)</span><input data-txt maxlength="200" placeholder="npr. odlično, samo uspori"></label>
            <button class="btn primary block" data-send="1">Pošalji korekciju${sel.size ? ' (' + sel.size + ')' : ''}</button>`}</div>`; })
        : h`<div class="card flat center"><p class="muted">Još nema videa od klijentica.</p></div>`}`;
    el.querySelectorAll('.cmedia[data-mid]').forEach(async (box) => {
      const b = box.dataset.mid ? await FS.fileStore.get(box.dataset.mid) : null;
      if (!b) { box.textContent = 'Video nije dostupan na ovom uređaju.'; box.classList.add('muted'); return; }
      const url = URL.createObjectURL(b); urls.push(url); box.innerHTML = `<video controls playsinline preload="metadata" src="${url}" style="width:100%;border-radius:12px"></video>`;
    });
    el.querySelectorAll('[data-dl]').forEach((b) => b.addEventListener('click', () => { const m = chat().find((x) => x.id === b.dataset.dl); if (m && m.media) FS.preuzmi(m.media.id, (ime(m.userId) + '-' + m.vj.naziv + '-' + new Date(m.ts).toISOString().slice(0, 10)).replace(/[^\p{L}\p{N}\-]+/gu, '_') + '.mp4'); }));
    el.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', async () => { const m = chat().find((x) => x.id === b.dataset.rm); if (!m || !await FS.confirmSheet({ title: 'Obrisati video?', text: 'Video i tvoj odgovor bit će trajno uklonjeni. Prvo ga preuzmi ako ti treba.', ok: 'Obriši', danger: true })) return; obrisi(m); toast('Video obrisan.'); if (FS.refreshNav) FS.refreshNav(); V.videi(el); }));
    const cl = el.querySelector('[data-clean]'); if (cl) cl.addEventListener('click', async () => { const l = ms.filter((m) => reply(m)); if (!await FS.confirmSheet({ title: 'Obrisati ' + l.length + ' odgovorenih videa?', text: 'Videi i odgovori bit će trajno uklonjeni. Preuzmi ih prije ako ti trebaju.', ok: 'Obriši sve', danger: true })) return; l.forEach(obrisi); toast('Obrisano.'); V.videi(el); });
    el.querySelectorAll('[data-vid]').forEach((card) => {
      const id = card.dataset.vid, m = chat().find((x) => x.id === id), sel = SEL[id];
      const keep = () => { const t = card.querySelector('[data-txt]'); if (t) SEL[id + '|t'] = t.value; };
      card.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { keep(); sel.has(b.dataset.k) ? sel.delete(b.dataset.k) : sel.add(b.dataset.k); V.videi(el); }));
      const all = card.querySelector('[data-all]'); if (all) all.addEventListener('click', () => { keep(); if (sel.size === KOR.length) sel.clear(); else KOR.forEach((k) => sel.add(k)); V.videi(el); });
      const t = card.querySelector('[data-txt]'); if (t && SEL[id + '|t']) t.value = SEL[id + '|t'];
      const snd = card.querySelector('[data-send]');
      if (snd) snd.addEventListener('click', () => {
        const txt = (t ? t.value : '').trim(), kor = [...sel].concat(txt ? [txt] : []);
        if (!kor.length) { toast('Označi bar jednu korekciju ili napiši rečenicu.'); return; }
        chat().push({ id: uid(), userId: m.userId, from: 'trener', ts: Date.now(), tekst: kor.join(' · '), kor, read: false, odg: m.id, vj: m.vj });
        m.read = true; delete SEL[id]; Store.save(); toast('Korekcija poslana.'); if (FS.refreshNav) FS.refreshNav(); V.videi(el);
      });
    });
  };

  /* ---------- trenerica: rokovi korekcija online planova ---------- */
  const rok = (u) => { const r = FS.pristupRec(u.id); if (r && r.korekcija) return r.korekcija; const d = addDays(today(), 14); FS.setPristup(u.id, { korekcija: d }); return d; };
  const dd = (a, b) => Math.round((FS.parse(b) - FS.parse(a)) / 86400000);
  V.rokovi = (el) => {
    if (!jeT()) { el.innerHTML = h`<div class="empty">Samo za trenericu.</div>`; return; }
    const kl = Store.klijentice().filter((u) => u.aktivan !== false && FS.vrsta(u) === 'online').map((u) => ({ u, d: rok(u) })).sort((a, b) => (a.d < b.d ? -1 : 1));
    const lbl = (d) => { const n = dd(today(), d); return n < 0 ? 'kasni ' + -n + ' d' : n === 0 ? 'danas' : 'za ' + n + ' d'; };
    el.innerHTML = h`<div class="eyebrow">Online klijentice</div><h1>Rokovi korekcija</h1>
      <p class="small muted">Poredano po tome kome prvo treba korekcija plana. Kad označiš "Urađeno", sljedeći rok se postavi za odabrani broj dana (obično 14).</p>
      <label class="field"><span>Sljedeći rok za</span><select id="rdana"><option value="7">7 dana</option><option value="14" selected>14 dana</option><option value="21">21 dan</option><option value="28">28 dana</option></select></label>
      ${kl.length ? kl.map(({ u, d }) => h`<div class="card"><div class="row between"><div><a href="#/trener/klijentica/${u.id}"><b>${u.ime}</b></a><div class="small muted">Rok korekcije: ${FS.fmtDate(d)}</div></div><span class="badge ${dd(today(), d) < 0 ? 'warn' : dd(today(), d) <= 3 ? '' : 'ok'}">${lbl(d)}</span></div>
        <div class="row mt-s"><button class="btn sm primary grow" data-done="${u.id}">Urađeno</button><button class="btn sm grow" data-plan="${u.id}">U planer</button></div></div>`) : h`<div class="card flat center"><p class="muted">Nema online klijentica. Vrstu klijentice postavi na njenom profilu.</p></div>`}`;
    el.querySelectorAll('[data-done]').forEach((b) => b.addEventListener('click', () => { FS.setPristup(b.dataset.done, { korekcija: addDays(today(), +$('#rdana', el).value) }); toast('Sljedeći rok postavljen.'); V.rokovi(el); }));
    el.querySelectorAll('[data-plan]').forEach((b) => b.addEventListener('click', () => { location.hash = '#/planer'; toast('Dodaj termin tipa "Online: rad na planu".'); }));
  };

  /* ---------- kartice u panelu ---------- */
  FS.panelAlati = () => {
    const n = FS.videiNovo();
    const due = Store.klijentice().filter((u) => u.aktivan !== false && FS.vrsta(u) === 'online').filter((u) => { const r = FS.pristupRec(u.id); return r && r.korekcija && r.korekcija <= today(); }).length;
    return h`<a class="card" href="#/planer" style="display:block"><b>Planer</b><div class="small muted">Sedmični raspored po satima: personalni termini i rad na planovima</div></a>
      ${videos().length ? h`<a class="card" href="#/videi" style="display:block"><div class="row between"><b>Videi vježbi</b>${n ? h`<span class="badge" style="background:var(--rose-2);color:#fff">${n} novo</span>` : ''}</div><div class="small muted">Online klijentice šalju snimak izvođenja, ti odgovoriš korekcijama</div></a>` : ''}
      <a class="card" href="#/rokovi" style="display:block"><div class="row between"><b>Rokovi korekcija</b>${due ? h`<span class="badge warn">${due} čeka</span>` : ''}</div><div class="small muted">Kome je vrijeme za korekciju plana (obično svakih 14 dana)</div></a>`;
  };
})();
