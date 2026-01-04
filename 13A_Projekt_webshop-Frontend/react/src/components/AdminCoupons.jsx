import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { couponsAPI, adminUsersAPI, isAllowedAdminUser } from '../api/apiService';

function AdminCoupons() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    kod: '',
    tipus: 'szazalek',
    ertek: '',
    min_osszeg: 0,
    felhasznalasi_limit: '',
    felhasznalo_id: '',
    ervenyes_napok: '',
    ervenyes_veg: '',
    aktiv: 1
  });

  useEffect(() => {
    if (!isAuthenticated || !isAllowedAdminUser(user)) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [couponsData, usersData] = await Promise.all([
        couponsAPI.getAll(),
        adminUsersAPI.getAll()
      ]);
      setCoupons(Array.isArray(couponsData) ? couponsData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      kod: '',
      tipus: 'szazalek',
      ertek: '',
      min_osszeg: 0,
      felhasznalasi_limit: '',
      felhasznalo_id: '',
      ervenyes_napok: '',
      ervenyes_veg: '',
      aktiv: 1
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      kod: coupon.kod,
      tipus: coupon.tipus,
      ertek: coupon.ertek,
      min_osszeg: coupon.min_osszeg || 0,
      felhasznalasi_limit: coupon.felhasznalasi_limit || '',
      felhasznalo_id: coupon.felhasznalo_id || '',
      ervenyes_napok: '',
      ervenyes_veg: coupon.ervenyes_veg ? coupon.ervenyes_veg.slice(0, 16) : '',
      aktiv: coupon.aktiv
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const dataToSend = { ...formData };
      
      // Ha napokban adták meg az érvényességet
      if (formData.ervenyes_napok && !formData.ervenyes_veg) {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + parseInt(formData.ervenyes_napok));
        dataToSend.ervenyes_veg = endDate.toISOString().slice(0, 19).replace('T', ' ');
      }
      
      delete dataToSend.ervenyes_napok;
      
      if (editingCoupon) {
        await couponsAPI.update(editingCoupon.id, dataToSend);
        setSuccess('Kupon frissítve!');
      } else {
        await couponsAPI.create(dataToSend);
        setSuccess('Kupon létrehozva!');
      }
      
      resetForm();
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, kod) => {
    if (kod === 'HUSEG05') {
      setError('A hűségkupon nem törölhető!');
      return;
    }
    if (!window.confirm(`Biztosan törlöd a "${kod}" kupont?`)) return;
    
    try {
      await couponsAPI.delete(id);
      setSuccess('Kupon törölve!');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, kod: code }));
  };

  if (loading) {
    return (
      <main className="container page">
        <h1 className="page-title">🎟️ Kuponok Kezelése</h1>
        <p>Betöltés...</p>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">🎟️ Kuponok Kezelése</h1>

      {/* Navigációs gombok */}
      <nav style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <Link to="/admin" className="btn-secondary" style={{ padding: '10px 20px' }}>
          📊 Admin Dashboard
        </Link>
        <Link to="/admin/products" className="btn-secondary" style={{ padding: '10px 20px' }}>
          📦 Termékek
        </Link>
        <Link to="/admin/users" className="btn-secondary" style={{ padding: '10px 20px' }}>
          👥 Felhasználók
        </Link>
        <Link to="/orders" className="btn-secondary" style={{ padding: '10px 20px' }}>
          📋 Rendelések
        </Link>
        <span className="btn-primary" style={{ padding: '10px 20px' }}>
          🎟️ Kuponok
        </span>
      </nav>

      {error && <div style={{ color: '#ef4444', marginBottom: 12, padding: 12, background: '#fee2e2', borderRadius: 8 }}>❌ {error}</div>}
      {success && <div style={{ color: '#10b981', marginBottom: 12, padding: 12, background: '#d1fae5', borderRadius: 8 }}>✅ {success}</div>}

      {/* Új kupon gomb */}
      <button
        onClick={() => { resetForm(); setShowForm(!showForm); }}
        className="btn-primary"
        style={{ marginBottom: 20, padding: '12px 24px' }}
      >
        {showForm ? '✕ Bezárás' : '➕ Új Kupon Létrehozása'}
      </button>

      {/* Kupon form */}
      {showForm && (
        <section style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          border: '1px solid #f59e0b'
        }}>
          <h2 style={{ marginBottom: 16 }}>{editingCoupon ? '✏️ Kupon Szerkesztése' : '🎟️ Új Kupon'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* Kuponkód */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Kuponkód *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={formData.kod}
                    onChange={(e) => setFormData(prev => ({ ...prev, kod: e.target.value.toUpperCase() }))}
                    placeholder="pl. NYAR20"
                    required
                    disabled={editingCoupon?.kod === 'HUSEG05'}
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                  />
                  {!editingCoupon && (
                    <button type="button" onClick={generateRandomCode} className="btn-secondary" style={{ padding: '10px' }}>
                      🎲
                    </button>
                  )}
                </div>
              </div>

              {/* Típus */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Típus</label>
                <select
                  value={formData.tipus}
                  onChange={(e) => setFormData(prev => ({ ...prev, tipus: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                >
                  <option value="szazalek">Százalék (%)</option>
                  <option value="fix">Fix összeg (Ft)</option>
                </select>
              </div>

              {/* Érték */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                  Érték * {formData.tipus === 'szazalek' ? '(%)' : '(Ft)'}
                </label>
                <input
                  type="number"
                  value={formData.ertek}
                  onChange={(e) => setFormData(prev => ({ ...prev, ertek: e.target.value }))}
                  placeholder={formData.tipus === 'szazalek' ? 'pl. 10' : 'pl. 1000'}
                  required
                  step="0.01"
                  min="0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </div>

              {/* Minimum összeg */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Min. rendelés (Ft)</label>
                <input
                  type="number"
                  value={formData.min_osszeg}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_osszeg: e.target.value }))}
                  placeholder="0 = nincs minimum"
                  min="0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </div>

              {/* Felhasználási limit */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Felhasználási limit</label>
                <input
                  type="number"
                  value={formData.felhasznalasi_limit}
                  onChange={(e) => setFormData(prev => ({ ...prev, felhasznalasi_limit: e.target.value }))}
                  placeholder="Üres = végtelen"
                  min="1"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </div>

              {/* Felhasználó (opcionális) */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Csak egy felhasználónak</label>
                <select
                  value={formData.felhasznalo_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, felhasznalo_id: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                >
                  <option value="">-- Mindenki használhatja --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.felhasznalonev} (ID: {u.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Érvényesség napokban */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Érvényes (nap)</label>
                <input
                  type="number"
                  value={formData.ervenyes_napok}
                  onChange={(e) => setFormData(prev => ({ ...prev, ervenyes_napok: e.target.value, ervenyes_veg: '' }))}
                  placeholder="pl. 5 (üres = végtelen)"
                  min="1"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </div>

              {/* VAGY konkrét dátum */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>VAGY lejárat dátum</label>
                <input
                  type="datetime-local"
                  value={formData.ervenyes_veg}
                  onChange={(e) => setFormData(prev => ({ ...prev, ervenyes_veg: e.target.value, ervenyes_napok: '' }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                />
              </div>

              {/* Aktív */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="aktiv"
                  checked={formData.aktiv == 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, aktiv: e.target.checked ? 1 : 0 }))}
                  style={{ width: 20, height: 20 }}
                />
                <label htmlFor="aktiv" style={{ fontWeight: 700 }}>Aktív</label>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                {editingCoupon ? '💾 Mentés' : '➕ Létrehozás'}
              </button>
              <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '12px 24px' }}>
                Mégse
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Kuponok listája */}
      <section className="ui-card">
        <h2 style={{ marginBottom: 16 }}>📋 Kuponok ({coupons.length} db)</h2>
        
        {coupons.length === 0 ? (
          <p>Még nincsenek kuponok.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Kód</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Kedvezmény</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Min. összeg</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Limit</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Felhasználó</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Lejárat</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Státusz</th>
                  <th style={{ padding: 12, borderBottom: '2px solid #e5e7eb' }}>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: 12 }}>
                      <code style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: 4, fontWeight: 700 }}>
                        {coupon.kod}
                      </code>
                      {coupon.kod === 'HUSEG05' && (
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#059669' }}>🔒 Rendszer</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.tipus === 'szazalek' 
                        ? `${coupon.ertek}%` 
                        : `${Number(coupon.ertek).toLocaleString('hu-HU')} Ft`
                      }
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.min_osszeg > 0 ? `${Number(coupon.min_osszeg).toLocaleString('hu-HU')} Ft` : '-'}
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.felhasznalasi_limit 
                        ? `${coupon.felhasznalva}/${coupon.felhasznalasi_limit}` 
                        : '∞'
                      }
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.felhasznalo_nev || coupon.felhasznalo_id 
                        ? <span style={{ color: '#7c3aed' }}>{coupon.felhasznalo_nev || `ID: ${coupon.felhasznalo_id}`}</span>
                        : <span style={{ color: '#6b7280' }}>Mindenki</span>
                      }
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.ervenyes_veg 
                        ? new Date(coupon.ervenyes_veg).toLocaleDateString('hu-HU')
                        : '∞'
                      }
                    </td>
                    <td style={{ padding: 12 }}>
                      {coupon.aktiv == 1 ? (
                        <span style={{ color: '#10b981', fontWeight: 600 }}>✅ Aktív</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>❌ Inaktív</span>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      <button
                        onClick={() => handleEdit(coupon)}
                        style={{ marginRight: 8, padding: '6px 12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                      >
                        ✏️
                      </button>
                      {coupon.kod !== 'HUSEG05' && (
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.kod)}
                          style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Info doboz */}
      <section style={{ marginTop: 24, padding: 16, background: '#dbeafe', borderRadius: 8, border: '1px solid #3b82f6' }}>
        <h3 style={{ marginBottom: 8 }}>ℹ️ Kupon típusok</h3>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>HUSEG05</strong> - Automatikus hűségkupon (0.5%), mindig aktív, nem törölhető</li>
          <li><strong>Globális kupon</strong> - Bárki használhatja (felhasználó mező üres)</li>
          <li><strong>Személyes kupon</strong> - Csak a kiválasztott felhasználó használhatja</li>
          <li><strong>Limit</strong> - Hányszor használható összesen (üres = végtelen)</li>
          <li><strong>Érvényesség</strong> - Napokban vagy konkrét dátummal megadható</li>
        </ul>
      </section>
    </main>
  );
}

export default AdminCoupons;
