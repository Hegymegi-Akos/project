import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';

const Favorites = () => {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (favorites.length === 0) {
    return (
      <div className="container" style={{ marginTop: 40 }}>
        <h1 className="page-title">❤️ Kedvenceim</h1>
        <div className="ui-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: '4rem', marginBottom: 20 }}>💔</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: 12 }}>Még nincsenek kedvenceid!</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            Böngészd a termékeket és kattints a 🤍 ikonra a kedvencekhez adáshoz.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h1 className="page-title" style={{ margin: 0 }}>❤️ Kedvenceim ({favorites.length})</h1>
        <button 
          onClick={clearFavorites}
          style={{
            background: 'transparent',
            border: '2px solid #ef4444',
            color: '#ef4444',
            padding: '10px 20px',
            borderRadius: 12,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
          onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#ef4444'; }}
        >
          🗑️ Összes törlése
        </button>
      </div>

      <div className="content">
        {favorites.map(product => (
          <div key={product.id} className="box" style={{ position: 'relative' }}>
            {/* Kedvenc eltávolítás gomb */}
            <button
              onClick={() => toggleFavorite(product)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: 36,
                height: 36,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '1.2rem',
                zIndex: 5
              }}
              title="Eltávolítás a kedvencekből"
            >
              ❤️
            </button>
            
            <img 
              src={product.img} 
              alt={product.name}
              style={{ height: '200px', objectFit: 'cover', width: '100%', borderRadius: 12 }}
            />
            <h2 style={{ color: 'var(--text-primary)' }}>{product.name}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{product.desc}</p>
            {product.qty && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{product.qty}</p>
            )}
            <p style={{ 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              color: 'var(--accent-primary)', 
              margin: '12px 0' 
            }}>
              {product.price?.toLocaleString('hu-HU')} Ft
            </p>
            <button 
              onClick={() => handleAddToCart(product)}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 12,
                cursor: 'pointer',
                fontWeight: 700,
                width: '100%'
              }}
            >
              🛒 Kosárba
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
