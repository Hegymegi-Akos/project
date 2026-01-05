import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/slider.css';

const Home = () => {
  const [sortBy, setSortBy] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const navigate = useNavigate();

  const applyFilters = (category) => {
    const params = new URLSearchParams();
    if (sortBy) params.set('sort', sortBy);
    if (minPrice) params.set('min', minPrice);
    if (maxPrice) params.set('max', maxPrice);
    
    navigate(`${category}?${params.toString()}`);
  };

  const clearFilters = () => {
    setSortBy('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div>
      <a className="skip-link" href="#main">Ugrás a tartalomhoz</a>
      <main className="container" id="main">
        <section className="hero">
          <div className="continuous-slider" aria-hidden="true">
            <div className="slider-track">
              <img src="/kep/carousel/akcio1.png" alt="slide-1" />
              <img src="/kep/carousel/kep1.jpg" alt="slide-2" />
              <img src="/kep/carousel/kep2.jpg" alt="slide-3" />
              <img src="/kep/carousel/kep3.jpg" alt="slide-4" />
              <img src="/kep/carousel/akcio1.png" alt="slide-1-dup" />
              <img src="/kep/carousel/kep1.jpg" alt="slide-2-dup" />
              <img src="/kep/carousel/kep2.jpg" alt="slide-3-dup" />
              <img src="/kep/carousel/kep3.jpg" alt="slide-4-dup" />
            </div>
          </div>
        </section>

        {/* Szűrők */}
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '12px', 
          marginBottom: '32px',
          boxShadow: '0 2px 12px rgba(15,23,42,0.08)',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Rendezés
            </label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                border: '2px solid rgba(15,23,42,0.1)',
                fontSize: '0.95rem',
                minWidth: '180px'
              }}
            >
              <option value="">Alapértelmezett</option>
              <option value="low">Ár: Alacsony → Magas</option>
              <option value="high">Ár: Magas → Alacsony</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Min. ár (Ft)
            </label>
            <input 
              type="number" 
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                border: '2px solid rgba(15,23,42,0.1)',
                width: '140px',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Max. ár (Ft)
            </label>
            <input 
              type="number" 
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="999999"
              style={{ 
                padding: '10px 14px', 
                borderRadius: '8px', 
                border: '2px solid rgba(15,23,42,0.1)',
                width: '140px',
                fontSize: '0.95rem'
              }}
            />
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <button 
              onClick={() => {
                const message = `Szűrők alkalmazva!\n${sortBy ? `Rendezés: ${sortBy === 'low' ? 'Alacsony → Magas' : 'Magas → Alacsony'}\n` : ''}${minPrice ? `Min. ár: ${minPrice} Ft\n` : ''}${maxPrice ? `Max. ár: ${maxPrice} Ft` : ''}`;
                alert(message || 'Nincs beállított szűrő');
              }}
              style={{ 
                padding: '12px 24px', 
                background: 'var(--accent-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
              }}
            >
              ✓ Végrehajtás
            </button>
          </div>
          
          {(sortBy || minPrice || maxPrice) && (
            <button 
              onClick={clearFilters}
              style={{ 
                padding: '10px 18px', 
                background: 'rgba(239,68,68,0.1)', 
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                marginTop: '24px'
              }}
            >
              Szűrők törlése
            </button>
          )}
        </div>

        <section className="content">
          <article className="category-card">
            <div onClick={() => applyFilters('/dog')} style={{ cursor: 'pointer' }}>
              <img src="/kep/kutya.png" alt="Kutya" loading="lazy" />
              <h2>Kutya</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Játékok, tápok, felszerelések</p>
            </div>
          </article>
          <article className="category-card">
            <div onClick={() => applyFilters('/cat')} style={{ cursor: 'pointer' }}>
              <img src="/kep/macska.png" alt="Macska" loading="lazy" />
              <h2>Macska</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Játékok és macskatápok</p>
            </div>
          </article>
          <article className="category-card">
            <div onClick={() => applyFilters('/rodent')} style={{ cursor: 'pointer' }}>
              <img src="/kep/ragcsalo.png" alt="Rágcsáló" loading="lazy" />
              <h2>Rágcsáló</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Állványok, alom, kaja</p>
            </div>
          </article>
          <article className="category-card">
            <div onClick={() => applyFilters('/reptile')} style={{ cursor: 'pointer' }}>
              <img src="/kep/hullo.png" alt="Hüllő" loading="lazy" />
              <h2>Hüllő</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Terrárium felszerelések</p>
            </div>
          </article>
          <article className="category-card">
            <div onClick={() => applyFilters('/bird')} style={{ cursor: 'pointer' }}>
              <img src="/kep/madar.png" alt="Madár" loading="lazy" />
              <h2>Madár</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Kalitkák, eleség</p>
            </div>
          </article>
          <article className="category-card">
            <div onClick={() => applyFilters('/fish')} style={{ cursor: 'pointer' }}>
              <img src="/kep/hal.png" alt="Hal" loading="lazy" />
              <h2>Hal</h2>
              <p style={{color:'var(--muted)',marginTop:8}}>Akvarisztikai kellékek</p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default Home;