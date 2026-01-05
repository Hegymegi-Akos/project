import React from 'react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const QuickViewModal = ({ product, show, onClose }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  if (!show || !product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    onClose();
  };

  const favorite = isFavorite(product.id);

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--card)',
          borderRadius: 20,
          maxWidth: 800,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(128,128,128,0.2)'
        }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.3rem' }}>{product.name}</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 8
            }}
          >
            ✕
          </button>
        </div>
        
        {/* Body */}
        <div style={{ padding: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <img 
                src={product.img} 
                alt={product.name}
                style={{ 
                  width: '100%',
                  height: 280,
                  objectFit: 'cover',
                  borderRadius: 16
                }}
              />
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{product.desc}</p>
              
              {product.qty && (
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>Kiszerelés:</strong> {product.qty}
                </p>
              )}
              
              <h2 style={{ 
                color: 'var(--accent-primary)', 
                fontSize: '2rem',
                fontWeight: 800,
                margin: '20px 0'
              }}>
                {product.price?.toLocaleString('hu-HU')} Ft
              </h2>

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button 
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  🛒 Kosárba
                </button>
                <button 
                  onClick={() => toggleFavorite(product)}
                  style={{
                    background: favorite ? '#ef4444' : 'transparent',
                    border: favorite ? 'none' : '2px solid #ef4444',
                    color: favorite ? 'white' : '#ef4444',
                    padding: '14px 20px',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                  title={favorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
                >
                  {favorite ? '❤️' : '🤍'}
                </button>
              </div>

              {product.category && (
                <p style={{ color: 'var(--text-muted)', marginTop: 20, fontSize: '0.9rem' }}>
                  Kategória: {product.category}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
