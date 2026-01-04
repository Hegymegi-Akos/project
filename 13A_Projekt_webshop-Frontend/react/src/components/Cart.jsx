import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { ordersAPI, couponsAPI } from '../api/apiService';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

// EmailJS konfiguráció
const EMAILJS_SERVICE_ID = 'service_u97w4rk';
const EMAILJS_TEMPLATE_ID = 'template_vkh526d';
const EMAILJS_PUBLIC_KEY = 'NJmnYNngkcWACR6G4';
const ADMIN_EMAIL = 'nubsos123@gmail.com';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    nev: '',
    email: '',
    telefon: '',
    iranyitoszam: '',
    varos: '',
    cim: '',
    szallitasi_mod: 'Házhozszállítás',
    fizetesi_mod: 'Utánvét',
    megjegyzes: '',
    aszf: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  
  // Kupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [loyaltyCoupon, setLoyaltyCoupon] = useState(null);

  // Hűségkupon betöltése
  useEffect(() => {
    const loadLoyaltyCoupon = async () => {
      try {
        const data = await couponsAPI.getLoyaltyCoupon();
        setLoyaltyCoupon(data);
      } catch (err) {
        console.error('Hűségkupon betöltési hiba', err);
      }
    };
    loadLoyaltyCoupon();
  }, []);

  // Kupon validálása
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Add meg a kuponkódot!');
      return;
    }
    
    setCouponLoading(true);
    setCouponError('');
    
    try {
      const result = await couponsAPI.validate(couponCode.toUpperCase());
      if (result.valid) {
        setAppliedCoupon(result.kupon);
        setCouponCode('');
      } else {
        setCouponError(result.message || 'Érvénytelen kuponkód');
      }
    } catch (err) {
      setCouponError(err.message || 'Hiba a kupon ellenőrzésekor');
    } finally {
      setCouponLoading(false);
    }
  };

  // Kedvezmények számítása
  const calculateDiscounts = () => {
    const subtotal = getTotalPrice();
    let loyaltyDiscount = 0;
    let couponDiscount = 0;
    
    // Hűségkedvezmény (0.5%)
    if (loyaltyCoupon) {
      loyaltyDiscount = subtotal * (loyaltyCoupon.ertek / 100);
    }
    
    // Extra kupon kedvezmény
    if (appliedCoupon) {
      const afterLoyalty = subtotal - loyaltyDiscount;
      if (appliedCoupon.tipus === 'szazalek') {
        couponDiscount = afterLoyalty * (appliedCoupon.ertek / 100);
      } else {
        couponDiscount = Math.min(appliedCoupon.ertek, afterLoyalty);
      }
    }
    
    const totalDiscount = loyaltyDiscount + couponDiscount;
    const finalTotal = Math.max(0, subtotal - totalDiscount);
    
    return { subtotal, loyaltyDiscount, couponDiscount, totalDiscount, finalTotal };
  };

  // Email küldése a rendelésről
  const sendOrderEmail = async (orderData, orderNumber) => {
    const { finalTotal } = calculateDiscounts();
    
    // Tételek tömb formátumban (a template {{#orders}}...{{/orders}} loopot használ)
    const orders = cartItems.map(item => ({
      name: item.name,
      units: item.quantity,
      price: (item.price * item.quantity).toLocaleString('hu-HU') + ' Ft'
    }));

    const templateParams = {
      to_email: ADMIN_EMAIL,
      order_id: orderNumber || 'N/A',
      orders: orders,
      cost: {
        shipping: orderData.szallitasi_mod === 'Házhozszállítás' ? '1 500 Ft' : 'Ingyenes'
      }
    };

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      console.log('Rendelési email sikeresen elküldve!');
    } catch (error) {
      console.error('Email küldési hiba:', error);
      // Nem szakítjuk meg a rendelést email hiba miatt
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Hiba törlése változáskor
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nev.trim()) newErrors.nev = 'A név megadása kötelező';
    if (!formData.email.trim()) {
      newErrors.email = 'Az email megadása kötelező';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Érvénytelen email cím';
    }
    if (!formData.telefon.trim()) newErrors.telefon = 'A telefonszám megadása kötelező';
    if (!formData.iranyitoszam.trim()) newErrors.iranyitoszam = 'Az irányítószám megadása kötelező';
    if (!formData.varos.trim()) newErrors.varos = 'A város megadása kötelező';
    if (!formData.cim.trim()) newErrors.cim = 'A cím megadása kötelező';
    if (!formData.aszf) newErrors.aszf = 'Az ÁSZF elfogadása kötelező';
    
    if (cartItems.length === 0) {
      newErrors.cart = 'A kosár üres! Adj hozzá termékeket a rendeléshez.';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!isAuthenticated) {
      setErrors({ auth: 'A rendelés leadásához be kell jelentkezned.' });
      return;
    }

    setSubmitting(true);

    const payload = {
      tetelek: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        ar: item.price,
        mennyiseg: item.quantity
      })),
      szallitasi_nev: formData.nev,
      szallitasi_cim: formData.cim,
      szallitasi_varos: formData.varos,
      szallitasi_irsz: formData.iranyitoszam,
      szallitasi_mod: formData.szallitasi_mod,
      fizetesi_mod: formData.fizetesi_mod,
      megjegyzes: formData.megjegyzes
    };

    try {
      const res = await ordersAPI.create(payload);
      if (res?.rendeles_szam || res?.rendeles_id) {
        // Email küldése a rendelésről
        await sendOrderEmail(formData, res.rendeles_szam || res.rendeles_id);
        
        setShowSuccess(true);
        setOrderNumber(res.rendeles_szam || '');
        setFormData({
          nev: '',
          email: '',
          telefon: '',
          iranyitoszam: '',
          varos: '',
          cim: '',
          szallitasi_mod: 'Házhozszállítás',
          fizetesi_mod: 'Utánvét',
          megjegyzes: '',
          aszf: false
        });
        clearCart();
        setTimeout(() => setShowSuccess(false), 4000);
      } else if (res?.message) {
        setApiError(res.message);
      }
    } catch (err) {
      console.error('Rendelés hiba', err);
      setApiError('Nem sikerült leadni a rendelést. Ellenőrizd a kapcsolatot és próbáld újra.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container page">
      <h1 className="page-title">Kosár</h1>

      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '60px 80px',
            borderRadius: 24,
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: 20,
              animation: 'checkmark 0.6s ease 0.2s both'
            }}>✓</div>
            <h2 style={{ fontSize: '2.5rem', margin: '0 0 16px', fontWeight: 900 }}>
              Sikeres rendelés!
            </h2>
            <p style={{ fontSize: '1.2rem', opacity: 0.95, margin: 0 }}>
              Köszönjük a vásárlást! 🎉
            </p>
            {orderNumber && (
              <p style={{ marginTop: 12, fontWeight: 700 }}>
                Rendelés száma: {orderNumber}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes checkmark {
          0% { transform: scale(0) rotate(45deg); }
          50% { transform: scale(1.2) rotate(45deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 4px;
          font-weight: 600;
        }
        .input-error {
          border-color: #ef4444 !important;
        }
      `}</style>

      {/* Kosár tartalma */}
      {cartItems.length > 0 && (
        <div className="ui-card" style={{ maxWidth: 920, margin: '0 auto 32px' }}>
          <h2 className="section-title">Kosár tartalma</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr auto auto',
                gap: 16,
                padding: 16,
                background: 'var(--card-hover)',
                borderRadius: 12,
                alignItems: 'center',
                border: '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                <img src={item.img} alt={item.name} style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 8
                }} />
                <div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{item.name}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                    {item.price.toLocaleString('hu-HU')} Ft / db
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{
                      width: 32,
                      height: 32,
                      padding: 0,
                      borderRadius: 8,
                      border: '2px solid var(--accent-primary)',
                      background: 'var(--card)',
                      color: 'var(--accent-primary)',
                      fontSize: '1.2rem',
                      cursor: 'pointer'
                    }}
                  >−</button>
                  <span style={{ minWidth: 40, textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      width: 32,
                      height: 32,
                      padding: 0,
                      borderRadius: 8,
                      border: '2px solid var(--accent-primary)',
                      background: 'var(--card)',
                      color: 'var(--accent-primary)',
                      fontSize: '1.2rem',
                      cursor: 'pointer'
                    }}
                  >+</button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '0 0 8px' }}>
                    {(item.price * item.quantity).toLocaleString('hu-HU')} Ft
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      padding: '6px 12px',
                      fontSize: '0.875rem'
                    }}
                  >
                    Törlés
                  </button>
                </div>
              </div>
            ))}
            <div style={{
              padding: '20px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderRadius: 12,
              border: '2px solid rgba(59, 130, 246, 0.2)'
            }}>
              {/* Kupon kód bevitel */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>🎟️ Kuponkód</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Add meg a kuponkódot..."
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: '1px solid var(--text-muted)',
                      background: 'var(--card)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    {couponLoading ? '...' : 'Beváltás'}
                  </button>
                </div>
                {couponError && <p style={{ color: '#ef4444', fontSize: 14, marginTop: 6 }}>{couponError}</p>}
                {appliedCoupon && (
                  <div style={{ marginTop: 8, padding: 8, background: '#d1fae5', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>
                      ✅ {appliedCoupon.kod} ({appliedCoupon.tipus === 'szazalek' ? `${appliedCoupon.ertek}%` : `${Number(appliedCoupon.ertek).toLocaleString('hu-HU')} Ft`})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Összesítés */}
              <div style={{ borderTop: '1px solid rgba(59, 130, 246, 0.2)', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: 'var(--text-primary)' }}>
                  <span>Részösszeg:</span>
                  <span>{calculateDiscounts().subtotal.toLocaleString('hu-HU')} Ft</span>
                </div>
                
                {loyaltyCoupon && calculateDiscounts().loyaltyDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#10b981' }}>
                    <span>🎁 Hűségkedvezmény ({loyaltyCoupon.ertek}%):</span>
                    <span>-{Math.round(calculateDiscounts().loyaltyDiscount).toLocaleString('hu-HU')} Ft</span>
                  </div>
                )}
                
                {appliedCoupon && calculateDiscounts().couponDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#a78bfa' }}>
                    <span>🎟️ Kupon ({appliedCoupon.kod}):</span>
                    <span>-{Math.round(calculateDiscounts().couponDiscount).toLocaleString('hu-HU')} Ft</span>
                  </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '2px solid rgba(59, 130, 246, 0.3)' }}>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--accent-primary)' }}>
                    Végösszeg:
                  </h3>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, color: 'var(--accent-primary)' }}>
                    {Math.round(calculateDiscounts().finalTotal).toLocaleString('hu-HU')} Ft
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(errors.cart || errors.auth || apiError) && (
        <div className="ui-card" style={{ maxWidth: 920, margin: '0 auto 32px', background: 'rgba(239, 68, 68, 0.1)', borderColor: '#ef4444' }}>
          {errors.cart && (
            <p className="error-message" style={{ fontSize: '1.1rem', textAlign: 'center', margin: 0 }}>
              {errors.cart}
            </p>
          )}
          {errors.auth && (
            <p className="error-message" style={{ fontSize: '1.1rem', textAlign: 'center', margin: 0 }}>
              {errors.auth}
            </p>
          )}
          {apiError && (
            <p className="error-message" style={{ fontSize: '1.1rem', textAlign: 'center', margin: 0 }}>
              {apiError}
            </p>
          )}
        </div>
      )}

      <div className="ui-card" style={{ maxWidth: 920, margin: '0 auto' }}>
        <h2 className="section-title">Szállítási adatok</h2>

        <form className="form-grid form-grid-2" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="nev">Név *</label>
            <input
              type="text"
              id="nev"
              name="nev"
              value={formData.nev}
              onChange={handleChange}
              className={errors.nev ? 'input-error' : ''}
              autoComplete="name"
            />
            {errors.nev && <span className="error-message">{errors.nev}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              autoComplete="email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="telefon">Telefon *</label>
            <input
              type="tel"
              id="telefon"
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              className={errors.telefon ? 'input-error' : ''}
              autoComplete="tel"
            />
            {errors.telefon && <span className="error-message">{errors.telefon}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="iranyitoszam">Irányítószám *</label>
            <input
              type="text"
              id="iranyitoszam"
              name="iranyitoszam"
              value={formData.iranyitoszam}
              onChange={handleChange}
              className={errors.iranyitoszam ? 'input-error' : ''}
              autoComplete="postal-code"
            />
            {errors.iranyitoszam && <span className="error-message">{errors.iranyitoszam}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="varos">Város *</label>
            <input
              type="text"
              id="varos"
              name="varos"
              value={formData.varos}
              onChange={handleChange}
              className={errors.varos ? 'input-error' : ''}
              autoComplete="address-level2"
            />
            {errors.varos && <span className="error-message">{errors.varos}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="cim">Cím *</label>
            <input
              type="text"
              id="cim"
              name="cim"
              value={formData.cim}
              onChange={handleChange}
              className={errors.cim ? 'input-error' : ''}
              autoComplete="street-address"
            />
            {errors.cim && <span className="error-message">{errors.cim}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="szallitasi_mod">Szállítási mód</label>
            <select
              id="szallitasi_mod"
              name="szallitasi_mod"
              value={formData.szallitasi_mod}
              onChange={handleChange}
            >
              <option value="Házhozszállítás">Házhozszállítás</option>
              <option value="Személyes átvétel">Személyes átvétel</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="fizetesi_mod">Fizetési mód</label>
            <select
              id="fizetesi_mod"
              name="fizetesi_mod"
              value={formData.fizetesi_mod}
              onChange={handleChange}
            >
              <option value="Utánvét">Utánvét</option>
              <option value="Bankkártya">Bankkártya</option>
              <option value="Előre utalás">Előre utalás</option>
            </select>
          </div>

          <div className="form-span-2">
            <label htmlFor="megjegyzes">Megjegyzés</label>
            <textarea
              id="megjegyzes"
              name="megjegyzes"
              rows="3"
              value={formData.megjegyzes}
              onChange={handleChange}
              placeholder="Pl.: kérném délután szállítani"
              style={{ width: '100%', borderRadius: 8, border: '2px solid rgba(15,23,42,0.1)', padding: '10px' }}
            />
          </div>

          <div className="form-span-2">
            <label className="checkbox-field" htmlFor="aszf">
              <input
                type="checkbox"
                id="aszf"
                name="aszf"
                checked={formData.aszf}
                onChange={handleChange}
              />
              <span>Elfogadom az ÁSZF-et *</span>
            </label>
            {errors.aszf && <span className="error-message">{errors.aszf}</span>}
          </div>

          <div className="form-span-2">
            <button className="btn-primary" type="submit">
              {cartItems.length > 0 
                ? submitting ? 'Rendelés folyamatban...' : `Megrendelés (${getTotalPrice().toLocaleString('hu-HU')} Ft)` 
                : 'Megrendelés'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Cart;