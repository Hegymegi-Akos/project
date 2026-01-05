const { test, expect, request } = require('@playwright/test');
const path = require('path');
const { spawn } = require('child_process');

// Backend API alap URL közvetlen API hívásokhoz
const API_BASE = process.env.VITE_API_URL || 'http://localhost:8000/api';
const PHP_SERVER_PORT = process.env.BACKEND_PORT || 8000;
const PHP_PROJECT_ROOT = path.resolve(__dirname, '..', '..', 'backend');

let phpProcess;

async function startPhpServer() {
  return new Promise((resolve, reject) => {
    phpProcess = spawn('php', ['-S', `localhost:${PHP_SERVER_PORT}`, '-t', PHP_PROJECT_ROOT], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    const onData = (data) => {
      const s = data.toString();
      if (s.toLowerCase().includes('listening') || s.toLowerCase().includes('development server started')) {
        cleanup();
        return resolve();
      }
      // Heurisztika: ha PHP process nem ír semmit, feltételezzük hogy elindult; resolve rövid várakozás után
      cleanup();
      setTimeout(resolve, 400);
    };

    const cleanup = () => {
      phpProcess.stdout.off('data', onData);
      phpProcess.stderr.off('data', onData);
    };

    phpProcess.stdout.on('data', onData);
    phpProcess.stderr.on('data', onData);

    // fallback ha process kilép
    phpProcess.on('exit', (code) => {
      reject(new Error('PHP process exited with code ' + code));
    });
  });
}

async function stopPhpServer() {
  if (phpProcess && !phpProcess.killed) {
    phpProcess.kill();
  }
}

// Kis segítő függvény admin token építéséhez (hasonló a backend generateJWT-hoz)
const crypto = require('crypto');
function buildAdminToken(user_id, felhasznalonev) {
  const secret = 'kisallat_webshop_secret_key_2025_CHANGE_THIS';
  const issued = Math.floor(Date.now() / 1000);
  const exp = issued + 24 * 3600;
  const payload = { iat: issued, exp, user_id, felhasznalonev, admin: 1 };
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  const signature = crypto.createHmac('sha256', secret).update(payloadEncoded).digest('hex');
  return `${payloadEncoded}.${signature}`;
}

// Egyedi utótag ütközések elkerülése érdekében DB-ben
const unique = Math.floor(Math.random() * 1000000);
const testUser = {
  felhasznalonev: `e2e_user_${unique}`,
  email: `e2e_user_${unique}@example.test`,
  jelszo: 'Teszt123!'
};

let userToken = null;
let adminToken = null;
let productId = null;

test.beforeAll(async () => {
  // Opcionálisan indítjuk a PHP szervert, hacsak SKIP_PHP_SERVER nincs beállítva (hasznos ha már fut helyi Apache/XAMPP)
  if (!process.env.SKIP_PHP_SERVER) {
    console.log('Starting PHP built-in server for tests...');
    await startPhpServer();
  } else {
    console.log('SKIP_PHP_SERVER is set, assuming backend already running.');
  }

  // Felhasználó regisztrálása API-n keresztül
  const rContext = await request.newContext({ baseURL: API_BASE });
  const res = await rContext.post('/auth.php/register', {
    data: testUser
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.token).toBeTruthy();
  userToken = body.token;

  // Admin token létrehozása ugyanahhoz a felhasználóhoz (szimulálja admin jogosultságokat admin ellenőrzésekhez)
  adminToken = buildAdminToken(body.user.id, body.user.felhasznalonev);

  // Termék keresése vásárláshoz API-val
  const prodRes = await rContext.get('/products.php');
  expect(prodRes.ok()).toBeTruthy();
  const allProducts = await prodRes.json();
  if (!Array.isArray(allProducts) || allProducts.length === 0) {
    throw new Error('Nincs elérhető termék a teszthez');
  }
  productId = allProducts[0].id;

  await rContext.dispose();
});

test.afterAll(async () => {
  await stopPhpServer();
});

test('full purchase flow + admin check + post review', async ({ page, request: playwrightRequest }) => {
  // Előre beállítjuk a bejelentkezett felhasználót localStorage tokennel
  await page.addInitScript((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, userToken, { id: 0, felhasznalonev: testUser.felhasznalonev });

  // Főoldal meglátogatása, termék hozzáadása kosárhoz
  await page.goto('/');
  await page.waitForSelector('.box');

  // Első 'Kosárba' gomb megnyomása
  const addButton = page.locator('button', { hasText: 'Kosárba' }).first();
  await expect(addButton).toBeVisible();
  await addButton.click();

  // Kosár oldalra navigálás és rendelési űrlap kitöltése
  await page.goto('/cart');
  await page.waitForSelector('form');

  await page.fill('input[name="nev"]', 'E2E Vásárló');
  await page.fill('input[name="email"]', testUser.email);
  await page.fill('input[name="telefon"]', '06701234567');
  await page.fill('input[name="iranyitoszam"]', '1111');
  await page.fill('input[name="varos"]', 'Tesztvaros');
  await page.fill('input[name="cim"]', 'Teszt utca 1.');
  await page.check('input[name="aszf"]');

  await page.click('button:has-text("Rendelés leadása")');

  // Sikeres rendelés modal várakozása
  await page.waitForSelector('text=Sikeres rendelés!', { timeout: 10000 });
  const successText = await page.locator('text=Rendelés száma').textContent();
  expect(successText).toBeTruthy();

  // Ellenőrizzük hogy a rendelés létezik-e API-n keresztül ehhez a felhasználóhoz
  const apiContext = await playwrightRequest.newContext({ baseURL: API_BASE, extraHTTPHeaders: { Authorization: `Bearer ${userToken}` } });
  const myOrdersResp = await apiContext.get('/orders.php/my-orders');
  expect(myOrdersResp.ok()).toBeTruthy();
  const myOrders = await myOrdersResp.json();
  expect(Array.isArray(myOrders)).toBeTruthy();
  expect(myOrders.length).toBeGreaterThan(0);

  const latestOrder = myOrders[0];
  expect(latestOrder).toHaveProperty('rendelés_szam');

  // Admin ellenőrzés: admin token és admin titok beállítása sessionStorage-ban, /admin oldal meglátogatása
  await page.addInitScript((token) => {
    localStorage.setItem('token', token);
  }, adminToken);
  // Admin titok beállítása sessionStorage-ban hogy fetch tartalmazza admin header-t apiService withAdminHeaders függvényén keresztül
  await page.addInitScript(() => {
    sessionStorage.setItem('adminSecret', 'Admin123');
  });

  await page.goto('/admin');
  // Várakozás hogy az admin rendelések lista megjelenjen
  await page.waitForSelector('.admin-orders, table, text=Rendelések', { timeout: 10000 });

  // Egyszerű ellenőrzés: admin rendelések API visszaad valamit és tartalmazza a rendelési számunkat
  const adminApi = await playwrightRequest.newContext({ baseURL: API_BASE, extraHTTPHeaders: { Authorization: `Bearer ${adminToken}`, 'X-Admin-Secret': 'Admin123' } });
  const adminOrdersResp = await adminApi.get('/admin/orders.php');
  expect(adminOrdersResp.ok()).toBeTruthy();
  const adminOrders = await adminOrdersResp.json();
  expect(Array.isArray(adminOrders)).toBeTruthy();
  const found = adminOrders.some(o => o['rendelés_szam'] === latestOrder['rendelés_szam']);
  expect(found).toBeTruthy();

  // Vélemény közzététele a vásárolt termékhez
  // Use API to create review while authenticated
  const reviewResp = await apiContext.post('/reviews.php', {
    data: {
      termek_id: productId,
      ertekeles: 5,
      cim: 'Szuper termék',
      velemeny: 'Teljesen elégedett vagyok, gyors szállítás és jó minőség.'
    }
  });
  expect(reviewResp.ok()).toBeTruthy();
  const revBody = await reviewResp.json();
  expect(revBody).toHaveProperty('id');

  // Confirm review via API (product page might not have a dedicated route)
  const revCheck = await apiContext.get(`/reviews.php/product/${productId}`);
  expect(revCheck.ok()).toBeTruthy();
  const revJson = await revCheck.json();
  expect(Array.isArray(revJson.reviews)).toBeTruthy();
  const foundRev = revJson.reviews.some(r => r.cim === 'Szuper termék');
  expect(foundRev).toBeTruthy();

  await apiContext.dispose();
  await adminApi.dispose();
  await apiContext.dispose();
});