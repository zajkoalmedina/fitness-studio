/* Podsjetnici za mjerenja: vaganje (sedmično) i obimi + fotografije (svake 4 sedmice).
   U aplikaciji: obavijest kad je vrijeme. Na telefonu: kalendar podsjetnik (.ics) koji se ponavlja i javi se sam. */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, Store, today, addDays, toast } = FS;
  const OBIMI = ['struk', 'stomak', 'kukovi', 'natL', 'natD', 'nadL', 'nadD', 'listL', 'listD'];
  const dana = (a, b) => Math.round((FS.parse(b) - FS.parse(a)) / 86400000);

  /* sva mjerenja (težina, obimi, fotografije) rade se svake 4 sedmice */
  FS.mjerenjeDospjelo = (u) => {
    const mj = Store.mjereOf(u.id), t = today(), last = mj.filter((m) => m.tezina || OBIMI.some((k) => m[k])).pop();
    if (!last) return { dana: null };
    const d = dana(last.datum, t);
    return d >= 28 ? { dana: d } : null;
  };

  const b0 = FS.upitnikBanner;
  FS.upitnikBanner = (u) => {
    const s = b0 ? b0(u) : '', d = u && u.role === 'klijentica' ? FS.mjerenjeDospjelo(u) : null;
    const cards = [];
    if (d) cards.push(h`<div class="card note"><b>Vrijeme je za mjerenje</b><div class="small">${d.dana == null ? 'Još nemaš upisanu težinu ni obime.' : 'Zadnje mjerenje je bilo prije ' + d.dana + ' dana.'} Radi se svake 4 sedmice: težina, obimi i fotografije.</div><a class="btn sm primary mt-s" href="#/moj?tab=napredak">Upiši mjerenje</a> <a class="btn sm mt-s" href="#/mjerenje">Kako se mjeriti</a></div>`);
    if (u && u.role === 'klijentica') cards.push(h`<div class="card flat small"><b>Podsjetnik u kalendaru</b><div class="muted">Telefon će te sam podsjetiti na mjerenje svake 4 sedmice.</div><button class="btn sm mt-s" data-ics="1">Dodaj u kalendar</button></div>`);
    return h`${s}${cards}`;
  };

  const ics = () => {
    const t = today().replace(/-/g, ''), stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
    const nextMon = (() => { let d = today(); for (let i = 0; i < 7; i++) { if ((FS.parse(d).getDay() + 6) % 7 === 0) break; d = addDays(d, 1); } return d.replace(/-/g, ''); })();
    const ev = (uid, naziv, opis, rrule, sat) => ['BEGIN:VEVENT', 'UID:' + uid + '@almedina-fitness', 'DTSTAMP:' + stamp, 'DTSTART:' + nextMon + 'T' + sat + '00', 'DTEND:' + nextMon + 'T' + sat.replace(/^(\d\d)(\d\d)$/, (m, a, b) => (('0' + (+a)).slice(-2)) + b) + '00',
      'RRULE:' + rrule, 'SUMMARY:' + naziv, 'DESCRIPTION:' + opis, 'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + naziv, 'TRIGGER:PT0S', 'END:VALARM', 'END:VEVENT'].join('\r\n');
    return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Almedina Fitness//BS', 'CALSCALE:GREGORIAN',
      ev('mjerenje', 'Mjerenje: tezina, obimi, fotografije', 'Ujutro, poslije toaleta, prije jela. Izvagaj se, izmjeri obime, napravi fotografije i upisi u aplikaciji.', 'FREQ=WEEKLY;INTERVAL=4;BYDAY=MO', '0730'),
      'END:VCALENDAR'].join('\r\n');
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest && e.target.closest('[data-ics]'); if (!b) return;
    const blob = new Blob([ics()], { type: 'text/calendar;charset=utf-8' }), url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'podsjetnik-mjerenja.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Otvori preuzetu datoteku i dodaj podsjetnik u kalendar.');
  });
})();
