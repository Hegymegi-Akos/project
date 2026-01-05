import React, { useEffect, useState } from 'react';
import '../styles/gallery.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/kep/manifest.json')
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load image manifest', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Betöltés...</p>;
  if (!images.length) return <p>Nincs kép.</p>;

  return (
    <div className="gallery-grid container">
      {images.map((src, i) => (
        <div key={i} className="gallery-item">
          <img src={src} alt={`kep-${i}`} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
