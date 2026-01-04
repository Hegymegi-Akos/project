# Kisállat Webshop - Teljes Dokumentáció

## Áttekintés

Ez a projekt egy modern, reszponzív webshop alkalmazás kisállatok számára. A rendszer React frontenddel és PHP backenddel rendelkezik, MySQL adatbázissal. A webshop lehetővé teszi termékek böngészését, vásárlást, felhasználói fiókokat, adminisztrációt és közösségi funkciókat.

## Architektúra

### Frontend (React + Vite)
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Bootstrap 5.3.8 + Egyedi CSS
- **Routing**: React Router DOM 7.11.0
- **State Management**: React Context API
- **API Kommunikáció**: Fetch API (közvetlen hívások)
- **Email**: EmailJS integráció rendelési értesítésekhez

### Backend (PHP)
- **Szerver**: Apache vagy PHP built-in server
- **Adatbázis**: MySQL (PDO)
- **Autentikáció**: JWT tokenek
- **API**: RESTful API végpontok
- **Biztonság**: Admin megosztott jelszó, tiltott szavak szűrése

### Adatbázis
- **Táblák**:
  - `felhasznalok`: Felhasználói adatok
  - `termekek`: Termékek és készlet
  - `rendelések`: Rendelés fejadatok
  - `rendeles_tetelek`: Rendelés tételek
  - `termek_velemenyek`: Vélemények és értékelések
  - `fal_bejegyzesek`: Közösségi fal
  - `kuponok`: Kuponok és kedvezmények
  - `tiltott_szavak`: Moderációs lista

## Főbb Funkciók

### Felhasználói Funkciók
1. **Regisztráció és Bejelentkezés**
   - JWT alapú autentikáció
   - Automatikus token mentés localStorage-ban

2. **Termékböngészés**
   - Kategóriák: Kutya, Macska, Hüllő, Rágcsáló, Madár, Hal
   - Alkategóriák (pl. kutyaeledel, macskajáték)
   - Keresés és szűrés (ár, név)
   - Gyors nézet modal
   - Kedvencek hozzáadása

3. **Kosár és Vásárlás**
   - Kosár kezelése (mennyiség módosítás, törlés)
   - Kupon rendszer (százalékos és fix kedvezmények)
   - Hűségkupon (0.5% automatikus kedvezmény)
   - Szállítási és fizetési módok kiválasztása
   - Email értesítés rendelésről

4. **Vélemények és Közösség**
   - Termék értékelés (1-5 csillag)
   - Vélemény írás és olvasás
   - Közösségi fal (bejegyzések, kommentek)
   - Tiltott szavak szűrése

5. **Felhasználói Profil**
   - Rendelés előzmények
   - Kuponjaim kezelése
   - Kedvencek listája

### Admin Funkciók
1. **Termékkezelés**
   - Termékek hozzáadása/szerkesztése/törlése
   - Készlet kezelés
   - Képfeltöltés

2. **Rendeléskezelés**
   - Rendelés státusz módosítása
   - Számla generálása (HTML formátumban)
   - Rendelés részletek megtekintése

3. **Felhasználókezelés**
   - Felhasználók listázása
   - Admin jogok kezelése

4. **Moderáció**
   - Tiltott szavak kezelése
   - Vélemények törlése

## Technikai Specifikációk

### Frontend Struktúra
```
src/
├── components/          # React komponensek
│   ├── Home.jsx        # Főoldal
│   ├── ProductList.jsx # Termék lista
│   ├── Cart.jsx        # Kosár
│   ├── Auth.jsx        # Bejelentkezés/Regisztráció
│   ├── Admin.jsx       # Admin dashboard
│   └── ...
├── context/            # React Context providerek
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── ...
├── api/                # API szolgáltatások
│   └── apiService.js   # Központi API hívások
├── styles/             # CSS fájlok
│   ├── main.css       # Fő stílusok
│   ├── gallery.css    # Galéria stílusok
│   └── slider.css     # Slider animációk
└── data/               # Statikus adatok
```

### Backend Struktúra
```
backend/
├── api/                # API végpontok
│   ├── auth.php       # Autentikáció
│   ├── products.php   # Termékek
│   ├── orders.php     # Rendelések
│   ├── reviews.php    # Vélemények
│   └── admin/         # Admin API-k
├── config/            # Konfigurációs fájlok
│   ├── database.php   # DB kapcsolat
│   ├── cors.php       # CORS fejlécek
│   └── jwt.php        # JWT kezelés
└── uploads/           # Feltöltött képek
```

