import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { couponsAPI } from '../api/apiService';

const MyCoupons = () => {
  const { user, isAuthenticated } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCoupons();
      loadLoyaltyInfo();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const loadCoupons = async () => {
    try {
      const data = await couponsAPI.getMyCoupons();
      setCoupons(data.coupons || []);
    } catch (err) {
      console.error('Kuponok betöltési hiba:', err);
    }
  };

  const loadLoyaltyInfo = async () => {
    try {
      const data = await couponsAPI.getLoyaltyCoupon();
      setLoyaltyInfo(data);
    } catch (err) {
      console.error('Hűségkedvezmény betöltési hiba:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <main className="main-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>🎟️ Kuponjaim</h1>
        <p style={{ marginTop: 20 }}>Jelentkezz be a kuponjaid megtekintéséhez!</p>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="main-content" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h1>🎟️ Kuponjaim</h1>
        <p>Betöltés...</p>
      </main>
    );
  }

  return (
    <main className="main-content" style={{ padding: '40px 20px', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30 }}>🎟️ Kuponjaim</h1>

      {/* Hűségkedvezmény szekció */}
      <section style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 30,
        border: '2px solid #f59e0b'
      }}>
        <h2 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          ⭐ Hűségkedvezmény
        </h2>
        {loyaltyInfo ? (
          <div>
            <p style={{ fontSize: 18, marginBottom: 12 }}>
              <strong>Teljesített rendeléseid:</strong> {loyaltyInfo.orderCount} db
            </p>
            {loyaltyInfo.eligible ? (
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '16px 20px',
                borderRadius: 12,
                fontSize: 16
              }}>
                ✅ <strong>{loyaltyInfo.discount}% hűségkedvezményre</strong> vagy jogosult! 
                Ez automatikusan alkalmazva lesz a kosárban.
              </div>
            ) : (
              <div style={{
                background: '#f1f5f9',
                padding: '16px 20px',
                borderRadius: 12,
                fontSize: 14
              }}>
                📦 Még <strong>{3 - loyaltyInfo.orderCount}</strong> rendelés kell a hűségkedvezményhez (0.5%)
              </div>
            )}
          </div>
        ) : (
          <p>Nincs elérhető információ</p>
        )}
      </section>

      {/* Kuponok listája */}
      <section>
        <h2 style={{ marginBottom: 20 }}>🎫 Elérhető kuponok</h2>
        
        {coupons.length === 0 ? (
          <div style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: 30,
            textAlign: 'center',
            color: '#64748b'
          }}>
            <p style={{ fontSize: 48, margin: '0 0 16px' }}>🎫</p>
            <p>Jelenleg nincs elérhető kuponod.</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>
              Figyeld az akciókat és a promóciókat!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {coupons.map(coupon => (
              <div
                key={coupon.id}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: '2px dashed #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 16
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#0ea5e9',
                    marginBottom: 8
                  }}>
                    {coupon.tipus === 'szazalek' 
                      ? `${coupon.ertek}% kedvezmény`
                      : `${Number(coupon.ertek).toLocaleString('hu-HU')} Ft kedvezmény`
                    }
                  </div>
                  <div style={{ color: '#64748b', fontSize: 14 }}>
                    {coupon.leiras || 'Kupon kedvezmény'}
                  </div>
                  {coupon.lejarat && (
                    <div style={{ 
                      marginTop: 8, 
                      fontSize: 13, 
                      color: new Date(coupon.lejarat) < new Date() ? '#ef4444' : '#f59e0b'
                    }}>
                      ⏰ Lejárat: {new Date(coupon.lejarat).toLocaleDateString('hu-HU')}
                    </div>
                  )}
                  {coupon.max_hasznalat && (
                    <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>
                      📊 Használat: {coupon.hasznalatok || 0} / {coupon.max_hasznalat}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <code style={{
                    background: '#f1f5f9',
                    padding: '12px 20px',
                    borderRadius: 8,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: 2
                  }}>
                    {coupon.kod}
                  </code>
                  <button
                    onClick={() => copyCode(coupon.kod)}
                    style={{
                      background: copied === coupon.kod ? '#10b981' : 'var(--accent-gradient)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {copied === coupon.kod ? '✅ Másolva!' : '📋 Másol'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Használati útmutató */}
      <section style={{
        marginTop: 40,
        background: '#f0f9ff',
        borderRadius: 12,
        padding: 20
      }}>
        <h3 style={{ margin: '0 0 12px' }}>💡 Hogyan használd a kuponokat?</h3>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Másold ki a kuponkódot a "Másol" gombbal</li>
          <li>Menj a kosárba</li>
          <li>Írd be a kuponkódot a "Kuponkód" mezőbe</li>
          <li>Kattints az "Alkalmaz" gombra</li>
          <li>A kedvezmény automatikusan levonásra kerül!</li>
        </ol>
      </section>
    </main>
  );
};

export default MyCoupons;
