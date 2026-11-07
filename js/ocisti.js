/* Zagrijavanje i mobilnost: trenerica će snimiti nove vježbe, pa se sve postojeće vježbe iz grupe "Mobilnost"
   brišu iz biblioteke i iz svih programa (ugrađenih, šablona i već dodijeljenih). Disanje (dijastaza) ostaje. */
(function () {
  const FS = (window.FS = window.FS || {});
  const MOB = new Set((FS.EXERCISES || []).filter((e) => e.grupa === 'Mobilnost').map((e) => e.id));
  FS.MOB_IDS = MOB;
  if (!MOB.size) return;
  FS.EXERCISES = FS.EXERCISES.filter((e) => !MOB.has(e.id));
  const kid = (x) => x && (x.id != null ? x.id : x.i);
  const strip = (o, seen) => {
    let n = 0;
    if (!o || typeof o !== 'object' || seen.has(o)) return 0;
    seen.add(o);
    if (Array.isArray(o)) { o.forEach((x) => { n += strip(x, seen); }); return n; }
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (k === 'vj' && Array.isArray(v)) { const keep = v.filter((x) => !(x && typeof x === 'object' && MOB.has(kid(x)))); n += v.length - keep.length; if (keep.length !== v.length) o[k] = keep; }
      if (k !== 'EXERCISES' && v && typeof v === 'object') n += strip(o[k], seen);
    });
    return n;
  };
  strip(FS, new Set());
  /* programi koje je trenerica već dodijelila ili spremila (Store.db) */
  FS.ocistiMob = () => {
    const db = FS.Store && FS.Store.db; if (!db) return 0;
    const n = strip(db.programi || [], new Set()) + strip(db.programMod || {}, new Set());
    const u = FS.Auth && FS.Auth.user && FS.Auth.user();
    if (n && u && u.role === 'trener') FS.Store.save();
    return n;
  };
  window.addEventListener('hashchange', () => FS.ocistiMob());
  window.addEventListener('fs:docs', () => FS.ocistiMob());
  setTimeout(() => FS.ocistiMob(), 1500);
})();
