

# Projekt Dokumentáció


## Projekt neve
Webshop kisállatoknak


## Áttekintés
Ez a projekt egy teljes körű, modern kisállat-webshop rendszer, amelynek célja, hogy a felhasználók egyszerűen, gyorsan és biztonságosan vásárolhassanak különféle kisállatoknak szánt termékeket. A rendszer mind a végfelhasználók, mind az adminisztrátorok számára átlátható, könnyen kezelhető felületet biztosít. A frontend egy reszponzív, felhasználóbarát React alkalmazás, míg a backend egy biztonságos, REST API-t nyújtó PHP rendszer. A projekt támogatja a felhasználói fiókokat, adminisztrációs funkciókat, termékek, rendelések, kuponok kezelését, valamint számos kényelmi és marketing funkciót (pl. galéria, kereső, tippek, kedvencek, kuponrendszer).


### Fő célok
- Felhasználóbarát, reszponzív webes felület, amely minden eszközön jól használható
- Gyors, biztonságos és átlátható vásárlási folyamat, egyszerű fizetési lehetőségekkel
- Adminisztrációs lehetőségek: termékek, felhasználók, rendelések, kuponok, jogosultságok kezelése
- Képgaléria, kereső, tippek, kuponrendszer, kedvencek, hogy a vásárlói élmény teljes legyen


## Rendszerfelépítés

### Frontend
A frontend egy modern, React + Vite alapú single-page application (SPA), amely komponens-alapú felépítésének köszönhetően könnyen bővíthető és karbantartható. A felhasználók számára letisztult, gyors és reszponzív felületet biztosít, amelyen minden fontos funkció (termékböngészés, kosár, kedvencek, kuponok, adminisztráció, galéria, kereső, tippek) elérhető. A fejlesztés során kiemelt figyelmet fordítottunk a felhasználói élményre, a mobilbarát megjelenésre és a könnyű navigációra.

#### Főbb oldalak és komponensek:
- Főoldal: kiemelt ajánlatok, újdonságok, akciók
- Kategóriaoldalak: termékek listázása állatfajonként
- Termékoldal: részletes termékinformációk, képek, értékelések
- Kosár: termékek mennyiségének módosítása, törlés, végösszeg
- Kedvencek: felhasználó által elmentett termékek
- Kuponok: aktív és beváltott kuponok kezelése
- Admin felület: termékek, felhasználók, rendelések, kuponok kezelése
- Galéria: termékképek, kategóriaképek, carousel
- Kereső: termékek keresése név, kategória vagy leírás alapján
- Tippek: kisállattartási tanácsok, hasznos információk

### Backend
A backend egy PHP alapú REST API, amely a frontenddel JSON formátumban kommunikál. A rendszer támogatja a felhasználói regisztrációt, bejelentkezést, jogosultságkezelést (JWT tokenekkel), valamint a termékek, rendelések, kuponok, felhasználók adminisztrációját. Az adatbázis MySQL alapú, a szerkezetet és mintákat a kisallat.sql tartalmazza. A backend biztonságos, jól strukturált, könnyen bővíthető, és támogatja a modern webes elvárásokat (CORS, jelszó reset, stb.).

#### Főbb végpontok:
- /api/products: termékek listázása, részletei, keresése
- /api/categories: kategóriák lekérdezése
- /api/orders: rendelések kezelése
- /api/coupons: kuponok kezelése
- /api/users: felhasználók kezelése (admin)
- /api/auth: regisztráció, bejelentkezés, jelszóemlékeztető

