import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Bird = () => {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const params = queryString ? `?${queryString}` : '';

  return (
    <div className="container">
      <h1 className="page-title" style={{ marginTop: 32 }}>Madár Termékek</h1>
      <div className="content">
        <div className="box">
          <Link to={`/birdfood${params}`}>
            <img src="https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop" alt="Tápok" loading="lazy" />
            <h2>Tápok</h2>
          </Link>
        </div>
        <div className="box">
          <Link to={`/birdcage${params}`}>
            <img src="https://images.unsplash.com/photo-1609682936763-7e9992b6e6d8?w=400&h=300&fit=crop" alt="Kalitkák" loading="lazy" />
            <h2>Kalitkák</h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Bird;
