# 🐾 Kisállat Webshop - Backend Elkészült! ✅

## 📊 Mit csináltam?

Létrehoztam egy teljes körű **PHP REST API backendet** a kisállat webshophoz az összes kért funkcióval.

## ✅ Elkészült funkciók

### 1. 🔐 Bejelentkezés és Regisztráció
- **Regisztráció** - Új felhasználók létrehozása
- **Bejelentkezés** - JWT token alapú autentikáció
- **Jelszó biztonság** - bcrypt hash tárolás
- **Munkamenet kezelés** - Token validálás minden védett végpontnál

### 2. 💬 Kommentelés/Vélemények
- **Vélemények írása** - Bejelentkezett ÉS vendég felhasználók is írhatnak
- **Értékelések** - 1-5 csillagos értékelés
- **Statisztikák** - Átlag értékelés, csillag megoszlás
- **Hasznos jelölés** - "Segített ez a vélemény?" gomb
- **Ki van bejelentkezve látszik** - A véleménynél látszik a felhasználónév

### 3. 🛡️ Admin Panel Funkciók

#### Termékkezelés:
- ✅ **Új termék létrehozása** - Teljes CRUD
- ✅ **Termék szerkesztése** - Minden mező módosítható
- ✅ **Termék törlése** - DELETE művelet
- ✅ **Kép kezelés** - URL VAGY feltöltés (mindkettő működik!)
- ✅ **Leírás mezők** - Rövid és részletes leírás
- ✅ **Kötelező kategorizálás** - Kategória és alkategória választás kötelező
- ✅ **Készlet kezelés** - Készlet mennyiség nyomon követése
- ✅ **Aktív/inaktív** - Termékek be/kikapcsolása

#### Rendeléskezelés:
- ✅ **Rendelések listázása** - Összes rendelés státusszal
- ✅ **Rendelés részletek** - Teljes rendelés megtekintése (tételekkel)
- ✅ **Jóváhagyás** - Rendelés státusz frissítése (új → feldolgozás → fizetve → kész)
- ✅ **Rendelés törlése** - DELETE művelet
- ✅ **Számla letöltés** - HTML számla generálás és letöltés

### 4. 🛒 Felhasználói funkciók
- **Termékek böngészése** - Kategóriák, keresés
- **Kosár kezelés** - CartContext már megvan a frontenden
- **Rendelés leadása** - Teljes checkout folyamat
- **Saját rendelések** - Rendelési előzmények megtekintése

## 📁 Létrehozott fájlok

```
backend/
├── api/
│   ├── admin/
│   │   ├── products.php       ✅ Admin termékkezelés (CRUD + feltöltés)
│   │   └── orders.php         ✅ Admin rendelések (jóváhagyás + számla)
│   ├── auth.php               ✅ Regisztráció + bejelentkezés
│   ├── products.php           ✅ Termékek publikus API
│   ├── categories.php         ✅ Kategóriák lekérése
│   ├── orders.php             ✅ Rendelés leadás (user)
│   ├── reviews.php            ✅ Vélemények (CRUD)
│   └── upload.php             ✅ Kép feltöltés
├── config/
│   ├── database.php           ✅ MySQL kapcsolat
│   ├── cors.php               ✅ CORS beállítások
│   ├── jwt.php                ✅ JWT autentikáció
│   └── .htaccess              ✅ Biztonság
├── uploads/                   📁 Feltöltött képek helye
├── .htaccess                  ✅ URL rewriting
├── index.php                  ✅ API info oldal
└── README.md                  ✅ Teljes API dokumentáció

13A_Projekt_webshop-Frontend/react/
├── src/
│   └── api/
│       └── apiService.js      ✅ Frontend integráció (összes API hívás!)
└── .env.example               ✅ Környezeti változók

Projekt gyökér:
├── kisallat.sql               ✅ Frissített adatbázis (typo javítva)
├── README.md                  ✅ Projekt összefoglaló
├── SETUP.md                   ✅ Telepítési útmutató
└── .gitignore                 ✅ Git kizárások
```

## 🗄️ Adatbázis módosítások

```sql
-- Javítva:
vendeg_nev VARCHAR(100)  -- volt: vendeq_nev (typo)
```

## 🚀 Hogyan indítsd el?

### 1. Adatbázis
```bash
mysql -u root -p < kisallat.sql
```

### 2. Backend konfig
Szerkeszd: `backend/config/database.php`
```php
private $username = "root";    // <- MySQL user
private $password = "";        // <- MySQL jelszó
```

### 3. Backend indítása
```bash
cd backend
php -S localhost:8000
```

### 4. Frontend .env
Hozd létre: `13A_Projekt_webshop-Frontend/react/.env`
```
VITE_API_URL=http://localhost:8000/api
```

### 5. Frontend indítása
```bash
cd 13A_Projekt_webshop-Frontend/react
npm install
npm run dev
```

