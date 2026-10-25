# FITNESS STUDIO – probna PWA verzija

## Pokretanje lokalno
```
cd fitness-studio
python3 -m http.server 8080
```
Otvori http://localhost:8080 (service worker radi na localhost-u i na HTTPS-u).

## Objava na HTTPS adresi
Cijeli folder je statička stranica. Postavi ga na bilo koji hosting s HTTPS-om
(Netlify, Cloudflare Pages, Vercel, GitHub Pages) – dovoljno je prevući folder.
Prije objave: u `js/config.js` upiši ime trenerice i Instagram link.
Pri svakoj izmjeni fajlova povećaj verziju keša u `sw.js` (`CACHE`).

## Dodavanje na početni ekran iPhonea
Safari → otvori adresu → Podijeli → „Dodaj na početni ekran".

## Demo računi (samo u probnoj verziji)
- Trenerica: trenerica@demo.ba / Trener#2026
- Klijentica: ana@demo.ba / Klijent#2026
- Klijentica: maja@demo.ba / Klijent#2026

## Važno prije stvarnog korištenja
Probna verzija čuva podatke samo u pregledniku uređaja (localStorage). Zato:
- račun napravljen na jednom telefonu ne postoji na drugom,
- prijava nije prava serverska zaštita,
- plaćanje nije aktivirano (kupovina se samo bilježi).
Za stvarni rad zamijeni `Store` i `Auth` u `js/store.js` serverskom bazom
(npr. Supabase ili Firebase) i poveži online plaćanje. Podaci o zdravlju
(dijastaza) zahtijevaju serversku zaštitu i saglasnost klijentica.
Na produkciji postavi `demo: false` u `js/config.js`.
