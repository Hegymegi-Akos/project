import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// EmailJS konfiguráció
const EMAILJS_SERVICE_ID = 'service_u97w4rk';
const EMAILJS_TEMPLATE_ID = 'template_mcjlomk';
const EMAILJS_PUBLIC_KEY = 'NJmnYNngkcWACR6G4';

const API_URL = 'http://localhost/project/backend/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: kód, 3: új jelszó
  const [email, setEmail] = useState('');
  const [kod, setKod] = useState('');
  const [ujJelszo, setUjJelszo] = useState('');
  const [ujJelszoUjra, setUjJelszoUjra] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lejarIdo, setLejarIdo] = useState('');

  // 1. lépés: Email megadása és kód kérése
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/password-reset.php/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success && data.kod) {
        // EmailJS-sel elküldjük a kódot
        const templateParams = {
          email: email,
          jelszo: data.kod,
          time: new Date(data.lejar).toLocaleString('hu-HU')
        };

        try {
          const result = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
          console.log('EmailJS eredmény:', result);
          setSuccess('A kódot elküldtük az email címedre!');
          setLejarIdo(data.lejar);
          setStep(2);
        } catch (emailError) {
          console.error('Email küldési hiba:', emailError);
          setError('Nem sikerült elküldeni az emailt. Próbáld újra!');
        }
      } else {
        setSuccess(data.message || 'Ha az email cím regisztrálva van, hamarosan megkapod a kódot.');
        setStep(2);
      }
    } catch (err) {
      setError('Hiba történt. Próbáld újra később.');
    } finally {
      setLoading(false);
    }
  };

  // 2. lépés: Kód ellenőrzése
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/password-reset.php/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kod })
      });
      
      const data = await response.json();
      
      if (data.valid) {
        setSuccess('Kód elfogadva! Add meg az új jelszavadat.');
        setStep(3);
      } else {
        setError(data.message || 'Hibás kód');
      }
    } catch (err) {
      setError('Hiba történt. Próbáld újra.');
    } finally {
      setLoading(false);
    }
  };

  // 3. lépés: Új jelszó beállítása
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (ujJelszo !== ujJelszoUjra) {
      setError('A két jelszó nem egyezik!');
      return;
    }

    if (ujJelszo.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/password-reset.php/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, kod, uj_jelszo: ujJelszo })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Jelszó sikeresen megváltoztatva! Átirányítunk a bejelentkezéshez...');
        setTimeout(() => navigate('/auth'), 2000);
      } else {
        setError(data.message || 'Hiba történt');
      }
    } catch (err) {
      setError('Hiba történt. Próbáld újra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container page" style={{ maxWidth: 500, margin: '0 auto' }}>
      <h1 className="page-title">🔐 Elfelejtett jelszó</h1>

      <div className="ui-card" style={{ padding: 30 }}>
        {/* Lépések jelző */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 20, 
          marginBottom: 30 
        }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: step >= s ? 'var(--accent-gradient)' : '#e2e8f0',
              color: step >= s ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}>
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            background: '#d1fae5',
            color: '#059669',
            padding: 12,
            borderRadius: 8,
            marginBottom: 16
          }}>
            ✅ {success}
          </div>
        )}

        {/* 1. lépés: Email */}
        {step === 1 && (
          <form onSubmit={handleRequestCode}>
            <p style={{ marginBottom: 20, color: '#64748b' }}>
              Add meg az email címedet, és küldünk egy kódot a jelszó visszaállításához.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                Email cím
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="pelda@email.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: 16
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px 20px' }}
            >
              {loading ? 'Küldés...' : '📧 Kód kérése'}
            </button>
          </form>
        )}

        {/* 2. lépés: Kód megadása */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <p style={{ marginBottom: 20, color: '#64748b' }}>
              Add meg a kapott 6 számjegyű kódot. A kód 15 percig érvényes.
            </p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                Visszaállító kód
              </label>
              <input
                type="text"
                value={kod}
                onChange={(e) => setKod(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                placeholder="000000"
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: 24,
                  textAlign: 'center',
                  letterSpacing: 8,
                  fontWeight: 700
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || kod.length !== 6}
              className="btn-primary"
              style={{ width: '100%', padding: '14px 20px' }}
            >
              {loading ? 'Ellenőrzés...' : '✓ Kód ellenőrzése'}
            </button>
            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setSuccess(''); }}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '12px 20px',
                background: 'none',
                border: '2px solid #e2e8f0',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              ← Vissza
            </button>
          </form>
        )}

        {/* 3. lépés: Új jelszó */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <p style={{ marginBottom: 20, color: '#64748b' }}>
              Add meg az új jelszavadat (legalább 6 karakter).
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                Új jelszó
              </label>
              <input
                type="password"
                value={ujJelszo}
                onChange={(e) => setUjJelszo(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: 16
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                Új jelszó újra
              </label>
              <input
                type="password"
                value={ujJelszoUjra}
                onChange={(e) => setUjJelszoUjra(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid #e2e8f0',
                  fontSize: 16
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '14px 20px' }}
            >
              {loading ? 'Mentés...' : '🔐 Jelszó megváltoztatása'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/auth" style={{ color: 'var(--accent-primary)' }}>
            ← Vissza a bejelentkezéshez
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
