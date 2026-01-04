import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAllowedAdminUser } from '../api/apiService';

const Card = ({ title, description, actionLabel, onAction }) => (
  <div
    className="ui-card"
    style={{
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      height: '100%'
    }}
  >
    <div>
      <h2 className="section-title" style={{ marginBottom: 6 }}>{title}</h2>
      <p className="kezdolapp" style={{ margin: 0 }}>{description}</p>
    </div>
    <button
      type="button"
      className="btn-primary"
      onClick={onAction}
      style={{ marginTop: 'auto', alignSelf: 'flex-start', padding: '10px 14px' }}
    >
      {actionLabel}
    </button>
  </div>
);

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = useMemo(() => isAuthenticated && isAllowedAdminUser(user), [isAuthenticated, user]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="container page">
        <h1 className="page-title">Admin</h1>
        <section className="ui-card">
          <p className="kezdolapp">Nincs jogosultságod ehhez az oldalhoz.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="container page">
      <h1 className="page-title">Admin</h1>
      <p className="kezdolapp" style={{ marginTop: 0 }}>Termékek és számlák kezelése külön felületen.</p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <Card
          title="Termékek kezelése"
          description="Listázás, létrehozás, szerkesztés vagy törlés az admin API-n keresztül."
          actionLabel="Megnyitás"
          onAction={() => navigate('/admin/products')}
        />
        <Card
          title="Felhasználók"
          description="Regisztrált felhasználók listázása ID-val, email címmel és egyéb adatokkal."
          actionLabel="Megnyitás"
          onAction={() => navigate('/admin/users')}
        />
        <Card
          title="Kuponok kezelése"
          description="Kuponkódok létrehozása, szerkesztése, törlése és statisztikák megtekintése."
          actionLabel="Megnyitás"
          onAction={() => navigate('/admin/coupons')}
        />
        <Card
          title="Rendelések / Számlák"
          description="Admin rendelések és számlák elérése a korábbi oldalról."
          actionLabel="Megnyitás"
          onAction={() => navigate('/orders')}
        />
      </div>
    </main>
  );
};

export default Admin;
