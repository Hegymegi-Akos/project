# Kisállat Webshop - Backend Setup Útmutató

## 📋 Előfeltételek

- **PHP 7.4+** (ajánlott: PHP 8.0+)
- **MySQL 5.7+** vagy **MariaDB 10.3+**
- **Apache** vagy **Nginx** webszerver
- **Composer** (opcionális, jelenleg nem szükséges)

## 🚀 Gyors Telepítés

### 1. Adatbázis létrehozása

```bash
# MySQL-be bejelentkezés
mysql -u root -p

# Vagy közvetlenül SQL fájl importálása
mysql -u root -p < kisallat.sql
```

### 2. Backend konfiguráció

Nyisd meg a `backend/config/database.php` fájlt és állítsd be az adatbázis kapcsolatot:

```php
private $host = "localhost";
private $db_name = "kisallat_webshop";
private $username = "root";  // <- módosítsd
private $password = "";      // <- módosítsd
```

### 3. JWT titkos kulcs beállítása

**FONTOS!** Éles környezetben feltétlenül cseréld le a JWT kulcsot!

Szerkeszd: `backend/config/jwt.php`

```php
define('JWT_SECRET_KEY', 'ITT_EGY_EROS_TITKOS_KULCS');
```

### 4. Backend indítása

#### Opció A: PHP beépített szerver (fejlesztés)

```bash
cd backend
php -S localhost:8000
```

#### Opció B: Apache/Nginx

1. Másold a `backend` mappát a webszerver dokumentum gyökerébe (pl. `htdocs`, `www`)
2. Ellenőrizd hogy a `.htaccess` fájlok léteznek
3. Apache esetén engedélyezd a `mod_rewrite` modult

```bash
# Apache mod_rewrite engedélyezése (Linux)
sudo a2enmod rewrite
sudo service apache2 restart
```

### 5. Jogosultságok beállítása

```bash
# Linux/Mac
chmod 755 backend/uploads
chmod 644 backend/config/*.php

# Vagy ha szükséges
sudo chown -R www-data:www-data backend/uploads
```

## 🧪 Tesztelés

### API elérhetőség ellenőrzése

```bash
# Főoldal
curl http://localhost:8000

# Termékek listája
curl http://localhost:8000/api/products.php

# Kategóriák
curl http://localhost:8000/api/categories.php
```

### Admin felhasználó létrehozása

Először hozz létre egy normál felhasználót regisztrációval, majd az adatbázisban állítsd be admin jogosultságot:

```sql
UPDATE felhasznalok 
SET admin = 1 
WHERE felhasznalonev = 'admin_user';
```

Vagy közvetlenül SQL-el:

```sql
INSERT INTO felhasznalok (felhasznalonev, email, jelszo_hash, admin) 
VALUES ('admin', 'admin@kisallat.hu', '$2y$10$YourPasswordHashHere', 1);
```

A jelszó hash generálásához használd a PHP `password_hash()` függvényt:

```php
<?php
echo password_hash('admin123', PASSWORD_BCRYPT);
?>
```

## 📁 Backend Struktúra

```
backend/
├── api/
│   ├── admin/
│   │   ├── products.php    # Admin termékkezelés
│   │   └── orders.php      # Admin rendeléskezelés
│   ├── auth.php            # Bejelentkezés, regisztráció
│   ├── products.php        # Termékek publikus API
│   ├── categories.php      # Kategóriák
│   ├── orders.php          # Rendelések (user)
│   ├── reviews.php         # Vélemények
│   └── upload.php          # Kép feltöltés
├── config/
│   ├── database.php        # Adatbázis konfig
│   ├── cors.php            # CORS beállítások
│   └── jwt.php             # JWT autentikáció
├── uploads/                # Feltöltött képek
├── .htaccess               # Apache rewrite szabályok
├── index.php               # API főoldal
└── README.md               # API dokumentáció
```

## 🔐 Biztonság

### Éles környezetben KÖTELEZŐ:

1. **JWT kulcs csere** - `config/jwt.php`
2. **HTTPS használata** - SSL tanúsítvány telepítése
3. **CORS korlátozása** - Csak engedélyezett domének
4. **Adatbázis jelszó** - Erős jelszó használata
5. **Fájl jogosultságok** - config fájlok védelem
6. **SQL injection védelem** - Prepared statements (már használatban)
7. **XSS védelem** - Input validáció
8. **Rate limiting** - API túlterhelés elleni védelem

### CORS beállítások frissítése

Szerkeszd: `backend/config/cors.php`

```php
$allowed_origins = [
    'https://kisallat-webshop.hu',  // <- Éles domain
];
```

## 🐛 Hibakeresés

### Gyakori problémák:

#### 1. "Database connection error"
- Ellenőrizd a MySQL szervert: `mysql -u root -p`
- Ellenőrizd a `config/database.php` beállításokat
- Nézd meg a MySQL hibákat: `tail -f /var/log/mysql/error.log`

#### 2. "Access denied" vagy 403-as hiba
- Ellenőrizd a JWT tokent
- Nézd meg az admin flag-et az adatbázisban
- Ellenőrizd a `Authorization` headert

#### 3. "CORS error" a frontendben
- Ellenőrizd a `config/cors.php` fájlban az engedélyezett origineket
- Apache esetén engedélyezd a `mod_headers` modult

#### 4. Képfeltöltés nem működik
- Ellenőrizd az `uploads/` mappa jogosultságait
- PHP upload limit: `upload_max_filesize` és `post_max_size` növelése

```ini
; php.ini
upload_max_filesize = 10M
post_max_size = 10M
```

### Debug mode bekapcsolása

PHP hibák megjelenítése fejlesztés során:

```php
// Tedd az adott API fájl elejére
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
```

## 📊 Kezdő adatok

Az SQL fájl tartalmaz:
- ✅ 6 kategóriát (kutya, macska, rágcsáló, hüllő, madár, hal)
- ✅ Alkategóriákat
- ✅ Példa termékértékeléseket

Adj hozzá termékeket az admin felületen vagy SQL-el!

## 🔄 Frontend integráció

A React frontend környezeti változók:

```bash
# 13A_Projekt_webshop-Frontend/react/.env
VITE_API_URL=http://localhost:8000/api
```

Használat React-ben:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Termékek lekérése
const response = await fetch(`${API_URL}/products.php`);
const products = await response.json();

// Bejelentkezés JWT tokennel
const loginResponse = await fetch(`${API_URL}/auth.php/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ felhasznalonev, jelszo })
});
const { token, user } = await loginResponse.json();
localStorage.setItem('token', token);

// API hívás JWT tokennel
const ordersResponse = await fetch(`${API_URL}/orders.php/my-orders`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🎯 Következő lépések

1. ✅ Backend telepítve
2. ⬜ Admin felhasználó létrehozva
3. ⬜ Termékek feltöltve
4. ⬜ Frontend összekötve
5. ⬜ Teszt rendelés leadva
6. ⬜ Éles környezet beállítása

---

**Problémák esetén nézd meg a `README.md` API dokumentációt!**
