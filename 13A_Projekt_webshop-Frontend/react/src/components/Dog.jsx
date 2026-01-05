import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Dog = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Kutya Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/leash${params}`}>
            <img src="/kep/kutya/poraz.png" alt="Pórázak" loading="lazy" />
            <h2>Pórázak</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/dogbowl${params}`}>
            <img src="/kep/kutya/tal.png" alt="Tálak" loading="lazy" />
            <h2>Tálak</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/dogharness${params}`}>
            <img src="/kep/kutya/ham.png" alt="Hámok" loading="lazy" />
            <h2>Hámok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/flea${params}`}>
            <img src="/kep/kutya/bolha.png" alt="Bolhaírtó szerek" loading="lazy" />
            <h2>Bolhaírtó szerek</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/collar${params}`}>
            <img src="/kep/kutya/nyakorv.png" alt="Nyakörvek" loading="lazy" />
            <h2>Nyakörvek</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/dogfood${params}`}>
            <img src="/kep/kutya/tap.png" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dog;