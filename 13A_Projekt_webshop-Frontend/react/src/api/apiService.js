/**
 * API Szolgáltatás - Backend kommunikáció
 *
 * Ez a fájl tartalmazza az összes API hívást a backend felé.
 * Használd ezt a service-t a komponensekben a fetch helyett.
 */

// Alapértelmezett API URL Apache alatt (ha nincs VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/project/backend/api';

// Admin jogosultság: csak előre megadott felhasználók láthatják az admin felületet.
// Állítsd be a VITE_ADMIN_ALLOWLIST környezeti változót (vesszővel elválasztva) a
// felhasználónevekre / e-mailekre / ID-kra, akik adminok lehetnek. Ha üres, az
// admin flag alapján enged.
const rawAdminAllowlist = (import.meta.env.VITE_ADMIN_ALLOWLIST || '').split(',');
const allowedAdminValues = new Set(
  rawAdminAllowlist
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean)
);

const hasAdminFlag = (user) => user?.admin === 1 || user?.admin === true || user?.admin === '1';

const getAdminSecret = () => sessionStorage.getItem('adminSecret') || '';

export const isAllowedAdminUser = (user) => {
  if (!hasAdminFlag(user)) return false;

  // Ha nincs allowlist, marad a korábbi viselkedés: bármelyik admin flag-es user.
  if (allowedAdminValues.size === 0) return true;

  const candidates = [user?.email, user?.felhasznalonev, user?.id?.toString()]
    .map((v) => v?.toLowerCase())
    .filter(Boolean);

  return candidates.some((value) => allowedAdminValues.has(value));
};

const enforceAdminAccess = () => {
  const user = authAPI.getStoredUser();
  if (!isAllowedAdminUser(user)) {
    throw new Error('Nincs admin jogosultság');
  }
};

const withAdminHeaders = (headers = {}) => {
  const merged = { ...headers };
  const adminSecret = getAdminSecret();
  if (adminSecret) merged['X-Admin-Secret'] = adminSecret;
  return merged;
};

const adminFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  let data = null;
  if (contentType.includes('application/json') && rawText) {
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      throw new Error(`Válasz értelmezési hiba: ${err.message || err} | Nyers: ${rawText}`);
    }
  } else {
    data = rawText || null;
  }

  if (!response.ok) {
    const message = data?.message || `HTTP error ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.body = data;
    throw err;
  }

  return data;
};

// Segédfüggvény: HTTP headerek (JSON alapértelmezett, FormData esetén kihagyjuk a Content-Type-ot)
const getHeaders = (isForm = false) => {
  const headers = {};
  if (!isForm) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ==================== AUTH ====================
export const authAPI = {
  // Bejelentkezés
  async login(identifier, password) {
    const response = await fetch(`${API_URL}/auth.php/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ identifier, password })
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
    }
    return data;
  },

  // Regisztráció
  async register(payload) {
    const response = await fetch(`${API_URL}/auth.php/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));
    }
    return data;
  },

  // Kijelentkezés
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Aktuális felhasználó lekérése
  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth.php/me`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Autentikáció ellenőrzése
  async checkAuth() {
    const response = await fetch(`${API_URL}/auth.php/check-auth`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // LocalStorage-ból olvasott felhasználó
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Admin jogosultság ellenőrzése
  isAdmin() {
    const user = this.getStoredUser();
    return isAllowedAdminUser(user);
  }
};

// ==================== TERMÉKEK ====================

export const productsAPI = {
  // Összes termék
  async getAll(page = 1, limit = 20) {
    const response = await fetch(`${API_URL}/products.php?page=${page}&limit=${limit}`);
    return await response.json();
  },

  // Egy termék
  async getById(id) {
    const response = await fetch(`${API_URL}/products.php?id=${id}`);
    return await response.json();
  },

  // Keresés
  async search(query) {
    const response = await fetch(`${API_URL}/products.php/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  },

  // Kategória szerint
  async getByCategory(kategoria, alkategoria = '') {
    let url = `${API_URL}/products.php/category?kategoria=${kategoria}`;
    if (alkategoria) {
      url += `&alkategoria=${alkategoria}`;
    }
    const response = await fetch(url);
    return await response.json();
  }
};

// ==================== KATEGÓRIÁK ====================

export const categoriesAPI = {
  // Összes kategória alkategóriákkal
  async getAll() {
    const response = await fetch(`${API_URL}/categories.php`);
    return await response.json();
  },

  // Alkategóriák
  async getSubcategories(kategoria_id) {
    const response = await fetch(`${API_URL}/categories.php/subcategories?kategoria_id=${kategoria_id}`);
    return await response.json();
  }
};

// ==================== RENDELÉSEK ====================

export const ordersAPI = {
  // Új rendelés leadása
  async create(orderData) {
    const response = await fetch(`${API_URL}/orders.php/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return await response.json();
  },

  // Saját rendelések
  async getMyOrders() {
    const response = await fetch(`${API_URL}/orders.php/my-orders`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Egy rendelés részletei
  async getById(id) {
    const response = await fetch(`${API_URL}/orders.php/${id}`, {
      headers: getHeaders()
    });
    return await response.json();
  }
};

// ==================== VÉLEMÉNYEK ====================

export const reviewsAPI = {
  // Termék véleményei
  async getByProduct(termek_id) {
    const response = await fetch(`${API_URL}/reviews.php/product/${termek_id}`);
    return await response.json();
  },

  // Összes vélemény
  async getAll() {
    const response = await fetch(`${API_URL}/reviews.php/all`);
    return await response.json();
  },

  // Fal bejegyzések
  async getWallPosts() {
    const response = await fetch(`${API_URL}/reviews.php/wall`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Új fal bejegyzés
  async createWallPost(szoveg) {
    const response = await fetch(`${API_URL}/reviews.php/wall`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ szoveg })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Fal bejegyzés törlése
  async deleteWallPost(postId) {
    const response = await fetch(`${API_URL}/reviews.php/wall/${postId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Új vélemény
  async create(reviewData) {
    const response = await fetch(`${API_URL}/reviews.php`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Hasznos jelölés
  async markHelpful(review_id, helpful = true) {
    const response = await fetch(`${API_URL}/reviews.php/${review_id}/helpful`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ helpful })
    });
    return await response.json();
  },

  // Vélemény törlése (admin)
  async deleteReview(reviewId) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/reviews.php/review/${reviewId}`, {
      method: 'DELETE',
      headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Tiltott szavak lekérése
  async getBannedWords() {
    const response = await fetch(`${API_URL}/reviews.php/banned-words`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Tiltott szó hozzáadása (admin)
  async addBannedWord(szo) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/reviews.php/banned-words`, {
      method: 'POST',
      headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify({ szo })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Tiltott szó törlése (admin)
  async deleteBannedWord(wordId) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/reviews.php/banned-words/${wordId}`, {
      method: 'DELETE',
      headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  }
};

// ==================== ADMIN - TERMÉKEK ====================

export const adminProductsAPI = {
  // Összes termék (admin)
  async getAll() {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/products.php`, { headers });
  },

  // Termék szerkesztéshez
  async getById(id) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/products.php?id=${id}`, { headers });
  },

  // Új termék
  async create(productData) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/products.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(productData)
    });
  },

  // Termék frissítése - POST + _method=PUT (Apache kompatibilitás)
  async update(id, productData) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    const payload = {
      ...productData,
      id: Number(id),
      _method: 'PUT'
    };
    return await adminFetch(`${API_URL}/admin/products.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  },

  // Termék törlése - POST + _method=DELETE (Apache kompatibilitás)
  async delete(id) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    const payload = {
      id: Number(id),
      _method: 'DELETE'
    };
    return await adminFetch(`${API_URL}/admin/products.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  }
};

// ==================== ADMIN - FELHASZNÁLÓK ====================

export const adminUsersAPI = {
  // Összes felhasználó listázása
  async getAll() {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/users.php`, { headers });
  }
};

// ==================== ADMIN - RENDELÉSEK ====================

export const adminOrdersAPI = {
  // Összes rendelés
  async getAll() {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/orders.php`, { headers });
  },

  // Rendelés részletei
  async getById(id) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/orders.php/${id}`, { headers });
  },

  // Státusz frissítése
  async updateStatus(id, statusz) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/orders.php/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ statusz })
    });
  },

  // Rendelés törlése
  async delete(id) {
    enforceAdminAccess();
    const headers = withAdminHeaders(getHeaders());
    return await adminFetch(`${API_URL}/admin/orders.php/${id}`, {
      method: 'DELETE',
      headers
    });
  },

  // Számla letöltése
  getInvoiceUrl(id) {
    return `${API_URL}/admin/orders.php/${id}/invoice`;
  }
};

// ==================== ADMIN - KÉP FELTÖLTÉS ====================

export const uploadAPI = {
  // Kép feltöltése
  async uploadImage(file) {
    enforceAdminAccess();
    const formData = new FormData();
    formData.append('image', file);

    const headers = withAdminHeaders(getHeaders(true));

    const response = await fetch(`${API_URL}/upload.php`, {
      method: 'POST',
      headers, // FormData - nem kell Content-Type, de kell token + X-Admin-Secret
      body: formData
    });
    return await response.json();
  }
};

// ==================== KUPONOK ====================

export const couponsAPI = {
  // Hűségkupon lekérése (lokális 0.5%)
  async getLoyaltyCoupon() {
    const response = await fetch(`${API_URL}/coupons.php/loyalty`);
    return await response.json();
  },

  // Kupon validálása
  async validate(kod) {
    const response = await fetch(`${API_URL}/coupons.php/validate/${kod}`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Kupon alkalmazása
  async apply(kupon_kod, osszeg) {
    const response = await fetch(`${API_URL}/coupons.php/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ kupon_kod, osszeg })
    });
    return await response.json();
  },

  // Saját kuponjaim
  async getMyCoupons() {
    const response = await fetch(`${API_URL}/coupons.php/my`, {
      headers: getHeaders()
    });
    return await response.json();
  },

  // Összes kupon (admin)
  async getAll() {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/coupons.php`, {
      headers: withAdminHeaders(getHeaders())
    });
    return await response.json();
  },

  // Új kupon (admin)
  async create(couponData) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/coupons.php`, {
      method: 'POST',
      headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(couponData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Kupon frissítése (admin)
  async update(id, couponData) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/coupons.php/${id}`, {
      method: 'PUT',
      headers: withAdminHeaders(getHeaders()),
      body: JSON.stringify(couponData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  },

  // Kupon törlése (admin)
  async delete(id) {
    enforceAdminAccess();
    const response = await fetch(`${API_URL}/coupons.php/${id}`, {
      method: 'DELETE',
      headers: withAdminHeaders(getHeaders())
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Hiba történt');
    }
    return await response.json();
  }
};

