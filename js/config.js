/* Postavke aplikacije – ovdje mijenjaš osnovne podatke brenda. */
window.FS = window.FS || {};
FS.config = {
  brand: 'ALMEDINA FITNESS',
  trenerIme: 'Tvoja trenerica',        // npr. 'Amina Hadžić'
  instagram: 'https://instagram.com/almedina.zajko',                       // npr. 'https://instagram.com/tvoj_profil' (ostavi prazno dok nemaš)
  valuta: 'KM',
  demo: true,                          // true = probna verzija: prikazuje demo račune i oznaku "bez stvarnih uplata"
  /* Podaci za uplatu na račun (prikazuju se klijenticama pri kupovini). Dok je 'racun' prazan, prikazuje se samo poruka da će im trenerica javiti kako da uplate. */
  uplata: { primalac: '', racun: '', banka: '', napomena: '' },
  ciljPoPaketu: { START: 2, ACTIVE: 3, STRONG: 4 }   // treninga sedmično
};
