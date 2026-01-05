import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Cat = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Macska Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/cattoy${params}`}>
            <img src="/kep/macska/jatek.png" alt="Játékok" loading="lazy" />
            <h2>Játékok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/catfood${params}`}>
            <img src="/kep/macska/tap.png" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cat;