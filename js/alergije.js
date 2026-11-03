/* Alergije i intolerancije: klijentica označi šta ne smije jesti, a aplikacija takve recepte sakrije i izbaci iz jelovnika */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h } = FS;
  /* [id, naziv, izraz po kojem se prepoznaje u nazivu, sastojcima i pripremi] (namjerno oprezno: bolje sakriti viška nego propustiti) */
  FS.ALERGENI = [
    ['gluten', 'Gluten (pšenica, zob, ječam)', /zob|pahulj|brašn|brasn|hljeb|hleb|wasa|tortilj|griz|jufk|kore |tjestenin|špagi|makaron|cornflak|kus ?kus|\bpit[aeu]\b|tost|ječm|raž|pšeni|panir|palačink|tufahij/i],
    ['mlijeko', 'Mlijeko i mliječni proizvodi (laktoza)', /mlijek|mliječ|jogurt|\bsir(?!up)|kajmak|feta|mozzarell|parmezan|skyr|kefir|vrhnje|maslac|whey|protein|gaud|ricott|zrnast|krem sir|kremsir/i],
    ['jaja', 'Jaja', /jaj|omlet|kajgan|majonez/i],
    ['orasi', 'Orašasti plodovi (orasi, bademi, lješnjaci)', /orah|badem|lješnj|indijsk|pistać|oraš/i],
    ['kikiriki', 'Kikiriki', /kikiriki/i],
    ['riba', 'Riba i plodovi mora', /\brib[aeiu]|\btun[aeiouj]|pastrmk|losos|skuš|srdel|bakalar|lignj|škamp|školjk/i],
    ['soja', 'Soja', /soj|tofu|edamame|teriyaki/i],
    ['susam', 'Susam', /susam/i]
  ];
  const txtCache = {};
  const txt = (r) => txtCache[r.id] || (txtCache[r.id] = (r.naziv + ' ' + (r.sast || []).join(' ')).toLowerCase());
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const rijeci = (J) => String((J && J.alergijeOstalo) || '').split(/[,;\n]/).map((x) => x.trim().toLowerCase()).filter((x) => x.length >= 3);

  /* svi alergeni koje recept sadrži (za oznaku na receptu) */
  FS.recAlergeni = (r) => FS.ALERGENI.filter(([, , re]) => re.test(txt(r))).map(([id]) => id);
  /* alergeni iz profila klijentice koje recept sadrži; prazno = siguran */
  FS.alergMatch = (r, J) => {
    if (!J) return [];
    const out = FS.ALERGENI.filter(([id, , re]) => (J.alergije || []).includes(id) && re.test(txt(r))).map(([, l]) => l);
    rijeci(J).forEach((w) => { if (new RegExp(esc(w.length > 4 ? w.slice(0, -1) : w), 'i').test(txt(r))) out.push(w); });
    return out;
  };
  FS.imaAlergije = (J) => !!J && ((J.alergije || []).length > 0 || rijeci(J).length > 0);
  FS.alergLabel = (id) => (FS.ALERGENI.find((x) => x[0] === id) || [, id])[1].replace(/ \(.*\)$/, '');

  /* uklanja iz planiranog jelovnika (od danas nadalje) obroke koji sadrže alergen; vraća broj uklonjenih */
  FS.alergPurge = (J) => {
    let n = 0; const t = FS.today();
    Object.keys(J.dani || {}).forEach((d) => {
      if (d < t) return;
      Object.keys(J.dani[d]).forEach((k) => {
        const e = J.dani[d][k], r = (FS.RECEPTI_V || []).find((x) => x.id === e.id);
        if (r && FS.alergMatch(r, J).length) { delete J.dani[d][k]; n++; }
      });
    });
    return n;
  };

  /* kartica za izbor (ro = samo prikaz za trenericu) */
  FS.alergijeCard = (J, ro) => {
    J = J || {};
    const sel = J.alergije || [];
    if (ro) {
      const r = rijeci(J);
      return h`<div class="card ${sel.length || r.length ? 'alert' : ''}"><h3 style="margin-top:0">Alergije i intolerancije</h3>${sel.length || r.length ? h`<p style="margin:0"><b>${[...sel.map(FS.alergLabel), ...r].join(', ')}</b></p>` : h`<p class="muted" style="margin:0">Klijentica nije označila alergije.</p>`}</div>`;
    }
    return h`<div class="card ${sel.length ? 'alert' : ''}"><h3 style="margin-top:0">Alergije i intolerancije</h3>
      <p class="small muted">Označi šta ne smiješ jesti. Takvi recepti se sakriju, a iz tvog jelovnika se automatski izbace.</p>
      <div class="row wrap mb">${FS.ALERGENI.map(([id, l]) => h`<label class="btn sm ${sel.includes(id) ? 'primary' : ''}" style="cursor:pointer"><input type="checkbox" data-act="alg" data-k="${id}" ${sel.includes(id) ? 'checked' : ''} style="display:none">${sel.includes(id) ? '✕ ' : ''}${l}</label>`)}</div>
      <label class="field"><span>Još nešto na šta si alergična (odvoji zarezom)</span><input data-act="algo" value="${J.alergijeOstalo || ''}" maxlength="120" placeholder="npr. celer, kivi, gljive"></label>
      <p class="small muted" style="margin-bottom:0">Provjera se radi po nazivu i popisu sastojaka. Uvijek pročitaj sastojke i ne oslanjaj se samo na aplikaciju, a kod teške alergije posavjetuj se s ljekarom.</p></div>`;
  };
})();
