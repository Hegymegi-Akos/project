import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Rodent = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Rágcsáló Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/rodentfood${params}`}>
            <img src="/kep/ragcsalok/horcsog.png" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/rodentcage${params}`}>
            <img src="/kep/ragcsalok/tengerimalac.png" alt="Ketrecek" loading="lazy" />
            <h2>Ketrecek & Felszerelések</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Rodent;