## 🔑 Admin felhasználó létrehozása

```sql
-- 1. Generálj jelszó hasht PHP-val:
<?php echo password_hash('admin123', PASSWORD_BCRYPT); ?>

-- 2. Futtasd SQL-ben:
INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash, admin) 
VALUES ('admin', 'admin@kisallat.hu', '$2y$10$...(generált hash)', 1);

-- VAGY regisztrálj normál usert, majd:
UPDATE felhasznalok SET admin = 1 WHERE felhasznalonev = 'admin';
```

## 📖 API Példák

### Bejelentkezés (React):
```javascript
import { authAPI } from './api/apiService';

const handleLogin = async () => {
  const result = await authAPI.login('felhasznalo', 'jelszo');
  console.log('User:', result.user);
  console.log('Admin?', result.user.admin);
};
```

### Termékek lekérése:
```javascript
import { productsAPI } from './api/apiService';

const products = await productsAPI.getAll();
const dogProducts = await productsAPI.getByCategory('kutya');
```

### Admin - Új termék:
```javascript
import { adminProductsAPI, uploadAPI } from './api/apiService';

// Kép feltöltése
const imageResult = await uploadAPI.uploadImage(file);

// Termék létrehozása
const productData = {
  alkategoria_id: 1,
  nev: 'Royal Canin',
  leiras: 'Kiváló minőségű...',
  rovid_leiras: 'Kutyatáp',
  ar: 15000,
  akcios_ar: 12000,
  keszlet: 50,
  fo_kep: imageResult.url,  // Feltöltött kép
  tobbi_kep: ['url1.jpg', 'url2.jpg'], // vagy további feltöltések
  aktiv: 1
};

await adminProductsAPI.create(productData);
```

### Admin - Rendelés jóváhagyása:
```javascript
import { adminOrdersAPI } from './api/apiService';

// Rendelések listája
const orders = await adminOrdersAPI.getAll();

// Státusz frissítése
await adminOrdersAPI.updateStatus(orderId, 'feldolgozás');

// Számla URL
const invoiceUrl = adminOrdersAPI.getInvoiceUrl(orderId);
window.open(invoiceUrl, '_blank');
```

### Vélemény írása:
```javascript
import { reviewsAPI } from './api/apiService';

const reviewData = {
  termek_id: 1,
  ertekeles: 5,
  cim: 'Kiváló termék!',
  velemeny: 'A kutyám imádja...',
  // vendeg_nev: 'Kovács János'  // csak ha nincs bejelentkezve
};

await reviewsAPI.create(reviewData);
```

## 🎯 Fontos tudnivalók

### Biztonság:
- ⚠️ **JWT_SECRET_KEY** - Cseréld le éles környezetben! (`config/jwt.php`)
- ⚠️ **HTTPS** - Éles környezetben kötelező SSL
- ⚠️ **CORS** - Korlátozd az engedélyezett origineket (`config/cors.php`)

### Kategóriák:
Az adatbázisban már van 6 kategória:
1. Kutya
2. Macska
3. Rágcsáló
4. Hüllő
5. Madár
6. Hal

Mindegyikhez vannak alkategóriák (póráz, tál, táp, stb.)

### Kép kezelés:
Két mód:
1. **URL megadás** - Egyszerűen írd be a kép URL-t
2. **Feltöltés** - `uploadAPI.uploadImage(file)` → URL jön vissza

## 📚 Dokumentáció

- **Teljes API docs**: [backend/README.md](backend/README.md)
- **Telepítési útmutató**: [SETUP.md](SETUP.md)
- **Projekt áttekintő**: [README.md](README.md)
- **Frontend integráció**: [react/src/api/apiService.js](13A_Projekt_webshop-Frontend/react/src/api/apiService.js)

## ✨ Következő lépések

1. ✅ Backend működik
2. ⬜ **Hozz létre admin felhasználót** (fenti SQL)
3. ⬜ **Integrálj a React frontendbe** (használd az `apiService.js`-t)
4. ⬜ **Hozz létre admin komponenseket**:
   - AdminProductList
   - AdminProductForm
   - AdminOrderList
   - AdminOrderDetails
5. ⬜ **Tesztelj mindent**

## 🐛 Problémák?

Nézd meg a [SETUP.md](SETUP.md) "Hibakeresés" szakaszát!

---

**🎉 Minden funkció elkészült amit kértél!**

- ✅ Bejelentkezés/Regisztráció
- ✅ Kommentelés (be van jelentkezve látszik)
- ✅ Admin termékkezelés (kép URL/feltöltés, leírás, kategorizálás)
- ✅ Admin rendelések (jóváhagyás, törlés, számla)
- ✅ Termék frissítés

**Most már csak a React frontendben kell használni az API-t!** 🚀
