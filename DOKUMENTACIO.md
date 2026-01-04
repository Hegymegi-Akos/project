# Projekt Dokumentáció

## Projekt neve
Webshop kisállatoknak

## Leírás
Ez a projekt egy kisállat-webshop teljes stack megvalósítása, amely frontend (React + Vite) és backend (PHP) részekből áll. A rendszer lehetővé teszi termékek böngészését, kosárba helyezését, vásárlást, adminisztrációt, kuponkezelést, felhasználói fiókok kezelését, valamint képgaléria és kereső funkciókat is tartalmaz.

## Főbb mappák és fájlok
- **13A_Projekt_webshop-Frontend/react/**: A frontend React alkalmazás forrása.
- **backend/**: A PHP alapú backend API és konfigurációk.
- **kisallat.sql**: Az adatbázis szerkezete és mintadatai.
- **README.md, SETUP.md, WEBDOK.md**: Különböző leírások, telepítési és használati útmutatók.

## Telepítés
1. **Frontend**
   - Lépj be a `13A_Projekt_webshop-Frontend/react` mappába.
   - Futtasd: `npm install`
   - Indítsd: `npm run dev`
2. **Backend**
   - Helyezd a `backend` mappát egy PHP-t futtatni képes szerverre.
   - Állítsd be az adatbázis elérhetőségeit a `backend/config/database.php` fájlban.
   - Importáld a `kisallat.sql`-t az adatbázisodba.

## Fő funkciók
- Termékkategóriák böngészése (kutya, macska, madár, hal, hüllő, rágcsáló)
- Kosár, kedvencek, kuponok kezelése
- Admin felület: termékek, felhasználók, rendelések kezelése
- Felhasználói regisztráció, bejelentkezés, jelszóemlékeztető
- Képgaléria, kereső, tippek

## Fejlesztők
- Hegymegi Ákos
- ... (további fejlesztők nevei)

## Licenc
MIT

---

További részletekért lásd a README.md-t és a forráskódot.