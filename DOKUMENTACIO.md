
# Projekt Dokumentáció

## Projekt neve
Webshop kisállatoknak

## Áttekintés
Ez a projekt egy teljes körű kisállat-webshop rendszer, amelynek célja, hogy a felhasználók egyszerűen és biztonságosan vásárolhassanak különféle kisállatoknak szánt termékeket. A rendszer modern frontenddel (React + Vite) és robusztus backenddel (PHP) készült, támogatja a felhasználói fiókokat, adminisztrációs funkciókat, valamint a termékek, rendelések és kuponok kezelését.

### Fő célok
- Felhasználóbarát, reszponzív webes felület
- Gyors és biztonságos vásárlási folyamat
- Adminisztrációs lehetőségek (termékek, felhasználók, rendelések kezelése)
- Képgaléria, kereső, tippek, kuponrendszer

## Rendszerfelépítés

### Frontend
- **React + Vite** alapú SPA
- Komponens-alapú felépítés, könnyen bővíthető
- Főbb oldalak: főoldal, kategóriák, terméklista, kosár, kedvencek, kuponok, admin felület, galéria, kereső, tippek

### Backend
- **PHP** REST API
- Felhasználó- és jogosultságkezelés (JWT)
- Termékek, rendelések, kuponok, felhasználók kezelése
- Adatbázis: MySQL (lásd: kisallat.sql)

### Főbb mappák és fájlok
- **13A_Projekt_webshop-Frontend/react/**: Frontend forráskód
- **backend/**: Backend API és konfigurációk
- **kisallat.sql**: Adatbázis szerkezet és minták
- **README.md, SETUP.md, WEBDOK.md**: Telepítési, használati és fejlesztői dokumentációk

## Telepítési útmutató

### Frontend
1. Navigálj a `13A_Projekt_webshop-Frontend/react` mappába
2. Futtasd: `npm install` a függőségek telepítéséhez
3. Indítsd: `npm run dev` (alapértelmezett: http://localhost:5173)

### Backend
1. Másold a `backend` mappát egy PHP-t támogató szerverre
2. Állítsd be az adatbázis elérhetőségeit a `backend/config/database.php` fájlban
3. Importáld a `kisallat.sql` fájlt a MySQL adatbázisodba

## Fő funkciók részletesen

- **Termékkategóriák böngészése:** Kutya, macska, madár, hal, hüllő, rágcsáló
- **Kosár és kedvencek:** Termékek kosárba helyezése, kedvencek listázása, mennyiség módosítása
- **Kuponrendszer:** Egyedi kuponok beváltása, adminisztrációs kuponkezelés
- **Admin felület:** Termékek, felhasználók, rendelések, kuponok kezelése, jogosultságok
- **Felhasználói fiókok:** Regisztráció, bejelentkezés, jelszóemlékeztető, profilkezelés
- **Képgaléria:** Termékképek, kategóriaképek, carousel
- **Kereső:** Termékek keresése név, kategória vagy leírás alapján
- **Tippek:** Kisállattartási tanácsok, hasznos információk

## Fejlesztők
- Hegymegi Ákos
- Kamecz Martin
- Péterffy Dominika

## Licenc
MIT

---

További részletekért lásd a README.md-t, WEBDOK.md-t és a forráskódot.