/* Razgovor klijentica ↔ trenerica: tekst, glasovne poruke i video.
   Mediji se čuvaju u IndexedDB na ovom uređaju (demo). Za slanje između različitih telefona potreban je server. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, raw, toast, confirmSheet, Store, uid, $ } = FS;
  const svg = (d) => raw('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>');
  const ICO = { mic: svg('<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/>'), video: svg('<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>') };
  const icon = (n) => ICO[n];
  const MAX_VIDEO = 80 * 1024 * 1024, MAX_REC = 180;

  /* ---------- pohrana medija ---------- */
  const mem = new Map();
  let dbp = null;
  const openDb = () => dbp || (dbp = new Promise((res) => {
    try { const r = indexedDB.open('fs_media', 1); r.onupgradeneeded = () => r.result.createObjectStore('m'); r.onsuccess = () => res(r.result); r.onerror = () => res(null); r.onblocked = () => res(null); } catch (e) { res(null); }
  }));
  const tx = async (mode, fn) => {
    const d = await openDb(); if (!d) return null;
    return new Promise((res) => { try { const t = d.transaction('m', mode), r = fn(t.objectStore('m')); t.oncomplete = () => res(r && r.result !== undefined ? r.result : true); t.onerror = () => res(null); t.onabort = () => res(null); } catch (e) { res(null); } });
  };
  const LOCAL = {
    async put(id, blob) { const ok = await tx('readwrite', (s) => s.put(blob, id)); if (!ok) mem.set(id, blob); return true; },
    async get(id) { if (mem.has(id)) return mem.get(id); const r = await tx('readonly', (s) => s.get(id)); return r && r !== true ? r : null; },
    async del(id) { mem.delete(id); await tx('readwrite', (s) => s.delete(id)); }
  };
  const MEDIA = {
    put: (id, b) => (FS.media ? FS.media.put(id, b) : LOCAL.put(id, b)),
    get: (id) => (FS.media ? FS.media.get(id) : LOCAL.get(id)),
    del: (id) => (FS.media ? FS.media.del(id) : LOCAL.del(id))
  };

  FS.fileStore = MEDIA;

  /* ---------- poruke ---------- */
  const list = (userId) => (Store.db.chat = Store.db.chat || []).filter((m) => m.userId === userId).sort((a, b) => a.ts - b.ts);
  const unread = (me, userId) => (Store.db.chat || []).filter((m) => m.from !== me && !m.read && (!userId || m.userId === userId)).length;
  const markRead = (me, userId) => { let ch = false; (Store.db.chat || []).forEach((m) => { if (m.userId === userId && m.from !== me && !m.read) { m.read = true; ch = true; } }); if (ch) Store.save(); };
  FS.chat = { list, unread, markRead };

  const pickMime = (kinds) => { for (const k of kinds) { try { if (window.MediaRecorder && MediaRecorder.isTypeSupported(k)) return k; } catch (e) { /* ignoriši */ } } return ''; };
  const fmtT = (s) => String(Math.floor(s / 60)) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const timeOf = (ts) => { const d = new Date(ts); return d.getDate() + '.' + (d.getMonth() + 1) + '. ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };

  /* ---------- prikaz razgovora ---------- */
  FS.chatThread = (host, { userId, me, title }) => {
    if (!host) return;
    const urls = []; let rec = null, stream = null, tmr = null, dead = false;
    const cleanup = () => { dead = true; urls.forEach((u) => URL.revokeObjectURL(u)); clearInterval(tmr); try { if (rec && rec.state !== 'inactive') { rec.onstop = null; rec.stop(); } } catch (e) { /* ignoriši */ } if (stream) stream.getTracks().forEach((t) => t.stop()); };
    FS.onLeave(cleanup);

    const bubble = (m) => h`<div class="cb ${m.from === me ? 'me' : 'other'}" data-id="${m.id}">
      ${m.media ? h`<div class="cmedia" data-mid="${m.media.id}" data-kind="${m.media.kind}">${m.media.kind === 'video' ? 'Video se učitava…' : 'Glasovna poruka…'}</div>` : ''}
      ${m.tekst ? h`<div class="ctext">${m.tekst}</div>` : ''}
      <div class="cmeta">${timeOf(m.ts)}${m.from === me ? h` · <button class="clink" data-act="cdel" data-id="${m.id}">obriši</button>` : ''}</div></div>`;

    const draw = () => {
      const ms = list(userId);
      host.innerHTML = h`<div class="card chat">
        ${title ? h`<h3>${title}</h3>` : ''}
        ${FS.media ? '' : h`<div class="small mb">Demo: poruke i snimci ostaju na ovom uređaju.</div>`}
        <div class="cthread" id="cthread">${ms.length ? ms.map(bubble) : h`<p class="muted center">Još nema poruka. Napiši poruku, snimi glasovnu ili pošalji video.</p>`}</div>
        <div id="crecbar" class="crec" hidden><span class="recdot"></span><b id="crect">0:00</b><span class="grow small">Snimanje glasovne poruke…</span><button class="btn sm" data-act="crcancel">Otkaži</button><button class="btn sm primary" data-act="crsend">Pošalji</button></div>
        <form data-act="csend" novalidate class="ccomp">
          <textarea name="t" rows="1" maxlength="1500" placeholder="Napiši poruku…" aria-label="Poruka"></textarea>
          <button class="icon-btn" type="button" data-act="cmic" aria-label="Snimi glasovnu poruku">${icon('mic')}</button>
          <label class="icon-btn" aria-label="Pošalji video" style="cursor:pointer">${icon('video')}<input type="file" accept="video/*" data-act="cvid" hidden></label>
          <button class="btn primary sm" type="submit">Pošalji</button></form>
        <p class="small mt-s">Glasovna do ${fmtT(MAX_REC)} min. Video do ${Math.round(MAX_VIDEO / 1048576)} MB (kratak snimak).</p></div>`;
      const th = $('#cthread', host); if (th) th.scrollTop = th.scrollHeight;
      mountMedia();
      wire();
    };

    const mountMedia = () => host.querySelectorAll('.cmedia').forEach(async (box) => {
      const blob = await MEDIA.get(box.dataset.mid);
      if (dead || !box.isConnected) return;
      if (!blob) { box.textContent = 'Medij nije dostupan na ovom uređaju.'; box.classList.add('muted'); return; }
      const url = URL.createObjectURL(blob); urls.push(url);
      box.innerHTML = box.dataset.kind === 'video' ? `<video controls playsinline preload="metadata" src="${url}"></video>` : `<audio controls preload="metadata" src="${url}"></audio>`;
    });

    const addMsg = async ({ tekst, blob, kind, dur }) => {
      const m = { id: uid(), userId, from: me, ts: Date.now(), tekst: String(tekst || '').trim().slice(0, 1500), read: false };
      if (blob) { const id = (FS.media ? userId + '/' : '') + 'm_' + uid(); try { await MEDIA.put(id, blob); } catch (e) { toast('Snimak nije poslan. Provjeri internet.'); return; } m.media = { id, kind, mime: blob.type || '', size: blob.size, dur: dur || 0 }; }
      if (!m.tekst && !m.media) return;
      (Store.db.chat = Store.db.chat || []).push(m); Store.save(); draw();
    };

    const stopTracks = () => { if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } clearInterval(tmr); tmr = null; };
    const hideRec = () => { const b = $('#crecbar', host); if (b) b.hidden = true; const f = $('.ccomp', host); if (f) f.hidden = false; };

    const startRec = async () => {
      if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Snimanje zvuka nije podržano u ovom pregledniku.'); return; }
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { toast('Dozvoli pristup mikrofonu da snimiš poruku.'); return; }
      const mime = pickMime(['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg']);
      const chunks = []; let t0 = Date.now(), send = false;
      try { rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined); } catch (e) { stopTracks(); toast('Snimanje nije moguće na ovom uređaju.'); return; }
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      rec.onstop = async () => {
        const dur = (Date.now() - t0) / 1000; stopTracks(); hideRec();
        if (!send || dead) return;
        if (dur < 1) { toast('Poruka je prekratka.'); return; }
        const blob = new Blob(chunks, { type: rec.mimeType || mime || 'audio/mp4' });
        await addMsg({ blob, kind: 'audio', dur });
      };
      rec.start(1000);
      const bar = $('#crecbar', host); bar.hidden = false; $('.ccomp', host).hidden = true;
      tmr = setInterval(() => { const s = (Date.now() - t0) / 1000; const el = $('#crect', host); if (el) el.textContent = fmtT(s); if (s >= MAX_REC) { send = true; rec.stop(); } }, 500);
      host._finish = (doSend) => { send = doSend; if (rec && rec.state !== 'inactive') rec.stop(); };
    };

    const wire = () => {
      host.querySelector('[data-act=cmic]').addEventListener('click', startRec);
      host.querySelector('[data-act=crsend]').addEventListener('click', () => host._finish && host._finish(true));
      host.querySelector('[data-act=crcancel]').addEventListener('click', () => host._finish && host._finish(false));
      host.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); const t = e.target.t.value; if (!t.trim()) { toast('Napiši poruku.'); return; } addMsg({ tekst: t }); });
      host.querySelector('[data-act=cvid]').addEventListener('change', async (e) => {
        const f = e.target.files && e.target.files[0]; e.target.value = '';
        if (!f) return;
        if (!/^video\//.test(f.type) && !/\.(mp4|mov|m4v|webm)$/i.test(f.name)) { toast('Izaberi video snimak.'); return; }
        if (f.size > MAX_VIDEO) { toast('Video je prevelik. Snimi kraći (do ' + Math.round(MAX_VIDEO / 1048576) + ' MB).'); return; }
        toast('Dodajem video…');
        await addMsg({ blob: f, kind: 'video', tekst: host.querySelector('textarea').value });
      });
      host.querySelectorAll('[data-act=cdel]').forEach((b) => b.addEventListener('click', async () => {
        if (!await confirmSheet({ title: 'Obrisati poruku?', text: 'Poruka i njen snimak bit će uklonjeni.', ok: 'Obriši', danger: true })) return;
        const m = Store.db.chat.find((x) => x.id === b.dataset.id); if (m && m.media) MEDIA.del(m.media.id);
        Store.db.chat = Store.db.chat.filter((x) => x.id !== b.dataset.id); Store.save(); draw();
      }));
    };

    const onDocs = (e) => {
      if (dead) { window.removeEventListener('fs:docs', onDocs); return; }
      if (!e.detail || !e.detail.colls.includes('chat')) return;
      const ta = host.querySelector('textarea');
      if ((ta && ta.value) || host.querySelector('#crecbar:not([hidden])')) return;
      markRead(me, userId); draw();
    };
    window.addEventListener('fs:docs', onDocs);
    markRead(me, userId);
    draw();
  };
})();
