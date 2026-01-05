import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reviewsAPI, productsAPI, isAllowedAdminUser } from '../api/apiService';

function Wall() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAllowedAdminUser(user);
  
  const [activeTab, setActiveTab] = useState('wall'); // 'wall' | 'reviews' | 'write'
  
  // Fal state
  const [wallPosts, setWallPosts] = useState([]);
  const [wallLoading, setWallLoading] = useState(false);
  const [wallError, setWallError] = useState('');
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  
  // Vélemények state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  
  // Új vélemény state
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [reviewForm, setReviewForm] = useState({
    termek_id: '',
    ertekeles: 5,
    cim: '',
    velemeny: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Ha nincs bejelentkezve, átirányítás
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fal betöltése
  useEffect(() => {
    if (isAuthenticated && activeTab === 'wall') {
      loadWallPosts();
    }
  }, [isAuthenticated, activeTab]);

  // Vélemények betöltése
  useEffect(() => {
    if (isAuthenticated && activeTab === 'reviews') {
      loadReviews();
    }
  }, [isAuthenticated, activeTab]);

  // Termékek betöltése új véleményhez
  useEffect(() => {
    if (isAuthenticated && activeTab === 'write') {
      loadProducts();
    }
  }, [isAuthenticated, activeTab]);

  const loadWallPosts = async () => {
    setWallLoading(true);
    setWallError('');
    try {
      const data = await reviewsAPI.getWallPosts();
      console.log('Wall posts loaded:', data);
      setWallPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Wall error:', err);
      setWallError(err.message);
    } finally {
      setWallLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    setReviewsError('');
    try {
      const data = await reviewsAPI.getAll();
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      setReviewsError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll(1, 200);
      // Az API {products: [...]} formátumban adja vissza
      const productsList = data.products || data;
      setProducts(Array.isArray(productsList) ? productsList : []);
    } catch (err) {
      console.error('Termékek betöltési hiba', err);
    }
  };

  // Szűrt termékek a keresés alapján
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(p => p.nev?.toLowerCase().includes(q));
  }, [products, productSearch]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    setPosting(true);
    setWallError('');
    try {
      await reviewsAPI.createWallPost(newPost.trim());
      setNewPost('');
      loadWallPosts();
    } catch (err) {
      setWallError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Biztosan törlöd ezt a bejegyzést?')) return;
    
    try {
      await reviewsAPI.deleteWallPost(postId);
      setWallPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      setWallError(err.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Biztosan törlöd ezt a véleményt?')) return;
    
    try {
      await reviewsAPI.deleteReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      setReviewsError(err.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    
    if (!reviewForm.termek_id || !reviewForm.cim.trim() || !reviewForm.velemeny.trim()) {
      setSubmitError('Minden mező kitöltése kötelező!');
      return;
    }
    
    setSubmitting(true);
    try {
      await reviewsAPI.create({
        termek_id: Number(reviewForm.termek_id),
        ertekeles: reviewForm.ertekeles,
        cim: reviewForm.cim.trim(),
        velemeny: reviewForm.velemeny.trim()
      });
      setSubmitSuccess('Vélemény sikeresen elküldve!');
      setReviewForm({ termek_id: '', ertekeles: 5, cim: '', velemeny: '' });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="container page">
        <h1 className="page-title">📝 Vélemények & Fal</h1>
        <section className="ui-card">
          <p className="kezdolapp">Az oldal megtekintéséhez be kell jelentkezned.</p>
          <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: 12 }}>
            Bejelentkezés
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">📝 Vélemények & Fal</h1>

      {/* Fülek */}
      <nav style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('wall')}
          className={activeTab === 'wall' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 20px' }}
        >
          💬 Fal
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={activeTab === 'reviews' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 20px' }}
        >
          ⭐ Vélemények
        </button>
        <button
          onClick={() => setActiveTab('write')}
          className={activeTab === 'write' ? 'btn-primary' : 'btn-secondary'}
          style={{ padding: '10px 20px' }}
        >
          ✍️ Új vélemény
        </button>
      </nav>

      {/* FAL TAB */}
      {activeTab === 'wall' && (
        <section className="ui-card">
          <h2 className="section-title" style={{ marginTop: 0 }}>💬 Közösségi Fal</h2>
          <p className="kezdolapp" style={{ marginTop: 0 }}>Írj üzenetet a közösségnek!</p>

          {/* Új bejegyzés form */}
          <form onSubmit={handlePostSubmit} style={{ marginBottom: 20 }}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Mi jár a fejedben? Oszd meg a közösséggel..."
              maxLength={1000}
              style={{
                width: '100%',
                minHeight: 80,
                padding: 12,
                borderRadius: 8,
                border: '1px solid #d1d5db',
                marginBottom: 8,
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#666' }}>{newPost.length}/1000</span>
              <button
                type="submit"
                className="btn-primary"
                disabled={posting || !newPost.trim()}
                style={{ padding: '10px 20px' }}
              >
                {posting ? 'Küldés...' : '📤 Közzététel'}
              </button>
            </div>
          </form>

          {wallError && (
            <div style={{ color: '#ef4444', marginBottom: 12 }}>❌ {wallError}</div>
          )}

          {/* Bejegyzések */}
          {wallLoading ? (
            <p>Betöltés...</p>
          ) : wallPosts.length === 0 ? (
            <p className="kezdolapp">Még nincsenek bejegyzések. Légy te az első!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {wallPosts.map(post => (
                <div
                  key={post.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.03)',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong>{post.felhasznalonev || `${post.vezeteknev || ''} ${post.keresztnev || ''}`.trim() || 'Felhasználó'}</strong>
                      <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                        {new Date(post.letrehozva).toLocaleString('hu-HU')}
                      </span>
                    </div>
                    {(user?.id === post.felhasznalo_id || user?.admin) && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 16,
                          padding: 4
                        }}
                        title="Törlés"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <p style={{ marginTop: 8, marginBottom: 0, whiteSpace: 'pre-wrap' }}>{post.szoveg}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VÉLEMÉNYEK TAB */}
      {activeTab === 'reviews' && (
        <section className="ui-card">
          <h2 className="section-title" style={{ marginTop: 0 }}>⭐ Termék Vélemények</h2>
          <p className="kezdolapp" style={{ marginTop: 0 }}>Az összes vélemény a termékekről</p>

          {reviewsError && (
            <div style={{ color: '#ef4444', marginBottom: 12 }}>❌ {reviewsError}</div>
          )}

          {reviewsLoading ? (
            <p>Betöltés...</p>
          ) : reviews.length === 0 ? (
            <p className="kezdolapp">Még nincsenek vélemények.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(review => (
                <div
                  key={review.id}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(59, 130, 246, 0.03)',
                    border: '1px solid rgba(59, 130, 246, 0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <strong>{review.cim}</strong>
                      <div style={{ color: '#f59e0b', fontSize: 14 }}>
                        {'★'.repeat(review.ertekeles)}{'☆'.repeat(5 - review.ertekeles)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ textAlign: 'right', fontSize: 12, color: '#666' }}>
                        <div>{review.termek_nev || `Termék #${review.termek_id}`}</div>
                        <div>{review.felhasznalonev || review.vendeg_nev || 'Névtelen'}</div>
                        <div>{new Date(review.datum).toLocaleDateString('hu-HU')}</div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: 6,
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: 12
                          }}
                          title="Vélemény törlése"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ marginTop: 8, marginBottom: 0 }}>{review.velemeny}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ÚJ VÉLEMÉNY TAB */}
      {activeTab === 'write' && (
        <section className="ui-card">
          <h2 className="section-title" style={{ marginTop: 0 }}>✍️ Új Vélemény Írása</h2>
          <p className="kezdolapp" style={{ marginTop: 0 }}>Értékeld a megvásárolt terméket!</p>

          {submitError && (
            <div style={{ color: '#ef4444', marginBottom: 12, padding: 12, background: '#fef2f2', borderRadius: 8 }}>
              ❌ {submitError}
            </div>
          )}
          {submitSuccess && (
            <div style={{ color: '#22c55e', marginBottom: 12, padding: 12, background: '#f0fdf4', borderRadius: 8 }}>
              ✅ {submitSuccess}
            </div>
          )}

          <form onSubmit={handleReviewSubmit}>
            {/* Termék választó keresővel */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Termék keresése</label>
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="🔍 Írd be a termék nevét..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  marginBottom: 8
                }}
              />
              <select
                value={reviewForm.termek_id}
                onChange={(e) => setReviewForm(prev => ({ ...prev, termek_id: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db'
                }}
                size={5}
              >
                <option value="">-- Válassz terméket ({filteredProducts.length} találat) --</option>
                {filteredProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.nev} - {Number(p.ar).toLocaleString('hu-HU')} Ft</option>
                ))}
              </select>
              {reviewForm.termek_id && (
                <div style={{ marginTop: 8, padding: 8, background: '#e0f2fe', borderRadius: 6, fontSize: 14 }}>
                  ✅ Kiválasztva: <strong>{products.find(p => p.id == reviewForm.termek_id)?.nev}</strong>
                </div>
              )}
            </div>

            {/* Értékelés */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Értékelés</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, ertekeles: star }))}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 28,
                      cursor: 'pointer',
                      color: star <= reviewForm.ertekeles ? '#f59e0b' : '#d1d5db'
                    }}
                  >
                    ★
                  </button>
                ))}
                <span style={{ marginLeft: 8, alignSelf: 'center' }}>{reviewForm.ertekeles}/5</span>
              </div>
            </div>

            {/* Cím */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Vélemény címe</label>
              <input
                type="text"
                value={reviewForm.cim}
                onChange={(e) => setReviewForm(prev => ({ ...prev, cim: e.target.value }))}
                placeholder="pl. Kiváló minőség!"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db'
                }}
              />
            </div>

            {/* Vélemény */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 6 }}>Vélemény</label>
              <textarea
                value={reviewForm.velemeny}
                onChange={(e) => setReviewForm(prev => ({ ...prev, velemeny: e.target.value }))}
                placeholder="Írd le részletesen a tapasztalataidat..."
                maxLength={2000}
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ padding: '12px 24px' }}
            >
              {submitting ? 'Küldés...' : '📤 Vélemény Beküldése'}
            </button>
          </form>
        </section>
      )}
    </main>
  );
}

export default Wall;
