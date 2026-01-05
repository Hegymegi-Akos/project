import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [formData, setFormData] = useState({
    felhasznalonev: '',
    email: '',
    jelszo: '',
    jelszo2: '',
    keresztnev: '',
    vezeteknev: '',
    telefon: '',
    iranyitoszam: '',
    varos: '',
    cim: ''
  });
  const { login, register, loading, error, setError } = useAuth();
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError(null);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSuccess('');
    try {
      const data = await login(formData.felhasznalonev || formData.email, formData.jelszo);
      if (data.token) {
        setSuccess('Sikeres bejelentkezés!');
        navigate('/');
      }
    } catch (err) {
      // hibát a context már kezeli
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess('');

    if (formData.jelszo !== formData.jelszo2) {
      setError('A két jelszó nem egyezik.');
      return;
    }

    const payload = {
      felhasznalonev: formData.felhasznalonev,
      email: formData.email,
      jelszo: formData.jelszo,
      keresztnev: formData.keresztnev,
      vezeteknev: formData.vezeteknev,
      telefon: formData.telefon,
      iranyitoszam: formData.iranyitoszam,
      varos: formData.varos,
      cim: formData.cim
    };

    try {
      const data = await register(payload);
      if (data.token) {
        setSuccess('Sikeres regisztráció! Automatikus bejelentkezés...');
        navigate('/');
      }
    } catch (err) {
      // hibát a context már kezeli
    }
  };

  return (
    <main className="container page">
      <div className="ui-card" style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          gap: 0,
          marginBottom: 32,
          borderBottom: '2px solid rgba(15,23,42,0.1)'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setError(null);
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              background: 'transparent',
              border: 'none',
              borderBottom: isLogin ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: isLogin ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: -2
            }}
          >
            Bejelentkezés
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError(null);
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '16px',
              background: 'transparent',
              border: 'none',
              borderBottom: !isLogin ? '3px solid var(--accent-primary)' : '3px solid transparent',
              color: !isLogin ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: -2
            }}
          >
            Regisztráció
          </button>
        </div>

        {error && (
          <div className="ui-card" style={{ background: 'rgba(239,68,68,0.08)', borderColor: '#ef4444', marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#b91c1c', fontWeight: 700 }}>{error}</p>
          </div>
        )}

        {success && (
          <div className="ui-card" style={{ background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', marginBottom: 16 }}>
            <p style={{ margin: 0, color: '#047857', fontWeight: 700 }}>{success}</p>
          </div>
        )}

        {isLogin ? (
          <form className="form-grid" onSubmit={handleLogin}>
            <h2 className="page-title" style={{ marginTop: 0 }}>Bejelentkezés</h2>

            <div className="form-field">
              <label htmlFor="login-identifier">Felhasználónév vagy email</label>
              <input
                id="login-identifier"
                name="felhasznalonev"
                type="text"
                placeholder="pl. kisallat123 vagy email@pelda.hu"
                value={formData.felhasznalonev}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Jelszó</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  name="jelszo"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.jelszo}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: 4
                  }}
                  aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Beléptetés...' : 'Bejelentkezés'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/forgot-password" style={{ color: 'var(--accent-primary)', fontSize: 14 }}>
                🔐 Elfelejtett jelszó?
              </Link>
            </div>
          </form>
        ) : (
          <form className="form-grid form-grid-2" onSubmit={handleRegister}>
            <h2 className="page-title" style={{ marginTop: 0 }}>Regisztráció</h2>

            <div className="form-field">
              <label htmlFor="reg-username">Felhasználónév</label>
              <input
                id="reg-username"
                name="felhasznalonev"
                type="text"
                placeholder="Válassz egy felhasználónevet"
                value={formData.felhasznalonev}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-email">Email cím</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="email@pelda.hu"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-firstname">Keresztnév</label>
              <input
                id="reg-firstname"
                name="keresztnev"
                type="text"
                placeholder="Keresztneved"
                value={formData.keresztnev}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-surname">Vezetéknév</label>
              <input
                id="reg-surname"
                name="vezeteknev"
                type="text"
                placeholder="Vezetékneved"
                value={formData.vezeteknev}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-telefon">Telefonszám</label>
              <input
                id="reg-telefon"
                name="telefon"
                type="tel"
                placeholder="+36301234567"
                value={formData.telefon}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-irsz">Irányítószám</label>
              <input
                id="reg-irsz"
                name="iranyitoszam"
                type="text"
                placeholder="1234"
                value={formData.iranyitoszam}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-varos">Város</label>
              <input
                id="reg-varos"
                name="varos"
                type="text"
                placeholder="Budapest"
                value={formData.varos}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-cim">Cím</label>
              <input
                id="reg-cim"
                name="cim"
                type="text"
                placeholder="Példa utca 1."
                value={formData.cim}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="reg-password">Jelszó</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  name="jelszo"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 8 karakter"
                  value={formData.jelszo}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: 4
                  }}
                  aria-label={showPassword ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="reg-password2">Jelszó újra</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password2"
                  name="jelszo2"
                  type={showPassword2 ? 'text' : 'password'}
                  placeholder="Add meg újra a jelszót"
                  value={formData.jelszo2}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword2((prev) => !prev)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: 4
                  }}
                  aria-label={showPassword2 ? 'Jelszó elrejtése' : 'Jelszó mutatása'}
                >
                  {showPassword2 ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-span-2">
              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? 'Regisztráció...' : 'Regisztráció'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default Auth;