## Telepítés és Futtatás

### Előfeltételek
- Node.js 18+
- PHP 7.4+
- MySQL 5.7+
- Composer (opcionális)

### Frontend Telepítés
```bash
cd 13A_Projekt_webshop-Frontend/react
npm install
npm run dev
```

### Backend Telepítés
1. MySQL adatbázis létrehozása: `kisallat_webshop`
2. Importálás: `kisallat_webshop.sql`
3. PHP szerver indítása:
   ```bash
   cd backend
   php -S localhost:8000
   ```
4. Vagy Apache konfiguráció: DocumentRoot -> backend/

### Környezeti Változók
Frontend (.env):
```
VITE_API_URL=http://localhost/project/backend/api
VITE_ADMIN_ALLOWLIST=user1@example.com,user2@example.com
```

Backend (config/jwt.php):
```php
define('JWT_SECRET_KEY', 'your-secret-key-here');
define('ADMIN_SHARED_SECRET', 'your-admin-secret');
```

## API Dokumentáció

### Autentikáció
- `POST /auth.php/register` - Regisztráció
- `POST /auth.php/login` - Bejelentkezés
- `GET /auth.php/me` - Aktuális felhasználó
- `GET /auth.php/check-auth` - Autentikáció ellenőrzés

### Termékek
- `GET /products.php` - Összes termék
- `GET /products.php?id=1` - Egy termék
- `GET /products.php/search?q=keresés` - Keresés
- `GET /products.php/category?kategoria=kutya` - Kategória szerint

### Rendelések
- `POST /orders.php/create` - Rendelés leadása
- `GET /orders.php/my-orders` - Saját rendelések
- `GET /orders.php/123` - Rendelés részletek

### Admin API-k
- `GET /admin/products.php` - Admin termék lista
- `POST /admin/products.php` - Termék hozzáadás
- `PUT /admin/products.php?id=1` - Termék szerkesztés
- `GET /admin/orders.php` - Admin rendelések

## Biztonság

### Frontend Biztonság
- XSS védelem: React automatikus escaping
- CSRF védelem: JWT tokenek
- Input validáció: HTML5 + JavaScript

### Backend Biztonság
- SQL injection védelem: PDO prepared statements
- Password hash: bcrypt
- JWT token validáció
- Admin megosztott jelszó
- CORS konfiguráció

## Tesztelés

### Egységtesztek
```bash
npm run test
```

### E2E Tesztek (Playwright)
```bash
npm run test:e2e
```

### Manuális Tesztelés
1. Regisztráció és bejelentkezés
2. Termék hozzáadás kosárhoz
3. Rendelés leadása
4. Admin panel ellenőrzés
5. Vélemény írás

## Üzemeltetés

### Deploy Frontend
```bash
npm run build
# dist/ könyvtár tartalmát webszerverre feltölteni
```

### Deploy Backend
- PHP fájlokat webszerverre feltölteni
- Adatbázis migráció futtatása
- Környezeti változók beállítása

### Monitorozás
- PHP error logok ellenőrzése
- MySQL slow query log
- Frontend console hibák

## Fejlesztési Tervek

### Rövid Távú (1-3 hónap)
- [ ] Mobil app fejlesztés (React Native)
- [ ] Több fizetési mód integráció (Stripe, PayPal)
- [ ] Email sablonok javítása
- [ ] SEO optimalizálás

### Közép Távú (3-6 hónap)
- [ ] Többnyelvű támogatás (i18n)
- [ ] API dokumentáció (Swagger/OpenAPI)
- [ ] Cache rendszer (Redis)
- [ ] Analytics integráció (Google Analytics)

### Hosszú Távú (6+ hónap)
- [ ] Mikroszolgáltatásokra bontás
- [ ] Machine learning ajánlások
- [ ] Marketplace funkciók
- [ ] Valós idejű chat támogatás

## Hibaelhárítás

### Gyakori Problémák
1. **API hívások sikertelenek**: Ellenőrizni a VITE_API_URL beállítást
2. **Bejelentkezés nem működik**: JWT_SECRET_KEY egyezik-e
3. **Képek nem töltődnek**: uploads/ könyvtár jogosultságok
4. **Email nem küldődik**: EmailJS konfiguráció

### Debug Mód
Frontend: Browser DevTools Console
Backend: PHP error logok, MySQL general log

## Kapcsolat

Fejlesztő: [Név]
Email: [Email]
GitHub: [Repository URL]

---

*Dokumentáció utolsó frissítés: 2026. január 3.*