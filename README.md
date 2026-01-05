<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🐾 Kisállat Webshop - Teljes Projekt

Kisállat webáruház React frontendel és PHP backenddel.

## 📦 Projekt Struktúra

```
project/
├── backend/                          # PHP REST API
│   ├── api/
│   │   ├── admin/                    # Admin végpontok
│   │   │   ├── products.php          # ✅ Termékkezelés CRUD
│   │   │   └── orders.php            # ✅ Rendeléskezelés + számla
│   │   ├── auth.php                  # ✅ Regisztráció/Bejelentkezés
│   │   ├── products.php              # ✅ Termékek publikus API
│   │   ├── categories.php            # ✅ Kategóriák
│   │   ├── orders.php                # ✅ Rendelés leadás (user)
│   │   ├── reviews.php               # ✅ Vélemények/Kommentek
│   │   └── upload.php                # ✅ Kép feltöltés
├── SETUP.md                          # Telepítési útmutató
└── README.md                         # Ez a fájl
```

## ✨ Funkciók

### 🛒 Felhasználói funkciók
- ✅ **Regisztráció és bejelentkezés** - JWT token alapú autentikáció
- ✅ **Termékek böngészése** - Kategóriák, keresés, szűrés
- ✅ **Termék részletek** - Leírás, képek, értékelések
- ✅ **Vélemények írása** - Bejelentkezett és vendég felhasználók
- ✅ **Kosár kezelés** - LocalStorage + Context API
- ✅ **Rendelés leadása** - Szállítási adatok, fizetési mód
- ✅ **Saját rendelések** - Rendelési előzmények megtekintése

### 🔧 Admin funkciók
- ✅ **Termékkezelés** - CRUD műveletek
  - Új termék létrehozása
  - Termék szerkesztése
  - Termék törlése
  - Termék aktiválás/deaktiválás
  - Kép feltöltés vagy URL megadás
  - Leírás és kategorizálás (kötelező)
- ✅ **Rendeléskezelés**
  - Összes rendelés listázása
  - Rendelés részletek megtekintése
  - Rendelés jóváhagyása (státusz frissítés)
  - Rendelés törlése
  - Számla letöltése HTML formátumban
- ✅ **Véleménykezelés** - Elfogadás/elutasítás

## 🗄️ Adatbázis Séma

**Táblák:**
- `felhasznalok` - Felhasználók (auth + profil + admin flag)
- `kategoriak` - Főkategóriák (kutya, macska, stb.)
- `alkategoriak` - Alkategóriák (póráz, tál, táp, stb.)
- `termekek` - Termékek (név, ár, készlet, képek, leírás)
- `termek_velemenyek` - Értékelések és kommentek
- `kosar` - Bevásárlókosár (user-product kapcsolat)
- `rendelések` - Rendelések (státusz, összeg, szállítási adatok)
- `rendeles_tetelek` - Rendelés tételek

## 🚀 Gyors Indítás

### 1. Adatbázis telepítése
```bash
mysql -u root -p < kisallat.sql
```

### 2. Backend konfiguráció
Szerkeszd a `backend/config/database.php` fájlt az adatbázis adatokkal.

```bash
cd backend
php -S localhost:8000
```

### 3. Frontend indítása
```bash
cd 13A_Projekt_webshop-Frontend/react
npm install
npm run dev
```

A frontend elérhető: `http://localhost:5173`
A backend API: `http://localhost:8000/api`

**Részletes telepítés:** Nézd meg a [SETUP.md](SETUP.md) fájlt!

## 🔑 API Végpontok

### Publikus
- `POST /api/auth.php/register` - Regisztráció
- `POST /api/auth.php/login` - Bejelentkezés
- `GET /api/products.php` - Termékek listája
- `GET /api/products.php/{id}` - Termék részletei
- `GET /api/categories.php` - Kategóriák
- `GET /api/reviews.php/product/{id}` - Vélemények
- `POST /api/reviews.php` - Vélemény írása

### Bejelentkezve (JWT token)
- `GET /api/auth.php/me` - Saját profil
- `POST /api/orders.php/create` - Rendelés leadása
- `GET /api/orders.php/my-orders` - Saját rendelések

### Admin (JWT token + admin flag)
- `GET/POST/PUT/DELETE /api/admin/products.php` - Termékkezelés
- `GET/PUT/DELETE /api/admin/orders.php` - Rendeléskezelés
- `GET /api/admin/orders.php/{id}/invoice` - Számla
- `POST /api/upload.php` - Kép feltöltés

**Teljes API dokumentáció:** [backend/README.md](backend/README.md)

## 🛡️ Biztonság

- ✅ **JWT autentikáció** - Token alapú védelem
- ✅ **Password hashing** - bcrypt jelszó tárolás
- ✅ **SQL injection védelem** - Prepared statements
- ✅ **CORS védelem** - Engedélyezett originek
- ✅ **Admin jogosultság** - Külön endpoint védelem
- ✅ **Input validáció** - Backend és frontend oldalon
- ⚠️ **HTTPS** - Éles környezetben kötelező!
- ⚠️ **JWT secret** - Cseréld le éles környezetben!

## 📝 Követelmények

### Backend
- PHP 7.4+ (ajánlott: 8.0+)
- MySQL 5.7+ / MariaDB 10.3+
- Apache/Nginx (mod_rewrite)

### Frontend
- Node.js 16+
- npm/yarn
- Modern böngésző (ES6 támogatás)

## 🎨 Technológiák

**Frontend:**
- React 19
- React Router DOM 7
- Bootstrap 5
- Vite 7

**Backend:**
- PHP 8.x
- PDO (MySQL)
- JWT autentikáció
- REST API

**Adatbázis:**
- MySQL 8.0
- utf8mb4_hungarian_ci collation

## 📋 TODO / Fejlesztési lehetőségek

- [ ] Email küldés (rendelés visszaigazolás, regisztráció)
- [ ] Jelszó visszaállítás
- [ ] Admin dashboard statisztikák
- [ ] Termék képek tömeges feltöltése
- [ ] Kedvencek lista
- [ ] Kuponkódok, kedvezmények
- [ ] Termék variációk (méret, szín)
- [ ] Készlet riasztás (admin)
- [ ] PDF számla generálás
- [ ] Keresési előzmények
- [ ] Termék ajánlások

## 🐛 Hibaelhárítás

Nézd meg a [SETUP.md](SETUP.md) fájl "Hibakeresés" szakaszát!

## 📄 Licensz

Ez egy oktatási projekt.

## 👨‍💻 Fejlesztő

13A Projekt - Kisállat Webshop

---

**Üzembe helyezés előtt:**
1. Cseréld le a JWT secret kulcsot
2. Állítsd be az éles adatbázis kapcsolatot
3. Korlátozd a CORS engedélyezett origineket
4. Telepíts SSL tanúsítványt (HTTPS)
5. Állítsd be a rate limiting-et
>>>>>>> 932477e329273d737bbe24b0f1a96ddeaed1ecad
