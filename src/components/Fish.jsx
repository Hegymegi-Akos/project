import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Fish = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Hal Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/fishfood${params}`}>
            <img src="https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=300&fit=crop" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/aquarium${params}`}>
            <img src="https://images.unsplash.com/photo-1520990793132-0457d097d4b8?w=400&h=300&fit=crop" alt="Akváriumok" loading="lazy" />
            <h2>Akváriumok</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Fish;
