/* Linije tehnike: lista provjera + vodilice preko videa (okomita i vodoravna linija koje se pomjeraju) */
(function () {
  const FS = (window.FS = window.FS || {});
  const { h, bind } = FS;
  const V = (FS.views = FS.views || {});

  const G = {
    cucanj: { naziv: 'Čučanj', ids: ['cucanj', 'goblet', 'cucanjsipka', 'frontcucanj', 'boxsquat', 'kangsquat', 'cucanjskok', 'stolicasklek', 'zidsjed', 'squatjacks', 'sumocucanj', 'bocacucanj'],
      l: ['Stopala u širini ramena ili malo šire, prsti blago prema van.', 'Težina na sredini stopala: peta, palac i mali prst ostaju na podu.', 'Koljena prate smjer prstiju i ne upadaju prema unutra.', 'Leđa neutralna, prsa podignuta, trup se ne ruši naprijed.', 'Dubina: bokovi do visine koljena ili niže, koliko ti dozvoljava mobilnost, uz ravna leđa.', 'Uspon odguruj petama i stisni gluteuse na vrhu.'], v: 'Okomita linija ide kroz sredinu stopala, a šipka ili težište tijela ostaju iznad nje. Vodoravna linija je dubina: kukovi do koljena.' },
    hinge: { naziv: 'Hip hinge (mrtvo dizanje, RDL)', ids: ['rdl', 'rdlsipka', 'deadlift', 'blockpull', 'goodmorning', 'kbswing', 'jednorodl', 'reversehyper'],
      l: ['Pokret kreće iz kukova: guraš zadnjicu unazad.', 'Leđa ravna od vrata do zdjelice, bez zaobljavanja.', 'Koljena blago savijena i ostaju skoro ista tokom spuštanja.', 'Šipka ili bučice klize uz noge i ostaju blizu tijela.', 'Pogled ispred sebe, vrat u liniji kičme.', 'Na vrhu stisni gluteuse, bez prekomjernog izvijanja u donjim leđima.'], v: 'Okomita linija ide uz šipku i sredinu stopala. Vodoravna linija prati leđa: trebaju biti ravna od ramena do kukova.' },
    most: { naziv: 'Hip thrust i most', ids: ['hipthrust', 'bridge', 'singlebridge', 'jastukmost', 'reverse'],
      l: ['Lopatice na klupi, stopala u širini kukova.', 'Na vrhu tijelo od koljena do ramena ide u ravnoj liniji.', 'Podignuta brada blago spuštena, pogled naprijed.', 'Stisni gluteuse na vrhu, bez izvijanja donjih leđa.', 'Potkoljenice su okomite na vrhu pokreta.'], v: 'Vodoravna linija ide od koljena do ramena. Okomita linija je potkoljenica, i treba biti okomita na vrhu.' },
    potisak: { naziv: 'Potisak i sklek', ids: ['sklek', 'zpotisak', 'sklekzid', 'bench', 'floorpress', 'closegrip', 'boardpress', 'potisaksipka', 'chestpress', 'bocapotisak'],
      l: ['Zategni trup: tijelo je ravna linija od glave do peta (sklek).', 'Laktovi pod uglom oko 45° od tijela, ne u širokom „T“ položaju.', 'Zglobovi šaka su iznad laktova.', 'Lopatice su stabilne i ne rastvaraju se.', 'Spuštaj kontrolisano, potiskuj odlučno.'], v: 'Vodoravna linija ide kroz kuk i ramena (sklek: ravna linija tijela). Okomita linija ide kroz šake i laktove.' },
    veslanje: { naziv: 'Veslanje i povlačenje', ids: ['veslanje', 'veslanjesipka', 'renegade', 'lat', 'veslanjeguma', 'bocarodl', 'uprightrow'],
      l: ['Leđa ravna, trup stabilan i bez ljuljanja.', 'Povlačenje kreće iz lopatica, a ne samo iz ruku.', 'Laktovi idu uz tijelo prema kuku.', 'Ramena ne idu prema ušima.', 'Spuštaj sporo i potpuno istegni ruku.'], v: 'Vodoravna linija prati leđa i ostaje mirna. Okomita linija pokazuje put lakta ka kuku.' },
    iskorak: { naziv: 'Iskorak', ids: ['iskorak', 'lungejump', 'bocaiskorak', 'curtsy', 'klizniiskorak', 'lateralnilunge', 'pistol'],
      l: ['Trup uspravan, pogled naprijed.', 'Prednje koljeno iznad stopala, ne uleće prema unutra.', 'Težina većinom na prednjoj nozi, petom odgurni.', 'Zadnje koljeno se spušta kontrolisano prema podu.', 'Korak dovoljno dug da potkoljenica ostane skoro okomita.'], v: 'Okomita linija ide kroz prednje koljeno i stopalo: koljeno ostaje iznad nje.' },
    planka: { naziv: 'Planka i core', ids: ['planka', 'bocnaplanka', 'plankwalk', 'hollow', 'deadbug', 'birddog', 'planksavijanje', 'plankhops', 'flutter', 'abwheel'],
      l: ['Tijelo je ravna linija od glave do peta.', 'Zdjelica blago podvučena, ne propadaj u donja leđa.', 'Rebra spuštena, trbuh zategnut.', 'Ramena iznad laktova, vrat u produžetku kičme.', 'Diši mirno, ne zadržavaj dah.'], v: 'Vodoravna linija ide od ramena do peta: kukovi ne smiju iznad ni ispod nje.' }
  };
  const map = {}; Object.values(G).forEach((g) => g.ids.forEach((i) => { map[i] = g; }));
  FS.TEHNIKA = map;

  const wire = (el, g) => {
    const box = el.querySelector('.video'); if (!box) return;
    box.insertAdjacentHTML('afterend', h`<div class="card note" id="tl"><div class="row between"><b>Linije tehnike</b><button class="btn sm" data-act="tlt">Prikaži na videu</button></div>
      <div id="tlc" hidden><p class="small mt-s">${g.v}</p>
        <label class="field"><span class="small">Okomita linija</span><input type="range" data-act="tlx" min="5" max="95" value="50"></label>
        <label class="field"><span class="small">Vodoravna linija</span><input type="range" data-act="tly" min="5" max="95" value="55"></label></div></div>`.s);
    const ov = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    ov.setAttribute('viewBox', '0 0 100 100'); ov.setAttribute('preserveAspectRatio', 'none'); ov.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:none';
    ov.innerHTML = '<line id="lv" x1="50" y1="0" x2="50" y2="100" stroke="#f0e4d6" stroke-width="0.5" stroke-dasharray="2 1.5" vector-effect="non-scaling-stroke"/><line id="lh" x1="0" y1="55" x2="100" y2="55" stroke="#c8aa8a" stroke-width="0.5" stroke-dasharray="2 1.5" vector-effect="non-scaling-stroke"/>';
    box.appendChild(ov);
    const card = el.querySelector('#tl'), c = card.querySelector('#tlc');
    bind(card, {
      'click:tlt': (b) => { const on = ov.style.display === 'none'; ov.style.display = on ? 'block' : 'none'; c.hidden = !on; b.textContent = on ? 'Sakrij linije' : 'Prikaži na videu'; },
      'input:tlx': (i) => { const l = ov.querySelector('#lv'); l.setAttribute('x1', i.value); l.setAttribute('x2', i.value); },
      'input:tly': (i) => { const l = ov.querySelector('#lh'); l.setAttribute('y1', i.value); l.setAttribute('y2', i.value); }
    });
  };

  const v0 = V.vjezba;
  V.vjezba = (el, p, q) => {
    const r = v0(el, p, q);
    const g = map[p.id];
    if (g) {
      wire(el, g);
      const st = [...el.querySelectorAll('.card')].find((c) => /Kako izvesti/.test(c.textContent));
      const html = h`<div class="card"><h3>Provjeri tehniku: ${g.naziv}</h3><ul class="dots">${g.l.map((t) => h`<li>${t}</li>`)}</ul></div>`.s;
      if (st) st.insertAdjacentHTML('beforebegin', html); else el.insertAdjacentHTML('beforeend', html);
    }
    return r;
  };
})();
