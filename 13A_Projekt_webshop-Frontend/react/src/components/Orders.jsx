import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminOrdersAPI, isAllowedAdminUser, ordersAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useMemo(() => isAuthenticated && isAllowedAdminUser(user), [isAuthenticated, user]);
  const [adminSecret, setAdminSecret] = useState(() => sessionStorage.getItem('adminSecret') || '');
  const [adminSecretInput, setAdminSecretInput] = useState('');

  const [myOrders, setMyOrders] = useState([]);
  const [myLoading, setMyLoading] = useState(false);
  const [myError, setMyError] = useState('');

  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [openingInvoiceId, setOpeningInvoiceId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadMy = async () => {
      if (!isAuthenticated) return;
      setMyError('');
      setMyLoading(true);
      try {
        const data = await ordersAPI.getMyOrders();
        if (Array.isArray(data)) {
          setMyOrders(data);
        } else {
          setMyOrders([]);
          if (data?.message) setMyError(data.message);
        }
      } catch (err) {
        console.error('Saját rendelések betöltési hiba', err);
        setMyError('Nem sikerült betölteni a rendeléseidet.');
      } finally {
        setMyLoading(false);
      }
    };

    loadMy();
  }, [isAuthenticated]);

  useEffect(() => {
    const loadAdmin = async () => {
      if (!isAdmin || !adminSecret) return;
      setAdminError('');
      setAdminLoading(true);
      try {
        const data = await adminOrdersAPI.getAll();
        if (Array.isArray(data)) {
          setAdminOrders(data);
        } else {
          setAdminOrders([]);
          if (data?.message) setAdminError(data.message);
        }
      } catch (err) {
        console.error('Admin rendelések betöltési hiba', err);
        setAdminError('Nem sikerült betölteni az admin rendeléseket.');
      } finally {
        setAdminLoading(false);
      }
    };

    loadAdmin();
  }, [isAdmin, adminSecret]);

  const deleteOrder = async (orderId) => {
    if (!window.confirm(`Biztosan törlöd a #${orderId} rendelést?`)) return;
    
    setDeletingId(orderId);
    setAdminError('');
    try {
      await adminOrdersAPI.delete(orderId);
      setAdminOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error('Rendelés törlési hiba', err);
      setAdminError(`Nem sikerült törölni a rendelést: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const openInvoice = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAdminError('Nincs bejelentkezés.');
      return;
    }

    setAdminError('');
    setOpeningInvoiceId(orderId);
    try {
      const url = adminOrdersAPI.getInvoiceUrl(orderId);
      const secret = sessionStorage.getItem('adminSecret') || '';
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(secret ? { 'X-Admin-Secret': secret } : {})
        }
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      const html = await res.text();
      const blobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err) {
      console.error('Számla megnyitási hiba', err);
      setAdminError('Nem sikerült megnyitni a számlát.');
    } finally {
      setOpeningInvoiceId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container page">
        <h1 className="page-title">Rendeléseim / Számlák</h1>
        <section className="ui-card">
          <p className="kezdolapp">A rendeléseid megtekintéséhez be kell jelentkezned.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">Rendeléseim / Számlák</h1>

      {/* Navigációs fülek - csak adminoknak */}
      {isAdmin && (
        <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <Link to="/admin" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
            🏠 Admin
          </Link>
          <Link to="/admin/products" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
            📦 Termékek
          </Link>
          <Link to="/admin/users" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
            👥 Felhasználók
          </Link>
          <Link to="/orders" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
            📋 Rendelések
          </Link>
        </nav>
      )}

      <section className="ui-card" style={{ marginBottom: 16 }}>
        <h2 className="section-title">Rendeléseim</h2>

        {myError && (
          <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 12 }}>
            {myError}
          </div>
        )}

        <div
          style={{
            maxHeight: 320,
            overflowY: 'auto',
            border: '1px solid rgba(59, 130, 246, 0.12)',
            borderRadius: 12,
            padding: 12,
            background: 'rgba(59, 130, 246, 0.03)'
          }}
        >
          {myLoading ? (
            <div className="kezdolapp">Betöltés...</div>
          ) : myOrders.length === 0 ? (
            <div className="kezdolapp">Még nincs leadott rendelésed.</div>
          ) : (
            myOrders.map((o) => {
              const orderId = o.id;
              const orderNo = o.rendeles_szam || o['rendelés_szam'] || '';
              const created = o.letrehozva || '';
              const status = o.statusz || '';
              const total = o.osszeg;
              return (
                <div
                  key={orderId}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    background: 'white',
                    border: '1px solid rgba(59, 130, 246, 0.1)',
                    marginBottom: 10
                  }}
                >
                  <div style={{ fontWeight: 800 }}>
                    {orderNo ? `#${orderNo}` : `Rendelés #${orderId}`}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                    {created}
                    {status ? ` • ${status}` : ''}
                    {typeof total !== 'undefined' ? ` • ${Number(total).toLocaleString('hu-HU')} Ft` : ''}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {isAdmin && (
        <section className="ui-card" style={{ marginBottom: 16 }}>
          <h2 className="section-title">Számlák</h2>
          <p className="kezdolapp" style={{ marginTop: 0 }}>
            Admin módban a számlák itt jelennek meg egy görgethető menüben.
          </p>

          {!adminSecret && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>
                Admin jelszó
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                  value={adminSecretInput}
                  onChange={(e) => setAdminSecretInput(e.target.value)}
                  placeholder="Add meg az admin jelszót"
                />
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    const trimmed = adminSecretInput.trim();
                    sessionStorage.setItem('adminSecret', trimmed);
                    setAdminSecret(trimmed);
                    setAdminSecretInput('');
                  }}
                  disabled={!adminSecretInput.trim()}
                  style={{ whiteSpace: 'nowrap', padding: '10px 14px' }}
                >
                  Mentés
                </button>
              </div>
              <p className="kezdolapp" style={{ margin: '6px 0 0', color: 'var(--text-secondary)' }}>
                Csak a jogosult admin személy ismeri ezt a jelszót.
              </p>
            </div>
          )}

          {adminError && (
            <div style={{ color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 12 }}>
              {adminError}
            </div>
          )}

          <div
            style={{
              maxHeight: 320,
              overflowY: 'auto',
              border: '1px solid rgba(59, 130, 246, 0.12)',
              borderRadius: 12,
              padding: 12,
              background: 'rgba(59, 130, 246, 0.03)'
            }}
          >
            {adminLoading ? (
              <div className="kezdolapp">Betöltés...</div>
            ) : adminOrders.length === 0 ? (
              <div className="kezdolapp">Nincs megjeleníthető számla.</div>
            ) : (
              adminOrders.map((o) => {
                const orderId = o.id;
                const orderNo = o.rendeles_szam || o['rendelés_szam'] || '';
                const created = o.letrehozva || '';
                const total = o.osszeg;
                return (
                  <div
                    key={orderId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: 12,
                      borderRadius: 10,
                      background: 'white',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      marginBottom: 10
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 800,
                          lineHeight: 1.2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {orderNo ? `#${orderNo}` : `Rendelés #${orderId}`}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
                        {created}{typeof total !== 'undefined' ? ` • ${Number(total).toLocaleString('hu-HU')} Ft` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => openInvoice(orderId)}
                        disabled={openingInvoiceId === orderId}
                        style={{
                          whiteSpace: 'nowrap',
                          width: 'auto',
                          maxWidth: 'none',
                          margin: 0,
                          padding: '10px 16px',
                          fontSize: 14,
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        {openingInvoiceId === orderId ? 'Nyitás...' : 'Számla'}
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => deleteOrder(orderId)}
                        disabled={deletingId === orderId}
                        style={{
                          whiteSpace: 'nowrap',
                          width: 'auto',
                          maxWidth: 'none',
                          margin: 0,
                          padding: '10px 16px',
                          fontSize: 14,
                          borderRadius: 'var(--radius-md)',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none'
                        }}
                      >
                        {deletingId === orderId ? 'Törlés...' : '🗑️ Törlés'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </main>
  );
};

export default Orders;
