import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { adminUsersAPI, isAllowedAdminUser } from '../api/apiService';
import { useAuth } from '../context/AuthContext';

function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = useMemo(() => isAuthenticated && isAllowedAdminUser(user), [isAuthenticated, user]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Admin secret automatikus beállítása
  useEffect(() => {
    if (isAdmin && !sessionStorage.getItem('adminSecret')) {
      sessionStorage.setItem('adminSecret', 'Admin123');
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUsersAPI.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Szűrt felhasználók a keresés alapján
  const filteredUsers = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(u =>
      u.id?.toString().includes(q) ||
      u.felhasznalonev?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.keresztnev?.toLowerCase().includes(q) ||
      u.vezeteknev?.toLowerCase().includes(q) ||
      u.varos?.toLowerCase().includes(q)
    );
  }, [users, query]);

  // Ha nincs bejelentkezve vagy nem admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="container page">
        <h1 className="page-title">👥 Felhasználók</h1>
        <section className="ui-card">
          <p className="kezdolapp">Nincs jogosultságod ehhez az oldalhoz.</p>
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="container page">
        <h1 className="page-title">👥 Felhasználók</h1>
        <p>Betöltés...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page">
        <h1 className="page-title">👥 Felhasználók</h1>
        <div className="alert alert-danger">❌ {error}</div>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">👥 Felhasználók</h1>

      {/* Navigációs fülek */}
      <nav style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Link to="/admin" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          🏠 Admin
        </Link>
        <Link to="/admin/products" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          📦 Termékek
        </Link>
        <Link to="/admin/users" className="btn-primary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          👥 Felhasználók
        </Link>
        <Link to="/orders" className="btn-secondary" style={{ padding: '8px 16px', textDecoration: 'none' }}>
          📋 Rendelések
        </Link>
      </nav>

      {/* Kereső */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="🔍 Keresés (ID, név, email, város...)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '10px 14px',
            fontSize: '1rem',
            border: '1px solid #ccc',
            borderRadius: 6
          }}
        />
      </div>

      <p style={{ marginBottom: 12 }}>
        Összesen: <strong>{users.length}</strong> felhasználó
        {query && ` | Szűrve: ${filteredUsers.length}`}
      </p>
      
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Felhasználónév</th>
              <th>Email</th>
              <th>Név</th>
              <th>Telefon</th>
              <th>Város</th>
              <th>Admin</th>
              <th>Regisztrált</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id}>
                <td><strong>{u.id}</strong></td>
                <td>{u.felhasznalonev}</td>
                <td>{u.email}</td>
                <td>{u.vezeteknev} {u.keresztnev}</td>
                <td>{u.telefon || '-'}</td>
                <td>{u.varos || '-'}</td>
                <td>
                  {u.admin ? (
                    <span className="badge bg-success">Admin</span>
                  ) : (
                    <span className="badge bg-secondary">Felhasználó</span>
                  )}
                </td>
                <td>{new Date(u.regisztralt).toLocaleDateString('hu-HU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default AdminUsers;
