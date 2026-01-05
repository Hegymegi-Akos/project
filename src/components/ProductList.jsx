import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { productsAPI } from '../api/apiService';
import QuickViewModal from './QuickViewModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost/project/backend/api';

/**
 * Univerzális terméklistázó komponens
 * @param {string} title - Oldal címe
 * @param {string} category - Kategória slug (pl. 'kutya', 'macska')
 * @param {string} subcategory - Alkategória slug (pl. 'tap', 'ham')
 */
const ProductList = ({ title, category, subcategory }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const sortBy = searchParams.get('sort') || '';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productsAPI.getByCategory(category, subcategory);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Hiba a termékek betöltése során:', err);
        setError('Nem sikerült betölteni a termékeket');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory]);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    const cartProduct = {
      id: product.id,
      name: product.nev,
      price: product.akcios_ar || product.ar,
      img: product.fo_kep
    };
    addToCart(cartProduct, quantity);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 1000);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value) || 1;
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, qty) }));
  };

  // Szűrés és rendezés
  let filteredProducts = [...products];
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => (p.akcios_ar || p.ar) >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => (p.akcios_ar || p.ar) <= parseFloat(maxPrice));
  }
  
  if (sortBy === 'low') {
    filteredProducts.sort((a, b) => (a.akcios_ar || a.ar) - (b.akcios_ar || b.ar));
  } else if (sortBy === 'high') {
    filteredProducts.sort((a, b) => (b.akcios_ar || b.ar) - (a.akcios_ar || a.ar));
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>⏳ Termékek betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ fontSize: '1.2rem', color: '#ef4444' }}>❌ {error}</p>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
          Ellenőrizd, hogy a backend fut-e ezen: <code>{API_BASE}</code>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>{title}</h1>
      
      <p style={{ 
        marginBottom: '16px', 
        fontSize: '0.95rem', 
        color: 'var(--text-secondary)',
        fontWeight: 600
      }}>
        {filteredProducts.length} termék találat
      </p>
      
      {filteredProducts.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          fontSize: '1.1rem',
          color: 'var(--text-muted)'
        }}>
          😢 Nincs találat ezekkel a szűrőkkel
        </div>
      ) : (
        <div className="content">
          {filteredProducts.map((product) => {
            const cartProduct = {
              id: product.id,
              name: product.nev,
              desc: product.rovid_leiras,
              price: product.akcios_ar || product.ar,
              img: product.fo_kep,
              category: category
            };
            const favorite = isFavorite(product.id);
            
            return (
            <div key={product.id} className="box" style={{ position: 'relative' }}>
              {/* Kedvenc gomb */}
              <button
                onClick={() => toggleFavorite(cartProduct)}
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
                title={favorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
              >
                {favorite ? '❤️' : '🤍'}
              </button>
              
              {/* Gyors nézet gomb */}
              <button
                onClick={() => setQuickViewProduct(cartProduct)}
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: '1rem',
                  zIndex: 5
                }}
                title="Gyors nézet"
              >
                👁️
              </button>
              
              <img src={product.fo_kep} alt={product.nev} loading="lazy" />
              <h2>{product.nev}</h2>
              <p>{product.rovid_leiras}</p>
              
              {/* Akciós ár */}
              {product.akcios_ar && (
                <p style={{ 
                  textDecoration: 'line-through', 
                  color: 'var(--text-muted)', 
                  fontSize: '0.9rem',
                  margin: '4px 0'
                }}>
                  {product.ar.toLocaleString('hu-HU')} Ft
                </p>
              )}
              
              <p style={{ 
                fontSize: '1.3rem', 
                fontWeight: 800, 
                color: 'var(--accent-primary)', 
                margin: '8px 0' 
              }}>
                {(product.akcios_ar || product.ar).toLocaleString('hu-HU')} Ft
              </p>
              
              {/* Értékelések */}
              {product.atlag_ertekeles > 0 && (
                <p style={{ fontSize: '0.9rem', color: '#fbbf24', margin: '4px 0' }}>
                  {'⭐'.repeat(Math.round(product.atlag_ertekeles))} ({product.ertekelesek_szama})
                </p>
              )}
              
              {/* Készlet info */}
              {product.keszlet < 10 && product.keszlet > 0 && (
                <p style={{ fontSize: '0.85rem', color: '#f59e0b', margin: '4px 0' }}>
                  ⚠️ Már csak {product.keszlet} db van raktáron!
                </p>
              )}
              
              {product.keszlet === 0 && (
                <p style={{ fontSize: '0.9rem', color: '#ef4444', margin: '4px 0', fontWeight: 700 }}>
                  ❌ Elfogyott
                </p>
              )}
              
              {/* Mennyiség választó */}
              {product.keszlet > 0 && (
                <>
                  <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    alignItems: 'center', 
                    marginBottom: 12, 
                    padding: '0 20px' 
                  }}>
                    <input 
                      type="number" 
                      min="1"
                      max={product.keszlet}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      style={{ 
                        width: 70, 
                        padding: '8px', 
                        borderRadius: 8, 
                        border: '2px solid rgba(15,23,42,0.1)', 
                        textAlign: 'center' 
                      }}
                    />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>db</span>
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(product)}
                    style={{
                      background: addedItems[product.id] 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : undefined
                    }}
                  >
                    {addedItems[product.id] ? '✓ Hozzáadva' : 'Kosárba'}
                  </button>
                </>
              )}
            </div>
          );
          })}
        </div>
      )}
      
      {/* Quick View Modal */}
      <QuickViewModal 
        product={quickViewProduct}
        show={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default ProductList;