### Főbb mappák és fájlok
- **13A_Projekt_webshop-Frontend/react/**: Frontend forráskód, komponensek, stílusok, képek
- **backend/**: Backend API, konfigurációk, admin végpontok
- **kisallat.sql**: Adatbázis szerkezet, tesztadatok
- **README.md, SETUP.md, WEBDOK.md**: Telepítési, használati, fejlesztői dokumentációk


## Telepítési útmutató

### Frontend telepítése és indítása
1. Navigálj a `13A_Projekt_webshop-Frontend/react` mappába terminálban vagy parancssorban.
2. Futtasd az `npm install` parancsot a szükséges csomagok telepítéséhez (Node.js szükséges).
3. Indítsd a fejlesztői szervert az `npm run dev` paranccsal. Az alkalmazás alapértelmezett címe: http://localhost:5173
4. A forráskód módosítása után a szerver automatikusan újratölti az oldalt.

### Backend telepítése és indítása
1. Másold a `backend` mappát egy PHP-t támogató szerverre (pl. XAMPP, MAMP, Apache, nginx).
2. Állítsd be az adatbázis elérhetőségeit a `backend/config/database.php` fájlban (host, felhasználó, jelszó, adatbázisnév).
3. Importáld a `kisallat.sql` fájlt a MySQL adatbázisodba (phpMyAdmin vagy parancssor segítségével).
4. A backend API elérhető lesz pl. http://localhost/backend/api/products.php

### Ajánlott fejlesztői környezet
- Node.js (ajánlott verzió: 18+)
- PHP (ajánlott verzió: 8+)
- MySQL (ajánlott verzió: 8+)
- Visual Studio Code vagy más modern szerkesztő


## Fő funkciók részletesen

- **Termékkategóriák böngészése:**
	- A felhasználók különböző állatfajok (kutya, macska, madár, hal, hüllő, rágcsáló) termékeit böngészhetik, szűrhetnek kategóriák, ár, népszerűség vagy újdonság szerint.
	- Minden kategória saját oldallal, képekkel, leírással és ajánlott termékekkel rendelkezik.

- **Kosár és kedvencek:**
	- A termékeket egy kattintással kosárba lehet helyezni, a kosár tartalma bármikor módosítható, törölhető.
	- Kedvencek funkció: a felhasználók elmenthetik a számukra érdekes termékeket, melyeket később könnyen elérhetnek.

- **Kuponrendszer:**
	- Egyedi, adminisztrátor által generált kuponkódok beváltása, amelyek kedvezményeket biztosítanak a vásárlás során.
	- A kuponok érvényessége, felhasználhatósága adminisztrációs felületen kezelhető.

- **Admin felület:**
	- Jogosultságkezelés: csak adminisztrátorok férhetnek hozzá.
	- Termékek, felhasználók, rendelések, kuponok teljes körű kezelése (létrehozás, szerkesztés, törlés, listázás).
	- Részletes statisztikák, naplózás, keresés, szűrés.

- **Felhasználói fiókok:**
	- Regisztráció, bejelentkezés, jelszóemlékeztető, profiladatok módosítása.
	- Minden felhasználó saját rendeléseit, kedvenceit, kuponjait láthatja.

- **Képgaléria:**
	- Termékképek, kategóriaképek, carousel funkció a főoldalon.
	- Galéria oldal, ahol a felhasználók böngészhetik az összes feltöltött képet.

- **Kereső:**
	- Intelligens kereső, amely név, kategória vagy leírás alapján találja meg a termékeket.
	- Azonnali találati lista, szűrési lehetőségek.

- **Tippek:**
	- Kisállattartási tanácsok, hasznos információk, cikkek, amelyek segítik a vásárlókat a felelős állattartásban.

## Fejlesztők
- Hegymegi Ákos – projektvezetés, backend fejlesztés, adatbázis
- Kamecz Martin – frontend fejlesztés, UI/UX, React komponensek
- Péterffy Dominika – tesztelés, dokumentáció, tartalomkészítés

## Licenc
MIT – A projekt szabadon felhasználható, módosítható és terjeszthető a MIT licenc feltételei szerint.

---

További részletekért lásd a README.md-t, WEBDOK.md-t és a forráskódot.

## Fejlesztők
- Hegymegi Ákos
- Kamecz Martin
- Péterffy Dominika

## Licenc
MIT

---

További részletekért lásd a README.md-t, WEBDOK.md-t és a forráskódot.