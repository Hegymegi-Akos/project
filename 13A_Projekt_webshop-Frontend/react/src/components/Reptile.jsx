import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Reptile = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Hüllő Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/reptilefood${params}`}>
            <img src="/kep/hullo.png" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/terrarium${params}`}>
            <img src="/kep/hullok/terrarium.png" alt="Terráriumok" loading="lazy" />
            <h2>Terráriumok & Felszerelések</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reptile;