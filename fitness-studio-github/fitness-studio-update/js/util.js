/* Pomoćne funkcije: siguran HTML predložak, datumi, grafikoni, ikone, dijalozi */
(function () {
  const FS = (window.FS = window.FS || {});
  const MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => MAP[c]);
  class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
  const raw = (s) => new Raw(s);
  const part = (v) => {
    if (v instanceof Raw) return v.s;
    if (Array.isArray(v)) return v.map(part).join('');
    if (v === false || v == null) return '';
    return esc(v);
  };
  /* h`...` – interpolacije se automatski escape-uju (zaštita od XSS), ugniježđeni h`` se ne escape-uju */
  const h = (strings, ...vals) => new Raw(strings.reduce((a, s, i) => a + s + (i < vals.length ? part(vals[i]) : ''), ''));

  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
  const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isFinite(n) ? n : NaN; };
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const r1 = (n) => Math.round(n * 10) / 10;

  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => iso(new Date());
  const parse = (s) => { const [y, m, d] = String(s).split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
  const fmtDate = (s) => { if (!s) return ''; const d = parse(String(s).slice(0, 10)); return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}.`; };
  const DAYS = ['nedjelja', 'ponedjeljak', 'utorak', 'srijeda', 'četvrtak', 'petak', 'subota'];
  const MONTHS = ['januar', 'februar', 'mart', 'april', 'maj', 'juni', 'juli', 'august', 'septembar', 'oktobar', 'novembar', 'decembar'];
  const longDate = (d = new Date()) => `${DAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]}`;
  const weekStart = (s) => { const d = parse(s); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return iso(d); };
  const money = (n) => `${Math.round(n * 100) / 100} ${FS.config ? FS.config.valuta : 'KM'}`;

  /* ---------- ikone (outline) ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
    dumbbell: '<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="M7 4l13 8-13 8z"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
    heart: '<path d="M12 20s-7-4.4-9-9.2C1.8 7.5 4 4.5 7 4.5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 5.200 3 4 6.300C19 15.600 12 20 12 20z"/>',
    chart: '<path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    clipboard: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
    cart: '<path d="M3 4h2l2.500 11h10l2-8H6"/><circle cx="9" cy="19" r="1.300"/><circle cx="17" cy="19" r="1.300"/>',
    users: '<circle cx="9" cy="8" r="3.500"/><path d="M2 20c0-3.500 3-6 7-6s7 2.500 7 6M16 4.500a3.500 3.500 0 010 7M18 14.500c2.500.7 4 2.700 4 5.500"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16zM13.500 6.500l4 4"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    logout: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
    flame: '<path d="M12 3c1 4 5 5.500 5 10a5 5 0 01-10 0c0-2 1-3 2-4 .3 1.500 1 2 2 2-.5-3 0-6 1-8z"/>'
  };
  const icon = (n) => raw(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`);

  /* ---------- grafikoni (SVG) ---------- */
  function lineChart(points, o = {}) {
    const W = 320, H = 150, L = 34, R = 12, T = 14, B = 24;
    if (!points.length) return raw('<div class="empty">Još nema podataka.</div>');
    const ys = points.map((p) => p.y);
    let min = Math.min(...ys), max = Math.max(...ys);
    if (min === max) { min -= 1; max += 1; }
    const padY = (max - min) * 0.15; min -= padY; max += padY;
    const xs = points.map((p) => parse(p.x).getTime());
    const x0 = Math.min(...xs), x1 = Math.max(...xs);
    const X = (t) => (x1 === x0 ? (L + W - R) / 2 : L + ((t - x0) / (x1 - x0)) * (W - L - R));
    const Y = (v) => T + (1 - (v - min) / (max - min)) * (H - T - B);
    const pts = points.map((p, i) => [X(xs[i]), Y(p.y)]);
    const grid = [0, 0.5, 1].map((f) => { const v = min + (max - min) * f; const y = Y(v); return `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="rgba(240,228,214,.12)"/><text x="${L - 5}" y="${y + 3}" text-anchor="end">${r1(v)}</text>`; }).join('');
    const line = pts.map((p) => p.join(',')).join(' ');
    const area = `${L},${H - B} ${line} ${pts[pts.length - 1][0]},${H - B}`;
    const dots = pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.5" fill="#c8aa8a" stroke="#0a1630" stroke-width="1.5"/>`).join('');
    const last = points[points.length - 1];
    return raw(`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Grafikon')}">${grid}
      <polygon points="${area}" fill="rgba(200,170,138,.12)"/><polyline points="${line}" fill="none" stroke="#c8aa8a" stroke-width="2.2" stroke-linejoin="round"/>${dots}
      <text x="${L}" y="${H - 6}">${esc(fmtDate(points[0].x))}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${esc(fmtDate(last.x))}</text></svg>`);
  }
  function barChart(vals, labels, o = {}) {
    const W = 320, H = 130, L = 8, R = 8, T = 16, B = 22;
    const max = Math.max(1, o.max || 0, ...vals);
    const bw = (W - L - R) / vals.length;
    const bars = vals.map((v, i) => {
      const bh = (v / max) * (H - T - B), x = L + i * bw + bw * 0.18, w = bw * 0.64, y = H - B - bh;
      return `<rect x="${x}" y="${y}" width="${w}" height="${Math.max(bh, 1)}" rx="4" fill="${v ? '#c8aa8a' : 'rgba(240,228,214,.15)'}"/>${v ? `<text x="${x + w / 2}" y="${y - 4}" text-anchor="middle">${v}</text>` : ''}<text x="${x + w / 2}" y="${H - 7}" text-anchor="middle">${esc(labels[i])}</text>`;
    }).join('');
    return raw(`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || 'Grafikon')}">${bars}</svg>`);
  }

  /* ---------- toast & dijalozi ---------- */
  let tt;
  function toast(msg) {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show'); clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove('show'), 2600);
  }
  function openSheet(content, onMount) {
    const ov = $('#overlay');
    ov.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${content instanceof Raw ? content.s : esc(content)}</div>`;
    ov.hidden = false; document.body.style.overflow = 'hidden';
    ov.onclick = (e) => { if (e.target === ov) closeSheet(); };
    if (onMount) onMount($('.sheet', ov));
    return $('.sheet', ov);
  }
  function closeSheet() { const ov = $('#overlay'); ov.hidden = true; ov.innerHTML = ''; document.body.style.overflow = ''; }
  function confirmSheet({ title, text, ok = 'Potvrdi', cancel = 'Odustani', danger = false }) {
    return new Promise((res) => {
      openSheet(h`<h2>${title}</h2><p class="muted">${text}</p>
        <div class="row mt"><button class="btn grow" data-x="0">${cancel}</button><button class="btn ${danger ? 'danger' : 'primary'} grow" data-x="1">${ok}</button></div>`,
      (el) => el.querySelectorAll('[data-x]').forEach((b) => b.addEventListener('click', () => { closeSheet(); res(b.dataset.x === '1'); })));
    });
  }
  /* delegiranje događaja: <button data-act="ime"> → map['click:ime'] ; <form data-act="x"> → 'submit:x' */
  function bind(el, map) {
    ['click', 'submit', 'input', 'change'].forEach((ev) => {
      el.addEventListener(ev, (e) => {
        const t = e.target.closest('[data-act]');
        if (!t || !el.contains(t)) return;
        const fn = map[ev + ':' + t.dataset.act];
        if (fn) { if (ev === 'submit') e.preventDefault(); fn(t, e); }
      });
    });
  }
  const formData = (form) => Object.fromEntries(new FormData(form));
  const opts = (list, sel) => list.map((o) => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return h`<option value="${v}" ${String(v) === String(sel) ? 'selected' : ''}>${l}</option>`; });
  function initials(name) { return String(name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(); }

  Object.assign(FS, { esc, raw, h, Raw, $, $$, uid, num, clamp, r1, iso, today, parse, addDays, fmtDate, longDate, weekStart, money, icon, lineChart, barChart, toast, openSheet, closeSheet, confirmSheet, initials, bind, formData, opts });
})();
