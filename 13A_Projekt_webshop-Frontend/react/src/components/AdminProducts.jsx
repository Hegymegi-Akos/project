import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminProductsAPI, categoriesAPI, isAllowedAdminUser, uploadAPI } from '../api/apiService';

const emptyForm = {
  nev: '',
  ar: '',
  akcios_ar: '',
  keszlet: '',
  alkategoria_id: '',
  rovid_leiras: '',
  leiras: '',
  fo_kep: '',
  tobbi_kep: '',
  aktiv: true
};

const AdminProducts = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useMemo(() => isAuthenticated && isAllowedAdminUser(user), [isAuthenticated, user]);

  const [adminSecret, setAdminSecret] = useState(() => sessionStorage.getItem('adminSecret') || '');
  const [adminSecretInput, setAdminSecretInput] = useState('');

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [catError, setCatError] = useState('');

  useEffect(() => {
    if (isAdmin && !adminSecret) {
      const fallback = 'Admin123';
      sessionStorage.setItem('adminSecret', fallback);
      setAdminSecret(fallback);
    }
  }, [isAdmin, adminSecret]);

  const loadCategories = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const data = await categoriesAPI.getAll();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCatError('Nem sikerült betölteni a kategóriákat.');
      }
    } catch (err) {
      setCatError('Nem sikerült betölteni a kategóriákat.');
      console.error('Kategória betöltési hiba', err);
    }
  }, [isAdmin]);

  const loadProducts = useCallback(async () => {
    if (!isAdmin || !adminSecret) return;
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const data = await adminProductsAPI.getAll();
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
        if (data?.message) setError(data.message);
      }
    } catch (err) {
      setError(`Nem sikerült betölteni a termékeket: ${err.message || err}`);
      console.error('Admin termékek betöltési hiba', err);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, adminSecret]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const alkMap = useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      (cat.alkategoriak || []).forEach((sub) => {
        map[sub.id] = { nev: sub.nev, kategoria: cat.nev };
      });
    });
    return map;
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) => `${p.nev}`.toLowerCase().includes(q) || `${p.id}`.includes(q));
  }, [products, query]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('');

    if (!isAdmin || !adminSecret) {
      const msg = 'Add meg az admin jelszót (Admin123), majd töltsd újra az oldalt.';
      setError(msg);
      alert(msg);
      return;
    }

    if (!form.nev.trim() || !form.fo_kep.trim() || !form.ar || !form.alkategoria_id) {
      setError('Név, ár, alkategória és főkép kötelező.');
      return;
    }

    const payload = {
      nev: form.nev.trim(),
      alkategoria_id: form.alkategoria_id ? Number(form.alkategoria_id) : null,
      ar: form.ar ? Number(form.ar) : 0,
      akcios_ar: form.akcios_ar ? Number(form.akcios_ar) : null,
      keszlet: form.keszlet ? Number(form.keszlet) : 0,
      fo_kep: form.fo_kep.trim(),
      tobbi_kep: form.tobbi_kep
        ? form.tobbi_kep.split(',').map((x) => x.trim()).filter(Boolean)
        : [],
      rovid_leiras: form.rovid_leiras.trim() || null,
      leiras: form.leiras.trim() || null,
      aktiv: form.aktiv ? 1 : 0
    };

    setSaving(true);
    try {
      let resp;
      if (editingId) {
        console.log('UPDATE termék', { editingId, payload });
        resp = await adminProductsAPI.update(editingId, payload);
        setStatus(`Frissítve (#${editingId}) ${resp?.rowsAffected !== undefined ? `(rows: ${resp.rowsAffected})` : ''}`);
      } else {
        console.log('CREATE termék', payload);
        resp = await adminProductsAPI.create(payload);
        setStatus(`Létrehozva (#${resp?.id || '?'})`);
      }

      await loadProducts();
      resetForm();
    } catch (err) {
      console.error('Termék mentési hiba', err);
      const msg = err?.message || 'Mentés nem sikerült.';
      setError(msg);
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nev: product.nev || '',
      ar: product.ar ?? '',
      akcios_ar: product.akcios_ar ?? '',
      keszlet: product.keszlet ?? '',
      alkategoria_id: product.alkategoria_id ?? '',
      rovid_leiras: product.rovid_leiras || '',
      leiras: product.leiras || '',
      fo_kep: product.fo_kep || '',
      tobbi_kep: Array.isArray(product.tobbi_kep) ? product.tobbi_kep.join(', ') : '',
      aktiv: product.aktiv === 1 || product.aktiv === true || product.aktiv === '1'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan törlöd a terméket?')) return;
    setDeletingId(id);
    setError('');
    setStatus('');
    console.log('DELETE termék', { id });
    try {
      const resp = await adminProductsAPI.delete(id);
      console.log('DELETE válasz', resp);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setStatus(`Törölve (#${id})`);
      if (editingId === id) resetForm();
    } catch (err) {
      console.error('Törlés hiba', err);
      const msg = err?.message || 'Törlés nem sikerült.';
      setError(msg);
      alert(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadAPI.uploadImage(file);
      if (res?.url) {
        setForm((f) => ({ ...f, fo_kep: res.url }));
      } else if (res?.message) {
        setError(res.message);
      }
    } catch (err) {
      console.error('Kép feltöltés hiba', err);
      setError('Kép feltöltése nem sikerült.');
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="container page">
        <h1 className="page-title">Admin - Termékkezelő</h1>
        <section className="ui-card">
          <p className="kezdolapp">Nincs jogosultságod ehhez az oldalhoz.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">Admin - Termékkezelő</h1>

      {/* Navigációs fülek */}
      <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Link to="/admin" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          🏠 Admin
        </Link>
        <Link to="/admin/products" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          📦 Termékek
        </Link>
        <Link to="/admin/users" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          👥 Felhasználók
        </Link>
        <Link to="/orders" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          📋 Rendelések
        </Link>
      </nav>

      <header className="ui-card" style={{ marginBottom: 12, display: 'grid', gap: 6 }}>
        <p className="kezdolapp" style={{ margin: 0 }}>Létrehozás, frissítés, törlés egy helyen, azonnali visszajelzésekkel.</p>
      </header>

      <section className="ui-card" style={{ marginBottom: 12 }}>
        <h2 className="section-title" style={{ marginTop: 0 }}>Admin jelszó (X-Admin-Secret)</h2>
        <p className="kezdolapp" style={{ marginTop: 0 }}>Jelenlegi állapot: {adminSecret ? 'beállítva' : 'nincs beállítva'}.</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="password"
            value={adminSecretInput}
            onChange={(e) => setAdminSecretInput(e.target.value)}
            placeholder="Admin jelszó (pl. Admin123)"
            style={{ flex: 1, minWidth: 240, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
          />
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              const trimmed = adminSecretInput.trim();
              if (!trimmed) return;
              sessionStorage.setItem('adminSecret', trimmed);
              setAdminSecret(trimmed);
              setAdminSecretInput('');
              loadProducts();
            }}
            disabled={!adminSecretInput.trim()}
            style={{ whiteSpace: 'nowrap', padding: '10px 14px' }}
          >
            Mentés
          </button>
          {adminSecret && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                sessionStorage.removeItem('adminSecret');
                setAdminSecret('');
                setProducts([]);
                setAdminSecretInput('');
              }}
              style={{ whiteSpace: 'nowrap', padding: '10px 14px' }}
            >
              Törlés / Újra beállítás
            </button>
          )}
        </div>
      </section>

      {status && (
        <section className="ui-card" style={{ marginBottom: 10, border: '1px solid #10b981' }}>
          <p className="kezdolapp" style={{ color: '#065f46', margin: 0 }}>{status}</p>
        </section>
      )}

      {error && (
        <section className="ui-card" style={{ marginBottom: 10, border: '1px solid #ef4444' }}>
          <p className="kezdolapp" style={{ color: '#b91c1c', margin: 0 }}>{error}</p>
        </section>
      )}

      <section className="ui-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <h2 className="section-title" style={{ marginTop: 0, marginBottom: 8 }}>
            {editingId ? `Termék szerkesztése (#${editingId})` : 'Új termék'}
          </h2>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>Szerkesztés megszakítása</button>
          )}
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            <div>
              <label className="kezdolapp">Név</label>
              <input
                value={form.nev}
                onChange={(e) => setForm((f) => ({ ...f, nev: e.target.value }))}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
            <div>
              <label className="kezdolapp">Ár (Ft)</label>
              <input
                type="number"
                value={form.ar}
                onChange={(e) => setForm((f) => ({ ...f, ar: e.target.value }))}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
            <div>
              <label className="kezdolapp">Akciós ár (Ft)</label>
              <input
                type="number"
                value={form.akcios_ar}
                onChange={(e) => setForm((f) => ({ ...f, akcios_ar: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
            <div>
              <label className="kezdolapp">Készlet</label>
              <input
                type="number"
                value={form.keszlet}
                onChange={(e) => setForm((f) => ({ ...f, keszlet: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
            <div>
              <label className="kezdolapp">Alkategória</label>
              <select
                value={form.alkategoria_id}
                onChange={(e) => setForm((f) => ({ ...f, alkategoria_id: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              >
                <option value="">Válassz</option>
                {categories.map((cat) => (
                  <optgroup key={cat.id} label={cat.nev}>
                    {(cat.alkategoriak || []).map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.nev}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {catError && (
                <p className="kezdolapp" style={{ marginTop: 6, color: 'var(--text-secondary)' }}>{catError}</p>
              )}
            </div>
          </div>

          <div>
            <label className="kezdolapp">Rövid leírás</label>
            <input
              value={form.rovid_leiras}
              onChange={(e) => setForm((f) => ({ ...f, rovid_leiras: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>
          <div>
            <label className="kezdolapp">Leírás</label>
            <textarea
              value={form.leiras}
              onChange={(e) => setForm((f) => ({ ...f, leiras: e.target.value }))}
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
            />
          </div>

          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div>
              <label className="kezdolapp">Főkép URL</label>
              <input
                value={form.fo_kep}
                onChange={(e) => setForm((f) => ({ ...f, fo_kep: e.target.value }))}
                placeholder="/uploads/xyz.jpg vagy teljes URL"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
              <label className="kezdolapp" style={{ display: 'block', marginTop: 8 }}>Vagy kép feltöltés</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files?.[0])}
                disabled={uploading}
                style={{ width: '100%' }}
              />
              {uploading && <p className="kezdolapp" style={{ marginTop: 6 }}>Feltöltés...</p>}
            </div>
            <div>
              <label className="kezdolapp">További képek (vesszővel)</label>
              <textarea
                value={form.tobbi_kep}
                onChange={(e) => setForm((f) => ({ ...f, tobbi_kep: e.target.value }))}
                rows={3}
                placeholder="/uploads/a.jpg, /uploads/b.jpg"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
              />
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={form.aktiv}
              onChange={(e) => setForm((f) => ({ ...f, aktiv: e.target.checked }))}
            />
            <span className="kezdolapp">Aktív</span>
          </label>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Mentés...' : editingId ? 'Változtatások mentése' : 'Létrehozás'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm} disabled={saving && !editingId}>
              Mezők törlése
            </button>
          </div>
        </form>
      </section>

      <section className="ui-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
          <h2 className="section-title" style={{ marginTop: 0 }}>Termék lista</h2>
          <input
            placeholder="Keresés név vagy ID alapján"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #d1d5db', minWidth: 220 }}
          />
        </div>

        {loading ? (
          <p className="kezdolapp">Betöltés...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="kezdolapp">Nincs találat.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>ID</th>
                  <th style={{ padding: '8px' }}>Név</th>
                  <th style={{ padding: '8px' }}>Ár</th>
                  <th style={{ padding: '8px' }}>Készlet</th>
                  <th style={{ padding: '8px' }}>Alkategória</th>
                  <th style={{ padding: '8px' }}>Aktív</th>
                  <th style={{ padding: '8px' }}>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id} style={{ borderTop: '1px solid #e5e7eb', background: p.id === editingId ? '#f9fafb' : 'transparent' }}>
                    <td style={{ padding: '8px' }}>{p.id}</td>
                    <td style={{ padding: '8px' }}>{p.nev}</td>
                    <td style={{ padding: '8px' }}>{Number(p.ar).toLocaleString('hu-HU')} Ft</td>
                    <td style={{ padding: '8px' }}>{p.keszlet}</td>
                    <td style={{ padding: '8px' }}>
                      {alkMap[p.alkategoria_id]?.nev || p.alkategoria_id}
                      {alkMap[p.alkategoria_id]?.kategoria ? ` (${alkMap[p.alkategoria_id].kategoria})` : ''}
                    </td>
                    <td style={{ padding: '8px' }}>{p.aktiv ? 'Igen' : 'Nem'}</td>
                    <td style={{ padding: '8px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button className="btn-secondary" onClick={() => startEdit(p)}>
                        Szerkesztés
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(p.id)} disabled={deletingId === p.id}>
                        {deletingId === p.id ? 'Törlés...' : 'Törlés'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminProducts;
