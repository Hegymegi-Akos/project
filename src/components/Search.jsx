import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../api/apiService';

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { addToCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const runSearch = async () => {
      if (!searchQuery) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await productsAPI.search(searchQuery);
        setResults(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Keresési hiba', err);
        setError('Nem sikerült lekérni a találatokat. Ellenőrizd, hogy a backend fut-e.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [searchQuery]);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    addToCart(product, quantity);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product.id]: false })), 1000);
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const handleQuantityChange = (productId, value) => {
    const qty = parseInt(value) || 1;
    setQuantities(prev => ({ ...prev, [productId]: Math.max(1, qty) }));
  };

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>
        Keresési eredmények: "{searchQuery}"
      </h1>

      {loading && (
        <div className="ui-card" style={{ textAlign: 'center', padding: 32 }}>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Keresés folyamatban...</p>
        </div>
      )}

      {error && (
        <div className="ui-card" style={{ textAlign: 'center', padding: 32, background: 'rgba(239,68,68,0.08)', borderColor: '#ef4444' }}>
          <p style={{ margin: 0, color: '#b91c1c', fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="ui-card" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            😢 Nincs találat a keresésre: <strong>"{searchQuery}"</strong>
          </p>
          <p style={{ marginTop: 16 }}>
            Próbálj meg más kulcsszavakat használni, mint például "táp", "póráz", "játék"...
          </p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p style={{ marginBottom: 24, color: 'var(--text-muted)' }}>
            {results.length} termék találat
          </p>
          <div className="content">
            {results.map((product) => (
              <div key={product.id} className="box">
                <img src={product.fo_kep} alt={product.nev} loading="lazy" />
                <h2>{product.nev}</h2>
                <p>{product.rovid_leiras}</p>
                <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)', margin: '8px 0' }}>
                  {(product.akcios_ar || product.ar).toLocaleString('hu-HU')} Ft
                </p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, padding: '0 20px' }}>
                  <input
                    type="number"
                    min="1"
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    style={{ width: 70, padding: '8px', borderRadius: 8, border: '2px solid rgba(15,23,42,0.1)', textAlign: 'center' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>db</span>
                </div>
                <button
                  onClick={() => handleAddToCart({
                    id: product.id,
                    name: product.nev,
                    price: product.akcios_ar || product.ar,
                    img: product.fo_kep
                  })}
                  style={{ background: addedItems[product.id] ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined }}
                >
                  {addedItems[product.id] ? '✓ Hozzáadva' : 'Kosárba'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
